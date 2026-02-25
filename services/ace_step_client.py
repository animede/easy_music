"""
ACE-Step 1.5 REST API Client Service

ACE-Step APIと通信するためのクライアント
"""
import json
import time
import httpx
from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any, Callable
from enum import Enum

from config import settings


class TaskStatus(Enum):
    """タスクステータス"""
    PROCESSING = 0
    SUCCEEDED = 1
    FAILED = 2


class TaskType(Enum):
    """タスクタイプ"""
    TEXT2MUSIC = "text2music"
    COVER = "cover"
    REPAINT = "repaint"


class AudioFormat(Enum):
    """出力形式"""
    MP3 = "mp3"
    WAV = "wav"
    FLAC = "flac"


# サポート言語一覧
SUPPORTED_LANGUAGES = [
    "en", "zh", "ja", "ko", "es", "fr", "de", "it", "pt", "ru",
    "ar", "hi", "bn", "th", "vi", "id", "tr", "nl", "pl", "unknown"
]

# サポートキースケール
SUPPORTED_KEY_SCALES = [
    "C major", "C minor", "C# major", "C# minor",
    "D major", "D minor", "D# major", "D# minor",
    "E major", "E minor",
    "F major", "F minor", "F# major", "F# minor",
    "G major", "G minor", "G# major", "G# minor",
    "A major", "A minor", "A# major", "A# minor",
    "B major", "B minor"
]


@dataclass
class AudioMetadata:
    """音声メタデータ"""
    bpm: Optional[int] = None
    duration: Optional[float] = None
    genres: Optional[str] = None
    keyscale: Optional[str] = None
    timesignature: Optional[str] = None


@dataclass
class TaskResult:
    """タスク結果"""
    file: str
    status: int
    create_time: int
    url: Optional[str] = None
    prompt: Optional[str] = None
    lyrics: Optional[str] = None
    metas: Optional[AudioMetadata] = None
    generation_info: Optional[str] = None
    seed_value: Optional[str] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any], base_url: str = "") -> "TaskResult":
        """辞書からTaskResultを生成"""
        metas_data = data.get("metas", {})
        if metas_data:
            metas = AudioMetadata(
                bpm=metas_data.get("bpm"),
                duration=metas_data.get("duration"),
                genres=metas_data.get("genres"),
                keyscale=metas_data.get("keyscale"),
                timesignature=metas_data.get("timesignature"),
            )
        else:
            metas = None
        
        # URLを構築
        file_path = data.get("file", "")
        url = f"{base_url}{file_path}" if file_path else None
        
        return cls(
            file=file_path,
            status=data.get("status", 0),
            create_time=data.get("create_time", 0),
            url=url,
            prompt=data.get("prompt"),
            lyrics=data.get("lyrics"),
            metas=metas,
            generation_info=data.get("generation_info"),
            seed_value=data.get("seed_value"),
        )


