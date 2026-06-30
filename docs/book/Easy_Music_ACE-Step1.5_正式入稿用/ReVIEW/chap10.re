= ACE-Step API詳細解説

本章では、ACE-Step 1.5のREST APIサーバーの起動方法、モデル選択、全エンドポイントの仕様、推論ハイパーパラメータの詳細を解説します。

//blankline

== APIサーバーの起動と設定

=== インストール

ACE-Step 1.5はPython 3.11〜3.12で動作します。パッケージマネージャにはuvを使用します。

//listnum[chap10l001][インストールのコマンド例]{
# 1. uv のインストール（未インストールの場合）
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. GitHub上の公開ファイル一式を取得し、依存関係をインストール
git clone https://github.com/ACE-Step/ACE-Step-1.5.git
cd ACE-Step-1.5
uv sync
//}
//blankline

=== 起動方法

2つのインターフェースが用意されています。

//listnum[chap10l002][起動方法のコマンド例]{
# Gradio Web UI（ブラウザで操作するGUI）
uv run acestep
# → http://localhost:7860

# REST API サーバー（プログラムからの利用向け）
uv run acestep-api
# → http://localhost:8001
//}
//blankline

本書で解説するEasy Musicは、REST APIサーバー（ポート8001）と通信します。

=== 環境変数による設定

.envファイルまたは環境変数で設定をカスタマイズできます。

//table[chap10t001][環境変数による設定の一覧]{
環境変数	デフォルト	説明
------------
ACESTEPCONFIGPATH	（自動）	設定ファイルのパス
ACESTEPLMMODEL_PATH	（自動ダウンロード）	LMモデルのパス
PORT	8001	APIサーバーのポート
LANGUAGE	en	UIの言語
//}
//blankline

モデルファイルは初回起動時にHugging Face（https://huggingface.co/ACE-Step/Ace-Step1.5）から自動ダウンロードされます。合計約10.1GBのダウンロードが発生するため、初回起動には時間がかかります。

=== XLモデルの導入と起動

XLモデルはcheckpoints/配下のacestep-v15-* プレフィックスをスキャンして検出されます。手動取得する場合は、ディレクトリ名をこの命名規則に揃えることが重要です。

//listnum[chap10l003][XLモデルの導入と起動のコマンド例]{
# XL Turbo
huggingface-cli download ACE-Step/acestep-v15-xl-turbo \
  --local-dir ./checkpoints/acestep-v15-xl-turbo

# XL SFT
huggingface-cli download ACE-Step/acestep-v15-xl-sft \
  --local-dir ./checkpoints/acestep-v15-xl-sft

# XL Base
huggingface-cli download ACE-Step/acestep-v15-xl-base \
  --local-dir ./checkpoints/acestep-v15-xl-base

# LLM 4B
huggingface-cli download ACE-Step/acestep-5Hz-lm-4B \
  --local-dir ./checkpoints/acestep-5Hz-lm-4B
//}
//blankline

起動時に未取得モデルがある場合は自動ダウンロードされることもありますが、48GB級GPUでXLを本格運用する場合は事前取得しておく方が安全です。

代表的な起動パターンは以下の通りです。

//listnum[chap10l004][XLモデルの導入と起動のコマンド例]{
# XL Turbo 単体
ACESTEP_CONFIG_PATH=acestep-v15-xl-turbo \
uv run acestep-api

# XL SFT 単体
ACESTEP_CONFIG_PATH=acestep-v15-xl-sft \
uv run acestep-api

# 48GB級GPUでXL Turbo + XL SFTを同時ロード
ACESTEP_CONFIG_PATH=acestep-v15-xl-turbo \
ACESTEP_CONFIG_PATH2=acestep-v15-xl-sft \
uv run acestep-api
//}
//blankline

48GB運用の目安

 * xl-turbo + xl-sft + lm-4Bの静的VRAMはおおむね 約29.5GB
 * 残りを推論用に回せるため、Turboで120秒4曲、またはSFTで120秒2曲 が現実的です
 * SFTで240秒4曲 はOOMリスクが高く、バッチを下げるべきです

