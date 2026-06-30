= インストールと起動

本章では、ACE-Step 1.5 APIサーバーとEasy Musicのインストールから起動までの手順を、ステップバイステップで解説します。

注意: インストール手順は執筆時点の環境を前提にしています。OSのバージョンアップやパッケージ仕様の変更、配布元の更新によっては、本章の説明どおりに進められない場合があります。その場合はエラーメッセージを確認しつつ、付録A・付録Bや各ツールの公式ドキュメントもあわせて参照してください。また、表示されたエラーメッセージをそのままAIに示して、原因や解決策の候補を尋ねるのも有効です。

重要な導入作業をより丁寧に確認したい場合は、付録A「インストールガイド」もあわせて参照してください。

本章の範囲: 第2章は「最短で起動してブラウザ画面を開く」ことに絞ります。OS別の細かい差分、仮想環境のつまずき、モデルダウンロードの失敗、GPU/VRAM別の詳細な判断は付録A、エラー別の切り分けは付録Bを参照してください。

=== この章でやることの流れ

 * 必要な環境を確認する: PythonやGitが使えるか、OSやGPU条件をざっと確認します。
 * ACE-Step側を準備する: uvを入れ、ACE-Step 1.5のファイルを取得し、依存関係をそろえます。
 * ACE-Step APIを起動する: 音楽生成エンジン本体を先に立ち上げ、/healthで動作確認します。
 * Easy Music側を準備する: Easy Musicのファイルを取得し、仮想環境を作って依存関係をインストールします。
 * Easy Musicを起動する: python main.pyで起動し、ブラウザで画面が開くことを確認します。
 * 必要なら設定を調整する: .envやコマンドライン引数は、接続先変更やトラブル時に参照します。

//blankline

== 必要な環境

=== ハードウェア要件

//table[chap02t001][ハードウェア要件の一覧]{
コンポーネント	最小要件	最高品質のための推奨環境
------------
GPU（ACE-Step側）	VRAM 4GB以上	NVIDIA RTX 3090 (24GB) 以上
RAM	8GB	16GB以上
ストレージ	15GB（モデル含む）	20GB以上
CPU	4コア	8コア以上
//}
//blankline

Easy Music自体はCPUのみで動作します。 GPUはACE-Step 1.5のAPIサーバー側でのみ必要です。ACE-Step 1.5とEasy Musicを別々のPCで実行することも可能です（ネットワーク経由で接続）。

=== ソフトウェア要件

//table[chap02t002][ソフトウェア要件の一覧]{
ソフトウェア	バージョン	用途
------------
Python	3.11〜3.12	ACE-Step + Easy Music 共通
uv	最新版	ACE-Step 1.5のパッケージ管理
pip	最新版	Easy Musicの依存関係インストール
Git	最新版	GitHub上の公開ファイル一式を取得
CUDA	11.8以上	NVIDIA GPU使用時
//}
//blankline

=== 対応プラットフォーム

//table[chap02t003][対応プラットフォームの一覧]{
OS	GPU	状態
------------
Linux (Ubuntu 22.04+)	NVIDIA CUDA	推奨
Windows 10/11	NVIDIA CUDA	対応
Windows 10/11	AMD ROCm	対応（Python 3.12必須）
macOS (Apple Silicon)	MPS	対応
すべてのOS	CPU のみ	対応（低速）
//}
//blankline


== ACE-Step APIサーバーの準備

Easy Musicを使用するには、まずACE-Step 1.5のAPIサーバーを起動する必要があります。

この章で出てくるコマンドは、ターミナル に入力して実行します。macOSでは「ターミナル」、Linuxでは端末アプリ、WindowsではPowerShellまたはWindows Terminalを使うと進めやすいです。

Windowsでは、スタートメニューで「PowerShell」または「Windows Terminal」と検索して開くのが簡単です。通常はそのまま開けば十分ですが、インストール時に権限エラーや実行ポリシーの警告が出る場合は、管理者として実行 が必要になることがあります。迷った場合は、まず通常の権限で試し、エラーが出たときだけ管理者権限を検討してください。

