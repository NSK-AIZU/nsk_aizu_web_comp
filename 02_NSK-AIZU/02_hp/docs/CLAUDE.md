# 共通テスト情報I解説 Webサイト構築プロジェクト

## プロジェクト概要

NPO法人NSK_AIZUのWebサイトに、地域の高校生向けの教育支援コンテンツとして、共通テスト情報Iの詳細な解説を追加する。

### 目的
- 会津地域の高校生の学習支援
- NPOの教育事業実績の可視化
- ICT教育への貢献

### 対象
- 2025年共通テスト 情報I（全4問、100点満点）

---

## ディレクトリ構造

```
npo-nsk-aizu.org/
├── index.html
├── about/
├── projects/
└── education/  ← 新規追加
    ├── index.html (教育コンテンツのトップページ)
    ├── education.css (専用スタイルシート)
    └── kyotsu-test/
        ├── index.html (共通テスト解説トップ)
        └── 2025/
            └── joho1/
                ├── index.html (2025年情報I トップ)
                ├── daimon1.html (第1問 20点)
                ├── daimon2.html (第2問 30点)
                ├── daimon3.html (第3問 25点)
                └── daimon4.html (第4問 25点)
```

---

## 各ページの構成

### 1. 教育トップページ (`/education/index.html`)

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>教育支援プログラム | NPO法人NSK_AIZU</title>
    <meta name="description" content="NPO法人NSK_AIZUの教育支援プログラム。共通テスト解説など、地域の高校生の学習を支援します。">
    <link rel="stylesheet" href="education.css">
</head>
<body>
    <header>
        <nav>
            <a href="/">ホーム</a>
            <a href="/about/">団体について</a>
            <a href="/projects/">プロジェクト</a>
            <a href="/education/" class="active">教育支援</a>
        </nav>
    </header>

    <main>
        <h1>教育支援プログラム</h1>
        
        <section>
            <h2>共通テスト解説</h2>
            <p>地域の高校生の学習を支援するため、共通テストの詳細な解説を公開しています。</p>
            <ul>
                <li><a href="kyotsu-test/2025/joho1/">2025年 情報I</a></li>
            </ul>
        </section>

        <section>
            <h2>教育方針</h2>
            <ul>
                <li>詳細な解説で理解を深める</li>
                <li>考え方のプロセスを重視</li>
                <li>関連知識の補足説明</li>
            </ul>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 NPO法人NSK_AIZU</p>
    </footer>
</body>
</html>
```

### 2. 2025年情報I トップページ (`/education/kyotsu-test/2025/joho1/index.html`)

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2025年共通テスト 情報I 解説 | NPO法人NSK_AIZU</title>
    <meta name="description" content="2025年共通テスト情報Iの全問題について、詳細な解説を提供。考え方のプロセスを重視した学習支援コンテンツです。">
    <meta name="keywords" content="共通テスト,情報I,2025,解説,会津,NPO,高校">
    <link rel="stylesheet" href="../../../education.css">
</head>
<body>
    <header>
        <nav class="breadcrumb">
            <a href="/">ホーム</a> &gt; 
            <a href="/education/">教育支援</a> &gt; 
            <a href="/education/kyotsu-test/">共通テスト解説</a> &gt; 
            2025年情報I
        </nav>
    </header>

    <main>
        <h1>2025年共通テスト 情報I 解説</h1>

        <section class="overview">
            <h2>概要</h2>
            <p>2025年1月に実施された共通テスト情報Iの全問題について、詳細な解説を提供しています。</p>
            <p>各問題の解答だけでなく、考え方のプロセスや関連知識も含めて説明しています。</p>
        </section>

        <nav class="problem-index">
            <h2>目次</h2>
            <ul>
                <li>
                    <a href="daimon1.html">第1問 (20点)</a>
                    <p>情報セキュリティ（デジタル署名、IPv6）、7セグメントLED、チェックディジット</p>
                </li>
                <li>
                    <a href="daimon2.html">第2問 (30点)</a>
                    <p>データ活用（レシート分析）、シミュレーション（集金問題）</p>
                </li>
                <li>
                    <a href="daimon3.html">第3問 (25点)</a>
                    <p>プログラミング（工芸品製作のスケジューリング）</p>
                </li>
                <li>
                    <a href="daimon4.html">第4問 (25点)</a>
                    <p>データ分析（尺度水準、散布図、相関係数、箱ひげ図）</p>
                </li>
            </ul>
        </nav>

        <section class="features">
            <h2>この解説の特徴</h2>
            <ul>
                <li><strong>詳細な解説</strong>：各問題の考え方を丁寧に説明</li>
                <li><strong>プロセス重視</strong>：答えに至る思考過程を明示</li>
                <li><strong>関連知識</strong>：背景知識や補足情報も提供</li>
                <li><strong>実践的</strong>：実際の解答プロセスを再現</li>
            </ul>
        </section>

        <section class="note">
            <h2>ご利用にあたって</h2>
            <p>この解説は学習支援を目的として作成されています。問題の詳細については、<a href="https://www.dnc.ac.jp/" target="_blank" rel="noopener">大学入試センター</a>の公表資料をご参照ください。</p>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 NPO法人NSK_AIZU</p>
    </footer>
</body>
</html>
```

