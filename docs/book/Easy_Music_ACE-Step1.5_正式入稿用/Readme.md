# Easy Musicで動かすACE-Step 1.5 完全ガイド 入稿用Re:VIEWソース

このディレクトリは、入稿用リポジトリへ配置するための正式版ソースです。
リポジトリルートに本ファイルと `ReVIEW/` フォルダを置く構成を想定しています。

## フォルダ構成

- `Readme.md`: この説明ファイル
- `ReVIEW/config.yml`: Re:VIEW設定ファイル
- `ReVIEW/catalog.yml`: 章構成ファイル
- `ReVIEW/*.re`: 各章原稿
- `ReVIEW/images/`: 画像ファイル
- `ReVIEW/sty/`: PDFビルド用スタイルファイル

## 備考

- Re:VIEW 5.9系でのビルドを想定しています。
- 生成物である `book.pdf`、`book.epub`、`webroot/` は同梱していません。
- ソースコードハイライトは編集部指定に従い無効化しています。
- `chapterlink` は `null` に設定しています。
