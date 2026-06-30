= インストールガイド

本付録では、ACE-Step 1.5とEasy Musicを確実に動かすための導入手順を、判断ポイントも含めて丁寧にまとめます。第2章が概要版だとすれば、こちらは実作業用の詳細版です。

//blankline

== 最初に決めること

インストールを始める前に、まず自分がどの構成で使いたいかを決めます。ここが曖昧なまま進めると、途中で設定をやり直しやすくなります。

//table[chap91t001][最初に決めることの一覧]{
構成	向いている人	特徴
------------
同一PC構成	まず手元で全部動かしたい人	ACE-StepとEasy Musicを同じPCで動かす。最もわかりやすい
分離構成	GPU-PCと操作用PCを分けたい人	ACE-Stepだけ別マシンに置き、Easy Musicから接続する
最小構成	まず画面や流れを確認したい人	Easy Music中心で試し、必要に応じてLLMや高度設定を後から足す
//}
//blankline

迷った場合は、同一PC構成で最初に一度通しで起動するのが基本です。1回でも通ると、その後の分離構成や本番運用が理解しやすくなります。

== 事前チェック

次の4点を最初に確認しておくと、後のトラブルがかなり減ります。

 1. Pythonのバージョン: Python 3.11〜3.12を使う。Windowsの場合はそもそもPythonがインストールされていない場合もあります

 2. GPUの有無と種類: NVIDIA CUDAか、CPU運用かを確認する

 3. 空き容量: モデルを含めて少なくとも15GB以上、余裕を見て20GB以上あると安心

 4. ネットワーク環境: 初回はモデルのダウンロードが発生するため、安定した回線が望ましい

特に見落としやすいのは、Pythonの版数 と 保存先の空き容量 です。ここが適合していなしと、依存関係の導入や初回起動で止まりやすくなります。

== おすすめの導入順

順番は次の通りです。

 1. ACE-Step 1.5を入れる
 2. ACE-Step APIサーバーが単体で起動することを確認する
 3. Easy Musicを入れる
 4. Easy MusicからACE-Stepに接続できることを確認する
 5. 必要なら外部LLMやローカルLLMを追加する

この順番にしておくと、問題が起きたときに

 * ACE-Step側の問題なのか
 * Easy Music側の問題なのか
 * LLM設定の問題なのか

を切り分けやすくなります。

== ACE-Step 1.5を先に動かす

まずは音楽生成エンジン本体であるACE-Step 1.5を起動します。

=== Step 1: uvを用意する

ACE-Step 1.5はuv前提で導入するのが最も素直です。

//listnum[chap91l001][Step 1: uv を用意するのコマンド例]{
# Linux / macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
//}
//blankline

インストール後は、ターミナルを開き直してuvコマンドが通るか確認します。ここで認識されない場合は、PATHの反映前であることが多いです。

=== Step 2: リポジトリを取得する

//listnum[chap91l002][Step 2: リポジトリを取得するのコマンド例]{
git clone https://github.com/ACE-Step/ACE-Step-1.5.git
cd ACE-Step-1.5
uv sync
//}
//blankline

uv syncは依存関係の解決と環境準備をまとめて行います。途中で時間がかかっても、まずは完了まで待つのが基本です。

=== Step 3: APIサーバーを起動する

//listnum[chap91l003][Step 3: APIサーバーを起動するのコマンド例]{
uv run acestep-api
//}
//blankline

初回起動時は、モデルの自動ダウンロードが始まることがあります。見た目上は止まっているようでも、裏で取得が進んでいる場合があるため、すぐ失敗と判断しないのが大切です。

=== Step 4: 起動確認をする

//listnum[chap91l004][Step 4: 起動確認をするのコマンド例]{
curl http://localhost:8001/health
//}
//blankline

{"status": "ok"} が返れば、ACE-Step APIサーバーはひとまず正常です。まずはこの状態を作ってから次に進みます。

== 導入時のモデル選択

第2章ではデフォルト構成のまま起動することを優先しました。ここでは、導入後に必要になりやすいモデル選択の考え方を整理します。

ACE-Step 1.5は、GPUのVRAM容量を自動検出し、最適なモデル構成を選択します。初回導入時は、この自動選択に任せるのが最も安全です。

//table[chap91t002][導入時のモデル選択の一覧]{
VRAM	DiTモデル	LMモデル	バックエンド	導入時の考え方
------------
≤ 6GB	turbo (INT8量子化)	なし	—	まず短い曲で動作確認する
6〜8GB	turbo	0.6B	PyTorch	60秒・batch size 1から試す
8〜16GB	turbo	0.6B〜1.7B	vLLM	通常利用の標準ライン
16〜24GB	turbo	1.7B	vLLM	長めの曲や複数候補生成に向く
≥ 24GB	turbo	4B	vLLM	高品質設定やXL検討の入口
//}
//blankline

