= Easy Music APIリファレンス

本章では、Easy Musicの全APIエンドポイントを網羅的に解説します。各エンドポイントのリクエスト/レスポンス形式、curlコマンド例、エラーハンドリングを記載しています。

//blankline

== 音楽生成API

== POST /api/generate

通常の音楽生成タスクを作成します。非同期処理でtask_idを返します。

リクエスト（JSON）:

//listnum[chap98l001][POST /api/generateの例]{
{
  "prompt": "J-POP, catchy melody, bright, emotional female vocal, polished production.",
  "lyrics": "[verse]\n星の海に浮かぶ願いが\n夜空を駆け巡る\n\n[chorus]\n輝く未来へ走り出す",
  "thinking": true,
  "model": "acestep-v15-turbo",
  "vocal_language": "ja",
  "audio_duration": 60,
  "batch_size": 1,
  "inference_steps": 8,
  "guidance_scale": 3.0,
  "instrumental": false,
  "lm_negative_prompt": "low quality, noisy, distorted"
}
//}
//blankline

レスポンス（200 OK）:

//listnum[chap98l002][POST /api/generateの例]{
{
  "task_id": "abc123-def456-ghi789",
  "status": "queued",
  "message": "Task created successfully",
  "queue_position": 0,
  "seed": 1234567890
}
//}
//blankline

curl例:

//listnum[chap98l003][POST /api/generateのコマンド例]{
curl -X POST http://localhost:8889/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "J-POP, catchy melody, bright.",
    "lyrics": "[verse]\n夢を追いかけて\n[chorus]\n輝く未来へ",
    "vocal_language": "ja",
    "audio_duration": 60
  }'
//}
//blankline

全フィールド一覧:

//table[chap98t001][POST /api/generateの一覧]{
フィールド	型	デフォルト	制約	説明
------------
prompt	string	""	—	キャプション（音楽の説明文）
lyrics	string	""	—	歌詞（セクションタグ付き）
thinking	boolean	true	—	LMでの高品質生成
model	string?	null	—	DiTモデル名
vocal_language	string	"ja"	—	ボーカル言語
audio_duration	integer	60	-1〜300	生成秒数。-1=自動
bpm	integer?	null	30〜300	テンポ
key_scale	string?	null	—	調（例: "C major"）
time_signature	string	"4"	—	拍子
batch_size	integer	1	1〜4	同時生成曲数
audio_format	string	"mp3"	—	出力形式
seed	integer?	null	—	再現用シード値。null=ランダム生成
inference_steps	integer	150	1〜200	推論ステップ数
instrumental	boolean	false	—	インスト固定
sample_query	string?	null	—	おまかせ生成クエリ
guidance_scale	float	3.0	0.0〜20.0	CFGスケール
shift	float?	null	1.0〜5.0	タイムステップシフト
infer_method	string?	null	—	"ODE" or "SDE"
lm_temperature	float?	null	0.0〜2.0	LM温度
lmcfgscale	float?	null	0.0〜20.0	LM CFGスケール
lmtopp	float?	null	0.0〜1.0	LM top-p
usecotcaption	boolean?	null	—	CoTキャプション
usecotlanguage	boolean?	null	—	CoT言語推定
usecotmetas	boolean?	null	—	CoTメタ推定
lmnegativeprompt	string?	null	—	ネガティブプロンプト
//}
//blankline


== GET /api/status/{task_id}

タスクのステータスをポーリングします。

レスポンス（処理中）:

//listnum[chap98l004][GET /api/status/{task_id}の例]{
{
  "task_id": "abc123-def456-ghi789",
  "status": 0,
  "status_text": "processing",
  "progress": 45,
  "queue_position": null,
  "results": null,
  "error": null
}
//}
//blankline

レスポンス（完了）:

//listnum[chap98l005][GET /api/status/{task_id}の例]{
{
  "task_id": "abc123-def456-ghi789",
  "status": 1,
  "status_text": "succeeded",
  "progress": 100,
  "results": [
    {
      "url": "/api/audio?path=/output/abc123_0.mp3",
      "file": "/output/abc123_0.mp3",
      "seed_value": "1234567890",
      "metas": {
        "bpm": 120,
        "duration": 60.5,
        "keyscale": "C major",
        "genres": "J-POP",
        "timesignature": "4/4"
      }
    }
  ]
}
//}
//blankline

レスポンス（失敗）:

//listnum[chap98l006][GET /api/status/{task_id}の例]{
{
  "task_id": "abc123-def456-ghi789",
  "status": 2,
  "status_text": "failed",
  "error": "Generation failed: CUDA out of memory"
}
//}
//blankline

ステータスコード:

//table[chap98t002][GET /api/status/{task_id}の一覧]{
status	status_text	意味
------------
0	processing	処理中（またはネットワーク一時エラー時のフォールバック）
1	succeeded	生成完了
2	failed	生成失敗
//}
//blankline


