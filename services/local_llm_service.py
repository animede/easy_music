"""
Local LLM Service - ローカル GGUF モデルによるフォールバック作詞

外部 LLM に接続できない場合に Gemma 4 E4B (GGUF Q4_0) を使用して
ローカルで歌詞・テーマを生成する。thinking(reasoning)は常に OFF。

初回利用時に HuggingFace から自動ダウンロード (~4.4GB)。
CPU のみで動作（GPU 不要）。llama-cpp-python >= 0.3.34 が必要
(それより古い llama.cpp は gemma4 アーキテクチャを知らない)。
"""
import logging
import os
import re
import asyncio
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

# モデル設定
MODEL_REPO = "ggml-org/gemma-4-E4B-it-GGUF"
MODEL_FILE = "gemma-4-E4B-it-Q4_0.gguf"
MODEL_SIZE_HINT = "~4.4GB"
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")

# Gemma 4 の思考チャネル / Qwen 系の <think> ブロック（念のため両方除去）
_THOUGHT_RE = re.compile(
    r"<\|channel>thought\n.*?<channel\|>\s*|<think>.*?</think>\s*",
    flags=re.DOTALL,
)


class LocalLLMService:
    """ローカル GGUF モデルを使った LLM サービス（フォールバック用）"""

    def __init__(self):
        self._llm = None
        self._available: Optional[bool] = None  # None = 未確認
        self._loading = False

    @property
    def is_available(self) -> bool:
        """ローカルLLMが利用可能かどうか"""
        if self._available is None:
            # ライブラリの存在のみチェック（モデルはまだロードしない）
            try:
                import llama_cpp  # noqa: F401
                self._available = True
            except ImportError:
                logger.info("llama-cpp-python が未インストール。ローカルLLMは使用不可。")
                self._available = False
        return self._available

    def _get_model_path(self) -> str:
        """モデルファイルのパスを返す"""
        return os.path.join(MODELS_DIR, MODEL_FILE)

    def _download_model(self) -> str:
        """HuggingFace からモデルをダウンロード"""
        model_path = self._get_model_path()
        if os.path.exists(model_path):
            return model_path

        logger.info(
            f"ローカルLLMモデルをダウンロード中: {MODEL_REPO}/{MODEL_FILE} ({MODEL_SIZE_HINT})"
        )
        os.makedirs(MODELS_DIR, exist_ok=True)

        from huggingface_hub import hf_hub_download
        downloaded_path = hf_hub_download(
            repo_id=MODEL_REPO,
            filename=MODEL_FILE,
            local_dir=MODELS_DIR,
        )
        logger.info(f"ダウンロード完了: {downloaded_path}")
        return downloaded_path

    def _ensure_model(self) -> bool:
        """モデルをロード済みにする。成功なら True"""
        if self._llm is not None:
            return True
        if self._loading:
            return False
        if not self.is_available:
            return False

        self._loading = True
        try:
            model_path = self._download_model()

            from llama_cpp import Llama
            logger.info(f"ローカルLLMをロード中: {model_path}")
            self._llm = Llama(
                model_path=model_path,
                n_ctx=8192,        # コンテキスト長（システムプロンプト + 歌詞に十分）
                n_threads=max(4, (os.cpu_count() or 8) // 2),  # CPUスレッド数
                n_gpu_layers=0,    # CPU のみ
                verbose=False,
            )
            logger.info(f"ローカルLLM ロード完了 ({MODEL_FILE})")
            return True
        except Exception as e:
            logger.error(f"ローカルLLM ロード失敗: {e}")
            self._available = False
            return False
        finally:
            self._loading = False

    async def chat(
        self,
        user_message: str,
        system_prompt: str,
        max_tokens: int = 2000,
        temperature: float = 0.8,
    ) -> str:
        """
        ローカル LLM でチャット応答を生成

        llm_service.chat() と同じインターフェース。
        CPU推論は時間がかかるためスレッドプールで実行。
        """
        if not self._ensure_model():
            raise RuntimeError("ローカルLLMが利用できません")

        # CPU 推論はブロッキングなので別スレッドで実行
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            self._generate_sync,
            user_message,
            system_prompt,
            max_tokens,
            temperature,
        )
        return result

    def _generate_sync(
        self,
        user_message: str,
        system_prompt: str,
        max_tokens: int,
        temperature: float,
    ) -> str:
        """同期的に推論を実行"""
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ]

        # GGUF 内蔵の Gemma 4 チャットテンプレートを使う。enable_thinking は
        # テンプレート既定で false なので reasoning は OFF（<|think|> は出さない）。
        response = self._llm.create_chat_completion(
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=0.95,
            top_k=64,
            repeat_penalty=1.1,
        )

        content = response["choices"][0]["message"]["content"]

        # 万一、思考チャネルが混ざった場合は除去
        content = _THOUGHT_RE.sub("", content)

        return content.strip()

    def get_status(self) -> Dict[str, Any]:
        """現在の状態を返す"""
        model_path = self._get_model_path()
        return {
            "available": self.is_available,
            "loaded": self._llm is not None,
            "model": MODEL_FILE,
            "model_downloaded": os.path.exists(model_path),
            "model_path": model_path,
        }


# シングルトン
local_llm_service = LocalLLMService()
