// ==========================================
// 言語判定とパス設定
// ==========================================
// URLに '/en/' が含まれているかチェック
const isEn = location.pathname.includes('/en/');

// 相対パスのプレフィックス
const path = isEn ? '../' : './';

// 言語別のテキスト設定
const langData = {
    ja: {
        top: 'トップページ',
        vision: 'ビジョン',
        news: 'お知らせ',
        rice: '画面de田んぼ',
        about: '私たちについて',
        contact: 'お問い合わせ',
        // address: 削除しました
        topLink: 'index.html',
        visionLink: 'vision.html',
        newsLink: 'news.html',
        riceLink: 'rice_calc.html',
        aboutLink: 'about.html',
        contactLink: 'contact.html',
        switchJaClass: 'is-active',
        switchEnClass: '',
        switchJaLink: isEn ? '../index.html' : '#',
        switchEnLink: isEn ? '#' : 'en/index.html'
    },
    en: {
        top: 'HOME',
        vision: 'OUR VISION',
        news: 'NEWS',
        rice: 'RICE CALCULATOR',
        about: 'WHO WE ARE',
        contact: 'GET IN TOUCH',
        // address: Removed
        topLink: 'index.html',
        visionLink: 'vision.html',
        newsLink: 'news.html',
        riceLink: 'rice_calc.html',
        aboutLink: 'about.html',
        contactLink: 'contact.html',
        switchJaClass: '',
        switchEnClass: 'is-active',
        switchJaLink: '../index.html',
        switchEnLink: '#'
    }
};

// 現在の言語データを選択
const txt = isEn ? langData.en : langData.ja;

// ページごとの言語切り替えリンクの微調整
const currentFile = location.pathname.split('/').pop() || 'index.html';
if (isEn) {
    txt.switchJaLink = '../' + currentFile;
} else {
    txt.switchEnLink = 'en/' + currentFile;
}


// ==========================================
// 共通パーツのHTML定義
// ==========================================

// ヘッダー + 全画面メニュー
const headerContent = `
    <a href="#main-content" class="skip-link">${isEn ? 'Skip to main content' : 'メインコンテンツへスキップ'}</a>
    <div class="header__inner">
        <div class="header__logo">
            <a href="${txt.topLink}" aria-label="${isEn ? 'Go to home page' : 'ホームページへ戻る'}">
                <img src="${path}logo.png" alt="NSK_AIZU">
            </a>
        </div>
        <div class="header__nav-area">
            <div class="header__lang">
                <a href="${txt.switchJaLink}"
                   class="header__lang-link ${txt.switchJaClass}"
                   aria-label="${isEn ? 'Switch to Japanese' : '日本語版に切り替え'}">JA</a>
                <span class="header__lang-divider" aria-hidden="true"></span>
                <a href="${txt.switchEnLink}"
                   class="header__lang-link ${txt.switchEnClass}"
                   aria-label="${isEn ? 'Switch to English' : '英語版に切り替え'}">EN</a>
            </div>
            <button class="header__menu-btn"
                    id="js-menu-btn"
                    aria-label="${isEn ? 'Open navigation menu' : 'ナビゲーションメニューを開く'}"
                    aria-expanded="false"
                    aria-controls="js-global-nav">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </button>
        </div>
    </div>

    <nav class="global-nav"
         id="js-global-nav"
         role="navigation"
         aria-label="${isEn ? 'Main navigation' : 'メインナビゲーション'}">
        <ul class="global-nav__list">
            <li class="global-nav__item">
                <a href="${txt.topLink}">
                    <span class="global-nav__en">- TOP -</span>
                    <span class="global-nav__jp">${txt.top}</span>
                </a>
            </li>
            <li class="global-nav__item">
                <a href="${txt.visionLink}">
                    <span class="global-nav__en">- VISION -</span>
                    <span class="global-nav__jp">${txt.vision}</span>
                </a>
            </li>
            <li class="global-nav__item">
                <a href="${txt.newsLink}">
                    <span class="global-nav__en">- NEWS -</span>
                    <span class="global-nav__jp">${txt.news}</span>
                </a>
            </li>
            <li class="global-nav__item">
                <a href="${txt.riceLink}">
                    <span class="global-nav__en">- RICE CALCULATOR -</span>
                    <span class="global-nav__jp">${txt.rice}</span>
                </a>
            </li>
            <li class="global-nav__item">
                <a href="${txt.aboutLink}">
                    <span class="global-nav__en">- ABOUT US -</span>
                    <span class="global-nav__jp">${txt.about}</span>
                </a>
            </li>
            <li class="global-nav__item">
                <a href="${txt.contactLink}">
                    <span class="global-nav__en">- CONTACT -</span>
                    <span class="global-nav__jp">${txt.contact}</span>
                </a>
            </li>
        </ul>
    </nav>
`;