### 3. 各大問ページのテンプレート (`daimon1.html` など)

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>第1問 解説 - 2025年共通テスト情報I | NPO法人NSK_AIZU</title>
    <meta name="description" content="2025年共通テスト情報I 第1問の詳細解説。デジタル署名、IPv6、7セグメントLED、チェックディジットについて。">
    <link rel="stylesheet" href="../../../education.css">
</head>
<body>
    <header>
        <nav class="breadcrumb">
            <a href="/">ホーム</a> &gt; 
            <a href="/education/">教育支援</a> &gt; 
            <a href="/education/kyotsu-test/2025/joho1/">2025年情報I</a> &gt; 
            第1問
        </nav>
    </header>

    <main>
        <h1>第1問 解説 (20点)</h1>

        <nav class="page-nav">
            <a href="index.html">← 目次に戻る</a>
            <a href="daimon2.html">第2問へ →</a>
        </nav>

        <!-- 問1 -->
        <article class="problem">
            <h2 id="mon1">問1</h2>
            
            <div class="problem-summary">
                <h3>問題概要</h3>
                <p>デジタル署名とIPv6に関する穴埋め問題</p>
            </div>

            <div class="answer">
                <h3>解答</h3>
                <dl>
                    <dt>ア</dt>
                    <dd><strong>2</strong> (改ざんされていないか)</dd>
                    <dt>イ</dt>
                    <dd><strong>2</strong> (インターネットに直接接続する機器の増加に対応するため)</dd>
                </dl>
            </div>

            <div class="explanation">
                <h3>解説</h3>
                
                <h4>ア：デジタル署名の機能</h4>
                <p>デジタル署名には2つの主要な機能があります：</p>
                <ol>
                    <li><strong>本人認証（真正性）</strong>：発信者が本人であることの確認</li>
                    <li><strong>完全性の保証</strong>：情報が改ざんされていないことの確認</li>
                </ol>
                <p>問題文の前半で「発信者が本人であることを確認するため」と既に述べられているため、空欄アには<strong>「改ざんされていないか」</strong>が入ります。</p>

                <h4>イ：IPv6導入の理由</h4>
                <p>IPv4（32ビット）では約43億個（2³²）のIPアドレスしか割り当てられませんでした。インターネットの普及とIoT機器の増加により、このアドレス空間では不足することが明らかになりました。</p>
                <p>IPv6（128ビット）では、2¹²⁸個という天文学的な数のアドレスを割り当てることができ、実質的にアドレス枯渇の問題を解決しました。</p>
                <p>したがって、空欄イには<strong>「インターネットに直接接続する機器の増加に対応するため」</strong>が入ります。</p>
            </div>

            <div class="tips">
                <h3>ポイント</h3>
                <ul>
                    <li>デジタル署名の2大機能：①本人認証、②改ざん検知（完全性）</li>
                    <li>IPv6の主目的：アドレス不足への対応（32bit → 128bit）</li>
                    <li>IoT（Internet of Things）機器の増加が主な要因</li>
                </ul>
            </div>
        </article>

        <!-- 問2 -->
        <article class="problem">
            <h2 id="mon2">問2</h2>
            
            <div class="problem-summary">
                <h3>問題概要</h3>
                <p>7セグメントLEDの組み合わせ数とエラーコードの桁数に関する問題</p>
            </div>

            <div class="answer">
                <h3>解答</h3>
                <dl>
                    <dt>ウ・エ・オ</dt>
                    <dd><strong>128</strong> (通り)</dd>
                    <dt>カ</dt>
                    <dd><strong>5</strong> (桁)</dd>
                </dl>
            </div>

            <div class="explanation">
                <h3>解説</h3>
                
                <h4>ウ・エ・オ：7セグメントLEDの組み合わせ</h4>
                <p>7セグメントLEDは、a〜gの7個のLEDで構成されています。各LEDは「点灯」または「消灯」の2つの状態を取ることができます。</p>
                <p>したがって、全体の組み合わせ数は：</p>
                <p class="formula">2⁷ = 128 通り</p>
                <p>これは、各LEDごとに2通りの選択肢があり、それが7個あるため、2を7回掛け合わせた値になります。</p>

                <h4>カ：エラーコードの最小桁数</h4>
                <p>エラーコードの構成：</p>
                <ul>
                    <li>1桁目：大文字アルファベット8種類</li>
                    <li>2桁目：小文字アルファベット5種類</li>
                    <li>3桁目以降：数字10種類（0〜9）</li>
                </ul>
                <p>5,000種類以上のエラーコードを表示するための条件：</p>
                <p class="formula">8 × 5 × 10ˣ ≥ 5,000</p>
                <p class="formula">40 × 10ˣ ≥ 5,000</p>
                <p class="formula">10ˣ ≥ 125</p>
                <p>x = 2のとき：10² = 100 < 125（不足）</p>
                <p>x = 3のとき：10³ = 1,000 > 125（OK）</p>
                <p>したがって、数字部分は最低3桁必要で、全体では1桁目 + 2桁目 + 3桁（数字）= <strong>5桁</strong>が必要です。</p>
            </div>

            <div class="tips">
                <h3>ポイント</h3>
                <ul>
                    <li>2の累乗：2⁶=64, 2⁷=128, 2⁸=256, 2¹⁰=1024</li>
                    <li>組み合わせの数：各要素の選択肢数を掛け合わせる</li>
                    <li>不等式を解いて最小値を求める</li>
                </ul>
            </div>
        </article>

        <!-- 問3 -->
        <article class="problem">
            <h2 id="mon3">問3</h2>
            
            <div class="problem-summary">
                <h3>問題概要</h3>
                <p>チェックディジットに関する問題（計算と誤り検出）</p>
            </div>

            <div class="answer">
                <h3>解答</h3>
                <dl>
                    <dt>キ</dt>
                    <dd><strong>7</strong></dd>
                    <dt>ク</dt>
                    <dd><strong>3</strong> (連続する二つの桁の数字の順序を逆にする)</dd>
                </dl>
            </div>

            <div class="explanation">
                <h3>解説</h3>
                
                <h4>キ：チェックディジットの計算</h4>
                <p>利用者ID「22609」に対して、生成方法Bでチェックディジットを計算します。</p>
                <p><strong>生成方法B</strong>の手順：</p>
                <ol>
                    <li>奇数桁（N₅, N₃, N₁）の値をそれぞれ3倍する</li>
                    <li>偶数桁（N₄, N₂）の値はそのまま</li>
                    <li>それらを足し合わせて10で割った余りRを求める</li>
                    <li>10からRを引いた値がチェックディジット</li>
                </ol>
                <p>利用者ID「22609」の場合：</p>
                <ul>
                    <li>N₅ = 2（奇数桁）→ 2×3 = 6</li>
                    <li>N₄ = 2（偶数桁）→ 2</li>
                    <li>N₃ = 6（奇数桁）→ 6×3 = 18</li>
                    <li>N₂ = 0（偶数桁）→ 0</li>
                    <li>N₁ = 9（奇数桁）→ 9×3 = 27</li>
                </ul>
                <p>合計：6 + 2 + 18 + 0 + 27 = 53</p>
                <p>R = 53 % 10 = 3</p>
                <p>チェックディジット C = 10 - 3 = <strong>7</strong></p>

                <h4>ク：生成方法Bで検出できる入力ミス</h4>
                <p>生成方法Aは全ての桁を単純に足すだけなので、<strong>桁の順序を入れ替えても合計値は変わらず、検出できません</strong>。</p>
                <p>一方、生成方法Bは奇数桁だけを3倍にするため、<strong>連続する二つの桁（偶数桁と奇数桁）の順序を逆にすると、重み付けが変わり検出できる可能性があります</strong>。</p>
                <p>例：「26」→「62」と入れ替えた場合</p>
                <ul>
                    <li>正しい場合：2×3 + 6 = 12</li>
                    <li>入れ替え：6×3 + 2 = 20</li>
                    <li>結果が異なるため検出可能</li>
                </ul>
                <p>したがって、答えは<strong>③ 連続する二つの桁の数字の順序を逆にする</strong>です。</p>
            </div>

            <div class="tips">
                <h3>ポイント</h3>
                <ul>
                    <li>チェックディジット：データの入力ミスを検出するための検証用数字</li>
                    <li>重み付け方式：桁ごとに異なる係数を掛けることで、より多くのエラーを検出</li>
                    <li>順序の入れ替え：重み付けがあれば検出可能、なければ検出不可能</li>
                </ul>
            </div>
        </article>

        <!-- 問4 -->
        <article class="problem">
            <h2 id="mon4">問4</h2>
            
            <div class="problem-summary">
                <h3>問題概要</h3>
                <p>フィッツの法則に関する問題（UI設計）</p>
            </div>

            <div class="answer">
                <h3>解答</h3>
                <dl>
                    <dt>ケ</dt>
                    <dd><strong>2</strong>（画面右上隅）</dd>
                    <dt>コ</dt>
                    <dd><strong>0</strong>（低い）</dd>
                    <dt>サ</dt>
                    <dd><strong>1</strong>（マウスカーソルの位置から遠い場所）</dd>
                </dl>
            </div>

            <div class="explanation">
                <h3>解説</h3>
                
                <h4>フィッツの法則とは</h4>
                <p>フィッツの法則は、ポインティングデバイス（マウスなど）で対象物を指し示すのに要する時間を予測する法則です。</p>
                <p>主な原則：</p>
                <ul>
                    <li>対象物が<strong>大きいほど</strong>、到達時間が短くなる</li>
                    <li>対象物への<strong>距離が短いほど</strong>、到達時間が短くなる</li>
                </ul>

                <h4>ケ：最も短時間で指し示せる対象</h4>
                <p>図5を見ると、マウスカーソルは画面の中央やや右上に位置しています。</p>
                <p>ディスプレイの端では、マウスカーソルがそれ以上外に出られないため、<strong>オーバーシュート（行き過ぎ）が発生しません</strong>。これを「実質的に大きさが無限大」と表現しています。</p>
                <p>選択肢を検討：</p>
                <ul>
                    <li>⓪：画面左上隅（遠い）</li>
                    <li>①：画面中央の四角（端の効果なし）</li>
                    <li><strong>②：画面右上隅</strong>（近い + 2つの端が交わる = 最も有利）</li>
                    <li>③：画面下端中央（遠い）</li>
                </ul>
                <p>答えは<strong>②</strong>です。</p>

                <h4>コ・サ：メニュー項目の配置</h4>
                <p>図6のメニュー配置を見ると、項目5は最下部に配置されています。</p>
                <p>フィッツの法則に沿った設計では、<strong>よく使う項目ほどアクセスしやすい場所に配置</strong>すべきです。逆に言えば、あまり使わない項目は遠くに配置しても許容されます。</p>
                <p>したがって：</p>
                <ul>
                    <li><strong>コ = 0（低い）</strong>：利用頻度が低い項目だから遠くに配置</li>
                    <li><strong>サ = 1（マウスカーソルの位置から遠い場所）</strong>：意図的に遠くに配置</li>
                </ul>
            </div>

            <div class="tips">
                <h3>ポイント</h3>
                <ul>
                    <li>フィッツの法則：対象が大きく近いほど、操作時間が短い</li>
                    <li>画面の端：実質的に無限大の大きさとして機能</li>
                    <li>UI設計：よく使う機能は近く大きく、あまり使わない機能は遠く小さく</li>
                </ul>
            </div>
        </article>

        <nav class="page-nav">
            <a href="index.html">← 目次に戻る</a>
            <a href="daimon2.html">第2問へ →</a>
        </nav>
    </main>

    <footer>
        <p>&copy; 2025 NPO法人NSK_AIZU</p>
        <p><a href="/education/">教育支援トップ</a> | <a href="/">ホーム</a></p>
    </footer>