//blankline

== DiTモデルの選択

DiTモデルは楽曲の音響生成を担当するメインモデルです。2B系とXL系を合わせて複数の選択肢があり、推奨ステップ数と品質特性が異なります。

//table[chap10t002][DiTモデルの選択の一覧]{
モデル名	推奨ステップ	品質	多様性	SFT	RL	CFG不要	LoRA
------------
acestep-v15-base	50	Medium	High	なし	なし	あり	Easy
acestep-v15-sft	50	High	Medium	あり	なし	あり	Easy
acestep-v15-turbo	8	Very High	Medium	あり	なし	なし	Medium
acestep-v15-turbo-rl	8	Very High	Medium	あり	あり	なし	Medium
acestep-v15-xl-base	50	High	High	なし	なし	なし	Medium
acestep-v15-xl-sft	50	Very High	Medium	あり	なし	なし	Hard
acestep-v15-xl-turbo	8	Very High	Medium	あり	なし	あり相当	Medium
//}
//blankline

=== 使い分けガイド

はじめての人: turboを推奨。8ステップで高速に高品質な楽曲を生成でき、Easy Musicのデフォルトでもあります。

品質を追求したい人: sftを50ステップで使用。SFT（教師あり微調整）により指示遵守が強化されています。生成には時間がかかりますが、プロンプトへの忠実度が高い楽曲が得られます。

XLで最終品質を取りたい人: xl-sftを第一候補にします。2B版SFTよりVRAM消費は大きくなりますが、細部の分離感・厚み・スケール感で有利です。

XLで高速試作したい人: xl-turboが最適です。大きいモデルサイズの恩恵を受けつつ、8ステップ前後で高速に案出しできます。

LoRAトレーニングしたい人: baseを推奨。LoRAの適用が最も容易で、独自スタイルのカスタムモデルを効率的に作成できます。

全機能を使いたい人: baseのみがLayering（レイヤリング）とCompletion（コンプリーション）に対応しています。

=== 全モデル共通の対応機能

//table[chap10t003][全モデル共通の対応機能の一覧]{
機能	base	sft	turbo	turbo-rl
------------
Text-to-Music	対応	対応	対応	対応
Cover	対応	対応	対応	対応
Repaint	対応	対応	対応	対応
Track Separation	対応	対応	対応	対応
Layering	対応	非対応	非対応	非対応
Completion	対応	非対応	非対応	非対応
//}
//blankline


== LMモデルの選択

LM（言語モデル）は楽曲の構造計画を担当します。3サイズが提供されており、VRAM容量に応じて選択します。

//table[chap10t004][LMモデルの選択の一覧]{
モデル名	ベースモデル	VRAM推奨	スタイル品質	歌詞品質	Think品質
------------
acestep-5Hz-lm-0.6B	Qwen3-0.6B	6〜8GB	Medium	Medium	Weak
acestep-5Hz-lm-1.7B	Qwen3-1.7B	8〜16GB	Medium	Medium	Medium
acestep-5Hz-lm-4B	Qwen3-4B	16GB以上	Strong	Strong	Strong
//}
//blankline

3モデルすべてが以下の機能に対応しています。

 *  Caption（キャプション生成）
 *  Query Rewrite（クエリ書き換え）
 *  Tag（タグ生成）
 *  Lyric（歌詞生成）
 *  Quality Score（品質スコアリング）

=== VRAM別の推奨構成

//table[chap10t005][VRAM別の推奨構成の一覧]{
VRAM	推奨LM	バックエンド	備考
------------
≤ 6GB	なし（DiT単体）	—	INT8量子化 + CPU完全オフロード。LMによる構造計画なしで動作
6〜8GB	0.6B	PyTorch	軽量なLMによる最小構成
8〜12GB	0.6B	vLLM	vLLMバックエンドで推論高速化
12〜16GB	1.7B	vLLM	バランスの取れた推奨構成
16〜20GB	1.7B	vLLM	余裕がある場合は4Bも検討可
20〜24GB	1.7B or 4B	vLLM	オフロード不要で快適に動作
≥ 24GB	4B	vLLM	全モデルがオフロードなしで動作。最高品質
//}
//blankline