class AceStepClient:
    """ACE-Step 1.5 REST API クライアント"""
    
    def __init__(
        self,
        base_url: str = None,
        api_key: str = None,
        timeout: float = 60.0
    ):
        self.base_url = (base_url or settings.ace_step_api_url).rstrip("/")
        self.api_key = api_key or settings.ace_step_api_key
        self.timeout = timeout
        self._client = None
    
    def _get_client(self) -> httpx.Client:
        """HTTPクライアントを取得"""
        if self._client is None:
            self._client = httpx.Client(timeout=self.timeout)
        return self._client
    
    async def _get_async_client(self) -> httpx.AsyncClient:
        """非同期HTTPクライアントを取得"""
        return httpx.AsyncClient(timeout=self.timeout)
    
    def _build_headers(self) -> Dict[str, str]:
        """リクエストヘッダーを構築"""
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers
    
    async def release_task(
        self,
        prompt: str = "",
        lyrics: str = "",
        thinking: bool = True,
        vocal_language: str = "ja",
        audio_duration: int = 60,
        bpm: Optional[int] = None,
        key_scale: Optional[str] = None,
        time_signature: str = "4",
        batch_size: int = 1,
        audio_format: str = "mp3",
        seed: Optional[int] = None,
        inference_steps: int = 150,
        guidance_scale: float = 3.0,
        **kwargs
    ) -> Dict[str, Any]:
        """
        音楽生成タスクを作成
        
        Args:
            prompt: 音楽の説明（ジャンル、楽器、雰囲気など）
            lyrics: 歌詞（構造タグ付き）
            thinking: True=LMで高品質生成, False=DiTのみ高速生成
            vocal_language: 歌詞言語
            audio_duration: 生成時間（秒）
            bpm: テンポ（省略時は自動）
            key_scale: 調（省略時は自動）
            time_signature: 拍子
            batch_size: バッチサイズ
            audio_format: 出力形式
            seed: シード値
            inference_steps: 推論ステップ数（多いほど高品質・遅い）
            guidance_scale: CFGスケール（高いほどプロンプトに忠実）
        
        Returns:
            タスク情報（task_id等）
        """
        payload = {
            "prompt": prompt,
            "lyrics": lyrics,
            "thinking": thinking,
            "vocal_language": vocal_language,
            "audio_duration": audio_duration,
            "time_signature": time_signature,
            "batch_size": batch_size,
            "audio_format": audio_format,
            "inference_steps": inference_steps,
            "guidance_scale": guidance_scale,
        }
        
        if bpm is not None:
            payload["bpm"] = bpm
        if key_scale is not None:
            payload["key_scale"] = key_scale
        if seed is not None:
            payload["seed"] = seed
        
        # 追加パラメータ
        payload.update(kwargs)
        
        async with await self._get_async_client() as client:
            response = await client.post(
                f"{self.base_url}/release_task",
                json=payload,
                headers=self._build_headers()
            )
            response.raise_for_status()
            return response.json()
    
    async def query_result(self, task_ids: List[str]) -> Dict[str, Any]:
        """
        タスク結果をクエリ
        
        Args:
            task_ids: タスクIDのリスト
        
        Returns:
            タスク結果
        """
        payload = {"task_id_list": task_ids}
        
        async with await self._get_async_client() as client:
            response = await client.post(
                f"{self.base_url}/query_result",
                json=payload,
                headers=self._build_headers()
            )
            response.raise_for_status()
            return response.json()
    
    async def wait_for_completion(
        self,
        task_id: str,
        poll_interval: float = None,
        timeout: float = None,
        on_progress: Optional[Callable[[int, str], None]] = None
    ) -> List[TaskResult]:
        """
        タスク完了を待機
        
        Args:
            task_id: タスクID
            poll_interval: ポーリング間隔（秒）
            timeout: タイムアウト（秒）
            on_progress: 進捗コールバック
        
        Returns:
            タスク結果リスト
        """
        poll_interval = poll_interval or settings.poll_interval
        timeout = timeout or settings.poll_timeout
        
        start_time = time.time()
        
        while True:
            elapsed = time.time() - start_time
            if elapsed > timeout:
                raise TimeoutError(f"Task {task_id} timed out after {timeout} seconds")
            
            result = await self.query_result([task_id])
            
            if result.get("code") != 200:
                raise Exception(f"API error: {result.get('error')}")
            
            data_list = result.get("data", [])
            if not data_list:
                await self._sleep(poll_interval)
                continue
            
            task_data = data_list[0]
            status = task_data.get("status", 0)
            
            if status == TaskStatus.SUCCEEDED.value:
                # 成功
                result_json = task_data.get("result", "[]")
                if isinstance(result_json, str):
                    results = json.loads(result_json)
                else:
                    results = result_json
                
                return [
                    TaskResult.from_dict(r, self.base_url)
                    for r in results
                ]
            
            elif status == TaskStatus.FAILED.value:
                # 失敗
                error_msg = task_data.get("result", "Unknown error")
                raise Exception(f"Task failed: {error_msg}")
            
            # 処理中
            if on_progress:
                progress = int((elapsed / timeout) * 100)
                on_progress(progress, "Processing...")
            
            await self._sleep(poll_interval)
    
    async def _sleep(self, seconds: float):
        """非同期スリープ"""
        import asyncio
        await asyncio.sleep(seconds)
    
    async def format_input(
        self,
        prompt: str,
        lyrics: str = "",
        temperature: float = 0.85
    ) -> Dict[str, Any]:
        """
        LLMでcaption/lyricsを強化
        
        Args:
            prompt: プロンプト
            lyrics: 歌詞
            temperature: 温度
        
        Returns:
            強化されたcaption/lyrics
        """
        payload = {
            "prompt": prompt,
            "lyrics": lyrics,
            "temperature": temperature
        }
        
        async with await self._get_async_client() as client:
            response = await client.post(
                f"{self.base_url}/format_input",
                json=payload,
                headers=self._build_headers()
            )
            response.raise_for_status()
            return response.json()
    
    async def get_random_sample(self, sample_type: str = "simple_mode") -> Dict[str, Any]:
        """
        ランダムサンプルパラメータを取得
        
        Args:
            sample_type: サンプルタイプ
        
        Returns:
            サンプルパラメータ
        """
        payload = {"sample_type": sample_type}
        
        async with await self._get_async_client() as client:
            response = await client.post(
                f"{self.base_url}/create_random_sample",
                json=payload,
                headers=self._build_headers()
            )
            response.raise_for_status()
            return response.json()
    
    async def health_check(self) -> Dict[str, Any]:
        """ヘルスチェック"""
        async with await self._get_async_client() as client:
            response = await client.get(
                f"{self.base_url}/health",
                headers=self._build_headers()
            )
            response.raise_for_status()
            return response.json()
    
    async def get_stats(self) -> Dict[str, Any]:
        """サーバー統計情報を取得"""
        async with await self._get_async_client() as client:
            response = await client.get(
                f"{self.base_url}/v1/stats",
                headers=self._build_headers()
            )
            response.raise_for_status()
            return response.json()
    
    async def get_models(self) -> Dict[str, Any]:
        """利用可能なモデル一覧を取得"""
        async with await self._get_async_client() as client:
            response = await client.get(
                f"{self.base_url}/v1/models",
                headers=self._build_headers()
            )
            response.raise_for_status()
            return response.json()
    
    async def release_task_multipart(
        self,
        form_fields: dict,
        src_audio_bytes: bytes = None,
        src_audio_filename: str = "upload.mp3",
        ref_audio_bytes: bytes = None,
        ref_audio_filename: str = "ref.mp3",
    ) -> dict:
        """
        multipart/form-data で音楽生成タスクを作成（カバーモード用）

        Args:
            form_fields: フォームフィールド辞書
            src_audio_bytes: ソース音声バイト列
            src_audio_filename: ソース音声ファイル名
            ref_audio_bytes: 参照音声バイト列
            ref_audio_filename: 参照音声ファイル名
        """
        files = {}
        if src_audio_bytes:
            files["src_audio"] = (src_audio_filename, src_audio_bytes)
        if ref_audio_bytes:
            files["ref_audio"] = (ref_audio_filename, ref_audio_bytes)

        headers = {}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        async with await self._get_async_client() as client:
            response = await client.post(
                f"{self.base_url}/release_task",
                data=form_fields,
                files=files,
                headers=headers,
            )
            response.raise_for_status()
            return response.json()

    def get_audio_url(self, file_path: str) -> str:
        """音声ファイルのURLを取得"""
        return f"{self.base_url}{file_path}"


# シングルトンインスタンス
ace_step_client = AceStepClient()
