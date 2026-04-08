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
        dur_auto: '自動（AI推定）',
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
        label_ace_model: 'モデル',
        ace_model_turbo: 'TURBO (高速)',
        ace_model_sft: 'SFT (高品質)',
        ace_model_base: 'Base (標準)',
        ace_model_loading: '読み込み中...',
        ace_model_fallback: 'TURBO (デフォルト)',
        label_steps: 'STEP',
        label_thinking: 'Thinking',
        steps_8: '8 (Turbo)', steps_20: '20 (高速)', steps_50: '50 (標準)', steps_80: '80 (高品質)', steps_100: '100 (最高品質)',
        label_shift: 'Shift',
        tooltip_shift: 'タイムステップシフト。低い値=音質・ディテール重視、高い値=楽曲構造・プロンプト忠実度重視',
        shift_auto: '自動', shift_1: '1.0 (ディテール重視)', shift_2: '2.0 (バランス)',
        shift_3: '3.0 (Turbo推奨)', shift_4: '4.0 (構造重視)', shift_5: '5.0 (最大)',
        label_infer_method: 'Sampler',
        tooltip_infer_method: 'サンプリング方式。ODE=安定・再現性◎、SDE=多様・有機的な質感（高ステップ推奨）',
        infer_auto: '自動 (ODE)', infer_ode: 'ODE (安定・クリーン)', infer_sde: 'SDE (有機的・多様)',
        label_lyrics_settings: '作詞設定',
        label_advanced_settings: '詳細設定',
        label_options: '詳細オプション',
        label_mood: 'ムード：',
        label_negative_prompt: 'ネガティブプロンプト',
        placeholder_negative_prompt: '例: low quality, noisy, distorted（空欄ならデフォルト適用）',
        tooltip_negative_prompt: '生成時に避けたい要素を指定します。空欄の場合は品質低下防止のデフォルト値が自動適用されます。',
        mood_happy: '😊 明るい', mood_sad: '😢 切ない', mood_intense: '🔥 激しい',
        mood_calm: '🍃 穏やか', mood_mystic: '✨ 神秘的',
        mood_romantic: '💕 ロマンチック', mood_fun: '🎉 楽しい', mood_dark: '🌙 メランコリック',
        mood_epic: '🏔️ 壮大', mood_cool: '😎 クール',
        label_vocal: 'ボーカル：',
        vocal_female: '👩 女声', vocal_male: '👨 男声', vocal_powerful: '🎤 力強い',
        vocal_whisper: '🌬️ ウィスパー', vocal_falsetto: '🎵 ファルセット', vocal_harmony: '👥 ハーモニー',
        label_blend: '➕ ミックス：',
        blend_none: '（なし）',
        // Omakase
        label_omakase: '🪄 おまかせ生成',
        placeholder_omakase: '例: 夏の海辺で聴きたい爽やかなポップ',
        btn_random: 'ランダム',
        status_omakase: '🪄 おまかせ生成中…AIが全パラメータを自動決定',
        status_random_loading: '🎲 ランダムサンプルを取得中...',
        status_random_filled: '🎲 ランダムパラメータをセットしました',
        status_random_fail: '⚠️ ランダムサンプルの取得に失敗しました',
        // Cover / Repaint
        btn_cover_mode: 'カバー',
        btn_repaint_mode: 'リペイント',
        label_cover_title: '🎤 カバーモード — 音声ファイルのスタイルを変換',
        label_repaint_title: '🎨 リペイントモード — 音楽の一部を再生成',
        label_upload_audio: '🎵 音声ファイルをドラッグ＆ドロップ、またはクリックして選択',
        label_cover_strength: 'カバー強度',
        hint_cover_strength: '低い値=原曲に忠実 / 高い値=大きく変換',
        placeholder_cover_caption: '変換後のスタイル（例: jazz, acoustic, lo-fi）',
        label_cover_lyrics: '歌詞（任意）',
        placeholder_cover_lyrics: '新しい歌詞を入力（空欄なら原曲の構造を維持）',
        label_repaint_range: '再生成区間（秒）',
        hint_repaint_range: '指定区間のみ再生成し、それ以外はそのまま',
        label_seconds: '秒',
        placeholder_repaint_caption: '再生成部分のスタイル指定（任意）',
        label_repaint_lyrics: '歌詞（任意）',
        placeholder_repaint_lyrics: '再生成部分の歌詞（空欄ならAIが判断）',
        status_cover_generating: '🎤 カバー生成中…',
        status_repaint_generating: '🎨 リペイント生成中…',
        status_no_audio_file: '⚠️ 音声ファイルを選択してください',
        status_repaint_range_error: '⚠️ リペイント区間を正しく指定してください（終了 > 開始）',
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
        dur_auto: 'Auto (AI estimate)',
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
        label_ace_model: 'Model',
        ace_model_turbo: 'TURBO (Fast)',
        ace_model_sft: 'SFT (High Quality)',
        ace_model_base: 'Base (Standard)',
        ace_model_loading: 'Loading...',
        ace_model_fallback: 'TURBO (Default)',
        label_steps: 'STEP',
        label_thinking: 'Thinking',
        steps_8: '8 (Turbo)', steps_20: '20 (Fast)', steps_50: '50 (Standard)', steps_80: '80 (High Quality)', steps_100: '100 (Best Quality)',
        label_shift: 'Shift',
        tooltip_shift: 'Timestep shift. Lower values = detail/texture focus, higher values = structure/prompt fidelity focus',
        shift_auto: 'Auto', shift_1: '1.0 (Detail)', shift_2: '2.0 (Balanced)',
        shift_3: '3.0 (Turbo default)', shift_4: '4.0 (Structure)', shift_5: '5.0 (Max)',
        label_infer_method: 'Sampler',
        tooltip_infer_method: 'Sampling method. ODE = stable & reproducible, SDE = organic & diverse (needs higher steps)',
        infer_auto: 'Auto (ODE)', infer_ode: 'ODE (Stable)', infer_sde: 'SDE (Organic)',
        label_options: 'Options',
        label_advanced_settings: 'Advanced Settings',
        label_lyrics_settings: 'Lyrics Settings',
        label_mood: 'Mood:',
        label_negative_prompt: 'Negative Prompt',
        placeholder_negative_prompt: 'e.g. low quality, noisy, distorted (default applied if empty)',
        tooltip_negative_prompt: 'Specify elements to avoid during generation. If left empty, a default quality-preserving prompt is applied automatically.',
        mood_happy: '😊 Bright', mood_sad: '😢 Sad', mood_intense: '🔥 Intense',
        mood_calm: '🍃 Calm', mood_mystic: '✨ Mystic',
        mood_romantic: '💕 Romantic', mood_fun: '🎉 Fun', mood_dark: '🌙 Melancholic',
        mood_epic: '🏔️ Epic', mood_cool: '😎 Cool',
        label_vocal: 'Vocal:',
        vocal_female: '👩 Female', vocal_male: '👨 Male', vocal_powerful: '🎤 Powerful',
        vocal_whisper: '🌬️ Whisper', vocal_falsetto: '🎵 Falsetto', vocal_harmony: '👥 Harmony',
        label_blend: '➕ Mix with:',
        blend_none: '(none)',
        // Omakase
        label_omakase: '🪄 Quick Generate',
        placeholder_omakase: 'e.g. A refreshing pop song for a beach day',
        btn_random: 'Random',
        status_omakase: '🪄 Quick generating…AI decides all parameters',
        status_random_loading: '🎲 Loading random sample...',
        status_random_filled: '🎲 Random parameters set',
        status_random_fail: '⚠️ Failed to load random sample',
        // Cover / Repaint
        btn_cover_mode: 'Cover',
        btn_repaint_mode: 'Repaint',
        label_cover_title: '🎤 Cover Mode — Transform audio style',
        label_repaint_title: '🎨 Repaint Mode — Regenerate part of audio',
        label_upload_audio: '🎵 Drag & drop an audio file, or click to select',
        label_cover_strength: 'Cover Strength',
        hint_cover_strength: 'Lower = faithful to original / Higher = greater transformation',
        placeholder_cover_caption: 'Target style (e.g. jazz, acoustic, lo-fi)',
        label_cover_lyrics: 'Lyrics (optional)',
        placeholder_cover_lyrics: 'New lyrics (leave blank to preserve original structure)',
        label_repaint_range: 'Regeneration Range (sec)',
        hint_repaint_range: 'Only the specified range is regenerated; the rest stays intact',
        label_seconds: 'sec',
        placeholder_repaint_caption: 'Style for regenerated section (optional)',
        label_repaint_lyrics: 'Lyrics (optional)',
        placeholder_repaint_lyrics: 'Lyrics for regenerated section (AI decides if blank)',
        status_cover_generating: '🎤 Generating cover…',
        status_repaint_generating: '🎨 Generating repaint…',
        status_no_audio_file: '⚠️ Please select an audio file',
        status_repaint_range_error: '⚠️ Please set a valid repaint range (end > start)',
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
    // 動的モデル選択肢のラベルを更新
    refreshModelLabels();
}

