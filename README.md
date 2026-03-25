# Easy Music v1.4 — AI音楽生成アプリ

ジャンルを選んでワンクリックで音楽を生成するWebアプリケーション。  
[ACE-Step 1.5](https://github.com/ace-step/ACE-Step) を音楽生成エンジンとして使用します。

## 特徴

- 🎵 **30ジャンル対応** — J-POP、Rock、Jazz、EDMなど豊富なジャンルタイル
- 🤖 **AI作詞** — テーマに合わせた歌詞を自動生成
- 😊 **ムード/ボーカルチップ** — 10種のムードと6種のボーカルタイプをワンタップ指定
- 📝 **ローカルLLMフォールバック** — 外部LLM接続不可時はQwen3-1.7Bで自動切替
- 🏛️ **キャプション自動/手動** — ジャンル別の最適キャプション生成＋デバッグパネルで直接編集可
- 🎼 **AI強化** — BPM・キー自動設定
- 🧠 **Thinking モード** — ON/OFFでキャプション生成スタイルを切替
- 🎚️ **STEP選択** — 8/20/50/80/100ステップで品質と速度を調整
- 🔊 **インラインプレーヤー** — スペクトルビジュアライザー付き
- 🔇 **無音音楽自動検出** — Web Audio APIでRMS/ピーク値を解析、無音生成を自動検出
- 📋 **履歴機能** — 直近10件の生成音楽をリスト表示、選択再生・ダウンロード（ブラウザsessionStorage）
- 🌐 **日英切替** — ワンクリックでUI言語切替

## セットアップ

### 必要なもの

- Python 3.10+
- ACE-Step 1.5 APIサーバー（別途起動）
- LLM APIサーバー（オプション、OpenAI互換）

### インストール

```bash
# venv作成
python -m venv .venv
source .venv/bin/activate

# 依存パッケージ
pip install -r requirements.txt
```

### 起動

```bash
# デフォルト設定で起動
./start.sh

# ACE-Step APIを指定
./start.sh --ace-url http://YOUR_ACE_HOST:8001

# LLM APIを指定
./start.sh --llm-url http://YOUR_LLM_HOST:11434/v1

# ポート変更
./start.sh --port 9000
```

ブラウザで `http://localhost:8889` にアクセス。

### ACE-Step サーバーの起動

Easy Music は ACE-Step 1.5 の REST API サーバーに接続して音楽を生成します。

#### 標準起動（公式コマンド）

ACE-Step リポジトリが提供する標準の起動方法です。

```bash
cd /path/to/ACE-Step-1.5

# 推奨（フォアグラウンド）
uv run acestep-api --host 0.0.0.0 --port 8001

# または手動で uvicorn を起動
python -m uvicorn acestep.api_server:app --host 0.0.0.0 --port 8001 --workers 1
```

- デフォルト: Turbo モデル、LM 有効
- 環境変数でモデルや設定を変更可能（`ACESTEP_CONFIG_PATH`, `ACESTEP_LM_MODEL_PATH` 等）
- `workers` は 1 固定（メモリ内キューのため）

#### マルチモデル起動（推奨）

用途に応じた起動スクリプトを `ace_startup/` に同梱しています。  
ACE-Step 1.5 のインストールフォルダにコピーして使用してください。

```bash
# ace_startup/ のスクリプトを ACE-Step フォルダにコピー
cp ace_startup/run_api_server_*.sh /path/to/ACE-Step-1.5/
```

Turbo と Base の両モデルを同時にロードし、リクエスト単位で切り替えられます。  
UI の「モデル」セレクタで Turbo/Base を選択すると自動的に対応モデルが使用されます。

```bash
cd /path/to/ACE-Step-1.5
./run_api_server_multimodel.sh
```

- デフォルト: Turbo（高速）、リクエストで `"model": "acestep-v15-base"` を送ると Base に切替
- LM: 4B（高品質）、バックエンド: vllm
- VRAM目安: 24GB 推奨

#### Low-VRAM 起動

VRAM が限られた環境向け。単一モデルのみロードし、CPU オフロードを有効化します。  
このモードではリクエスト単位のモデル切替はできません。

```bash
cd /path/to/ACE-Step-1.5
./run_api_server_lowvram.sh

# Base モデルで起動する場合
ACESTEP_CONFIG_PATH=acestep-v15-base ./run_api_server_lowvram.sh
```

- デフォルト: Turbo 単体
- LM: 1.7B（軽量）、CPU オフロード有効
- VRAM を他アプリと共有する場合に最適

> 詳細は `ace_startup/起動コマンド.md` および `ace_startup/運用メモ_同時実行数とキュー.md` を参照してください。

### サーバ版（マルチユーザー対応）

複数ユーザーが同時接続する環境でもそのまま使えます。  
タスクIDはACE-Step APIが生成するUUID（128-bit）であり、推測不可能なためセッション管理なしで安全に動作します。  
履歴はブラウザのsessionStorageに保存されます（タブごとに独立）。

```bash
# サーバ版で起動
./start_server.sh

# ACE-Step APIを指定
./start_server.sh --ace-url http://YOUR_ACE_HOST:8001
```

| 項目 | WEBアプリ版 (`start.sh`) | サーバ版 (`start_server.sh`) |
|------|------------------------|----------------------------|
| 同時接続 | 単一ユーザー向け | マルチユーザー対応 |
| 履歴 | sessionStorage | sessionStorage |
| 機能 | 同一 | 同一 |

![起動時GUI](startupUI.png)

### 環境変数 (.env)

```env
ACE_STEP_API_URL=http://localhost:8001
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_API_KEY=YOUR_KEY
OPENAI_CHAT_MODEL=gemma3:latest
HOST=0.0.0.0
PORT=8889
```

## 構成

```
easy_music/
├── main.py                 # FastAPIアプリ（WEBアプリ版）
├── main_server.py          # サーバ版（ラッパー）
├── config.py               # 設定
├── requirements.txt
├── start.sh                # WEBアプリ版起動
├── start_server.sh         # サーバ版起動
├── routers/
│   ├── generate.py         # 音楽生成API（音声プロキシ付き）
│   └── lyrics.py           # 作詞/テーマ/キャプションAPI
├── services/
│   ├── ace_step_client.py  # ACE-Step APIクライアント
│   ├── llm_service.py      # 外部LLMサービス
│   └── local_llm_service.py # ローカルLLMフォールバック
├── templates/
│   └── index.html          # メインページ
├── static/
│   ├── app.js              # フロントエンドJS（無音検出・履歴含む）
│   ├── style.css           # スタイルシート
│   └── image/              # ジャンル画像
├── models/                 # GGUFモデル（自動ダウンロード）
├── ace_startup/            # ACE-Stepサーバー起動スクリプト・ドキュメント
└── docs/                   # ドキュメント
```

## ライセンス

MIT License