=== Step 1: uvのインストール

//listnum[chap02l001][Step 1: uvのインストールのコマンド例]{
# Linux / macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
//}
//blankline

=== Step 2: ACE-Step 1.5のクローンとインストール

//listnum[chap02l002][Step 2: ACE-Step 1.5のクローンとインストールのコマンド例]{
git clone https://github.com/ACE-Step/ACE-Step-1.5.git
cd ACE-Step-1.5
uv sync
//}
//blankline

=== Step 3: APIサーバーの起動

//listnum[chap02l003][Step 3: APIサーバーの起動のコマンド例]{
# REST APIサーバーを起動
uv run acestep-api
# → http://localhost:8001 でAPIサーバーが起動
//}
//blankline

初回起動時にモデルファイル（合計約10.1GB）がHugging Faceから自動ダウンロードされます。回線速度によっては数分〜数十分かかります。

第2章では、まずデフォルト構成のまま起動できることを優先します。モデル選択や上級者向けの運用は、初回起動後に必要になった時点で付録A「導入時のモデル選択」と第13章を参照してください。

=== 起動の確認

//listnum[chap02l004][起動の確認のコマンド例]{
curl http://localhost:8001/health
# → {"status": "ok"}
//}
//blankline

このレスポンスが返ればACE-Step APIサーバーは正常に動作しています。

//blankline

== Easy Musicのインストールと起動

=== Step 1: GitHub上のファイル一式を取得する

ここでいう「リポジトリ」とは、プログラム一式が置かれている保存場所のことです。まずはEasy Musicの公開ファイル一式を手元に取得します。

//listnum[chap02l005][Step 1: GitHub上のファイル一式を取得するのコマンド例]{
git clone https://github.com/animede/easy_music.git
cd easy_music
//}
//blankline

=== Step 2: 仮想環境の作成と依存関係のインストール

仮想環境を作るのは、Easy Musicで必要になるPythonライブラリを、このプロジェクト専用に分けて管理するためです。こうしておくと、PC内の他のPython環境と設定やバージョンがぶつかりにくくなります。

//listnum[chap02l006][Step 2: 仮想環境の作成と依存関係のインストールのコマンド例]{
# 仮想環境を作成
python -m venv .venv

# 仮想環境を有効化
source .venv/bin/activate        # Linux / macOS
# .venv\Scripts\activate         # Windows

# 依存関係をインストール
pip install -r requirements.txt
//}
//blankline

インストールされる主要な依存パッケージ:

//table[chap02t004][Step 2: 仮想環境の作成と依存関係のインストールの一覧]{
パッケージ	用途
------------
fastapi	Webフレームワーク
uvicorn	ASGIサーバー
httpx	ACE-Step APIへのHTTP通信
openai	外部LLM（Ollama等）との通信
jinja2	HTMLテンプレートエンジン
pydantic-settings	設定管理
python-multipart	ファイルアップロード（Cover/Repaint）
llama-cpp-python	内蔵ローカルLLM（Qwen3-1.7B）
huggingface_hub	モデルの自動ダウンロード
//}
//blankline

=== Step 3: 起動

//listnum[chap02l007][Step 3: 起動のコマンド例]{
python main.py
//}
//blankline

起動メッセージ:

//listnum[chap02l008][Step 3: 起動の例]{
 Easy Music starting on http://0.0.0.0:8889
   ACE-Step API: http://localhost:8001
   LLM API: http://localhost:11434/v1
  LLM Model: gemma4:latest
//}
//blankline

ブラウザでhttp://localhost:8889にアクセスすると、Easy Musicが表示されます。

=== 簡易起動スクリプト

//listnum[chap02l009][簡易起動スクリプトのコマンド例]{
# Linux / macOS
chmod +x start.sh
./start.sh

# オプション付き
./start.sh --ace-url http://ACE_STEP_SERVER_IP:8001 --local-llm
//}
//blankline

start.shは仮想環境の自動検出と有効化を行います。

//blankline

== 設定ファイル（.env）

