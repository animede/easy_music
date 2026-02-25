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
        mode_skipped: '⚠️ AI強化スキップ',
        mode_no_genre: '(未選択)',
        mode_no_theme: '(なし)',
        mode_no_tags: '(タグなし — 外部LLMがキャプション全文を生成)',
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
        mode_skipped: '⚠️ AI Enhancement Skipped',
        mode_no_genre: '(none)',
        mode_no_theme: '(none)',
        mode_no_tags: '(no tags — external LLM generated full caption)',
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
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
    if (info.genre !== undefined) set('debug-genre', info.genre);
    if (info.theme !== undefined) set('debug-theme', info.theme);
    if (info.mode !== undefined) set('debug-mode', info.mode);
    if (info.tags !== undefined) set('debug-tags', info.tags);
    if (info.caption !== undefined) set('debug-caption', info.caption);
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

function initGenreGrid() {
    document.querySelectorAll('.genre-tile').forEach(tile => {
        tile.addEventListener('click', () => {
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
                    language: getSelectedLanguageName()
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
        const selectedLangCode = getSelectedLanguage();
        const selectedLangName = getSelectedLanguageName();
        console.log('[EasyMusic] Step2: language=', selectedLangCode, selectedLangName, 'builtin=', useBuiltinCaption);
        let caption = '';
        let rawTags = '';  // デバッグ表示用
        if (useBuiltinCaption) {
            // ACE-Step内蔵LLMに任せる→ヒント＋テーマを結合して渡し、thinking=trueで内部生成
            const hint = selectedGenre ? (selectedGenre.hint || selectedGenre.name) : '';
            rawTags = hint;  // 元のタグを保存
            if (hint && theme) {
                caption = hint + ' | theme: ' + theme;
            } else {
                caption = hint || theme || '';
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
                    language: getSelectedLanguageName()
                });
                if (capResult.success && capResult.caption) {
                    caption = capResult.caption;
                } else {
                    caption = selectedGenre.hint || selectedGenre.name;
                }
            } catch (_) {
                caption = selectedGenre.hint || selectedGenre.name;
            }
        } else if (theme) {
            showSimpleProgress(2, t('status_caption_gen'));
            try {
                const capResult = await apiRequest('/api/caption', 'POST', {
                    theme: theme,
                    lyrics: isInst ? '' : effectiveLyrics,
                    tags: '',
                    language: getSelectedLanguageName()
                });
                if (capResult.success && capResult.caption) caption = capResult.caption;
            } catch (_) {}
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
        // ACE-Step内蔵LLMでキャプション・歌詞をさらに強化
        let formatInputResult = null;
        showSimpleProgress(3, t('status_enhance'));
        showSimpleStatus(t('status_enhance_ai'), 'info');
        try {
            formatInputResult = await apiRequest('/api/format_input', 'POST', {
                prompt: caption,
                lyrics: isInst ? '' : effectiveLyrics,
                temperature: 0.85,
            });
            if (formatInputResult.success && formatInputResult.caption) {
                console.log('[EasyMusic] Step2.7: format_input enhanced caption len=', formatInputResult.caption.length);
                caption = sanitizeCaption(formatInputResult.caption);
                // 歌詞も強化版があれば採用（歌詞あり & 強化版が構造タグ付きの場合）
                if (!isInst && formatInputResult.lyrics && formatInputResult.lyrics.includes('[')) {
                    effectiveLyrics = formatInputResult.lyrics;
                    console.log('[EasyMusic] Step2.7: lyrics also enhanced, len=', effectiveLyrics.length);
                }
            } else {
                console.log('[EasyMusic] Step2.7: format_input returned no enhancement, using original');
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
            thinking: true,
            vocal_language: isInst ? '' : getSelectedLanguage(),
            audio_duration: getSelectedDuration(),
            batch_size: 1,
            audio_format: 'mp3',
            inference_steps: window._simpleSteps || 50, // model-aware
            guidance_scale: isInst ? 18.0 : 15.0, // インスト時はプロンプト忠実度を上げる
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

        // デバッグパネル更新
        const formatInfo = formatInputResult && formatInputResult.success
            ? t('mode_enhanced') + (params.bpm ? ' / BPM=' + params.bpm : '') + (params.key_scale ? ' / Key=' + params.key_scale : '') + (params.time_signature && params.time_signature !== '4' ? ' / Time=' + params.time_signature : '')
            : t('mode_skipped');
        updateDebugPanel({
            genre: selectedGenre ? selectedGenre.name : t('mode_no_genre'),
            theme: theme || t('mode_no_theme'),
            mode: (useBuiltinCaption ? t('mode_builtin') : t('mode_llm')) + (isInst ? ' / ' + t('mode_inst') : '') + ' / ' + formatInfo,
            tags: rawTags || t('mode_no_tags'),
            caption: params.prompt,
            lang: selectedLangName + ' (' + selectedLangCode + ')' + (isInst ? ' → instrumental' : ''),
            params: 'steps=' + params.inference_steps + ' / guidance=' + params.guidance_scale + ' / duration=' + params.audio_duration + 's / thinking=' + params.thinking + ' / cot_caption=true / cot_lang=true' + (params.bpm ? ' / bpm=' + params.bpm : '') + (params.key_scale ? ' / key=' + params.key_scale : '')
        });

        const createResult = await apiRequest('/api/generate', 'POST', params);
        const taskId = createResult.task_id;
        if (!taskId) throw new Error(t('status_task_fail'));

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
                    showInlinePlayer();
                    playSimpleTrack(0);
                    showSimpleStatus(`✅ ${currentResults.length}${t('status_complete')}`, 'success');
                }
                hideSimpleProgress();
                return;
            } else if (statusResult.status === 2) {
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

    // Auto-advance to next track
    audio.addEventListener('ended', () => {
        if (currentTrackIndex < currentResults.length - 1) {
            playSimpleTrack(currentTrackIndex + 1);
        } else {
            // Last track ended — close overlay
            hideOverlay();
        }
    });

    // Show overlay on play
    audio.addEventListener('play', () => {
        if (currentResults.length > 0) showOverlay();
    });
    audio.addEventListener('pause', () => {
        // Don't hide overlay on pause — user might resume
    });
}

// =============================================================================
// Circle Overlay Visualizer
// =============================================================================

function showOverlay() {
    const overlay = document.getElementById('circle-overlay');
    overlay.classList.add('visible');
    resizeCanvas();
    startCircleAnimation();
}

function hideOverlay() {
    const overlay = document.getElementById('circle-overlay');
    overlay.classList.remove('visible');
    if (circleAnimId) { cancelAnimationFrame(circleAnimId); circleAnimId = null; }
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
            analyser.fftSize = 512;
            const source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            dataArray = new Uint8Array(analyser.frequencyBinCount);
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

        const cx = W / 2;
        const cy = H / 2;
        const maxRadius = Math.min(W, H) * 0.38;

        // ---- Center Spectrum Bars ----
        const barCount = 48;
        const barMaxH = maxRadius * 0.7;
        const barW = 5;
        const barGap = 3;
        const spectrumWidth = barCount * (barW + barGap);
        const specX = cx - spectrumWidth / 2;
        const specY = cy;

        // Use first 75% of frequency data for spectrum (skip ultra-high)
        const specBins = Math.floor(dataArray.length * 0.75);

        for (let i = 0; i < barCount; i++) {
            const dataIdx = Math.floor(i * specBins / barCount);
            const val = dataArray[dataIdx] / 255;
            const barH = val * barMaxH;

            const x = specX + i * (barW + barGap);
            const hue = 260 + (i / barCount) * 80; // purple → pink range
            const saturation = 75 + val * 25;
            const lightness = 55 + val * 20;

            // Glow effect
            ctx.shadowBlur = 12 + val * 15;
            ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

            const barGrad = ctx.createLinearGradient(x, specY - barH / 2, x, specY + barH / 2);
            barGrad.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
            barGrad.addColorStop(1, `hsl(${hue}, ${saturation}%, ${lightness - 20}%)`);
            ctx.fillStyle = barGrad;

            // Draw bar centered vertically with rounded tops
            ctx.beginPath();
            ctx.roundRect(x, specY - barH / 2, barW, barH, 2);
            ctx.fill();
        }

        ctx.shadowBlur = 0;
    }

    draw();
}

// =============================================================================
// Overlay Click Handling
// =============================================================================

function initOverlay() {
    const overlay = document.getElementById('circle-overlay');
    overlay.addEventListener('click', (e) => {
        // Don't close if clicking on controls
        if (e.target.closest('.overlay-controls')) return;
        hideOverlay();
        // Pause audio
        document.getElementById('simple-audio').pause();
    });

    // Prevent control clicks from closing overlay
    document.getElementById('overlay-controls').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Download button
    document.getElementById('overlay-dl-btn').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        if (overlay.classList.contains('visible')) resizeCanvas();
    });
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
            // Store for generate params
            if (modelName.includes('turbo')) {
                window._simpleSteps = 8;
            } else {
                window._simpleSteps = 50;
            }
        }
    } catch (_) {
        // Not critical — will use default
    }
}