== REST APIエンドポイント詳細

ACE-Step 1.5のAPIサーバーが提供する主要なエンドポイントを解説します。

=== タスク作成: POST /release_task

楽曲生成タスクを作成する最も重要なエンドポイントです。テキスト生成の場合はJSON、カバー/リペイントの場合はmultipart/form-dataで送信します。

=== JSONリクエスト（テキスト生成）

//listnum[chap10l005][JSON リクエスト（テキスト生成）の例]{
POST http://localhost:8001/release_task
Content-Type: application/json

{
  "prompt": "J-POP, female vocal, catchy melody, bright, emotional",
  "lyrics": "[verse]\n空を見上げて 星が輝いている\n心の奥で 何かが変わりはじめた\n[chorus]\n走り出そう 新しい世界へ\n光を追いかけて どこまでも",
  "thinking": true,
  "vocal_language": "ja",
  "audio_duration": 60,
  "batch_size": 1,
  "audio_format": "mp3",
  "inference_steps": 8,
  "guidance_scale": 3.0,
  "instrumental": false,
  "model": "acestep-v15-turbo"
}
//}
//blankline

=== 全パラメータ表

//table[chap10t006][全パラメータ表の一覧]{
パラメータ	型	デフォルト	範囲	説明
------------
prompt	string	""	—	音楽の説明（ジャンル、楽器、雰囲気など）
lyrics	string	""	—	歌詞（[verse], [chorus]等のセクションタグ付き）
thinking	bool	true	—	Thinkingモード（LMでCoTメタデータ生成）
model	string	サーバーデフォルト	—	DiTモデル名
vocal_language	string	"ja"	20言語	歌詞の言語（"en", "zh", "ja", "ko", 等）
audio_duration	int	60	-1〜600	生成時間（秒）。-1でLMが自動推定
bpm	int	自動	30〜300	テンポ
key_scale	string	自動	24種	調性（"C major", "A minor", 等）
time_signature	string	"4"	—	拍子
batch_size	int	1	1〜8	同時生成曲数
audio_format	string	"mp3"	mp3/wav/flac	出力形式
seed	int	ランダム	0〜2³²	シード値（再現性のため）
inference_steps	int	150	1〜200	推論ステップ数（Turbo: 8、Base/SFT: 50推奨）
guidance_scale	float	3.0	0.0〜20.0	CFGスケール
shift	float	自動	1.0〜5.0	タイムステップシフト
infer_method	string	"ODE"	ODE/SDE	推論方式
instrumental	bool	false	—	インストゥルメンタルモード
sample_query	string	null	—	おまかせ生成（自然言語で指定）
lm_temperature	float	自動	0.0〜2.0	LMの生成温度
lmcfgscale	float	自動	0.0〜20.0	LM CFGスケール
lmtopp	float	自動	0.0〜1.0	LMのTop-Pサンプリング
lmnegativeprompt	string	null	—	LMネガティブプロンプト
usecotcaption	bool	自動	—	CoTキャプション使用
usecotlanguage	bool	自動	—	CoT言語判定使用
usecotmetas	bool	自動	—	CoTメタデータ推定使用
//}
//blankline

=== XLモデル指定の例

//listnum[chap10l006][XLモデル指定の例の例]{
{
  "prompt": "cinematic pop, female vocal, wide stereo image, polished production",
  "lyrics": "[verse]\n夜の街を抜けて...",
  "model": "acestep-v15-xl-turbo",
  "inference_steps": 8,
  "guidance_scale": 3.0,
  "audio_duration": 120,
  "batch_size": 2
}
//}
//blankline

