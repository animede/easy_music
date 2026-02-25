# Easy Music — AI音楽生成アプリ

ジャンルを選んでワンクリックで音楽を生成するWebアプリケーション。  
[ACE-Step 1.5](https://github.com/ace-step/ACE-Step) を音楽生成エンジンとして使用します。

## 特徴

- 🎵 **30ジャンル対応** — J-POP、Rock、Jazz、EDMなど豊富なジャンルタイル
- 🤖 **AI作詞** — テーマに合わせた歌詞を自動生成
- 📝 **ローカルLLMフォールバック** — 外部LLM接続不可時はQwen3-1.7Bで自動切替
- 🔒 **内蔵LLM専用モード** — `--local-llm` オプションで外部LLM不要で動作
- 🎛️ **キャプション自動** — ジャンル別の最適キャプション生成
- 🎼 **AI強化** — BPM・キー自動設定
- 🔊 **インラインプレイヤー** — スペクトルビジュアライザー付き

## セットアップ

### 必要なもの

- Python 3.10+
- ACE-Step 1.5 APIサーバー（別途起動）
- LLM APIサーバー（オプション、OpenAI互換 / `--local-llm` 使用時は不要）

### ACE-Step APIサーバーの起動

Easy Music は ACE-Step 1.5 の API サーバーが起動している必要があります。

```bash
# 1. uv をインストール
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. クローン & インストール
git clone https://github.com/ACE-Step/ACE-Step-1.5.git
cd ACE-Step-1.5
uv sync

# 3. APIサーバーを起動（デフォルト: ポート8001、モデルは初回自動ダウンロード）
uv run acestep-api
```

> 起動スクリプトも利用できます: Linux `./start_api_server.sh` / Windows `start_api_server.bat` / macOS `./start_api_server_macos.sh`
>
> 詳細は [ACE-Step 1.5 リポジトリ](https://github.com/ace-step/ACE-Step-1.5) を参照してください。

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

# 内蔵LLMのみ使用（外部LLM不要）
./start.sh --local-llm

# ポート変更
./start.sh --port 9000
```

ブラウザで `http://localhost:8889` にアクセス。

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
├── main.py                 # FastAPIアプリ
├── config.py               # 設定
├── requirements.txt
├── start.sh
├── routers/
│   ├── generate.py         # 音楽生成API
│   └── lyrics.py           # 作詞/テーマ/キャプションAPI
├── services/
│   ├── ace_step_client.py  # ACE-Step APIクライアント
│   ├── llm_service.py      # 外部LLMサービス
│   └── local_llm_service.py # ローカルLLMフォールバック
├── templates/
│   └── index.html          # メインページ
├── static/
│   ├── app.js              # フロントエンドJS
│   ├── style.css           # スタイルシート
│   └── image/              # ジャンル画像
├── models/                 # GGUFモデル（自動ダウンロード）
└── docs/                   # ドキュメント
```

## ライセンス

MIT License
