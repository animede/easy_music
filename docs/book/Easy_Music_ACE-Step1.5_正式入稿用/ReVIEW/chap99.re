= 用語集

この用語集は、ACE-StepやEasy Musicを読み進める中で出てくる言葉を、読者が遭遇しやすい順 を意識しながら、音楽制作の言葉、音楽生成AIの言葉、初心者向けの技術用語 に分けて整理したものです。厳密な学術定義よりも、本書を読み進めるうえで意味をつかみやすい説明を優先しています。

== 音楽制作の用語

//table[chap99t001][音楽制作の用語の一覧]{
用語	正式名称	説明
------------
メロディ	Melody	歌や主旋律として聞こえる音の流れ
ボーカル	Vocal	歌唱パート全般
インスト	Instrumental	歌のない器楽中心の楽曲
BPM	Beats Per Minute	1分あたりの拍数。曲の速さの目安
テンポ感	—	BPMだけでは表しきれない、体感上の速さやノリ
Key	調	曲の中心となる音のまとまり。明るさや暗さの印象に関わる
拍子	Time Signature	1小節に何拍入るかを示す情報。4/4拍子が最も一般的
Aメロ	—	曲の導入部。状況説明や空気づくりを担うことが多い
Bメロ	—	サビ前の橋渡し部分。期待感や緊張を高める役割を持つ
サビ	Chorus / Hook	曲の中心となる繰り返し部分。最も印象に残りやすい
フック	Hook	耳に残る決めのフレーズや印象的な要素
コード進行	Chord Progression	和音の並び方。曲の感情や流れを支える
ハーモニー	Harmony	複数の音が重なって生まれる響き
アレンジ	Arrangement	曲をどの楽器でどう構成するかの設計
編成	Instrumentation	どの楽器や音色を使うかという組み合わせ
ダイナミクス	Dynamics	音の強弱の変化。盛り上がりや抑揚に関わる
ミックス	Mix / Mixing	複数の音を聞きやすく整理し、全体のバランスを整える作業
ループ	Loop	繰り返し再生できる短いフレーズや伴奏
ステム	Stem	ボーカル、ドラム、ベースなど、パートごとに分けた音源
リファレンス曲	Reference Track	目標とする雰囲気や品質の参考にする既存曲
//}
//blankline

== 音楽生成AI・ACE-Step関連の用語

//table[chap99t002][音楽生成AI・ACE-Step関連の用語の一覧]{
用語	正式名称	説明
------------
キャプション	caption	どんな曲を生成したいかを文章で説明する入力文
プロンプト	prompt	モデルに方向性を伝えるための指示文。文脈によってキャプションとほぼ同義で使われることもある
negative prompt	—	入れてほしくない要素や避けたい傾向を指定する文
seed	—	乱数シード。同じ値と同じ設定なら似た結果を再現しやすい
Format Input	—	短い入力文を詳細な生成向け入力に整形するACE-Step側の機能
LM	Language Model	言語モデル。歌詞、説明文、補助テキスト生成などに使われる
CoT	Chain-of-Thought	段階的に考えるように出力を組み立てる手法
Turboモデル	—	少ないステップで高速生成することを重視したモデル
SFTモデル	Supervised Fine-Tuning model	教師あり学習ベースで品質や安定性を重視したモデル
XLモデル	Extra Large model	より大きなモデル。高品質化と引き換えに計算資源を多く使う
Cover	—	既存音声をもとに、雰囲気や表現を変えて新しい楽曲を作る機能
Repaint	—	音声の一部分だけを再生成して差し替える機能
Track Separation	—	音源をボーカルや伴奏などの要素に分ける機能
DiT	Diffusion Transformer	Transformerアーキテクチャを用いた拡散モデル。ACE-Stepの音楽生成バックボーン
VAE	Variational Autoencoder	音声や画像を圧縮表現に変換し、そこから再構成する仕組み
FSQ	Finite Scalar Quantization	連続値を限られた離散値へ変換する量子化手法。ACE-Stepでは音声表現の圧縮に関わる
GQA	Group Query Attention	Attentionの計算効率を高める工夫の一つ
CFG	Classifier-Free Guidance	生成時に条件をどれだけ強く反映するかを調整する考え方
Flow Matching	—	ノイズから目的のデータへ変換する流れを学習する手法
GRPO	Group Relative Policy Optimization	相対評価を使った強化学習手法。ACE-Step LMの訓練に関係する
LoRA	Low-Rank Adaptation	既存モデルに軽量な追加学習を行うための手法
ODE	Ordinary Differential Equation	確定的なサンプリング方式
SDE	Stochastic Differential Equation	確率的なゆらぎを含むサンプリング方式
AAS	Attention Alignment Score	歌詞と音声の対応の良さを測るための指標
DMD	Distribution Matching Distillation	多ステップ生成モデルを少ないステップで動かしやすくする蒸留手法
DCAE	Dual-Channel Audio Encoder	ステレオ音声の左右チャンネルを扱う音声エンコーダ
text_encoder	—	テキストをモデルが扱いやすい数値表現に変換する部分
//}
//blankline

