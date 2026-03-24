#!/usr/bin/env python3
"""
音楽生成AI大辞典 トーン変換スクリプト
「〜である」調の硬い論文体を、同人誌らしい柔らかい文体に変換する。
"""

import re

INPUT_FILE = "/home/animede/easy_music/docs/音楽生成AI大辞典_アウトライン.md"
OUTPUT_FILE = "/home/animede/easy_music/docs/音楽生成AI大辞典_アウトライン.md"
BACKUP_FILE = "/home/animede/easy_music/docs/音楽生成AI大辞典_アウトライン.md.bak"

def is_special_line(line: str) -> bool:
    """見出し・リスト・コードブロックなどは変換しない"""
    stripped = line.strip()
    if stripped.startswith("#"):
        return True
    if stripped.startswith("- ") or stripped.startswith("* ") or stripped.startswith("\t- ") or stripped.startswith("\t* "):
        return True
    if re.match(r"^\s*\d+\.\s", stripped):
        return True
    if stripped.startswith("`") or stripped.startswith("```"):
        return True
    if stripped.startswith("|") or stripped.startswith(">"):
        return True
    return False

def transform_line(line: str) -> str:
    """1行分のトーン変換"""
    # 特殊行はスキップ
    if is_special_line(line):
        return line

    s = line

    # --------------------------------------------------------
    # 1. 「〜である。」→「〜です。」
    # --------------------------------------------------------
    # "〜ことである。" などを自然に変換
    s = re.sub(r'ことである。', 'ことです。', s)
    s = re.sub(r'ものである。', 'ものです。', s)
    s = re.sub(r'わけである。', 'わけですね。', s)
    s = re.sub(r'からである。', 'からです。', s)
    s = re.sub(r'ためである。', 'ためです。', s)
    s = re.sub(r'はずである。', 'はずです。', s)
    s = re.sub(r'べきである。', 'べきです。', s)
    s = re.sub(r'通りである。', '通りです。', s)
    s = re.sub(r'結論である。', '結論です。', s)
    s = re.sub(r'点である。', '点です。', s)
    s = re.sub(r'話である。', '話です。', s)
    s = re.sub(r'仕事である。', '仕事です。', s)
    s = re.sub(r'意味である。', '意味です。', s)
    s = re.sub(r'特徴である。', '特徴です。', s)
    s = re.sub(r'強みである。', '強みです。', s)
    s = re.sub(r'弱点である。', '弱点です。', s)
    s = re.sub(r'課題である。', '課題です。', s)
    s = re.sub(r'価値である。', '価値です。', s)
    s = re.sub(r'狙いである。', '狙いです。', s)
    s = re.sub(r'総称である。', '総称です。', s)
    s = re.sub(r'大事である。', '大事です。', s)
    s = re.sub(r'重要である。', '重要です。', s)

    # 汎用「〜である。」→「〜です。」（語末直前の文字が名詞・形容詞系）
    s = re.sub(r'([。！」）\w])である。', lambda m: m.group(1) + 'です。', s)

    # --------------------------------------------------------
    # 2. 「〜ではない」→「〜ではありません」
    # --------------------------------------------------------
    s = re.sub(r'ではない。', 'ではありません。', s)
    s = re.sub(r'ではない\n', 'ではありません\n', s)
    s = re.sub(r'ではなく、', 'ではなく、', s)  # keep this form
    s = re.sub(r'わけではない。', 'わけではありません。', s)
    s = re.sub(r'ものではない。', 'ものではありません。', s)
    s = re.sub(r'するほどではない。', 'するほどではありません。', s)

    # --------------------------------------------------------
    # 3. 文末「〜だ。」→「〜です。」 (慎重に)
    # --------------------------------------------------------
    # 名詞 + だ → です（ただし「ある」「いる」的な文末を避けるため限定的に）
    s = re.sub(r'感覚だ。', '感覚ですね。', s)
    s = re.sub(r'技術だ。', '技術です。', s)
    s = re.sub(r'道具だ。', '道具です。', s)
    s = re.sub(r'問題だ。', '問題です。', s)
    s = re.sub(r'設計だ。', '設計です。', s)
    s = re.sub(r'目的だ。', '目的です。', s)
    s = re.sub(r'仕事だ。', '仕事です。', s)
    s = re.sub(r'答えだ。', '答えです。', s)
    s = re.sub(r'武器だ。', '武器ですね。', s)
    s = re.sub(r'方法だ。', '方法です。', s)
    s = re.sub(r'話だ。', '話です。', s)
    s = re.sub(r'発想だ。', '発想です。', s)
    s = re.sub(r'本質だ。', '本質です。', s)
    s = re.sub(r'基盤だ。', '基盤です。', s)
    s = re.sub(r'人間だ。', '人間です。', s)

    # --------------------------------------------------------
    # 4. 「重要なのは」「重要なのが」→「大切なのは」
    # --------------------------------------------------------
    s = re.sub(r'重要なのは', '大切なのは', s)
    s = re.sub(r'重要なのが', '大切なのが', s)

    # --------------------------------------------------------
    # 5. 硬い接続詞を少し柔らかく
    # --------------------------------------------------------
    s = re.sub(r'^つまり、', 'つまり、', s)  # keep but could soften context
    s = re.sub(r'そのため、', 'そのため、', s)  # keep

    # --------------------------------------------------------
    # 6. 「〜するほどよい」→「〜するほどいい」(slightly warmer)
    # 7. 「〜に他ならない」→「〜にほかなりません」  
    # --------------------------------------------------------
    s = re.sub(r'に他ならない', 'にほかなりません', s)
    s = re.sub(r'ことが出来る', 'ことができる', s)  # 正しい表記に

    # --------------------------------------------------------
    # 8. 「〜と言える」→「〜と言えますね」 in explanation context
    # --------------------------------------------------------
    s = re.sub(r'と言える。', 'と言えますね。', s)
    s = re.sub(r'といえる。', 'といえますね。', s)

    # --------------------------------------------------------
    # 9. 「〜できる」at end → 「〜できます」
    # --------------------------------------------------------
    s = re.sub(r'ことができる。', 'ことができます。', s)
    s = re.sub(r'ことが多い。', 'ことが多いです。', s)
    s = re.sub(r'場合もある。', '場合もあります。', s)
    s = re.sub(r'場合は多い。', '場合は多いです。', s)
    s = re.sub(r'ことがある。', 'ことがあります。', s)
    s = re.sub(r'ものもある。', 'ものもあります。', s)
    s = re.sub(r'ものがある。', 'ものがあります。', s)
    s = re.sub(r'ものとなる。', 'ものになります。', s)
    s = re.sub(r'ことになる。', 'ことになります。', s)
    s = re.sub(r'ことになった。', 'ことになりました。', s)

    # --------------------------------------------------------
    # 10. 少しだけ親しみのある言い回しへ
    # --------------------------------------------------------
    s = s.replace('逆に言えば、', '言い換えれば、')
    s = s.replace('ただし、', 'ただ、')
    s = s.replace('非常に優れている', 'とても優れています')
    s = s.replace('非常に重要', 'とても重要')
    s = s.replace('非常に有効', 'とても有効')
    s = s.replace('非常に大きい', 'かなり大きい')
    s = s.replace('非常に大きな', 'かなり大きな')
    s = s.replace('非常に強い', 'とても強い')
    s = s.replace('非常に難しい', 'なかなか難しい')
    s = s.replace('非常に多い', 'かなり多い')
    s = s.replace('非常に強力', 'かなり強力')
    s = s.replace('非常に合理的', 'とても合理的')
    s = s.replace('非常に大切', 'とても大切')

    # --------------------------------------------------------
    # 11. 「〜した方がよい」→「〜した方がいいです」 (warmer)
    # --------------------------------------------------------
    s = re.sub(r'した方がよい。', 'した方がいいでしょう。', s)
    s = re.sub(r'すべきだ。', 'するといいですね。', s)

    # --------------------------------------------------------
    # 12. 文末「〜する必要がある。」→「〜する必要があります。」
    # --------------------------------------------------------
    s = re.sub(r'する必要がある。', 'する必要があります。', s)
    s = re.sub(r'する必要がある\n', 'する必要があります\n', s)

    # --------------------------------------------------------
    # 13. 「〜から来ている」→ keep or soften
    # --------------------------------------------------------
    s = re.sub(r'からである\n', 'からです\n', s)

    return s


def transform_document(text: str) -> str:
    """文書全体を変換"""
    in_code_block = False
    lines = text.split('\n')
    result = []

    for line in lines:
        # コードブロック内はスキップ
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            result.append(line)
            continue

        if in_code_block:
            result.append(line)
            continue

        result.append(transform_line(line))

    return '\n'.join(result)


def main():
    # バックアップ作成
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        original = f.read()

    with open(BACKUP_FILE, 'w', encoding='utf-8') as f:
        f.write(original)
    print(f"バックアップ作成: {BACKUP_FILE}")

    # 変換実行
    transformed = transform_document(original)

    # 書き込み
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(transformed)

    # 変換件数カウント
    original_lines = original.split('\n')
    transformed_lines = transformed.split('\n')
    changed = sum(1 for a, b in zip(original_lines, transformed_lines) if a != b)
    print(f"変換完了: {changed} 行が変更されました（全 {len(original_lines)} 行）")


if __name__ == '__main__':
    main()