Easy Musicの設定は、プロジェクトルートの .envファイルまたは環境変数で指定します。

初心者のうちは、この節の内容を最初から細かく覚える必要はありません。まずは2.5の 「よく使う起動パターン」 から、自分に近い起動方法をそのまま試すほうが進めやすいです。.envの主要設定項目や2.5のコマンドライン引数一覧は、接続先を変えたいときやエラー時に「必要になったら参照する資料」と考えて構いません。

第2章では、起動直後に確認する主要項目だけを扱います。すべての環境変数を一覧で確認したい場合は、付録G「Easy Music環境変数一覧」を参照してください。

=== 主要設定項目

//listnum[chap02l010][主要設定項目のコマンド例]{
# ACE-Step API接続
ACE_STEP_API_URL=http://localhost:8001
ACE_STEP_API_KEY=                         # Bearer Token認証（オプション）

# 外部LLM設定（Ollama等）
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_CHAT_MODEL=gemma4:latest

# LLMモード
USE_LOCAL_LLM_ONLY=false                  # trueで外部LLM不使用

# 背景画像生成設定
IMAGE_GENERATION_URL=http://localhost:64656
IMAGE_GENERATION_FALLBACK_URL=
IMAGE_GENERATION_TIMEOUT=90.0
IMAGE_GENERATION_HEALTH_CHECK_INTERVAL=30.0

# サーバー設定
HOST=0.0.0.0
PORT=8889
DEBUG=true                                 # trueでホットリロード有効

# ポーリング設定
POLL_INTERVAL=1.0                          # ポーリング間隔（秒）
POLL_TIMEOUT=300.0                         # タイムアウト（秒）

# 音声設定
DEFAULT_AUDIO_DURATION=60
DEFAULT_BPM=120
DEFAULT_LANGUAGE=ja
//}
//blankline

背景画像生成サーバーを別マシンで動かす場合だけ、IMAGEGENERATIONURLにLAN内の接続先を指定します。公開用の設定例では、読者が外部IPをそのまま真似しないよう、まずlocalhostを基本形にしています。

//listnum[chap02l011][主要設定項目のコマンド例]{
# 例: LAN内の画像生成サーバーを使う場合
IMAGE_GENERATION_URL=http://IMAGE_SERVER_IP:64656
IMAGE_GENERATION_FALLBACK_URL=
//}
//blankline

=== 設定の優先順位

設定は以下の優先順位で適用されます（上が最優先）。

 1. コマンドライン引数（--ace-url等）
 2. 環境変数（ACESTEPAPI_URL等）
 3. .envファイル
 4. デフォルト値（config.py内のハードコード値）

//blankline

== コマンドライン引数

python main.pyに渡せる全コマンドライン引数:

//table[chap02t005][コマンドライン引数の一覧]{
引数	説明	例
------------
--host	サーバーホスト	--host 0.0.0.0
--port	サーバーポート	--port 9000
--ace-url	ACE-Step API URL	--ace-url http://ACE_STEP_SERVER_IP:8001
--ace-host	ACE-Step APIホスト	--ace-host ACE_STEP_SERVER_IP
--ace-port	ACE-Step APIポート	--ace-port 8001
--llm-url	LLM API URL	--llm-url http://localhost:11434/v1
--llm-host	LLM APIホスト	--llm-host localhost
--llm-port	LLM APIポート	--llm-port 11434
--llm-model	LLMモデル名	--llm-model gemma4:latest
--img-url	画像生成API URL	--img-url http://IMAGE_SERVER_IP:64656
--img-host	画像生成APIホスト	--img-host IMAGE_SERVER_IP
--img-port	画像生成APIポート	--img-port 64656
--img-fallback-url	画像生成APIフォールバックURL	--img-fallback-url http://FALLBACK_SERVER_IP:64656
--img-health-interval	画像生成APIヘルスチェック間隔（秒）	--img-health-interval 15
--local-llm	外部LLM不使用	--local-llm
--no-reload	ホットリロード無効	--no-reload
//}
//blankline

=== よく使う起動パターン

