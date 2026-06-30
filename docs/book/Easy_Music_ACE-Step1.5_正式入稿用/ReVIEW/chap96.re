= Easy Music技術詳細説明

本章では、Easy Musicの内部実装を技術的に解説します。バックエンドAPI、サービス層、フロントエンドの設計と実装の詳細を、コードベースに基づいて説明します。

//blankline

== アプリケーション全体アーキテクチャ

Easy Musicは3層構造のWebアプリケーションです。

Easy Musicは、次の3層で構成されます。

 * ブラウザ層: `static/app.js`と`templates/index.html`が、i18n、ジャンルUI、おまかせ生成、Cover、Repaint、JUKEBOX、インラインプレーヤー、ビジュアライザー、生成履歴を担当します。
 * FastAPIサーバー層: `main.py`が8889番ポートで起動し、`routers/generate.py`、`routers/lyrics.py`、`services/ace_step_client.py`、`services/llm_service.py`、`services/local_llm_service.py`を通じてAPI処理とLLM連携を行います。
 * ACE-Step APIサーバー層: 8001番ポートで起動し、`POST /release_task`、`POST /query_result`、`POST /format_input`、`POST /create_random_sample`、`GET /v1/models`、`GET /v1/stats`、`GET /health`、`GET /v1/audio?path=`を提供します。

ブラウザ層とFastAPIサーバー層はfetch APIで通信し、FastAPIサーバー層とACE-Step APIサーバー層はhttpxによるHTTP通信で連携します。
//blankline

== ファイル構成（バックエンド）

//table[chap96t001][ファイル構成（バックエンド）の一覧]{
ファイル	行数	責務
------------
main.py	約180行	FastAPIアプリ初期化、ミドルウェア、ルーター登録
config.py	約190行	pydantic-settings + CLI引数マージ
routers/generate.py	約850行	音楽生成の全エンドポイント
routers/lyrics.py	約390行	LLM作詞・テーマ・タグ・キャプション生成、曲名・可視化補助
services/acestepclient.py	約465行	ACE-Step APIクライアント
services/llm_service.py	約1,240行	LLMサービス（プロンプト設計含む）
services/localllmservice.py	約170行	ローカルLLM（Qwen3-1.7B）
//}
//blankline

== ファイル構成（フロントエンド）

//table[chap96t002][ファイル構成（フロントエンド）の一覧]{
ファイル	行数	責務
------------
static/app.js	約4,000行	全クライアントロジック
templates/index.html	約540行	HTML + 30ジャンルタイル
static/style.css	—	スタイルシート
//}
//blankline

Easy Musicのフロントエンドは、ReactやVueのようなフレームワークを使わず、HTML・CSS・JavaScriptで直接構成されています。これにより、Node.jsベースのビルド環境を追加せずに運用でき、Python中心の構成を保ったままデバッグや改修を進めやすくなっています。一方で、機能がさらに大規模化した場合には、責務分割やコンポーネント化の再設計が課題になります。

//blankline

== バックエンドAPI実装詳解

== FastAPIアプリケーション構成（main.py）

=== NoCacheStaticMiddleware

開発効率向上のため、静的ファイルにキャッシュ無効化ヘッダーを付与するPure ASGIミドルウェアを実装しています。

//listnum[chap96l002][NoCacheStaticMiddlewareの例]{
class NoCacheStaticMiddleware:
    """静的ファイルに no-cache ヘッダーを付与する Pure ASGI ミドルウェア"""
    async def __call__(self, scope, receive, send):
        path = scope.get("path", "")
        if not path.startswith("/static/"):
            await self.app(scope, receive, send)
            return
        # /static/ 配下のレスポンスに以下のヘッダーを注入:
        # Cache-Control: no-cache, no-store, must-revalidate
        # Pragma: no-cache
        # Expires: 0
//}
//blankline

これにより、app.jsやstyle.cssの変更が即座にブラウザに反映されます。

=== 起動イベント

