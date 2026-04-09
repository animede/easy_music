"""
LRC タイムスタンプ生成サービス
==============================
音声ファイルの RMS エネルギーエンベロープ解析で「音が鳴っている区間」を検出し、
歌詞セクションの構造に基づいて各行にタイムスタンプを割り当てる。

Silero VAD は "音声会話" 向けであり歌唱検出には不向きなため、
シンプルかつ頑健なエネルギーベースの手法を採用する。
"""

from __future__ import annotations

import io
import logging
import re
from dataclasses import dataclass, field
from typing import List, Tuple

import numpy as np
import soundfile as sf

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# セクションタグの重み — 歌詞行密度に比例する概算値
# ACE-Step 1.5 公式ドキュメント準拠
# ---------------------------------------------------------------------------
_SECTION_WEIGHT: dict[str, float] = {
    # vocal セクション
    "verse": 1.0,
    "chorus": 1.0,
    "pre-chorus": 0.9,
    "bridge": 0.8,
    # instrumental セクション（通常は歌詞なし）
    "intro": 0.6,
    "outro": 0.6,
    "instrumental": 0.3,
    "inst": 0.3,
    # ダイナミクス / 複合インスト
    "build": 0.4,
    "drop": 0.4,
    "breakdown": 0.4,
    "guitar solo": 0.3,
    "piano interlude": 0.4,
    "drum break": 0.3,
    "interlude": 0.5,
    "break": 0.4,
    "solo": 0.3,
    "fade out": 0.2,
    "silence": 0.1,
}

# --- instrumental (歌詞無し) と見なすタグ ----------------------------------
_INSTRUMENTAL_TAGS = {
    "intro", "outro", "instrumental", "inst",
    "guitar solo", "piano interlude", "drum break",
    "interlude", "break", "solo",
    "fade out", "silence",
    "build", "drop", "breakdown",
}

# instrumental セクション 1 個あたりのデフォルト秒数
_INSTRUMENTAL_SEC = 8.0

# イントロ / アウトロのデフォルト想定秒数
_INTRO_ASSUMED_SEC = 10.0
_OUTRO_ASSUMED_SEC = 5.0

# ---------------------------------------------------------------------------
# データクラス
# ---------------------------------------------------------------------------

@dataclass
class LrcLine:
    time_sec: float
    text: str

    def to_lrc(self) -> str:
        m = int(self.time_sec) // 60
        s = self.time_sec - m * 60
        return f"[{m:02d}:{s:05.2f}]{self.text}"

    def to_dict(self) -> dict:
        return {"time": round(self.time_sec, 3), "text": self.text}


@dataclass
class Section:
    """歌詞内の1セクション（タグ + 本文行）"""
    tag: str = ""          # "verse", "chorus" …  空文字=不明
    lines: list[str] = field(default_factory=list)

    @property
    def weight(self) -> float:
        return _SECTION_WEIGHT.get(self.tag, 0.8)

    @property
    def is_instrumental(self) -> bool:
        return self.tag in _INSTRUMENTAL_TAGS and len(self.lines) == 0


# ---------------------------------------------------------------------------
# 歌詞パーサ
# ---------------------------------------------------------------------------
_TAG_RE = re.compile(r"^\[([a-zA-Z\- ]+)\]$")


def parse_lyrics(lyrics: str) -> list[Section]:
    """歌詞テキストをセクション単位に分割する。"""
    sections: list[Section] = []
    current = Section()
    for raw in lyrics.splitlines():
        line = raw.strip()
        if not line:
            continue
        m = _TAG_RE.match(line)
        if m:
            # 前のセクションを保存
            if current.tag or current.lines:
                sections.append(current)
            tag = m.group(1).strip().lower()
            current = Section(tag=tag)
        else:
            current.lines.append(line)
    if current.tag or current.lines:
        sections.append(current)
    return sections


# ---------------------------------------------------------------------------
# エネルギーエンベロープ解析
# ---------------------------------------------------------------------------

def _compute_energy_envelope(
    audio_bytes: bytes,
    hop_ms: int = 50,
) -> Tuple[np.ndarray, float]:
    """
    音声バイト列から RMS エネルギーエンベロープを計算する。

    Returns
    -------
    envelope : ndarray  — 各フレームの RMS 値
    hop_sec : float     — フレーム間隔 (秒)
    """
    data, sr = sf.read(io.BytesIO(audio_bytes), dtype="float32", always_2d=True)
    # モノラルに変換
    mono = data.mean(axis=1)

    hop_samples = int(sr * hop_ms / 1000)
    n_frames = len(mono) // hop_samples
    if n_frames == 0:
        return np.array([0.0]), hop_ms / 1000

    frames = mono[: n_frames * hop_samples].reshape(n_frames, hop_samples)
    rms = np.sqrt(np.mean(frames ** 2, axis=1))
    return rms, hop_ms / 1000


