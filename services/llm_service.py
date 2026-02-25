"""
LLM Service - 作詞・タグ生成サービス

OpenAI互換APIを使用した歌詞生成とタグ推奨
外部LLM接続失敗時はローカルGGUFモデル(Qwen3-1.7B)にフォールバック
"""
import json
import logging
import re
from typing import Optional, Dict, Any, Tuple
from openai import AsyncOpenAI

from config import settings

logger = logging.getLogger(__name__)


# システムプロンプト: 作詞
LYRICS_GENERATE_SYSTEM_PROMPT = """You are a professional lyricist who creates song lyrics for AI music generation (ACE-Step).

CRITICAL OUTPUT RULES:
1. Start with a JSON metadata line, then output ONLY the lyrics with structure tags
2. Use structure tags: [intro], [verse], [chorus], [bridge], [outro], [inst] (for instrumental)
3. Do NOT include timestamps like (0:00-0:05) - ACE-Step does not use them
4. NEVER include romanization/romaji in parentheses or on separate lines
   BAD:  青い空の下 (Aoi sora no shita)   ← WRONG, will break music generation
   BAD:  (Aoi sora no shita, kaze ga utau) ← WRONG, romaji line
   GOOD: 青い空の下                         ← CORRECT, Japanese only
5. Write lyrics line by line, each line on its own
6. Each line must contain ONLY the lyrics text in the target language — no translations, no pronunciation guides

REQUIRED FIRST LINE FORMAT (JSON):
{"recommended_duration": 90, "parts": {"intro": 5, "verse1": 20, "chorus1": 25, "verse2": 20, "chorus2": 25, "outro": 5}}

- recommended_duration: Total song length in seconds (typically 60-180)
- parts: Estimated duration for each part in seconds

STRUCTURE GUIDELINES:
- [intro]: Keep short (1-2 lines) or use [inst] for instrumental (5-10 sec)
- [verse]: 4-6 lines per verse (15-25 sec)
- [chorus]: 4-6 lines, catchy and memorable (20-30 sec)
- [bridge]: Optional, 2-4 lines (10-15 sec)
- [outro]: Short ending, 1-2 lines or [inst] (5-10 sec)

STYLE GUIDELINES:
- Match the mood and genre specified
- Use natural, singable phrases
- If Japanese: Write ONLY in Japanese (kanji/hiragana/katakana mix). NEVER add romaji.
- If English: Write ONLY in English
- Keep vocabulary natural for singing
- IMPORTANT: Adding romanization doubles the lyrics and causes ACE-Step to sing garbled output
"""

# システムプロンプト: タグ生成
TAGS_GENERATE_SYSTEM_PROMPT = """You are a music metadata expert. Based on the given lyrics and theme, generate appropriate music tags for AI music generation.

OUTPUT FORMAT (JSON only):
{
    "genre": "primary genre, secondary genre",
    "tags": "instrument1, instrument2, mood1, mood2, vocal type, tempo description",
    "bpm": 120,
    "key_scale": "C major"
}

TAG CATEGORIES:
- Genre: pop, rock, jazz, electronic, hip-hop, R&B, classical, folk, country, etc.
- Mood: upbeat, melancholic, energetic, calm, romantic, dark, hopeful, nostalgic
- Instruments: piano, guitar, drums, bass, strings, synth, brass, etc.
- Vocal: male voice, female voice, choir, falsetto, breathy, powerful
- Tempo: slow tempo, mid tempo, fast tempo, upbeat rhythm

GUIDELINES:
- Analyze the lyrics mood and theme
- Suggest appropriate instrumentation
- Match tempo to the emotional content
- Use 5-10 tags total
- BPM range: 60-180
"""


