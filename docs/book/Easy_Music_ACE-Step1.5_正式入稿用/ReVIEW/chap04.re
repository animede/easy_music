= 完全ユーザーズマニュアル

本章では、Easy Musicの全画面要素・全設定項目を網羅的に解説します。各機能の詳細仕様、操作方法、制約事項を体系的にまとめたリファレンスマニュアルです。

//blankline

== 画面構成

Easy Musicの画面は、上から順に以下の要素で構成されています。

 * ヘッダー
 * モード切替: カバー/リペイント/自動演奏
 * 言語切替: JA ⇔ EN
 * ジャンルグリッド
 * 30個のジャンルタイル
 * ジャンルミックス（セカンダリジャンル選択）
 * おまかせ生成セクション
 * テキスト入力欄
 *  ランダムボタン
 * コントロールバー
 * 長さ/言語/曲数/モデル/楽器のみ
 *  詳細設定（アコーディオン）
 * STEP / Shift / Sampler /キャプション自動
 * Thinking
 *  作詞設定（アコーディオン）
 * ムードチップ（10種） /ボーカルチップ（6種）
 * テーマ入力/歌詞入力/キャプション入力
 * ネガティブプロンプト
 *  音楽を生成ボタン
 * プログレスバー/ステータスメッセージ
 * インラインプレーヤー
 * トラック切替/シークバー/音量
 * ビジュアライザーオーバーレイ
 * 音楽生成情報パネル
 * 詳細設定内のボタンから表示
 * 生成履歴
 * 折りたたみ表示

=== モード別表示切替

通常モード、カバーモード、リペイントモード、JUKEBOXモードで表示される要素が異なります。

//table[chap04t001][モード別表示切替の一覧]{
要素	通常	カバー	リペイント	JUKEBOX
------------
ジャンルグリッド	表示	非表示	非表示	表示（複数選択）
おまかせ生成	表示	非表示	非表示	非表示
コントロールバー	表示	一部	一部	非表示
作詞設定	表示	歌詞のみ	歌詞のみ	非表示
カバーパネル	非表示	表示	非表示	非表示
リペイントパネル	非表示	非表示	表示	非表示
JUKEBOXコントロール	非表示	非表示	非表示	表示
//}
//blankline


== ジャンル選択（30ジャンル詳解）

//image[genregrid][ジャンル選択画面]
//blankline

図4-1　ジャンル選択画面。30ジャンルタイル、選択状態、ジャンルミックスを示します。

ジャンルグリッドには30個のタイルが配置されています。各タイルには キャプションヒント（data-caption-hint）が埋め込まれており、選択時にこのヒントがキャプション生成の基礎となります。

=== 洋楽メジャー（8ジャンル）

//table[chap04t002][洋楽メジャー（8ジャンル）の一覧]{
ジャンル	キャプションヒント	特徴
------------
J-POP	J-POP, Japanese pop, catchy melody, bright, emotional vocal, polished production	日本のポップス。キャッチーなメロディと感情的なボーカル
Rock	Rock, guitar-driven, energetic, powerful	ギター主体のロック
Jazz	Jazz, smooth, improvisational, sophisticated	スムースジャズ、即興的
Electronic	Electronic, synth, dance, digital	シンセサイザー主体の電子音楽
R&B	R&B, soulful, smooth, groove	ソウルフルなリズム＆ブルース
Hip-Hop	Hip-Hop, rhythmic, rap, beats	ラップ、ビート重視
Country	Country music, acoustic guitar, banjo, fiddle, steel guitar, warm storytelling vocals, heartfelt and honest, Nashville sound	カントリーミュージック。アコースティックギター、バンジョー、フィドル
Folk	Folk, acoustic, warm, storytelling	フォーク。アコースティック、ストーリーテリング
//}
//blankline

=== 年代系（4ジャンル）

