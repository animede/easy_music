= ACE-Stepプロンプトガイド

本章では、ACE-Step 1.5で最高品質の楽曲を生成するための実践的プロンプトエンジニアリングを解説します。Caption（タグ）の書き方、歌詞の構造化、ジャンル融合のテクニック、日本語歌詞の扱い方、そしてよくあるトラブルの対処法まで網羅します。

//blankline

== プロンプトの基本構造

ACE-Step 1.5への入力は、大きく分けて2つのチャンネル で構成されます。

=== Caption（キャプション/スタイルプロンプト）

楽曲の「全体像」を描写するテキスト。 ジャンル、ムード、楽器、テンポ、ボーカルスタイルなどをカンマ区切りで記述します。Captionは生成品質に最も影響を与える入力です。

//listnum[chap11l001][Caption（キャプション / スタイルプロンプト）の例]{
J-POP, female vocal, catchy melody, bright, emotional vocal, polished production
//}
//blankline

=== Lyrics（歌詞/コンテンツ入力）

楽曲の「時間軸」を制御するテキスト。 歌詞本文に加え、セクションタグ（[verse], [chorus]等）で楽曲の構造を指定します。

//listnum[chap11l002][Lyrics（歌詞 / コンテンツ入力）の例]{
[Verse 1]
空を見上げて 星が輝いている
心の奥で 何かが変わりはじめた

[Chorus]
走り出そう 新しい世界へ
光を追いかけて どこまでも
//}
//blankline

=== 2つの入力の関係

//table[chap11t001][2つの入力の関係の一覧]{
入力	役割	比喩
------------
Caption	「何を」演奏するか（スタイル・雰囲気・楽器）	映画の「世界観設定」
Lyrics	「どう」展開するか（時間軸・構造・歌詞）	映画の「分镜脚本（絵コンテ）」
//}
//blankline

最も重要な原則: CaptionとLyricsは同じ物語を語っている必要があります。矛盾があるとモデルが混乱し、出力品質が低下します。

//blankline

== 効果的なタグ（Caption）の書き方

=== Captionの記述フォーマット

ACE-Step 1.5は複数の入力フォーマットに対応しています。

//listnum[chap11l003][Captionの記述フォーマットの例]{
# フォーマット1: カンマ区切りタグ（最も一般的）
pop, female vocal, catchy, upbeat, synth, 120 BPM

# フォーマット2: 自然言語
A catchy pop song with female vocals and upbeat synths at 120 BPM

# フォーマット3: 詳細な説明
Pop song featuring bright female vocals over catchy synth melodies,
upbeat production with polished mixing, 120 BPM, radio-friendly
//}
//blankline

どのフォーマットでも品質に大きな差はありませんが、カンマ区切りタグが最も簡潔で、Easy Musicの内部処理（AIキャプション生成）でも採用されています。

=== タグの構成要素（推奨順序）

効果的なCaptionは、以下の5つのディメンション（次元）を意識して構成します。

//table[chap11t002][タグの構成要素（推奨順序）の一覧]{
順序	ディメンション	記述例	効果
------------
1	ジャンル / 時代	cinematic orchestral, 80s synth pop, jazz ballad	基盤となるスタイルを設定
2	キー楽器	acoustic guitar, piano, soft strings, synth bass, drum machine	聴こえる楽器を具体的に指定
3	ムード / 形容詞	uplifting, hopeful, dark, brooding, dreamy, ethereal	感情的な描写
4	テンポ / BPM	105 BPM, fast tempo, slow ballad	速度の明示
5	ボーカル属性	female vocal, male vocal, whisper, powerful	歌声のタイプ
//}
//blankline

追加のディメンション（上級者向け）:

//table[chap11t003][タグの構成要素（推奨順序）の一覧]{
ディメンション	記述例
------------
音色テクスチャ	warm, bright, crisp, airy, punchy, lush, raw, polished
録音品質	lo-fi, analog, studio quality, vinyl crackle, tape saturation
テンポの感覚	slow tempo, mid-tempo, fast-paced, groovy, driving, laid-back
構造ヒント	building intro, catchy chorus, dramatic bridge, fade-out ending
//}
//blankline