// フッター
const footerContent = `
    <div class="footer__inner" role="contentinfo">
        <div class="footer__left">
            <address class="footer__address">
                <a href="mailto:nsk.aizu@gmail.com" class="footer__mail">nsk.aizu [at] gmail.com</a>
            </address>
        </div>
        <div class="footer__right">
            <div class="footer__socials">
                <a href="https://x.com/NSK_AIZU" target="_blank" class="footer__social-link">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.instagram.com/nsk_aizu_press/" target="_blank" class="footer__social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                </svg>
                </a>
                <a href="#" class="footer__social-link">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
            </div>
            <small class="footer__copyright">&copy; 2025 NPO NSK_AIZU. All Rights Reserved.</small>
        </div>
    </div>
`;

// ==========================================
// 初期化処理
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. HTMLを挿入
    const headerEl = document.getElementById('common-header');
    const footerEl = document.getElementById('common-footer');

    if (headerEl) headerEl.innerHTML = headerContent;
    if (footerEl) footerEl.innerHTML = footerContent;

    // 2. メニューボタンの機能実装
    const menuBtn = document.getElementById('js-menu-btn');
    const globalNav = document.getElementById('js-global-nav');
    
    if (menuBtn && globalNav) {
        menuBtn.addEventListener('click', () => {
            const isOpen = menuBtn.classList.toggle('is-open');
            globalNav.classList.toggle('is-active');
            document.body.classList.toggle('is-fixed');

            // Update aria-expanded state and label
            menuBtn.setAttribute('aria-expanded', isOpen.toString());
            menuBtn.setAttribute('aria-label',
                isOpen
                    ? (isEn ? 'Close navigation menu' : 'ナビゲーションメニューを閉じる')
                    : (isEn ? 'Open navigation menu' : 'ナビゲーションメニューを開く')
            );
        });

        const navLinks = globalNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('is-open');
                globalNav.classList.remove('is-active');
                document.body.classList.remove('is-fixed');

                // Reset aria-expanded state and label
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.setAttribute('aria-label',
                    isEn ? 'Open navigation menu' : 'ナビゲーションメニューを開く'
                );
            });
        });
    }

    // 3. お問い合わせフォーム
    const form = document.getElementById("contact-form");
    const statusEl = document.getElementById("form-status");

    if (form) {
        const FORM_ENDPOINT = form.action;
        const REDIRECT_TO = isEn ? "index.html" : "../index.html"; 
        const REDIRECT_DELAY_MS = 2000;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            statusEl.textContent = isEn ? "Sending..." : "送信中…";
            statusEl.className = "form-status";
            statusEl.removeAttribute('role');
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            try {
                const formData = new FormData(form);
                const res = await fetch(FORM_ENDPOINT, {
                    method: "POST",
                    body: formData,
                    headers: { "Accept": "application/json" },
                });

                if (res.ok) {
                    statusEl.textContent = isEn ? "Sent successfully. Redirecting..." : "送信しました。トップページに戻ります。";
                    statusEl.className = "form-status form-status--success";
                    form.reset();
                    setTimeout(() => { window.location.href = REDIRECT_TO; }, REDIRECT_DELAY_MS);
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    const errorMsg = errorData.error || (isEn ? "Failed to send. Please try again." : "送信に失敗しました。もう一度お試しください。");
                    statusEl.textContent = errorMsg;
                    statusEl.className = "form-status form-status--error";
                    statusEl.setAttribute('role', 'alert');
                }
            } catch (err) {
                statusEl.textContent = isEn ? "Connection error. Please check your internet connection and try again." : "通信エラーで送信できませんでした。インターネット接続を確認してもう一度お試しください。";
                statusEl.className = "form-status form-status--error";
                statusEl.setAttribute('role', 'alert');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // 4. ファビコンの自動挿入
    const head = document.head;
    // ファビコン用の相対パス（isEn判定済み）
    const relativePath = path; 

    const faviconTags = `
        <link rel="apple-touch-icon" sizes="180x180" href="${relativePath}apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="${relativePath}favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="${relativePath}favicon-16x16.png">
        <link rel="manifest" href="${relativePath}site.webmanifest">
        <link rel="shortcut icon" href="${relativePath}favicon.ico">
        <meta name="theme-color" content="#000000">
    `;
    head.insertAdjacentHTML('beforeend', faviconTags);
});