/** モデルセレクトの表示ラベルを現在の言語で更新 */
function refreshModelLabels() {
    const sel = document.getElementById('simple-ace-model');
    if (!sel) return;
    Array.from(sel.options).forEach(opt => {
        if (!opt.value) return; // loading placeholder
        let label = getModelDisplayLabel(opt.value);
        // 未ロードマーカーを保持
        if (opt.textContent.endsWith(' ⏳')) label += ' ⏳';
        opt.textContent = label;
    });
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
    const duration = params.audio_duration > 0 ? params.audio_duration : 120; // 自動推定時は120秒想定
    const batch = params.batch_size || 1;
    const thinking = params.thinking !== false;
    const isSft = needsCfgModel(params.model);
    const lmTime = thinking ? 4 : 1.5;
    // SFT/Base モデルは turbo より遅い（CFGあり・ステップ50）
    const ditTime = steps * duration * (isSft ? 0.009 : 0.006);
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
    return parseInt(document.getElementById('simple-steps')?.value || '8') || 8;
}

function getAceModel() {
    const val = document.getElementById('simple-ace-model')?.value;
    // select の value はフルモデル名（例: acestep-v15-xl-turbo）
    return val || null;
}

// =============================================================================
// Dynamic Model Loading — サーバーから利用可能モデルを取得して選択肢を構築
// =============================================================================

