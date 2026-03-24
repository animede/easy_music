/**
 * Easy Music — AI Music Generator
 * Self-contained JavaScript with i18n (JA/EN) support.
 */

console.log('Easy Music app.js loaded');

// =============================================================================
// i18n — 日英切替
// =============================================================================

let currentUILang = localStorage.getItem('easymusic_uilang') || 'ja';

const I18N = {
    ja: {
        // Labels
        label_theme: 'テーマ / シナリオ',
        label_lyrics: '歌詞（空欄ならAIが自動生成）',
        label_genre: 'ジャンル',
        label_duration: '長さ',
        label_language: '言語',
        label_inst: '楽器のみ',
        label_builtin_caption: 'キャプション自動',
        btn_debug: '詳細情報',
        btn_debug_open: '詳細情報 ▲',
        btn_generate: '🎵 音楽を生成',
        btn_generating: '<span class="spinner"></span> 生成中...',
        title_download: 'ダウンロード',
        overlay_hint: 'タップで閉じる',
        // Placeholders
        placeholder_theme: '例: 夜空を見上げて願いを込める魔法少女の物語',
        placeholder_lyrics: '[verse]\n星の海に浮かぶ願いが\n夜空を駆け巡る\n\n[chorus]\n輝く未来へ...',
        // Duration options
        dur_30: '30秒', dur_45: '45秒', dur_60: '60秒', dur_90: '90秒',
        dur_120: '120秒', dur_180: '180秒', dur_240: '240秒', dur_300: '300秒',
        // Genre labels (Japanese unique)
        genre_70s: '70年代歌謡曲', genre_80s: '80年代フォーク', genre_90s: '90年代J-POP',
        genre_newmusic: 'ニューミュージック',
        genre_vocaloid: 'ボカロ', genre_anison: 'アニソン', genre_douyou: '童謡',
        genre_enka: '演歌', genre_minyo: '民謡',
        genre_mood: 'ムード', genre_driving: 'ドライビング',
        genre_bossanova: 'ボサノバ', genre_citypop: 'シティポップ',
        genre_chanson: 'シャンソン', genre_folklore: 'フォルクローレ',
        genre_reggaeton: 'レゲトン',
        // Debug panel
        debug_genre: 'ジャンル', debug_theme: 'テーマ', debug_mode: 'モード',
        debug_tags: 'タグ (raw)', debug_caption: 'キャプション',
        debug_lang: '言語', debug_params: 'パラメータ',
        // Status messages
        status_no_input: 'テーマ、歌詞、またはジャンルのいずれかを入力してください',
        status_theme_gen: '💡 テーマを生成中...',
        status_lyrics_gen: '歌詞を生成中...',
        status_lyrics_ai: '📝 AI作詞中...（外部LLM接続不可時はローカルLLMで生成）',
        status_lyrics_fail: '⚠️ 歌詞生成に失敗、ACE-Stepが内部生成します...',
        status_caption_gen: 'キャプション生成中...',
        status_caption_ai: '🎵 キャプションを生成中...',
        status_enhance: 'AI強化中...',
        status_enhance_ai: '✨ AI強化中（ACE-Step内蔵LLM）...',
        status_caption_detail: '🎵 キャプション詳細化中...',
        status_caption_detail_ai: '🎵 キャプション詳細化中（thinkingオフ）...',
        status_task_create: 'タスク作成中...',
        status_generating: '🎵 音楽を生成中...',
        status_complete: '曲 生成完了！',
        status_fail: '生成に失敗しました',
        status_fail_server: '生成に失敗しました（サーバーエラー）',
        status_fail_retry: '生成に失敗しました。しばらく待ってから再試行してください。',
        status_task_fail: 'タスク作成失敗',
        status_timeout: 'タイムアウト',
        status_error: '❌ エラー: ',
        status_unknown: '不明なエラー',
        // Progress phases
        phase_prep: '準備中...',
        phase_gen: '音楽を生成中 🎵',
        phase_finish: '仕上げ中...',
        phase_final: '最終処理中（もう少し）...',
        // Debug mode text
        mode_builtin: 'キャプション自動',
        mode_llm: '外部LLM生成',
        mode_inst: '楽器のみ',
        mode_enhanced: '✅ AI強化済み',
        mode_detailed: '✅ キャプション詳細化済み',
        mode_bpm_only: '✅ BPM/Key取得済み',
        mode_manual: '📝 手動指定',
        mode_skipped: '⚠️ AI強化スキップ',
        mode_no_genre: '(未選択)',
        mode_no_theme: '(なし)',
        mode_no_tags: '(タグなし — 外部LLMがキャプション全文を生成)',
        // JUKEBOX
        jukebox_btn_off: '🎶 自動演奏',
        jukebox_btn_on: '🎶 JUKEBOX ON',
        jukebox_label_multi: 'ジャンル（複数選択可）',
        jukebox_start: '▶ スタート',
        jukebox_stop: '⏹ ストップ',
        jukebox_stopping: '⏹ 停止中...',
        jukebox_stop_after: '🛑 現在の曲の再生後に停止します...',
        jukebox_preparing: '準備中...',
        jukebox_no_genre: 'ジャンルを1つ以上選択してください',
        jukebox_error: '❌ JUKEBOX エラー: ',
        jukebox_retry_exhausted: '❌ 生成に3回失敗しました。JUKEBOXを停止します。',
        jukebox_retrying: '⚠️ 生成失敗、リトライ中...',
        jukebox_generating: '🎵 JUKEBOX: 生成中',
        jukebox_playing: '🎶 JUKEBOX再生中',
        jukebox_select_hint: 'ジャンルを選んでください（複数可）',
        jukebox_selected_label: '🎶 JUKEBOX — 選択中のジャンル',
        jukebox_return_overlay: '🎵 再生画面に戻る',
        // Batch / Mood / Blend
        placeholder_debug_caption: '生成後にキャプションが表示されます。編集すると次回生成時に有効になります。',
        btn_caption_regen: '♻️ 再生成',
        btn_lyrics_regen: '♻️ 再生成',
        label_batch: '曲数',
        batch_1: '1曲', batch_2: '2曲', batch_4: '4曲',
        label_steps: 'STEP',
        label_thinking: 'Thinking',
        steps_8: '8 (Turbo)', steps_20: '20 (高速)', steps_50: '50 (標準)', steps_80: '80 (高品質)', steps_100: '100 (最高品質)',
        label_lyrics_settings: '作詞設定',
        label_options: '詳細オプション',
        label_mood: 'ムード：',
        mood_happy: '😊 明るい', mood_sad: '😢 切ない', mood_intense: '🔥 激しい',
        mood_calm: '🍃 穏やか', mood_mystic: '✨ 神秘的',
        mood_romantic: '💕 ロマンチック', mood_fun: '🎉 楽しい', mood_dark: '🌙 メランコリック',
        mood_epic: '🏔️ 壮大', mood_cool: '😎 クール',
        label_vocal: 'ボーカル：',
        vocal_female: '👩 女声', vocal_male: '👨 男声', vocal_powerful: '🎤 力強い',
        vocal_whisper: '🌬️ ウィスパー', vocal_falsetto: '🎵 ファルセット', vocal_harmony: '👥 ハーモニー',
        label_blend: '➕ ミックス：',
        blend_none: '（なし）',
        // History
        history_title: '履歴',
        history_empty: '生成履歴はまだありません',
        history_generating: '生成中...',
        history_play: '▶',
        history_download: '⬇️',
        history_ago_sec: '秒前',
        history_ago_min: '分前',
        history_ago_hour: '時間前',
        history_ago_day: '日前',
        // Silent audio
        status_silent: '⚠️ 音楽の生成に失敗しました（無音）。再度お試しください。',
        // Footer (not dynamic, stays in HTML)
    },
    en: {
        label_theme: 'Theme / Scenario',
        label_lyrics: 'Lyrics (leave blank for AI auto-generation)',
        label_genre: 'Genre',
        label_duration: 'Duration',
        label_language: 'Language',
        label_inst: 'Instrumental',
        label_builtin_caption: 'Auto Caption',
        btn_debug: 'Details',
        btn_debug_open: 'Details ▲',
        btn_generate: '🎵 Generate Music',
        btn_generating: '<span class="spinner"></span> Generating...',
        title_download: 'Download',
        overlay_hint: 'Tap to close',
        placeholder_theme: 'e.g. A magical girl gazing at the night sky, making a wish',
        placeholder_lyrics: '[verse]\nWishes floating in a sea of stars\nRacing across the night sky\n\n[chorus]\nToward a shining future...',
        dur_30: '30s', dur_45: '45s', dur_60: '60s', dur_90: '90s',
        dur_120: '120s', dur_180: '180s', dur_240: '240s', dur_300: '300s',
        genre_70s: "70's Kayokyoku", genre_80s: "80's Folk", genre_90s: "90's J-POP",
        genre_newmusic: 'New Music',
        genre_vocaloid: 'Vocaloid', genre_anison: 'Anime Song', genre_douyou: "Children's",
        genre_enka: 'Enka', genre_minyo: "Min'yo",
        genre_mood: 'Mood', genre_driving: 'Driving',
        genre_bossanova: 'Bossa Nova', genre_citypop: 'City Pop',
        genre_chanson: 'Chanson', genre_folklore: 'Folklore',
        genre_reggaeton: 'Reggaeton',
        // JUKEBOX
        jukebox_btn_off: '🎶 Auto Play',
        jukebox_btn_on: '🎶 JUKEBOX ON',
        jukebox_label_multi: 'Genre (multi-select)',
        jukebox_start: '▶ Start',
        jukebox_stop: '⏹ Stop',
        jukebox_stopping: '⏹ Stopping...',
        jukebox_stop_after: '🛑 Stopping after current track...',
        jukebox_preparing: 'Preparing...',
        jukebox_no_genre: 'Please select at least one genre',
        jukebox_error: '❌ JUKEBOX Error: ',
        jukebox_retry_exhausted: '❌ Failed 3 times. Stopping JUKEBOX.',
        jukebox_retrying: '⚠️ Generation failed, retrying...',
        jukebox_generating: '🎵 JUKEBOX: Generating',
        jukebox_playing: '🎶 JUKEBOX playing',
        jukebox_select_hint: 'Select genres (multi-select)',
        jukebox_selected_label: '🎶 JUKEBOX — Selected Genres',
        jukebox_return_overlay: '🎵 Return to Player',
        debug_genre: 'Genre', debug_theme: 'Theme', debug_mode: 'Mode',
        debug_tags: 'Tags (raw)', debug_caption: 'Caption',
        debug_lang: 'Language', debug_params: 'Parameters',
        status_no_input: 'Please enter a theme, lyrics, or select a genre',
        status_theme_gen: '💡 Generating theme...',
        status_lyrics_gen: 'Generating lyrics...',
        status_lyrics_ai: '📝 AI writing lyrics... (falls back to local LLM if external unavailable)',
        status_lyrics_fail: '⚠️ Lyrics generation failed, ACE-Step will generate internally...',
        status_caption_gen: 'Generating caption...',
        status_caption_ai: '🎵 Generating caption...',
        status_enhance: 'AI enhancing...',
        status_enhance_ai: '✨ AI enhancing (ACE-Step built-in LLM)...',
        status_caption_detail: '🎵 Generating detailed caption...',
        status_caption_detail_ai: '🎵 Detailing caption (thinking off)...',
        status_task_create: 'Creating task...',
        status_generating: '🎵 Generating music...',
        status_complete: ' track(s) generated!',
        status_fail: 'Generation failed',
        status_fail_server: 'Generation failed (server error)',
        status_fail_retry: 'Generation failed. Please wait and try again.',
        status_task_fail: 'Task creation failed',
        status_timeout: 'Timeout',
        status_error: '❌ Error: ',
        status_unknown: 'Unknown error',
        phase_prep: 'Preparing...',
        phase_gen: 'Generating music 🎵',
        phase_finish: 'Finishing up...',
        phase_final: 'Final processing (almost done)...',
        mode_builtin: 'Auto Caption',
        mode_llm: 'External LLM',
        mode_inst: 'Instrumental',
        mode_enhanced: '✅ AI Enhanced',
        mode_detailed: '✅ Caption Detailed',
        mode_bpm_only: '✅ BPM/Key Detected',
        mode_manual: '📝 Manual Caption',
        mode_skipped: '⚠️ AI Enhancement Skipped',
        mode_no_genre: '(none)',
        mode_no_theme: '(none)',
        mode_no_tags: '(no tags — external LLM generated full caption)',
        // Batch / Mood / Blend
        placeholder_debug_caption: 'Caption appears after generation. Edit to override on next run.',
        btn_caption_regen: '♻️ Regenerate',
        btn_lyrics_regen: '♻️ Regenerate',
        label_batch: 'Count',
        batch_1: '1 track', batch_2: '2 tracks', batch_4: '4 tracks',
        label_steps: 'STEP',
        label_thinking: 'Thinking',
        steps_8: '8 (Turbo)', steps_20: '20 (Fast)', steps_50: '50 (Standard)', steps_80: '80 (High Quality)', steps_100: '100 (Best Quality)',
        label_options: 'Options',
        label_lyrics_settings: 'Lyrics Settings',
        label_mood: 'Mood:',
        mood_happy: '😊 Bright', mood_sad: '😢 Sad', mood_intense: '🔥 Intense',
        mood_calm: '🍃 Calm', mood_mystic: '✨ Mystic',
        mood_romantic: '💕 Romantic', mood_fun: '🎉 Fun', mood_dark: '🌙 Melancholic',
        mood_epic: '🏔️ Epic', mood_cool: '😎 Cool',
        label_vocal: 'Vocal:',
        vocal_female: '👩 Female', vocal_male: '👨 Male', vocal_powerful: '🎤 Powerful',
        vocal_whisper: '🌬️ Whisper', vocal_falsetto: '🎵 Falsetto', vocal_harmony: '👥 Harmony',
        label_blend: '➕ Mix with:',
        blend_none: '(none)',
        // History
        history_title: 'History',
        history_empty: 'No generation history yet',
        history_generating: 'Generating...',
        history_play: '▶',
        history_download: '⬇️',
        history_ago_sec: 's ago',
        history_ago_min: 'm ago',
        history_ago_hour: 'h ago',
        history_ago_day: 'd ago',
        // Silent audio
        status_silent: '⚠️ Music generation failed (silent audio). Please try again.',
    }
};