=== タグの適正量

3〜7タグがスイートスポットです。

//table[chap11t004][タグの適正量の一覧]{
タグ数	効果	リスク
------------
1〜2	モデルの自由度が高い	意図しないスタイルになりやすい
3〜5	バランス良好（推奨）	—
5〜7	詳細な制御が可能	—
8〜10	冗長だが動作する	重要度の低いタグが無視される可能性
10+	矛盾リスク増大	タグ同士が衝突し品質低下
//}
//blankline

=== 矛盾するタグの回避

モデルはタグ間の矛盾を解消できません。 矛盾するタグを指定すると、どちらか一方が無視されるか、不自然な楽曲が生成されます。

//listnum[chap11l004][矛盾するタグの回避の例]{
 スタイルの衝突
"ambient, metal"  → 静寂と爆音は両立しない

 ムードの矛盾
"upbeat, melancholic"  → 陽気と憂鬱は矛盾

 テンポの矛盾
"fast tempo, slow ballad"  → 速いのか遅いのか不明

 意図的なジャンル融合（OKな例）
"electronic with jazz influences"  → ジャズの要素を持つエレクトロニカ
"rock ballad"  → ロックの音色でバラード
"lo-fi hip hop, jazzy chords"  → Lo-Fiとジャズの共存（自然な組み合わせ）
//}
//blankline

=== Captionを書く5つの方法

ACE-Step 1.5は、Captionを書くための複数のアシスト機能を提供しています。

 1. ランダムダイス（ボタン）: UIのランダムボタンを押すと、適切なフォーマットのCaptionサンプルが表示されます。テンプレートとして活用できます
 2. Format機能: 短い手書きCaptionをLMが自動拡張。例: "pop" → "pop, catchy melody, bright synth, polished production, upbeat vocal"
 3. Sample Query（おまかせ）: 自然言語で "夏のドライブにぴったりの曲" と入力するだけで、CaptionとLyricsを自動生成
 4. Easy Musicのジャンルタイル: 30種類のプリセットから選ぶだけで最適なCaptionが自動設定
 5. Easy MusicのAIタグ生成: 歌詞を入力するだけでLLMがジャンル・楽器・BPMを含むタグを自動推定

//blankline

== 歌詞（Lyrics）の書き方

=== セクションタグ一覧

歌詞のセクションタグは、ACE-Step 1.5が楽曲構造を理解するための最も強力なツールです。

=== 基本構造タグ

//table[chap11t005][基本構造タグの一覧]{
タグ	用途	説明
------------
[Intro]	イントロ	雰囲気の確立。通常はインストゥルメンタル
[Verse] / [Verse 1]	ヴァース	物語の進行。Aメロ/Bメロに相当
[Pre-Chorus]	プリコーラス	サビへの盛り上がり。エネルギーの構築
[Chorus]	サビ	感情のクライマックス。最もエネルギーが高い
[Bridge]	ブリッジ	転調や気分転換。Cメロに相当
[Outro]	アウトロ	楽曲の締めくくり。フェードアウトなど
//}
//blankline

=== ダイナミクスタグ

//table[chap11t006][ダイナミクスタグの一覧]{
タグ	用途	推奨ジャンル
------------
[Build]	エネルギーの段階的上昇	EDM、トランス
[Drop]	エネルギーの爆発的解放	EDM、ダブステップ
[Breakdown]	楽器数の削減、空間の創出	テクノ、ロック
//}
//blankline

=== インストゥルメンタルセクションタグ

//table[chap11t007][インストゥルメンタルセクションタグの一覧]{
タグ	用途
------------
[Instrumental]	純粋なインストゥルメンタル区間
[Guitar Solo]	ギターソロ
[Piano Interlude]	ピアノ間奏
[Drum Break]	ドラムブレイク
//}
//blankline

=== 特殊タグ

//table[chap11t008][特殊タグの一覧]{
タグ	用途
------------
[Fade Out]	フェードアウト終了
[Silence]	無音区間
//}
//blankline