== POST /api/generate_cover（multipart/form-data）

カバー生成タスクを作成します。音声ファイルのアップロードが必要です。

curl例:

//listnum[chap98l007][POST /api/generate_cover（multipart/form-data）のコマンド例]{
curl -X POST http://localhost:8889/api/generate_cover \
  -F "src_audio=@/path/to/original.mp3" \
  -F "prompt=jazz, acoustic, warm piano, smooth bass." \
  -F "audio_cover_strength=0.5" \
  -F "vocal_language=ja" \
  -F "inference_steps=8"
//}
//blankline

主要フォームフィールド:

//table[chap98t003][POST /api/generate_cover（multipart/form-data）の一覧]{
フィールド	型	デフォルト	説明
------------
src_audio	File	必須	元の音声ファイル
prompt	string	""	変換後のスタイル
audiocoverstrength	float	0.8	カバー強度（0.0〜1.0）
lyrics	string	""	歌詞（任意）
guidance_scale	float	3.0	CFG（自動で≥1.0に補正）
//}
//blankline

 audiocoverstrength < 1.0の場合、guidance_scaleは自動的に1.0に補正されます。

//blankline

== POST /api/generate_repaint（multipart/form-data）

リペイント（部分再生成）タスクを作成します。

curl例:

//listnum[chap98l008][POST /api/generate_repaint（multipart/form-data）のコマンド例]{
curl -X POST http://localhost:8889/api/generate_repaint \
  -F "src_audio=@/path/to/music.mp3" \
  -F "repainting_start=15.0" \
  -F "repainting_end=30.0" \
  -F "prompt=epic orchestral, dramatic strings." \
  -F "inference_steps=8"
//}
//blankline

リペイント固有フィールド:

//table[chap98t004][POST /api/generate_repaint（multipart/form-data）の一覧]{
フィールド	型	デフォルト	説明
------------
src_audio	File	必須	元の音声ファイル
repainting_start	float	0.0	再生成開始位置（秒）
repainting_end	float	0.0	再生成終了位置（秒）
//}
//blankline


== POST /api/generateandwait

同期的に音楽生成を実行し、完了まで待機します。

リクエスト: GenerateRequest + timeout: float = 300.0

レスポンス:

//listnum[chap98l009][POST /api/generateandwaitの例]{
{
  "success": true,
  "results": [
    {
      "url": "/api/audio?path=/output/abc123_0.mp3",
      "file": "/output/abc123_0.mp3",
      "metas": {"bpm": 120, "duration": 60.5, "keyscale": "C major"},
      "seed_value": "1234567890"
    }
  ],
  "error": null
}
//}
//blankline


== LLM・可視化補助API

== POST /api/title

歌詞・ジャンル・テーマから曲名を自動生成します。

リクエスト:

//listnum[chap98l010][POST /api/titleの例]{
{
  "lyrics": "[verse]\n桜の花びらが...",
  "genre": "J-POP",
  "language": "Japanese",
  "theme": "桜の物語"
}
//}
//blankline

レスポンス:

//listnum[chap98l011][POST /api/titleの例]{
{
  "success": true,
  "title": "春風の約束",
  "error": null
}
//}
//blankline


== POST /api/viz_mood

歌詞・キャプション・ジャンルから、ビジュアライザー用の雰囲気IDを推定します。

リクエスト:

//listnum[chap98l012][POST /api/viz_moodの例]{
{
  "lyrics": "[verse]\n桜の花びらが...",
  "caption": "Bright J-POP with warm female vocal.",
  "genre": "J-POP",
  "omakase_query": "春の別れを描いた明るいJ-POP"
}
//}
//blankline

レスポンス:

//listnum[chap98l013][POST /api/viz_moodの例]{
{
  "success": true,
  "mood": "bright"
}
//}
//blankline


== POST /api/background_image

再生時に表示する背景画像を生成またはキャッシュから取得します。

リクエスト:

//listnum[chap98l014][POST /api/background_imageの例]{
{
  "task_id": "abc123-def456",
  "genre": "J-POP",
  "theme": "桜の物語",
  "caption": "Bright J-POP with warm female vocal.",
  "lyrics": "[verse]\n桜の花びらが...",
  "omakase_query": "",
  "width": 1296,
  "height": 728
}
//}
//blankline

レスポンス:

//listnum[chap98l015][POST /api/background_imageの例]{
{
  "success": true,
  "image_url": "/api/background_image/abc123-def456",
  "prompt": "cinematic spring J-POP background...",
  "cached": false,
  "error": null
}
//}
//blankline


== GET /api/backgroundimage/{imageid}

キャッシュ済み背景画像をPNGとして返します。存在しない場合は404を返します。

//blankline