//listnum[chap02l012][よく使う起動パターンのコマンド例]{
# パターン1: デフォルト設定（すべてlocalhost）
python main.py

# パターン2: リモートのACE-Stepに接続
python main.py --ace-url http://ACE_STEP_SERVER_IP:8001

# パターン3: 外部LLMなし（内蔵LLMのみ）
python main.py --local-llm

# パターン4: 外部LLMにGPT系を使用
python main.py --llm-url https://api.openai.com/v1 \
               --llm-model gpt-4o

# パターン5: 背景画像生成サーバーを指定
python main.py --img-url http://IMAGE_SERVER_IP:64656

# パターン6: 本番デプロイ（リロード無効）
python main.py --no-reload --port 8080
//}
//blankline


== LLM構成の選択

Easy Musicは、テーマ生成・作詞・タグ生成・キャプション生成にLLMを使用します。3つの構成から選択できます。

=== 構成1: 外部LLM（推奨）

//table[chap02t006][構成1: 外部LLM（推奨）の一覧]{
項目	詳細
------------
方式	Ollama / vLLM / llama.cpp server / OpenAI互換API
推奨モデル	gemma4:latest、qwen3:4b、GPT-4o mini
利点	高品質な歌詞・テーマ生成、多言語対応
欠点	別途サーバーまたは外部API接続先（Ollama、llama.cpp server、OpenAI API等）が必要
設定	..env でURL/モデルを指定
//}
//blankline

//listnum[chap02l013][構成1: 外部LLM（推奨）のコマンド例]{
# Ollamaの場合
ollama serve                        # Ollamaサーバー起動
ollama pull gemma4:latest           # モデルダウンロード
python main.py                      # デフォルトでOllamaに接続
//}
//blankline

ここでいう「OpenAI互換API」には、OpenAI公式APIだけでなく、llama.cpp serverのようにOpenAI互換のAPI形式で応答するローカルサーバーも含まれます。つまり、Ollamaを使わなくても、接続先がOpenAI互換であればEasy Musicから利用できます。特にOpenAI公式APIを使う場合は、Ollamaやllama.cpp serverのようなローカルLLMサーバーを別途起動する必要はありません。

=== 構成2: 内蔵ローカルLLM

//table[chap02t007][構成2: 内蔵ローカルLLMの一覧]{
項目	詳細
------------
方式	llama-cpp-python + Qwen3-1.7B-Q4KM.gguf
利点	追加サーバー不要、自動ダウンロード
欠点	品質は外部LLMに劣る、CPU推論のため低速
設定	--local-llm フラグ、または .env で USELOCALLLM_ONLY=true
//}
//blankline

内蔵LLMは、外部LLMへの接続が確立できなかった場合の自動フォールバックとしても機能します。モデルファイル（約1.1GB）は初回使用時にHugging Face（unsloth/Qwen3-1.7B-GGUF）から自動ダウンロードされ、models/ディレクトリに保存されます。

=== 構成3: LLMなし（ACE-Step内蔵LMのみ）

//table[chap02t008][構成3: LLMなし（ACE-Step内蔵LMのみ）の一覧]{
項目	詳細
------------
方式	テーマ・作詞機能を使わず、おまかせ生成/ランダム生成のみ使用
利点	Easy Musicサーバーのみで動作。最も軽量
欠点	AI作詞・テーマ・タグ・キャプション生成が使用不可
設定	特別な設定は不要。LLM接続エラーは無視される
//}
//blankline

この場合、ACE-Step 1.5内蔵のLM（Format Input / Random Sample機能）がプロンプト生成を担当します。

=== フォールバックチェーン

 1. テーマ/歌詞/タグ/キャプション生成のリクエストを受け取る
 2. まず 外部LLM（Ollama、OpenAI API、llama.cpp serverなど）に問い合わせる。成功した場合は、その結果を返す
 3. 外部LLMに失敗した場合、ローカルLLM（Qwen3-1.7B）にフォールバックする。成功した場合は、その結果を返す
 4. ローカルLLMにも失敗した場合は、エラーを返してフロントエンドに通知する