//listnum[chap10l007][XLモデル指定の例の例]{
{
  "prompt": "dramatic orchestral pop, soaring chorus, rich arrangement, high fidelity",
  "lyrics": "[verse]\n追い風の中で...",
  "model": "acestep-v15-xl-sft",
  "inference_steps": 50,
  "guidance_scale": 7.0,
  "audio_duration": 120,
  "batch_size": 1
}
//}
//blankline

運用上は、ラフ生成をxl-turbo、仕上げをxl-sftに分けると、待ち時間と品質のバランスを取りやすくなります。

=== カバー専用パラメータ

//table[chap10t007][カバー専用パラメータの一覧]{
パラメータ	型	説明
------------
task_type	string	"cover" を指定
src_audio	file	原曲の音声ファイル（multipart）
audiocoverstrength	float (0〜1)	カバー強度。0=原曲維持、1=完全新規
//}
//blankline

=== リペイント専用パラメータ

//table[chap10t008][リペイント専用パラメータの一覧]{
パラメータ	型	説明
------------
task_type	string	"repaint" を指定
src_audio	file	原曲の音声ファイル（multipart）
repainting_start	float	再生成区間の開始秒
repainting_end	float	再生成区間の終了秒
//}
//blankline

=== /release_taskのレスポンス

//listnum[chap10l008][/release_task のレスポンスの例]{
{
  "code": 200,
  "data": {
    "task_id": "abc123-def456-789",
    "queue_position": 0
  }
}
//}
//blankline


=== タスク照会: POST /query_result

生成タスクの状態と結果を問い合わせるエンドポイントです。

=== /query_resultのリクエスト

//listnum[chap10l009][/query_result のリクエストの例]{
POST http://localhost:8001/query_result
Content-Type: application/json

{
  "task_id_list": ["abc123-def456-789"]
}
//}
//blankline

=== /query_resultのレスポンス（処理中）

//listnum[chap10l010][/query_result のレスポンス（処理中）の例]{
{
  "code": 200,
  "data": [
    {
      "task_id": "abc123-def456-789",
      "status": 0,
      "progress": 45,
      "queue_position": 0
    }
  ]
}
//}
//blankline

=== /query_resultのレスポンス（成功時）

//listnum[chap10l011][/query_result のレスポンス（成功時）の例]{
{
  "code": 200,
  "data": [
    {
      "task_id": "abc123-def456-789",
      "status": 1,
      "result": [
        {
          "file": "/v1/audio?path=/output/abc123_0.mp3",
          "status": 1,
          "create_time": 1711329600,
          "prompt": "J-POP, female vocal, catchy melody...",
          "lyrics": "[verse]\n空を見上げて...",
          "metas": {
            "bpm": 120,
            "duration": 60.5,
            "keyscale": "C major",
            "timesignature": "4/4"
          },
          "seed_value": "1234567890"
        }
      ]
    }
  ]
}
//}
//blankline

=== ステータスコード

//table[chap10t009][ステータスコードの一覧]{
status	意味	説明
------------
0	PROCESSING	処理中。ポーリングを継続してください
1	SUCCEEDED	成功。result フィールドに結果が含まれます
2	FAILED	失敗。result にエラーメッセージが含まれます
//}
//blankline


=== フォーマット補助: POST /format_input

プロンプトと歌詞をACE-Step内蔵のLMで自動強化するエンドポイントです。BPM、Key、Time Signatureの推定も行います。

=== /format_inputのリクエスト

//listnum[chap10l012][/format_input のリクエストの例]{
POST http://localhost:8001/format_input
Content-Type: application/json

{
  "prompt": "J-POP, female vocal",
  "lyrics": "[verse]\n空を見上げて...",
  "temperature": 0.85
}
//}
//blankline

=== /format_inputのレスポンス