</body>
</html>
```

---

## CSS スタイルシート (`education.css`)

```css
/* 基本スタイル */
body {
    font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
    line-height: 1.8;
    color: #333;
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

/* ヘッダー・ナビゲーション */
header {
    margin-bottom: 2rem;
}

nav a {
    text-decoration: none;
    color: #2196F3;
    margin-right: 1rem;
}

nav a:hover {
    text-decoration: underline;
}

nav a.active {
    font-weight: bold;
    color: #1565C0;
}

.breadcrumb {
    font-size: 0.9rem;
    color: #666;
    margin: 1rem 0;
}

/* 見出し */
h1 {
    color: #1565C0;
    border-bottom: 3px solid #2196F3;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
}

h2 {
    color: #1976D2;
    margin-top: 2rem;
    margin-bottom: 1rem;
    border-left: 4px solid #2196F3;
    padding-left: 0.5rem;
}

h3 {
    color: #333;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
}

h4 {
    color: #555;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

/* 問題関連のボックス */
.problem {
    margin-bottom: 4rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #ddd;
}

.problem-summary {
    background: #f5f5f5;
    padding: 1rem;
    margin: 1rem 0;
    border-left: 4px solid #4CAF50;
    border-radius: 4px;
}

.answer {
    background: #e3f2fd;
    padding: 1rem;
    margin: 1rem 0;
    border-left: 4px solid #2196F3;
    border-radius: 4px;
}

.answer dl {
    margin: 0;
}

.answer dt {
    font-weight: bold;
    color: #1976D2;
    margin-top: 0.5rem;
}

.answer dd {
    margin-left: 1.5rem;
    margin-bottom: 0.5rem;
}

.answer strong {
    font-size: 1.2em;
    color: #0D47A1;
}

.explanation {
    margin: 2rem 0;
}

.explanation h4 {
    color: #1976D2;
    margin-top: 1.5rem;
}

.explanation p {
    margin: 0.75rem 0;
}

.explanation ul, .explanation ol {
    margin: 0.75rem 0;
    padding-left: 2rem;
}

.explanation li {
    margin: 0.5rem 0;
}

.tips {
    background: #fff3e0;
    padding: 1rem;
    margin: 1rem 0;
    border-left: 4px solid #FF9800;
    border-radius: 4px;
}

.tips ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
}

.tips li {
    margin: 0.5rem 0;
}

/* 数式 */
.formula {
    font-family: 'Courier New', monospace;
    background: #f9f9f9;
    padding: 0.5rem 1rem;
    margin: 1rem 0;
    border-left: 3px solid #9E9E9E;
    font-size: 1.1em;
}

/* 目次・インデックス */
.problem-index ul {
    list-style: none;
    padding: 0;
}

.problem-index li {
    background: #fafafa;
    margin: 1rem 0;
    padding: 1rem;
    border-left: 4px solid #2196F3;
    border-radius: 4px;
}

.problem-index li:hover {
    background: #f0f0f0;
}

.problem-index a {
    text-decoration: none;
    color: #1976D2;
    font-weight: bold;
    font-size: 1.1em;
}

.problem-index p {
    margin: 0.5rem 0 0 0;
    color: #666;
    font-size: 0.95em;
}

/* ページナビゲーション */
.page-nav {
    display: flex;
    justify-content: space-between;
    margin: 2rem 0;
    padding: 1rem 0;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
}

.page-nav a {
    text-decoration: none;
    color: #2196F3;
    padding: 0.5rem 1rem;
    border: 1px solid #2196F3;
    border-radius: 4px;
    transition: all 0.3s;
}

.page-nav a:hover {
    background: #2196F3;
    color: white;
}

/* セクション */
.overview, .features, .note {
    background: #fafafa;
    padding: 1.5rem;
    margin: 1.5rem 0;
    border-radius: 4px;
}

.note {
    background: #fff9c4;
    border-left: 4px solid #FBC02D;
}

/* フッター */
footer {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 2px solid #ddd;
    text-align: center;
    color: #666;
}

footer a {
    color: #2196F3;
    text-decoration: none;
    margin: 0 0.5rem;
}

footer a:hover {
    text-decoration: underline;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
    body {
        padding: 10px;
    }

    h1 {
        font-size: 1.5rem;
    }

    h2 {
        font-size: 1.3rem;
    }

    .page-nav {
        flex-direction: column;
        gap: 1rem;
    }

    .page-nav a {
        text-align: center;
    }
}
```

---

## 実装手順

### Phase 1: 環境準備
1. ローカルのNPOサイトディレクトリに移動
   ```bash
   cd ~/path/to/npo-nsk-aizu-site
   ```

2. ディレクトリ構造を作成
   ```bash
   mkdir -p education/kyotsu-test/2025/joho1
   ```

3. CSSファイルを作成
   ```bash
   touch education/education.css
   ```

### Phase 2: コンテンツ作成
1. `education/index.html` を作成（教育トップページ）
2. `education/kyotsu-test/2025/joho1/index.html` を作成（2025年情報Iトップ）
3. `education/kyotsu-test/2025/joho1/daimon1.html` を作成（第1問）
4. 第2問、第3問、第4問も同様に作成

### Phase 3: 統合
1. メインサイトのナビゲーションに「教育支援」リンクを追加
   ```html
   <nav>
     <ul>
       <li><a href="/">ホーム</a></li>
       <li><a href="/about/">団体について</a></li>
       <li><a href="/projects/">プロジェクト</a></li>
       <li><a href="/education/">教育支援</a></li> <!-- 追加 -->
     </ul>
   </nav>
   ```

2. サイトマップを更新（SEO対策）

### Phase 4: 公開
1. ローカルで動作確認
   ```bash
   # Python簡易サーバーで確認
   python3 -m http.server 8000
   # http://localhost:8000/education/ にアクセス
   ```

2. Cloudflare Tunnel経由で公開
   - 既存の設定で自動的に公開される

3. 動作確認
   - 各ページが正しく表示されるか
   - リンクが正しく動作するか
   - モバイル表示が適切か

---

## 各大問の内容概要

### 第1問（20点）
- 問1: デジタル署名、IPv6
- 問2: 7セグメントLED、エラーコード
- 問3: チェックディジット
- 問4: フィッツの法則

### 第2問（30点）
**A: データ活用**
- 問1: レシートデータの分析
- 問2: データから得られない情報
- 問3: 情報システムの流れ
- 問4: メリットと必要な条件

**B: シミュレーション**
- 問1: 集金シミュレーションの表計算
- 問2: シミュレーション結果の考察
- 問3: 事前準備の検討

### 第3問（25点）
- 問1: スケジューリング表の読み取り
- 問2: 配列を使った担当部員の決定
- 問3: プログラムの完成

### 第4問（25点）
- 問1: 尺度水準、グラフの読み取り
- 問2: 散布図と相関係数
- 問3: 箱ひげ図を用いた分析
- 問4: データの分類と解釈

---

## SEO対策

### メタタグの設定
各ページに以下を含める：
```html
<title>適切なページタイトル | NPO法人NSK_AIZU</title>
<meta name="description" content="ページの説明（100-160文字）">
<meta name="keywords" content="共通テスト,情報I,解説,会津,高校">
<meta property="og:title" content="ページタイトル">
<meta property="og:description" content="ページの説明">
<meta property="og:type" content="article">
```

### 構造化データ（JSON-LD）
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "NPO法人NSK_AIZU",
  "url": "https://npo-nsk-aizu.org",
  "description": "会津地域の農業とICT教育を支援するNPO法人"
}
</script>
```

---

## 今後の拡張計画

### 短期（1-3ヶ月）
- [ ] 2025年情報Iの全問題解説を完成
- [ ] モバイル対応の最適化
- [ ] 検索機能の追加

### 中期（3-6ヶ月）
- [ ] 2026年の問題解説を追加
- [ ] 問題演習機能の実装
- [ ] コメント機能の追加

### 長期（6ヶ月以降）
- [ ] 他教科（数学、英語など）の解説追加
- [ ] プログラミング講座の開設
- [ ] 農業ICT教材の公開
- [ ] オンライン質問対応システム

---

## 注意事項

### 著作権について
- 問題文の全文転載は避ける
- 図表は自作または概念的な説明にとどめる
- 「2025年共通テスト情報I 第○問」として出典を明記
- 大学入試センターへのリンクを記載

### 品質管理
- 解答の正確性を複数回チェック
- 誤字脱字の確認
- リンク切れの定期確認
- ユーザーフィードバックの収集

### プライバシー
- アクセス解析を導入する場合は、プライバシーポリシーを明記
- クッキー利用の同意取得

---

## 問い合わせ・フィードバック

解説の内容に関する質問や、誤りの指摘などは以下まで：
- メール: [NPOのメールアドレス]
- お問い合わせフォーム: [URL]

---

## 作成日
2026年1月17日

## 更新履歴
- 2026-01-17: 初版作成、第1問の解説完成
- (今後の更新を記録)

---

このドキュメントは、共通テスト情報I解説コンテンツをNPO法人NSK_AIZUのWebサイトに追加するための包括的なガイドです。
