= ACE-Step 1.5とは何か

「Imagine a world where anyone can create professional-quality music — in seconds, on consumer hardware, with full creative control.」
— ACE-Step 1.5 Project Page

//blankline

== 概要 — オープンソース音楽生成の到達点

2026年1月、音楽制作ソフトウェア「ACE Studio」を開発するACE Studioと、大規模AIモデルの研究開発を行うStepFunが共同で、ある論文をarXivに投稿しました。タイトルは「ACE-Step 1.5: Pushing the Boundaries of Open-Source Music Generation」。これは、オープンソースの音楽生成AIが初めて商用サービスの品質に匹敵したことを示す、画期的な成果でした。

ACE-Step 1.5は、テキストプロンプトから高品質な楽曲を生成する音楽基盤モデル（Music Foundation Model）です。その最大の特徴は、以下の3つのミッションを同時に達成していることにあります。

 1. 商用グレードの品質: 主観的な品質評価（Music Arena）において、商用サービスSuno v4.5とSuno v5の間にランクイン。オープンソースモデルとして初めてこの水準に到達しました。
 2. 消費者向けハードウェアでの動作: 4GB未満のVRAMで動作可能。NVIDIA RTX 3090では10秒以内でフル楽曲を生成できます。
 3. 完全なオープンソース: MITライセンスで公開されており、商用利用を含むあらゆる用途に自由に利用できます。

これまで、音楽生成AIの世界は商用サービスが圧倒的な品質を誇り、オープンソースモデルとの間には大きな品質ギャップが存在していました。ACE-Step 1.5は、このギャップを一気に縮めた画期的なモデルなのです。

//blankline

== ACE-Step 1.0からの進化

ACE-Step 1.5を理解するためには、前バージョンであるACE-Step 1.0（2025年6月公開）の課題を知ることが重要です。

=== ACE-Step 1.0の3つの課題

//table[chap06t001][ACE-Step 1.0の3つの課題の一覧]{
課題	技術的原因	ユーザーへの影響
------------
音質の限界	2Dメルスペクトログラム表現による位相情報の損失	楽曲がこもった音に聞こえる、高周波のトランジェント（打楽器のアタック音など）が不鮮明
セマンティック一貫性の不足	DiT（拡散トランスフォーマー）が楽曲構造の高次な計画もノイズ除去も両方担当していたため、意味的な理解が不十分	プロンプトの指示通りの楽曲構造にならない、サビの繰り返しが不自然
編集機能の欠如	テキストから音楽を生成する一方向のみ	既存楽曲のカバー、部分的な修正ができない
//}
//blankline

=== ACE-Step 1.5の解決策

ACE-Step 1.5は、アーキテクチャを根本から再設計することで、これらすべての課題を解決しています。

//table[chap06t002][ACE-Step 1.5の解決策の一覧]{
v1.0の課題	v1.5の解決策	効果
------------
メルスペクトログラムの位相損失	純粋な波形ドメイン1D VAEの採用	48kHzステレオ音声を1920倍に圧縮しながら、ほぼ無損失の知覚品質を達成
セマンティック一貫性の不足	ハイブリッド推論-拡散アーキテクチャ（LM + DiT の分離）	言語モデルが楽曲の構造・意味を計画し、DiTは忠実な音響レンダリングに専念
編集機能の欠如	Omni-Task マスク生成フレームワーク	カバー、リペイント、コンプリーションなどの複数の生成モードを統一的に実現
//}
//blankline

この再設計の結果、ACE-Step 1.5は単なる「次のバージョン」ではなく、事実上の完全な作り直しと呼べるほどの進化を遂げています。

//blankline

== 性能のハイライト

ACE-Step 1.5の性能を一覧で確認しましょう。

=== 速度

//table[chap06t003][速度の一覧]{
環境	生成時間（4分の楽曲）	備考
------------
NVIDIA A100	約2秒	Turboモデル（8ステップ）使用時
NVIDIA RTX 3090	10秒以内	消費者向けGPU
Apple Silicon (MPS)	数十秒	macOS対応
CPU	数分	GPU非搭載環境でも動作
//}
//blankline