== POST /api/theme

ジャンルからテーマを自動生成します。

リクエスト:

//listnum[chap98l016][POST /api/themeの例]{
{
  "genre": "J-POP",
  "language": "Japanese"
}
//}
//blankline

レスポンス:

//listnum[chap98l017][POST /api/themeの例]{
{
  "success": true,
  "theme": "桜舞い散る春の午後、新しい出発を決意した少女の物語",
  "error": null
}
//}
//blankline


== POST /api/lyrics

テーマから歌詞を生成します。

リクエスト:

//listnum[chap98l018][POST /api/lyricsの例]{
{
  "theme": "桜舞い散る春の午後、新しい出発を決意した少女の物語",
  "genre": "J-POP",
  "language": "Japanese",
  "mood": "bright and happy",
  "vocal": "female vocal"
}
//}
//blankline

レスポンス:

//listnum[chap98l019][POST /api/lyricsの例]{
{
  "success": true,
  "lyrics": "[verse]\n桜の花びらが...\n\n[chorus]\n新しい季節へ...",
  "recommended_duration": 90,
  "parts": {
    "intro": 5,
    "verse1": 20,
    "chorus1": 25,
    "verse2": 20,
    "chorus2": 25,
    "outro": 5
  },
  "error": null
}
//}
//blankline


== POST /api/tags

歌詞からジャンル・タグ・BPM・Keyを推定します。

リクエスト:

//listnum[chap98l020][POST /api/tagsの例]{
{
  "lyrics": "[verse]\n桜の花びらが...\n\n[chorus]\n新しい季節へ...",
  "theme": "桜舞い散る春の午後",
  "language": "Japanese"
}
//}
//blankline

レスポンス:

//listnum[chap98l021][POST /api/tagsの例]{
{
  "success": true,
  "genre": "J-Pop",
  "tags": "bright and hopeful, gentle female vocal",
  "bpm": 115,
  "key_scale": "G major",
  "error": null
}
//}
//blankline


== POST /api/caption

歌詞・テーマ・タグからキャプションを生成します。

リクエスト:

//listnum[chap98l022][POST /api/captionの例]{
{
  "lyrics": "[verse]\n桜の花びらが...",
  "theme": "桜の物語",
  "tags": "bright, hopeful, female vocal",
  "language": "Japanese",
  "thinking": true,
  "mood": "bright and happy",
  "vocal": "female vocal"
}
//}
//blankline

レスポンス（thinking=true）:

//listnum[chap98l023][POST /api/captionの例]{
{
  "success": true,
  "caption": "Bright J-POP with catchy melody, gentle female vocal, warm acoustic guitar and strings, spring atmosphere.",
  "error": null
}
//}
//blankline

レスポンス（thinking=false）:

//listnum[chap98l024][POST /api/captionの例]{
{
  "success": true,
  "caption": "A warm J-POP ballad with bright, hopeful atmosphere. The arrangement features acoustic guitar fingerpicking...",
  "error": null
}
//}
//blankline


== POST /api/full_generate

歌詞とタグを一括生成します（theme→lyrics + tagsの統合API）。

リクエスト:

//listnum[chap98l025][POST /api/full_generateの例]{
{
  "theme": "桜の物語",
  "genre": "J-POP",
  "language": "Japanese",
  "mood": "bright and happy"
}
//}
//blankline

レスポンス:

//listnum[chap98l026][POST /api/full_generateの例]{
{
  "success": true,
  "lyrics": "[verse]\n...",
  "recommended_duration": 90,
  "parts": {"verse1": 20, "chorus1": 25},
  "genre": "J-Pop",
  "tags": "bright, female vocal",
  "bpm": 115,
  "key_scale": "G major",
  "error": null
}
//}
//blankline


== GET /api/llm_status

LLMの接続状態を返します。

レスポンス:

//listnum[chap98l027][GET /api/llm_statusの例]{
{
  "external_llm": true,
  "local_llm": {
    "available": true,
    "loaded": true,
    "model_downloaded": true
  }
}
//}
//blankline


== ユーティリティAPI

== POST /api/format_input

ACE-StepのLMでキャプションをAI強化します。BPM・Key・詳細キャプションが返されます。

リクエスト:

//listnum[chap98l028][POST /api/format_inputの例]{
{
  "prompt": "J-POP, catchy melody, bright.",
  "lyrics": "[verse]\n夢を追いかけて...",
  "temperature": 0.85
}
//}
//blankline

レスポンス:

//listnum[chap98l029][POST /api/format_inputの例]{
{
  "success": true,
  "caption": "J-POP, catchy melody, bright vocal, acoustic guitar, strings, 115 BPM, G major.",
  "lyrics": "[verse]\n夢を追いかけて...",
  "bpm": 115,
  "key_scale": "G major",
  "time_signature": "4/4",
  "duration": 90,
  "vocal_language": "ja"
}
//}
//blankline