//listnum[chap10l013][/format_input のレスポンスの例]{
{
  "caption": "J-POP, female vocal, catchy melody, bright synth pads, polished production, emotional, uplifting.",
  "lyrics": "[verse]\n空を見上げて 星が輝いている\n[chorus]\n走り出そう 新しい世界へ",
  "bpm": 120,
  "key_scale": "C major",
  "time_signature": "4/4",
  "duration": 60,
  "vocal_language": "ja"
}
//}
//blankline

このエンドポイントは、LMのRefinerモードを使用しています。ユーザーの短いプロンプトをDiTに最適化された詳細なキャプションに変換し、歌詞にメタデータ情報を補完します。

//blankline

=== ランダムサンプル: POST /createrandomsample

ランダムな生成パラメータセットを取得するエンドポイントです。Easy Musicのボタンで使用されます。

=== /create_random_sampleのリクエスト

//listnum[chap10l014][/create_random_sample のリクエストの例]{
POST http://localhost:8001/create_random_sample
Content-Type: application/json

{
  "sample_type": "simple_mode"
}
//}
//blankline

=== /create_random_sampleのレスポンス

//listnum[chap10l015][/create_random_sample のレスポンスの例]{
{
  "prompt": "dreamy synth pop, female vocal, ethereal, reverb, 95 BPM",
  "lyrics": "[verse]\nFloating through the midnight sky...",
  "bpm": 95,
  "key_scale": "E minor",
  "duration": 60,
  "vocal_language": "en"
}
//}
//blankline


=== モデル情報: GET /v1/models

利用可能なDiTモデルの一覧と推奨設定を取得します。

//listnum[chap10l016][モデル情報: GET /v1/modelsの例]{
GET http://localhost:8001/v1/models
//}
//blankline


=== サーバー統計: GET /v1/stats

現在のジョブ数、キューサイズ、平均生成時間などのサーバー統計を取得します。

//listnum[chap10l017][サーバー統計: GET /v1/statsの例]{
GET http://localhost:8001/v1/stats
//}
//blankline


=== ヘルスチェック: GET /health

サーバーの稼働状態を確認します。

//listnum[chap10l018][ヘルスチェック: GET /healthの例]{
GET http://localhost:8001/health
//}
//blankline

=== /healthのレスポンス

//listnum[chap10l019][/health のレスポンスの例]{
{
  "status": "ok"
}
//}
//blankline


=== 音声取得: GET /v1/audio?path={path}

生成された音声ファイルを取得するエンドポイントです。/query_resultで返されるファイルパスをそのまま指定します。

//listnum[chap10l020][音声取得: GET /v1/audio?path={path}の例]{
GET http://localhost:8001/v1/audio?path=/output/abc123_0.mp3
//}
//blankline

レスポンスは音声ファイルのバイナリストリームです。

//blankline

== 推論ハイパーパラメータ詳解

ACE-Step 1.5の生成結果に最も大きな影響を与えるハイパーパラメータを詳しく解説します。

=== inference_steps（推論ステップ数）

DiTがノイズから音楽を生成する際のステップ数です。ステップ数が多いほど品質が向上しますが、生成時間も増加します。

//table[chap10t010][inference_steps（推論ステップ数）の一覧]{
ステップ数	所要時間（A100/60秒曲）	品質	推奨モデル
------------
4	~1秒	低〜中	turbo（高速プレビュー用）
8	~2秒	高	turbo（推奨デフォルト）
20	~5秒	高	turbo（品質重視）
50	~10秒	高	base / sft（推奨デフォルト）
80	~15秒	最高	base / sft（品質最大化）
100	~20秒	最高	base / sft（極限品質）
//}
//blankline

Turboモデルの場合: 蒸留により8ステップで最適化されているため、inference_steps=8がデフォルトです。ステップ数を50に増やしても品質向上は限定的です。

XL Turboの場合: 基本思想はTurboと同じで、やはり8を起点に考えます。20まで増やしても劇的改善は起きにくいため、速度メリットを活かす方が合理的です。

