"""
音楽生成エンドポイント
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import asyncio
import logging
import re
import httpx

from services.ace_step_client import ace_step_client, TaskResult, SUPPORTED_LANGUAGES, SUPPORTED_KEY_SCALES
from config import settings

router = APIRouter(prefix="/api", tags=["generate"])


# =============================================================================
# Caption Sanitizer — ACE-Step 1.5 制約に合わせる
# =============================================================================

def sanitize_caption(text: str) -> str:
    """
    ACE-Step 1.5 API に安全に送る前にキャプションをサニタイズ。
    
    制約 (acestep/handler.py, constrained_logits_processor.py):
    - text_encoder max_length = 256 tokens
    - constrained decoder: caption < 512 tokens
    - バッククォート禁止
    - 改行は避ける（YAML値としてパースされる）
    - ピリオドで終わるのが理想的
    """
    if not text:
        return text
    # バッククォート除去
    text = text.replace('`', '')
    # 改行→スペース
    text = re.sub(r'[\n\r]+', ' ', text)
    # 制御文字除去
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    # Markdown記法除去
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    # 連続スペース整理
    text = re.sub(r'\s{2,}', ' ', text).strip()
    # 480文字制限（安全マージン）
    if len(text) > 480:
        cut = text[:480].rfind('. ')
        if cut > 200:
            text = text[:cut + 1]
        else:
            text = text[:480].rstrip()
            last_space = text.rfind(' ')
            if last_space > 200:
                text = text[:last_space]
    # ピリオド終端
    if text and not text.endswith('.'):
        text = text.rstrip(',;:') + '.'
    return text


# =============================================================================
# Request/Response Models
# =============================================================================

class GenerateRequest(BaseModel):
    """音楽生成リクエスト"""
    prompt: str = Field(default="", description="音楽の説明（ジャンル、楽器、雰囲気など）")
    lyrics: str = Field(default="", description="歌詞（構造タグ付き）")
    thinking: bool = Field(default=True, description="LMで高品質生成")
    model: Optional[str] = Field(default=None, description="モデル名（省略時はサーバーデフォルト）")
    vocal_language: str = Field(default="ja", description="歌詞言語")
    audio_duration: int = Field(default=60, ge=10, le=300, description="生成時間（秒）")
    bpm: Optional[int] = Field(default=None, ge=30, le=300, description="テンポ")
    key_scale: Optional[str] = Field(default=None, description="調")
    time_signature: str = Field(default="4", description="拍子")
    batch_size: int = Field(default=1, ge=1, le=4, description="バッチサイズ")
    audio_format: str = Field(default="mp3", description="出力形式")
    seed: Optional[int] = Field(default=None, description="シード値")
    inference_steps: int = Field(default=150, ge=1, le=200, description="推論ステップ数")
    guidance_scale: float = Field(default=3.0, ge=0.0, le=20.0, description="CFGスケール")
    # LM パラメータ
    lm_temperature: Optional[float] = Field(default=None, ge=0.0, le=2.0, description="LM温度")
    lm_cfg_scale: Optional[float] = Field(default=None, ge=0.0, le=20.0, description="LM CFGスケール")
    lm_top_p: Optional[float] = Field(default=None, ge=0.0, le=1.0, description="LM Top-P")
    use_cot_caption: Optional[bool] = Field(default=None, description="CoTキャプション使用")
    use_cot_language: Optional[bool] = Field(default=None, description="CoT言語判定使用")


class FormatInputRequest(BaseModel):
    """プロンプト強化リクエスト"""
    prompt: str = Field(default="", description="プロンプト")
    lyrics: str = Field(default="", description="歌詞")
    temperature: float = Field(default=0.85, ge=0.0, le=2.0, description="温度")


class GenerateResponse(BaseModel):
    """音楽生成レスポンス"""
    task_id: str
    status: str
    message: str = ""
    queue_position: Optional[int] = None
    seed: Optional[int] = None


class TaskStatusResponse(BaseModel):
    """タスクステータスレスポンス"""
    task_id: str
    status: int  # 0=processing, 1=succeeded, 2=failed
    status_text: str
    progress: Optional[int] = None  # サーバ報告の進捗（0-100）、なければNull
    queue_position: Optional[int] = None
    results: Optional[List[Dict[str, Any]]] = None
    error: Optional[str] = None


class GenerateAndWaitRequest(GenerateRequest):
    """生成して完了を待つリクエスト"""
    timeout: float = Field(default=300.0, description="タイムアウト（秒）")


class GenerateAndWaitResponse(BaseModel):
    """生成完了レスポンス"""
    success: bool
    results: List[Dict[str, Any]] = []
    error: Optional[str] = None


# =============================================================================
# Endpoints
# =============================================================================

@router.post("/generate", response_model=GenerateResponse)
async def generate_music(request: GenerateRequest):
    """
    音楽生成タスクを作成
    
    タスクIDを返し、完了を待たない非同期処理
    """
    try:
        extra_params: Dict[str, Any] = {}
        if request.model:
            extra_params["model"] = request.model
        if request.lm_temperature is not None:
            extra_params["lm_temperature"] = request.lm_temperature
        if request.lm_cfg_scale is not None:
            extra_params["lm_cfg_scale"] = request.lm_cfg_scale
        if request.lm_top_p is not None:
            extra_params["lm_top_p"] = request.lm_top_p
        if request.use_cot_caption is not None:
            extra_params["use_cot_caption"] = request.use_cot_caption
        if request.use_cot_language is not None:
            extra_params["use_cot_language"] = request.use_cot_language

        # seedが未指定の場合はランダム生成して追跡できるようにする
        import random
        effective_seed = request.seed if request.seed is not None else random.randint(0, 2**31 - 1)

        result = await ace_step_client.release_task(
            prompt=sanitize_caption(request.prompt),
            lyrics=request.lyrics,
            thinking=request.thinking,
            vocal_language=request.vocal_language,
            audio_duration=request.audio_duration,
            bpm=request.bpm,
            key_scale=request.key_scale,
            time_signature=request.time_signature,
            batch_size=request.batch_size,
            audio_format=request.audio_format,
            seed=effective_seed,
            inference_steps=request.inference_steps,
            guidance_scale=request.guidance_scale,
            **extra_params
        )
        
        data = result.get("data", {})
        task_id = data.get("task_id", "")
        
        if not task_id:
            raise HTTPException(status_code=500, detail="Failed to create task")
        
        return GenerateResponse(
            task_id=task_id,
            status="queued",
            message="Task created successfully",
            queue_position=data.get("queue_position"),
            seed=effective_seed
        )
    
    except (httpx.ConnectError, httpx.ConnectTimeout) as e:
        logging.getLogger("uvicorn.error").error(
            "ACE-Step API 接続失敗 (%s): %s", settings.ace_step_api_url, e
        )
        raise HTTPException(
            status_code=503,
            detail=f"ACE-Step APIに接続できません ({settings.ace_step_api_url})。"
                   f" --ace-url オプションでACE-Step APIのURLを指定してください。"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{task_id}", response_model=TaskStatusResponse)
async def get_task_status(task_id: str):
    """
    タスクステータスを取得
    
    一時的な接続エラーの場合は processing を返す（ポーリング継続可能）
    """
    try:
        result = await ace_step_client.query_result([task_id])
        
        if result.get("code") != 200:
            # ACE-Step API がエラーを返した場合も processing として扱う
            # （タスク投入直後はまだ認識されていない可能性がある）
            import logging
            logging.getLogger("uvicorn.error").warning(
                "query_result returned code=%s for task %s: %s",
                result.get("code"), task_id, result.get("error", "")
            )
            return TaskStatusResponse(
                task_id=task_id,
                status=0,
                status_text="processing"
            )
        
        data_list = result.get("data", [])
        if not data_list:
            return TaskStatusResponse(
                task_id=task_id,
                status=0,
                status_text="processing"
            )
        
        task_data = data_list[0]
        status = task_data.get("status", 0)
        
        status_map = {0: "processing", 1: "succeeded", 2: "failed"}
        status_text = status_map.get(status, "unknown")
        
        # サーバが進捗を送る場合はそのまま転送（将来対応）
        server_progress = task_data.get("progress")
        queue_position = task_data.get("queue_position")
        
        results = None
        error = None
        
        if status == 1:
            # 成功
            import json
            result_json = task_data.get("result", "[]")
            if isinstance(result_json, str):
                results = json.loads(result_json)
            else:
                results = result_json
            
            # URLを追加
            for r in results:
                if r.get("file"):
                    r["url"] = ace_step_client.get_audio_url(r["file"])
        
        elif status == 2:
            # 失敗 — result が JSON文字列の場合はパースして読みやすいメッセージに
            raw_error = task_data.get("result", "Unknown error")
            if isinstance(raw_error, str):
                try:
                    import json
                    parsed = json.loads(raw_error)
                    if isinstance(parsed, list):
                        error = "生成に失敗しました（サーバーエラー）"
                    elif isinstance(parsed, dict):
                        error = parsed.get("error") or parsed.get("message") or "生成に失敗しました"
                    else:
                        error = str(parsed)
                except (json.JSONDecodeError, TypeError):
                    error = raw_error
            elif isinstance(raw_error, list):
                error = "生成に失敗しました（サーバーエラー）"
            elif isinstance(raw_error, dict):
                error = raw_error.get("error") or raw_error.get("message") or "生成に失敗しました"
            else:
                error = str(raw_error)
        
        return TaskStatusResponse(
            task_id=task_id,
            status=status,
            status_text=status_text,
            progress=server_progress,
            queue_position=queue_position,
            results=results,
            error=error
        )
    
    except HTTPException:
        raise
    except Exception as e:
        # 一時的な接続エラー（httpx.ConnectError等）は processing として返す
        # フロントエンドは次のポーリングで再試行する
        import logging
        logging.getLogger("uvicorn.error").warning(
            "Transient error polling task %s: %s", task_id, e
        )
        return TaskStatusResponse(
            task_id=task_id,
            status=0,
            status_text="processing"
        )


@router.post("/generate_and_wait", response_model=GenerateAndWaitResponse)
async def generate_and_wait(request: GenerateAndWaitRequest):
    """
    音楽を生成し、完了まで待機
    
    同期的に結果を返す
    """
    try:
        extra_params: Dict[str, Any] = {}
        if request.model:
            extra_params["model"] = request.model

        # タスク作成
        result = await ace_step_client.release_task(
            prompt=request.prompt,
            lyrics=request.lyrics,
            thinking=request.thinking,
            vocal_language=request.vocal_language,
            audio_duration=request.audio_duration,
            bpm=request.bpm,
            key_scale=request.key_scale,
            time_signature=request.time_signature,
            batch_size=request.batch_size,
            audio_format=request.audio_format,
            seed=request.seed,
            **extra_params
        )
        
        data = result.get("data", {})
        task_id = data.get("task_id", "")
        
        if not task_id:
            return GenerateAndWaitResponse(
                success=False,
                error="Failed to create task"
            )
        
        # 完了を待機
        task_results = await ace_step_client.wait_for_completion(
            task_id=task_id,
            timeout=request.timeout
        )
        
        # 結果を整形
        results = []
        for tr in task_results:
            results.append({
                "url": tr.url,
                "file": tr.file,
                "prompt": tr.prompt,
                "lyrics": tr.lyrics,
                "metas": {
                    "bpm": tr.metas.bpm if tr.metas else None,
                    "duration": tr.metas.duration if tr.metas else None,
                    "keyscale": tr.metas.keyscale if tr.metas else None,
                },
                "seed": tr.seed_value
            })
        
        return GenerateAndWaitResponse(
            success=True,
            results=results
        )
    
    except TimeoutError as e:
        return GenerateAndWaitResponse(
            success=False,
            error=str(e)
        )
    except Exception as e:
        return GenerateAndWaitResponse(
            success=False,
            error=str(e)
        )


@router.get("/languages")
async def get_languages():
    """サポート言語一覧を取得"""
    return {"languages": SUPPORTED_LANGUAGES}


@router.get("/key_scales")
async def get_key_scales():
    """サポートキースケール一覧を取得"""
    return {"key_scales": SUPPORTED_KEY_SCALES}


@router.get("/health")
async def health_check():
    """ACE-Step APIのヘルスチェック"""
    try:
        result = await ace_step_client.health_check()
        return result
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/models")
async def get_models():
    """ACE-Step APIのモデル情報を取得"""
    try:
        result = await ace_step_client.get_models()
        data = result.get("data", {})
        return {
            "success": True,
            "models": data.get("models", []),
            "default_model": data.get("default_model", "unknown")
        }
    except Exception as e:
        return {"success": False, "error": str(e), "models": [], "default_model": "unknown"}


@router.get("/stats")
async def get_stats():
    """ACE-Step APIの統計情報を取得"""
    try:
        result = await ace_step_client.get_stats()
        data = result.get("data", {})
        return {
            "success": True,
            "jobs": data.get("jobs", {}),
            "queue_size": data.get("queue_size", 0),
            "avg_job_seconds": data.get("avg_job_seconds", 0)
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/format_input")
async def format_input(request: FormatInputRequest):
    """
    LLMでプロンプト/歌詞を強化・補完

    ACE-Step の /format_input を呼び出し、caption/lyrics/BPM等を返す
    """
    try:
        result = await ace_step_client.format_input(
            prompt=request.prompt,
            lyrics=request.lyrics,
            temperature=request.temperature,
        )
        data = result.get("data", {})
        return {
            "success": True,
            "caption": data.get("caption", ""),
            "lyrics": data.get("lyrics", ""),
            "bpm": data.get("bpm"),
            "key_scale": data.get("keyscale", data.get("key_scale", "")),
            "time_signature": data.get("timesignature", data.get("time_signature", "")),
            "duration": data.get("duration"),
            "vocal_language": data.get("language", data.get("vocal_language", "")),
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/generate_cover", response_model=GenerateResponse)
async def generate_cover(
    src_audio: UploadFile = File(..., description="ソース音声ファイル"),
    prompt: str = Form(default="", description="音楽の説明"),
    lyrics: str = Form(default="", description="歌詞"),
    thinking: bool = Form(default=True),
    model: Optional[str] = Form(default=None),
    vocal_language: str = Form(default="ja"),
    audio_duration: int = Form(default=60),
    bpm: Optional[int] = Form(default=None),
    key_scale: Optional[str] = Form(default=None),
    time_signature: str = Form(default="4"),
    batch_size: int = Form(default=1),
    audio_format: str = Form(default="mp3"),
    seed: Optional[int] = Form(default=None),
    inference_steps: int = Form(default=8),
    guidance_scale: float = Form(default=3.0),
    audio_cover_strength: float = Form(default=0.8, description="カバー強度 0.0～1.0"),
    lm_temperature: Optional[float] = Form(default=None),
    lm_cfg_scale: Optional[float] = Form(default=None),
    lm_top_p: Optional[float] = Form(default=None),
    use_cot_caption: Optional[bool] = Form(default=None),
    use_cot_language: Optional[bool] = Form(default=None),
):
    """
    カバーモードで音楽生成タスクを作成

    ソース音声をアップロードし、声質・スタイルを参照して新しい音楽を生成
    """
    try:
        src_audio_bytes = await src_audio.read()
        src_audio_filename = src_audio.filename or "upload.mp3"

        # カバー強度 < 1.0 のときは CFG=1.0 を強制
        effective_cfg = guidance_scale
        if audio_cover_strength < 1.0:
            effective_cfg = 1.0

        # パラメータを構築
        form_fields = {
            "prompt": sanitize_caption(prompt),
            "lyrics": lyrics,
            "thinking": str(thinking).lower(),
            "vocal_language": vocal_language,
            "audio_duration": str(audio_duration),
            "time_signature": time_signature,
            "batch_size": str(batch_size),
            "audio_format": audio_format,
            "inference_steps": str(inference_steps),
            "guidance_scale": str(effective_cfg),
            "task_type": "cover",
            "audio_cover_strength": str(audio_cover_strength),
        }
        if model:
            form_fields["model"] = model
        if bpm is not None:
            form_fields["bpm"] = str(bpm)
        if key_scale:
            form_fields["key_scale"] = key_scale
        if seed is not None:
            form_fields["seed"] = str(seed)
        if lm_temperature is not None:
            form_fields["lm_temperature"] = str(lm_temperature)
        if lm_cfg_scale is not None:
            form_fields["lm_cfg_scale"] = str(lm_cfg_scale)
        if lm_top_p is not None:
            form_fields["lm_top_p"] = str(lm_top_p)
        if use_cot_caption is not None:
            form_fields["use_cot_caption"] = str(use_cot_caption).lower()
        if use_cot_language is not None:
            form_fields["use_cot_language"] = str(use_cot_language).lower()

        result = await ace_step_client.release_task_multipart(
            form_fields=form_fields,
            src_audio_bytes=src_audio_bytes,
            src_audio_filename=src_audio_filename,
        )

        data = result.get("data", {})
        task_id = data.get("task_id", "")

        if not task_id:
            raise HTTPException(status_code=500, detail="Failed to create cover task")

        return GenerateResponse(
            task_id=task_id,
            status="queued",
            message="Cover task created successfully",
            queue_position=data.get("queue_position")
        )
    except (httpx.ConnectError, httpx.ConnectTimeout) as e:
        logging.getLogger("uvicorn.error").error(
            "ACE-Step API 接続失敗 (%s): %s", settings.ace_step_api_url, e
        )
        raise HTTPException(
            status_code=503,
            detail=f"ACE-Step APIに接続できません ({settings.ace_step_api_url})。"
                   f" --ace-url オプションでACE-Step APIのURLを指定してください。"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate_repaint", response_model=GenerateResponse)
async def generate_repaint(
    src_audio: UploadFile = File(..., description="リペイント対象の音声ファイル"),
    repainting_start: float = Form(default=0.0, description="リペイント開始位置（秒）"),
    repainting_end: float = Form(default=0.0, description="リペイント終了位置（秒）"),
    prompt: str = Form(default="", description="音楽の説明"),
    lyrics: str = Form(default="", description="歌詞"),
    thinking: bool = Form(default=True),
    model: Optional[str] = Form(default=None),
    vocal_language: str = Form(default="ja"),
    audio_duration: int = Form(default=60),
    bpm: Optional[int] = Form(default=None),
    key_scale: Optional[str] = Form(default=None),
    time_signature: str = Form(default="4"),
    batch_size: int = Form(default=1),
    audio_format: str = Form(default="mp3"),
    seed: Optional[int] = Form(default=None),
    inference_steps: int = Form(default=8),
    guidance_scale: float = Form(default=3.0),
    lm_temperature: Optional[float] = Form(default=None),
    lm_cfg_scale: Optional[float] = Form(default=None),
    lm_top_p: Optional[float] = Form(default=None),
    use_cot_caption: Optional[bool] = Form(default=None),
    use_cot_language: Optional[bool] = Form(default=None),
):
    """
    リペイントモードで音楽の一部を再生成

    元の音声をアップロードし、指定区間のみを再生成する
    """
    try:
        src_audio_bytes = await src_audio.read()
        src_audio_filename = src_audio.filename or "upload.mp3"

        form_fields = {
            "prompt": sanitize_caption(prompt),
            "lyrics": lyrics,
            "thinking": str(thinking).lower(),
            "vocal_language": vocal_language,
            "audio_duration": str(audio_duration),
            "time_signature": time_signature,
            "batch_size": str(batch_size),
            "audio_format": audio_format,
            "inference_steps": str(inference_steps),
            "guidance_scale": str(guidance_scale),
            "task_type": "repaint",
            "repainting_start": str(repainting_start),
            "repainting_end": str(repainting_end),
        }
        if model:
            form_fields["model"] = model
        if bpm is not None:
            form_fields["bpm"] = str(bpm)
        if key_scale:
            form_fields["key_scale"] = key_scale
        if seed is not None:
            form_fields["seed"] = str(seed)
        if lm_temperature is not None:
            form_fields["lm_temperature"] = str(lm_temperature)
        if lm_cfg_scale is not None:
            form_fields["lm_cfg_scale"] = str(lm_cfg_scale)
        if lm_top_p is not None:
            form_fields["lm_top_p"] = str(lm_top_p)
        if use_cot_caption is not None:
            form_fields["use_cot_caption"] = str(use_cot_caption).lower()
        if use_cot_language is not None:
            form_fields["use_cot_language"] = str(use_cot_language).lower()

        result = await ace_step_client.release_task_multipart(
            form_fields=form_fields,
            src_audio_bytes=src_audio_bytes,
            src_audio_filename=src_audio_filename,
        )

        data = result.get("data", {})
        task_id = data.get("task_id", "")

        if not task_id:
            raise HTTPException(status_code=500, detail="Failed to create repaint task")

        return GenerateResponse(
            task_id=task_id,
            status="queued",
            message="Repaint task created successfully"
        )
    except (httpx.ConnectError, httpx.ConnectTimeout) as e:
        logging.getLogger("uvicorn.error").error(
            "ACE-Step API 接続失敗 (%s): %s", settings.ace_step_api_url, e
        )
        raise HTTPException(
            status_code=503,
            detail=f"ACE-Step APIに接続できません ({settings.ace_step_api_url})。"
                   f" --ace-url オプションでACE-Step APIのURLを指定してください。"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/audio")
async def proxy_audio(path: str):
    """
    ACE-Step APIからの音声ファイルをプロキシ
    CORSの問題を回避するため
    """
    audio_url = f"{settings.ace_step_api_url}/v1/audio?path={path}"
    last_err = None

    for attempt in range(3):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(audio_url, timeout=60.0)

                if response.status_code != 200:
                    raise HTTPException(status_code=response.status_code, detail="Audio not found")

                # Content-Typeを取得
                content_type = response.headers.get("content-type", "audio/mpeg")

                return StreamingResponse(
                    iter([response.content]),
                    media_type=content_type,
                    headers={
                        "Accept-Ranges": "bytes",
                        "Content-Length": str(len(response.content))
                    }
                )
        except httpx.RequestError as e:
            last_err = e
            if attempt < 2:
                await asyncio.sleep(0.5 * (attempt + 1))
                continue
            raise HTTPException(status_code=502, detail=f"Failed to fetch audio: {str(e)}")