手動で変更したい場合は、ACE-Step側の .envファイルで指定できます。

//listnum[chap91l005][導入時のモデル選択のコマンド例]{
# ACE-Step-1.5/.env
ACESTEP_CONFIG_PATH=acestep-v15-turbo      # DiTモデル
ACESTEP_LM_MODEL_PATH=acestep-5Hz-lm-1.7B  # LMモデル
//}
//blankline

=== XLモデルを使う場合

24GB超のGPUを使えるなら、Easy MusicからXL（4B DiT）モデル を使うことができます。ただし、初回導入時に必須ではありません。まず通常のTurbo構成で起動確認を済ませ、制作フローが固まってからXLへ進むほうが安全です。

//listnum[chap91l006][XLモデルを使う場合のコマンド例]{
huggingface-cli download ACE-Step/acestep-v15-xl-turbo \
  --local-dir ./checkpoints/acestep-v15-xl-turbo

huggingface-cli download ACE-Step/acestep-v15-xl-sft \
  --local-dir ./checkpoints/acestep-v15-xl-sft

huggingface-cli download ACE-Step/acestep-v15-xl-base \
  --local-dir ./checkpoints/acestep-v15-xl-base

huggingface-cli download ACE-Step/acestep-5Hz-lm-4B \
  --local-dir ./checkpoints/acestep-5Hz-lm-4B
//}
//blankline

//listnum[chap91l007][XLモデルを使う場合のコマンド例]{
# XL Turbo をデフォルトにする
ACESTEP_CONFIG_PATH=acestep-v15-xl-turbo \
uv run acestep-api

# XL SFT をデフォルトにする
ACESTEP_CONFIG_PATH=acestep-v15-xl-sft \
uv run acestep-api

# 48GB級GPUでXL Turbo + XL SFT を同時ロード
ACESTEP_CONFIG_PATH=acestep-v15-xl-turbo \
ACESTEP_CONFIG_PATH2=acestep-v15-xl-sft \
uv run acestep-api
//}
//blankline

//table[chap91t003][XLモデルを使う場合の一覧]{
構成	向いている用途	コメント
------------
Turbo	初回確認・ラフ生成	まずここから始める
XL Turbo	大量試作・高品質ラフ	8ステップで高速。案出し向き
XL SFT	仕上げ候補	50ステップ前提。品質重視
XL Turbo + XL SFT	48GB級GPUの本命	試作と仕上げを1サーバーで切り替え可能
//}
//blankline

実務では、TurboまたはXL Turboで候補曲を量産し、気に入った条件だけSFT/XLで仕上げる方法が効率的です。生成結果の評価と選別は第13章を参照してください。

== Easy Musicを導入する

ACE-Step側が動いたら、次にEasy Musicを入れます。

=== Step 1: リポジトリを取得する

//listnum[chap91l008][Step 1: リポジトリを取得するのコマンド例]{
git clone https://github.com/animede/easy_music.git
cd easy_music
//}
//blankline

=== Step 2: 仮想環境を作る

//listnum[chap91l009][Step 2: 仮想環境を作るのコマンド例]{
python -m venv .venv
//}
//blankline

仮想環境を分ける理由は、他のPythonプロジェクトと依存関係が混ざらないようにするためです。インストールで不具合が出たときも、環境を丸ごと作り直しやすくなります。

=== Step 3: 仮想環境を有効化する

//listnum[chap91l010][Step 3: 仮想環境を有効化するのコマンド例]{
# Linux / macOS
source .venv/bin/activate

# Windows
# .venv\Scripts\activate
//}
//blankline

有効化後は、ターミナルの先頭に (.venv) のような表示が出ることがあります。これが見えていれば、そのターミナルではEasy Music用のPython環境が使われています。

=== Step 4: 依存関係を入れる

//listnum[chap91l011][Step 4: 依存関係を入れるのコマンド例]{
pip install -r requirements.txt
//}
//blankline

ここではFastAPI本体だけでなく、ACE-Step通信、ファイルアップロード、LLM連携に必要なライブラリも入ります。失敗した場合は、まずPythonの版数と仮想環境の有効化状態を見直すのが近道です。

=== Step 5: まずはデフォルト設定で起動する

//listnum[chap91l012][Step 5: まずはデフォルト設定で起動するのコマンド例]{
python main.py
//}
//blankline

標準構成では、Easy Musicはhttp://localhost:8889、ACE-Stepはhttp://localhost:8001を前提に接続します。両方を同じマシンで動かしているなら、まずは追加設定なしでここまで通るかを確認します。

== 最小構成の .env例

細かい調整を始める前に、最小限の設定だけで一度通すのが安全です。

なお、ここに載せている値の多くはEasy Musicのデフォルト値と同じです。つまり、同じマシンでACE-Stepをhttp://localhost:8001、Easy Musicを標準構成で動かすだけなら、.envを作らなくても起動できる場合があります。.envは、接続先やポートを変えたいとき、外部LLMを明示的に使いたいときに追加する、と考えると分かりやすいです。

