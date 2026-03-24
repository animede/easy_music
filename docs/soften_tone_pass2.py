#!/usr/bin/env python3
"""
第2パス：残った「だ。」「ある。」文末を変換
"""

import re

FILE = "/home/animede/easy_music/docs/音楽生成AI大辞典_アウトライン.md"

def is_special_line(line: str) -> bool:
    stripped = line.strip()
    if stripped.startswith("#"):
        return True
    if re.match(r"^\s*[-*]", stripped):
        return True
    if re.match(r"^\s*\d+\.", stripped):
        return True
    if stripped.startswith("`"):
        return True
    if stripped.startswith("|") or stripped.startswith(">"):
        return True
    return False

def transform_pass2(line: str) -> str:
    if is_special_line(line):
        return line

    s = line

    # ---------- だ。→ です。/ですね。 ----------
    # "〜から強い。" → アニメっぽい感嘆には「〜から強いですね。」
    # 一般的に「〜だ。」→「〜です。」
    # 「〜のだ。」→「〜なんですよね。」 (強調文)
    s = re.sub(r'のだ。$', 'なんですよね。', s)
    s = re.sub(r'のだ。\n', 'なんですよね。\n', s)
    s = re.sub(r'はずだ。$', 'はずです。', s)
    s = re.sub(r'ほうだ。$', 'ほうです。', s)

    # 文末のだ。→ です。 (一般)
    # 前後に全角文字がある場合のみ（英数字や記号で終わるものは除外）
    s = re.sub(r'([ァ-ヶぁ-ん一-龥ー、])だ。$', lambda m: m.group(1) + 'ですね。', s)

    # ---------- ある。→ あります。 ----------
    # 「〜がある。」「〜もある。」「〜はある。」→ 「〜があります。」
    s = re.sub(r'がある。$', 'があります。', s)
    s = re.sub(r'もある。$', 'もあります。', s)
    s = re.sub(r'はある。$', 'はあります。', s)
    s = re.sub(r'でもある。$', 'でもあります。', s)
    s = re.sub(r'になる。$', 'になります。', s)
    s = re.sub(r'できる。$', 'できます。', s)
    s = re.sub(r'変わる。$', '変わります。', s)
    s = re.sub(r'残る。$', '残ります。', s)
    s = re.sub(r'増える。$', '増えます。', s)
    s = re.sub(r'消える。$', '消えます。', s)
    s = re.sub(r'育つ。$', '育ちます。', s)
    s = re.sub(r'変わらない。$', '変わりません。', s)
    s = re.sub(r'できない。$', 'できません。', s)

    # 「〜している。」→「〜しています。」
    s = re.sub(r'している。$', 'しています。', s)
    s = re.sub(r'している。\n', 'しています。\n', s)

    # 「〜いる。」→「〜います。」
    s = re.sub(r'([ァ-ヶぁ-ん一-龥ー])いる。$', lambda m: m.group(1) + 'います。', s)

    # 「〜来る。」→「〜来ます。」
    s = re.sub(r'て来る。$', 'てきます。', s)

    # 「〜言える。」→「〜言えます。」(未変換のもの)
    s = re.sub(r'と言える。$', 'と言えますね。', s)

    # 「〜見える。」→「〜見えます。」
    s = re.sub(r'に見える。$', 'に見えます。', s)

    # ---------- まだ残る形式的な表現 ----------
    # 「〜においては」→ そのまま (too common to change blindly)
    # 「〜によって」→ そのまま

    return s


def main():
    with open(FILE, 'r', encoding='utf-8') as f:
        text = f.read()

    in_code_block = False
    lines = text.split('\n')
    result = []

    for line in lines:
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            result.append(line)
            continue
        if in_code_block:
            result.append(line)
            continue
        result.append(transform_pass2(line))

    transformed = '\n'.join(result)

    changed = sum(1 for a, b in zip(lines, transformed.split('\n')) if a != b)
    print(f"第2パス変換: {changed} 行変更")

    with open(FILE, 'w', encoding='utf-8') as f:
        f.write(transformed)


if __name__ == '__main__':
    main()