# システムプロンプト: ナラティブキャプション生成
CAPTION_GENERATE_SYSTEM_PROMPT = """You are an expert music producer and audio engineer who writes detailed music descriptions for the ACE-Step AI music generator.

Your task: Given a theme, lyrics, and/or genre tags, write a precise, production-level caption that tells ACE-Step exactly what kind of music to generate. The caption directly controls the AI — every word matters.

STRICT OUTPUT RULES:
1. Output ONLY the caption — no titles, no "Note:", no markdown, no lists, no commentary
2. Write in English only (ACE-Step's text encoder is trained primarily on English music metadata)
3. Write 3-5 sentences as a single flowing paragraph
4. Never start with "Sure" / "Here is" / "This is a". Start directly with the genre or style description

REQUIRED ELEMENTS (include ALL of these, in this order):

1. GENRE + SUBGENRE + ERA — Be specific. Not just "pop" but "2000s J-Pop with city-pop revival influences" or "lo-fi hip-hop with jazzy chord progressions"

2. VOCAL CHARACTERISTICS — Specify:
   - Gender & register: "female soprano", "male baritone", "androgynous tenor"
   - Timbre: "breathy", "raspy", "clear", "nasal", "warm", "airy", "powerful"
   - Technique: "with gentle vibrato", "using falsetto in the chorus", "whispered verses"
   - For instrumental: "instrumental, no vocals"

3. INSTRUMENTS — List 3-6 specific instruments with playing style/tone:
   - Piano: "bright grand piano arpeggios" / "mellow Rhodes electric piano chords" / "honky-tonk upright piano"
   - Guitar: "clean fingerpicked nylon guitar" / "overdriven electric guitar power chords" / "tremolo-picked acoustic guitar"
   - Bass: "deep sub bass" / "funky slap bass" / "warm fretless bass" / "synth bass with sidechain"
   - Drums: "crisp programmed drums with tight hi-hats and punchy kick" / "live jazz brushed drums" / "808 trap hi-hats and booming kick"
   - Synth: "lush analog synth pads" / "saw-wave lead synth" / "retro FM synth bells" / "warm Moog bass"
   - Strings: "sweeping orchestral strings" / "pizzicato violin" / "solo cello melody"
   - Winds: "smooth tenor saxophone solo" / "breathy shakuhachi flute" / "muted trumpet"
   - Traditional: "shamisen with sharp plucking" / "koto glissando" / "taiko drum accents" / "erhu melody"
   - Effects: "ambient reverb tails", "vinyl crackle", "tape saturation", "bitcrushed textures"

4. ARRANGEMENT & DYNAMICS — How the song evolves:
   - "builds from a sparse intro into a full band arrangement"
   - "starts with solo piano, layers in strings and drums by the chorus"
   - "maintains a steady hypnotic groove throughout"
   - "features a dramatic breakdown before the final chorus"

5. MOOD & ATMOSPHERE — Emotional quality:
   - "nostalgic and bittersweet" / "euphoric and triumphant" / "dark and brooding" / "warm and comforting"

6. PRODUCTION STYLE (optional but valuable):
   - "lo-fi with warm tape saturation and vinyl crackle"
   - "polished modern pop production with heavy compression"
   - "spacious mix with wide stereo reverb"
   - "raw and live-sounding with minimal processing"

GENRE-SPECIFIC GUIDANCE:
- Japanese 70s Kayokyoku: orchestral strings, brass section, dramatic vocal delivery, analog warmth, reverb-heavy mix
- 80s Japanese Folk: acoustic guitar-led, singer-songwriter, warm analog recording, poetic lyrics, gentle strings, mellow and introspective
- 90s J-POP: bright electric guitar riffs, strong vocal hooks, electronic drums mixed with live drums, keyboard pads
- Vocaloid/Electronic: fast tempo (160-200 BPM), synthetic lead, heavy sidechain, intricate programmed drums, digital textures
- Anime Song: dramatic dynamics, powerful chorus, driving guitar riffs, orchestral hits, emotional vocal climaxes
- Enka: melismatic vocal with heavy vibrato, shamisen or koto, pentatonic melody, slow tempo, melancholic strings
- Min'yo: shakuhachi, taiko, pentatonic scale, call-and-response structure, earthy and organic
- Children's Song: simple acoustic arrangement, gentle xylophone or glockenspiel, warm piano, soft and innocent
- New Music: singer-songwriter style, acoustic guitar or piano-led, poetic and introspective, mellow arrangement
- Trance: uplifting synth pads, euphoric build-ups and breakdowns, driving four-on-the-floor kick, arpeggiated leads, 138 BPM, ethereal atmosphere
- Mood/Lounge: smooth jazz chords, mellow Rhodes piano, soft brushed drums, warm bass, romantic and sophisticated
- Driving/Refreshing: bright clean guitar, light rhythmic drums, warm bass, upbeat moderate tempo, breezy and uplifting, coastal sunshine feel
- Acoustic Pop: warm fingerpicking acoustic guitar, gentle vocal harmonies, light cajon or brushed snare, upright bass or soft bass, intimate and heartfelt, cafe-style
- Country: acoustic guitar strumming, banjo, fiddle, pedal steel guitar, warm storytelling vocal, Nashville production, heartland feel
- Bossa Nova: nylon-string acoustic guitar with syncopated patterns, soft brushed percussion, warm upright bass, gentle vocal, Brazilian jazz influence, relaxed cafe atmosphere
- Lo-Fi: mellow Rhodes/piano, vinyl crackle texture, warm lo-fi bass, chill drum loop with swing, tape saturation, nostalgic and cozy, study/relaxing mood
- City Pop: funky slap bass, bright analog synths, crisp drum machine, lush chorus guitar, polished vocal, 1980s Japanese urban pop, AOR influence, summer night vibes

EXAMPLE OUTPUT:
A nostalgic 1980s Japanese city-pop track featuring a smooth, breathy female vocal with subtle vibrato. The arrangement centers on a groovy slap bass line, shimmering DX7 FM electric piano, and chorus-drenched clean electric guitar playing funky rhythm chords. Crisp gated-reverb drums with tight hi-hats and a punchy snare drive the rhythm. Lush analog synth pads and a sweeping string section fill the background, building into an infectious chorus with layered vocal harmonies. The production has a warm, analog character with vintage reverb and a polished yet organic feel throughout.
"""


