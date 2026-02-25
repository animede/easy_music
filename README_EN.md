# Easy Music — AI Music Generator

A web application that generates music with one click by selecting a genre.  
Uses [ACE-Step 1.5](https://github.com/ace-step/ACE-Step) as the music generation engine.

## Features

- 🎵 **30 Genres** — J-POP, Rock, Jazz, EDM, and more genre tiles
- 🤖 **AI Lyrics** — Auto-generates lyrics to match your theme
- 📝 **Local LLM Fallback** — Automatically switches to Qwen3-1.7B when external LLM is unavailable
- 🔒 **Built-in LLM Only Mode** — Use `--local-llm` flag to run without any external LLM
- 🎛️ **Auto Caption** — Genre-optimized caption generation
- 🎼 **AI Enhancement** — Automatic BPM and key setting
- 🔊 **Inline Player** — With spectrum visualizer
- 🌐 **Bilingual UI** — Japanese / English toggle

## Setup

### Requirements

- Python 3.10+
- ACE-Step 1.5 API server (started separately)
- LLM API server (optional, OpenAI-compatible / not needed with `--local-llm`)

### Starting the ACE-Step API Server

Easy Music requires a running ACE-Step 1.5 API server.

```bash
# 1. Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. Clone & install
git clone https://github.com/ACE-Step/ACE-Step-1.5.git
cd ACE-Step-1.5
uv sync

# 3. Launch API server (default: port 8001, models auto-download on first run)
uv run acestep-api
```

> Launch scripts are also available: Linux `./start_api_server.sh` / Windows `start_api_server.bat` / macOS `./start_api_server_macos.sh`
>
> See the [ACE-Step 1.5 repository](https://github.com/ace-step/ACE-Step-1.5) for details.

### Installation

```bash
# Create venv
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Launch

```bash
# Default settings
./start.sh

# Specify ACE-Step API
./start.sh --ace-url http://YOUR_ACE_HOST:8001

# Specify LLM API
./start.sh --llm-url http://YOUR_LLM_HOST:11434/v1

# Use built-in LLM only (no external LLM needed)
./start.sh --local-llm

# Change port
./start.sh --port 9000
```

Open `http://localhost:8889` in your browser.

### Environment Variables (.env)

```env
ACE_STEP_API_URL=http://localhost:8001
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_API_KEY=YOUR_KEY
OPENAI_CHAT_MODEL=gemma3:latest
HOST=0.0.0.0
PORT=8889
```

## Structure

```
easy_music/
├── main.py                 # FastAPI app
├── config.py               # Configuration
├── requirements.txt
├── start.sh
├── routers/
│   ├── generate.py         # Music generation API
│   └── lyrics.py           # Lyrics / theme / caption API
├── services/
│   ├── ace_step_client.py  # ACE-Step API client
│   ├── llm_service.py      # External LLM service
│   └── local_llm_service.py # Local LLM fallback
├── templates/
│   └── index.html          # Main page
├── static/
│   ├── app.js              # Frontend JS
│   ├── style.css           # Stylesheet
│   └── image/              # Genre images
├── models/                 # GGUF models (auto-download)
└── docs/                   # Documentation
```

## License

MIT License