Base/SFTモデルの場合: 蒸留されていないため、inference_steps=50がデフォルトです。ステップ数の増加は品質向上に直結します。

XL SFT / XL Baseの場合: 50ステップが基準です。120秒を超える長尺や複数曲バッチではVRAM消費が急増するため、まず50 / batch_size=1〜2で詰めるのが安全です。

=== guidance_scale（CFGスケール）

Classifier-Free Guidance（CFG）のスケール値です。高いほど条件（キャプション）に忠実な生成になりますが、高すぎると不自然になります。

//table[chap10t011][guidance_scale（CFGスケール）の一覧]{
値	効果	推奨用途
------------
1.0	最小限のガイダンス	カバー生成時（audiocoverstrength < 1.0 で自動設定）
3.0	デフォルト（Turbo推奨）	蒸留モデルはCFG不要なため低め
5.0	中程度のガイダンス	Base/SFTモデルでのバランス
7.0	Base/SFT推奨	プロンプトへの忠実度と品質のバランス
10.0〜	強いガイダンス	特殊な用途（プロンプト遵守を最優先）
15.0〜	過剰ガイダンス	アーティファクトが発生する可能性
//}
//blankline

Turboモデルの特性: 蒸留プロセスでCFGの効果が内在化されているため、guidance_scaleを高く設定する必要がありません。3.0で十分な品質が得られます。

XL SFT / XL Baseの特性: CFGの効きが比較的わかりやすく、5.0〜7.0が実務上の使いやすいレンジです。高くしすぎると音像が硬くなることがあるため、まず7.0前後から詰めます。

=== shift（タイムステップシフト）

Flow Matchingのノイズスケジュールの「形状」を制御するパラメータです。ACE-Step 1.5で特に重要な調整パラメータです。

ノイズスケジュールの違い（概念）

 * Shift = 1（低シフト）
 * 低ノイズ領域に多くのステップを割り振る
 * ディテール重視になりやすい

 * Shift = 3（高シフト）
 * 高ノイズ領域に多くのステップを割り振る
 * 構造重視になりやすい

//table[chap10t012][shift（タイムステップシフト）の一覧]{
値	効果	推奨用途
------------
1.0	ディテール重視	音質の細部を研ぎ澄ましたい場合
2.0	バランス	—
3.0	Turboデフォルト	構造重視。楽曲全体の一貫性を優先
4.0〜5.0	強い構造重視	プロンプトへの忠実度を最大化
//}
//blankline

直感的な理解: Shift値が低いと「細部を丁寧に仕上げる」、高いと「全体の構造をしっかり組み立てる」イメージです。多くの場合、Turboモデルではshift=3.0が最適です。

XL系でも考え方は同じですが、SFTで細部を詰めたいときは1.0〜2.0、構成忠実度を上げたいときは3.0〜4.0から試すと差が分かりやすくなります。

=== infer_method（推論方式）

ノイズ除去プロセスの数学的手法の選択です。

//table[chap10t013][infer_method（推論方式）の一覧]{
方式	正式名称	特徴
------------
ODE	Ordinary Differential Equation	決定論的。同じシードで同じ結果。安定的で予測可能。デフォルト推奨
SDE	Stochastic Differential Equation	確率的。ランダム性が加わり、有機的で多様な質感。高ステップ数と組み合わせると効果的
//}
//blankline

ODE: 数学的に「確定的な経路」でノイズを除去します。同じシードと同じパラメータで常に同じ結果が得られるため、再現性が重要な場面に適しています。

SDE: ノイズ除去プロセスに確率的な揺らぎを加えます。結果は毎回微妙に異なり、有機的な質感を持つ楽曲が生成されます。ただし、ステップ数が少ない（8ステップ等）と品質が不安定になる傾向があるため、高ステップ数（50以上）との組み合わせを推奨します。

=== thinking（Thinkingモード）

LMにChain-of-Thought推論を実行させるかどうかを制御します。