//table[chap04t003][年代系（4ジャンル）の一覧]{
ジャンル	キャプションヒント	特徴
------------
70年代歌謡曲	1970s Japanese Kayokyoku, retro, nostalgic, analog, dramatic vocal, orchestral arrangement	レトロ、オーケストラアレンジ
80年代フォーク	1980s Japanese folk pop, acoustic guitar, warm analog recording, singer-songwriter, poetic, nostalgic	シンガーソングライター、詩的
90年代J-POP	1990s J-POP, bright, emotional, catchy melody, band sound, Japanese pop golden era	J-POP黄金期、バンドサウンド
ニューミュージック	Japanese New Music, singer-songwriter, poetic, mellow, 1970s-1980s acoustic pop	1970〜80年代のアコースティックポップ
//}
//blankline

=== 日本特化（5ジャンル）

//table[chap04t004][日本特化（5ジャンル）の一覧]{
ジャンル	キャプションヒント	特徴
------------
ボカロ	Vocaloid, synthetic voice, electronic, fast tempo, digital, futuristic Japanese pop	シンセティックな声、高速テンポ
アニソン	Anime song, dramatic, energetic, emotional, opening theme, Japanese anime soundtrack	ドラマティック、アニメOP風
童謡	Japanese children's song, gentle, simple, warm, nursery rhyme, innocent, acoustic	優しく温かい子供向けの歌
演歌	Enka, traditional Japanese ballad, melancholic, vibrato, emotional, shamisen, koto	こぶし、三味線、琴
民謡	Japanese Min'yo folk song, traditional, regional, shakuhachi, taiko, pentatonic scale	尺八、太鼓、ペンタトニック
//}
//blankline

=== ムード系（7ジャンル）

//table[chap04t005][ムード系（7ジャンル）の一覧]{
ジャンル	キャプションヒント	インスト固定
------------
Trance	Trance, purely instrumental, uplifting synth pads, euphoric build-ups and breakdowns, driving bassline, arpeggiated leads, 138 BPM, ethereal atmosphere, soaring melodies, no vocals	あり
ムード	Mood lounge music, purely instrumental, smooth jazz with mellow saxophone, warm electric piano chords, subtle brushed drums and walking bass, romantic and sophisticated, late night ambiance, medium slow tempo, polished production, no vocals	あり
ドライビング	Refreshing driving music, purely instrumental, bright acoustic guitar and clean electric guitar, light upbeat drums, moderate tempo around 110 BPM, warm bass, breezy and uplifting, coastal highway sunshine, open windows breeze, no vocals	あり
Acoustic Pop	Acoustic pop, warm fingerpicking acoustic guitar, gentle vocals, light percussion, simple and intimate arrangement, cafe atmosphere, singer-songwriter style	なし
ボサノバ	Bossa nova, Brazilian jazz, gentle acoustic guitar, soft percussion, warm, relaxed, cafe, sophisticated rhythm	なし
Lo-Fi	Lo-fi hip hop, chill beats, vinyl crackle, mellow piano, warm bass, relaxing, study music, nostalgic, tape saturation	なし
シティポップ	City pop, 1980s Japanese pop, funky bass, bright synth, groovy, urban, polished production, AOR influence, summer night	なし
//}
//blankline

=== ワールド・ダンス（6ジャンル）

//table[chap04t006][ワールド・ダンス（6ジャンル）の一覧]{
ジャンル	キャプションヒント	インスト固定
------------
シャンソン	French chanson, romantic, accordion musette, gentle acoustic guitar, expressive vocal with vibrato, Parisian cafe atmosphere, poetic lyrics, waltz rhythm, nostalgic European charm	なし
フォルクローレ	South American folklore, purely instrumental, Andean folk music, charango and quena flute melody, bombo drum and cajón percussion, warm acoustic guitar arpeggios, pentatonic scale, earthy and spiritual atmosphere, indigenous rhythm, no vocals	あり
レゲトン	Reggaeton, Latin urban dance, dembow rhythm, heavy 808 bass, snappy snare, reggaeton beat pattern, Spanish vocal style, party atmosphere, catchy hook, tropical club energy	なし
K-POP	K-POP, Korean pop, polished production, catchy hook, tight choreography beat, synth layers, powerful vocal, rap verse, dynamic arrangement, bright and energetic, modern dance pop	なし
Phonk	Phonk, Memphis rap influenced, dark cowbell pattern, distorted 808 bass, aggressive hi-hats, chopped vocal samples, drift car culture, hard-hitting drums, lo-fi gritty texture, high energy	なし
EDM	EDM, electronic dance music, massive synth drop, four-on-the-floor kick, sidechain compression, build-up and breakdown, festival anthem, euphoric lead synth, heavy sub bass, high energy crowd atmosphere	なし
//}
//blankline

 インスト固定ジャンル: Trance、ムード、ドライビング、フォルクローレの4ジャンルはdata-force-inst="true" が設定されており、選択時に「楽器のみ」チェックが自動的にONになります。