/* -------------------------------------------------------
   microCMS 連携処理
------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    
    // ▼▼▼ 設定エリア ▼▼▼
    const SERVICE_DOMAIN = "s1260097"; 
    const API_KEY = "wmJ9w2bf00HbvmHmWBwUpTa63v4c7v1kzvJG"; 
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    // ---------------------------------------------------
    // 1. ニュース一覧ページ用 (news.html)
    // ---------------------------------------------------
    const newsContainer = document.getElementById('js-news-list');
    
    if (newsContainer) {
        // 全件取得 (件数制限なし)
        const API_ENDPOINT = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/news?orders=-date`;

        fetch(API_ENDPOINT, {
            headers: { "X-MICROCMS-API-KEY": API_KEY }
        })
        .then(response => response.json())
        .then(data => {
            if (data.contents.length === 0) {
                newsContainer.innerHTML = '<p style="color:#ccc; text-align:center;">お知らせはありません。</p>';
                return;
            }
            let html = "";
            data.contents.forEach(article => {
                const date = new Date(article.date);
                const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
                const descHtml = article.description ? `<p class="news-archive-desc">${article.description}</p>` : "";

                html += `
                    <article class="news-archive-item">
                        <time class="news-archive-date">${formattedDate}</time>
                        <h3 class="news-archive-title">${article.title}</h3>
                        ${descHtml}
                    </article>
                `;
            });
            newsContainer.innerHTML = html;
        })
        .catch(error => {
            console.error(error);
            newsContainer.innerHTML = '<p style="color:red; text-align:center;">読み込み失敗</p>';
        });
    }

    // ---------------------------------------------------
    // 2. トップページ用 (index.html)
    // ---------------------------------------------------
    const homeNewsContainer = document.getElementById('js-news-list-home');

    if (homeNewsContainer) {
        // ★ポイント： limit=2 をつけて「最新2件」だけ取得
        const API_ENDPOINT_HOME = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/news?orders=-date&limit=2`;

        fetch(API_ENDPOINT_HOME, {
            headers: { "X-MICROCMS-API-KEY": API_KEY }
        })
        .then(response => response.json())
        .then(data => {
            if (data.contents.length === 0) {
                homeNewsContainer.innerHTML = '<li style="color:#ccc;">お知らせはありません</li>';
                return;
            }
            let html = "";
            data.contents.forEach(article => {
                const date = new Date(article.date);
                // 英語ページなら "Nov 25, 2025" のように表示を変えるなどの工夫も可能ですが
                // ここではシンプルに "YYYY/MM/DD" に統一します
                const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

                // index.html用のHTML構造 (liタグ) で生成
                html += `
                    <li class="news-item">
                        <time class="news-date">${formattedDate}</time>
                        <p class="news-title">${article.title}</p>
                    </li>
                `;
            });
            homeNewsContainer.innerHTML = html;
        })
        .catch(error => {
            console.error(error);
            homeNewsContainer.innerHTML = '<li style="color:red;">読み込み失敗</li>';
        });
    }
});