/** モデル名 → 表示ラベルのマッピング */
function getModelDisplayLabel(modelName) {
    const n = modelName.toLowerCase();
    if (n.includes('xl-turbo')) return 'XL ' + t('ace_model_turbo');
    if (n.includes('xl-sft'))   return 'XL ' + t('ace_model_sft');
    if (n.includes('xl-base'))  return 'XL ' + t('ace_model_base');
    if (n.includes('turbo'))    return t('ace_model_turbo');
    if (n.includes('sft'))      return t('ace_model_sft');
    if (n.includes('base'))     return t('ace_model_base');
    return modelName;
}

/** モデルがCFGガイダンスが必要か（SFT/Base系: turbo以外） */
function needsCfgModel(modelName) {
    if (!modelName) return false;
    const n = modelName.toLowerCase();
    return n.includes('sft') || n.includes('base');
}

/** モデルがSFT系かどうか（バッチ制限用） */
function isSftModel(modelName) {
    return modelName && modelName.toLowerCase().includes('sft');
}

/** モデルがTurbo系かどうか */
function isTurboModel(modelName) {
    return modelName && modelName.toLowerCase().includes('turbo');
}

/**
 * サーバーから利用可能モデルを取得し、<select> を動的に構築する。
 * 起動時に1回呼ばれる。失敗時はフォールバックの静的選択肢を表示。
 */
async function loadAvailableModels() {
    const sel = document.getElementById('simple-ace-model');
    if (!sel) return;

    try {
        const result = await apiRequest('/api/models');
        if (!result.success || !result.models || result.models.length === 0) {
            throw new Error('No models returned');
        }

        const defaultModel = result.default_model || '';
        sel.innerHTML = '';

        // ロード済みモデルを優先表示、その後未ロードモデル
        const sorted = [...result.models].sort((a, b) => {
            // is_loaded を優先（未定義はロード済み扱い）
            const aLoaded = a.is_loaded !== false;
            const bLoaded = b.is_loaded !== false;
            if (aLoaded && !bLoaded) return -1;
            if (!aLoaded && bLoaded) return 1;
            // turbo を先に
            if (isTurboModel(a.name) && !isTurboModel(b.name)) return -1;
            if (!isTurboModel(a.name) && isTurboModel(b.name)) return 1;
            return a.name.localeCompare(b.name);
        });

        sorted.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.name;
            let label = getModelDisplayLabel(m.name);
            // is_loaded が明示的に false の場合のみ⳻マーク
            if (m.is_loaded === false) label += ' ⏳';
            opt.textContent = label;
            // デフォルトモデルまたはロード済みturboを選択
            if (m.name === defaultModel || (m.is_default && sorted.indexOf(m) === 0)) {
                opt.selected = true;
            }
            sel.appendChild(opt);
        });

        // デフォルト選択がなければ先頭を選択
        if (!sel.value && sel.options.length > 0) {
            sel.options[0].selected = true;
        }

        console.log('[EasyMusic] Models loaded:', sorted.map(m => m.name + (m.is_loaded !== false ? ' ✓' : '')).join(', '));

        // 初期状態のSFTバッチ制限を適用
        applyModelBatchRestriction();

    } catch (e) {
        console.warn('[EasyMusic] Failed to load models, using fallback:', e.message);
        sel.innerHTML = '';
        // フォールバック: XLモデルのデフォルト選択肢
        const fallbacks = [
            { value: 'acestep-v15-xl-turbo', label: t('ace_model_turbo') },
            { value: 'acestep-v15-xl-sft',   label: t('ace_model_sft') },
        ];
        fallbacks.forEach((fb, i) => {
            const opt = document.createElement('option');
            opt.value = fb.value;
            opt.textContent = fb.label;
            if (i === 0) opt.selected = true;
            sel.appendChild(opt);
        });
    }
}

/** SFT選択時のバッチ制限を適用/解除 */
function applyModelBatchRestriction() {
    const sel = document.getElementById('simple-ace-model');
    const batchEl = document.getElementById('simple-batch');
    if (!sel || !batchEl) return;

    if (isSftModel(sel.value)) {
        Array.from(batchEl.options).forEach(opt => {
            if (parseInt(opt.value) > 2) opt.disabled = true;
        });
        if (parseInt(batchEl.value) > 2) batchEl.value = '2';
    } else {
        Array.from(batchEl.options).forEach(opt => { opt.disabled = false; });
    }
}

function getThinking() {
    return document.getElementById('simple-thinking')?.checked !== false;
}