//blankline

== ジャンルミックス

プライマリジャンルを選択した後、「ミックス：」ドロップダウンでセカンダリジャンルを追加できます。

=== 仕組み

 1. プライマリジャンルのキャプションヒントを取得
 2. セカンダリジャンルのキャプションヒントを取得
 3. 2つのヒントを結合してキャプション生成の入力とする

=== 効果的な組み合わせ例

//table[chap04t007][効果的な組み合わせ例の一覧]{
プライマリ	セカンダリ	期待される効果
------------
J-POP	Jazz	ジャジーなJ-POP
Rock	Electronic	エレクトロニックロック
演歌	Rock	ロック演歌
Lo-Fi	Jazz	ジャズ寄りのLo-Fi
アニソン	EDM	EDMテイストのアニメソング
//}
//blankline

 ジャンルミックスは実験的な機能です。まったく異なるジャンルの組み合わせ（例: 民謡 + EDM）は予測不能な結果になることがあります。

//blankline

== コントロール設定詳解

=== 長さ（Duration）

//table[chap04t008][長さ（Duration）の一覧]{
選択肢	値	説明
------------
自動（AI推定）	-1	ACE-StepのLMが楽曲に適した長さを推定
30秒	30	ショートクリップ
45秒	45	ショートバージョン
60秒	60	デフォルト。標準的な長さ
90秒	90	やや長め
120秒	120	フルコーラス程度
180秒	180	長めの楽曲
240秒	240	長尺曲
300秒	300	最大長（5分）
//}
//blankline

 長い楽曲ほど生成時間も比例して増加します。プロトタイプ段階では60秒がおすすめです。

=== 言語（Language）

ボーカルの言語を指定します。選択可能な言語:

//table[chap04t009][言語（Language）の一覧]{
言語	コード	説明
------------
日本語	ja	デフォルト
英語	en	—
中国語	zh	—
韓国語	ko	—
スペイン語	es	—
フランス語	fr	—
ドイツ語	de	—
イタリア語	it	—
ポルトガル語	pt	—
ロシア語	ru	—
タイ語	th	—
ベトナム語	vi	—
インドネシア語	id	—
//}
//blankline

=== 曲数（Batch Size）

//table[chap04t010][曲数（Batch Size）の一覧]{
選択肢	説明
------------
1曲	デフォルト。1曲のみ生成
2曲	同じパラメータで2曲同時生成（異なるseed）
4曲	同じパラメータで4曲同時生成（異なるseed）
//}
//blankline

バッチ生成で何曲まで同時生成できるかは、Easy Music側ではなくACE-Stepサーバー側のVRAM容量 に左右されます。特にXL系や長尺設定では消費VRAMが増えやすいため、最初は1曲で動作確認し、その後に2曲、4曲へ段階的に増やす のが安全です。

=== モデル

//table[chap04t011][モデルの一覧]{
選択肢	説明
------------
Turbo / XL Turbo (高速)	蒸留系モデル。8ステップ前後で高速に生成。案出し向き
SFT / XL SFT (高品質)	指示遵守が強く、最終仕上げ向き。50ステップ前後推奨
Base / XL Base (標準)	多様性が高く、拡張用途にも向く。50ステップ以上推奨
//}
//blankline

