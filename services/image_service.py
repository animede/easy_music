"""
Playback background image generation service.

参照実装: animede/momo_song-v3
- LLMで楽曲世界観から画像プロンプトを生成
- 画像生成サーバに問い合わせ
- 生成画像をローカルキャッシュして再利用
"""
from __future__ import annotations

import asyncio
import base64
import hashlib
import io
import ipaddress
import json
import logging
import pickle
import re
import time
from pathlib import Path
from typing import Any, Dict
from urllib.parse import urlparse

import httpx

from config import settings
from services.llm_service import llm_service

logger = logging.getLogger(__name__)

DEFAULT_IMAGE_NEGATIVE_PROMPT = (
    "worst quality, low quality, blurry, lowres, noisy, grainy, jpeg artifacts, watermark, logo, text, signature, "
    "deformed, ugly, duplicate, oversaturated, washed out, flat lighting, cropped, close-up portrait, centered face"
)

IMAGE_PROMPT_SYSTEM = """You create SDXL prompts for music playback background images.

Return ONLY JSON with exactly these keys:
{"prompt":"...","prompt_2":"...","negative_prompt":"...","negative_prompt_2":"..."}

Rules:
- Write in English only
- The image should visualize the song world, atmosphere, scenery, lighting, and mood
- Prefer wide cinematic composition suitable for a music player background
- Do NOT make a single character dominate the center of the frame
- Avoid readable text, logo, watermark, UI, album cover typography
- `prompt` should describe scenery/world/lighting/composition
- `prompt_2` may optionally add minor character or extra scene detail, but keep it subtle
- `negative_prompt` must include artifacts to avoid
- `negative_prompt_2` may be empty
- Include "masterpiece" and "best quality" in `prompt`
- Add fine-grained visual detail: texture, reflections, atmospheric depth, material surfaces, lighting transitions
- Prefer vivid but natural light, crisp detail, and strong foreground/midground/background separation
- Avoid generic short prompts; produce a dense, concrete SDXL-ready scene description
- The genre must meaningfully affect the visual design, era cues, palette, architecture, props, and atmosphere
"""

GENRE_VISUAL_HINTS: Dict[str, str] = {
    "city pop": "1980s Japanese urban nightscape, neon reflections, coastal highway, retro storefront glow, summer breeze",
    "j-pop": "polished contemporary Japanese pop visuals, bright cinematic lighting, youthful urban or seasonal scenery",
    "rock": "dramatic night streets, stage-like lighting, bold contrast, rebellious urban atmosphere",
    "jazz": "late-night lounge mood, amber lighting, intimate city corners, rain reflections, sophisticated atmosphere",
    "lo-fi": "soft analog mood, bedroom-city window view, dusty light, cassette-era texture, quiet night ambience",
    "electronic": "futuristic city glow, digital light trails, sleek geometry, cyber atmosphere",
    "anime song": "cinematic sky, emotionally heightened scenery, luminous horizon, dynamic fantasy atmosphere",
    "enka": "traditional Japanese townscape, lantern light, mist, riverbank or harbor at dusk, nostalgic melancholy",
    "bossa nova": "sunlit cafe terrace, coastal calm, soft tropical shadows, relaxed elegant atmosphere",
    "folk": "natural landscape, warm dusk light, rural path, handmade organic textures",
    "edm": "festival-scale lighting, energetic neon atmosphere, high-contrast nightscape, kinetic glow",
}