従来の音楽生成モデルと比較して10〜120倍 の高速化を達成しています。特に、蒸留（Adversarial Dynamic-Shift Distillation）により、50ステップの推論プロセスを8ステップに圧縮したTurboモデルでは、200倍のスピードアップを実現しました。

=== 柔軟性

//table[chap06t004][柔軟性の一覧]{
項目	仕様
------------
VRAM要件	4GB未満から動作可能
音声長	10秒〜600秒（10分）
バッチ生成	最大8曲同時生成
対応言語	50以上の言語での歌詞生成
楽器・スタイル	1000以上の楽器・スタイルに対応
音声品質	48kHzステレオ
//}
//blankline

=== 対応プラットフォーム

//table[chap06t005][対応プラットフォームの一覧]{
プラットフォーム	GPU対応	起動スクリプト
------------
Linux	CUDA	startgradioui.sh / startapiserver.sh
Windows	CUDA	startgradioui.bat / startapiserver.bat
Windows (AMD)	ROCm	startgradiouirocm.bat / startapiserverrocm.bat
macOS	MPS (Apple Silicon)	startgradiouimacos.sh / startapiservermacos.sh
//}
//blankline

=== インターフェース

ACE-Step 1.5は複数のインターフェースを提供しています。

 * Gradio Web UI: ブラウザベースの直感的なUI（http://localhost:7860）
 * REST API: プログラムから利用できるHTTP API（http://localhost:8001）
 * Studio UI: DAW（Digital Audio Workstation）ライクな高機能UI
 * VST3プラグイン: C++/GGMLベースの音楽制作ソフト向けプラグイン
 * Python API: Pythonコードからの直接利用
 * CLI: コマンドラインインターフェース

本書で解説するEasy Musicは、このREST APIを利用して構築された筆者独自のWebアプリケーションです。

//blankline

== ベンチマーク評価

ACE-Step 1.5の品質を、客観的な評価指標で確認しましょう。以下のベンチマークは、論文（arXiv:2602.00744v3）Section 5に掲載されたデータです。

=== 評価指標の説明

本書で参照する評価指標は、2つのフレームワークから構成されています。

AudioBox（Metaのオーディオ美学評価フレームワーク）

//table[chap06t006][評価指標の説明の一覧]{
指標	正式名称	評価対象
------------
CE	Content Enjoyment	コンテンツの楽しさ・魅力
CU	Content Usefulness	コンテンツの有用性・実用性
PC	Production Complexity	制作の複雑さ・洗練度
PQ	Production Quality	制作品質・録音品質
//}
//blankline

SongEval（ASLP-labの楽曲評価スイート）

//table[chap06t007][評価指標の説明の一覧]{
指標	評価対象
------------
Coherence (Coh.)	楽曲全体の一貫性・まとまり
Musicality (Mus.)	音楽的な美しさ・芸術性
Memorability (Mem.)	記憶に残る印象・フック
Clarity (Cla.)	音の明瞭さ・分離の良さ
Naturalness (Nat.)	自然さ・人間らしさ
//}
//blankline

アライメント指標

//table[chap06t008][評価指標の説明の一覧]{
指標	評価対象
------------
Style Alignment	スタイルプロンプト（タグ）への忠実度
Lyric Alignment	歌詞プロンプトへの忠実度
//}
//blankline

=== 商用モデルとの比較

以下は、ACE-Step 1.5（1.7B LM + 動的蒸留DiT、RL未適用）を、主要な商用音楽生成サービスと比較した結果です。