Easy Musicのモデル欄は固定の2択ではなく、ACE-Stepサーバーの/v1/modelsを問い合わせて動的に構築 されます。つまり、サーバー側でXLモデルをロードしていれば、フロント側のプルダウンにも自動的に現れます。

表示ラベルはモデル名から自動変換されます。

//table[chap04t012][モデルの一覧]{
モデル名に含まれる文字列	表示例
------------
xl-turbo	XL TURBO (高速)
xl-sft	XL SFT (高品質)
xl-base	XL Base (標準)
turbo	TURBO (高速)
sft	SFT (高品質)
base	Base (標準)
//}
//blankline

=== 楽器のみ（Instrumental）

チェックをONにすると、ボーカルなしのインストゥルメンタル楽曲が生成されます。インスト固定ジャンル（Trance/ムード/ドライビング/フォルクローレ）選択時は自動的にONになります。

//blankline

== 詳細設定（Advanced Settings）

//image[advancedsettings][詳細設定]
//blankline

図4-2　詳細設定。Steps、CFG、Sampler、Seed、キャプション自動などの設定欄を示します。

「詳細設定」アコーディオンを展開すると表示されます。

この中には「音楽生成情報」ボタンもあり、押すと音楽生成情報パネルが表示されます。現在はキャプション欄自体は「作詞設定」の中にも常時表示されており、ここで編集した内容は音楽生成情報パネル側のキャプション欄と同期されます。音楽生成情報ではタグ、言語、パラメータなどの詳細確認ができます。

=== STEP（推論ステップ数）

//table[chap04t013][STEP（推論ステップ数）の一覧]{
値	説明	用途
------------
8	Turbo推奨値。高速プロトタイプ	Turboモデルのデフォルト
20	高速だが8より高品質	バランス
50	標準。Baseモデル推奨値	仕上げ段階
80	高品質	高品質な作品
100	最高品質。生成に数分	最終出力
//}
//blankline

モデル切替時の自動初期値は次の通りです。

//table[chap04t014][STEP（推論ステップ数）の一覧]{
モデル種別	自動設定
------------
Turbo / XL Turbo	8
SFT / XL SFT	50
Base / XL Base	50
//}
//blankline

=== Shift（タイムステップシフト）

//table[chap04t015][Shift（タイムステップシフト）の一覧]{
値	説明
------------
自動	モデルに最適値を任せる（推奨）
1.0	ディテール重視。音色やニュアンスに注力
2.0	バランス型
3.0	Turbo推奨
4.0	構造重視
5.0	最大。楽曲全体の構成に注力
//}
//blankline

ツールリップ:「タイムステップシフト。低い値=音質・ディテール重視、高い値=楽曲構造・プロンプト忠実度重視」

XL SFTで仕上げる場合は、細部重視なら1.0〜2.0、構成重視なら3.0〜4.0を起点にすると追い込みやすくなります。

=== Sampler（サンプリング方式）

//table[chap04t016][Sampler（サンプリング方式）の一覧]{
方式	説明
------------
自動 (ODE)	常微分方程式ベース。安定・再現性が高い（デフォルト）
ODE	安定・クリーン
SDE	確率微分方程式ベース。有機的・多様な質感。高ステップ推奨
//}
//blankline

特にXL SFT / XL Baseでは生成コストが高いため、まずはODEで再現性を確保し、最後に必要ならSDEを試す 手順が安全です。

=== キャプション自動

//table[chap04t017][キャプション自動の一覧]{
状態	動作
------------
ON	ACE-StepのLMによるキャプション強化を使用（推奨）
OFF	Easy MusicのLLMが生成したキャプションをそのまま使用
//}
//blankline

=== Thinking

//table[chap04t018][Thinkingの一覧]{
状態	動作
------------
ON	LLMがChain-of-Thought推論で簡潔な1文キャプションを生成
OFF	LLMが3〜5文の詳細なキャプションを直接生成
//}
//blankline

=== モデル依存の自動調整

Easy Musicはモデル名に応じて、STEP・CFG・曲数制限を自動で調整します。

