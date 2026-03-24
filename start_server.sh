#!/bin/bash
# Easy Music Server 起動スクリプト（セッション管理付き）
#
# 使い方:
#   ./start_server.sh                                    # デフォルト設定
#   ./start_server.sh --ace-url http://HOST:8001          # ACE-Step APIを指定
#   ./start_server.sh --llm-url http://HOST:11434/v1      # LLM APIを指定
#   ./start_server.sh --port 9000                         # ポートを変更
#   ./start_server.sh --local-llm                          # 内蔵LLMのみ使用
#
# 環境変数:
#   SESSION_SECRET  — Cookie署名鍵（未設定時は起動毎に自動生成）

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# venv検出
if [ -d ".venv" ]; then
    source .venv/bin/activate
elif [ -d "../.venv" ]; then
    source ../.venv/bin/activate
fi

echo "🔒 Easy Music Server を起動します...（セッション管理有効）"
python main_server.py "$@"
