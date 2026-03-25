#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# Activate local venv if present
if [[ -f "$ROOT_DIR/.venv/bin/activate" ]]; then
        # shellcheck disable=SC1091
        source "$ROOT_DIR/.venv/bin/activate"
fi

# -----------------------------------------------------------------------------
# Low-VRAM / VRAM-tight mode
#
# Purpose:
# - Avoid multi-model (no simultaneous turbo+base load)
# - Keep server-side features available (LLM enabled) with lighter defaults
# - Provide CPU-offload toggles to survive "VRAM is tight" situations
#
# Notes:
# - Per-request model switching via {"model":"..."} REQUIRES multi-model load.
#   This script intentionally loads ONE DiT model.
# -----------------------------------------------------------------------------

# Choose ONE DiT model at startup.
# Default is turbo (fast). If you want base quality instead, override:
#   ACESTEP_CONFIG_PATH=acestep-v15-base ./run_api_server_lowvram.sh
export ACESTEP_CONFIG_PATH="${ACESTEP_CONFIG_PATH:-acestep-v15-turbo}"

# Ensure secondary/third models are NOT loaded.
export ACESTEP_CONFIG_PATH2="${ACESTEP_CONFIG_PATH2:-}"
export ACESTEP_CONFIG_PATH3="${ACESTEP_CONFIG_PATH3:-}"

# LLM settings:
# - Keep LM enabled, but default to 1.7B to reduce VRAM.
# - For best quality (more VRAM), override to: acestep-5Hz-lm-4B
export ACESTEP_INIT_LLM="${ACESTEP_INIT_LLM:-1}"
export ACESTEP_LM_MODEL_PATH="${ACESTEP_LM_MODEL_PATH:-acestep-5Hz-lm-1.7B}"
export ACESTEP_LM_BACKEND="${ACESTEP_LM_BACKEND:-vllm}"

# Device selection
export ACESTEP_DEVICE="${ACESTEP_DEVICE:-auto}"

# Offload toggles (set to 0 for faster, requires more VRAM)
export ACESTEP_OFFLOAD_TO_CPU="${ACESTEP_OFFLOAD_TO_CPU:-1}"
export ACESTEP_LM_OFFLOAD_TO_CPU="${ACESTEP_LM_OFFLOAD_TO_CPU:-1}"
# Extra lever (can be slow): offload more of DiT to CPU
export ACESTEP_OFFLOAD_DIT_TO_CPU="${ACESTEP_OFFLOAD_DIT_TO_CPU:-0}"

# NOTE: api_server uses an in-memory queue/job store -> keep workers=1.
export ACESTEP_API_WORKERS="${ACESTEP_API_WORKERS:-1}"

HOST="${ACESTEP_API_HOST:-0.0.0.0}"
PORT="${ACESTEP_API_PORT:-8001}"
LOG_LEVEL="${ACESTEP_API_LOG_LEVEL:-debug}"

exec python -m uvicorn acestep.api_server:app \
        --host "$HOST" \
        --port "$PORT" \
        --workers 1 \
        --log-level "$LOG_LEVEL"