//table[chap06t009][商用モデルとの比較の一覧]{
モデル	CE	CU	PC	PQ	Coh.	Mus.	Mem.	Cla.	Nat.	Style	Lyric
------------
Udio v1.5	7.45	7.65	6.15	8.03	4.15	3.96	4.09	3.93	3.86	34.9	24.8
Suno v4.5	7.63	7.85	6.22	8.25	4.64	4.51	4.63	4.53	4.49	40.5	32.7
Mureka V7.6	7.44	7.71	6.35	8.13	4.43	4.29	4.35	4.29	4.21	36.2	22.4
MinMax 2.0	7.71	7.95	6.42	8.38	4.61	4.51	4.59	4.50	4.41	43.1	29.5
Suno v5	7.69	7.87	6.51	8.29	4.72	4.62	4.71	4.63	4.56	46.8	34.2
ACE-Step 1.5	7.42	8.09	6.47	8.35	4.72	4.67	4.72	4.66	4.59	39.1	26.3
//}
//blankline

=== 注目すべきポイント

 1. CU（Content Usefulness）: 8.09 — 全モデル中最高スコア。生成楽曲の実用性において、すべての商用モデルを上回っています。
 2. PQ（Production Quality）: 8.35 — 全モデル中第2位（MinMax 2.0の8.38に次ぐ）。制作品質はトップクラスです。
 3. Coherence: 4.72 — Suno v5と同率首位。楽曲の一貫性において最高水準を達成しています。
 4. Musicality: 4.67 / Memorability: 4.72 / Clarity: 4.66 / Naturalness: 4.59 — SongEval全指標でSuno v5を上回るか同等の性能を示しています。
 5. Style Alignment: 39.1 / Lyric Alignment: 26.3 — スタイル・歌詞忠実度ではSuno v5にやや劣るものの、RL（強化学習）適用前のモデルでの計測値であり、RL適用後はさらなる向上が見込まれます。

=== オープンソースモデルとの比較

//table[chap06t010][オープンソースモデルとの比較の一覧]{
モデル	CE	CU	PC	PQ	Coh.	Mus.	Mem.	Cla.	Nat.	Style	Lyric
------------
YuE	6.58	7.29	4.95	7.39	3.01	2.80	2.85	2.79	2.82	26.8	−4.6
ACE-Step 1.0	7.22	7.52	6.50	7.76	3.99	3.73	3.85	3.78	3.68	28.5	0.9
LeVo	7.61	7.78	5.92	8.31	3.55	3.35	3.32	3.31	3.20	29.4	−1.2
DiffRhythm 2	7.25	7.61	6.33	7.99	3.99	3.79	3.97	3.82	3.66	32.1	3.8
HeartMuLa	7.66	7.89	6.15	8.25	4.68	4.55	4.69	4.55	4.45	31.7	28.6
ACE-Step 1.5	7.42	8.09	6.47	8.35	4.72	4.67	4.72	4.66	4.59	39.1	26.3
//}
//blankline

オープンソースモデルの中では、ACE-Step 1.5は ほぼすべての指標でトップスコア を記録しています。特にSongEval指標（Coherence〜Naturalness）では、次点のHeartMuLaを大きく引き離しています。Style Alignmentでは他のオープンソースモデルに7ポイント以上の差をつけており、プロンプトへの忠実度の高さが際立ちます。

=== Music Arenaでの主観評価

客観的な指標に加えて、人間による主観的なA/Bテスト（Music Arena）でも評価が行われています。その結果、ACE-Step 1.5はSuno v4.5とSuno v5の間 にランクインしました。

Music Arenaにおける主観評価の順位は、低品質側から高品質側へおおむね次の並びです。

 * YuE
 * LeVo
 * DiffRhythm 2
 * ACE-Step 1.0
 * Udio
 * Mureka
 * Suno v4.5
 * ACE-Step 1.5
 * Suno v5

ACE-Step 1.5は、Suno v4.5より上位、Suno v5より下位の位置に評価されています。
//blankline

オープンソースモデルとして、商用モデルの間に食い込んだことは、コミュニティにとって大きな意味を持ちます。これは、音楽生成AIが一部の企業の独占物ではなく、誰もが利用可能な技術であるべきだという理念を、技術的な実力で裏付けたものと言えるでしょう。

//blankline

== ACE-Step 1.5のモデル構成