//listnum[chap96l003][起動イベントの例]{
@app.on_event("startup")
async def startup_event():
    settings.apply_cli_args(sys.argv[1:])  # CLI引数を設定に反映
    ace_step_client.base_url = settings.ace_step_api_url
//}
//blankline

applycliargs() はargparseでCLI引数をパースし、settingsオブジェクトのフィールドを上書きします。

== routers/generate.py — GenerateRequestモデル

音楽生成リクエストの全フィールドを定義するPydanticモデルです。

//listnum[chap96l004][routers/generate.py — GenerateRequestモデルの例]{
class GenerateRequest(BaseModel):
    # 基本パラメータ
    prompt: str                    # キャプション（音楽の説明文）
    lyrics: str                    # 歌詞（セクションタグ付き）
    thinking: bool = True          # LMでの高品質生成
    model: Optional[str]           # DiTモデル名
    vocal_language: str = "ja"     # ボーカル言語
    audio_duration: int = 60       # 生成時間（秒）、-1=自動
    
    # 音楽パラメータ
    bpm: Optional[int]             # テンポ（30〜300）
    key_scale: Optional[str]       # 調（例: "C major"）
    time_signature: str = "4"      # 拍子
    batch_size: int = 1            # 同時生成曲数（1〜4）
    audio_format: str = "mp3"      # 出力形式
    seed: Optional[int]            # 再現用シード値
    inference_steps: int = 150     # 推論ステップ数（1〜200）
    instrumental: bool = False     # インストゥルメンタルモード
    sample_query: Optional[str]    # おまかせ生成クエリ
    
    # 推論パラメータ
    guidance_scale: float = 3.0    # CFGスケール（0.0〜20.0）
    shift: Optional[float]         # タイムステップシフト（1.0〜5.0）
    infer_method: Optional[str]    # 推論方式: ODE / SDE
    
    # LMパラメータ
    lm_temperature: Optional[float]
    lm_cfg_scale: Optional[float]
    lm_top_p: Optional[float]
    use_cot_caption: Optional[bool]
    use_cot_language: Optional[bool]
    use_cot_metas: Optional[bool]
    lm_negative_prompt: Optional[str]
//}
//blankline

合計25フィールド。Optionalパラメータはフロントエンドから送信された場合のみextra_paramsとしてACE-Step APIに転送されます。

== sanitize_caption() — キャプション整形

ACE-Step 1.5のtext_encoder制約に合わせてキャプションを整形する関数です。バックエンド（routers/generate.py）とフロントエンド（app.js）の両方に同じロジックが実装されています（二重安全設計）。

//listnum[chap96l005][sanitize_caption() — キャプション整形の例]{
def sanitize_caption(text: str) -> str:
    # Step 1: バッククォート除去（ACE-Stepが禁止文字として扱う）
    text = text.replace('`', '')
    
    # Step 2: 改行→スペース（YAML値としてパースされるため）
    text = re.sub(r'[\n\r]+', ' ', text)
    
    # Step 3: 制御文字除去
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    
    # Step 4: Markdown記法除去（**bold** / *italic*）
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    
    # Step 5: 連続スペース整理
    text = re.sub(r'\s{2,}', ' ', text).strip()
    
    # Step 6: 480文字制限（文境界優先で切り詰め）
    if len(text) > 480:
        cut = text[:480].rfind('. ')
        if cut > 200:
            text = text[:cut + 1]      # ピリオド+スペースの位置で切断
        else:
            text = text[:480].rstrip()
            last_space = text.rfind(' ')
            if last_space > 200:
                text = text[:last_space]  # 単語境界で切断
    
    # Step 7: ピリオド終端の保証
    if text and not text.endswith('.'):
        text = text.rstrip(',;:') + '.'
    
    return text
//}
//blankline

=== なぜ480文字なのか

ACE-Step 1.5のtext_encoder（Qwen3-Embedding-0.6B）は最大256トークンを受け付けます。constrained decoderのキャプション上限は512トークンです。英語テキストでは1トークン≒4文字であるため、480文字は256トークンに対する安全マージンです。

== タスク作成フロー