=== ボーカル制御タグ

セクションタグ内でボーカルスタイルを指定できます。

//table[chap11t009][ボーカル制御タグの一覧]{
タグ	効果
------------
[raspy vocal]	ハスキーで質感のある声
[whispered]	ささやき声
[falsetto]	ファルセット（裏声）
[powerful belting]	力強い高音ベルティング
[spoken word]	語り・ラップ
[harmonies]	レイヤードハーモニー
[call and response]	コール・アンド・レスポンス
[ad-lib]	アドリブ的装飾
//}
//blankline

=== エネルギー・感情タグ

//table[chap11t010][エネルギー・感情タグの一覧]{
タグ	効果
------------
[high energy]	高エネルギー、情熱的
[low energy]	低エネルギー、抑制的
[building energy]	エネルギーの漸増
[explosive]	爆発的エネルギー
[melancholic]	メランコリック
[euphoric]	ユーフォリック
[dreamy]	夢幻的
[aggressive]	アグレッシブ
//}
//blankline

=== タグの組み合わせ

構造タグに - でスタイルヒントを追加できます。

//listnum[chap11l005][タグの組み合わせの例]{
 推奨: シンプルな組み合わせ
[Chorus - anthemic]
ここにサビの歌詞
夢が燃えている

[Bridge - whispered]
そっとその言葉を囁いて

 推奨: 感情の指定
[Verse - melancholic]
[Instrumental - ambient]

 非推奨: タグの積み重ね
[Chorus - anthemic - stacked harmonies - high energy - powerful - epic]
→ モデルが混乱する。タグ内容を歌詞と誤解するリスクもある
//}
//blankline

原則: 複雑なスタイル指示はCaptionに書き、歌詞内のタグは簡潔に保つ。

=== 歌詞量のガイドライン

ACE-Step 1.5は、1秒あたり約2〜3語（英語）を歌唱します。

//table[chap11t011][歌詞量のガイドラインの一覧]{
楽曲時間	推奨語数（英語）	推奨文字数（日本語）
------------
30秒	40〜70語	60〜120文字
47秒	90〜140語	130〜200文字
60秒	120〜180語	170〜260文字
120秒	240〜360語	340〜520文字
//}
//blankline

多すぎる場合: 歌唱が詰まり、早口になったり歌詞が省略されたりします
少なすぎる場合: 長いポーズや不必要なリピートが発生します

=== 歌唱可能な歌詞を書くコツ

1. シラブル数のコントロール

//listnum[chap11l006][歌唱可能な歌詞を書くコツの例]{
 歌いやすい（1行6〜10シラブル）
Walking through the empty streets
Thinking of your gentle touch

 歌いにくい（1行が長すぎる）
I was walking through the extraordinarily deserted streets of
the old downtown district when I suddenly remembered
//}
//blankline

2. 大文字で強調

//listnum[chap11l007][歌唱可能な歌詞を書くコツの例]{
We rise TOGETHER
Into the LIGHT
→ 大文字の語が強調されて歌唱される
//}
//blankline

3. 括弧でバックボーカル

//listnum[chap11l008][歌唱可能な歌詞を書くコツの例]{
We are the dreamers (dreamers)
We are the light (oh light)
→ 括弧内がバックボーカル/エコーとして処理される
//}
//blankline

4. 母音の引き伸ばし

//listnum[chap11l009][歌唱可能な歌詞を書くコツの例]{
Feeeling so aliiive
→ 母音の繰り返しで伸ばし効果
→ ※ 効果は不安定。無視される場合もある
//}
//blankline

5. セクション間の空行

//listnum[chap11l010][歌唱可能な歌詞を書くコツの例]{
 セクションを空行で区切る
[Verse 1]
First verse lyrics
Continue first verse

[Chorus]
Chorus lyrics
Chorus continues

 詰めて書かない
[Verse 1]
First verse lyrics
[Chorus]
Chorus lyrics
//}
//blankline

=== CaptionとLyricsの一貫性チェックリスト