ACE-Step 1.5は、複数のモデルコンポーネントを組み合わせて動作します。ユーザーは用途やハードウェアに応じて、最適な組み合わせを選択できます。

=== DiTモデル（拡散トランスフォーマー）

音楽の生成を担当するメインモデルです。

//table[chap06t011][DiTモデル（拡散トランスフォーマー）の一覧]{
モデル名	推奨ステップ	品質	多様性	LoRA容易度	SFT	RL	CFG不要
------------
acestep-v15-base	50	Medium	High	Easy	なし	なし	あり
acestep-v15-sft	50	High	Medium	Easy	あり	なし	あり
acestep-v15-turbo	8	Very High	Medium	Medium	あり	なし	なし
acestep-v15-turbo-rl	8	Very High	Medium	Medium	あり	あり	なし
//}
//blankline

※ turbo-rlモデルは2026年3月時点で未リリース（Coming Soon）です。

※ 2026年4月に以下のXLモデルがリリースされました

モデル選択のポイント

 * 速度重視: turbo（8ステップで高速生成、品質も最高クラス）
 * 多様性重視: base（50ステップで多様な出力、LoRAトレーニングも容易）
 * 品質重視: sft（50ステップで高品質、SFTによる指示遵守の強化）
 * すべてが最高: turbo-rl（8ステップ高速＋RL＋SFT）

全モデル共通で、Text-to-Music、Cover、Repaintに対応しています。baseモデルはさらにCompletionにも対応しています。

=== XLモデル（4B DiT）の位置づけ

2026年春以降は、従来の2B系に加えてXL（4B DiT）系モデル も実運用の選択肢に入ります。XLは「別系統の後継」というより、大きなGPUで品質上限を押し上げる上位バリアントに位置づけられます。

//table[chap06t012][XLモデル（4B DiT）の位置づけの一覧]{
モデル名	推奨ステップ	品質	多様性	CFG	用途
------------
acestep-v15-xl-base	50	High	High	あり	Completion / extract / lego を含む多用途運用
acestep-v15-xl-sft	50	Very High	Medium	あり	最終出力・品質最優先
acestep-v15-xl-turbo	8	Very High	Medium	なし	XL系の高速生成・ラフ生成
//}
//blankline

XLモデル選択のポイント

 * 最速でXL品質を使いたい: acestep-v15-xl-turbo
 * 最終納品品質を狙いたい: acestep-v15-xl-sft
 * 機能の広さと多様性を取りたい: acestep-v15-xl-base

実務上は、XL Turboで複数案を高速に出し、XL SFTで仕上げる という二段構成が最も使いやすい運用です。

=== LMモデル（言語モデル）

楽曲の構造・スタイルの計画を担当する推論エンジンです。

//table[chap06t013][LMモデル（言語モデル）の一覧]{
モデル名	ベースモデル	推奨VRAM	スタイル品質	歌詞品質	Think品質
------------
acestep-5Hz-lm-0.6B	Qwen3-0.6B	6〜8GB	Medium	Medium	Weak
acestep-5Hz-lm-1.7B	Qwen3-1.7B	8〜16GB	Medium	Medium	Medium
acestep-5Hz-lm-4B	Qwen3-4B	16GB以上	Strong	Strong	Strong
//}
//blankline

モデル選択のポイント

 * VRAM 6GB以下: LMなし（DiTのみで動作）
 * VRAM 6〜8GB: 0.6Bモデル（軽量だが基本的な推論は可能）
 * VRAM 8〜16GB: 1.7Bモデル（バランスの取れた選択）
 * VRAM 16GB以上: 4Bモデル（最高品質の構造計画・歌詞理解）

=== VRAM別推奨構成

//table[chap06t014][VRAM別推奨構成の一覧]{
VRAM	推奨LM	バックエンド	備考
------------
≤ 6GB	なし（DiT単体）	—	INT8量子化 + CPU完全オフロードで動作
6〜8GB	acestep-5Hz-lm-0.6B	PyTorch	軽量LMでの最小構成
8〜16GB	0.6B or 1.7B	vLLM	8〜12GB: 0.6B推奨、12〜16GB: 1.7B推奨
16〜24GB	acestep-5Hz-lm-1.7B	vLLM	20GB以上なら4Bも選択可
≥ 24GB	acestep-5Hz-lm-4B	vLLM	全モデルがオフロードなしで動作
//}
//blankline