//table[chap04t019][モデル依存の自動調整の一覧]{
項目	Turbo 系	SFT / Base 系
------------
STEP	8	50
guidance_scale	3.0	7.0
曲数（Batch）	1 / 2 / 4	SFT系は最大2
//}
//blankline

ここでのguidance_scaleは、Easy Music側でモデル別に固定の自動値として扱われます。特にTurbo / XL TurboはCFGが3.0に固定 されるため、通常画面からCFGだけを個別に動かしてプロンプト忠実度を追い込む運用はできません。Turbo系で方向性を調整したい場合は、まず テーマ/歌詞/キャプション/ Shift / Stepsを見直します。

とくにSFT系はVRAM消費が大きく、バックエンドでもbatch_size=2にクランプ されます。これはUIを直接バイパスしてAPIを叩いた場合でも有効です。

//blankline

== 作詞設定（Normal Mode）

//image[lyricssettings][作詞設定]
//blankline

図4-3　作詞設定。テーマ、歌詞、キャプション欄、ムード、ボーカル指定を示します。

「作詞設定」アコーディオンを展開すると表示されます。

ここには、通常生成で入力によく使う入力がまとまっています。テーマ/歌詞/キャプション はこの中で直接編集でき、キャプション欄の内容は音楽生成情報パネルのキャプション欄とも同期されます。

=== ムードチップ（10種）

ムードは楽曲の雰囲気を決定します。選択するとキャプション生成時に反映されます。

//table[chap04t020][ムードチップ（10種）の一覧]{
チップ	コード値	説明
------------
明るい	bright and happy	ポジティブ、明るい雰囲気
切ない	bittersweet and sad	切なさ、哀愁
激しい	intense and powerful	力強い、エネルギッシュ
穏やか	calm and gentle	穏やか、リラックス
神秘的	mysterious and fantastical	幻想的、ミステリアス
ロマンチック	romantic and tender	ロマンティック、優しい
楽しい	playful and fun	楽しい、陽気
メランコリック	melancholic and dark	メランコリック、暗い
壮大	epic and grand	壮大、グランド
クール	cool and stylish	クール、スタイリッシュ
//}
//blankline

=== ボーカルチップ（6種）

ボーカルスタイルを指定します。キャプションに声の特徴が追加されます。

//table[chap04t021][ボーカルチップ（6種）の一覧]{
チップ	コード値	説明
------------
女性	female vocal	女性ボーカル
男性	male vocal	男性ボーカル
力強い	powerful vocal	パワフルなボーカル
ウィスパー	breathy whisper vocal	ささやくような声
ファルセット	falsetto vocal	裏声
ハーモニー	vocal harmonies	コーラス、ハーモニー
//}
//blankline

 ムードとボーカルは同時に選択できます。例えば「神秘的」+「女性」で「神秘的な雰囲気の女性ボーカル曲」が生成されます。

=== テーマ入力

テーマ欄にはAIに作曲の方向性を指示するテキストを入力します。

 * 空欄: LLMがジャンルに合ったテーマを自動生成します
 * 入力あり: 入力されたテーマに基づいて歌詞が生成されます
 * プレースホルダー例: 「夜空を見上げて願いを込める魔法少女の物語」

=== 歌詞入力

歌詞欄にはセクションタグ付きの歌詞テキストを入力します。

 * 空欄: テーマからAIが自動で作詞します
 * 入力あり: 入力された歌詞がそのまま使用されます

対応セクションタグ:

//listnum[chap04l001][歌詞入力の例]{
[verse]    — Aメロ・Bメロ
[chorus]   — サビ
[bridge]   — ブリッジ、大サビ
[intro]    — イントロ
[outro]    — アウトロ
[pre-chorus] — プレコーラス
[interlude]  — 間奏
//}
//blankline

=== 歌詞再生成ボタン（再生成）

歌詞入力欄の横にある再生成ボタンをクリックすると、現在のテーマとジャンル設定に基づいて歌詞をLLMで再生成します。

=== キャプション入力