//table[chap11t012][CaptionとLyricsの一貫性チェックリストの一覧]{
チェック項目	Caption	Lyrics
------------
楽器	対応	インストゥルメンタルセクションタグ
感情	対応	エネルギータグ
ボーカル描写	対応	ボーカル制御タグ
//}
//blankline

//listnum[chap11l011][CaptionとLyricsの一貫性チェックリストの例]{
 矛盾の例
Caption: "violin solo, classical, intimate chamber music"
Lyrics:  [Guitar Solo - electric - distorted]
→ バイオリンと歪んだエレキギターは矛盾

 一貫した例
Caption: "violin solo, classical, intimate chamber music"
Lyrics:  [Violin Solo - expressive]
→ CaptionとLyricsが同じ世界観
//}
//blankline

=== 「AI臭い」歌詞を避けるチェックリスト

//table[chap11t013][「AI臭い」歌詞を避けるチェックリストの一覧]{
危険信号	説明
------------
形容詞の積み重ね	"neon skies, electric hearts, endless dreams" — イメージだけで具体性がない
韻の不一致	韻のパターンが不規則、強引な韻が意味を壊す
セクション境界の曖昧さ	Verseの内容がChorusに流れ込む
息継ぎの余地がない	各行が長すぎて一息で歌えない
メタファーの混在	1番が水のイメージ、2番が火、3番が飛行 — リスナーが混乱
//}
//blankline


== インストゥルメンタル曲の生成

=== 基本的な方法

歌詞フィールドに [Instrumental] のみを記入します。

//listnum[chap11l012][基本的な方法の例]{
# Caption
Lo-fi hip hop, chill beats, vinyl crackle, mellow piano,
warm bass, relaxing, study music, nostalgic

# Lyrics
[Instrumental]
//}
//blankline

追加でinstrumentalパラメータをtrueに設定するとさらに確実です。

=== 構造化されたインストゥルメンタル

歌詞フィールドにセクションタグのみを使って、インストゥルメンタルの展開を記述できます。

//listnum[chap11l013][構造化されたインストゥルメンタルの例]{
[Intro - ambient]

[Main Theme - piano]

[Build - strings joining]

[Climax - powerful, full orchestra]

[Outro - fade out]
//}
//blankline

=== ボーカルが混入する場合の対処法

インストゥルメンタル指定なのにボーカルが入る場合：

 1. 歌詞を完全に [Instrumental] のみにする（他のテキストを削除）
 2. Captionに "purely instrumental" や "no vocals" を追加
 3. instrumentalパラメータをtrueに設定
 4. シードを変更して再生成
 5. Easy Musicの「インストゥルメンタル」チェックボックスをONにする

//blankline

== ジャンル融合のテクニック

ACE-Step 1.5は1000以上の楽器とスタイルに対応しており、ジャンルの組み合わせが可能です。

=== 基本パターン

プライマリジャンル + セカンダリ影響

//listnum[chap11l014][基本パターンの例]{
jazz, electronic elements, smooth
→ ジャズベースにエレクトロニカの要素を加える

rock, symphonic arrangement, epic
→ ロックにシンフォニックなアレンジを重ねる
//}
//blankline

時代 + 現代ツイスト

//listnum[chap11l015][基本パターンの例]{
70s funk, modern production, groovy
→ 70年代ファンクを現代的なプロダクションで

80s synth pop, lo-fi aesthetic, nostalgic
→ 80年代シンセポップにLo-Fiの質感を加える
//}
//blankline

=== 自然な組み合わせの例

//table[chap11t014][自然な組み合わせの例の一覧]{
組み合わせ	Caption例
------------
ジャズ + エレクトロニカ	jazz, electronic beats, smooth, fusion, sophisticated
ロック + オーケストラ	rock, orchestral, epic, strings, powerful guitar, cinematic
ヒップホップ + ジャズ	hip-hop, jazzy samples, chill, boom bap, smooth bass
フォーク + エレクトロニカ	folktronica, acoustic guitar, electronic textures, intimate
ボサノバ + ジャズ	bossa nova, jazz harmonies, gentle guitar, warm, cafe
シティポップ + ファンク	city pop, funky bass, bright synth, groovy, 80s Japanese pop
//}
//blankline

