# 日めくりギャラリー

祖母の絵と母の切手コレクションをデジタルアーカイブ化したギャラリーサイトです。
毎日1作品がランダムに表示され、同じ日は常に同じ作品が表示されます。

## ファイル構成

```
gallery/
├── index.html          # 日本語版ギャラリーページ
├── en/
│   └── index.html      # 英語版ギャラリーページ
├── gallery.css         # ギャラリー専用スタイルシート
├── gallery.js          # ギャラリーロジック（日次更新機能）
├── data.json           # 作品データ（JSON形式）
├── images/             # 作品画像フォルダ
│   ├── art_001.jpg     # 絵画画像
│   ├── art_002.jpg
│   ├── stamp_001.jpg   # 切手画像
│   └── ...
└── README.md           # このファイル
```

## セットアップ方法

### 1. 画像の準備

`gallery/images/` フォルダに作品画像を配置してください。

推奨する画像形式：
- ファイル形式: JPG, PNG
- 命名規則:
  - 絵画: `art_001.jpg`, `art_002.jpg`, ...
  - 切手: `stamp_001.jpg`, `stamp_002.jpg`, ...
- サイズ: 推奨 1920x1080px 以上（アスペクト比は自由）

### 2. データの登録

`gallery/data.json` ファイルに作品情報を登録してください。

データ構造の例：

```json
[
  {
    "id": 1,
    "type": "art",
    "image": "images/art_001.jpg",
    "title": "庭先の椿",
    "title_en": "Camellia in the Garden",
    "description": "冬の寒さの中で凛と咲く椿。祖母はきっと、春を待つ静かな喜びをこの赤色に込めたのでしょう。",
    "description_en": "A camellia blooming gracefully in the cold winter.",
    "year": "1995"
  },
  {
    "id": 2,
    "type": "stamp",
    "image": "images/stamp_001.jpg",
    "title": "1964年東京オリンピック記念切手",
    "title_en": "1964 Tokyo Olympics Commemorative Stamp",
    "description": "戦後復興の象徴となった東京オリンピック。",
    "description_en": "The Tokyo Olympics symbolized post-war recovery.",
    "year": "1964"
  }
]
```

フィールドの説明：
- `id`: 作品の一意なID（数値）
- `type`: 作品の種類（`"art"` または `"stamp"`）
- `image`: 画像ファイルのパス
- `title`: 日本語タイトル
- `title_en`: 英語タイトル（省略可）
- `description`: 日本語説明文
- `description_en`: 英語説明文（省略可）
- `year`: 制作年（文字列）

### 3. 動作確認

ローカル環境で確認する場合：

```bash
# ローカルサーバーを起動（例：Python）
cd /path/to/nsk_aizu_web_comp
python3 -m http.server 8000

# ブラウザで開く
# http://localhost:8000/gallery/
```

GitHub Pagesで公開する場合：
- リポジトリにプッシュするだけで自動的に公開されます
- URL: `https://terush.github.io/nsk_aizu_web_comp/gallery/`

## 日次更新ロジック

- アクセスした日付（年月日）をキーとして、表示する作品を決定します
- 同じ日は常に同じ作品が表示されます
- 日付が変わると、別の作品が表示されます
- 疑似乱数生成により、予測不可能でありながら再現性のある選択を実現しています

## デザインコンセプト

- **没入感**: 美術館の暗室のような静謐な空間
- **配色**: 深い黒背景（#0a0a0a）、オフホワイト文字（#F0F0F0）
- **フォント**: 上品な明朝体（Noto Serif JP / Shippori Mincho）
- **レイアウト**: 作品画像を大きく表示し、半透明のテキストオーバーレイを重ねる

## トラブルシューティング

### 画像が表示されない

1. `gallery/images/` フォルダに画像ファイルがあるか確認
2. `data.json` のパスが正しいか確認（例: `"images/art_001.jpg"`）
3. 画像ファイル名の大文字・小文字が一致しているか確認

### データが読み込めない

1. `data.json` の JSON 形式が正しいか確認（カンマ、括弧の位置など）
2. ブラウザの開発者ツール（F12）でエラーメッセージを確認

### 言語切替が動作しない

- 英語版は `gallery/en/index.html` にアクセスする必要があります
- ヘッダーの言語切替ボタン（JA/EN）で切り替えられます

## カスタマイズ

### 表示スタイルの変更

`gallery/gallery.css` を編集してください。

例：
- テキストオーバーレイの位置変更（`.gallery-overlay` の `bottom`, `right` プロパティ）
- 背景色の変更（`.gallery-page` の `background-color`）
- フォントサイズの変更（`.gallery-title`, `.gallery-description`）

### データの追加

`gallery/data.json` に新しいオブジェクトを追加するだけです。
作品数に制限はありません。

## ライセンス

© 2025 NPO NSK_AIZU. All Rights Reserved.