//listnum[chap96l006][タスク作成フローの例]{
フロントエンド → POST /api/generate → sanitize_caption() →
    ace_step_client.release_task() → ACE-Step /release_task →
    task_id返却 → フロントエンドがポーリング開始
//}
//blankline

=== seed値の自動生成

//listnum[chap96l007][seed値の自動生成の例]{
import random
effective_seed = request.seed if request.seed is not None else random.randint(0, 2**31 - 1)
//}
//blankline

seedが未指定の場合、ランダムなseed値を生成してレスポンスに含めます。これによりユーザーが気に入った曲のseed値を記録し、再現することが可能です。

== ステータスポーリング

//listnum[chap96l008][ステータスポーリングの例]{
@router.get("/status/{task_id}")
async def get_task_status(task_id: str):
    # status: 0=processing, 1=succeeded, 2=failed
    # 一時的な接続エラー時もstatus=0を返してフロントエンドにリトライさせる
//}
//blankline

この設計により、ACE-Step APIへの一時的なネットワーク寸断が発生しても、フロントエンドはポーリングを継続し、接続回復後に正常完了できます。

== カバーモード — guidance_scaleの自動補正

//listnum[chap96l009][カバーモード — guidance_scaleの自動補正の例]{
@router.post("/generate_cover")
async def generate_cover(..., audio_cover_strength: float = Form(default=0.8), ...):
    effective_cfg = guidance_scale
    if audio_cover_strength < 1.0:
        effective_cfg = 1.0  # カバー時は最低1.0に補正
//}
//blankline

ACE-Step 1.5では、カバー生成時にguidance_scaleが低すぎると品質が著しく低下します。Easy Musicはこれを自動的に補正します。

== 音声プロキシ

//listnum[chap96l010][音声プロキシの例]{
@router.get("/audio")
async def proxy_audio(path: str):
    # ACE-Step APIの音声URLをCORS回避のために中継
    # 最大3回リトライ
//}
//blankline

ブラウザからACE-Step API（別ポート）の音声ファイルに直接アクセスするとCORSエラーが発生するため、Easy Musicサーバーがプロキシとして中継します。

//blankline

== サービス層の実装

== AceStepClient（services/acestepclient.py）

ACE-Step 1.5 APIとの全HTTP通信を担当するクライアントクラスです。

=== データモデル

//listnum[chap96l011][データモデルの例]{
class TaskStatus(Enum):
    PROCESSING = 0    # 処理中
    SUCCEEDED  = 1    # 成功
    FAILED     = 2    # 失敗

class TaskType(Enum):
    TEXT2MUSIC = "text2music"
    COVER      = "cover"
    REPAINT    = "repaint"

@dataclass
class AudioMetadata:
    bpm: Optional[int]
    duration: Optional[float]
    genres: Optional[str]
    keyscale: Optional[str]
    timesignature: Optional[str]

@dataclass
class TaskResult:
    file: str
    status: int
    create_time: int
    url: Optional[str]
    prompt: Optional[str]
    lyrics: Optional[str]
    metas: Optional[AudioMetadata]
    seed_value: Optional[str]
//}
//blankline

=== 主要メソッド

//table[chap96t003][主要メソッドの一覧]{
メソッド	説明
------------
release_task()	JSON POSTでタスクを作成（通常生成）
releasetaskmultipart()	multipart POSTでタスクを作成（Cover/Repaint）
query_result()	タスクのステータスを照会
waitforcompletion()	同期的にポーリングして完了を待つ
format_input()	AI強化（キャプション詳細化＋BPM/Key取得）
createrandomsample()	ランダムサンプルの取得
getaudiourl()	音声ファイルのURLを構築
//}
//blankline

=== Bearer Token認証

//listnum[chap96l012][Bearer Token認証の例]{
headers = {"Content-Type": "application/json"}
if self.api_key:
    headers["Authorization"] = f"Bearer {self.api_key}"
//}
//blankline

ACESTEPAPI_KEY環境変数が設定されている場合、リクエストにBearerトークンが自動付与されます。