=== 不自然な組み合わせ（避けるべき例）

//table[chap11t015][不自然な組み合わせ（避けるべき例）の一覧]{
組み合わせ	理由
------------
メタル + アンビエント	エネルギーの方向性が正反対
演歌 + EDM	テンポ感とボーカルスタイルが矛盾
パンク + ボサノバ	アグレッシブさとリラックスが矛盾
//}
//blankline


== プロンプトテンプレート集

以下に、すぐに使えるテンプレートを用途別に紹介します。

=== ポップソング（ボーカルあり）

//listnum[chap11l016][ポップソング（ボーカルあり）の例]{
Caption: pop, female vocal, catchy, upbeat, synth, bright, 120 BPM,
         polished production

Lyrics:
[Verse 1]
Walking through the city lights
Every step feels just right
Stars are dancing up above
Thinking of the ones I love

[Chorus]
We're alive tonight
Shining in the spotlight
No more holding back
Just feel the beat attack

[Verse 2]
Morning comes with golden rays
Brand new start for brand new days
//}
//blankline

=== J-POPバラード

//listnum[chap11l017][J-POPバラードの例]{
Caption: J-POP, piano ballad, emotional, female vocal, strings,
         intimate, slow tempo, polished

Lyrics:
[Intro]

[Verse 1]
窓際に映る 夕暮れの空
あなたがいた頃を 思い出している
何気ない日々が 宝物だった

[Chorus]
いつも そばにいて
この胸の痛みが 消えるまで
あなたの声が 聴こえる気がして

[Bridge - whispered]
もう一度だけ 会えたなら

[Outro]
//}
//blankline

=== シネマティック・インストゥルメンタル

//listnum[chap11l018][シネマティック・インストゥルメンタルの例]{
Caption: cinematic orchestral, epic, slow tempo, strings, brass,
         emotional, film score, dramatic

Lyrics:
[Intro - ambient]

[Main Theme - strings, building]

[Climax - full orchestra, powerful]

[Outro - fade out]
//}
//blankline

=== Lo-Fiチルビート

//listnum[chap11l019][Lo-Fiチルビートの例]{
Caption: lo-fi hip hop, chill beats, vinyl crackle, mellow piano,
         warm bass, relaxing, study music, nostalgic, tape saturation

Lyrics:
[Instrumental]
//}
//blankline

=== ロックトラック

//listnum[chap11l020][ロックトラックの例]{
Caption: rock, electric guitar, powerful drums, male vocal,
         energetic, 130 BPM, guitar-driven

Lyrics:
[Intro - guitar riff]

[Verse 1]
Standing on the edge of everything
Fire burning through my veins
No more waiting for the storm to pass

[Chorus - anthemic]
WE ARE THE THUNDER
Breaking through the night
Nothing's gonna stop us now

[Guitar Solo]

[Chorus - anthemic]
WE ARE THE THUNDER
Breaking through the night
//}
//blankline

=== EDM/トランス

//listnum[chap11l021][EDM/トランスの例]{
Caption: trance, purely instrumental, uplifting synth pads,
         euphoric build-ups and breakdowns, driving bassline,
         arpeggiated leads, 138 BPM, ethereal atmosphere,
         soaring melodies, no vocals

Lyrics:
[Intro - ambient pads]

[Build - arpeggiated synth]

[Drop - full energy]

[Breakdown - atmospheric]

[Build - rising tension]

[Drop - euphoric climax]

[Outro - fade out]
//}
//blankline

=== アコースティックポップ

//listnum[chap11l022][アコースティックポップの例]{
Caption: acoustic pop, warm fingerpicking acoustic guitar,
         gentle vocals, light percussion, simple and intimate
         arrangement, cafe atmosphere, singer-songwriter style

Lyrics:
[Verse 1]
Coffee steam and rainy days
You smiled at me in quiet ways
Nothing grand, just simple things
The kind of peace that silence brings