//listnum[chap91l013][最小構成の .env 例のコマンド例]{
ACE_STEP_API_URL=http://localhost:8001
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_CHAT_MODEL=gemma4:latest
USE_LOCAL_LLM_ONLY=false
HOST=0.0.0.0
PORT=8889
DEBUG=true
//}
//blankline

 * ACESTEPAPI_URL=http://localhost:8001はデフォルトです
 * HOST=0.0.0.0、PORT=8889、DEBUG=trueもデフォルトです
 * OPENAIBASEURL=http://localhost:11434/v1とOPENAICHATMODEL=gemma4:latestも、Ollama系の標準例としてそのまま使えます
 * 外部LLMをまだ使わない段階では、LLM関連の設定を後回しにしても構いません

もし外部LLMをまだ使わないなら、最初は接続先を作り込むよりも、ACE-Stepとの接続確認を優先 してください。LLMは後から追加しても構いません。

たとえば、最初の確認は次のような形で十分です。

例1: 同じPCでACE-StepもEasy Musicも動かす場合

 * ACE-Stepをhttp://localhost:8001で起動する
 * Easy Musicをそのまま起動する

//listnum[chap91l014][最小構成の .env 例のコマンド例]{
python main.py
//}
//blankline

この段階では、まずブラウザで画面が開き、1曲生成が最後まで通るかだけを確認します。

例2: .envを書くとしてもACE-Stepだけ先に合わせる場合

//listnum[chap91l015][最小構成の .env 例のコマンド例]{
ACE_STEP_API_URL=http://localhost:8001
//}
//blankline

このように、最初はACE-Stepの接続先だけを書いて試し、外部LLMのURLやモデル名はあとから追加する方が切り分けしやすくなります。

== 分離構成で使う場合

ACE-StepだけGPU用PCで動かし、Easy Musicは別PCで使う構成も実用的です。

その場合に重要なのは次の3点です。

 1. ACE-Step側が外部から見えるアドレスで待ち受けていること
 2. Easy Music側のACESTEPAPI_URLがそのアドレスを指していること
 3. ポート8001への通信が遮断されていないこと

例:

//listnum[chap91l016][分離構成で使う場合のコマンド例]{
ACE_STEP_API_URL=http://ACE_STEP_SERVER_IP:8001
//}
//blankline

この構成では、まずブラウザからではなく、Easy Musicを動かす側の端末からcurl http://ACE_STEP_SERVER_IP:8001/healthが通るかを確認すると切り分けしやすくなります。

== LLMは後から足してよい

導入時にすべてを一度で仕上げようとすると、問題の切り分けが難しくなります。おすすめは次の順番です。

 1. ACE-Step APIだけ通す
 2. Easy Musicの画面表示まで通す
 3. 通常生成を試す
 4. その後で外部LLMやローカルLLMを足す

特に初回は、音楽生成そのものが動くこと を最優先にすると安定します。

== 最初の動作確認

セットアップ後は、次の順で確認するとわかりやすいです。

//table[chap91t004][最初の動作確認の一覧]{
確認項目	期待する状態
------------
ACE-Step API	/healthがokを返す
Easy Music	ブラウザで画面が開く
接続	生成開始時にACE-Step接続エラーが出ない
再生	生成後にプレーヤーが表示される
//}
//blankline

最初の1曲は、細かな品質よりも 最後まで処理が通ること を確認する意味が大きいです。そこで問題がなければ、次にLLM、XLモデル、分離構成などへ広げていけます。

== つまずきやすい点

=== モデルのダウンロードが遅い

初回は大きなモデルを取得するため、時間がかかるのが普通です。すぐに再実行を繰り返すより、まずはダウンロードが進んでいるかを見ます。

=== ポートが競合する

8889や8001が他プロセスで使われていると起動に失敗します。Easy Music側は --port、ACE-Step側はサーバー設定で調整します。

=== 外部LLM設定まで一度にやろうとして混乱する

最初はLLMを最優先にしないほうが安全です。ACE-StepとEasy Musicの接続確認を先に済ませると、問題が整理されます。

=== Windowsで仮想環境の有効化に戸惑う

有効化コマンドがOSで違うため、そこで止まりやすいです。うまくいかない場合は、PowerShellかコマンドプロンプトかを確認し、そのシェル向けの有効化方法を使います。

== この付録の使い方

実作業では、次のように使い分けると便利です。

 * ざっと流れを見たいときは第2章
 * 実際に手を動かしながら確認したいときは付録A
 * 環境変数を確認したいときは付録G
 * 問題が起きたときは付録B

導入は一度通してしまえば、その後は再現しやすくなります。焦って一気に完成を目指すより、ACE-Step → Easy Music → LLM追加 の順で一つずつ確認するのが、結局もっとも失敗が少ない進め方です。

//blankline