/** Get translation for key */
function t(key) {
    return (I18N[currentUILang] && I18N[currentUILang][key]) || (I18N.ja[key]) || key;
}

/** Apply translations to all data-i18n elements */
function applyI18n() {
    // textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = t(key);
        if (el.tagName === 'OPTION') {
            el.textContent = val;
        } else if (el.innerHTML.includes('<span class="spinner">')) {
            // Skip — button is in generating state
        } else {
            el.textContent = val;
        }
    });
    // placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    // title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.title = t(el.getAttribute('data-i18n-title'));
    });
    // Update toggle button text
    const toggleBtn = document.getElementById('lang-toggle-btn');
    if (toggleBtn) {
        toggleBtn.textContent = currentUILang === 'ja' ? '🌐 EN' : '🌐 JP';
    }
    // Update page title
    document.title = currentUILang === 'ja' ? 'Easy Music — AI音楽生成' : 'Easy Music — AI Music Generator';
}

/** Toggle UI language */
function toggleUILang() {
    currentUILang = currentUILang === 'ja' ? 'en' : 'ja';
    localStorage.setItem('easymusic_uilang', currentUILang);
    applyI18n();
    // Update debug button text if panel is open
    const panel = document.getElementById('debug-panel');
    const btn = document.getElementById('debug-info-btn');
    if (panel && btn && !panel.classList.contains('collapsed')) {
        btn.textContent = t('btn_debug_open');
    }
}

// =============================================================================
// State
// =============================================================================

let selectedGenre = null;
let batchSize = 1;
let selectedMood = '';          // ムードチップ選択値
let selectedVocal = '';         // ボーカルチップ選択値
let selectedBlendGenre = null;  // ジャンルミックス: {name, hint}
let currentResults = [];
let currentTrackIndex = 0;
let currentLyrics = '';

// =============================================================================
// デバッグパネル（タグ・キャプション表示）
// =============================================================================
function toggleDebugPanel() {
    const panel = document.getElementById('debug-panel');
    const btn = document.getElementById('debug-info-btn');
    panel.classList.toggle('collapsed');
    if (panel.classList.contains('collapsed')) {
        btn.textContent = t('btn_debug');
        btn.classList.remove('active');
    } else {
        btn.textContent = t('btn_debug_open');
        btn.classList.add('active');
    }
}
function updateDebugPanel(info) {
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.tagName === 'TEXTAREA') { el.value = val || ''; }
        else { el.textContent = val || '—'; }
    };
    if (info.genre !== undefined) set('debug-genre', info.genre);
    if (info.theme !== undefined) set('debug-theme', info.theme);
    if (info.mode !== undefined) set('debug-mode', info.mode);
    if (info.tags !== undefined) set('debug-tags', info.tags);
    if (info.caption !== undefined) {
        set('debug-caption', info.caption);
        // AIが入力した値なのでユーザー編集フラグをリセット
        window._captionUserEdited = false;
    }
    if (info.lang !== undefined) set('debug-lang', info.lang);
    if (info.params !== undefined) set('debug-params', info.params);
}

// Language code → LLM language name mapping
const LANG_MAP = {
    'ja': 'Japanese', 'en': 'English', 'zh': 'Chinese', 'ko': 'Korean',
    'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian',
    'pt': 'Portuguese', 'ru': 'Russian', 'th': 'Thai', 'vi': 'Vietnamese',
    'id': 'Indonesian'
};

// Audio / Visualizer
let audioContext = null;
let analyser = null;
let dataArray = null;
let circleAnimId = null;
let isVisualizerReady = false;
let currentOverlayGenre = null;  // 現在オーバーレイに表示中のジャンル名
let vizMode = 'spectrum';        // 'spectrum' | 'wave' | 'ring' | 'particles' | 'pulse'
let vizModeUserSelected = false; // ユーザーが手動選択したらtrue、JUKEBOX開始時にリセット
let vizParticles = [];           // particles mode state
let vizTimeData = null;          // waveform data buffer

// JUKEBOX state
let jukeboxMode = false;
let jukeboxRunning = false;
let jukeboxCategories = [];    // [{name, hint, forceInst}, ...]
let jukeboxTrackCount = 0;
let jukeboxNextReady = null;   // {audioUrl, genre, lyrics} or null
let jukeboxStopRequested = false;
let jukeboxGenerating = false;

// =============================================================================
// Silent Audio Detection
// =============================================================================

/**
 * 音声URLをfetchしてデコード、RMS音量+ピーク値で無音か判定
 * @param {string} url - 音声ファイルURL
 * @returns {Promise<boolean>} true=無音, false=正常
 */
async function isSilentAudio(url) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.warn('[SilentCheck] fetch failed:', response.status);
                return true;
            }
            const arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer.byteLength < 1000) {
                console.warn('[SilentCheck] file too small:', arrayBuffer.byteLength);
                return true;
            }
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            // 全チャンネルの RMS + ピーク値を計算
            let totalRms = 0;
            let globalPeak = 0;
            for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
                const data = audioBuffer.getChannelData(ch);
                // 先頭0.5秒のリードインを飛ばして計測
                const skip = Math.min(Math.floor(audioBuffer.sampleRate * 0.5), data.length);
                const len = data.length - skip;
                if (len <= 0) { totalRms += 0; continue; }
                let sum = 0;
                for (let i = skip; i < data.length; i++) {
                    const v = Math.abs(data[i]);
                    sum += data[i] * data[i];
                    if (v > globalPeak) globalPeak = v;
                }
                totalRms += Math.sqrt(sum / len);
            }
            const avgRms = totalRms / audioBuffer.numberOfChannels;
            // 判定: RMS < 0.005 (-46 dBFS) かつ ピーク < 0.02 ならば無音
            const isSilent = avgRms < 0.005 && globalPeak < 0.02;
            console.log(`[SilentCheck] RMS=${avgRms.toFixed(6)} Peak=${globalPeak.toFixed(6)} → ${isSilent ? 'SILENT' : 'OK'}`);
            return isSilent;
        } finally {
            ctx.close();
        }
    } catch (e) {
        console.warn('[SilentCheck] decode error:', e.message);
        return true; // デコード失敗も異常扱い
    }
}

// =============================================================================
// API Helper (self-contained)
// =============================================================================

/**
 * ACE-Step 1.5 キャプション サニタイズ
 * 
 * 制約 (acestep/handler.py, constrained_logits_processor.py より):
 * - text_encoder max_length = 256 tokens (Qwen3-Embedding-0.6B)
 * - constrained decoder: caption < 512 tokens
 * - バッククォート禁止 (コードブロック扱い)
 * - 改行は避ける (YAML値としてパースされる)
 * - ピリオドで終わるのが最適 (FSM遷移条件)
 * - 英語が最適 (text encoder訓練言語)
 */
