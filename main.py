"""
Easy Music — AI音楽生成 Web Application

ACE-Step 1.5 API を使ったシンプルな音楽生成アプリ
"""
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
import uvicorn
import logging

from config import settings, apply_cli_args
from routers import generate, lyrics

# =============================================================================
# Application Setup
# =============================================================================

app = FastAPI(
    title="Easy Music",
    description="AI音楽生成Webアプリケーション",
    version="1.0.0"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 静的ファイル（キャッシュ無効化ミドルウェア）
class NoCacheStaticMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        if request.url.path.startswith("/static/"):
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        return response

app.add_middleware(NoCacheStaticMiddleware)
app.mount("/static", StaticFiles(directory="static"), name="static")

# テンプレート
templates = Jinja2Templates(directory="templates")


# =============================================================================
# Logging
# =============================================================================

logger = logging.getLogger("uvicorn.error")


# =============================================================================
# Startup
# =============================================================================

@app.on_event("startup")
async def log_base_urls_on_startup():
    apply_cli_args()

    from services.ace_step_client import ace_step_client
    ace_step_client.base_url = settings.ace_step_api_url.rstrip("/")

    logger.info("ACE-Step API Base URL: %s", settings.ace_step_api_url)
    if settings.use_local_llm_only:
        logger.info("LLM Mode: 内蔵LLM (Qwen3-1.7B) のみ")
    else:
        logger.info("LLM API Base URL: %s", settings.openai_base_url)
        logger.info("LLM Model: %s", settings.openai_chat_model)


# =============================================================================
# Routers
# =============================================================================

app.include_router(generate.router)
app.include_router(lyrics.router)


# =============================================================================
# Pages
# =============================================================================

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    """メインページ"""
    return templates.TemplateResponse("index.html", {
        "request": request,
        "title": "Easy Music — AI音楽生成"
    })


@app.get("/api")
async def api_info():
    """API情報"""
    return {
        "name": "Easy Music API",
        "version": "1.0.0",
        "endpoints": {
            "generate": {
                "POST /api/generate": "音楽生成タスク作成",
                "GET /api/status/{task_id}": "タスクステータス確認",
            },
            "lyrics": {
                "POST /api/lyrics": "AI作詞",
                "POST /api/tags": "タグ生成",
                "POST /api/theme": "テーマ生成",
                "POST /api/caption": "キャプション生成",
            },
        }
    }


# =============================================================================
# Main
# =============================================================================

if __name__ == "__main__":
    from config import apply_cli_args, settings

    apply_cli_args()

    print(f"🎵 Easy Music starting on http://{settings.host}:{settings.port}")
    print(f"   ACE-Step API: {settings.ace_step_api_url}")
    if settings.use_local_llm_only:
        print(f"   LLM: 内蔵LLM (Qwen3-1.7B) のみ")
    else:
        print(f"   LLM API: {settings.openai_base_url}")
        print(f"   LLM Model: {settings.openai_chat_model}")
    print()

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