== LLMService（services/llm_service.py）

外部LLM（Ollama/OpenAI互換API）との通信を担当するサービスクラスです。約1,240行に及ぶ最大のモジュールです。

=== 4つのシステムプロンプト

//table[chap96t004][4つのシステムプロンプトの一覧]{
プロンプト名	用途	要点
------------
LYRICSGENERATESYSTEM_PROMPT	歌詞生成	JSON metadata行 → セクションタグ付き歌詞。ローマ字厳禁。セクションごとの行数ガイド
TAGSGENERATESYSTEM_PROMPT	タグ生成	JSON出力: genre/tags/bpm/key_scale。楽器はtagsに含めない
CAPTIONGENERATESYSTEM_PROMPT	キャプション（Thinking ON）	1文30〜60語。ジャンル+年代+ムード+ボーカル。楽器・ミックス指定不可
CAPTIONGENERATEDETAILED_PROMPT	キャプション（Thinking OFF）	3〜5文100〜200語。ジャンル+ムード+楽器+リズム+ボーカル+制作テクスチャ
//}
//blankline

=== ジャンル別テーマコンテキスト（31ジャンル分）

//listnum[chap96l013][ジャンル別テーマコンテキスト（31ジャンル分）の例]{
genre_contexts = {
    "J-POP": {
        "vibe": "青春、恋愛、友情、夢、季節の移ろい…",
        "settings": ["放課後の教室", "桜並木の通学路", "夏祭りの夜", ...],
        "emotions": ["初恋の胸の高鳴り", "卒業の切なさ", ...]
    },
    "Rock": { ... },
    "Jazz": { ... },
    # ... 計31ジャンル
}
//}
//blankline

テーマ生成時に、ジャンル固有のコンテキスト（雰囲気・設定・感情）からランダムに要素を選び、LLMへの指示に含めます。

=== テーマ生成の仕組み

//listnum[chap96l014][テーマ生成の仕組みの例]{
async def generate_theme(self, genre: str, language: str = "ja") -> str:
    # 12の創作アングルからランダム選択
    approaches = [
        "時間帯と場所を組み合わせた情景描写",
        "特定の感情の瞬間を切り取る",
        "季節感のある物語",
        # ... 計12パターン
    ]
    # temperature=1.2 で多様性を確保
    # 30文字以内の制限
//}
//blankline

=== 歌詞生成のリトライ機構

