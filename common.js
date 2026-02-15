// ==========================================
// 言語判定とパス設定
// ==========================================
// URLに '/en/' が含まれているかチェック
const isEn = location.pathname.includes('/en/');

// galleryページかどうかをチェック
const isGallery = location.pathname.includes('/gallery/');

// ルート相対パス（画像用）
const path = '/images/';

// ページごとのファイル名を取得（言語切り替え用）
const currentFile = location.pathname.split('/').pop() || 'index.html';

// 言語別のテキスト設定（すべてルート相対パス）
const langData = {
    ja: {
        top: 'トップページ',
        vision: 'ビジョン',
        about: '私たちについて',
        news: 'お知らせ',
        gallery: '日めくりギャラリー',
        rice: '画面de田んぼ',
        voice: '仲間の声',
        diary: '活動日記',
        support: '応援する',
        contact: 'お問い合わせ',
        education: '教育支援',
        topLink: '/',
        visionLink: '/vision.html',
        aboutLink: '/about.html',
        newsLink: '/news.html',
        galleryLink: '/gallery/',
        riceLink: '/rice_calc.html',
        voiceLink: '/voice.html',
        diaryLink: '/diary.html',
        supportLink: '/support.html',
        contactLink: '/contact.html',
        educationLink: '/education/',
        switchJaClass: isEn ? '' : 'is-active',
        switchEnClass: isEn ? 'is-active' : '',
        switchJaLink: isEn ? '/' + currentFile : '#',
        switchEnLink: isEn ? '#' : '/en/' + currentFile
    },
    en: {
        top: 'HOME',
        vision: 'OUR VISION',
        about: 'WHO WE ARE',
        news: 'NEWS',
        gallery: 'DAILY GALLERY',
        rice: 'RICE CALCULATOR',
        voice: 'VOICES',
        diary: 'DIARY',
        support: 'SUPPORT US',
        contact: 'GET IN TOUCH',
        education: 'EDUCATION',
        topLink: '/en/',
        visionLink: '/en/vision.html',
        aboutLink: '/en/about.html',
        newsLink: '/en/news.html',
        galleryLink: '/gallery/en/',
        riceLink: '/en/rice_calc.html',
        voiceLink: '/en/voice.html',
        diaryLink: '/en/diary.html',
        supportLink: '/en/support.html',
        contactLink: '/en/contact.html',
        educationLink: '/education/',
        switchJaClass: '',
        switchEnClass: 'is-active',
        switchJaLink: '/' + currentFile,
        switchEnLink: '#'
    }
};

// 現在の言語データを選択
const txt = isEn ? langData.en : langData.ja;

// galleryページの言語切り替えリンク
if (isGallery) {
    if (isEn) {
        txt.switchJaLink = '/gallery/';
    } else {
        txt.switchEnLink = '/gallery/en/';
    }
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
                <a href="${txt.aboutLink}">
                    <span class="global-nav__en">- ABOUT US -</span>
                    <span class="global-nav__jp">${txt.about}</span>
                </a>
            </li>
            <li class="global-nav__item">
                <a href="${txt.newsLink}">
                    <span class="global-nav__en">- NEWS -</span>
                    <span class="global-nav__jp">${txt.news}</span>
                </a>
            </li>
            <li class="global-nav__item">
                <a href="${txt.supportLink}">
                    <span class="global-nav__en">- SUPPORT -</span>
                    <span class="global-nav__jp">${txt.support}</span>
                </a>
            </li>
            <li class="global-nav__item">
                <a href="${txt.voiceLink}">
                    <span class="global-nav__en">- VOICE -</span>
                    <span class="global-nav__jp">${txt.voice}</span>
                </a>
            </li>
            <li class="global-nav__item">
                <a href="${txt.galleryLink}">
                    <span class="global-nav__en">- GALLERY -</span>
                    <span class="global-nav__jp">${txt.gallery}</span>
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
                <a href="https://x.com/NSK_AIZU"
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="${isEn ? 'Follow us on X (Twitter)' : 'X (Twitter) でフォロー'}"
                   class="footer__social-link">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.instagram.com/nsk_aizu_press/"
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="${isEn ? 'Follow us on Instagram' : 'Instagram でフォロー'}"
                   class="footer__social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                </svg>
                </a>
                <a href="https://www.youtube.com/@NSK_AIZU"
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="${isEn ? 'Visit our YouTube channel' : 'YouTube チャンネルを見る'}"
                   class="footer__social-link">
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
        const REDIRECT_TO = isEn ? "/en/" : "/"; 
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

    const faviconTags = `
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="theme-color" content="#000000">
    `;
    head.insertAdjacentHTML('beforeend', faviconTags);
});

