"""
Easy Music — Server Version

アプリ版 (main.py) をそのまま import して起動するラッパー。

  - 既存の全機能はアプリ版 (main.py) から継承
  - アプリ版を修正すればサーバ版にも自動反映

セキュリティメモ:
    タスクIDは ACE-Step API が生成する UUID (128-bit) であり、
    推測不可能なため、セッションによるアクセスガードは不要。
    将来ユーザー認証が必要になった場合はここに追加する。

使い方:
    python main_server.py [--host 0.0.0.0] [--port 8889] ...
    (main.py と同じコマンドライン引数をすべて使用可能)
"""

import os
import logging

import uvicorn

# アプリ版をそのまま import（ルーター・ミドルウェア・静的ファイル全て含む）
from main import app  # noqa: F401
from config import apply_cli_args, settings

logger = logging.getLogger("uvicorn.error")


# =============================================================================
# Main
# =============================================================================

if __name__ == "__main__":
    apply_cli_args()

    print(f"🎵 Easy Music Server starting on http://{settings.host}:{settings.port}")
    print(f"   ACE-Step API: {settings.ace_step_api_url}")
    if settings.use_local_llm_only:
        print(f"   LLM: 内蔵LLM (Qwen3-1.7B) のみ")
    else:
        print(f"   LLM API: {settings.openai_base_url}")
        print(f"   LLM Model: {settings.openai_chat_model}")
    print()

    uvicorn.run(
        "main_server:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