//listnum[chap96l015][歌詞生成のリトライ機構の例]{
async def generate_lyrics(self, theme, genre, language, mood, vocal_type):
    for attempt in range(2):  # 最大2回試行
        response = await client.chat.completions.create(
            model=self._effective_model(),
            temperature=0.85,
            messages=[
                {"role": "system", "content": LYRICS_GENERATE_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ]
        )
        lyrics = response.choices[0].message.content
        lyrics = self._strip_romaji_lines(lyrics)  # ローマ字行を除去
        if self._validate_lyrics(lyrics):
            return lyrics
    return lyrics  # バリデーション失敗でもそのまま返す
//}
//blankline

=== stripromaji_lines — ローマ字行の自動除去

LLMが日本語歌詞の横にローマ字読みを付加することがあります（例: 星の海に (Hoshi no umi ni)）。これを自動検出して除去します。

=== cleancaption — キャプション後処理

//listnum[chap96l016][cleancaption — キャプション後処理の例]{
def _clean_caption(self, text: str) -> str:
    # コードフェンス（```）除去
    # Markdown除去
    # 480文字切り詰め
    # ピリオド終端保証
//}
//blankline

sanitize_caption() と同様のロジックをLLMレスポンスの後処理として実行します。

=== フォールバックチェーン

//listnum[chap96l017][フォールバックチェーンの例]{
try:
    # 外部LLM（Ollama等）に問い合わせ
    response = await self._client.chat.completions.create(...)
except Exception:
    try:
        # ローカルLLMにフォールバック
        response = await local_llm_service.chat(...)
    except Exception:
        raise ConnectionError("LLM接続不可")
//}
//blankline

== LocalLLMService（services/localllmservice.py）

内蔵ローカルLLM（Qwen3-1.7B-Q4KM.gguf）を管理するサービスです。

=== モデル仕様

//table[chap96t005][モデル仕様の一覧]{
項目	値
------------
モデル	Qwen3-1.7B-Q4KM.gguf
リポジトリ	unsloth/Qwen3-1.7B-GGUF
保存先	models/ ディレクトリ
量子化	Q4KM（4ビット量子化）
コンテキスト長	4,096トークン
スレッド数	4
GPU	不使用（ngpulayers=0）
//}
//blankline

=== Qwen3のThinkingモード制御

//listnum[chap96l018][Qwen3のThinkingモード制御の例]{
# /no_think サフィックスでQwen3の内部思考を無効化
system_prompt = system_prompt + "/no_think"

# レスポンスからthinkブロックを除去
output = remove_think_block(output)
//}
//blankline

Qwen3はデフォルトでthinkタグ内に思考プロセスを出力します。Easy Musicでは内部思考を無効化し、万が一出力された場合も後処理で除去します。

=== 推論パラメータ

//listnum[chap96l019][推論パラメータの例]{
response = self.model.create_chat_completion(
    messages=messages,
    temperature=temperature,
    top_p=0.8,
    top_k=20,
    repeat_penalty=1.3,
    max_tokens=max_tokens
)
//}
//blankline

=== 非同期実行

//listnum[chap96l020][非同期実行の例]{
# llama-cpp-python は同期APIのため、run_in_executor で非同期化
loop = asyncio.get_event_loop()
result = await loop.run_in_executor(None, sync_chat_function)
//}
//blankline


== フロントエンド実装詳解

== i18n（国際化）システム

Easy Musicは日本語と英語のバイリンガルUIを実装しています。

=== 構造

//listnum[chap96l021][構造の例]{
const I18N = {
    ja: {
        label_theme: "テーマ / シナリオ",
        btn_generate: " 音楽を生成",
        // ... 142キー
    },
    en: {
        label_theme: "Theme / Scenario",
        btn_generate: " Generate Music",
        // ... 142キー
    }
};
//}
//blankline

=== 適用メカニズム

//listnum[chap96l022][適用メカニズムの例]{
let currentUILang = localStorage.getItem('easymusic_uilang') || 'ja';

function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = I18N[currentUILang][el.dataset.i18n];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = I18N[currentUILang][el.dataset.i18nPlaceholder];
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.title = I18N[currentUILang][el.dataset.i18nTitle];
    });
}
//}
//blankline

3種類のHTML属性（data-i18n、data-i18n-placeholder、data-i18n-title）に対応し、localStorageで言語設定を永続化します。

== 生成パイプライン（generateSimple関数）

generateSimple() はEasy Musicのメイン生成関数です。10段階のフローを制御します。

`generateSimple()`は次の10段階で処理を進めます。

 1. モード判定: Coverなら`generateCover()`、Repaintなら`generateRepaint()`、おまかせなら`/api/format_input`へ進みます。通常モードでは次のテーマ生成へ進みます。
 2. テーマ生成: テーマ欄が空の場合、`POST /api/theme`でテーマテキストを取得します。
 3. 歌詞生成: 歌詞欄が空の場合、`POST /api/lyrics`でセクション付き歌詞を取得します。
 4. キャプション生成: Thinking ONでは`POST /api/caption`に`thinking: true`を渡して1文のキャプションを生成します。Thinking OFFでは`thinking: false`を渡して3〜5文のキャプションを生成します。
 5. キャプション整形: `sanitizeCaption()`が480文字制限、バッククォート除去、ピリオド終端を行います。
 6. AI強化: キャプション自動がONの場合、`POST /api/format_input`でBPMやKeyを追加し、キャプションを詳細化します。
 7. パラメータ構築: `/api/generate`へ送るパラメータを組み立て、`task_id`を取得します。
 8. ポーリング: `GET /api/status/{task_id}`を最大600回、1秒間隔で呼び出します。
 9. 進捗表示: `smoothProgress()`で滑らかなプログレス表示を行います。
 10. 完了処理: `isSilentAudio()`で無音を検出した場合はリトライ通知を出し、正常時は`showInlinePlayer()`と`playSimpleTrack(0)`で生成結果を再生します。
