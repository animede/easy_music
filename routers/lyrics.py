"""
作詞・タグ生成エンドポイント
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

from services.llm_service import llm_service

router = APIRouter(prefix="/api", tags=["lyrics"])


# =============================================================================
# Request/Response Models
# =============================================================================

class LyricsGenerateRequest(BaseModel):
    """作詞リクエスト"""
    theme: str = Field(..., description="曲のテーマ/シナリオ")
    genre: str = Field(default="", description="ジャンル")
    language: str = Field(default="Japanese", description="言語")
    mood: str = Field(default="", description="ムード")


class LyricsGenerateResponse(BaseModel):
    """作詞レスポンス"""
    success: bool
    lyrics: str = ""
    recommended_duration: int = 90
    parts: Dict[str, int] = {}
    error: Optional[str] = None


class TagsGenerateRequest(BaseModel):
    """タグ生成リクエスト"""
    lyrics: str = Field(default="", description="歌詞")
    theme: str = Field(default="", description="テーマ")
    language: str = Field(default="Japanese", description="言語")


class TagsGenerateResponse(BaseModel):
    """タグ生成レスポンス"""
    success: bool
    genre: str = ""
    tags: str = ""
    bpm: int = 120
    key_scale: str = "C major"
    error: Optional[str] = None


class CaptionGenerateRequest(BaseModel):
    """キャプション生成リクエスト"""
    lyrics: str = Field(default="", description="歌詞")
    theme: str = Field(default="", description="テーマ")
    tags: str = Field(default="", description="既存のタグ")
    language: str = Field(default="Japanese", description="言語")


class CaptionGenerateResponse(BaseModel):
    """キャプション生成レスポンス"""
    success: bool
    caption: str = ""
    error: Optional[str] = None


class FullGenerateRequest(BaseModel):
    """歌詞+タグ一括生成リクエスト"""
    theme: str = Field(..., description="曲のテーマ/シナリオ")
    genre: str = Field(default="", description="ジャンル")
    language: str = Field(default="Japanese", description="言語")
    mood: str = Field(default="", description="ムード")


class FullGenerateResponse(BaseModel):
    """歌詞+タグ一括生成レスポンス"""
    success: bool
    lyrics: str = ""
    recommended_duration: int = 90
    parts: Dict[str, int] = {}
    genre: str = ""
    tags: str = ""
    bpm: int = 120
    key_scale: str = "C major"
    error: Optional[str] = None


class ThemeGenerateRequest(BaseModel):
    """テーマ生成リクエスト"""
    genre: str = Field(default="", description="ジャンル")
    language: str = Field(default="Japanese", description="言語")


class ThemeGenerateResponse(BaseModel):
    """テーマ生成レスポンス"""
    success: bool
    theme: str = ""
    error: Optional[str] = None


# =============================================================================
# Endpoints
# =============================================================================


@router.post("/theme", response_model=ThemeGenerateResponse)
async def generate_theme(request: ThemeGenerateRequest):
    """
    LLMでテーマ/シナリオを自動生成
    """
    try:
        theme = await llm_service.generate_theme(
            genre=request.genre,
            language=request.language
        )
        return ThemeGenerateResponse(success=True, theme=theme)
    except Exception as e:
        return ThemeGenerateResponse(success=False, error=str(e))

@router.post("/lyrics", response_model=LyricsGenerateResponse)
async def generate_lyrics(request: LyricsGenerateRequest):
    """
    AI作詞
    
    テーマから歌詞を生成
    """
    try:
        result = await llm_service.generate_lyrics(
            theme=request.theme,
            genre=request.genre,
            language=request.language,
            mood=request.mood
        )
        
        return LyricsGenerateResponse(
            success=True,
            lyrics=result["lyrics"],
            recommended_duration=result["recommended_duration"],
            parts=result["parts"]
        )
    
    except Exception as e:
        return LyricsGenerateResponse(
            success=False,
            error=str(e)
        )


@router.post("/tags", response_model=TagsGenerateResponse)
async def generate_tags(request: TagsGenerateRequest):
    """
    タグ生成
    
    歌詞/テーマからジャンル・タグを推奨
    """
    try:
        result = await llm_service.generate_tags(
            lyrics=request.lyrics,
            theme=request.theme,
            language=request.language
        )
        
        return TagsGenerateResponse(
            success=True,
            genre=result["genre"],
            tags=result["tags"],
            bpm=result["bpm"],
            key_scale=result["key_scale"]
        )
    
    except Exception as e:
        return TagsGenerateResponse(
            success=False,
            error=str(e)
        )


@router.post("/caption", response_model=CaptionGenerateResponse)
async def generate_caption(request: CaptionGenerateRequest):
    """
    ナラティブキャプション生成
    
    歌詞/テーマ/タグから ACE-Step 向け詳細キャプションを生成
    """
    try:
        result = await llm_service.generate_caption(
            lyrics=request.lyrics,
            theme=request.theme,
            tags=request.tags,
            language=request.language
        )
        
        return CaptionGenerateResponse(
            success=True,
            caption=result["caption"]
        )
    
    except Exception as e:
        return CaptionGenerateResponse(
            success=False,
            error=str(e)
        )


@router.post("/full_generate", response_model=FullGenerateResponse)
async def full_generate(request: FullGenerateRequest):
    """
    歌詞+タグ一括生成
    
    テーマから歌詞とタグを一括生成
    """
    try:
        result = await llm_service.generate_full(
            theme=request.theme,
            genre=request.genre,
            language=request.language,
            mood=request.mood
        )
        
        return FullGenerateResponse(
            success=True,
            lyrics=result["lyrics"],
            recommended_duration=result["recommended_duration"],
            parts=result["parts"],
            genre=result["genre"],
            tags=result["tags"],
            bpm=result["bpm"],
            key_scale=result["key_scale"]
        )
    
    except Exception as e:
        return FullGenerateResponse(
            success=False,
            error=str(e)
        )


@router.get("/llm_status")
async def llm_status():
    """
    LLM接続状況を返す（外部LLM / ローカルLLM の利用可否）
    """
    # 外部LLM接続テスト
    external_ok = False
    try:
        llm_service._ensure_client()
        # 軽量リクエストでテスト
        await llm_service._client.chat.completions.create(
            model=llm_service._effective_model(),
            messages=[{"role": "user", "content": "hi"}],
            max_tokens=1,
            temperature=0,
        )
        external_ok = True
    except Exception:
        pass

    # ローカルLLM状態
    local_status = {"available": False, "loaded": False, "model_downloaded": False}
    try:
        from services.local_llm_service import local_llm_service
        local_status = local_llm_service.get_status()
    except Exception:
        pass

    return {
        "external_llm": external_ok,
        "local_llm": local_status,
    }