[Chorus]
Stay a while, stay a while
Let the world keep spinning
Stay a while, stay a while
This is just the beginning
//}
//blankline

=== 演歌

//listnum[chap11l023][演歌の例]{
Caption: Enka, traditional Japanese ballad, melancholic, vibrato,
         emotional, shamisen, koto, slow tempo

Lyrics:
[Intro]

[Verse 1]
北の街を 離れてから
もう何年 過ぎたことか
あの日 別れた 駅のホーム
涙こらえた あなたの顔

[Chorus - powerful belting]
帰りたい 帰りたい
あの日の あなたの元へ
//}
//blankline

=== シティポップ

//listnum[chap11l024][シティポップの例]{
Caption: city pop, 1980s Japanese pop, funky bass, bright synth,
         groovy, urban, polished production, AOR influence,
         summer night

Lyrics:
[Intro]

[Verse 1]
真夜中のハイウェイ 風が吹き抜ける
ラジオから流れる 懐かしいメロディ
ライトが煌めく 都会の夜景

[Chorus]
もう一度 あの夏を
二人で 駆け抜けよう
止まらない この気持ち
//}
//blankline


== 日本語歌詞のプロンプティング

=== 言語指定の重要性

日本語歌詞を使用する場合、必ずvocal_language: "ja" を指定してください。 指定しないと、日本語テキストが他の言語として解釈され、発音が崩れる可能性があります。

Easy Musicでは、ジャンルに「J-POP」や「演歌」などの日本語ジャンルを選択すると、自動的にvocal_language: "ja" が設定されます。

=== ローマ字化の内部処理

ACE-Step 1.5は、日本語歌詞を内部で自動的にローマ字に変換して処理します。この変換はDiTの推論前に行われ、ユーザーが意識する必要はありません。

ただし、以下の点に注意が必要です：

 * 漢字の読み: 一般的な漢字は正しく変換されますが、特殊な読み方（当て字等）は誤変換される可能性があります
 * ひらがな/カタカナ: 正確に変換されます
 * 混在テキスト: 日本語と英語が混在する歌詞も処理可能です

=== 日本語テーマから英語Captionへの変換

CaptionはACE-Step 1.5の訓練データに基づいて英語で記述するのが最も効果的です。日本語のテーマから英語Captionに変換するパターンを紹介します。

//table[chap11t016][日本語テーマから英語Captionへの変換の一覧]{
日本語テーマ	英語Caption
------------
「切ない恋の歌」	J-POP, emotional ballad, bittersweet love, female vocal, piano, strings
「夏のドライブ」	city pop, driving music, summer, bright, upbeat, male vocal
「夜のニューヨーク」	jazz, piano trio, late night, sophisticated, urban, atmospheric
「壮大なファンタジー」	cinematic orchestral, epic, dramatic, strings, brass, powerful
「かわいいアイドルソング」	J-POP idol, cute, energetic, female vocal, bright synth, catchy
//}
//blankline

=== 日本語特有のジャンル指定

//table[chap11t017][日本語特有のジャンル指定の一覧]{
ジャンル名	推奨Caption
------------
歌謡曲	1970s Japanese Kayokyoku, retro, nostalgic, analog, dramatic vocal, orchestral arrangement
演歌	Enka, traditional Japanese ballad, melancholic, vibrato, emotional, shamisen, koto
民謡	Japanese Min'yo folk song, traditional, regional, shakuhachi, taiko, pentatonic scale
ボカロ	Vocaloid, synthetic voice, electronic, fast tempo, digital, futuristic Japanese pop
アニソン	Anime song, dramatic, energetic, emotional, opening theme, Japanese anime soundtrack
ニューミュージック	Japanese New Music, singer-songwriter, poetic, mellow, 1970s-1980s acoustic pop
シティポップ	City pop, 1980s Japanese pop, funky bass, bright synth, groovy, urban, AOR influence
//}
//blankline

Easy Musicでは、これらのジャンルがタイルUIとして提供されており、ワンクリックで最適なCaptionが自動設定されます（全30ジャンル対応）。

=== 日本語歌詞の長さの目安