XL系まで含めて考えると、実務上の目安は次のようになります。

//table[chap06t015][VRAM別推奨構成の一覧]{
VRAM	推奨DiT	推奨LM	備考
------------
≤ 24GB	2B系 turbo / sft	0.6B〜4B	XL常用は厳しい。2B系が現実的
24〜32GB	xl-turbo	1.7B〜4B	単体XL運用の開始ライン
32〜48GB	xl-turbo / xl-sft	4B	品質重視運用がしやすい
48GB級	xl-turbo + xl-sft 併用	4B	生成用と仕上げ用の二刀流構成が可能
//}
//blankline

=== その他のモデルコンポーネント

//table[chap06t016][その他のモデルコンポーネントの一覧]{
コンポーネント	説明
------------
1D VAE	波形エンコーダ/デコーダ（48kHzステレオと64次元潜在空間の相互変換）
Qwen3-Embedding-0.6B	テキストエンコーダ（キャプション → 埋め込みベクトル）
ティンバーエンコーダ	音色情報のエンコーダ（リファレンス音声対応）
歌詞エンコーダ	歌詞テキストのエンコーダ
//}
//blankline

Hugging Faceリポジトリ（https://huggingface.co/ACE-Step/Ace-Step1.5 ）
には、合計約10.1GBのモデルファイルが公開されています。初回起動時に自動ダウンロードされるため、手動でのダウンロードは通常不要です。

//blankline

== ライセンスと利用条件

=== MITライセンス

ACE-Step 1.5はMITライセンスで公開されています。これは最も自由度の高いオープンソースライセンスの一つで、以下の利用が許可されています。

 *  商用利用
 *  改変・再配布
 *  私的利用
 *  生成楽曲の商用利用
 *  モデルの微調整（LoRA等）と公開

唯一の条件は、著作権表示とライセンス文の包含です。

=== 訓練データの安全性

Hugging Faceのモデルカードでは、訓練データの構成について以下のように明記されています。

//table[chap06t017][訓練データの安全性の一覧]{
データカテゴリ	説明
------------
Licensed Data	プロフェッショナルにライセンスされたデータ
Royalty-Free / No-Copyright Data	ロイヤリティフリー・著作権フリーのデータ
Synthetic Data	MIDI-to-Audio変換による合成データ
//}
//blankline

これにより、モデル自体の利用に関する法的リスクは最小限に抑えられています。

=== 注意事項

 * 生成楽曲が既存楽曲と類似する可能性は排除できません。商用利用時は、必要に応じて類似性チェックを行うことを推奨します。
 * 歌声のクローニング（ゼロショットティンバークローニング）機能を使用する場合は、元の歌手の権利と倫理的配慮に注意してください。
 * 各国・地域のAI生成コンテンツに関する法規制を確認した上でご利用ください。

//blankline

== コラム: ACE-Step 1.5のエコシステム

2026年3月現在、ACE-Step 1.5のGitHubリポジトリは8,200以上のスター、930以上のフォークを獲得し、58名のコントリビューターが開発に参加しています。

Hugging Faceでは、月間34,730ダウンロード、659いいねを記録しており、コミュニティによる以下のエコシステムが形成されています。

//table[chap06t018][コラム: ACE-Step 1.5のエコシステムの一覧]{
カテゴリ	数	説明
------------
Adapters	11	LoRAなどのアダプターモデル
Finetunes	5	フルファインチューンモデル
Merges	1	モデルマージ
Quantizations	2	量子化モデル（GGUF等）
Spaces	28	Hugging Face Spacesでのデモ
//}
//blankline

本書で紹介するEasy Musicも、このエコシステムの一部として、ACE-Step 1.5の可能性を広げるプロジェクトの一つです。

//blankline
