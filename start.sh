#!/bin/bash
# Easy Music 起動スクリプト
#
# 使い方:
#   ./start.sh                                    # デフォルト設定
#   ./start.sh --ace-url http://HOST:8001          # ACE-Step APIを指定
#   ./start.sh --llm-url http://HOST:11434/v1      # LLM APIを指定
#   ./start.sh --port 9000                         # ポートを変更
#   ./start.sh --local-llm                          # 内蔵LLMのみ使用（外部LLM不要）

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# venv検出
if [ -d ".venv" ]; then
    source .venv/bin/activate
elif [ -d "../.venv" ]; then
    source ../.venv/bin/activate
fi

echo "🎵 Easy Music を起動します..."
python main.py "$@"