【Easy Music内蔵ローカルLLMとACE-Step内蔵LMの違い】

ここは少し補足します。Easy Music側にも小型のローカルLLMがあり、ACE-Step側にも内蔵LMがあります。両者は別物で、役割も異なります。

//table[chap02t009][フォールバックチェーンの一覧]{
項目	Easy Music内蔵ローカルLLM	ACE-Step内蔵LM
------------
どこで動くか	Easy Musicサーバー側	ACE-Step APIサーバー側
主な役割	テーマ生成、作詞、タグ生成、キャプション生成	Format Input、Random Sample、ACE-Step内部の補助推論
モデル例	Qwen3-1.7B-Q4KM.gguf	ACE-Step側に組み込まれたLM
いつ使われるか	外部LLMを使わないとき、または外部LLMが失敗したとき	おまかせ生成、ランダム生成、AI強化などを使うとき
ユーザー設定	USELOCALLLM_ONLY=true や --local-llm	ACE-Stepサーバー側の構成に依存
//}
//blankline

言い換えると、Easy MusicのローカルLLMは「歌詞や説明文を作る補助役」、ACE-Step内蔵LMは「音楽生成前の入力整形や内部補助を担う役」 です。

【典型的な使われ方】

 1. 通常生成でテーマや歌詞を自動生成する場合は、まずEasy Music側の外部LLMまたはローカルLLMが使われます。その後、必要に応じてACE-Step側のFormat Inputが動き、キャプションやメタ情報を補います。

 2. USELOCALLLM_ONLY=trueの場合は、Easy Musicは外部LLMを使わず、内蔵ローカルLLMでテーマ・歌詞・キャプション生成を行います。そのうえで、ACE-Step側の機能を使う場面では、ACE-Step内蔵LMも別途使われます。

 3. LLMなしで軽く使いたい場合は、Easy Music側のテーマ生成・作詞などは使わず、ACE-Step内蔵LMによるFormat InputやRandom Sample中心で動かします。

【覚え方】

Easy Music側のLLMは文章を作る、整える役割です。ACE-Step側のLMは音楽生成に入る前の補助をする役割です。

この違いを押さえておくと、「ローカルLLMをONにしたのに、なぜACE-Step側のLMも関わるのか」という疑問が起きにくくなります。

//blankline

== 起動確認チェックリスト

すべてのコンポーネントが正常に起動しているか確認するためのチェックリストです。必ずしも全てを事前チェックする必要はありません。トラブル時に試す方法だとご理解ください。

//table[chap02t010][起動確認チェックリストの一覧]{
#	確認項目	確認方法	期待結果
------------
1	ACE-Step APIサーバー	curl http://localhost:8001/health	{"status": "ok"}
2	Easy Musicサーバー	ブラウザで http://localhost:8889	Easy MusicのUIが表示される
3	ACE-Step接続	Easy Musicで  音楽を生成 をクリック	エラーなく生成が開始される
4	外部LLM（任意）	Easy Musicで /api/llm_status にアクセス	external_llm: true
5	モデル情報	Easy Musicの UIでモデル名が表示される	"Turbo(高速)" 等が選択可能
//}
//blankline

=== トラブルシューティング

//table[chap02t011][トラブルシューティングの一覧]{
症状	原因	対処法
------------
Easy Music起動時にエラー	依存関係未インストール	pip install -r requirements.txt
「ACE-Step APIに接続できません」	APIサーバー未起動 or URL不一致	ACE-Step APIの起動を確認、--ace-url を確認
テーマ/歌詞が生成されない	LLM未接続	Ollama起動を確認、または --local-llm で内蔵LLMを使用
モデルダウンロードが遅い	ネットワーク速度	待機（合計約10.1GB + 1.1GB）
ポートが使用中	他のプロセスが占有	--port 9000 で別ポートを指定
//}
//blankline

ここまでで起動できれば、第2章の目的は達成です。ここで詰まった場合は、作業手順を細かく確認するなら付録A、エラーメッセージから原因を切り分けるなら付録B、設定値を確認するなら付録Gを参照してください。

//blankline