== GET /api/audio?path={path}

ACE-Step APIの音声ファイルをCORSプロキシします。

curl例:

//listnum[chap98l030][GET /api/audio?path={path}のコマンド例]{
curl -o output.mp3 "http://localhost:8889/api/audio?path=/output/abc123_0.mp3"
//}
//blankline

仕様:

 * ACE-Stepサーバーへのリバースプロキシ
 * 最大3回リトライ（0.5秒間隔）
 * Content-Typeはアップストリームのレスポンスを転送

//blankline

== POST /api/lrc

音声URLと歌詞から、簡易的なLRCタイムスタンプを生成します。歌詞がない場合や解析できない場合はnullを返します。

リクエスト:

//listnum[chap98l031][POST /api/lrcの例]{
{
  "audio_url": "/api/audio?path=/output/abc123_0.mp3",
  "lyrics": "[verse]\n夢を追いかけて\n\n[chorus]\n輝く未来へ"
}
//}
//blankline

レスポンス:

//listnum[chap98l032][POST /api/lrcの例]{
{
  "lrc": [
    {"time": 0.0, "text": "夢を追いかけて", "section": "verse"},
    {"time": 12.3, "text": "輝く未来へ", "section": "chorus"}
  ]
}
//}
//blankline


== POST /api/random_sample

ACE-Stepからランダムなパラメータセットを取得します。

レスポンス:

//listnum[chap98l033][POST /api/random_sampleの例]{
{
  "prompt": "Dreamy lo-fi beats with warm Rhodes piano...",
  "lyrics": "[verse]\nFading into the night...",
  "bpm": 85,
  "key_scale": "Eb minor",
  "duration": 120,
  "vocal_language": "en"
}
//}
//blankline


== GET /api/models

利用可能なDiTモデル一覧を取得します。

レスポンス:

//listnum[chap98l034][GET /api/modelsの例]{
{
  "success": true,
  "models": ["acestep-v15-turbo", "acestep-v15-base"],
  "default_model": "acestep-v15-turbo"
}
//}
//blankline


== GET /api/stats

ACE-Step APIのジョブ統計を取得します。

レスポンス:

//listnum[chap98l035][GET /api/statsの例]{
{
  "success": true,
  "jobs": {},
  "queue_size": 0,
  "avg_job_seconds": 25.3
}
//}
//blankline


== GET /api/health

ACE-Step APIのヘルスチェック結果を返します。

レスポンス（正常）:

//listnum[chap98l036][GET /api/healthの例]{
{"status": "ok"}
//}
//blankline

レスポンス（異常）:

//listnum[chap98l037][GET /api/healthの例]{
{"status": "error", "message": "Connection refused"}
//}
//blankline


== GET /api/languages

対応言語一覧を返します。

レスポンス:

//listnum[chap98l038][GET /api/languagesの例]{
{
  "languages": [
    "en", "zh", "ja", "ko", "es", "fr", "de", "it", "pt", "ru",
    "ar", "hi", "bn", "th", "vi", "id", "tr", "nl", "pl", "unknown"
  ]
}
//}
//blankline


== GET /api/key_scales

対応調一覧を返します。

レスポンス:

//listnum[chap98l039][GET /api/key_scalesの例]{
{
  "key_scales": [
    "C major", "C minor", "C# major", "C# minor",
    "D major", "D minor", "..." , "B major", "B minor"
  ]
}
//}
//blankline


== エラーハンドリング

== HTTPステータスコード

//table[chap98t005][HTTPステータスコードの一覧]{
コード	意味	発生条件
------------
200	成功	正常完了
400	不正リクエスト	パラメータ不正
500	サーバーエラー	内部エラー、タスク作成失敗
503	サービス利用不可	ACE-Step APIに接続不可
//}
//blankline

== ACE-Step接続エラー時の動作

//listnum[chap98l040][ACE-Step接続エラー時の動作の例]{
except (httpx.ConnectError, httpx.ConnectTimeout):
    raise HTTPException(
        status_code=503,
        detail="ACE-Step APIに接続できません。サーバーが起動しているか確認してください。"
    )
//}
//blankline

== ポーリング時の一時エラー

/api/status/{task_id} は、ACE-Step APIへの一時的な接続エラーが発生してもstatus=0（processing）を返します。これによりフロントエンドはポーリングを継続し、接続が回復した時点で結果を取得できます。

== フロントエンドのリトライ戦略

//listnum[chap98l041][フロントエンドのリトライ戦略の例]{
ポーリングループ:
  最大600回  1秒間隔 = 最大10分
  status=0: 継続
  status=1: 完了 → 音声取得
  status=2: 失敗 → エラー表示
  例外: リトライせずエラー表示
//}
//blankline