class LLMService:
    """LLMサービス - 作詞・タグ生成"""
    
    def __init__(
        self,
        base_url: str = None,
        api_key: str = None,
        model: str = None
    ):
        # NOTE:
        # `llm_service` is instantiated at import time. CLI args / .env may be
        # applied later (e.g., when running via uvicorn which re-imports
        # `main:app`). Therefore, we keep only optional overrides here and
        # lazily create (or recreate) the client per-request based on the
        # latest `settings`.
        self._base_url_override = base_url
        self._api_key_override = api_key
        self._model_override = model

        self._client: Optional[AsyncOpenAI] = None
        self._client_base_url: Optional[str] = None
        self._client_api_key: Optional[str] = None

    def _effective_base_url(self) -> str:
        return self._base_url_override or settings.openai_base_url

    def _effective_api_key(self) -> str:
        return self._api_key_override or settings.openai_api_key

    def _effective_model(self) -> str:
        return self._model_override or settings.openai_chat_model

    def _ensure_client(self) -> None:
        base_url = self._effective_base_url()
        api_key = self._effective_api_key()
        if (
            self._client is None
            or self._client_base_url != base_url
            or self._client_api_key != api_key
        ):
            self._client = AsyncOpenAI(base_url=base_url, api_key=api_key)
            self._client_base_url = base_url
            self._client_api_key = api_key
    
    async def chat(
        self,
        user_message: str,
        system_prompt: str,
        max_tokens: int = 2000,
        temperature: float = 0.8
    ) -> str:
        """
        LLMにチャットリクエストを送信
        
        外部LLM失敗時はローカルLLM(Qwen3-1.7B GGUF)にフォールバック
        """
        # --local-llm モード: 外部LLMをスキップ
        if not settings.use_local_llm_only:
            # まず外部LLMを試行
            try:
                self._ensure_client()
                messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ]
                completion = await self._client.chat.completions.create(
                    model=self._effective_model(),
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=temperature
                )
                return completion.choices[0].message.content
            except Exception as ext_error:
                logger.warning(f"外部LLM接続失敗: {ext_error}")
        else:
            logger.info("内蔵LLMモード: 外部LLMをスキップ")

        # ローカルLLM
        try:
            from services.local_llm_service import local_llm_service
            if local_llm_service.is_available:
                if not settings.use_local_llm_only:
                    logger.info("ローカルLLMにフォールバックします")
                return await local_llm_service.chat(
                    user_message=user_message,
                    system_prompt=system_prompt,
                    max_tokens=max_tokens,
                    temperature=temperature,
                )
        except Exception as local_error:
            logger.error(f"ローカルLLMも失敗: {local_error}")

        # 失敗
        raise ConnectionError("LLMが利用できません。外部LLM接続または内蔵LLMの初期化を確認してください")
    
    async def generate_lyrics(
        self,
        theme: str,
        genre: str = "",
        language: str = "Japanese",
        mood: str = ""
    ) -> Dict[str, Any]:
        """
        歌詞を生成
        
        Args:
            theme: 曲のテーマ/シナリオ
            genre: ジャンル
            language: 言語
            mood: ムード
        
        Returns:
            {
                "lyrics": str,  # 構造タグ付き歌詞
                "recommended_duration": int,  # 推奨秒数
                "parts": dict  # パート別秒数
            }
        """
        prompt = f"""Create lyrics for the following:
Theme: {theme}
Genre: {genre or 'any'}
Language: {language}
Mood: {mood or 'match the theme'}

Generate complete song lyrics with structure tags.
IMPORTANT: Do NOT add romanization or pronunciation in parentheses. Output lyrics in {language} ONLY."""
        
        # 最大2回試行（ローカルLLMがJSONのみ出力した場合のリトライ）
        for attempt in range(2):
            response = await self.chat(
                user_message=prompt,
                system_prompt=LYRICS_GENERATE_SYSTEM_PROMPT,
                temperature=0.85
            )
            
            result = self._parse_lyrics_response(response)
            
            # 歌詞が空 or 構造タグが無い場合はリトライ
            if result["lyrics"] and "[" in result["lyrics"]:
                return result
            
            if attempt == 0:
                logger.warning(
                    "歌詞生成: 歌詞が空または構造タグ不足（リトライします）response=%s",
                    response[:200]
                )
        
        # 2回とも失敗 → 結果をそのまま返す（空でもフロントで対処可能）
        logger.warning("歌詞生成: リトライ後も歌詞が不十分です")
        return result
    
    def _parse_lyrics_response(self, response: str) -> Dict[str, Any]:
        """歌詞レスポンスをパース"""
        lines = response.strip().split("\n")
        
        # 最初の行からJSONメタデータを抽出
        metadata = {
            "recommended_duration": 90,
            "parts": {}
        }
        lyrics_start = 0
        
        # --- Case 1: 1行JSON ---
        for i, line in enumerate(lines):
            line = line.strip()
            if line.startswith("{") and "recommended_duration" in line:
                try:
                    metadata = json.loads(line)
                    lyrics_start = i + 1
                    break
                except json.JSONDecodeError:
                    pass
        
        # --- Case 2: 複数行JSON（ローカルLLMが整形出力する場合） ---
        # lyrics_start が 0 のままならテキスト全体から複数行JSONブロックを探す
        if lyrics_start == 0:
            full_text = response.strip()
            json_match = re.search(
                r'(\{[^{}]*"recommended_duration"[^{}]*\})',
                full_text,
                re.DOTALL,
            )
            if json_match:
                try:
                    metadata = json.loads(json_match.group(1))
                    # JSONブロック終端以降を歌詞とする
                    after_json = full_text[json_match.end():]
                    lines = after_json.strip().split("\n")
                    lyrics_start = 0
                except json.JSONDecodeError:
                    pass
        
        # 歌詞部分を抽出
        lyrics = "\n".join(lines[lyrics_start:]).strip()
        
        # マークダウンコードブロック囲みを除去
        if lyrics.startswith('```'):
            lyrics = re.sub(r'^```[^\n]*\n?', '', lyrics)
            lyrics = re.sub(r'\n?```\s*$', '', lyrics)
            lyrics = lyrics.strip()
        
        # ローマ字行を自動除去（安全策）
        lyrics = self._strip_romaji_lines(lyrics)
        
        return {
            "lyrics": lyrics,
            "recommended_duration": metadata.get("recommended_duration", 90),
            "parts": metadata.get("parts", {})
        }
    
    @staticmethod
    def _strip_romaji_lines(lyrics: str) -> str:
        """ローマ字併記行を除去
        
        LLMが指示に反してローマ字を付加するケースへの安全策:
        - (Romaji text here) のような括弧付きローマ字行を除去
        - 日本語行の末尾に付いた (romaji) も除去
        """
        cleaned_lines = []
        for line in lyrics.split("\n"):
            stripped = line.strip()
            # 行全体が (ローマ字) のパターン — ASCII + スペースのみで構成
            if re.match(r'^\([A-Za-z][A-Za-z\s,\.\-\'!?]+\)$', stripped):
                continue
            # 日本語行の末尾に (romaji) が付いている場合、括弧部分だけ除去
            line = re.sub(r'\s*\([A-Za-z][A-Za-z\s,\.\-\'!?]{5,}\)\s*$', '', line)
            cleaned_lines.append(line)
        return "\n".join(cleaned_lines)
    
    async def generate_tags(
        self,
        lyrics: str = "",
        theme: str = "",
        language: str = "Japanese"
    ) -> Dict[str, Any]:
        """
        歌詞/テーマからタグを生成
        
        Args:
            lyrics: 歌詞
            theme: テーマ
            language: 言語
        
        Returns:
            {
                "genre": str,
                "tags": str,
                "bpm": int,
                "key_scale": str
            }
        """
        content = []
        if theme:
            content.append(f"Theme: {theme}")
        if lyrics:
            content.append(f"Lyrics:\n{lyrics[:1000]}")  # 長すぎる場合は切り詰め
        content.append(f"Language: {language}")
        
        prompt = "\n\n".join(content) + "\n\nGenerate music tags in JSON format."
        
        response = await self.chat(
            user_message=prompt,
            system_prompt=TAGS_GENERATE_SYSTEM_PROMPT,
            temperature=0.7
        )
        
        return self._parse_tags_response(response)
    
    async def generate_caption(
        self,
        lyrics: str = "",
        theme: str = "",
        tags: str = "",
        language: str = "Japanese"
    ) -> Dict[str, Any]:
        """
        歌詞/テーマ/タグからナラティブキャプションを生成
        
        ACE-Step の format_input が生成するような、
        楽曲の詳細な自然言語描写を外部LLMで生成する。
        
        Args:
            lyrics: 歌詞
            theme: テーマ
            tags: 既存のタグ（ジャンル等）
            language: 歌唱言語
        
        Returns:
            {"caption": str}
        """
        content = []
        if theme:
            content.append(f"Theme/Concept: {theme}")
        if tags:
            content.append(f"Genre/Style direction: {tags}")
        if lyrics:
            content.append(f"Lyrics (use these to infer mood, pacing, and vocal style):\n{lyrics[:1500]}")
        content.append(f"Vocal language: {language}")
        
        prompt = "\n\n".join(content) + "\n\nWrite a detailed, production-level music caption. Include specific instruments with playing techniques, vocal characteristics, arrangement dynamics, and production style. Be precise and avoid generic descriptions."
        
        response = await self.chat(
            user_message=prompt,
            system_prompt=CAPTION_GENERATE_SYSTEM_PROMPT,
            max_tokens=500,
            temperature=0.8
        )
        
        return {"caption": self._clean_caption(response)}
    
    def _clean_caption(self, response: str) -> str:
        """キャプションレスポンスをクリーンアップ
        
        ACE-Step 1.5 の制約:
        - テキストエンコーダ max_length=256 tokens
        - Constrained decoder: caption < 512 tokens, バッククォート禁止
        - キャプションは英語の自然文パラグラフが最適
        - 改行は避ける（YAML値としてパースされる）
        - ピリオドで終わるのが理想的
        """
        text = response.strip()
        # コードフェンスを除去
        text = re.sub(r'^```\w*\n?', '', text)
        text = re.sub(r'\n?```$', '', text)
        # Note: ... 行を除去
        text = re.sub(r'\n*Note:.*$', '', text, flags=re.IGNORECASE | re.DOTALL)
        # (Note: ...) を除去
        text = re.sub(r'\s*\(Note:.*?\)', '', text, flags=re.IGNORECASE)
        # Markdown太字を除去
        text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
        # バッククォートを除去（ACE-Stepで禁止）
        text = text.replace('`', '')
        # 改行→スペース（YAML値内の改行はパース問題を起こす）
        text = re.sub(r'[\n\r]+', ' ', text)
        # 制御文字を除去（タブ含む）
        text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
        # 連続スペースを整理
        text = re.sub(r'\s{2,}', ' ', text).strip()
        # 480文字を超える場合は文の切れ目で切断（安全マージン）
        if len(text) > 480:
            # ピリオド+スペースまたは文末で切る
            cut = text[:480].rfind('. ')
            if cut > 200:
                text = text[:cut + 1]
            else:
                text = text[:480].rstrip()
                # 最後の不完全な単語を除去
                last_space = text.rfind(' ')
                if last_space > 200:
                    text = text[:last_space]
        # ピリオドで終わっていなければ付加
        if text and not text.endswith('.'):
            text = text.rstrip(',;:') + '.'
        return text
    
    def _parse_tags_response(self, response: str) -> Dict[str, Any]:
        """タグレスポンスをパース"""
        # JSONを抽出
        json_match = re.search(r'\{[^{}]*\}', response, re.DOTALL)
        
        if json_match:
            try:
                data = json.loads(json_match.group())
                return {
                    "genre": data.get("genre", "pop"),
                    "tags": data.get("tags", ""),
                    "bpm": data.get("bpm", 120),
                    "key_scale": data.get("key_scale", "C major")
                }
            except json.JSONDecodeError:
                pass
        
        # パース失敗時のデフォルト
        return {
            "genre": "pop",
            "tags": "piano, emotional",
            "bpm": 120,
            "key_scale": "C major"
        }

    async def generate_theme(
        self,
        genre: str = "",
        language: str = "Japanese"
    ) -> str:
        """
        ジャンルと言語からLLMで曲のテーマ/シナリオを生成

        Args:
            genre: ジャンル
            language: 言語

        Returns:
            テーマ文字列
        """
        import random

        # ジャンル別コンテキスト（世界観、典型的テーマ、雰囲気を指示）
        genre_context = {
            "J-POP": {
                "vibe": "Japanese everyday life, youth, seasons, personal growth",
                "settings": ["school hallway after exams", "convenience store at midnight", "last train home",
                             "apartment balcony in summer", "festival night", "graduation ceremony",
                             "walking home in autumn leaves", "a text message left on read"],
                "emotions": ["bittersweet youth", "quiet determination", "gentle heartbreak", "hopeful anxiety",
                             "nostalgic warmth", "shy confession", "everyday gratitude"],
            },
            "Rock": {
                "vibe": "rebellion, freedom, raw emotion, struggle, passion",
                "settings": ["a highway with no destination", "a rooftop screaming into wind", "a stage on fire",
                             "an abandoned factory", "a garage rehearsal", "the edge of a cliff",
                             "smashing a mirror", "racing through tunnels at night"],
                "emotions": ["burning rage", "desperate freedom", "defiant pride", "raw honesty",
                             "wild abandon", "stubborn resistance", "furious hope"],
            },
            "Ballad": {
                "vibe": "deep emotion, love, loss, memory, intimate confession",
                "settings": ["an empty bench in a park", "a candle burning low", "old photographs",
                             "a piano in an empty room", "a window seat on a rainy day",
                             "a voicemail never deleted", "a faded love letter"],
                "emotions": ["aching tenderness", "quiet devastation", "fragile hope", "deep longing",
                             "gentle sorrow", "unconditional love", "peaceful acceptance"],
            },
            "Anime": {
                "vibe": "epic adventure, friendship, transformation, destiny, battle",
                "settings": ["a portal to another world", "the final boss arena", "a floating castle",
                             "waking up with mysterious powers", "a school hiding a secret",
                             "a sword glowing at dawn", "running toward the enemy line"],
                "emotions": ["burning resolve", "unbreakable bond", "heroic sacrifice", "awakening power",
                             "tearful farewell to a comrade", "overcoming impossible odds"],
            },
            "Hip Hop": {
                "vibe": "street life, hustle, self-expression, social commentary, swagger",
                "settings": ["a recording booth at 4am", "street corner cypher", "a penthouse view",
                             "counting bills in a back room", "a crowd chanting your name",
                             "a basketball court at dusk", "the neighborhood block party"],
                "emotions": ["ruthless ambition", "hungry pride", "street wisdom", "cold confidence",
                             "loyal defiance", "underdog fury", "triumphant return"],
            },
            "R&B": {
                "vibe": "sensuality, smooth romance, late night vibes, intimacy",
                "settings": ["silk sheets and dim lights", "a jazz bar after hours", "slow dancing in a penthouse",
                             "a phone call at 2am", "candlelit dinner for two",
                             "a luxury car ride through the city", "a private beach at sunset"],
                "emotions": ["smoldering desire", "tender seduction", "velvet intimacy", "jealous passion",
                             "sweet surrender", "confident allure", "heartbroken elegance"],
            },
            "Enka": {
                "vibe": "Japanese traditional emotion, sake, journey, unrequited love, harbor towns, seasons",
                "settings": ["a snowy northern port", "a sake bar in a back alley", "a ferry departing at dawn",
                             "a hot spring town in winter", "a lantern-lit bridge at night",
                             "a fishing village at dusk", "a temple bell at year's end"],
                "emotions": ["deep endurance", "sake-soaked loneliness", "stoic devotion", "wind-swept longing",
                             "dignified heartbreak", "autumn melancholy", "ocean-deep sorrow"],
            },
            "EDM": {
                "vibe": "euphoria, festival energy, drop, rave, neon lights, unity",
                "settings": ["a massive festival mainstage", "neon-lit warehouse rave", "sunrise after an all-night set",
                             "hands in the air moment", "laser beams cutting through smoke",
                             "a countdown to the drop", "dancing with 50,000 strangers"],
                "emotions": ["pure euphoria", "electric connection", "unstoppable energy", "collective ecstasy",
                             "adrenaline rush", "transcendent freedom", "pulsing anticipation"],
            },
            "Reggaeton": {
                "vibe": "Latin party, dance floor, sensual movement, tropical heat, club energy",
                "settings": ["a beach club at midnight", "a packed dance floor in San Juan", "a rooftop pool party",
                             "a tropical night drive", "a carnival parade",
                             "VIP section with champagne", "a summer block party"],
                "emotions": ["fiery passion", "sultry confidence", "party fever", "seductive power",
                             "tropical heat", "irresistible groove", "bold desire"],
            },
            "K-POP": {
                "vibe": "polished perfection, youth culture, visual storytelling, empowerment, love concept",
                "settings": ["a choreography practice room", "a neon-lit Seoul street", "a debut stage",
                             "a fan meeting moment", "a music video set with concept art",
                             "a school rooftop confession", "a trendy cafe date"],
                "emotions": ["fierce confidence", "butterfly-stomach crush", "unstoppable charisma",
                             "sweet obsession", "rebellious glamour", "playful flirtation", "heartbreak anthem"],
            },
            "Phonk": {
                "vibe": "dark energy, drift culture, aggressive bass, Memphis underground, nighttime",
                "settings": ["drifting through empty streets", "a neon-lit underground garage", "midnight highway race",
                             "bass shaking a blacked-out car", "a dark alley with fog",
                             "headlights cutting through mist", "a warehouse with subwoofers"],
                "emotions": ["menacing energy", "cold dominance", "predator focus", "dark thrill",
                             "adrenaline rage", "fearless aggression", "shadow confidence"],
            },
            "Chanson": {
                "vibe": "Parisian romance, poetic storytelling, cafe culture, existential beauty, l'amour",
                "settings": ["a rainy Parisian boulevard", "a candlelit cafe in Montmartre", "the Seine at twilight",
                             "an accordion player on a bridge", "a vintage wine bar",
                             "a love letter written in a brasserie", "a flower market in spring"],
                "emotions": ["wistful romance", "philosophical melancholy", "passionate declaration",
                             "elegant heartbreak", "bohemian freedom", "tender irony", "poetic devotion"],
            },
            "Folklore": {
                "vibe": "Andean mountains, nature, spiritual journey, indigenous tradition, earth and sky",
                "settings": ["a mountain path at sunrise", "a village festival with bonfires", "a condor soaring over peaks",
                             "a weaving loom in an ancient home", "a river valley in the Andes",
                             "a starlit altiplano", "a sacred lake reflecting the sky"],
                "emotions": ["ancient reverence", "earthy serenity", "spiritual connection", "mountain solitude",
                             "communal celebration", "wind-carried longing", "timeless peace"],
            },
            "Country": {
                "vibe": "country, acoustic guitar, banjo, fiddle, steel guitar, Nashville, heartland, storytelling",
                "settings": ["a front porch at sunset", "driving down a dirt road",
                             "a barn dance under string lights", "a campfire by a river",
                             "a small-town Friday night", "fields of wheat swaying in the wind"],
                "emotions": ["honest nostalgia", "quiet gratitude", "dusty-road freedom",
                             "homesick warmth", "simple joy", "heartland pride"],
            },
            "Jazz": {
                "vibe": "improvisation, smoke-filled clubs, cool sophistication, swing, blue notes",
                "settings": ["a smoky club at midnight", "a saxophone solo under a streetlamp",
                             "a New Orleans funeral parade", "a whiskey glass on a grand piano",
                             "a rainy night in Harlem", "backstage at a jazz festival"],
                "emotions": ["cool melancholy", "effortless swagger", "blue-note sadness", "spontaneous joy",
                             "late-night introspection", "sensual groove", "bittersweet improvisation"],
            },
            "Lo-Fi": {
                "vibe": "chill study vibes, warm nostalgia, tape hiss, cozy solitude, rainy window",
                "settings": ["a cluttered desk at 3am", "a rainy window with tea", "a vinyl record skipping",
                             "a cozy blanket fort", "a bookshop on a quiet afternoon",
                             "a train ride through countryside", "doodling in a notebook"],
                "emotions": ["gentle melancholy", "cozy loneliness", "warm detachment", "sleepy contentment",
                             "wistful daydream", "quiet focus", "hazy comfort"],
            },
            "City Pop": {
                "vibe": "1980s urban Japan, neon nights, summer drives, sophisticated pop, AOR",
                "settings": ["a skyline drive in a convertible", "a neon-lit Tokyo boulevard at night",
                             "a beachside bar at sunset", "a rooftop pool in Roppongi",
                             "shopping in Harajuku 1983", "a yacht party in the bay"],
                "emotions": ["glamorous longing", "summer night freedom", "urban sophistication",
                             "carefree joy", "retro romance", "breezy confidence", "disco-lit desire"],
            },
            "Electronic": {
                "vibe": "electronic, synth-driven, dance, digital soundscapes, futuristic texture",
                "settings": ["a pulsing dance floor under UV lights", "a dark warehouse with strobes",
                             "a headphone journey through the cosmos", "a data stream visualized as light",
                             "an empty parking garage with echoing bass", "a control room full of oscilloscopes"],
                "emotions": ["electric anticipation", "mechanical euphoria", "digital melancholy",
                             "hypnotic trance", "synthetic warmth", "cold precision", "pulsing desire"],
            },
            "Folk": {
                "vibe": "acoustic, warm, storytelling, campfire, organic, community, earth",
                "settings": ["a campfire under the stars", "a dusty road at harvest time",
                             "a porch with a rocking chair", "a river winding through a valley",
                             "a folk festival in a meadow", "a farmhouse kitchen at dawn"],
                "emotions": ["earthy warmth", "wanderlust", "homesick longing", "simple joy",
                             "communal spirit", "weathered resilience", "open-road freedom"],
            },
            "70s Kayokyoku": {
                "vibe": "1970s Japanese Kayokyoku, retro, nostalgic, analog, dramatic vocal, orchestral arrangement, Showa era",
                "settings": ["a vinyl record spinning in a dim room", "a neon-lit Ginza cabaret",
                             "a steam locomotive departing at night", "a phone booth on a rainy street",
                             "a harbor town with fishing boats", "a dance hall with a mirror ball"],
                "emotions": ["dramatic longing", "Showa-era melancholy", "forbidden love",
                             "glamorous sadness", "passionate farewell", "smoky sentimentality"],
            },
            "80s Folk": {
                "vibe": "1980s Japanese folk pop, acoustic guitar, singer-songwriter, poetic, campus life, youth",
                "settings": ["a university campus in autumn", "a folk bar with dim candles",
                             "walking along train tracks after school", "a rooftop with a guitar at dusk",
                             "a used bookstore in Shimokitazawa", "a coffee shop with handwritten menus"],
                "emotions": ["gentle introspection", "quiet determination", "youthful idealism",
                             "bittersweet first love", "poetic solitude", "warm friendship"],
            },
            "90s J-POP": {
                "vibe": "1990s J-POP, bright, emotional, catchy melody, band sound, Japanese pop golden era, Shibuya-kei",
                "settings": ["a karaoke box with friends", "a school rooftop at lunch break",
                             "a trendy Shibuya street in 1995", "a summer beach trip with the gang",
                             "a live house basement gig", "a purikura booth"],
                "emotions": ["youthful excitement", "carefree summer", "dramatic heartbreak",
                             "energetic optimism", "tearful graduation", "innocent first crush"],
            },
            "New Music": {
                "vibe": "Japanese New Music, singer-songwriter, poetic, mellow, 1970s-1980s acoustic pop, literary",
                "settings": ["a quiet coffee shop on a rainy afternoon", "a seaside town in winter",
                             "a window seat writing in a journal", "an evening walk through a residential street",
                             "a bookshelf filled with poetry", "a midnight kitchen with warm milk"],
                "emotions": ["philosophical calm", "quiet yearning", "literary melancholy",
                             "gentle wisdom", "introspective peace", "understated passion"],
            },
            "Vocaloid": {
                "vibe": "Vocaloid, synthetic voice, electronic, fast tempo, digital, futuristic, internet culture",
                "settings": ["a neon cyber city at midnight", "inside a computer simulation",
                             "a virtual concert with holographic crowd", "a glitching digital world",
                             "a pixelated dream sequence", "racing through fiber optic cables"],
                "emotions": ["hyperactive excitement", "digital heartbreak", "chaotic joy",
                             "existential glitch", "manic determination", "pixelated tears", "electric rebellion"],
            },
            "Children's Song": {
                "vibe": "Japanese children's song, gentle, simple, warm, nursery rhyme, innocent, playful",
                "settings": ["a kindergarten playground in spring", "chasing butterflies in a flower field",
                             "a sunny day with fluffy clouds", "splashing in puddles after rain",
                             "counting stars with grandma", "a picnic under a big tree"],
                "emotions": ["innocent wonder", "pure happiness", "playful curiosity",
                             "warm security", "giggly excitement", "sleepy contentment"],
            },
            "Min'yo": {
                "vibe": "Japanese Min'yo folk song, traditional, regional, shakuhachi, taiko, pentatonic scale, harvest, festival",
                "settings": ["a village festival with lanterns", "rice paddies at harvest time",
                             "a mountain path with morning mist", "a fishing boat heading out at dawn",
                             "a Bon Odori dance circle", "a temple courtyard in autumn"],
                "emotions": ["communal spirit", "ancestral pride", "seasonal gratitude",
                             "earthy reverence", "festive energy", "ocean-deep patience"],
            },
            "Trance": {
                "vibe": "trance, uplifting synth, euphoric, ethereal, driving beat, 138 BPM, soaring melody",
                "settings": ["a massive festival stage at night", "lasers cutting through fog on a dance floor",
                             "flying above neon-lit clouds", "a sunrise over an endless ocean",
                             "stars spiraling in a planetarium", "a rooftop rave above the city skyline"],
                "emotions": ["pure euphoria", "transcendent bliss", "weightless ascent",
                             "cosmic unity", "radiant energy", "infinite horizon"],
            },
            "Mood": {
                "vibe": "mood lounge, smooth jazz, saxophone, romantic, late night, sophisticated, cocktail",
                "settings": ["a dimly lit jazz lounge", "a penthouse with city lights below",
                             "slow dancing in an empty ballroom", "a cocktail bar at closing time",
                             "a vinyl record playing in a candlelit room", "a luxury hotel lobby at midnight"],
                "emotions": ["sensual sophistication", "velvet intimacy", "smoky allure",
                             "elegant loneliness", "romantic suspense", "bittersweet luxury"],
            },
            "Driving": {
                "vibe": "refreshing drive, breezy, bright guitar, sunny, coastal, open road, uplifting",
                "settings": ["cruising along a sunlit coastal road", "gentle curves through rolling green hills",
                             "a seaside highway with ocean sparkling beside you", "an open-top car through lavender fields",
                             "a country road lined with swaying trees", "a bridge over a calm river at golden hour"],
                "emotions": ["carefree bliss", "sun-kissed freedom", "refreshing breeze",
                             "gentle exhilaration", "warm wanderlust", "effortless joy"],
            },
            "Acoustic Pop": {
                "vibe": "acoustic pop, fingerpicking guitar, gentle vocals, intimate, warm, cafe, singer-songwriter",
                "settings": ["a sunny cafe terrace", "an open mic night at a cozy bar",
                             "a park bench with a guitar case", "a kitchen table recording session",
                             "morning light through linen curtains", "a bookshop corner with soft music"],
                "emotions": ["warm sincerity", "quiet contentment", "gentle affection",
                             "unfiltered honesty", "breezy optimism", "tender simplicity"],
            },
            "Bossa Nova": {
                "vibe": "Bossa nova, Brazilian jazz, gentle nylon guitar, soft percussion, cafe, Rio de Janeiro, warm breeze",
                "settings": ["a beachside cafe in Ipanema", "a hammock on a Brazilian terrace",
                             "a sunset stroll on Copacabana", "a candlelit bar in a Rio side street",
                             "a lazy Sunday with fresh coffee", "waves lapping at a wooden pier"],
                "emotions": ["warm relaxation", "sun-kissed contentment", "gentle saudade",
                             "breezy romance", "effortless cool", "tropical daydream"],
            },
        }

        # ジャンル名の正規化（部分一致でコンテキスト取得）
        genre_key = genre or "J-POP"
        ctx = genre_context.get(genre_key)
        if not ctx:
            # 部分一致を試す
            genre_lower = genre_key.lower()
            for k, v in genre_context.items():
                if k.lower() in genre_lower or genre_lower in k.lower():
                    ctx = v
                    break
        if not ctx:
            # デフォルトコンテキスト
            ctx = {
                "vibe": "emotional, personal, vivid imagery",
                "settings": ["a quiet room", "a busy street", "a window at night",
                             "a journey by train", "a secret place", "a moment of change"],
                "emotions": ["quiet hope", "gentle sorrow", "wild joy", "subtle fear",
                             "warm gratitude", "restless desire"],
            }

        setting = random.choice(ctx["settings"])
        emotion = random.choice(ctx["emotions"])

        # 汎用の切り口プールも残す（ただしジャンルの雰囲気と組み合わせる）
        angles_pool = [
            "as a first-person confession", "as a letter never sent",
            "as one vivid scene frozen in time", "as a conversation between strangers",
            "as a dream that feels real", "from the perspective of an observer",
            "as the last moment before everything changes", "as a memory resurfacing",
            "through the eyes of someone leaving", "as a promise whispered",
            "as a single unforgettable image", "as a question with no answer",
        ]
        angle = random.choice(angles_pool)

        system_prompt = f"""You are a music theme generator specialized in {genre_key} music.
Generate a single short, vivid song theme/scenario (3-10 words MAX) that perfectly fits the {genre_key} genre.
Output ONLY the theme text. No quotes, no explanation.
Do NOT add romanization, pronunciation, or translations in parentheses.

GENRE ESSENCE: {ctx['vibe']}

STRICT RULES:
- The theme MUST feel natural for a {genre_key} song — imagine it as a real song title or concept
- NEVER use these overused words: rain, sunset, cherry blossoms, merry-go-round, twilight, starlight, moonlight, silhouette, horizon, forgotten, nostalgia, 雨上がり, 茜色, 忘れられた, メリーゴーランド, 夕焼け, シルエット
- Be SPECIFIC and CONCRETE — use unexpected nouns, places, objects
- Keep it SHORT: 3-10 words maximum
- It should feel like a real {genre_key} song title or concept"""

        lang_instruction = f"Write the theme in {language}." if language != "English" else ""
        user_message = f"""Genre: {genre_key}
Scene inspiration: {setting}
Emotional tone: {emotion}
Creative approach: {angle}
{lang_instruction}

Generate one original {genre_key} song theme:""".strip()

        try:
            response = await self.chat(
                user_message=user_message,
                system_prompt=system_prompt,
                max_tokens=60,
                temperature=1.2
            )
            # 余分なクォートや改行を除去
            theme = response.strip().strip('"').strip("'").strip()
            # 複数行が返った場合は最初の行だけ
            if '\n' in theme:
                theme = theme.split('\n')[0].strip()
            # 括弧内のローマ字/翻訳を除去
            import re
            theme = re.sub(r'\s*[\(（].*?[\)）]\s*$', '', theme).strip()
            # 長すぎる場合は句読点で切る
            if len(theme) > 30:
                for sep in ['、', '。', '，', ', ', '. ']:
                    if sep in theme[:30]:
                        theme = theme[:theme.index(sep, 0, 30)].strip()
                        break
            return theme
        except Exception as e:
            import logging
            logging.getLogger(__name__).warning(f"Theme generation failed: {e}")
            return genre or "music"

    async def generate_full(
        self,
        theme: str,
        genre: str = "",
        language: str = "Japanese",
        mood: str = ""
    ) -> Dict[str, Any]:
        """
        歌詞とタグを一括生成
        
        Args:
            theme: テーマ
            genre: ジャンル
            language: 言語
            mood: ムード
        
        Returns:
            歌詞とタグの両方を含む辞書
        """
        # 歌詞生成
        lyrics_result = await self.generate_lyrics(
            theme=theme,
            genre=genre,
            language=language,
            mood=mood
        )
        
        # タグ生成
        tags_result = await self.generate_tags(
            lyrics=lyrics_result["lyrics"],
            theme=theme,
            language=language
        )
        
        return {
            **lyrics_result,
            **tags_result
        }


# シングルトンインスタンス
llm_service = LLMService()