== 初心者向け技術用語

//table[chap99t003][初心者向け技術用語の一覧]{
用語	正式名称	説明
------------
サーバー	Server	リクエストを受けて処理し、結果を返す側
クライアント	Client	サーバーに要求を送る側。ブラウザやアプリが該当する
API	Application Programming Interface	ソフト同士がやり取りするための窓口
REST API	Representational State Transfer API	HTTPでデータをやり取りする一般的なAPI方式
HTTP	Hypertext Transfer Protocol	ブラウザやアプリがサーバーと通信するときの基本的な仕組み
JSON	JavaScript Object Notation	データの受け渡しによく使うテキスト形式
localhost	—	自分自身のPCを指す特別なアドレス
ポート	Port	同じPC内で通信先を見分ける番号
CLI	Command Line Interface	コマンドを入力して操作する方式
仮想環境	Virtual Environment	Pythonの依存関係をプロジェクトごとに分離する仕組み
依存関係	Dependency	プログラムが動くために必要な外部ライブラリ
パッケージマネージャ	Package Manager	必要なライブラリの導入や管理を行う仕組み。pipやuvなど
Git	—	ファイルの変更履歴を管理し、取得や更新を行うための仕組み。git clone などのコマンドで使う
GitHub	—	ソースコードや公開ファイル一式を共有・配布するためによく使われるWebサービス
クローン	clone	GitHubなどにある公開ファイル一式を、自分のPCにコピーして取得すること
Hugging Face	—	AIモデルやデータセットを配布・公開するためによく使われるサービス
環境変数	Environment Variable	起動時に設定値を渡すための仕組み
..env ファイル	—	環境変数をまとめて記述する設定ファイル
フロントエンド	Frontend	ユーザーが直接触る画面側
バックエンド	Backend	裏側で処理や外部連携を行う側
ルーター	Router	URLごとに処理を振り分ける仕組み
サービス層	Service Layer	実際の処理や外部通信をまとめる役割の部分
ミドルウェア	Middleware	リクエストとレスポンスの途中で共通処理を差し込む仕組み
ASGI	Asynchronous Server Gateway Interface	Pythonの非同期Webアプリがサーバーと連携するための規格
ポーリング	Polling	一定間隔で結果を問い合わせ続ける方式
タイムアウト	Timeout	一定時間返答がない場合に処理を打ち切ること
CORS	Cross-Origin Resource Sharing	ブラウザが異なる接続先へのアクセスを制御する仕組み
フォールバック	Fallback	第一候補が失敗したときに別手段へ切り替えること
GPU	Graphics Processing Unit	大量計算を高速に処理する装置。AI推論で重要
VRAM	Video RAM	GPUが使うメモリ。大きいモデルほど多く必要
量子化	Quantization	モデルを軽くして動かしやすくするために、数値表現を簡略化すること
GGUF	GPT-Generated Unified Format	LLMの量子化モデルファイル形式
//}
//blankline

