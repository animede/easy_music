# Easy Music — AI Music Generator

A web application that generates music with one click by selecting a genre.  
Uses [ACE-Step 1.5](https://github.com/ace-step/ACE-Step) as the music generation engine.

## Features

- 🎵 **30 Genres** — J-POP, Rock, Jazz, EDM, and more genre tiles
- 🤖 **AI Lyrics** — Auto-generates lyrics to match your theme
- 📝 **Local LLM Fallback** — Automatically switches to Qwen3-1.7B when external LLM is unavailable
- 🎛️ **Auto Caption** — Genre-optimized caption generation
- 🎼 **AI Enhancement** — Automatic BPM and key setting
- 🔊 **Inline Player** — With spectrum visualizer
- 🌐 **Bilingual UI** — Japanese / English toggle

## Setup

### Requirements

- Python 3.10+
- ACE-Step 1.5 API server (started separately)
- LLM API server (optional, OpenAI-compatible)

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
