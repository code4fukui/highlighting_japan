# highlighting_japan

政府広報誌『Highlighting Japan』の記事インデックスのオープンデータセット（CSV/JSON）です。本リポジトリでは、2011年から2022年に公開された記事の機械可読データを提供しており、日本語の記事本文から自動生成されたキーワードも含まれています。

## サンプルアプリ

データセットのインタラクティブなビューアおよび検索インターフェースです：

- **https://github.com/code4fukui/highlighting_japan

## オープンデータ

データセットは『Highlighting Japan』の公式サイトをスクレイピングして生成されており、2つのフォーマットで利用可能です。

- [data_ja.csv](https://code4fukui.github.io/highlighting_japan/data_ja.csv)
- [data_ja.json](https://code4fukui.github.io/highlighting_japan/data_ja.json)

各レコードには、記事のURL、タイトル、公開日、説明、画像URL、および[TinySegmenter](https://code4fukui.github.io/TinySegmenter/TinySegmenter.js)を使用して抽出されたキーワードのリストが含まれています。

## 開発

データは `deno/download.js` のDenoスクリプトによって生成されます。スクリプトを実行してデータセットを再生成するには、以下のコマンドを使用します：

```sh
deno run --allow-net --allow-read --allow-write deno/download.js
```

## ライセンス

MIT License

Copyright (c) 2022 Taisuke Fukuno