function sanitizeCaption(text) {
    if (!text) return text;
    // バッククォート除去
    text = text.replace(/`/g, '');
    // 改行→スペース
    text = text.replace(/[\n\r]+/g, ' ');
    // 制御文字除去
    text = text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
    // Markdown太字除去
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    // Markdown斜体除去
    text = text.replace(/\*(.*?)\*/g, '$1');
    // 連続スペース整理
    text = text.replace(/\s{2,}/g, ' ').trim();
    // 480文字を超える場合は文の切れ目で切断
    if (text.length > 480) {
        const cut = text.lastIndexOf('. ', 480);
        if (cut > 200) {
            text = text.substring(0, cut + 1);
        } else {
            text = text.substring(0, 480).trim();
            const lastSpace = text.lastIndexOf(' ');
            if (lastSpace > 200) text = text.substring(0, lastSpace);
        }
    }
    // ピリオド終端
    if (text && !text.endsWith('.')) {
        text = text.replace(/[,;:]+$/, '') + '.';
    }
    return text;
}

async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (data) options.body = JSON.stringify(data);
    const res = await fetch(endpoint, options);
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    return res.json();
}

function convertAudioUrl(url) {
    if (!url) return url;
    try {
        const u = new URL(url);
        if (u.pathname === '/v1/audio') {
            const path = u.searchParams.get('path');
            if (path) return `/api/audio?path=${encodeURIComponent(path)}`;
        }
    } catch (_) {}
    return url;
}

// =============================================================================
// Time Estimation (copied from app.js — self-contained)
// =============================================================================

function estimateGenerationTime(params) {
    const steps = params.inference_steps || 150;
    const duration = params.audio_duration || 60;
    const batch = params.batch_size || 1;
    const thinking = params.thinking !== false;
    const lmTime = thinking ? 4 : 1.5;
    const ditTime = steps * duration * 0.006;
    const batchFactor = 1 + (batch - 1) * 0.8;
    const overhead = 2;
    const estimated = (lmTime + ditTime * batchFactor + overhead) * 1.3;
    return Math.max(8, Math.min(600, estimated));
}

function smoothProgress(elapsedSec, expectedSec) {
    if (expectedSec <= 0) return 5;
    const ratio = elapsedSec / expectedSec;
    if (ratio <= 0) return 5;
    if (ratio <= 0.15) return 5 + (ratio / 0.15) * 10;
    if (ratio <= 0.85) return 15 + ((ratio - 0.15) / 0.7) * 70;
    if (ratio <= 1.0) return 85 + ((ratio - 0.85) / 0.15) * 10;
    return Math.min(95, 95 + (ratio - 1.0) * 2);
}

function getProgressPhaseText(elapsedSec, expectedSec) {
    const ratio = elapsedSec / expectedSec;
    if (ratio < 0.15) return t('phase_prep');
    if (ratio < 0.85) return t('phase_gen');
    if (ratio < 1.0) return t('phase_finish');
    return t('phase_final');
}

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// =============================================================================
// UI Helpers
// =============================================================================

function showSimpleStatus(msg, type = 'info') {
    const el = document.getElementById('simple-status');
    el.textContent = msg;
    el.className = `simple-status visible ${type}`;
}
function hideSimpleStatus() {
    const el = document.getElementById('simple-status');
    el.className = 'simple-status';
    el.textContent = '';
}
function showSimpleProgress(pct, text = '') {
    const container = document.getElementById('simple-progress');
    const fill = document.getElementById('simple-progress-fill');
    const txt = document.getElementById('simple-progress-text');
    container.classList.add('visible');
    fill.style.width = `${pct}%`;
    if (text) txt.textContent = pct > 0 && pct < 100 ? `${text} [${Math.round(pct)}%]` : text;
}
function hideSimpleProgress() {
    document.getElementById('simple-progress').classList.remove('visible');
}

// =============================================================================
// Genre Selection
// =============================================================================

function getBatchSize() {
    return parseInt(document.getElementById('simple-batch')?.value || '1') || 1;
}

function getSteps() {
    return parseInt(document.getElementById('simple-steps')?.value || '50') || 50;
}

function getThinking() {
    return document.getElementById('simple-thinking')?.checked !== false;
}

function getManualCaption() {
    // ユーザーが実際に編集したときのみ手動指定扱いにする
    // AIが自動入力した内容はスルー
    if (!window._captionUserEdited) return '';
    return (document.getElementById('debug-caption')?.value || '').trim();
}

function clearManualCaption() {
    const el = document.getElementById('debug-caption');
    if (el) el.value = '';
    window._captionUserEdited = false;
    window._lastSeed = null;
}

function clearLyrics() {
    const el = document.getElementById('simple-lyrics');
    if (el) el.value = '';
    window._lastSeed = null;
}

function getMood() { return selectedMood; }
function getVocal() { return selectedVocal; }

function setBlendGenre(selectEl) {
    const val = selectEl.value;
    if (!val) { selectedBlendGenre = null; return; }
    const opt = selectEl.options[selectEl.selectedIndex];
    selectedBlendGenre = { name: val, hint: opt.dataset.hint || val };
}

function clearBlendGenre() {
    selectedBlendGenre = null;
    const sel = document.getElementById('blend-genre-select');
    if (sel) sel.value = '';
}

function initGenreGrid() {
    document.querySelectorAll('.genre-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            // JUKEBOX mode: multi-select
            if (jukeboxMode) {
                handleJukeboxGenreClick(tile);
                return;
            }
            const wasSelected = tile.classList.contains('selected');
            // deselect all
            document.querySelectorAll('.genre-tile').forEach(t => t.classList.remove('selected'));
            const instCheckbox = document.getElementById('simple-inst');
            // ジャンル変更時: AI生成歌詞をクリア
            clearAutoLyrics();
            if (!wasSelected) {
                tile.classList.add('selected');
                selectedGenre = {
                    name: tile.dataset.genre,
                    hint: tile.dataset.captionHint,
                    forceInst: tile.dataset.forceInst === 'true'
                };
                // 強制インストジャンル: チェックON + 無効化
                if (selectedGenre.forceInst) {
                    instCheckbox.checked = true;
                    instCheckbox.disabled = true;
                } else {
                    instCheckbox.checked = false;
                    instCheckbox.disabled = false;
                }
            } else {
                selectedGenre = null;
                instCheckbox.disabled = false;
            }
            // ジャンルミックス行の表示/非表示
            const blendRow = document.getElementById('genre-blend-row');
            if (blendRow) blendRow.style.display = selectedGenre ? 'flex' : 'none';
            clearBlendGenre();
        });
    });

    // ジャンルミックス: 選択肢をメイングリッドと同期して生成
    const blendSelect = document.getElementById('blend-genre-select');
    if (blendSelect) {
        document.querySelectorAll('.genre-tile').forEach(tile => {
            const opt = document.createElement('option');
            opt.value = tile.dataset.genre;
            opt.dataset.hint = tile.dataset.captionHint || '';
            const labelEl = tile.querySelector('.genre-label');
            opt.textContent = labelEl ? labelEl.textContent.trim() : tile.dataset.genre;
            blendSelect.appendChild(opt);
        });
    }

    // ムードチップ初期化
    document.querySelectorAll('#mood-chips .mood-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const isActive = chip.classList.contains('active');
            document.querySelectorAll('#mood-chips .mood-chip').forEach(c => c.classList.remove('active'));
            selectedMood = '';
            if (!isActive) {
                chip.classList.add('active');
                selectedMood = chip.dataset.mood;
            }
        });
    });

    // ボーカルチップ初期化
    document.querySelectorAll('#vocal-chips .mood-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const isActive = chip.classList.contains('active');
            document.querySelectorAll('#vocal-chips .mood-chip').forEach(c => c.classList.remove('active'));
            selectedVocal = '';
            if (!isActive) {
                chip.classList.add('active');
                selectedVocal = chip.dataset.vocal;
            }
        });
    });
}

// =============================================================================
// Duration Controls
// =============================================================================

function getSelectedDuration() {
    return parseInt(document.getElementById('simple-duration').value) || 120;
}

function getSelectedLanguage() {
    return document.getElementById('simple-language').value || 'ja';
}

function getSelectedLanguageName() {
    const code = getSelectedLanguage();
    return LANG_MAP[code] || 'English';
}

// 言語変更時: AI生成歌詞をクリア
document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('simple-language');
    if (langSelect) {
        langSelect.addEventListener('change', () => clearAutoLyrics());
    }
    // debug-captionへの入力を検知して「手動編集」フラグを立てる
    const captionEl = document.getElementById('debug-caption');
    if (captionEl) {
        captionEl.addEventListener('input', () => {
            window._captionUserEdited = true;
        });
    }
});

/**
 * AI生成歌詞のみクリア（ユーザーが手入力したものかの判定は難しいのでテーマも同時クリア）
 */
function clearAutoLyrics() {
    const lyricsEl = document.getElementById('simple-lyrics');
    const themeEl = document.getElementById('simple-theme');
    if (lyricsEl) lyricsEl.value = '';
    if (themeEl) themeEl.value = '';
}

// =============================================================================
// Main Generate Flow
// =============================================================================

async function generateSimple() {
    let theme = document.getElementById('simple-theme').value.trim();
    const lyrics = document.getElementById('simple-lyrics').value.trim();
    const isInst = document.getElementById('simple-inst').checked;

    if (!theme && !lyrics && !selectedGenre) {
        showSimpleStatus(t('status_no_input'), 'error');
        return;
    }

    const btn = document.getElementById('simple-generate-btn');
    btn.disabled = true;
    btn.innerHTML = t('btn_generating');
    hideSimpleStatus();

    try {
        // ---- Step 0: テーマ自動生成（テーマ・歌詞が空でジャンル選択済み） ----
        if (!theme && !lyrics && selectedGenre) {
            showSimpleStatus(t('status_theme_gen'), 'info');
            try {
                const themeResult = await apiRequest('/api/theme', 'POST', {
                    genre: selectedGenre.name,
                    language: getSelectedLanguageName()
                });
                if (themeResult.success && themeResult.theme) {
                    theme = themeResult.theme;
                } else {
                    // フォールバック: ジャンル名をテーマに
                    theme = selectedGenre.name;
                }
            } catch (e) {
                console.warn('[EasyMusic] Step0: theme generation failed:', e);
                theme = selectedGenre.name;
            }
            document.getElementById('simple-theme').value = theme;
        }
        // ---- Step 1: 歌詞の確定 ----
        let effectiveLyrics = lyrics;
        console.log('[EasyMusic] Step1: isInst=', isInst, 'lyrics.length=', lyrics.length, 'effectiveLyrics=', effectiveLyrics.substring(0, 50));
        if (isInst) {
            effectiveLyrics = '[inst]';
            console.log('[EasyMusic] Step1: instrumental mode → [inst]');
        } else if (!lyrics) {
            // 歌詞が空 → AI作詞
            console.log('[EasyMusic] Step1: lyrics empty → generating via API...');
            showSimpleProgress(0, t('status_lyrics_gen'));
            showSimpleStatus(t('status_lyrics_ai'), 'info');
            try {
                const lyricsResult = await apiRequest('/api/lyrics', 'POST', {
                    theme: theme || (selectedGenre ? selectedGenre.name : ''),
                    genre: selectedGenre ? selectedGenre.name : '',
                    language: getSelectedLanguageName(),
                    mood: getMood(),
                    vocal: getVocal()
                });
                console.log('[EasyMusic] Step1: lyrics API result:', lyricsResult.success, 'len=', (lyricsResult.lyrics||'').length);
                if (lyricsResult.success && lyricsResult.lyrics) {
                    effectiveLyrics = lyricsResult.lyrics;
                    document.getElementById('simple-lyrics').value = effectiveLyrics;
                } else {
                    console.warn('[EasyMusic] Step1: lyrics API returned no lyrics:', lyricsResult.error);
                }
            } catch (lyricsErr) {
                console.error('[EasyMusic] Step1: lyrics generation failed:', lyricsErr);
                showSimpleStatus(t('status_lyrics_fail'), 'info');
                await sleep(1500);
            }
        } else {
            console.log('[EasyMusic] Step1: using existing lyrics, len=', lyrics.length);
        }

        // ---- Step 2: キャプション生成（歌詞確定後に実行） ----
        const useBuiltinCaption = document.getElementById('simple-builtin-caption').checked;
        const useThinking = getThinking();
        const selectedLangCode = getSelectedLanguage();
        const selectedLangName = getSelectedLanguageName();
        const manualCaption = getManualCaption();
        console.log('[EasyMusic] Step2: language=', selectedLangCode, selectedLangName, 'builtin=', useBuiltinCaption, 'manual=', !!manualCaption);
        let caption = '';
        let rawTags = '';  // デバッグ表示用
        if (manualCaption) {
            // 手動キャプション指定: AI生成を完全バイパス
            caption = manualCaption;
            rawTags = '[手動指定]';
            console.log('[EasyMusic] Step2: manual caption set, skipping AI generation');
        } else if (useBuiltinCaption) {
            const hint = selectedGenre ? (selectedGenre.hint || selectedGenre.name) : '';
            const blendHint = selectedBlendGenre ? (selectedBlendGenre.hint || selectedBlendGenre.name) : '';
            const combinedHint = blendHint ? `${hint} with ${blendHint} influences` : hint;
            rawTags = combinedHint;  // 元のタグを保存

            if (useThinking) {
                // thinking=ON: タグからLLMに1文キャプションを生成させる（タグのコピーを避ける）
                showSimpleProgress(2, t('status_caption_gen'));
                showSimpleStatus(t('status_caption_ai'), 'info');
                try {
                    const capResult = await apiRequest('/api/caption', 'POST', {
                        theme: theme,
                        lyrics: isInst ? '' : effectiveLyrics,
                        tags: combinedHint,
                        language: getSelectedLanguageName(),
                        thinking: true,
                        mood: getMood(),
                        vocal: isInst ? '' : getVocal(),
                    });
                    if (capResult.success && capResult.caption) {
                        caption = capResult.caption;
                        console.log('[EasyMusic] Step2: builtin+thinking → LLM caption len=', caption.length);
                    } else {
                        caption = combinedHint || theme || '';
                        console.warn('[EasyMusic] Step2: builtin+thinking → caption fallback to tags');
                    }
                } catch (capErr) {
                    console.error('[EasyMusic] Step2: builtin+thinking caption error:', capErr);
                    caption = combinedHint || theme || '';
                }
            } else {
                // thinking=OFF: hints+theme をそのまま渡し、format_input が詳細キャプションに書き換える
                const vocalHint = getVocal();
                const moodHint = getMood();
                let captionBase = combinedHint || '';
                if (moodHint) captionBase += (captionBase ? ', ' : '') + moodHint;
                if (vocalHint) captionBase += (captionBase ? ', ' : '') + vocalHint;
                caption = (captionBase && theme) ? captionBase + ' | theme: ' + theme : captionBase || theme || '';
            }

            // 言語がja以外の場合、キャプションにボーカル言語ヒントを追加
            if (selectedLangCode !== 'ja' && !isInst) {
                caption += '. Sung in ' + selectedLangName + '.';
            }
            if (isInst && caption && !caption.toLowerCase().includes('instrumental')) {
                caption = 'instrumental, no vocals, ' + caption;
            }
        } else if (selectedGenre) {
            showSimpleProgress(2, t('status_caption_gen'));
            showSimpleStatus(t('status_caption_ai'), 'info');
            try {
                const capResult = await apiRequest('/api/caption', 'POST', {
                    theme: theme,
                    lyrics: isInst ? '' : effectiveLyrics,
                    tags: selectedGenre.hint || selectedGenre.name,
                    language: getSelectedLanguageName(),
                    thinking: useThinking,
                    mood: getMood(),
                    vocal: isInst ? '' : getVocal(),
                });
                if (capResult.success && capResult.caption) {
                    caption = capResult.caption;
                } else {
                    console.error('[EasyMusic] /api/caption failed:', capResult);
                    caption = selectedGenre.hint || selectedGenre.name;
                }
            } catch (capErr) {
                console.error('[EasyMusic] /api/caption exception:', capErr);
                caption = selectedGenre.hint || selectedGenre.name;
            }
        } else if (theme) {
            showSimpleProgress(2, t('status_caption_gen'));
            try {
                const capResult = await apiRequest('/api/caption', 'POST', {
                    theme: theme,
                    lyrics: isInst ? '' : effectiveLyrics,
                    tags: '',
                    language: getSelectedLanguageName(),
                    thinking: useThinking,
                    mood: getMood(),
                    vocal: isInst ? '' : getVocal(),
                });
                if (capResult.success && capResult.caption) caption = capResult.caption;
                else console.error('[EasyMusic] /api/caption (theme branch) failed:', capResult);
            } catch (capErr2) { console.error('[EasyMusic] /api/caption (theme branch) exception:', capErr2); }
        }

        // インストモード: キャプションを徹底的にインスト向けに補正
        if (isInst && caption) {
            // ボーカル関連語を除去
            caption = caption.replace(/\b(vocal|vocals|singing|singer|voice|choir|choral|rap|rapping|rapper|lyrical vocal|emotional vocal|dramatic vocal|vocal hook|vocal harmony|whisper)\b/gi, '')
                           .replace(/,\s*,/g, ',')       // 空コンマを整理
                           .replace(/,\s*$/g, '')         // 末尾コンマ除去
                           .replace(/^\s*,\s*/g, '')      // 先頭コンマ除去
                           .trim();
            // 先頭に強いインスト指示を付加
            if (!caption.toLowerCase().includes('instrumental')) {
                caption = 'purely instrumental, no vocals, no singing, no voice, ' + caption;
            } else if (!caption.toLowerCase().includes('no vocal')) {
                caption = caption.replace(/instrumental/i, 'purely instrumental, no vocals, no singing, no voice');
            }
        }

        // ---- Step 2.5: キャプション サニタイズ ----
        // ACE-Step 1.5 制約: 英語パラグラフ、< 480文字、バッククォート禁止、改行禁止、ピリオド終端
        caption = sanitizeCaption(caption);
        console.log('[EasyMusic] Step2.5: sanitized caption len=', caption.length, 'preview=', caption.substring(0, 80));

        // ---- Step 2.7: AI強化 (format_input) ----
        // thinking=true : ACE-Stepが内部推論で補完するため、BPM/Key/拍子のみ取得しキャプションは上書きしない
        // thinking=false: 内部推論なしのためformat_inputの詳細キャプションを採用してACE-Stepを誘導する
        let formatInputResult = null;
        if (useThinking) {
            showSimpleProgress(3, t('status_enhance'));
            showSimpleStatus(t('status_enhance_ai'), 'info');
        } else {
            showSimpleProgress(3, t('status_caption_detail'));
            showSimpleStatus(t('status_caption_detail_ai'), 'info');
        }
        try {
            formatInputResult = await apiRequest('/api/format_input', 'POST', {
                prompt: caption,
                lyrics: isInst ? '' : effectiveLyrics,
                // builtin=ON かつ thinking=OFF のみ詳細化が必要
                // それ以外は BPM/Key 取得だけでよい（LLMまたはthinkingが補完する）
                temperature: (useBuiltinCaption && !useThinking) ? 0.75 : 0.4,
            });
            if (formatInputResult.success) {
                if (useBuiltinCaption && !useThinking) {
                    // builtin=ON + thinking=OFF: LLMなし・thinkingなし → format_inputの詳細キャプションを採用
                    if (formatInputResult.caption) {
                        console.log('[EasyMusic] Step2.7: builtin+no-thinking → using detailed caption len=', formatInputResult.caption.length);
                        caption = sanitizeCaption(formatInputResult.caption);
                        if (!isInst && formatInputResult.lyrics && formatInputResult.lyrics.includes('[')) {
                            effectiveLyrics = formatInputResult.lyrics;
                        }
                    }
                } else {
                    // それ以外: BPM/Key のみ取得（キャプションは上書きしない）
                    // - builtin=ON + thinking=ON: シンプルキャプション + ACE-Step思考に任せる
                    // - builtin=OFF + thinking=ON/OFF: 外部LLMが詳細キャプション生成済み
                    console.log('[EasyMusic] Step2.7: BPM/Key only (builtin=', useBuiltinCaption, ', thinking=', useThinking, ')');
                }
            } else {
                console.log('[EasyMusic] Step2.7: format_input returned no result, using original');
            }
        } catch (e) {
            console.warn('[EasyMusic] Step2.7: format_input failed, continuing with original caption:', e.message);
        }

        // ---- Step 3: 音楽生成 ----
        showSimpleProgress(5, t('status_task_create'));
        showSimpleStatus(t('status_generating'), 'info');

        const params = {
            prompt: caption || (selectedGenre ? selectedGenre.name : theme),
            lyrics: effectiveLyrics,
            thinking: useThinking,
            vocal_language: isInst ? '' : getSelectedLanguage(),
            audio_duration: getSelectedDuration(),
            batch_size: getBatchSize(),
            audio_format: 'mp3',
            inference_steps: getSteps(), // ユーザー設定値
            guidance_scale: isInst ? 18.0 : 18.0, // プロンプト忠実度を上げてクリアな音質に
            // CoT（Chain-of-Thought）による品質強化
            use_cot_caption: true,
            use_cot_language: true,
        };

        // format_input で得たBPM・調を反映（AI推奨パラメータ）
        if (formatInputResult && formatInputResult.success) {
            if (formatInputResult.bpm) params.bpm = formatInputResult.bpm;
            if (formatInputResult.key_scale) params.key_scale = formatInputResult.key_scale;
            if (formatInputResult.time_signature) params.time_signature = formatInputResult.time_signature;
        }

        // ---- Seed 固定（歌詞またはキャプションが既存の場合、前回のseedを再利用） ----
        // → 同じ「音楽的骨格」を保ちつつ、歌詞・キャプションの変更だけを反映できる
        const isReusingExisting = !!(manualCaption || lyrics);  // lyrics = 元々入力欄にあった値
        if (isReusingExisting && window._lastSeed != null) {
            params.seed = window._lastSeed;
            console.log('[EasyMusic] Step3: reusing lastSeed=', window._lastSeed, '(manualCaption=', !!manualCaption, ', lyrics=', !!lyrics, ')');
        } else {
            console.log('[EasyMusic] Step3: no seed (fresh generation)');
        }

        // デバッグパネル更新
        const formatInfo = formatInputResult && formatInputResult.success
            ? (manualCaption ? t('mode_bpm_only')
                : useThinking ? t('mode_enhanced')
                : (useBuiltinCaption ? t('mode_detailed') : t('mode_bpm_only')))
              + (params.bpm ? ' / BPM=' + params.bpm : '') + (params.key_scale ? ' / Key=' + params.key_scale : '') + (params.time_signature && params.time_signature !== '4' ? ' / Time=' + params.time_signature : '')
            : t('mode_skipped');
        updateDebugPanel({
            genre: selectedGenre ? selectedGenre.name : t('mode_no_genre'),
            theme: theme || t('mode_no_theme'),
            mode: (manualCaption ? t('mode_manual') : (useBuiltinCaption ? t('mode_builtin') : t('mode_llm'))) + (isInst ? ' / ' + t('mode_inst') : '') + ' / ' + formatInfo,
            tags: rawTags || t('mode_no_tags'),
            caption: params.prompt,
            lang: selectedLangName + ' (' + selectedLangCode + ')' + (isInst ? ' → instrumental' : ''),
            params: 'steps=' + params.inference_steps + ' / guidance=' + params.guidance_scale + ' / duration=' + params.audio_duration + 's / thinking=' + params.thinking + ' / cot_caption=true / cot_lang=true' + (params.bpm ? ' / bpm=' + params.bpm : '') + (params.key_scale ? ' / key=' + params.key_scale : '') + (params.seed != null ? ' / seed=' + params.seed : '')
        });

        const createResult = await apiRequest('/api/generate', 'POST', params);
        const taskId = createResult.task_id;
        if (!taskId) throw new Error(t('status_task_fail'));

        // 履歴に登録（生成開始時点）
        addHistoryEntry({
            task_id: taskId,
            genre: selectedGenre ? selectedGenre.name : '',
            caption: (params.prompt || '').substring(0, 80),
            duration: params.audio_duration,
        });

        // 生成開始時点でseedが確定 → デバッグパネルに即表示
        if (createResult.seed != null) {
            window._lastSeed = createResult.seed;
            const paramsEl = document.getElementById('debug-params');
            if (paramsEl && !paramsEl.textContent.includes('seed=')) {
                paramsEl.textContent = paramsEl.textContent.replace(/\s*$/, '') + ' / seed=' + createResult.seed;
            }
        }

        const expectedTime = estimateGenerationTime(params);
        const maxPolls = 300;
        let polls = 0;

        while (polls < maxPolls) {
            await sleep(1000);
            polls++;

            let statusResult;
            try {
                statusResult = await apiRequest(`/api/status/${taskId}`);
            } catch (_) { continue; }

            if (statusResult.status === 1) {
                showSimpleProgress(100, currentUILang === 'ja' ? '完了！' : 'Done!');
                if (statusResult.results && statusResult.results.length > 0) {
                    currentResults = statusResult.results;
                    currentLyrics = effectiveLyrics;
                    // 最初のトラックのseedを保存（歌詞/キャプション編集時に再利用）
                    if (currentResults[0].seed != null) {
                        window._lastSeed = currentResults[0].seed;
                        console.log('[EasyMusic] lastSeed saved:', window._lastSeed);
                        // デバッグパネルのparamsにseedを後から追記
                        const paramsEl = document.getElementById('debug-params');
                        if (paramsEl) {
                            const cur = paramsEl.textContent || '';
                            if (!cur.includes('seed=')) {
                                paramsEl.textContent = cur.replace(/\s*$/, '') + ' / seed=' + window._lastSeed;
                            }
                        }
                    }
                    // 無音検出: プレーヤー表示前にチェック
                    const firstUrl = convertAudioUrl(currentResults[0].url);
                    const silent = await isSilentAudio(firstUrl);
                    if (silent) {
                        hideOverlay();
                        showSimpleStatus(t('status_silent'), 'error');
                        removeHistoryEntry(taskId);
                        hideSimpleProgress();
                        return;
                    }

                    showInlinePlayer();
                    playSimpleTrack(0);
                    showSimpleStatus(`✅ ${currentResults.length}${t('status_complete')}`, 'success');

                    // 履歴を更新（完了 + audio URLs）
                    const audioUrls = currentResults.map(r => convertAudioUrl(r.url));
                    updateHistoryEntry(taskId, audioUrls);
                }
                hideSimpleProgress();
                return;
            } else if (statusResult.status === 2) {
                // 失敗した履歴エントリを削除
                removeHistoryEntry(taskId);
                // エラーメッセージからJSON文字列を除去して読みやすくする
                let errMsg = statusResult.error || t('status_fail');
                try {
                    const parsed = JSON.parse(errMsg);
                    if (Array.isArray(parsed) || typeof parsed === 'object') {
                        errMsg = t('status_fail_server');
                    }
                } catch (_) { /* not JSON, use as-is */ }
                throw new Error(errMsg);
            }

            const progress = smoothProgress(polls, expectedTime);
            const progressText = getProgressPhaseText(polls, expectedTime);
            showSimpleProgress(progress, progressText);
        }

        // タイムアウトした履歴エントリを削除
        removeHistoryEntry(taskId);
        throw new Error(t('status_timeout'));

    } catch (e) {
        // エラーメッセージをユーザーフレンドリーに整形
        let errMsg = e.message || t('status_unknown');
        // JSON文字列がそのまま含まれていたら除去
        if (errMsg.includes('[{') || errMsg.includes('{"')) {
            errMsg = t('status_fail_retry');
        }
        // 長すぎるメッセージは切り詰め
        if (errMsg.length > 100) {
            errMsg = errMsg.substring(0, 100) + '…';
        }
        showSimpleStatus(t('status_error') + errMsg, 'error');
        hideSimpleProgress();
    } finally {
        btn.disabled = false;
        btn.innerHTML = t('btn_generate');
    }
}

// =============================================================================
// Inline Player
// =============================================================================

function showInlinePlayer() {
    const player = document.getElementById('inline-player');
    player.classList.add('visible');

    // Build track buttons
    const btnContainer = document.getElementById('track-buttons');
    btnContainer.innerHTML = '';
    currentResults.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'track-btn' + (i === 0 ? ' active' : '');
        btn.textContent = i + 1;
        btn.onclick = () => playSimpleTrack(i);
        btnContainer.appendChild(btn);
    });

    // Also build overlay track buttons
    const overlayTracks = document.getElementById('overlay-tracks');
    overlayTracks.innerHTML = '';
    currentResults.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'overlay-track-btn' + (i === 0 ? ' active' : '');
        btn.textContent = i + 1;
        btn.onclick = (e) => { e.stopPropagation(); playSimpleTrack(i); };
        overlayTracks.appendChild(btn);
    });
}

function playSimpleTrack(index) {
    if (!currentResults || index >= currentResults.length) return;
    currentTrackIndex = index;

    const result = currentResults[index];
    const url = convertAudioUrl(result.url);
    const audio = document.getElementById('simple-audio');
    audio.src = url;

    // Update download links
    document.getElementById('simple-dl-btn').href = url;
    document.getElementById('overlay-dl-btn').href = url;

    // ジャンル情報をオーバーレイに反映
    currentOverlayGenre = selectedGenre ? selectedGenre.name : null;
    updateOverlayBackground(currentOverlayGenre);

    // Highlight buttons
    document.querySelectorAll('.track-btn').forEach((b, i) => b.classList.toggle('active', i === index));
    document.querySelectorAll('.overlay-track-btn').forEach((b, i) => b.classList.toggle('active', i === index));

    // Show lyrics in overlay (hide for instrumental)
    const lyricsEl = document.getElementById('overlay-lyrics');
    if (lyricsEl) {
        if (currentLyrics && currentLyrics !== '[inst]') {
            // 構造タグを除去して表示
            lyricsEl.textContent = currentLyrics
                .replace(/\[(verse|chorus|bridge|outro|intro|hook|pre-chorus|interlude|rap|spoken)\d*\]/gi, '')
                .replace(/^\s*\n/gm, '\n')
                .trim();
        } else {
            lyricsEl.textContent = '';
        }
    }

    // Init visualizer if needed
    initSimpleVisualizer();

    // Autoplay
    setTimeout(() => {
        audio.play().catch(() => {});
    }, 100);
}

// =============================================================================
// Audio Time Sync (seek bar & time display)
// =============================================================================

function initAudioSync() {
    const audio = document.getElementById('simple-audio');
    const seekBar = document.getElementById('seek-bar');
    const overlaySeek = document.getElementById('overlay-seek');
    const timeDisp = document.getElementById('time-display');
    const overlayTime = document.getElementById('overlay-time');

    audio.addEventListener('timeupdate', () => {
        if (!audio.duration) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        seekBar.value = pct;
        overlaySeek.value = pct;
        const cur = formatTime(audio.currentTime);
        const dur = formatTime(audio.duration);
        timeDisp.textContent = `${cur} / ${dur}`;
        overlayTime.textContent = `${cur} / ${dur}`;
        // JUKEBOX seek bar sync
        const jbSeek = document.getElementById('jukebox-seek-bar');
        const jbTime = document.getElementById('jukebox-time-display');
        if (jbSeek) jbSeek.value = pct;
        if (jbTime) jbTime.textContent = `${cur} / ${dur}`;
    });

    // Seek from bars
    const seekHandler = (bar) => {
        bar.addEventListener('input', () => {
            if (!audio.duration) return;
            audio.currentTime = (bar.value / 100) * audio.duration;
        });
    };
    seekHandler(seekBar);
    seekHandler(overlaySeek);
    // JUKEBOX seek bar
    const jbSeek = document.getElementById('jukebox-seek-bar');
    if (jbSeek) seekHandler(jbSeek);

    // Auto-advance to next track
    audio.addEventListener('ended', () => {
        if (jukeboxRunning) {
            onJukeboxTrackEnded();
            return;
        }
        if (currentTrackIndex < currentResults.length - 1) {
            setTimeout(() => playSimpleTrack(currentTrackIndex + 1), 1000);
        } else {
            hideOverlay();
        }
    });

    // Show overlay on play
    audio.addEventListener('play', () => {
        if (currentResults.length > 0) showOverlay(currentOverlayGenre);
    });
    audio.addEventListener('pause', () => {
        // Don't hide overlay on pause — user might resume
    });
}

// =============================================================================
// Circle Overlay Visualizer
// =============================================================================

function showOverlay(genreName) {
    const overlay = document.getElementById('circle-overlay');
    overlay.classList.add('visible');
    // 背景画像をジャンルのサムネイルに設定
    updateOverlayBackground(genreName);
    resizeCanvas();
    startCircleAnimation();
}

function hideOverlay() {
    const overlay = document.getElementById('circle-overlay');
    overlay.classList.remove('visible');
    if (circleAnimId) { cancelAnimationFrame(circleAnimId); circleAnimId = null; }
}

/**
 * オーバーレイ背景をジャンルのサムネイル画像に更新
 */
function updateOverlayBackground(genreName) {
    const bgEl = document.getElementById('overlay-bg-image');
    const nameEl = document.getElementById('overlay-genre-name');
    if (!bgEl) return;

    if (genreName) {
        const imgUrl = getGenreImageUrl(genreName);
        if (imgUrl) {
            bgEl.style.backgroundImage = `url('${imgUrl}')`;
            bgEl.style.opacity = '0.3';
        } else {
            bgEl.style.backgroundImage = 'none';
            bgEl.style.opacity = '0';
        }
        if (nameEl) nameEl.textContent = genreName;
    } else {
        bgEl.style.backgroundImage = 'none';
        bgEl.style.opacity = '0';
        if (nameEl) nameEl.textContent = '';
    }
}

/**
 * ジャンル名からサムネイル画像URLを取得
 */
function getGenreImageUrl(genreName) {
    if (!genreName) return null;
    const tile = document.querySelector(`.genre-tile[data-genre="${genreName}"]`);
    if (tile) {
        const img = tile.querySelector('.genre-img');
        if (img) return img.src;
    }
    return null;
}

function resizeCanvas() {
    const canvas = document.getElementById('circle-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initSimpleVisualizer() {
    if (isVisualizerReady) return;
    const audio = document.getElementById('simple-audio');

    audio.addEventListener('play', () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 1024;
            const source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            vizTimeData = new Uint8Array(analyser.frequencyBinCount);
        }
        if (audioContext.state === 'suspended') audioContext.resume();
    }, { once: false });

    isVisualizerReady = true;
}

function startCircleAnimation() {
    if (circleAnimId) return;

    const canvas = document.getElementById('circle-canvas');
    const ctx = canvas.getContext('2d');

    function draw() {
        circleAnimId = requestAnimationFrame(draw);

        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        if (!analyser || !dataArray) return;
        analyser.getByteFrequencyData(dataArray);
        if (vizTimeData) analyser.getByteTimeDomainData(vizTimeData);

        switch (vizMode) {
            case 'wave':      drawWave(ctx, W, H); break;
            case 'ring':      drawRing(ctx, W, H); break;
            case 'particles': drawParticles(ctx, W, H); break;
            case 'pulse':     drawPulse(ctx, W, H); break;
            default:          drawSpectrum(ctx, W, H); break;
        }
    }

    draw();
}

// --- Spectrum (スペクトル) ---
function drawSpectrum(ctx, W, H) {
    const cx = W / 2;
    const cy = H / 2;
    const maxRadius = Math.min(W, H) * 0.38;
    const barCount = 48;
    const barMaxH = maxRadius * 0.7;
    const barW = 5;
    const barGap = 3;
    const spectrumWidth = barCount * (barW + barGap);
    const specX = cx - spectrumWidth / 2;
    const specY = cy;
    const specBins = Math.floor(dataArray.length * 0.75);

    for (let i = 0; i < barCount; i++) {
        const dataIdx = Math.floor(i * specBins / barCount);
        const val = dataArray[dataIdx] / 255;
        const barH = val * barMaxH;
        const x = specX + i * (barW + barGap);
        const hue = 260 + (i / barCount) * 80;
        const saturation = 75 + val * 25;
        const lightness = 55 + val * 20;

        ctx.shadowBlur = 12 + val * 15;
        ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        const barGrad = ctx.createLinearGradient(x, specY - barH / 2, x, specY + barH / 2);
        barGrad.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
        barGrad.addColorStop(1, `hsl(${hue}, ${saturation}%, ${lightness - 20}%)`);
        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.roundRect(x, specY - barH / 2, barW, barH, 2);
        ctx.fill();
    }
    ctx.shadowBlur = 0;
}

// --- Wave (ウェーブ) ---
function drawWave(ctx, W, H) {
    if (!vizTimeData) return;
    const cy = H / 2;
    const amplitude = H * 0.28;
    const sliceWidth = W / vizTimeData.length;

    for (let mirror = 0; mirror < 2; mirror++) {
        ctx.beginPath();
        const sign = mirror === 0 ? 1 : -1;
        const hueOffset = mirror * 40;
        for (let i = 0; i < vizTimeData.length; i++) {
            const v = (vizTimeData[i] / 128.0) - 1.0;
            const y = cy + sign * v * amplitude;
            const x = i * sliceWidth;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        const hue = 260 + hueOffset;
        ctx.strokeStyle = `hsla(${hue}, 80%, 65%, 0.7)`;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsla(${hue}, 80%, 60%, 0.5)`;
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(W, cy);
    ctx.strokeStyle = 'rgba(124, 92, 252, 0.15)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.stroke();
    ctx.shadowBlur = 0;
}

// --- Ring (リング) ---
function drawRing(ctx, W, H) {
    const cx = W / 2;
    const cy = H / 2;
    const baseRadius = Math.min(W, H) * 0.2;
    const barCount = 64;
    const specBins = Math.floor(dataArray.length * 0.75);

    for (let i = 0; i < barCount; i++) {
        const dataIdx = Math.floor(i * specBins / barCount);
        const val = dataArray[dataIdx] / 255;
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
        const barLen = val * baseRadius * 0.9;

        const x1 = cx + Math.cos(angle) * baseRadius;
        const y1 = cy + Math.sin(angle) * baseRadius;
        const x2 = cx + Math.cos(angle) * (baseRadius + barLen);
        const y2 = cy + Math.sin(angle) * (baseRadius + barLen);

        const hue = (i / barCount) * 120 + 240;
        const lightness = 55 + val * 20;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(${hue}, 80%, ${lightness}%, 0.8)`;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 8 + val * 12;
        ctx.shadowColor = `hsla(${hue}, 80%, ${lightness}%, 0.6)`;
        ctx.stroke();
    }

    const avgVal = Array.from(dataArray.slice(0, 32)).reduce((a, b) => a + b, 0) / 32 / 255;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius * (0.95 + avgVal * 0.05), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(167, 139, 250, ${0.2 + avgVal * 0.3})`;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 20;
    ctx.shadowColor = `rgba(124, 92, 252, ${0.3 + avgVal * 0.3})`;
    ctx.stroke();
    ctx.shadowBlur = 0;
}

// --- Particles (パーティクル) ---
function drawParticles(ctx, W, H) {
    const cx = W / 2;
    const cy = H / 2;
    const avgVal = Array.from(dataArray.slice(0, 48)).reduce((a, b) => a + b, 0) / 48 / 255;
    const bassVal = Array.from(dataArray.slice(0, 8)).reduce((a, b) => a + b, 0) / 8 / 255;

    const spawnCount = Math.floor(avgVal * 4);
    for (let i = 0; i < spawnCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3 + bassVal * 3;
        vizParticles.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0,
            decay: 0.008 + Math.random() * 0.015,
            size: 2 + Math.random() * 3 + avgVal * 3,
            hue: 240 + Math.random() * 100
        });
    }

    for (let i = vizParticles.length - 1; i >= 0; i--) {
        const p = vizParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        p.vx *= 0.995;
        p.vy *= 0.995;

        if (p.life <= 0 || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) {
            vizParticles.splice(i, 1);
            continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.life * 0.7})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${p.hue}, 80%, 60%, ${p.life * 0.4})`;
        ctx.fill();
    }

    if (vizParticles.length > 300) vizParticles.splice(0, vizParticles.length - 300);
    ctx.shadowBlur = 0;
}

// --- Pulse (パルス) ---
function drawPulse(ctx, W, H) {
    const cx = W / 2;
    const cy = H / 2;
    const maxR = Math.min(W, H) * 0.35;

    const bands = [0, 0, 0, 0];
    const bandSize = Math.floor(dataArray.length / 4);
    for (let b = 0; b < 4; b++) {
        let sum = 0;
        for (let i = 0; i < bandSize; i++) sum += dataArray[b * bandSize + i];
        bands[b] = sum / bandSize / 255;
    }

    const hues = [280, 300, 320, 340];
    const radii = [0.9, 0.7, 0.5, 0.3];

    for (let b = 0; b < 4; b++) {
        const r = maxR * radii[b] * (0.6 + bands[b] * 0.5);
        const alpha = 0.15 + bands[b] * 0.25;

        const grad = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
        grad.addColorStop(0, `hsla(${hues[b]}, 80%, 60%, ${alpha})`);
        grad.addColorStop(1, `hsla(${hues[b]}, 80%, 40%, 0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hues[b]}, 80%, 65%, ${alpha + 0.1})`;
        ctx.lineWidth = 1.5 + bands[b] * 2;
        ctx.shadowBlur = 15 + bands[b] * 20;
        ctx.shadowColor = `hsla(${hues[b]}, 80%, 60%, 0.4)`;
        ctx.stroke();
    }
    ctx.shadowBlur = 0;
}

// =============================================================================
// Overlay Click Handling
// =============================================================================

function initOverlay() {
    const overlay = document.getElementById('circle-overlay');
    overlay.addEventListener('click', (e) => {
        // Don't close if clicking on controls
        if (e.target.closest('.overlay-controls')) return;
        if (jukeboxRunning) {
            // JUKEBOX中: オーバーレイだけ閉じる（音楽は続行）
            hideOverlay();
            showReturnToOverlayBtn(true);
        } else {
            hideOverlay();
            document.getElementById('simple-audio').pause();
        }
    });

    // Prevent control clicks from closing overlay
    document.getElementById('overlay-controls').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Download button
    document.getElementById('overlay-dl-btn').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Visualizer mode selector
    document.querySelectorAll('.viz-mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const mode = btn.dataset.mode;
            if (mode && mode !== vizMode) {
                vizMode = mode;
                vizModeUserSelected = true;
                document.querySelectorAll('.viz-mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (mode !== 'particles') vizParticles = [];
            }
        });
    });

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        if (overlay.classList.contains('visible')) resizeCanvas();
    });
}

// =============================================================================
// History — 直近10件の生成履歴（sessionStorage でブラウザ側完結）
// =============================================================================

const MAX_LOCAL_HISTORY = 10;

/** sessionStorage から履歴を取得 */
function _getHistoryStore() {
    return JSON.parse(sessionStorage.getItem('easymusic_history') || '[]');
}

/** sessionStorage に履歴を保存 */
function _setHistoryStore(history) {
    sessionStorage.setItem('easymusic_history', JSON.stringify(history));
}

/**
 * 履歴エントリを追加（生成開始時に呼ぶ）
 */
function addHistoryEntry(entry) {
    const history = _getHistoryStore();
    if (history.some(h => h.task_id === entry.task_id)) return;
    entry.created_at = Math.floor(Date.now() / 1000);
    entry.audio_urls = [];
    entry.status = 'generating';
    history.push(entry);
    if (history.length > MAX_LOCAL_HISTORY) history.splice(0, history.length - MAX_LOCAL_HISTORY);
    _setHistoryStore(history);
    renderHistory();
}

/**
 * 履歴エントリを更新（生成完了時に呼ぶ）
 */
function updateHistoryEntry(taskId, audioUrls) {
    const history = _getHistoryStore();
    const entry = history.find(h => h.task_id === taskId);
    if (entry) {
        entry.audio_urls = audioUrls;
        entry.status = 'completed';
        _setHistoryStore(history);
    }
    renderHistory();
}

/**
 * 履歴エントリを削除（生成失敗・タイムアウト時に呼ぶ）
 */
function removeHistoryEntry(taskId) {
    if (!taskId) return;
    const history = _getHistoryStore();
    const filtered = history.filter(h => h.task_id !== taskId);
    _setHistoryStore(filtered);
    renderHistory();
}

/**
 * 古い「生成中」エントリをクリーンアップ
 */
function cleanupStaleHistory() {
    const STALE_THRESHOLD = 120; // 2分
    const now = Math.floor(Date.now() / 1000);
    const history = _getHistoryStore();
    const cleaned = history.filter(h => {
        if (h.status === 'generating' && h.created_at && (now - h.created_at) > STALE_THRESHOLD) {
            return false;
        }
        return true;
    });
    if (cleaned.length !== history.length) {
        _setHistoryStore(cleaned);
    }
}

/**
 * 履歴データ取得（新しい順）
 */
function getHistory() {
    return [..._getHistoryStore()].reverse();
}

/**
 * 経過時間を表示用テキストに変換
 */
function timeAgo(unixSec) {
    const diff = Math.floor(Date.now() / 1000) - unixSec;
    if (diff < 60) return diff + t('history_ago_sec');
    if (diff < 3600) return Math.floor(diff / 60) + t('history_ago_min');
    if (diff < 86400) return Math.floor(diff / 3600) + t('history_ago_hour');
    return Math.floor(diff / 86400) + t('history_ago_day');
}

/**
 * 履歴パネルを描画
 */
function renderHistory() {
    const container = document.getElementById('history-list');
    if (!container) return;

    // 描画前に古い「生成中」エントリを自動除去（2分超）
    cleanupStaleHistory();
    const history = getHistory();

    if (history.length === 0) {
        container.innerHTML = `<div class="history-empty">${t('history_empty')}</div>`;
        return;
    }

    container.innerHTML = history.map((entry, idx) => {
        const genre = entry.genre || '—';
        const caption = entry.caption || '';
        const dur = entry.duration ? `${entry.duration}s` : '';
        const ago = entry.created_at ? timeAgo(entry.created_at) : '';
        const isReady = entry.status === 'completed' && entry.audio_urls && entry.audio_urls.length > 0;
        const statusBadge = isReady
            ? ''
            : `<span class="history-badge generating">${t('history_generating')}</span>`;
        const dismissBtn = !isReady
            ? `<button class="history-dismiss-btn" onclick="dismissHistoryEntry('${escapeHtml(entry.task_id)}')" title="Remove">✕</button>`
            : '';

        const audioUrl = isReady ? entry.audio_urls[0] : '';

        return `<div class="history-item${isReady ? ' ready' : ''}" data-index="${idx}">
            <div class="history-info">
                <span class="history-genre">${escapeHtml(genre)}</span>
                <span class="history-caption">${escapeHtml(caption)}</span>
                <span class="history-meta">${dur} · ${ago}</span>
                ${statusBadge}
            </div>
            <div class="history-actions">
                ${isReady ? `<button class="history-play-btn" onclick="playFromHistory(${idx})" title="Play">${t('history_play')}</button>` : ''}
                ${isReady ? `<a class="history-dl-btn" href="${escapeHtml(audioUrl)}" download title="Download">${t('history_download')}</a>` : ''}
                ${dismissBtn}
            </div>
        </div>`;
    }).join('');
}

/**
 * 「生成中」エントリを手動で消す
 */
function dismissHistoryEntry(taskId) {
    removeHistoryEntry(taskId);
}

/** HTML エスケープ */
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * 履歴から再生
 */
function playFromHistory(idx) {
    const history = getHistory();
    const entry = history[idx];
    if (!entry || !entry.audio_urls || entry.audio_urls.length === 0) return;

    currentResults = entry.audio_urls.map(url => ({ url }));
    currentLyrics = '';
    showInlinePlayer();
    playSimpleTrack(0);

    // オーバーレイにジャンル反映
    if (entry.genre) {
        currentOverlayGenre = entry.genre;
    }
}

/**
 * 履歴初期化（DOMContentLoaded 後に呼ぶ）
 */
function initHistory() {
    cleanupStaleHistory();
    renderHistory();
}

// =============================================================================
// Initialization
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Easy Music initialized');
    applyI18n();
    initGenreGrid();
    initAudioSync();
    initOverlay();
    initHistory();

    // テーマ変更時に歌詞をクリア
    document.getElementById('simple-theme').addEventListener('input', () => {
        document.getElementById('simple-lyrics').value = '';
    });

    // Try to get server model info for step recommendation
    loadModelInfo();
});

/**
 * サーバーからモデル情報を取得し、推奨ステップを記録
 */
async function loadModelInfo() {
    try {
        const result = await apiRequest('/api/models');
        if (result.success) {
            const modelName = (result.default_model || '').toLowerCase();
            const stepsEl = document.getElementById('simple-steps');
            if (modelName.includes('turbo')) {
                window._simpleSteps = 8;
                if (stepsEl) stepsEl.value = '8';
            } else {
                window._simpleSteps = 50;
                if (stepsEl) stepsEl.value = '50';
            }
        }
    } catch (_) {
        // Not critical — will use default
    }
}

// =============================================================================
// JUKEBOX Mode
// =============================================================================

/**
 * JUKEBOXモード ON/OFF 切り替え
 */
function toggleJukeboxMode() {
    if (jukeboxRunning) return;

    jukeboxMode = !jukeboxMode;
    const container = document.querySelector('.simple-container');
    const btn = document.getElementById('jukebox-toggle-btn');
    const genreLabel = document.getElementById('genre-section-label');

    if (jukeboxMode) {
        container.classList.add('jukebox-active');
        btn.classList.add('active');
        btn.textContent = t('jukebox_btn_on');
        if (genreLabel) genreLabel.textContent = t('jukebox_label_multi');
        document.querySelectorAll('.genre-tile').forEach(t => t.classList.remove('selected'));
        selectedGenre = null;
    } else {
        container.classList.remove('jukebox-active');
        btn.classList.remove('active');
        btn.textContent = t('jukebox_btn_off');
        if (genreLabel) genreLabel.textContent = t('label_genre');
        jukeboxCategories = [];
        document.querySelectorAll('.genre-tile').forEach(t => t.classList.remove('jukebox-selected'));
        renderJukeboxBadges();
    }
}

/**
 * JUKEBOX: ジャンルタイルクリック（複数選択トグル）
 */
function handleJukeboxGenreClick(tile) {
    if (jukeboxRunning) return;

    const genre = {
        name: tile.dataset.genre,
        hint: tile.dataset.captionHint,
        forceInst: tile.dataset.forceInst === 'true'
    };

    const idx = jukeboxCategories.findIndex(c => c.name === genre.name);
    if (idx >= 0) {
        jukeboxCategories.splice(idx, 1);
        tile.classList.remove('jukebox-selected');
    } else {
        jukeboxCategories.push(genre);
        tile.classList.add('jukebox-selected');
    }

    renderJukeboxBadges();
}

/**
 * JUKEBOX: 選択カテゴリのバッジ表示を更新
 */
function renderJukeboxBadges() {
    const container = document.getElementById('jukebox-selected-categories');
    if (!container) return;
    container.innerHTML = '';
    jukeboxCategories.forEach((cat, i) => {
        const badge = document.createElement('span');
        badge.className = 'jukebox-category-badge';
        badge.innerHTML = `${cat.name} <span class="badge-remove" onclick="removeJukeboxCategory(${i})">✕</span>`;
        container.appendChild(badge);
    });
}

/**
 * JUKEBOX: カテゴリバッジの✕クリックで削除
 */
function removeJukeboxCategory(index) {
    if (jukeboxRunning) return;
    const removed = jukeboxCategories.splice(index, 1)[0];
    if (removed) {
        document.querySelectorAll('.genre-tile').forEach(t => {
            if (t.dataset.genre === removed.name) t.classList.remove('jukebox-selected');
        });
    }
    renderJukeboxBadges();
}

/**
 * JUKEBOX: スタート/ストップ トグル
 */
function toggleJukebox() {
    if (jukeboxRunning) {
        stopJukebox();
    } else {
        startJukebox();
    }
}

/**
 * JUKEBOX: 開始
 */
async function startJukebox() {
    if (jukeboxCategories.length === 0) {
        showSimpleStatus(t('jukebox_no_genre'), 'error');
        return;
    }

    jukeboxRunning = true;
    jukeboxStopRequested = false;
    jukeboxTrackCount = 0;
    jukeboxNextReady = null;
    jukeboxGenerating = false;
    vizModeUserSelected = false;  // JUKEBOX開始時にランダムにリセット

    const btn = document.getElementById('jukebox-start-btn');
    btn.textContent = t('jukebox_stop');
    btn.classList.add('stop');

    const npEl = document.getElementById('jukebox-now-playing');
    npEl.classList.add('visible');
    updateJukeboxNowPlaying(t('jukebox_preparing'), 0);

    const jbPlayer = document.getElementById('jukebox-inline-player');
    if (jbPlayer) jbPlayer.classList.add('visible');

    document.querySelectorAll('.genre-tile').forEach(t => t.style.pointerEvents = 'none');
    const batchSel = document.getElementById('simple-batch');
    if (batchSel) batchSel.disabled = true;

    try {
        await jukeboxLoop();
    } catch (e) {
        console.error('[JUKEBOX] loop error:', e);
        showSimpleStatus(t('jukebox_error') + (e.message || ''), 'error');
    }

    // クリーンアップ
    jukeboxRunning = false;
    jukeboxGenerating = false;
    btn.disabled = false;
    btn.textContent = t('jukebox_start');
    btn.classList.remove('stop');
    npEl.classList.remove('visible');
    showReturnToOverlayBtn(false);
    document.querySelectorAll('.genre-tile').forEach(t => t.style.pointerEvents = '');
    if (batchSel) batchSel.disabled = false;
    hideSimpleProgress();
}

/**
 * JUKEBOX: 停止リクエスト
 */
function stopJukebox() {
    jukeboxStopRequested = true;
    showSimpleStatus(t('jukebox_stop_after'), 'info');
    const btn = document.getElementById('jukebox-start-btn');
    btn.disabled = true;
    btn.textContent = t('jukebox_stopping');
    // オーバーレイ復帰ボタンを隠す
    showReturnToOverlayBtn(false);
    // audioを強制停止してwaitForAudioEndを解決させる
    const audio = document.getElementById('simple-audio');
    audio.pause();
    audio.currentTime = 0;
    audio.dispatchEvent(new Event('ended'));
    hideOverlay();
}

/**
 * JUKEBOX: メインループ
 */
async function jukeboxLoop() {
    const firstResult = await jukeboxGenerateOne();
    if (!firstResult || jukeboxStopRequested) return;

    jukeboxTrackCount++;
    jukeboxPlayTrack(firstResult);

    while (!jukeboxStopRequested) {
        const prefetchPromise = jukeboxGenerateOne();
        await waitForAudioEnd();
        if (jukeboxStopRequested) break;

        const nextResult = await prefetchPromise;
        if (!nextResult || jukeboxStopRequested) break;

        await sleep(1000);
        if (jukeboxStopRequested) break;

        jukeboxTrackCount++;
        jukeboxPlayTrack(nextResult);
    }
}

/**
 * JUKEBOX: ランダムカテゴリで1曲生成
 */
async function jukeboxGenerateOne() {
    if (jukeboxStopRequested) return null;

    jukeboxGenerating = true;

    const genre = jukeboxCategories[Math.floor(Math.random() * jukeboxCategories.length)];
    const isInst = genre.forceInst || document.getElementById('simple-inst').checked;

    updateJukeboxNowPlaying(`${genre.name} ${t('phase_prep')}`, jukeboxTrackCount);
    showSimpleProgress(0, t('phase_prep'));
    showSimpleStatus(`${t('jukebox_generating')} — ${genre.name}...`, 'info');

    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
        try {
            // Step 0: テーマ自動生成
            let theme = genre.name;
            try {
                const themeResult = await apiRequest('/api/theme', 'POST', {
                    genre: genre.name,
                    language: getSelectedLanguageName()
                });
                if (themeResult.success && themeResult.theme) {
                    theme = themeResult.theme;
                }
            } catch (_) {}

            if (jukeboxStopRequested) return null;

            // Step 1: 歌詞
            let effectiveLyrics = '';
            if (isInst) {
                effectiveLyrics = '[inst]';
            } else {
                showSimpleProgress(5, t('status_lyrics_gen'));
                try {
                    const lyricsResult = await apiRequest('/api/lyrics', 'POST', {
                        theme: theme,
                        genre: genre.name,
                        language: getSelectedLanguageName()
                    });
                    if (lyricsResult.success && lyricsResult.lyrics) {
                        effectiveLyrics = lyricsResult.lyrics;
                    }
                } catch (_) {}
            }

            if (jukeboxStopRequested) return null;

            // Step 2: キャプション
            let caption = genre.hint || genre.name;
            if (theme && theme !== genre.name) {
                caption += ' | theme: ' + theme;
            }
            const selectedLangCode = getSelectedLanguage();
            if (selectedLangCode !== 'ja' && !isInst) {
                caption += '. Sung in ' + getSelectedLanguageName() + '.';
            }
            if (isInst && !caption.toLowerCase().includes('instrumental')) {
                caption = 'instrumental, no vocals, ' + caption;
            }
            caption = sanitizeCaption(caption);

            // Step 2.7: AI強化
            // JUKEBOXもbuiltinキャプションモード：format_inputのBPM/Keyのみ利用、キャプションは上書きしない
            let formatInputResult = null;
            showSimpleProgress(8, t('status_enhance'));
            try {
                formatInputResult = await apiRequest('/api/format_input', 'POST', {
                    prompt: caption,
                    lyrics: isInst ? '' : effectiveLyrics,
                    temperature: 0.4,
                });
                // 歌詞強化は利用、キャプションは上書きしない
                if (formatInputResult.success && !isInst && formatInputResult.lyrics && formatInputResult.lyrics.includes('[')) {
                    effectiveLyrics = formatInputResult.lyrics;
                }
            } catch (_) {}

            if (jukeboxStopRequested) return null;

            // Step 3: 音楽生成
            showSimpleProgress(10, t('status_generating'));
            const params = {
                prompt: caption || genre.name,
                lyrics: effectiveLyrics,
                thinking: getThinking(),
                vocal_language: isInst ? '' : getSelectedLanguage(),
                audio_duration: getSelectedDuration(),
                batch_size: 1,
                audio_format: 'mp3',
                inference_steps: getSteps(), // ユーザー設定値
                guidance_scale: isInst ? 18.0 : 18.0, // プロンプト忠実度上山でクリアな音質に
                use_cot_caption: true,
                use_cot_language: true,
            };
            if (formatInputResult && formatInputResult.success) {
                if (formatInputResult.bpm) params.bpm = formatInputResult.bpm;
                if (formatInputResult.key_scale) params.key_scale = formatInputResult.key_scale;
                if (formatInputResult.time_signature) params.time_signature = formatInputResult.time_signature;
            }

            const createResult = await apiRequest('/api/generate', 'POST', params);
            const taskId = createResult.task_id;
            if (!taskId) throw new Error(t('status_task_fail'));

            // 履歴に登録（JUKEBOX）
            addHistoryEntry({
                task_id: taskId,
                genre: genre.name,
                caption: (caption || '').substring(0, 80),
                duration: params.audio_duration,
            });

            const expectedTime = estimateGenerationTime(params);
            let polls = 0;
            const maxPolls = 300;

            while (polls < maxPolls) {
                if (jukeboxStopRequested) return null;
                await sleep(1000);
                polls++;

                let statusResult;
                try {
                    statusResult = await apiRequest(`/api/status/${taskId}`);
                } catch (_) { continue; }

                if (statusResult.status === 1) {
                    showSimpleProgress(100, '✅');
                    if (statusResult.results && statusResult.results.length > 0) {
                        const url = convertAudioUrl(statusResult.results[0].url);
                        // 無音検出: 無音ならリトライとして扱う
                        if (await isSilentAudio(url)) {
                            console.warn('[JUKEBOX] silent audio detected, retrying');
                            removeHistoryEntry(taskId);
                            throw new Error('Silent audio');
                        }
                        // 履歴を完了に更新（JUKEBOX）
                        const audioUrls = statusResult.results.map(r => convertAudioUrl(r.url));
                        updateHistoryEntry(taskId, audioUrls);
                        jukeboxGenerating = false;
                        return { audioUrl: url, genre: genre.name, lyrics: effectiveLyrics };
                    }
                    throw new Error('Empty result');
                } else if (statusResult.status === 2) {
                    throw new Error(statusResult.error || t('status_fail'));
                }

                const progress = smoothProgress(polls, expectedTime);
                showSimpleProgress(progress, getProgressPhaseText(polls, expectedTime));
            }
            throw new Error(t('status_timeout'));

        } catch (e) {
            retries++;
            console.warn(`[JUKEBOX] generation failed (attempt ${retries}/${maxRetries}):`, e.message);
            if (retries >= maxRetries) {
                jukeboxGenerating = false;
                showSimpleStatus(t('jukebox_retry_exhausted'), 'error');
                jukeboxStopRequested = true;
                return null;
            }
            showSimpleStatus(`${t('jukebox_retrying')} (${retries}/${maxRetries})`, 'info');
            await sleep(2000);
        }
    }

    jukeboxGenerating = false;
    return null;
}

/**
 * JUKEBOX: 曲を再生
 */
function jukeboxPlayTrack(result) {
    const audio = document.getElementById('simple-audio');
    audio.src = result.audioUrl;

    currentResults = [{ url: result.audioUrl }];
    currentTrackIndex = 0;
    currentLyrics = result.lyrics;

    // JUKEBOX: ユーザー未選択ならランダムにアニメーションモードを切替
    if (!vizModeUserSelected) {
        const modes = ['spectrum', 'wave', 'ring', 'particles', 'pulse'];
        vizMode = modes[Math.floor(Math.random() * modes.length)];
        vizParticles = [];
        document.querySelectorAll('.viz-mode-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.mode === vizMode);
        });
    }

    currentOverlayGenre = result.genre;
    updateOverlayBackground(result.genre);

    const lyricsEl = document.getElementById('overlay-lyrics');
    if (lyricsEl) {
        if (result.lyrics && result.lyrics !== '[inst]') {
            lyricsEl.textContent = result.lyrics
                .replace(/\[(verse|chorus|bridge|outro|intro|hook|pre-chorus|interlude|rap|spoken)\d*\]/gi, '')
                .replace(/^\s*\n/gm, '\n')
                .trim();
        } else {
            lyricsEl.textContent = '';
        }
    }

    updateJukeboxNowPlaying(`♪ ${result.genre}`, jukeboxTrackCount);
    hideSimpleProgress();
    showSimpleStatus(`${t('jukebox_playing')} — ${result.genre} #${jukeboxTrackCount}`, 'success');

    initSimpleVisualizer();

    setTimeout(() => {
        audio.play().catch(() => {});
    }, 100);
}