キャプション欄には、ACE-Stepに渡す音楽記述文を入力します。

 * 空欄: Easy Musicがテーマ・歌詞・ジャンルをもとに自動生成します
 * 入力あり: 入力されたキャプションを優先して次回生成に使用します
 * 常時表示: 作詞設定内に常時表示されており、普段はこちらで編集するのが分かりやすい構成です

=== キャプション再生成ボタン（再生成）

キャプション欄の横にある再生成ボタンをクリックすると、現在のテーマ・歌詞・ジャンルに基づいてキャプションをLLMで再生成します。

この欄の内容は、音楽生成情報 パネルのキャプション欄とも同期されています。つまり、作詞設定でキャプションを編集すると音楽生成情報側にも反映され、逆に音楽生成情報側で編集した内容も作詞設定に戻るようになっています。

=== ネガティブプロンプト

生成時に避けたい要素を指定します。

 * 空欄時のデフォルト値: low quality, noisy, distorted, muddy, clipping, off-key, out of tune, amateur, poorly mixed
 * カスタム入力: 避けたい楽器やスタイルを自由に記述

//blankline

== おまかせ生成

「おまかせ生成」セクションは、自然言語で1行のリクエストを入力するだけで全パラメータを自動決定する機能です。

=== 動作の仕組み

 1. 入力テキストをACE-Stepの/format_input APIに送信
 2. ACE-Step内蔵のLM（Qwen3-Embedding等）がジャンル・BPM・Key・歌詞・キャプションをすべて推定
 3. 推定結果に基づいて音楽を生成

 おまかせ生成ではEasy Music側のLLM（Ollama等）は使用されません。ACE-Stepの内蔵LMが直接処理します。

=== ランダムボタン

ACE-Stepの/createrandomsample APIからランダムなパラメータセットを取得し、UIに自動入力します。取得されるパラメータには、ジャンル、BPM、Key、歌詞、キャプションが含まれます。

言語ドロップダウンで選択中の言語は保持されます。

//blankline

== カバーモード

//image[covermode][カバーモード]
//blankline

図4-4　カバーモード。音源アップロード、変換先キャプション、強度設定を示します。

ヘッダーの「カバー」ボタンをクリックするとカバーモードに切り替わります。

=== カバーパネルの構成

//table[chap04t022][カバーパネルの構成の一覧]{
要素	説明
------------
アップロードエリア	音声ファイルのドラッグ＆ドロップまたはクリック選択。accept="audio/*"
ファイル情報表示	ファイル名とクリアボタン
カバー強度スライダー	0.00〜1.00。デフォルト: 0.80
キャプション入力	変換後のスタイル指定（例: jazz, acoustic, lo-fi）
歌詞入力（折りたたみ）	任意。新しい歌詞を入力可能
//}
//blankline

=== カバー強度の詳細

//table[chap04t023][カバー強度の詳細の一覧]{
範囲	効果
------------
0.00〜0.20	原曲のほぼそのまま。テスト用
0.20〜0.50	軽微な変化。原曲の骨格が明確に残る
0.50〜0.70	中程度の変換。メロディの輪郭は残るがアレンジが変化
0.70〜0.90	大幅な変換。ジャンル転換に最適
0.90〜1.00	完全に新しい解釈。原曲との関連が薄い
//}
//blankline

 カバーモードではguidancescaleが自動的に1.0以上に補正されます。ACE-Step 1.5でカバー生成時に低いguidancescaleは品質低下の原因となるためです。

//blankline

== リペイントモード

//image[repaintmode][リペイントモード]
//blankline

図4-5　リペイントモード。範囲指定、再生成スタイル、実行ボタンを示します。

ヘッダーの「リペイント」ボタンをクリックするとリペイントモードに切り替わります。

=== リペイントパネルの構成

//table[chap04t024][リペイントパネルの構成の一覧]{
要素	説明
------------
アップロードエリア	音声ファイルのドラッグ＆ドロップまたはクリック選択
再生成区間（秒）	開始秒と終了秒を数値入力。step=0.1で0.1秒単位
キャプション入力	再生成部分のスタイル指定（任意）
歌詞入力（折りたたみ）	再生成部分の歌詞（任意）
//}
//blankline