def detect_active_region(
    audio_bytes: bytes,
    silence_threshold_db: float = -40.0,
    hop_ms: int = 50,
) -> Tuple[float, float, float]:
    """
    音声のアクティブ区間 (音が鳴っている開始〜終了) を検出する。

    Returns
    -------
    start_sec : float
    end_sec   : float
    duration  : float  — 音声全体の長さ
    """
    envelope, hop_sec = _compute_energy_envelope(audio_bytes, hop_ms)
    duration = len(envelope) * hop_sec

    if envelope.max() < 1e-8:
        return 0.0, duration, duration

    # dB に変換 (0 除算回避)
    eps = 1e-10
    db = 20 * np.log10(envelope + eps)
    threshold = silence_threshold_db

    active_mask = db > threshold
    indices = np.nonzero(active_mask)[0]

    if len(indices) == 0:
        # 全体が無音 → フォールバック
        return 0.0, duration, duration

    start_sec = float(indices[0]) * hop_sec
    end_sec = float(indices[-1] + 1) * hop_sec

    logger.info(
        "active region: %.2fs – %.2fs  (duration=%.2fs, threshold=%ddB, "
        "frames=%d/%d)",
        start_sec, end_sec, duration, silence_threshold_db,
        len(indices), len(envelope),
    )
    return start_sec, end_sec, duration


# ---------------------------------------------------------------------------
# LRC 生成
# ---------------------------------------------------------------------------

def generate_lrc(audio_bytes: bytes, lyrics: str) -> list[LrcLine]:
    """
    音声のアクティブ区間を解析し、歌詞セクションの構造に基づいて
    LRC タイムスタンプを割り当てる。

    ・セクションタグ ([verse] 等) は LRC 出力に含めない（歌詞行のみ）
    ・instrumental セクションには固定秒数を割り当て、残りを歌詞セクションに配分
    """
    sections = parse_lyrics(lyrics)
    if not sections:
        return []

    # 歌詞行が 1 行もなければ LRC 不要
    total_text_lines = sum(len(s.lines) for s in sections)
    if total_text_lines == 0:
        return []

    start_sec, end_sec, duration = detect_active_region(audio_bytes)
    active_dur = end_sec - start_sec

    # --- イントロ / アウトロの時間オフセット計算 --------------------------
    # 先頭セクションが intro なら想定秒数をオフセット、なければ 0
    has_intro = (len(sections) > 0 and sections[0].tag in
                 ("intro",) and sections[0].is_instrumental)
    intro_offset = min(_INTRO_ASSUMED_SEC, active_dur * 0.25) if has_intro else 0.0

    # 末尾セクションが outro / fade out なら想定秒数を確保
    has_outro = (len(sections) > 0 and sections[-1].tag in
                 ("outro", "fade out") and sections[-1].is_instrumental)
    outro_offset = min(_OUTRO_ASSUMED_SEC, active_dur * 0.15) if has_outro else 0.0

    # 歌詞に使える区間
    lyrics_start = start_sec + intro_offset
    lyrics_end = end_sec - outro_offset
    lyrics_dur = max(lyrics_end - lyrics_start, 1.0)

    # --- instrumental セクションに固定秒数を割り当て ----------------------
    # intro/outro は既にオフセットで処理済みなので除外
    mid_instrumental = [
        s for s in sections
        if s.is_instrumental
        and not (has_intro and s is sections[0])
        and not (has_outro and s is sections[-1])
    ]
    n_instrumental = len(mid_instrumental)
    inst_total = min(n_instrumental * _INSTRUMENTAL_SEC, lyrics_dur * 0.3)
    vocal_dur = lyrics_dur - inst_total
    inst_each = inst_total / n_instrumental if n_instrumental > 0 else 0.0

    # --- 歌詞セクションの weighted line count ------------------------------
    vocal_sections_wlc: list[float] = []
    total_vocal_wlc = 0.0
    for sec in sections:
        if sec.is_instrumental:
            vocal_sections_wlc.append(0.0)
        else:
            wlc = max(len(sec.lines), 1) * sec.weight
            vocal_sections_wlc.append(wlc)
            total_vocal_wlc += wlc

    if total_vocal_wlc < 1e-6:
        total_vocal_wlc = 1.0

    # --- 各セクションに時間を配分して歌詞行だけ出力 -----------------------
    lrc_lines: list[LrcLine] = []
    cursor = lyrics_start

    for sec, wlc in zip(sections, vocal_sections_wlc):
        if sec.is_instrumental:
            # intro/outro はオフセット済みなのでスキップ
            if has_intro and sec is sections[0]:
                continue
            if has_outro and sec is sections[-1]:
                continue
            # その他の instrumental: 時間だけ進めて LRC 行は出力しない
            cursor += inst_each
            continue

        # vocal セクション
        sec_dur = vocal_dur * (wlc / total_vocal_wlc)
        n_lines = len(sec.lines)

        if n_lines == 0:
            cursor += sec_dur
            continue

        # 歌詞行を均等に配分（タグ行は出力しない）
        line_interval = sec_dur / n_lines
        for i, text in enumerate(sec.lines):
            t = cursor + i * line_interval
            lrc_lines.append(LrcLine(time_sec=t, text=text))

        cursor += sec_dur

    logger.info(
        "generated %d LRC lines (active=%.2fs–%.2fs, "
        "intro_offset=%.1fs, outro_offset=%.1fs, lyrics_range=%.2fs–%.2fs)",
        len(lrc_lines), start_sec, end_sec,
        intro_offset, outro_offset, lyrics_start, lyrics_end,
    )
    return lrc_lines


# ---------------------------------------------------------------------------
# ユーティリティ
# ---------------------------------------------------------------------------

def lrc_to_string(lines: list[LrcLine]) -> str:
    return "\n".join(l.to_lrc() for l in lines)


def lrc_lines_to_json(lines: list[LrcLine]) -> list[dict]:
    return [l.to_dict() for l in lines]