/** ネガティブプロンプトを取得（空ならデフォルト値を返す） */
function getNegativePrompt() {
    const el = document.getElementById('negative-prompt');
    const val = (el?.value || '').trim();
    return val || null; // 空の場合 null → デフォルト値はHTML側のplaceholderに表示
}

/** ネガティブプロンプトのデフォルト値 */
const DEFAULT_NEGATIVE_PROMPT = 'low quality, noisy, distorted, muddy, clipping, off-key, out of tune, amateur, poorly mixed';

/** Shift値を取得（auto=モデルに応じたデフォルト、それ以外=指定値） */
function getShift() {
    const val = document.getElementById('simple-shift')?.value || 'auto';
    if (val === 'auto') return null; // null → サーバーデフォルト
    return parseFloat(val);
}

/** 推論方式を取得（auto=サーバーデフォルト(ODE)、それ以外=ODE/SDE） */
function getInferMethod() {
    const val = document.getElementById('simple-infer-method')?.value || 'auto';
    if (val === 'auto') return null;
    return val;
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
    const val = document.getElementById('simple-duration').value;
    if (val === 'auto') return -1; // LMが歌詞長から最適な長さを自動推定
    return parseInt(val) || 120;
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
    // モデル切替時にSTEPを自動切替 + SFT時バッチ制限
    const aceModelSelect = document.getElementById('simple-ace-model');
    if (aceModelSelect) {
        aceModelSelect.addEventListener('change', () => {
            const stepsEl = document.getElementById('simple-steps');
            if (stepsEl) {
                if (isTurboModel(aceModelSelect.value)) {
                    stepsEl.value = '8';
                } else {
                    stepsEl.value = '50';
                }
            }
            // SFT選択時: バッチサイズを最大2に制限（VRAM安全対策）
            applyModelBatchRestriction();
        });
    }

    // 起動時にサーバーから利用可能モデルを取得
    loadAvailableModels();
});

// =============================================================================
// Cover / Repaint Mode
// =============================================================================

let coverMode = false;
let repaintMode = false;
let coverFile = null;
let repaintFile = null;

/**
 * カバーモード切替
 */
function toggleCoverMode() {
    if (jukeboxRunning) return;
    const container = document.querySelector('.simple-container');
    const btn = document.getElementById('cover-toggle-btn');

    if (coverMode) {
        // カバーモードOFF
        coverMode = false;
        container.classList.remove('cover-active');
        btn.classList.remove('active');
    } else {
        // 他モードをOFF → カバーモードON
        if (repaintMode) toggleRepaintMode();
        if (jukeboxMode) toggleJukeboxMode();
        coverMode = true;
        container.classList.add('cover-active');
        btn.classList.add('active');
    }
}

/**
 * リペイントモード切替
 */
function toggleRepaintMode() {
    if (jukeboxRunning) return;
    const container = document.querySelector('.simple-container');
    const btn = document.getElementById('repaint-toggle-btn');

    if (repaintMode) {
        repaintMode = false;
        container.classList.remove('repaint-active');
        btn.classList.remove('active');
    } else {
        if (coverMode) toggleCoverMode();
        if (jukeboxMode) toggleJukeboxMode();
        repaintMode = true;
        container.classList.add('repaint-active');
        btn.classList.add('active');
    }
}

// ---- File Upload Handling ----

function setupUploadArea(areaId, inputId, placeholderId, fileInfoId, fileNameId, fileSetter) {
    const area = document.getElementById(areaId);
    const input = document.getElementById(inputId);
    const placeholder = document.getElementById(placeholderId);
    const fileInfo = document.getElementById(fileInfoId);
    const fileName = document.getElementById(fileNameId);
    if (!area || !input) return;

    area.addEventListener('click', () => input.click());
    area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('drag-over'); });
    area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            fileSetter(e.dataTransfer.files[0]);
            showFileInfo(placeholder, fileInfo, fileName, e.dataTransfer.files[0].name);
        }
    });
    input.addEventListener('change', () => {
        if (input.files.length > 0) {
            fileSetter(input.files[0]);
            showFileInfo(placeholder, fileInfo, fileName, input.files[0].name);
        }
    });
}

function showFileInfo(placeholder, fileInfo, fileName, name) {
    placeholder.style.display = 'none';
    fileInfo.style.display = 'flex';
    fileName.textContent = '📎 ' + name;
}

function clearCoverFile() {
    coverFile = null;
    document.getElementById('cover-file-input').value = '';
    document.getElementById('cover-upload-placeholder').style.display = '';
    document.getElementById('cover-file-info').style.display = 'none';
}

function clearRepaintFile() {
    repaintFile = null;
    document.getElementById('repaint-file-input').value = '';
    document.getElementById('repaint-upload-placeholder').style.display = '';
    document.getElementById('repaint-file-info').style.display = 'none';
}