=== 再生成区間の仕様

 * 開始秒（Repainting Start）: 再生成を開始する位置（秒）
 * 終了秒（Repainting End）: 再生成を終了する位置（秒）
 * バリデーション: 終了秒 > 開始秒 でなければエラー
 * 指定区間外の音声はそのまま保持されます

//blankline

== JUKEBOXモード

//image[jukeboxmode][JUKEBOXモード]
//blankline

図4-6　JUKEBOXモード。連続生成、キュー、再生状態を示します。

ヘッダーの「自動演奏」ボタンをクリックするとJUKEBOXモードに切り替わります。

=== JUKEBOX専用UI

//table[chap04t025][JUKEBOX専用UIの一覧]{
要素	説明
------------
ジャンルグリッド（複数選択）	タイルを複数タップして選択。選択されたジャンルは青くハイライト
選択カテゴリバッジ	選択中のジャンルをバッジで表示
Now Playing表示	現在再生中の曲の情報を表示
スタート /  ストップ	自動生成ループの開始/停止
シークバー / 音量	JUKEBOX専用のプレーヤーコントロール
//}
//blankline

=== 動作フロー

//listnum[chap04l002][動作フローの例]{
1. 選択ジャンルからランダムに1つを選出
2. テーマ自動生成（/api/theme）
3. 歌詞生成（/api/lyrics）
4. キャプション生成（/api/caption）
5. 音楽生成（/api/generate, guidance_scale=18.0）
6. 再生開始
7. 再生中に次の曲をプリフェッチ（バックグラウンドで生成開始）
8. 現在の曲が終了 → プリフェッチ済みの次の曲をシームレスに再生
9. → ステップ1に戻る（無限ループ）
//}
//blankline

=== 停止動作

 *  ストップ: 現在再生中の曲が終わった時点で停止
 * 「現在の曲の再生後に停止します...」というメッセージが表示されます

=== 自動リトライ

 * 生成失敗時は自動でリトライ（最大3回）
 * 3回連続失敗で「生成に3回失敗しました。JUKEBOXを停止します。」と表示して停止

//blankline

== インラインプレーヤーとビジュアライザー

//image[player][生成結果プレーヤー]
//blankline

図4-7　生成結果プレーヤー。再生、ビジュアライザー、履歴への導線を示します。

=== インラインプレーヤー

楽曲生成完了後に表示されるプレーヤーコントロールです。実際の動作では、生成完了時にいったんフルスクリーンビジュアライザーが自動表示され、これを閉じるとインラインプレーヤーに戻って各種操作ができるようになります。通常生成・カバー・リペイントで表示されるプレーヤーは共通で、再生/一時停止、シーク、音量、ダウンロードなどを操作できます。フルスクリーン表示を開きたい場合は、プレーヤーの背景部分をクリック/タップします。

//table[chap04t026][インラインプレーヤーの一覧]{
要素	説明
------------
前 / 次トラック切替	バッチ生成時に複数トラックを切り替え
再生 / 一時停止ボタン	楽曲の再生と一時停止を切り替え
シークバー	クリックまたはドラッグで再生位置を変更
時間表示	現在再生位置 / 総時間
音量スライダー	音量調整
ダウンロードボタン	楽曲をMP3形式でダウンロード
//}
//blankline

=== フルスクリーンビジュアライザー

生成完了直後には、フルスクリーンのビジュアライザーオーバーレイが自動で表示されます。閉じた後も、プレーヤーの背景部分をタップすると再びフルスクリーン表示に切り替えられます。再生/一時停止ボタンやシークバーなどの操作は、そのままインラインプレーヤー内で行われます。

=== 10個のビジュアルモード

