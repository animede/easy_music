# Easy Music v1.7.0 — AI Music Generator

A web application that generates music with one click by selecting a genre.  
Uses [ACE-Step 1.5](https://github.com/ace-step/ACE-Step) as the music generation engine.

## Features

- 🎵 **30 Genres** — J-POP, Rock, Jazz, EDM, and more genre tiles
- 🤖 **AI Lyrics** — Auto-generates lyrics to match your theme
- 😊 **Mood / Vocal Chips** — Pick from 10 moods and 6 vocal types; reflected in caption generation
- 📝 **Local LLM Fallback** — Automatically switches to Qwen3-1.7B when external LLM is unavailable
- 🏛️ **Auto / Manual Caption** — Genre-optimized caption generation + direct editing in the debug panel
- 🎼 **AI Enhancement** — Automatic BPM and key setting
- 🧠 **Thinking Mode** — Toggle ON/OFF to switch caption generation style
- 🎚️ **STEP Selector** — Choose 8/20/50/80/100 steps to balance quality and speed
- 🔊 **Inline Player** — 10 visualizer modes + LLM mood-adaptive color themes
- 🖼️ **Auto Background Artwork** — Generates matching background images on a separate server and shows them during playback
- 🔇 **Silent Audio Detection** — Analyzes RMS/peak via Web Audio API, auto-detects silent output
- 📋 **History** — Recent 10 generations in a list with playback and download (browser sessionStorage)
- 🌐 **Bilingual UI** — Japanese / English toggle

## v1.7.0 New Features

### 🖼️ Music-Synced Background Image Generation

Uses a separate image generation API server to automatically create playback background artwork from the song theme, lyrics, caption, and genre.

- **Parallel generation**: image generation starts immediately after music task creation
- **Playback-time switch**: if the image is already ready, it appears at the same time playback starts
- **Late update support**: if the image finishes slightly later, the background updates automatically during playback
- **Genre-aware prompting**: genres like `City Pop`, `Jazz`, and `Rock` inject visual era/style cues into the image prompt
- **History reuse**: generated artwork is cached and reused from playback history

The image prompting flow is inspired by `momo_song-v3`: an LLM first builds a scene description, then the image server renders it.

### 🎨 Visualizer Mood (Auto Color Theming)

LLM classifies songs into 10 mood categories (energetic / melancholic / healing / epic / cyber / romantic / dark / festive / nostalgic / mystical) based on lyrics and genre, automatically adjusting hue, saturation, brightness, effect intensity, and preferred visualizer mode.

### 🌟 New Visualizer Modes

Expanded from 5 to 10 modes. New: Aurora / Fireworks / Matrix / Orbit / Fire

### 🎵 Auto Song Title

LLM infers song titles from lyrics, displayed on the overlay and in history.

### 🎤 Lyrics Telop

Karaoke-style lyrics display with energy-based LRC timing. 4-line highlight with scroll.

---

## v1.6.1 Features

### 🏛️ XL Model Support

At startup, queries the server’s `/v1/models` endpoint and dynamically populates the model selector.

- **Supported models**: TURBO / Base / XL TURBO / XL SFT
- **Auto parameter adjustment**: CFG, STEP, and batch limit are set automatically per model
- **SFT/Base**: guidance_scale 7.0, STEP 50, max batch 2
- **TURBO**: guidance_scale 3.0, STEP 8, no batch limit

### 🪄 Quick Generate (Omakase)

Just type something like "a refreshing pop song for a summer beach" and the AI automatically determines all parameters — genre, caption, lyrics, BPM, key, and more — to generate music.

- **How to use**: Enter text in the input field above the genre tiles and press the generate button
- **🎲 Random button**: Fills the form with a random caption, lyrics, and settings
- Uses ACE-Step's `sample_query` API; the LM generates everything internally

### 🚫 Negative Prompt (lm_negative_prompt)

Specify elements to avoid during generation, similar to negative prompts in image generation AI.

- **Default** (applied when empty): `low quality, noisy, distorted, muddy, clipping, off-key, out of tune, amateur, poorly mixed`
- **Effect**: Suppresses noise, clipping, off-key, and poor mixing for overall quality improvement
- **Customization**: Free text entry in the "Negative Prompt" field inside the Lyrics Settings accordion

### ⚙️ Advanced Settings (Accordion)

The control bar is split into "Basic" (always visible) and "Advanced" (collapsible) sections, keeping the UI clean for beginners while giving power users full control.

**Basic** (always visible):
- Duration / Language / Track count / Model / Instrumental

**Advanced** (collapsible):

| Parameter | Description | Recommended |
|---|---|---|
| **STEP** | Inference steps. More = higher quality but slower | Turbo: 8, Base: 50 |
| **Shift** | Timestep shift. Lower = detail/texture focus, Higher = structure/prompt fidelity | Turbo: 3.0, Base: 1.0–2.0 |
| **Sampler** | ODE = stable & reproducible, SDE = organic & diverse (needs higher steps) | ODE |
| **Auto Caption** | Auto-generates optimal caption from genre info | ON |
| **Thinking** | LM Chain-of-Thought reasoning for quality improvement | ON |

#### Shift Details

Controls the noise schedule of the flow matching (DiT) model.

| Value | Effect | Best for |
|---|---|---|
| 1.0–2.0 | Focuses on detail stage → precise texture & tone | Instrument timbre, mixing finesse |
| 3.0 | Semantics-oriented → structure follows prompt | Turbo default. Genre feel & mood |
| 4.0–5.0 | Maximum semantics → strong melody/rhythm control | When clear composition is needed |

#### Sampler (ODE / SDE) Details

| | ODE | SDE |
|---|---|---|
| Method | Deterministic sampling | Stochastic sampling (noise re-injection) |
| Reproducibility | Identical with same seed | Slightly varies even with same seed |
| Sound character | Clean, orderly | Organic, human-like fluctuation |
| Caution | Always stable | Quality risk at low steps (8) |
| Recommended | Turbo (8 steps) | Base (50+ steps) |

### ⚡ Performance Optimizations

- **use_cot_metas optimization**: When `format_input` already fetched BPM/Key, skips redundant metadata estimation during generation, saving **1–3 seconds**
- **Duration Auto**: Default behavior lets the LM auto-estimate optimal song length from lyrics

### 🔊 Volume Control

All players (inline, overlay, JUKEBOX) feature a volume slider. Click the speaker icon to mute/unmute. Volume setting persists in localStorage across sessions.

## Setup

### Requirements

- Python 3.10+
- ACE-Step 1.5 API server (started separately)
- LLM API server (optional, OpenAI-compatible)
- Image generation API server (optional, for background artwork)

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

# Specify image generation API
./start.sh --img-url http://YOUR_IMAGE_HOST:64656

# Change port
./start.sh --port 9000
```

Open `http://localhost:8889` in your browser.

### Starting the ACE-Step Server

Easy Music connects to the ACE-Step 1.5 REST API server for music generation.

#### Standard Startup (Official Command)

The standard startup method provided by the ACE-Step repository.

```bash
cd /path/to/ACE-Step-1.5

# Recommended (foreground)
uv run acestep-api --host 0.0.0.0 --port 8001

# Or start uvicorn manually
python -m uvicorn acestep.api_server:app --host 0.0.0.0 --port 8001 --workers 1
```

- Default: Turbo model, LM enabled
- Configurable via environment variables (`ACESTEP_CONFIG_PATH`, `ACESTEP_LM_MODEL_PATH`, etc.)
- `workers` must be 1 (in-memory queue)

#### Multi-model (Recommended)

Custom startup scripts are included in `ace_startup/` for different use cases.  
Copy them to your ACE-Step 1.5 installation folder before use.

```bash
# Copy scripts to the ACE-Step folder
cp ace_startup/run_api_server_*.sh /path/to/ACE-Step-1.5/
```

Loads both Turbo and Base models simultaneously, allowing per-request switching.  
The UI "Model" selector automatically routes to the correct model.

```bash
cd /path/to/ACE-Step-1.5
./run_api_server_multimodel.sh
```

- Default: Turbo (fast); send `"model": "acestep-v15-base"` in request for Base
- LM: 4B (high quality), backend: vllm
- Recommended VRAM: 24GB

#### Low-VRAM

For VRAM-constrained environments. Loads a single model with CPU offloading enabled.  
Per-request model switching is not available in this mode.

```bash
cd /path/to/ACE-Step-1.5
./run_api_server_lowvram.sh

# Start with Base model instead
ACESTEP_CONFIG_PATH=acestep-v15-base ./run_api_server_lowvram.sh
```

- Default: Turbo only
- LM: 1.7B (lightweight), CPU offload enabled
- Best when sharing VRAM with other applications

> See `ace_startup/起動コマンド.md` and `ace_startup/運用メモ_同時実行数とキュー.md` for details.

### Server Version (Multi-user)

Works as-is for multiple simultaneous users.  
Task IDs are UUIDs (128-bit) generated by the ACE-Step API and are unguessable, so no session management is needed.  
History is stored in the browser's sessionStorage (independent per tab).

```bash
# Start server version
./start_server.sh

# Specify ACE-Step API
./start_server.sh --ace-url http://YOUR_ACE_HOST:8001

# Specify image generation API too
./start_server.sh --ace-url http://YOUR_ACE_HOST:8001 --img-url http://YOUR_IMAGE_HOST:64656
```

| Feature | Web App (`start.sh`) | Server (`start_server.sh`) |
|---------|---------------------|---------------------------|
| Connections | Single user | Multi-user |
| History | sessionStorage | sessionStorage |
| Features | Same | Same |

### Environment Variables (.env)

```env
ACE_STEP_API_URL=http://localhost:8001
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_API_KEY=YOUR_KEY
OPENAI_CHAT_MODEL=gemma3:latest
IMAGE_GENERATION_URL=http://192.168.5.73:64656
HOST=0.0.0.0
PORT=8889
```

### Background Image Server

The background artwork feature uses an image generation server that provides `POST /generate/`.

- Default URL: `http://192.168.5.73:64656`
- CLI options:
	- `--img-url http://HOST:64656`
	- `--img-host HOST`
	- `--img-port 64656`
- Since the image server is separate from the music server, music and image generation can run in parallel

If image generation finishes slightly later than music generation, the background is still updated automatically during playback.

## Structure

```
easy_music/
├── main.py                 # FastAPI app (web app version)
├── main_server.py          # Server version (wrapper)
├── config.py               # Configuration
├── requirements.txt
├── start.sh                # Web app version launcher
├── start_server.sh         # Server version launcher
├── routers/
│   ├── generate.py         # Music generation API (with audio proxy)
│   └── lyrics.py           # Lyrics / theme / caption API
├── services/
│   ├── ace_step_client.py  # ACE-Step API client
│   ├── llm_service.py      # External LLM service
│   └── local_llm_service.py # Local LLM fallback
├── templates/
│   └── index.html          # Main page
├── static/
│   ├── app.js              # Frontend JS (silent detection, history)
│   ├── style.css           # Stylesheet
│   └── image/              # Genre images
├── models/                 # GGUF models (auto-download)
├── ace_startup/            # ACE-Step server startup scripts & docs
└── docs/                   # Documentation
```

## License

MIT License