/* -------------------------------------------------------
   note RSS 連携処理
   (旧 microCMS を note.com/terushon の RSS に置き換え)
------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

    // ▼▼▼ 設定エリア ▼▼▼
    const NOTE_API = "/api/note-rss"; // Cloudflare Pages Function でプロキシ
    const NOTE_URL = "https://note.com/terushon";
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    // 共通: note RSS データ取得（1回だけfetchして複数箇所で使い回す）
    const noteDataPromise = fetch(NOTE_API)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => data.articles || [])
        .catch(err => {
            console.error("note RSS fetch error:", err);
            return [];
        });

    // ---------------------------------------------------
    // 1. ニュース一覧ページ用 (news.html)
    // ---------------------------------------------------
    const newsContainer = document.getElementById('js-news-list');

    if (newsContainer) {
        noteDataPromise.then(articles => {
            if (articles.length === 0) {
                newsContainer.innerHTML = '<p style="color:#ccc; text-align:center;">お知らせはありません。</p>';
                return;
            }
            let html = "";
            articles.forEach(article => {
                const date = new Date(article.pubDate);
                const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
                const descHtml = article.description
                    ? `<p class="news-archive-desc">${article.description}</p>` : "";

                html += `
                    <a href="${article.link}" target="_blank" rel="noopener noreferrer"
                       class="news-archive-item news-archive-item--link">
                        <time class="news-archive-date">${formattedDate}</time>
                        <h3 class="news-archive-title">${article.title}</h3>
                        ${descHtml}
                    </a>
                `;
            });
            newsContainer.innerHTML = html;
        });
    }

    // ---------------------------------------------------
    // 2. トップページ用 (index.html) — 最新1件をカード表示
    // ---------------------------------------------------
    const homeNewsContainer = document.getElementById('js-news-list-home');

    if (homeNewsContainer) {
        noteDataPromise.then(articles => {
            if (articles.length === 0) {
                homeNewsContainer.innerHTML = `<a href="${NOTE_URL}" target="_blank" rel="noopener noreferrer" style="color:#999; font-size:13px;">noteで最新情報をチェック</a>`;
                return;
            }
            const article = articles[0];
            const date = new Date(article.pubDate);
            const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            const thumb = article.thumbnail || '';

            homeNewsContainer.innerHTML = `
                <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="news-card-home">
                    ${thumb ? `<img class="news-card-home__img" src="${thumb}" alt="" loading="lazy">` : ''}
                    <div class="news-card-home__body">
                        <time class="news-card-home__date">${formattedDate}</time>
                        <span class="news-card-home__title">${article.title}</span>
                    </div>
                </a>
            `;
        });
    }

    // ---------------------------------------------------
    // 3. VISIONカード背景画像ローテーション (index.html)
    //    /images/activity/ 内の画像を一定間隔で切り替え
    // ---------------------------------------------------
    const visionBg = document.getElementById('js-vision-bg');

    if (visionBg) {
        // 手動で管理する活動写真リスト
        // 新しい写真を追加するときはここにパスを追加するだけ
        const activityImages = [
            '/images/vision.jpg',
            '/images/activity/001.jpg',
            '/images/activity/002.jpg',
            '/images/activity/003.jpg',
            '/images/activity/004.jpg',
            '/images/activity/005.jpg',
        ];

        // 2枚目以降をバックグラウンドで事前読み込み
        activityImages.slice(1).forEach(src => {
            const img = new Image();
            img.src = src;
        });

        // 画像が2枚以上あるときだけローテーション
        if (activityImages.length > 1) {
            let currentIndex = 0;
            const INTERVAL = 7000; // 7秒ごとに切り替え

            setInterval(() => {
                currentIndex = (currentIndex + 1) % activityImages.length;
                // フェードアウト → 画像切替 → フェードイン
                visionBg.style.opacity = '0';
                setTimeout(() => {
                    visionBg.style.backgroundImage = `url('${activityImages[currentIndex]}')`;
                    visionBg.style.opacity = '0.6';
                }, 500);
            }, INTERVAL);
        }
    }
});

// ==========================================
// 目標マップ モーダル
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById('js-goals-trigger');
    const modal = document.getElementById('js-goals-modal');
    if (!trigger || !modal) return;

    const overlay = document.getElementById('js-goals-overlay');
    const closeBtn = document.getElementById('js-goals-close');
    const list = document.getElementById('js-goals-list');
    let loaded = false;

    function loadGoals() {
        if (loaded) return;
        loaded = true;
        fetch('/data/goals-data.json')
            .then(res => res.json())
            .then(data => {
                list.innerHTML = data.map(g => {
                    const pct = Math.round((g.current / g.max) * 100);
                    const isZero = g.current === 0;
                    return `<div class="goal-item">
                        <div class="goal-item__header">
                            <span class="goal-item__label">${g.label}</span>
                            <span class="goal-item__fraction"><strong>${g.current}</strong> / ${g.max}${g.unit}</span>
                        </div>
                        <div class="goal-item__bar">
                            <div class="goal-item__fill${isZero ? ' goal-item__fill--zero' : ''}" style="width:${pct}%"></div>
                        </div>
                        <span class="goal-item__note">${g.note}</span>
                    </div>`;
                }).join('');
            })
            .catch(() => {
                list.innerHTML = '<p style="color:#999;padding:16px 0;text-align:center;">データを読み込めませんでした</p>';
            });
    }

    function openModal() {
        loadGoals();
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    trigger.addEventListener('click', openModal);
    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
        }
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
});

// ==========================================
// 活動タイムライン モーダル
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById('js-timeline-trigger');
    const modal = document.getElementById('js-timeline-modal');
    if (!trigger || !modal) return;

    const overlay = document.getElementById('js-timeline-overlay');
    const closeBtn = document.getElementById('js-timeline-close');
    const list = document.getElementById('js-timeline-list');
    let loaded = false;

    function loadTimeline() {
        if (loaded) return;
        loaded = true;
        fetch('/data/timeline-data.json')
            .then(res => res.json())
            .then(data => {
                list.innerHTML = data.map(item =>
                    `<div class="timeline-item">
                        <span class="timeline-item__date">${item.date}</span>
                        <span class="timeline-item__title">${item.title}</span>
                        <span class="timeline-item__desc">${item.desc}</span>
                    </div>`
                ).join('');
            })
            .catch(() => {
                list.innerHTML = '<p style="color:#999;padding:16px 0;text-align:center;">データを読み込めませんでした</p>';
            });
    }

    function openModal() {
        loadTimeline();
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    trigger.addEventListener('click', openModal);
    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
        }
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
});

// ==========================================
// 活動○ヶ月目を自動計算（開始: 2025年12月）
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById('js-months-count');
    if (!el) return;

    const startYear = 2025;
    const startMonth = 12; // 12月
    const now = new Date();
    const months = (now.getFullYear() - startYear) * 12 + (now.getMonth() + 1) - startMonth + 1;
    el.textContent = Math.max(1, months);
});

// ==========================================
// お世話になった人 モーダル
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById('js-thanks-trigger');
    const modal = document.getElementById('js-thanks-modal');
    if (!trigger || !modal) return;

    const overlay = document.getElementById('js-thanks-overlay');
    const closeBtn = document.getElementById('js-thanks-close');
    const thanksList = modal.querySelector('.thanks-list');

    // JSON からリストを読み込み
    fetch('/data/thanks-data.json')
        .then(res => res.json())
        .then(data => {
            // 数字バーの人数も自動更新
            const valueEl = trigger.querySelector('.top-numbers__value');
            if (valueEl) valueEl.textContent = data.length;

            thanksList.innerHTML = data.map(p =>
                `<li class="thanks-list__item">
                    <span class="thanks-list__name">${p.name}</span>
                    <span class="thanks-list__desc">${p.desc}</span>
                </li>`
            ).join('');
        })
        .catch(() => {
            thanksList.innerHTML = '<li style="color:#999;padding:16px 0;">データを読み込めませんでした</li>';
        });

    function openModal() {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    trigger.addEventListener('click', openModal);
    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
        }
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
});

// ==========================================
// メンバー モーダル
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById('js-members-trigger');
    const modal = document.getElementById('js-members-modal');
    if (!trigger || !modal) return;

    const overlay = document.getElementById('js-members-overlay');
    const closeBtn = document.getElementById('js-members-close');
    const grid = document.getElementById('js-members-grid');
    let loaded = false;

    function loadMembers() {
        if (loaded) return;
        loaded = true;
        fetch('/data/members-data.json')
            .then(res => res.json())
            .then(data => {
                // 数字バーの人数も自動更新
                const valueEl = trigger.querySelector('.top-numbers__value');
                if (valueEl) valueEl.textContent = data.length;

                grid.innerHTML = data.map(m =>
                    `<div class="member-card">
                        <img class="member-card__photo" src="${m.photo}" alt="${m.name}" loading="lazy" width="80" height="80">
                        <span class="member-card__name">${m.name}</span>
                        <span class="member-card__role">${m.role}</span>
                        <span class="member-card__desc">${m.desc}</span>
                    </div>`
                ).join('');
            })
            .catch(() => {
                grid.innerHTML = '<p style="color:#999;padding:16px 0;text-align:center;">データを読み込めませんでした</p>';
            });
    }

    function openModal() {
        loadMembers();
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    trigger.addEventListener('click', openModal);
    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
        }
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
});