日本語は英語に比べて1文字あたりの情報量が多いため、英語より少ない文字数で適切な分量になります。

//table[chap11t018][日本語歌詞の長さの目安の一覧]{
楽曲時間	英語	日本語
------------
30秒	40〜70語	20〜40文字（歌詞本文）
60秒	120〜180語	60〜100文字（歌詞本文）
120秒	240〜360語	120〜200文字（歌詞本文）
//}
//blankline

※ セクションタグ（[Verse]等）は文字数に含みません

//blankline

== トラブルシューティング

=== ボーカルが大きすぎる/楽器が聴こえない

原因: Captionでボーカルが強調されすぎている、または楽器の指定が少ない

対処法:
 1. Captionに楽器タグを追加する: acoustic guitar, piano, soft strings, subtle drums
 2. "subtle vocal", "soft vocal", "background vocal" を使い、ボーカルの存在感を下げる
 3. [Instrumental] セクションを歌詞間に挟んでインストゥルメンタル区間を増やす

=== 歌詞が詰まる/早口になる

原因: 歌詞のテキスト量が楽曲時間に対して多すぎる

対処法:
 1. 歌詞の行数を減らす（1行4〜8語に収める）
 2. [Instrumental] セクションを追加して歌詞の密度を下げる
 3. audio_durationを長くして楽曲を伸ばす
 4. セクション間に空行を入れてブレスの余地を作る

=== スタイルが不明瞭/意図と違う

原因: タグが多すぎるか矛盾している

対処法:
 1. タグを3〜5個に絞る
 2. 矛盾するタグを排除する
 3. 一番重要なジャンルタグを最初に配置する
 4. Easy Musicの「AIキャプション生成」機能を使って最適化されたCaptionを生成する

=== インストなのにボーカルが入る

原因: instrumental設定の不完全、またはCaptionにボーカル指示がある

対処法:
 1. instrumentalパラメータをtrueに設定
 2. 歌詞フィールドを [Instrumental] のみにする
 3. Captionからvocal, singing等のボーカル関連タグを削除
 4. Captionに "purely instrumental, no vocals" を追加
 5. シードを変更して再生成

=== 無音が出力される

原因: モデルの推論が正常に完了していない可能性

対処法:
 1. seedを変更して再生成
 2. inference_stepsを増やす（Turbo: 8→20、Base/SFT: 50→80）
 3. プロンプトを簡素化する（タグを3個程度に減らす）
 4. guidance_scaleを調整する（3.0〜7.0の範囲で試す）
 5. DiTモデルを変更する（turbo → sft等）

=== 楽曲の途中で不自然に途切れる

原因: audio_durationが短すぎる、または歌詞と長さの不一致

対処法:
 1. audio_durationを長めに設定する（60→120秒等）
 2. audio_durationを -1（自動推定）に設定してLMに判断させる
 3. 歌詞量を楽曲時間に合わせて調整する

=== 同じシードなのに結果が異なる

原因: infer_method: SDEを使用している

対処法:

 * SDE方式は確率的なノイズ除去を行うため、同じシードでも結果が異なります
 * 再現性が必要な場合はinfer_method: ODEを使用してください

//blankline

== コラム: プロンプトの反復改善ワークフロー

プロの音楽生成では、プロンプトを一度で完成させることは稀です。以下の反復ワークフローを推奨します。

//listnum[chap11l025][コラム: プロンプトの反復改善ワークフローの例]{
Step 1: 大まかなイメージをCaptionに （3タグ程度）
  ↓ 生成して聴いてみる
Step 2: 足りない要素をタグとして追加 （5〜7タグに）
  ↓ 再生成
Step 3: 楽器バランスやムードを微調整
  ↓ 再生成（同じシードで比較）
Step 4: 歌詞の量やセクション構造を調整
  ↓ 再生成
Step 5: シードを複数試して最良のものを選択
  ↓ 完成
//}
//blankline

ポイント: 一度に1つの要素だけを変更し、同じシード（ODE方式）で比較することで、各変更の効果を正確に把握できます。

//blankline