//blankline

== 生成時間推定（estimateGenerationTime関数）

//listnum[chap96l024][生成時間推定（estimateGenerationTime関数）の例]{
function estimateGenerationTime(params) {
    const steps = params.inference_steps || 150;
    const duration = params.audio_duration > 0 ? params.audio_duration : 120;
    const batch = params.batch_size || 1;
    const isBase = params.model === 'acestep-v15-base';
    
    const lmTime = params.thinking !== false ? 4 : 1.5;      // LM推論時間
    const ditTime = steps * duration * (isBase ? 0.009 : 0.006); // DiT生成時間
    const batchFactor = 1 + (batch - 1) * 0.8;                // バッチスケーリング
    const overhead = 2;                                         // オーバーヘッド
    const estimated = (lmTime + ditTime * batchFactor + overhead) * 1.3;
    
    return Math.max(8, Math.min(600, estimated));  // 8〜600秒にクランプ
}
//}
//blankline

//table[chap96t006][生成時間推定（estimateGenerationTime関数）の一覧]{
変数	計算式	意味
------------
lmTime	thinking ? 4 : 1.5	LMの推論時間（秒）
ditTime	steps × duration × 係数	DiTモデルの推論時間
係数	Turbo: 0.006 / Base: 0.009	1ステップ1秒あたりの時間
batchFactor	1 + (batch - 1) × 0.8	バッチ並列度の効率
最終値	(lm + dit×batch + 2) × 1.3	安全マージン30%込み
//}
//blankline

== プログレスバー（smoothProgress関数）

//listnum[chap96l025][プログレスバー（smoothProgress関数）の例]{
function smoothProgress(elapsedSec, expectedSec) {
    const ratio = elapsedSec / expectedSec;
    if (ratio <= 0.15) return 5 + (ratio / 0.15) * 10;         // 5% → 15%
    if (ratio <= 0.85) return 15 + ((ratio - 0.15) / 0.7) * 70; // 15% → 85%
    if (ratio <= 1.0)  return 85 + ((ratio - 0.85) / 0.15) * 10; // 85% → 95%
    return Math.min(95, 95 + (ratio - 1.0) * 2);                // 漸近的に95%
}
//}
//blankline

区分線形のイージングカーブにより、人間に自然に感じられるプログレス表示を実現します。完了前は95%を超えず、ACE-Stepからの完了通知を受けて100%に跳ねます。

== JUKEBOXモード（jukeboxLoop関数）

 1. ジャンル配列からランダムに1つ選び、generateSimple()で1曲生成する。このとき guidance_scale = 18.0

 2. 再生を開始し、再生中に次の曲を別ジャンルでgenerateSimple()してプリフェッチを開始する

 3. 現在の曲が終了したら、プリフェッチ済みの曲を再生し、1に戻る

補足:

 * 失敗時は最大3回リトライする
 * 3回連続で失敗した場合は自動停止する
 * ビジュアライザーモードはランダムに切り替わる

JUKEBOXではguidance_scaleが通常の3.0ではなく18.0に設定されます。これは多ジャンル横断の自動生成で安定した品質を得るための設計判断です。

== カバー/リペイント（generateCover / generateRepaint）

//listnum[chap96l026][カバー/リペイント（generateCover / generateRepaint）の例]{
// FormData構築 → multipart POST
const formData = new FormData();
formData.append('src_audio', fileInput.files[0]);
formData.append('prompt', caption);
formData.append('audio_cover_strength', strengthSlider.value / 100);
// ...
const response = await fetch('/api/generate_cover', {
    method: 'POST',
    body: formData  // Content-Type: multipart/form-data（自動設定）
});
//}
//blankline