/**
 * JUKEBOX: Now Playing 表示更新
 */
function updateJukeboxNowPlaying(text, count) {
    const textEl = document.getElementById('jukebox-now-playing-text');
    const countEl = document.getElementById('jukebox-now-playing-count');
    if (textEl) textEl.textContent = text;
    if (countEl) countEl.textContent = count > 0 ? `#${count}` : '';
}

/**
 * JUKEBOX: audioの再生終了を待つPromise
 */
function waitForAudioEnd() {
    return new Promise(resolve => {
        const audio = document.getElementById('simple-audio');

        if (jukeboxStopRequested) { resolve(); return; }
        if (audio.paused && audio.currentTime === 0 && !audio.src) {
            resolve(); return;
        }

        const handler = () => {
            audio.removeEventListener('ended', handler);
            resolve();
        };
        audio.addEventListener('ended', handler);

        setTimeout(() => {
            audio.removeEventListener('ended', handler);
            resolve();
        }, 600000);
    });
}

/**
 * JUKEBOX: audio ended イベント
 */
function onJukeboxTrackEnded() {
    console.log('[JUKEBOX] track ended, waiting for next...');
}

/**
 * オーバーレイ復帰ボタンの表示/非表示
 */
function showReturnToOverlayBtn(show) {
    let btn = document.getElementById('return-to-overlay-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'return-to-overlay-btn';
        btn.className = 'return-to-overlay-btn';
        btn.textContent = t('jukebox_return_overlay');
        btn.addEventListener('click', () => {
            showReturnToOverlayBtn(false);
            if (currentOverlayGenre || jukeboxRunning) {
                showOverlay(currentOverlayGenre);
            }
        });
        document.body.appendChild(btn);
    }
    btn.textContent = t('jukebox_return_overlay');
    btn.style.display = show ? 'block' : 'none';
}
