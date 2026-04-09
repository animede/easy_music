# 🎵 Easy Music — Quick Start Guide

Pick a genre, click generate — anyone can create music with AI!

---

## 📖 Table of Contents

1. [What This App Does](#what-this-app-does)
2. [How to Use](#how-to-use)
3. [Quick Generate (Omakase)](#quick-generate-omakase)
4. [JUKEBOX Auto-Play Mode](#jukebox-auto-play-mode)
5. [Settings Explained](#settings-explained)
6. [Advanced Settings](#advanced-settings)
7. [Genre List & Characteristics](#genre-list--characteristics)
8. [Tips for Better Music](#tips-for-better-music)
9. [FAQ](#faq)

---

## 🎯 What This App Does

Easy Music uses the **ACE-Step 1.5** AI music generation engine to automatically create music just by selecting a genre.

- 🎵 **30 Genres** — J-POP, Rock, Jazz, EDM, Enka, Vocaloid, and more
- 🤖 **AI Lyrics** — Auto-generates lyrics based on your theme
- 😊 **Mood / Vocal Chips** — Pick from 10 moods and 6 vocal types; automatically reflected in AI caption generation
- 🎛️ **Auto / Manual Caption** — Generates optimal captions (music style instructions) per genre
- 🎼 **AI Enhancement** — Automatic BPM, key, and time signature estimation
- 🔊 **Inline Player** — With spectrum visualizer
- 🎨 **Visualizer Mood** — LLM infers mood from lyrics/genre, auto-switches 10 color themes × 10 animation modes
- 🌏 **13 Languages** — Japanese, English, Chinese, Korean, and more
- 🎶 **JUKEBOX Auto-Play** — Select genres and enjoy endless AI-generated music, one track after another
- 🪄 **Quick Generate** — Describe what you want in natural language and AI decides all parameters
- 🚫 **Negative Prompt** — Specify elements to avoid for better quality
- ⚙️ **Advanced Settings** — Shift, Sampler (ODE/SDE) and more for power users
- 🔊 **Volume Control** — Volume slider + mute on all players

---

## ⚡ How to Use

### Step 1: Choose a Genre

Click on a genre tile from the grid. It will highlight in purple when selected.

### Step 2: Open Lyrics Settings (Optional)

Click the **"Lyrics Settings"** accordion to expand three sub-sections. **All are optional — leaving them blank is fine.**

#### 😊 Advanced Options (Mood / Vocal)

Select one mood chip and one vocal chip to shape the song's feel. Your choices are automatically passed to AI caption generation.

| Mood examples | Vocal examples |
|---|---|
| 😊 Bright / 😢 Bittersweet / 🔥 Intense / 🍃 Calm | 👩 Female / 👨 Male / 🎤 Powerful |
| ✨ Mysterious / 💕 Romantic / 🎉 Playful | 🌬️ Whisper / 🎵 Falsetto / 👥 Harmonies |
| 🌙 Melancholic / 🏔️ Epic / 😎 Cool | |

> 💡 Click again to deselect. When Auto Caption is ON, chips are added as style hints to the built-in caption.

#### 💬 Theme / Scenario

Describe your song idea. **Leaving it blank is fine** — the AI will come up with a theme automatically.

**Examples:**
```
Memories of spending time with a lover at the summer beach
```
```
An afternoon reading at a café on a rainy day
```

#### 🚫 Negative Prompt

Specify elements to avoid during generation — similar to negative prompts in image generation AI.

- **If left blank**: A default is automatically applied → `low quality, noisy, distorted, muddy, clipping, off-key, out of tune, amateur, poorly mixed`
- **Effect**: Suppresses noise, clipping, off-key, and poor mixing for overall quality improvement
- **Customization**: Enter your own text to avoid specific instruments, tones, or styles

> 💡 The default works well for most cases. Leave it blank unless you have a specific reason to change it.

#### 🎵 Lyrics (AI auto-generates if blank)

You can write your own lyrics. **If left blank, AI will auto-generate** them. Use the **♻️ Regenerate** button to clear and re-generate with AI.

### Step 3: Hit Generate

Click the "🎵 Generate Music" button and let the AI do the rest!

**Automatic pipeline:**
1. Theme generation (if blank)
2. AI lyrics writing (if lyrics are blank)
3. Caption generation (based on genre info)
4. AI enhancement (auto-set BPM, key, time signature)
5. Music generation (completes in 1–3 minutes)

### Step 4: Play

Once complete, a player appears. Enjoy your music with the spectrum visualizer!

🔊 **Volume**: Use the slider next to the speaker icon to adjust volume. Click the icon to mute/unmute. Your volume setting is saved in the browser and restored on next visit.

---

## 🪄 Quick Generate (Omakase)

Just type something like "a refreshing pop song for a summer beach" and the AI **automatically determines all parameters** — genre, caption, lyrics, BPM, key, and more — to generate music.

### How to Use

1. Enter text in the input field above the genre tiles
2. Press the "🎵 Generate Music" button
3. AI decides everything and starts generating

### 🎲 Random Button

Press the **🎲** button next to the input field to auto-fill the form with random caption, lyrics, and settings. Great when you just want to hear something new.

> 💡 Quick Generate uses ACE-Step's `sample_query` API. Compared to selecting a genre tile, the LM generates everything internally, resulting in more coherent output.

---

## 🎶 JUKEBOX Auto-Play Mode

JUKEBOX is an auto-play feature where AI continuously generates and plays new songs based on your selected genres. Like a radio station, just press one button for unlimited new music.

### How to Use

1. Click the **🎶 Auto-Play** button in the header to switch to JUKEBOX mode
2. Select one or more genre tiles (multi-select enabled)
3. Press the **▶ JUKEBOX Start** button
4. AI randomly picks from your selected genres and generates a new track
5. When one track ends, the next is automatically generated and played
6. Press **■ STOP** to stop

### JUKEBOX Features

- 🎲 **Random Selection**: Randomly picks one genre from your selections each time
- 🤖 **Fully Automatic**: Theme, lyrics, BPM, key — all decided by AI
- 🎬 **Visualizer**: Full-screen overlay with audio-reactive animations
- 🌟 **10 Animation Modes**: Spectrum / Wave / Ring / Particles / Pulse / Aurora / Fireworks / Matrix / Orbit / Fire
- 🎨 **Mood-Adaptive Colors**: LLM classifies songs into 10 mood categories, auto-switching colors, intensity, and preferred mode
- 🎨 **Genre Background**: Displays a background image matching the playing genre
- 📝 **Lyrics Display**: Shows generated lyrics on the overlay
- 🔢 **Play Count**: Real-time display of how many tracks have been played

### Visualizer Animation Modes

Switch via the selector at the bottom-left of the overlay:

| Mode | Description |
|------|-------------|
| **Spectrum** ▮▮ | Frequency spectrum bars |
| **Wave** 〜 | Waveform animation |
| **Ring** ○ | Circular visualizer |
| **Particles** ✧ | Audio-reactive particles |
| **Pulse** ◉ | Pulsating rings synced to volume |
| **Aurora** 🌊 | Flowing light bands |
| **Fireworks** 🎆 | Bass-reactive firework bursts |
| **Matrix** 💻 | Digital rain (katakana + binary) |
| **Orbit** 🪐 | Light spheres orbiting a core |
| **Fire** 🔥 | Rising flames from the bottom |

### Visualizer Mood (Auto Color Theming)

The LLM analyzes lyrics and genre to classify songs into 10 mood categories. Hue, saturation, brightness, effect intensity, and preferred mode are automatically adjusted.

| Mood | Color Palette | Preferred Modes |
|------|--------------|----------------|
| **energetic** | Orange – Yellow | Spectrum, Particles, Fireworks |
| **melancholic** | Blue-purple – Indigo | Wave, Pulse, Aurora |
| **healing** | Green – Deep blue | Wave, Aurora, Pulse |
| **epic** | Red-gold – Amber | Ring, Spectrum, Orbit, Fire |
| **cyber** | Cyan – Magenta | Particles, Ring, Matrix |
| **romantic** | Pink – Rose | Pulse, Wave, Orbit |
| **dark** | Deep purple – Dark red | Ring, Particles, Fire |
| **festive** | Rainbow (rotating) | Particles, Fireworks, Spectrum |
| **nostalgic** | Sepia – Warm tones | Wave, Pulse, Aurora |
| **mystical** | Indigo – Emerald | Ring, Pulse, Orbit, Aurora |

**Auto-switching behavior:**
- Each new track → LLM infers mood → randomly picks from preferred modes
- Manually selected mode → stays fixed for that track
- Next track → returns to mood-based auto-selection

### Playback Screen Controls

- **Click the overlay**: Returns to the control panel (during JUKEBOX, music keeps playing)
- **🎵 Return to Player** button: A floating button appears at the bottom-right to return to the visualizer

### STOP Button Behavior

Pressing **■ STOP** immediately stops the current track and ends JUKEBOX. The overlay closes automatically and returns to the normal control screen.

> 💡 **Tip**: JUKEBOX is perfect for background music — work sessions, parties, relaxation time!

---

## ⚙️ Settings Explained

### Duration (seconds)

| Value | Use Case |
|-------|----------|
| **Auto** | LM auto-estimates optimal length from lyrics (**recommended**) |
| 30s | Quick test / short clip |
| 60s | Short version |
| 120s | Standard length |
| 180s | Near full-length |
| 240–300s | Extended tracks |

> 💡 Since v1.6, the default is Auto. The optimal length is automatically selected based on lyrics length.

### Language

Select the lyrics language. Supports 13 languages including Japanese, English, Chinese, and Korean. Lyrics will be generated in the chosen language.

### Instrumental

Check this to generate vocal-free instrumental tracks. Great for BGM or study music.

> 💡 Trance, Mood, Driving, and Folklore are automatically set to instrumental.

### Auto Caption

Uses built-in captions (music style instructions) optimized for each genre. ON by default.

- **ON**: Uses the optimal caption preset for the genre tile (recommended)
- **OFF**: Asks the external LLM to generate a caption (more creative but slower). Mood/Vocal chips are reflected in the generated text.

### Thinking

Switches the caption generation style.

- **ON** (default): ACE-Step's internal reasoning completes the music. A short hint sentence is passed.
- **OFF**: The LLM generates a full 3–5-sentence detailed production brief, specifying instruments, rhythm, and vocal style.

### STEP (Quality Steps)

Balances generation quality vs. speed.

| Value | Use case |
|-------|----------|
| 8 | Turbo — fast test |
| 20 | Quick preview |
| 50 | Standard (recommended) |
| 80 | High quality |
| 100 | Best quality (slower) |

### Details Button

Press "Details" to view the parameters used during generation (caption, lyrics, submission parameters).

---

## ⚙️ Advanced Settings

Open the "Advanced Settings" accordion in the control bar to access these power-user parameters.

### Shift (Timestep Shift)

Controls the noise schedule of the flow matching (DiT) model. Lower values focus on detail; higher values focus on overall structure.

| Value | Effect | Best for |
|---|---|---|
| **Auto** | Model-appropriate default (**recommended**) | Works well for most cases |
| 1.0–2.0 | Detail stage focus → precise texture & tone | Instrument timbre, mixing finesse |
| 3.0 | Semantics-oriented → structure follows prompt | Turbo default. Genre feel & mood |
| 4.0–5.0 | Maximum semantics → strong melody/rhythm control | When clear composition is needed |

> 💡 **Turbo model**: Default 3.0. **Base model**: 1.0–2.0 recommended.

### Sampler (Inference Sampler)

Choose the sampling method for music generation.

| | ODE (recommended) | SDE |
|---|---|---|
| **Method** | Deterministic sampling | Stochastic sampling (noise re-injection) |
| **Reproducibility** | Identical with same seed | Slightly varies even with same seed |
| **Sound character** | Clean, orderly | Organic, human-like fluctuation |
| **Stability** | Always stable | Noise risk at low steps (8) |
| **Recommended** | Turbo (8 steps) | Base (50+ steps) |

> 💡 **Beginners should keep ODE (default)**. SDE with Base model + 50+ steps gives organic, lively textures.

### Volume Control

All players (inline, overlay, JUKEBOX) have a speaker icon and volume slider.

- 🔊 **Click speaker icon**: Mute / unmute
- **Slider**: Adjust volume from 0–100%
- **Persistent**: Volume is saved in localStorage and restored on next visit

---

## 🎵 Genre List & Characteristics

### Major Western
| Genre | Characteristics |
|-------|----------------|
| **J-POP** | Catchy melody, bright and emotional |
| **Rock** | Guitar-driven, energetic |
| **Jazz** | Smooth and sophisticated sound |
| **Electronic** | Synth and digital sound |
| **R&B** | Soulful, smooth groove |
| **Hip-Hop** | Rap beats, rhythmic |
| **Country** | Acoustic guitar, banjo, warm storytelling |
| **Folk** | Acoustic, storytelling |

### Era-Based
| Genre | Characteristics |
|-------|----------------|
| **70's Kayokyoku** | Retro, nostalgic, dramatic |
| **80's Folk** | Acoustic, singer-songwriter |
| **90's J-POP** | Band sound, golden era J-POP |
| **New Music** | Poetic, mellow |

### Japan-Specific
| Genre | Characteristics |
|-------|----------------|
| **Vocaloid** | Synthetic voice, fast tempo, futuristic |
| **Anime Song** | Dramatic, emotional, anime OP style |
| **Children's** | Gentle, warm, for kids |
| **Enka** | Vibrato, melancholic, traditional Japanese ballad |
| **Min'yo** | Shakuhachi, taiko, pentatonic |

### Mood / BGM
| Genre | Characteristics | Note |
|-------|----------------|------|
| **Trance** | Uplifting, synth pads | Auto instrumental |
| **Mood** | Smooth jazz, lounge | Auto instrumental |
| **Driving** | Refreshing, coastal drive | Auto instrumental |
| **Acoustic Pop** | Fingerpicking, café style | — |
| **Bossa Nova** | Brazilian jazz, relaxing | — |
| **Lo-Fi** | Chill beats, vinyl crackle | — |
| **City Pop** | 80's funky, urban | — |

### World
| Genre | Characteristics | Note |
|-------|----------------|------|
| **Chanson** | French, accordion, romantic | — |
| **Folklore** | Andean folk, quena flute | Auto instrumental |

### Dance / Trend
| Genre | Characteristics |
|-------|----------------|
| **Reggaeton** | Latin dance, dembow rhythm |
| **K-POP** | Korean pop, polished production |
| **Phonk** | Memphis rap influence, dark |
| **EDM** | Festival anthem, synth drop |

---

## 🎨 Tips for Better Music

### Writing a Good Theme

#### ❌ Too vague
```
A fun song
```

#### ✅ Specific and vivid
```
A young couple walking through cherry blossoms in spring. The start of a hopeful new life.
```
```
Midnight in Tokyo, walking alone through a neon-lit rainy alley.
```

**Key points:**
- Describe a specific scene or setting
- Include emotions and atmosphere
- Even 1–2 sentences is enough

### Writing Your Own Lyrics

Using structure tags improves quality:

```
[verse]
Walking through the morning city
A brand new day begins

[chorus]
Let's walk the road to the future
Overcoming every obstacle

[verse]
Through rain and wind
A light still burns in my heart

[chorus]
Let's walk the road to the future
Until our dreams come true
```

**Available tags:**
| Tag | Meaning |
|-----|---------|
| `[verse]` | Verse / A-melody |
| `[chorus]` | Chorus / Hook |
| `[pre-chorus]` | Pre-chorus / B-melody |
| `[bridge]` | Bridge / C-melody |
| `[intro]` | Introduction |
| `[outro]` | Outro / Ending |
| `[instrumental]` | Instrumental break |

### Genre Selection Tips

- **First time**: J-POP, Rock — stable results
- **BGM**: Lo-Fi, Bossa Nova, Mood
- **High impact**: EDM, Phonk, Trance
- **Japanese style**: Enka, Min'yo, 70's Kayokyoku
- **Stylish**: City Pop, Jazz, Acoustic Pop

---

## ❓ FAQ

### Q: How long does generation take?

About 1 minute for a 60-second track, about 2 minutes for 120 seconds. Varies with server load.

### Q: Is it okay to leave both theme and lyrics blank?

Yes — as long as you select a genre, AI handles everything. Adding a theme gives more control over the result.

### Q: Will I get the same song if I generate the same genre repeatedly?

No, each generation produces a randomly different song.

### Q: How do I make a vocal-free track?

Check "Instrumental." Trance, Mood, Driving, and Folklore are automatically instrumental.

### Q: The lyrics come out in the wrong language

Change the "Language" setting to your desired language.

### Q: Do I need an external LLM?

No. If the external LLM (e.g., Gemma) is unavailable, the app automatically falls back to a local LLM (Qwen3-1.7B). The first run downloads the model (~1.1 GB), which takes a few minutes.

### Q: I'm getting errors during generation

Check the following:
1. Is the ACE-Step API server running?
2. Is your network connection stable?
3. Are there any errors in the browser console?

---

## 🎉 Let's Make Music!

1. Pick a genre
2. Press "🎵 Generate Music"
3. Done!

**Enjoy creating music!** 🎵
