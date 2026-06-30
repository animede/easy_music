= ACE-Step 1.5論文の要点まとめ

=== 論文情報

 * タイトル: ACE-Step 1.5: Pushing the Boundaries of Open-Source Music Generation
 * 著者: Gong, J., Song, Y., Zhao, W., Wang, S. et al.
 * 公開: arXiv:2602.00744v3
 * フレームワーク: ACE-Step（A Complete End-to-end Song Producing Tool and Engine for Prompts）

=== 4つの主要な貢献

//table[chap12t001][4つの主要な貢献の一覧]{
#	貢献	内容
------------
1	Turboモデル	DMD（Distribution Matching Distillation）で推論ステップを150→8に削減。品質を維持しつつ19倍高速化
2	内蔵LM（Language Model）	0.6B / 1.7B / 4Bの3規模。GRPO強化学習で訓練。キャプション生成・歌詞整形・メタデータ推定を実行
3	Audio Cover & Repaint	既存楽曲のスタイル変換（Cover）と部分再生成（Repaint）。SDEdit手法の応用
4	マルチバックエンド対応	PyTorch / vLLM / llama.cpp に対応。VRAM量に応じたモデル自動選択
//}
//blankline

=== アーキテクチャの要点

//table[chap12t002][アーキテクチャの要点の一覧]{
コンポーネント	技術	パラメータ
------------
音声エンコーダ	DCAE + FSQ（8192語彙）	16kHz → 21.5Hz
DiTバックボーン	30層 Diffusion Transformer	1.2Bパラメータ
テキストエンコーダ	Qwen3-Embedding-0.6B	256トークン
Attention	GQA（Group Query Attention）	24ヘッド / 2KVヘッド
Flow Matching	Rectified Flow	ODE / SDE
//}
//blankline

=== 評価結果

//table[chap12t003][評価結果の一覧]{
指標	ACE-Step 1.5	先行手法
------------
AAS（Attention Alignment Score）	0.78	0.65（ACE-Step 1.0）
歌詞-音声対応精度	高	中
4分音楽生成	対応	1〜2分が主流
生成速度（Turbo, RTX 3090）	約10秒（60秒楽曲）	約3分（Base）
//}
//blankline


エピローグ: 以上で第Ⅱ部「ACE-Step 1.5完全解説」を終了します。第6章でACE-Step 1.5の全体像を把握し、第7章でアーキテクチャの深層を理解し、第8章で訓練戦略の革新性を学び、第9章で全機能を俯瞰し、第10章でAPIの使い方を習得し、第11章でプロンプトエンジニアリングの実践技法を身につけ、第12章で論文の要点を整理しました。

続く第Ⅲ部では、生成された楽曲をどう聴き、どう選び、どのタイミングで再生成やRepaintに回すかを整理します。

//blankline

== 制作ワークフロー

//blankline