class ImageService:
    """音楽再生用背景画像生成サービス"""

    def __init__(self) -> None:
        self.cache_dir = Path(__file__).resolve().parent.parent / "generated_backgrounds"
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self._server_health: dict[str, dict[str, Any]] = {}
        self._health_check_task: asyncio.Task | None = None

    def start_health_check_task(self) -> None:
        """画像サーバの定期ヘルスチェックを開始する。"""
        if self._health_check_task and not self._health_check_task.done():
            return
        self._health_check_task = asyncio.create_task(self._health_check_loop())

    async def stop_health_check_task(self) -> None:
        """定期ヘルスチェックを停止する。"""
        if not self._health_check_task:
            return
        self._health_check_task.cancel()
        try:
            await self._health_check_task
        except asyncio.CancelledError:
            pass
        self._health_check_task = None

    def get_cached_image_path(self, image_id: str) -> Path | None:
        path = self.cache_dir / f"{self._sanitize_image_id(image_id)}.png"
        return path if path.exists() else None

    async def generate_background_image(
        self,
        *,
        task_id: str = "",
        genre: str = "",
        theme: str = "",
        caption: str = "",
        lyrics: str = "",
        omakase_query: str = "",
        width: int = 1296,
        height: int = 728,
    ) -> Dict[str, Any]:
        width = self._normalize_size(width, default=1296)
        height = self._normalize_size(height, default=728)

        prompt_bundle = await self._build_prompt_bundle(
            genre=genre,
            theme=theme,
            caption=caption,
            lyrics=lyrics,
            omakase_query=omakase_query,
        )

        image_id = self._make_image_id(
            task_id=task_id,
            prompt=prompt_bundle.get("prompt", ""),
            prompt_2=prompt_bundle.get("prompt_2", ""),
            width=width,
            height=height,
        )
        out_path = self.cache_dir / f"{image_id}.png"

        if out_path.exists():
            return {
                "image_id": image_id,
                "image_url": f"/api/background_image/{image_id}",
                "prompt": prompt_bundle.get("prompt", ""),
                "cached": True,
            }

        image_bytes = await self._request_image(prompt_bundle, width=width, height=height)
        out_path.write_bytes(image_bytes)

        return {
            "image_id": image_id,
            "image_url": f"/api/background_image/{image_id}",
            "prompt": prompt_bundle.get("prompt", ""),
            "cached": False,
        }

    async def _build_prompt_bundle(
        self,
        *,
        genre: str,
        theme: str,
        caption: str,
        lyrics: str,
        omakase_query: str,
    ) -> Dict[str, str]:
        source_text = self._build_source_text(
            genre=genre,
            theme=theme,
            caption=caption,
            lyrics=lyrics,
            omakase_query=omakase_query,
        )
        fallback_prompt = self._build_fallback_prompt(
            genre=genre,
            theme=theme,
            caption=caption,
            lyrics=lyrics,
            omakase_query=omakase_query,
        )

        try:
            response = await llm_service.chat(
                user_message=source_text,
                system_prompt=IMAGE_PROMPT_SYSTEM,
                max_tokens=500,
                temperature=0.7,
            )
            data = self._extract_json(response)
        except Exception as e:
            logger.warning("Image prompt generation failed, using fallback: %s", e)
            data = {}

        prompt = self._sanitize_prompt_text(data.get("prompt") or fallback_prompt)
        prompt_2 = self._sanitize_prompt_text(data.get("prompt_2", ""))
        negative_prompt = self._sanitize_prompt_text(
            data.get("negative_prompt") or DEFAULT_IMAGE_NEGATIVE_PROMPT
        )
        negative_prompt_2 = self._sanitize_prompt_text(data.get("negative_prompt_2", ""))

        return {
            "prompt": prompt,
            "prompt_2": prompt_2,
            "negative_prompt": negative_prompt,
            "negative_prompt_2": negative_prompt_2,
        }

    def _build_source_text(
        self,
        *,
        genre: str,
        theme: str,
        caption: str,
        lyrics: str,
        omakase_query: str,
    ) -> str:
        genre_hint = self._get_genre_visual_hint(genre)
        lyric_lines = []
        for line in (lyrics or "").splitlines():
            s = line.strip()
            if not s or s.startswith("["):
                continue
            lyric_lines.append(s)
            if len(lyric_lines) >= 4:
                break

        parts = [
            f"Genre: {genre}" if genre else "",
            f"Genre visual cues: {genre_hint}" if genre_hint else "",
            f"Theme: {theme}" if theme else "",
            f"Caption: {caption}" if caption else "",
            f"Quick generate request: {omakase_query}" if omakase_query else "",
            f"Lyrics excerpt: {' / '.join(lyric_lines)}" if lyric_lines else "",
            "Create a scenic playback background image prompt for this song.",
        ]
        return "\n".join(p for p in parts if p)

    def _build_fallback_prompt(
        self,
        *,
        genre: str,
        theme: str,
        caption: str,
        lyrics: str,
        omakase_query: str,
    ) -> str:
        genre_hint = self._get_genre_visual_hint(genre)
        lyric_lines = []
        for line in (lyrics or "").splitlines():
            s = line.strip()
            if not s or s.startswith("["):
                continue
            lyric_lines.append(s)
            if len(lyric_lines) >= 2:
                break

        detail_parts = [genre, genre_hint, theme, caption, omakase_query, " / ".join(lyric_lines)]
        detail_text = ", ".join(p for p in detail_parts if p)
        detail_text = re.sub(r"\s+", " ", detail_text).strip()[:220]

        prompt = (
            "masterpiece, best quality, ultra detailed, cinematic wide composition, atmospheric music playback background, "
            "rich environmental detail, crisp textures, expressive lighting, layered depth, scenic storytelling, detailed reflections"
        )
        if detail_text:
            prompt += ", " + detail_text
        prompt += ", vibrant but natural colors, fine detail, no centered main character, no text"
        return prompt

    def _get_genre_visual_hint(self, genre: str) -> str:
        genre_key = (genre or "").strip().lower()
        if not genre_key:
            return ""

        if genre_key in GENRE_VISUAL_HINTS:
            return GENRE_VISUAL_HINTS[genre_key]

        for key, hint in GENRE_VISUAL_HINTS.items():
            if key in genre_key or genre_key in key:
                return hint

        return ""

    async def _request_image(self, prompt_bundle: Dict[str, str], *, width: int, height: int) -> bytes:
        errors = []

        for base_url in self._candidate_base_urls():
            if not await self._is_base_url_reachable(base_url):
                errors.append(f"{base_url}: unreachable")
                continue

            try:
                image_bytes = await self._request_generate_endpoint(base_url, prompt_bundle, width, height)
                self._set_base_url_health(base_url, True, detail="/generate/: ok")
                return image_bytes
            except Exception as e:
                self._record_endpoint_failure(base_url, "/generate/", e)
                errors.append(f"{base_url}/generate/: {e}")

            try:
                image_bytes = await self._request_text2image_endpoint(base_url, prompt_bundle, width, height)
                self._set_base_url_health(base_url, True, detail="/text2image: ok")
                return image_bytes
            except Exception as e:
                self._record_endpoint_failure(base_url, "/text2image", e)
                errors.append(f"{base_url}/text2image: {e}")

        raise RuntimeError("Image generation failed: " + " | ".join(errors[-4:]))

    def _candidate_base_urls(self) -> list[str]:
        raw_url = self._normalize_base_url(settings.image_generation_url)
        public_url = self._normalize_base_url(settings.image_generation_fallback_url)

        parsed = urlparse(raw_url)
        candidates = []
        if parsed.hostname and parsed.port is None and (not parsed.path or parsed.path == "/"):
            candidates.append(f"{parsed.scheme}://{parsed.hostname}:64656")
        candidates.append(raw_url)
        if public_url not in candidates:
            candidates.append(public_url)

        unique = []
        for candidate in candidates:
            if candidate not in unique:
                unique.append(candidate)
        return unique

    def _normalize_base_url(self, raw_url: str) -> str:
        base_url = (raw_url or "").rstrip("/")
        if not base_url.startswith("http://") and not base_url.startswith("https://"):
            base_url = "http://" + base_url
        return base_url

    async def _is_base_url_reachable(self, base_url: str) -> bool:
        cached = self._server_health.get(base_url)
        if cached is not None:
            if not cached.get("reachable"):
                checked_at = float(cached.get("checked_at") or 0)
                retry_after = max(5.0, float(settings.image_generation_health_check_interval))
                if time.time() - checked_at >= retry_after:
                    return await self._probe_base_url(base_url)
            return bool(cached.get("reachable"))

        return await self._probe_base_url(base_url)

    async def _probe_base_url(self, base_url: str) -> bool:
        parsed = urlparse(base_url)
        host = parsed.hostname or ""
        timeout = min(5.0, float(settings.image_generation_timeout))

        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.get(f"{base_url}/")
                self._set_base_url_health(base_url, True, detail=f"status={response.status_code}")
                return True
        except Exception as e:
            host_type = "private" if self._is_private_host(host) else "public"
            self._set_base_url_health(base_url, False, detail=f"{host_type}: {e}")
            return False

    def _set_base_url_health(self, base_url: str, reachable: bool, *, detail: str = "") -> None:
        previous = self._server_health.get(base_url)
        previous_reachable = None if previous is None else bool(previous.get("reachable"))
        self._server_health[base_url] = {
            "reachable": reachable,
            "detail": detail,
            "checked_at": time.time(),
        }

        if previous_reachable != reachable:
            level = logger.info if reachable else logger.warning
            level(
                "Image server %s: %s%s",
                "recovered" if reachable else "unreachable",
                base_url,
                f" ({detail})" if detail else "",
            )

    def _record_endpoint_failure(self, base_url: str, endpoint: str, exc: Exception) -> None:
        """
        エンドポイント単位の失敗を記録する。

        画像サーバによっては /generate/ が 404 で /text2image だけ使える構成がある。
        そのような通常のHTTP応答や生成失敗までベースURL全体の到達不能として扱うと、
        次回以降のJUKEBOX背景生成がヘルスチェック更新までスキップされるため、
        接続不能系の例外だけ unreachable にする。
        """
        if isinstance(exc, (httpx.ConnectError, httpx.ConnectTimeout, httpx.NetworkError)):
            self._set_base_url_health(base_url, False, detail=f"{endpoint}: {exc}")
            return

        logger.warning("Image endpoint failed but server is reachable: %s%s (%s)", base_url, endpoint, exc)
        self._set_base_url_health(base_url, True, detail=f"{endpoint}: endpoint failed")

    async def _health_check_loop(self) -> None:
        """候補画像サーバのヘルスを定期更新する。"""
        while True:
            for base_url in self._candidate_base_urls():
                try:
                    await self._probe_base_url(base_url)
                except Exception as e:
                    logger.warning("Image health check failed for %s: %s", base_url, e)
            await asyncio.sleep(max(5.0, float(settings.image_generation_health_check_interval)))

    def _is_private_host(self, host: str) -> bool:
        lowered = (host or "").strip().lower()
        if lowered in {"localhost", "127.0.0.1", "::1"}:
            return True

        try:
            return ipaddress.ip_address(lowered).is_private
        except ValueError:
            return lowered.endswith(".local")

    async def _request_generate_endpoint(
        self,
        base_url: str,
        prompt_bundle: Dict[str, str],
        width: int,
        height: int,
    ) -> bytes:
        data = {
            "pipeline": "t2i",
            "prompt": prompt_bundle["prompt"],
            "prompt_2": prompt_bundle.get("prompt_2", ""),
            "negative_prompt": prompt_bundle.get("negative_prompt", ""),
            "negative_prompt_2": prompt_bundle.get("negative_prompt_2", ""),
            "freeu": "false",
            "num_inference_steps": "28",
            "guidance_scale": "8.5",
            "auto_seed": "true",
            "width": str(width),
            "height": str(height),
        }

        async with httpx.AsyncClient(timeout=settings.image_generation_timeout) as client:
            response = await client.post(f"{base_url}/generate/", data=data)
            response.raise_for_status()
            return self._decode_image_response(response)

    async def _request_text2image_endpoint(
        self,
        base_url: str,
        prompt_bundle: Dict[str, str],
        width: int,
        height: int,
    ) -> bytes:
        prompt = prompt_bundle["prompt"]
        if prompt_bundle.get("prompt_2"):
            prompt = f"{prompt}, {prompt_bundle['prompt_2']}"

        negative = prompt_bundle.get("negative_prompt", "")
        if prompt_bundle.get("negative_prompt_2"):
            negative = f"{negative}, {prompt_bundle['negative_prompt_2']}".strip(", ")

        payload = {
            "prompt": prompt,
            "negative_prompt": negative,
            "width": width,
            "height": height,
            "steps": 28,
            "cfg_scale": 8.5,
            "seed": -1,
        }

        async with httpx.AsyncClient(timeout=settings.image_generation_timeout) as client:
            response = await client.post(f"{base_url}/text2image", json=payload)
            response.raise_for_status()
            return self._decode_json_image_response(response)

    def _decode_image_response(self, response: httpx.Response) -> bytes:
        content = response.content
        content_type = response.headers.get("content-type", "").lower()

        if content.startswith(b"\x89PNG") or content.startswith(b"\xff\xd8\xff"):
            return content

        if "application/json" in content_type:
            return self._decode_json_image_response(response)

        try:
            obj = pickle.loads(content)
            return self._image_object_to_png_bytes(obj)
        except Exception as e:
            raise RuntimeError(f"Unsupported /generate/ response: {e}") from e

    def _decode_json_image_response(self, response: httpx.Response) -> bytes:
        data = response.json()
        images = data.get("images") or data.get("data") or []
        if not images:
            raise RuntimeError("No image data in response")

        image_value = images[0]
        if isinstance(image_value, str):
            if image_value.startswith("data:image"):
                image_value = image_value.split(",", 1)[1]
            return base64.b64decode(image_value)

        raise RuntimeError("Unsupported image payload type")

    def _image_object_to_png_bytes(self, obj: Any) -> bytes:
        from PIL import Image

        if isinstance(obj, list) and obj:
            obj = obj[0]

        if isinstance(obj, Image.Image):
            buf = io.BytesIO()
            obj.save(buf, format="PNG")
            return buf.getvalue()

        if isinstance(obj, (bytes, bytearray)):
            raw = bytes(obj)
            if raw.startswith(b"\x89PNG") or raw.startswith(b"\xff\xd8\xff"):
                return raw

        raise RuntimeError(f"Unsupported pickled image object: {type(obj)!r}")

    def _extract_json(self, text: str) -> Dict[str, Any]:
        cleaned = (text or "").strip()
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```[a-zA-Z0-9_+-]*\n", "", cleaned)
            cleaned = re.sub(r"\n```$", "", cleaned)

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if not match:
                raise
            return json.loads(match.group(0))

    def _sanitize_prompt_text(self, text: str) -> str:
        text = (text or "").replace("`", " ")
        text = re.sub(r"[\r\n]+", " ", text)
        text = re.sub(r"\s{2,}", " ", text).strip()
        return text[:600]

    def _normalize_size(self, value: int, *, default: int) -> int:
        try:
            value = int(value)
        except Exception:
            value = default
        value = max(512, min(1536, value))
        return value - (value % 8)

    def _make_image_id(self, *, task_id: str, prompt: str, prompt_2: str, width: int, height: int) -> str:
        if task_id:
            return self._sanitize_image_id(task_id)

        digest = hashlib.sha1(f"{prompt}|{prompt_2}|{width}|{height}".encode("utf-8")).hexdigest()
        return digest[:20]

    def _sanitize_image_id(self, image_id: str) -> str:
        sanitized = re.sub(r"[^a-zA-Z0-9_-]", "_", image_id or "bg")
        return sanitized[:120] or "bg"


image_service = ImageService()