// Cover strength slider value display
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('cover-strength');
    const display = document.getElementById('cover-strength-value');
    if (slider && display) {
        slider.addEventListener('input', () => {
            display.textContent = (slider.value / 100).toFixed(2);
        });
    }
    // Setup upload areas
    setupUploadArea('cover-upload-area', 'cover-file-input', 'cover-upload-placeholder', 'cover-file-info', 'cover-file-name', (f) => { coverFile = f; });
    setupUploadArea('repaint-upload-area', 'repaint-file-input', 'repaint-upload-placeholder', 'repaint-file-info', 'repaint-file-name', (f) => { repaintFile = f; });
});

/**
 * カバー生成
 */
async function generateCover() {
    if (!coverFile) {
        showSimpleStatus(t('status_no_audio_file'), 'error');
        return;
    }
    const btn = document.getElementById('simple-generate-btn');
    btn.disabled = true;
    btn.innerHTML = t('btn_generating');
    hideSimpleStatus();
    showSimpleStatus(t('status_cover_generating'), 'info');

    try {
        const formData = new FormData();
        formData.append('src_audio', coverFile);
        formData.append('prompt', sanitizeCaption(document.getElementById('cover-caption').value.trim()));
        formData.append('lyrics', document.getElementById('cover-lyrics').value.trim());
        formData.append('thinking', 'true');
        formData.append('vocal_language', getSelectedLanguage());
        formData.append('audio_duration', String(getSelectedDuration()));
        formData.append('batch_size', String(getBatchSize()));
        formData.append('audio_format', 'mp3');
        formData.append('inference_steps', String(getSteps()));
        const aceModel = getAceModel();
        formData.append('guidance_scale', needsCfgModel(aceModel) ? '7.0' : '3.0');
        formData.append('audio_cover_strength', (document.getElementById('cover-strength').value / 100).toFixed(2));
        if (aceModel) formData.append('model', aceModel);
        const neg = getNegativePrompt() || DEFAULT_NEGATIVE_PROMPT;
        formData.append('lm_negative_prompt', neg);
        const s = getShift();
        if (s !== null) formData.append('shift', String(s));
        const im = getInferMethod();
        if (im) formData.append('infer_method', im);
        const isInst = document.getElementById('simple-inst').checked;
        if (isInst) formData.append('instrumental', 'true');

        showSimpleProgress(5, t('status_task_create'));
        const resp = await fetch('/api/generate_cover', { method: 'POST', body: formData });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const createResult = await resp.json();
        const taskId = createResult.task_id;
        if (!taskId) throw new Error(t('status_task_fail'));

        updateDebugPanel({
            genre: '🎤 Cover',
            theme: coverFile.name,
            mode: 'Cover / strength=' + (document.getElementById('cover-strength').value / 100).toFixed(2),
            tags: '—',
            caption: document.getElementById('cover-caption').value.trim() || '(auto)',
            lang: getSelectedLanguageName(),
            params: 'model=' + (aceModel || 'turbo') + ' / steps=' + getSteps() + ' / cover'
        });

        addHistoryEntry({ task_id: taskId, genre: '🎤 Cover', caption: coverFile.name.substring(0, 60), duration: getSelectedDuration() });
        if (createResult.seed != null) window._lastSeed = createResult.seed;

        await pollTask(taskId);
    } catch (e) {
        console.error('[EasyMusic] Cover generation failed:', e);
        showSimpleStatus('❌ Cover: ' + e.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span data-i18n="btn_generate">' + t('btn_generate') + '</span>';
    }
}

/**
 * リペイント生成
 */
async function generateRepaint() {
    if (!repaintFile) {
        showSimpleStatus(t('status_no_audio_file'), 'error');
        return;
    }
    const start = parseFloat(document.getElementById('repaint-start').value) || 0;
    const end = parseFloat(document.getElementById('repaint-end').value) || 0;
    if (end <= start) {
        showSimpleStatus(t('status_repaint_range_error'), 'error');
        return;
    }

    const btn = document.getElementById('simple-generate-btn');
    btn.disabled = true;
    btn.innerHTML = t('btn_generating');
    hideSimpleStatus();
    showSimpleStatus(t('status_repaint_generating'), 'info');

    try {
        const formData = new FormData();
        formData.append('src_audio', repaintFile);
        formData.append('repainting_start', String(start));
        formData.append('repainting_end', String(end));
        formData.append('prompt', sanitizeCaption(document.getElementById('repaint-caption').value.trim()));
        formData.append('lyrics', document.getElementById('repaint-lyrics').value.trim());
        formData.append('thinking', 'true');
        formData.append('vocal_language', getSelectedLanguage());
        formData.append('audio_duration', String(getSelectedDuration()));
        formData.append('batch_size', String(getBatchSize()));
        formData.append('audio_format', 'mp3');
        formData.append('inference_steps', String(getSteps()));
        const aceModel = getAceModel();
        formData.append('guidance_scale', needsCfgModel(aceModel) ? '7.0' : '3.0');
        if (aceModel) formData.append('model', aceModel);
        const neg = getNegativePrompt() || DEFAULT_NEGATIVE_PROMPT;
        formData.append('lm_negative_prompt', neg);
        const s = getShift();
        if (s !== null) formData.append('shift', String(s));
        const im = getInferMethod();
        if (im) formData.append('infer_method', im);

        showSimpleProgress(5, t('status_task_create'));
        const resp = await fetch('/api/generate_repaint', { method: 'POST', body: formData });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const createResult = await resp.json();
        const taskId = createResult.task_id;
        if (!taskId) throw new Error(t('status_task_fail'));

        updateDebugPanel({
            genre: '🎨 Repaint',
            theme: repaintFile.name,
            mode: 'Repaint / range=' + start.toFixed(1) + 's ~ ' + end.toFixed(1) + 's',
            tags: '—',
            caption: document.getElementById('repaint-caption').value.trim() || '(auto)',
            lang: getSelectedLanguageName(),
            params: 'model=' + (aceModel || 'turbo') + ' / steps=' + getSteps() + ' / repaint'
        });

        addHistoryEntry({ task_id: taskId, genre: '🎨 Repaint', caption: repaintFile.name.substring(0, 60), duration: getSelectedDuration() });
        if (createResult.seed != null) window._lastSeed = createResult.seed;

        await pollTask(taskId);
    } catch (e) {
        console.error('[EasyMusic] Repaint generation failed:', e);
        showSimpleStatus('❌ Repaint: ' + e.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span data-i18n="btn_generate">' + t('btn_generate') + '</span>';
    }
}

/**
 * 共通ポーリング処理
 */
async function pollTask(taskId) {
    const expectedTime = 120; // Cover/Repaintは推定時間をデフォルト2分
    const startTime = Date.now();
    let pollCount = 0;
    const maxPolls = 600;

    while (pollCount < maxPolls) {
        await new Promise(r => setTimeout(r, 1000));
        pollCount++;

        const elapsed = (Date.now() - startTime) / 1000;
        const progress = smoothProgress(elapsed, expectedTime);
        showSimpleProgress(progress, t('status_generating') + ` (${Math.floor(elapsed)}s)`);

        let statusResult;
        try {
            statusResult = await apiRequest('/api/status/' + taskId);
        } catch (_) { continue; }

        if (statusResult.status === 1) {
            showSimpleProgress(100);
            if (statusResult.results && statusResult.results.length > 0) {
                const audioUrls = statusResult.results.map(r => convertAudioUrl(r.url));
                updateHistoryEntry(taskId, audioUrls);
                if (statusResult.results[0].seed != null) window._lastSeed = statusResult.results[0].seed;

                // 無音チェック
                const silent = await isSilentAudio(audioUrls[0]);
                if (silent) {
                    showSimpleStatus(t('status_silent'), 'error');
                    removeHistoryEntry(taskId);
                    hideSimpleProgress();
                    return;
                }

                currentResults = statusResult.results;
                currentLyrics = '';
                showInlinePlayer();
                playSimpleTrack(0);
                showSimpleStatus(`✅ ${statusResult.results.length}${t('status_complete')}`, 'success');
            }
            return;
        } else if (statusResult.status === -1) {
            throw new Error(statusResult.error || t('status_fail'));
        }
    }
    throw new Error('Timeout');
}

// =============================================================================
// Omakase (Quick Generate) — sample_query mode
// =============================================================================

/**
 * おまかせ生成: sample_query を使ってLMに全パラメータを自動決定させる
 */
async function generateOmakase(query) {
    const btn = document.getElementById('simple-generate-btn');
    btn.disabled = true;
    btn.innerHTML = t('btn_generating');
    hideSimpleStatus();
    showSimpleStatus(t('status_omakase'), 'info');

    try {
        const aceModel = getAceModel();
        const params = {
            prompt: '', // sample_query が全て決定するため空
            lyrics: '',
            thinking: true, // おまかせ生成はthinking=true推奨
            sample_query: query,
            vocal_language: getSelectedLanguage(), // UIの言語設定を反映
            audio_duration: getSelectedDuration(),
            batch_size: getBatchSize(),
            audio_format: 'mp3',
            inference_steps: getSteps(),
            guidance_scale: needsCfgModel(aceModel) ? 7.0 : 3.0,
            use_cot_caption: true,
            use_cot_language: true,
            // ネガティブプロンプト（品質低下防止）
            lm_negative_prompt: getNegativePrompt() || DEFAULT_NEGATIVE_PROMPT,
        };
        if (aceModel) params.model = aceModel;
        const omakaseShift = getShift();
        if (omakaseShift !== null) params.shift = omakaseShift;
        const omakaseInferMethod = getInferMethod();
        if (omakaseInferMethod) params.infer_method = omakaseInferMethod;

        showSimpleProgress(5, t('status_task_create'));
        const createResult = await apiRequest('/api/generate', 'POST', params);
        const taskId = createResult.task_id;
        if (!taskId) throw new Error(t('status_task_fail'));

        // デバッグパネル更新
        updateDebugPanel({
            genre: '—',
            theme: query,
            mode: t('label_omakase'),
            tags: '—',
            caption: '(AI auto-generated via sample_query)',
            lang: '(auto)',
            params: (params.model ? 'model=' + params.model + ' / ' : 'model=turbo / ') + 'steps=' + params.inference_steps + ' / sample_query / thinking=true'
        });

        // 履歴に登録
        addHistoryEntry({
            task_id: taskId,
            genre: '🪄 おまかせ',
            caption: query.substring(0, 80),
            duration: params.audio_duration,
        });

        // seed表示
        if (createResult.seed != null) {
            window._lastSeed = createResult.seed;
        }

        // ポーリング
        const expectedTime = estimateGenerationTime(params);
        const startTime = Date.now();
        let pollCount = 0;
        const maxPolls = 600;

        while (pollCount < maxPolls) {
            await new Promise(r => setTimeout(r, 1000));
            pollCount++;

            const elapsed = (Date.now() - startTime) / 1000;
            const progress = smoothProgress(elapsed, expectedTime);
            showSimpleProgress(progress, t('status_generating') + ` (${Math.floor(elapsed)}s)`);

            let statusResult;
            try {
                statusResult = await apiRequest('/api/status/' + taskId);
            } catch (_) { continue; }

            if (statusResult.status === 1) {
                // 成功
                showSimpleProgress(100);
                if (statusResult.results && statusResult.results.length > 0) {
                    const audioUrls = statusResult.results.map(r => convertAudioUrl(r.url));
                    updateHistoryEntry(taskId, audioUrls);

                    if (statusResult.results[0].seed != null) {
                        window._lastSeed = statusResult.results[0].seed;
                    }

                    // 無音チェック
                    const firstUrl = audioUrls[0];
                    const silent = await isSilentAudio(firstUrl);
                    if (silent) {
                        showSimpleStatus(t('status_silent'), 'error');
                        removeHistoryEntry(taskId);
                        hideSimpleProgress();
                        return;
                    }

                    // 既存プレーヤーで再生
                    currentResults = statusResult.results;
                    currentLyrics = '';
                    showInlinePlayer();
                    playSimpleTrack(0);
                    showSimpleStatus(`✅ ${statusResult.results.length}${t('status_complete')}`, 'success');
                }
                return;
            } else if (statusResult.status === 2) {
                removeHistoryEntry(taskId);
                throw new Error(statusResult.error || t('status_gen_fail'));
            }
        }
        removeHistoryEntry(taskId);
        throw new Error(t('status_timeout'));
    } catch (e) {
        showSimpleStatus('❌ ' + e.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<span data-i18n="btn_generate">${t('btn_generate')}</span>`;
    }
}

/**
 * 🎲ボタン: ランダムサンプルを取得して通常UIフォームに自動入力
 */
async function fillRandomSample() {
    const btn = document.getElementById('omakase-random-btn');
    btn.classList.add('loading');
    showSimpleStatus(t('status_random_loading'), 'info');

    try {
        const result = await apiRequest('/api/random_sample', 'POST');
        const data = result.data || result;

        // フォームに自動入力
        if (data.caption) {
            // おまかせ入力をクリアして通常モードで使えるようにする
            const omakaseInput = document.getElementById('omakase-input');
            if (omakaseInput) omakaseInput.value = '';

            // テーマにcaptionをセット
            const themeEl = document.getElementById('simple-theme');
            if (themeEl) themeEl.value = data.caption;
        }
        if (data.lyrics) {
            const lyricsEl = document.getElementById('simple-lyrics');
            if (lyricsEl) lyricsEl.value = data.lyrics;
        }
        if (data.duration && data.duration > 0) {
            const durEl = document.getElementById('simple-duration');
            if (durEl) {
                // 最も近い選択肢を選ぶ
                const options = Array.from(durEl.options).filter(o => o.value !== 'auto');
                const closest = options.reduce((a, b) =>
                    Math.abs(parseInt(a.value) - data.duration) < Math.abs(parseInt(b.value) - data.duration) ? a : b
                );
                durEl.value = closest.value;
            }
        }
        // 言語はユーザーの現在の選択を維持する（ランダムサンプルで上書きしない）
        // if (data.vocal_language) { ... }

        showSimpleStatus(t('status_random_filled'), 'success');
    } catch (e) {
        console.error('[EasyMusic] fillRandomSample failed:', e);
        showSimpleStatus(t('status_random_fail'), 'error');
    } finally {
        btn.classList.remove('loading');
    }
}

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
    // ---- Cover/Repaint モード判定 ----
    if (coverMode) return generateCover();
    if (repaintMode) return generateRepaint();

    // ---- おまかせ生成モード判定 ----
    const omakaseInput = document.getElementById('omakase-input');
    const omakaseQuery = omakaseInput ? omakaseInput.value.trim() : '';

    if (omakaseQuery) {
        return generateOmakase(omakaseQuery);
    }

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

        const aceModel = getAceModel();
        const params = {
            prompt: caption || (selectedGenre ? selectedGenre.name : theme),
            lyrics: effectiveLyrics,
            thinking: useThinking,
            vocal_language: isInst ? '' : getSelectedLanguage(),
            audio_duration: getSelectedDuration(),
            batch_size: getBatchSize(),
            audio_format: 'mp3',
            inference_steps: getSteps(), // ユーザー設定値
            guidance_scale: needsCfgModel(aceModel) ? 7.0 : 3.0, // Turbo: CFG不要(蒸留済), SFT/Base: 5-9推奨
            // CoT（Chain-of-Thought）による品質強化
            use_cot_caption: true,
            use_cot_language: true,
            // ネガティブプロンプト（品質低下防止）
            lm_negative_prompt: getNegativePrompt() || DEFAULT_NEGATIVE_PROMPT,
        };
        if (isInst) params.instrumental = true;
        if (aceModel) params.model = aceModel;
        const normalShift = getShift();
        if (normalShift !== null) params.shift = normalShift;
        const normalInferMethod = getInferMethod();
        if (normalInferMethod) params.infer_method = normalInferMethod;

        // format_input で得たBPM・調を反映（AI推奨パラメータ）
        if (formatInputResult && formatInputResult.success) {
            if (formatInputResult.bpm) params.bpm = formatInputResult.bpm;
            if (formatInputResult.key_scale) params.key_scale = formatInputResult.key_scale;
            if (formatInputResult.time_signature) params.time_signature = formatInputResult.time_signature;
            // format_input で既にメタデータ取得済みなので、生成時の重複推定をスキップ
            params.use_cot_metas = false;
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
            params: (params.model ? 'model=' + params.model + ' / ' : 'model=turbo / ') + 'steps=' + params.inference_steps + ' / guidance=' + params.guidance_scale + ' / duration=' + (params.audio_duration === -1 ? 'auto' : params.audio_duration + 's') + ' / thinking=' + params.thinking + (params.instrumental ? ' / instrumental' : '') + ' / cot_caption=true / cot_lang=true' + (params.bpm ? ' / bpm=' + params.bpm : '') + (params.key_scale ? ' / key=' + params.key_scale : '') + (params.seed != null ? ' / seed=' + params.seed : '')
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

/** Volume icon update */
function updateVolumeIcon(vol) {
    const icon = vol <= 0 ? '🔇' : vol < 0.4 ? '🔈' : vol < 0.7 ? '🔉' : '🔊';
    document.querySelectorAll('.volume-btn').forEach(b => b.textContent = icon);
}

/** Mute/unmute toggle */
let _preMuteVolume = 0.8;
function toggleMute() {
    const audio = document.getElementById('simple-audio');
    if (audio.volume > 0) {
        _preMuteVolume = audio.volume;
        audio.volume = 0;
    } else {
        audio.volume = _preMuteVolume;
    }
    const pct = Math.round(audio.volume * 100);
    document.querySelectorAll('.volume-bar').forEach(b => b.value = pct);
    updateVolumeIcon(audio.volume);
    localStorage.setItem('easymusic_volume', audio.volume.toString());
}

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

    // ---- Volume Control ----
    const savedVol = parseFloat(localStorage.getItem('easymusic_volume') ?? '0.8');
    audio.volume = Math.max(0, Math.min(1, savedVol));
    const volPct = Math.round(audio.volume * 100);
    document.querySelectorAll('.volume-bar').forEach(b => b.value = volPct);
    updateVolumeIcon(audio.volume);

    document.querySelectorAll('.volume-bar').forEach(bar => {
        bar.addEventListener('input', () => {
            const vol = bar.value / 100;
            audio.volume = vol;
            localStorage.setItem('easymusic_volume', vol.toString());
            // Sync all volume bars
            document.querySelectorAll('.volume-bar').forEach(b => b.value = bar.value);
            updateVolumeIcon(vol);
        });
    });

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

    // アコーディオンのsummaryに件数を表示
    const summaryEl = document.querySelector('#history-section > .collapsible-summary');
    if (summaryEl) {
        const countBadge = history.length > 0 ? ` (${history.length})` : '';
        summaryEl.textContent = t('history_title') + countBadge;
    }

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
        // 他モードをOFF
        if (coverMode) toggleCoverMode();
        if (repaintMode) toggleRepaintMode();
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
            const jukeboxAceModel = getAceModel();
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
                // ネガティブプロンプト（品質低下防止）
                lm_negative_prompt: getNegativePrompt() || DEFAULT_NEGATIVE_PROMPT,
            };
            if (jukeboxAceModel) params.model = jukeboxAceModel;
            const jukeboxShift = getShift();
            if (jukeboxShift !== null) params.shift = jukeboxShift;
            const jukeboxInferMethod = getInferMethod();
            if (jukeboxInferMethod) params.infer_method = jukeboxInferMethod;
            if (formatInputResult && formatInputResult.success) {
                if (formatInputResult.bpm) params.bpm = formatInputResult.bpm;
                if (formatInputResult.key_scale) params.key_scale = formatInputResult.key_scale;
                if (formatInputResult.time_signature) params.time_signature = formatInputResult.time_signature;
                // format_input で既にメタデータ取得済みなので、生成時の重複推定をスキップ
                params.use_cot_metas = false;
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