//table[chap04t027][10個のビジュアルモードの一覧]{
モード	説明	技術
------------
Spectrum	FFTデータのバー表示。周波数スペクトルを視覚化	AnalyserNode + getByteFrequencyData
Wave	波形データのカーブ表示。リアルタイム波形	AnalyserNode + getByteTimeDomainData
Ring	円環パターンのスペクトル。円状に配置されたバー	極座標変換 + FFTデータ
Particles	音声駆動パーティクルシステム。音に反応する粒子	パーティクル生成 + 物理シミュレーション
Pulse	音量連動パルスエフェクト。ビートに合わせて脈動	RMS計算 + スケーリング
Aurora	音量に連動するオーロラ状の帯表現	グラデーション + 波形変調
Fireworks	音のピークに合わせた花火状の発光表現	パーティクルバースト
Matrix	デジタルグリッチ風の落下パターン	文字列/ライン描画 + 音量変調
Orbit	複数の光点が軌道運動する円形表現	軌道計算 + Canvas 2D
Fire	低域や音量に反応する炎状パーティクル	パーティクル生成 + 加算合成
//}
//blankline

=== ビジュアライザーの技術基盤

 * Web Audio API: AudioContext + AnalyserNode
 * Canvas 2D: requestAnimationFrameによるリアルタイムレンダリング
 * 背景画像: 生成背景画像があればそれを表示し、未生成時はジャンルサムネイルを背景として表示する
 * 歌詞のリアルタイム表示: 生成時に使用された歌詞をオーバーレイ表示

画面タップでビジュアルモードが切り替わり、もう一度タップするとオーバーレイを閉じます。

//blankline

== 生成履歴

「履歴」 セクション（折りたたみ式）に、直近の生成結果が保持されます。

//table[chap04t028][生成履歴の一覧]{
項目	説明
------------
保持件数	直近10件
保存先	sessionStorage（ブラウザタブを閉じるとクリア）
表示内容	ジャンル名、経過時間、再生ボタン、ダウンロードボタン
経過時間表示	〜秒前 / 〜分前 / 〜時間前 / 〜日前
生成中表示	「生成中...」ステータスを表示
//}
//blankline


== 音楽生成情報

//image[musicinfo][音楽生成情報]
//blankline

図4-8　音楽生成情報。タグ、キャプション、言語、パラメータ、再生成ボタンを示します。

「詳細設定」を開き、その中の「音楽生成情報」ボタンを押すと、最後の生成で使用されたパラメータの詳細が確認できます。

現在のUIでは、キャプション欄そのものは「作詞設定」にも常時表示されています。音楽生成情報は、キャプション編集専用というより、タグ、言語、各種パラメータを含めて最終入力を確認するための詳細ビューと考えると分かりやすいです。

//table[chap04t029][音楽生成情報の一覧]{
表示項目	説明
------------
ジャンル	選択されたジャンル名
テーマ	使用されたテーマテキスト
モード	使用されたモード（キャプション自動/外部LLM/手動等）
タグ (raw)	LLMが生成したタグ情報（JSON）
キャプション	最終的にACE-Stepに送信されたキャプション（編集可能）
言語	使用された言語コード
パラメータ	全パラメータのJSON表示
//}
//blankline

=== キャプションの手動編集

キャプション欄は「作詞設定」と「音楽生成情報」の両方にあり、どちらで編集しても同じ内容が同期されます。編集した内容は次回の生成時に反映されます。

これにより、AIが生成したキャプションを微調整して再生成する、というワークフローが実現できます。

 再生成ボタン: 作詞設定内または音楽生成情報内の再生成ボタンで、現在のテーマ・歌詞・ジャンルに基づいてキャプションをLLMで再生成できます。

//blankline

== モード排他制御

Easy Musicの4つのモード（通常/カバー/リペイント/ JUKEBOX）は相互排他です。

//table[chap04t030][モード排他制御の一覧]{
操作	結果
------------
カバーON → リペイントON	カバーが自動OFF
リペイントON → JUKEBOX ON	リペイントが自動OFF
JUKEBOX実行中 → カバーON	JUKEBOX停止 → カバーON
カバーON → カバーOFF	通常モードに戻る
//}
//blankline

通常モードに戻すには、アクティブなモードのボタンをもう一度クリックしてOFFにします。

//blankline