//table[chap10t014][thinking（Thinkingモード）の一覧]{
設定	LMの動作	生成されるもの
------------
true	CoT推論を実行	YAMLメタデータ（BPM, Key, Duration, 構造）+ FSQコード
false	直接生成	FSQコードのみ
//}
//blankline

Thinking ONの場合、LMが楽曲の「設計図」を先に作成してから音響を生成するため、構造的に一貫した楽曲が得られます。ただし、LMのサイズが小さい場合（0.6B）は、Thinkingの品質が低く、ONにしても効果が限定的です。

//blankline

== 推論パラメータの推奨組み合わせ

よく使われるパラメータの組み合わせを紹介します。

=== 高速プレビュー（最速）

//listnum[chap10l021][高速プレビュー（最速）の例]{
{
  "model": "acestep-v15-turbo",
  "inference_steps": 8,
  "guidance_scale": 3.0,
  "shift": 3.0,
  "infer_method": "ODE",
  "thinking": true
}
//}
//blankline
→ A100で約2秒、RTX 3090で約10秒

=== 高品質生成

//listnum[chap10l022][高品質生成の例]{
{
  "model": "acestep-v15-sft",
  "inference_steps": 50,
  "guidance_scale": 7.0,
  "shift": 3.0,
  "infer_method": "ODE",
  "thinking": true
}
//}
//blankline
→ 安定した高品質。プロンプトへの忠実度が高い

=== 最高品質（時間をかける）

//listnum[chap10l023][最高品質（時間をかける）の例]{
{
  "model": "acestep-v15-sft",
  "inference_steps": 100,
  "guidance_scale": 7.0,
  "shift": 2.0,
  "infer_method": "ODE",
  "thinking": true
}
//}
//blankline
→ ステップ数増加 + 低シフトで細部まで磨き上げ

=== 有機的な質感

//listnum[chap10l024][有機的な質感の例]{
{
  "model": "acestep-v15-base",
  "inference_steps": 50,
  "guidance_scale": 5.0,
  "shift": 2.0,
  "infer_method": "SDE",
  "thinking": true
}
//}
//blankline
→ SDE方式による自然な揺らぎ。ジャズやアコースティック向け

//blankline

== プラットフォーム別起動スクリプト

//table[chap10t015][プラットフォーム別起動スクリプトの一覧]{
プラットフォーム	Gradio UI	API サーバー
------------
Linux (CUDA)	startgradioui.sh	startapiserver.sh
Windows (CUDA)	startgradioui.bat	startapiserver.bat
Windows (ROCm)	startgradioui_rocm.bat	startapiserver_rocm.bat
macOS (Apple Silicon)	startgradioui_macos.sh	startapiserver_macos.sh
//}
//blankline

アクセラレータ（CUDA / MPS / ROCm / CPU）は自動検出されます。手動指定も可能です。

ポータブルパッケージ: WindowsとmacOS向けには、Python環境のセットアップが不要なポータブルパッケージも提供されています。ダウンロードして展開するだけで起動できます。

//blankline

== コラム: APIの生成フロー全体像

APIを使った楽曲生成の典型的なフローを図示します。

APIを使った楽曲生成は、次の手順で進みます。

 1. クライアントが`POST /release_task`に`prompt`、`lyrics`などを送信します。
 2. ACE-Step APIサーバーはタスクを作成し、`task_id`を返します。
 3. クライアントは`POST /query_result`に`task_ids`を送信し、処理状況を照会します。
 4. GPU上では、LM推論、DiT拡散、VAEデコードの順に音楽生成が進みます。
 5. 処理中は`status: 0`が返ります。
 6. 完了すると`status: 1`と、`/v1/audio?path=...`形式の音声ファイルURLが返ります。
 7. クライアントが`GET /v1/audio?path=...`でMP3、WAV、FLACなどの音声ファイルを取得します。
//blankline

ポーリング間隔は1秒程度が推奨です。Easy Musicでは、最大600回のポーリング（10分タイムアウト）を実装しています。

//blankline