ファイルアップロードを含むため、JSONではなくmultipart/form-dataで送信します。

//blankline

== キャプション整形の詳細（sanitizeCaption — フロントエンド版）

フロントエンド（app.js）にも同一ロジックのsanitizeCaptionが実装されています。

//listnum[chap96l027][キャプション整形の詳細（sanitizeCaption — フロントエンド版）の例]{
function sanitizeCaption(text) {
    if (!text) return text;
    text = text.replace(/`/g, '');                           // バッククォート除去
    text = text.replace(/[\n\r]+/g, ' ');                    // 改行→スペース
    text = text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, ''); // 制御文字
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');             // **bold**
    text = text.replace(/\*(.*?)\*/g, '$1');                 // *italic*
    text = text.replace(/\s{2,}/g, ' ').trim();              // 連続スペース

    if (text.length > 480) {
        const cut = text.lastIndexOf('. ', 480);
        if (cut > 200) {
            text = text.substring(0, cut + 1);
        } else {
            text = text.substring(0, 480).trim();
            const lastSpace = text.lastIndexOf(' ');
            if (lastSpace > 200) text = text.substring(0, lastSpace);
        }
    }
    if (text && !text.endsWith('.')) {
        text = text.replace(/[,;:]+$/, '') + '.';
    }
    return text;
}
//}
//blankline

バックエンド（Python版）とフロントエンド（JavaScript版）の二重整形により、どちらのルートからキャプションが入力されても、ACE-Step 1.5の制約に適合します。

//blankline

== 無音検出アルゴリズム（isSilentAudio）

生成された楽曲が無音（生成失敗）であることを自動検出する機能です。

//listnum[chap96l028][無音検出アルゴリズム（isSilentAudio）の例]{
async function isSilentAudio(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    
    // ファイルサイズが1000バイト未満 → 無音
    if (arrayBuffer.byteLength < 1000) return true;
    
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // 先頭0.5秒をスキップ（リードイン）
    const skipSamples = Math.floor(audioBuffer.sampleRate * 0.5);
    
    // 全チャンネルのRMSとピーク値を計算
    let totalRms = 0;
    let globalPeak = 0;
    for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
        const channelData = audioBuffer.getChannelData(ch);
        let sumSquares = 0;
        for (let i = skipSamples; i < channelData.length; i++) {
            const sample = channelData[i];
            sumSquares += sample * sample;
            if (Math.abs(sample) > globalPeak) {
                globalPeak = Math.abs(sample);
            }
        }
        totalRms += Math.sqrt(sumSquares / (channelData.length - skipSamples));
    }
    const avgRms = totalRms / audioBuffer.numberOfChannels;
    
    // 判定: RMS < 0.005 (-46 dBFS) AND ピーク < 0.02 → 無音
    return avgRms < 0.005 && globalPeak < 0.02;
}
//}
//blankline

== 判定閾値

//table[chap96t007][判定閾値の一覧]{
指標	閾値	dBFS換算
------------
RMS	< 0.005	< -46 dBFS
ピーク	< 0.02	< -34 dBFS
ファイルサイズ	< 1000 bytes	—
//}
//blankline

両条件を同時に満たす場合にのみ「無音」と判定します。先頭0.5秒はリードインとしてスキップし、実際の音楽コンテンツ部分で判定します。

//blankline

== 設定システム（config.py）

pydantic-settingsのBaseSettingsを使用した設定管理システムです。

== 設定の読み込み順序

//listnum[chap96l029][設定の読み込み順序の例]{
class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",           # .envファイルを自動読み込み
        env_file_encoding="utf-8",
        extra="ignore"             # 未知の環境変数を無視
    )
//}
//blankline

== .envファイルの自動探索

//listnum[chap96l030][.envファイルの自動探索の例]{
def _find_env_file() -> Optional[str]:
    """プロジェクトルートまたは親ディレクトリの.envファイルを探索"""
    candidates = [
      _BASE_DIR / ".env",
      _BASE_DIR.parent / ".env",
    ]
    for candidate in candidates:
      if candidate.exists() and candidate.is_file():
        return str(candidate)
    return None
//}
//blankline

== CLI引数のマージ

//listnum[chap96l031][CLI引数のマージの例]{
def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', type=str)
    parser.add_argument('--port', type=int)
    parser.add_argument('--ace-url', type=str)
    parser.add_argument('--ace-host', type=str)
    parser.add_argument('--ace-port', type=int)
    parser.add_argument('--llm-url', type=str)
    parser.add_argument('--llm-host', type=str)
    parser.add_argument('--llm-port', type=int)
    parser.add_argument('--llm-model', type=str)
    parser.add_argument('--img-url', type=str)
    parser.add_argument('--img-host', type=str)
    parser.add_argument('--img-port', type=int)
    parser.add_argument('--img-fallback-url', type=str)
    parser.add_argument('--img-health-interval', type=float)
    parser.add_argument('--local-llm', action='store_true')
    parser.add_argument('--no-reload', action='store_true')
    args, _unknown = parser.parse_known_args()
    return args
//}
//blankline

== 設定の全体像

//table[chap96t008][設定の全体像の一覧]{
分類	設定項目	型	デフォルト値
------------
ACE-Step	acestepapi_url	str	http://localhost:8001
ACE-Step	acestepapi_key	str	""
LLM	openaibaseurl	str	http://localhost:11434/v1
LLM	openaiapikey	str	"YOUROPENAIAPI_KEY"
LLM	openaichatmodel	str	"gemma4:latest"
LLM	uselocalllm_only	bool	False
画像	imagegenerationurl	str	"http://IMAGE_SERVER_IP:64656"
画像	imagegenerationfallback_url	str	"http://FALLBACK_SERVER_IP:64656"
画像	imagegenerationtimeout	float	90.0
画像	imagegenerationhealthcheckinterval	float	30.0
サーバー	host	str	"0.0.0.0"
サーバー	port	int	8889
サーバー	debug	bool	True
ポーリング	poll_interval	float	1.0
ポーリング	poll_timeout	float	300.0
音声	defaultaudioduration	int	60
音声	default_bpm	int	120
音声	default_language	str	"ja"
//}
//blankline


== ビジュアライザー実装

== 技術基盤

//table[chap96t009][技術基盤の一覧]{
技術	用途
------------
Web Audio API	音声データの取得
AudioContext	オーディオグラフの構築
AnalyserNode	FFT/波形データの取得
Canvas 2D	ビジュアルのレンダリング
requestAnimationFrame	60fpsアニメーション
//}
//blankline

== 10個のビジュアルモード

=== Spectrum（スペクトル）

FFTデータ（getByteFrequencyData）を垂直バーとして描画。各バーの高さが周波数帯域の強度を表す。

=== Wave（波形）

時間領域データ（getByteTimeDomainData）をベジェカーブで描画。リアルタイムの音声波形を可視化。

=== Ring（リング）

FFTデータを極座標変換し、円環パターンとして描画。中心から外周に向かって周波数が増加。

=== Particles（パーティクル）

音声の強度に応じてパーティクルを生成し、物理シミュレーション（速度・重力・寿命）で運動させる。

=== Pulse（パルス）

RMS音量を計算し、ビートに同期したスケーリング・アニメーションを描画。ドラムのキックに反応して円が脈動。

=== Aurora（オーロラ）

音量に合わせて揺れる多層グラデーションを描画。ゆったりした楽曲や幻想的な曲調に向きます。

=== Fireworks（花火）

音のピークに合わせて花火状のパーティクルを発生させます。祝祭感や高揚感のある楽曲に向きます。

=== Matrix（マトリックス）

縦方向に流れるデジタルパターンを描画します。サイバー、電子音楽、暗めの曲調に向きます。

=== Orbit（軌道）

複数の光点が円軌道を描きながら回転します。神秘的・壮大な雰囲気の楽曲に向きます。

=== Fire（炎）

音量や低域に反応する炎状のパーティクルを描画します。ロック、EDM、激しい曲調に向きます。

//blankline
