// ==========================================
// サイト共通設定
// ==========================================
// ルート相対パス（画像用）
const path = '/images/';

// グローバルナビの項目（ここを編集すれば全ページのメニューが変わる）
const navItems = [
    { en: 'TOP',      jp: 'トップページ',   link: '#top' },
    { en: 'MESSAGE',  jp: 'ごあいさつ',     link: '#greeting' },
    { en: 'HISTORY',  jp: 'これまでの歩み', link: '#history' },
    { en: 'PROJECTS', jp: '活動',           link: '#projects' },
    { en: 'CONTACT',  jp: 'お問い合わせ',   link: '#contact' }
];


// ==========================================
// 共通パーツのHTML定義
// ==========================================

// ヘッダー + 全画面メニュー
const headerContent = `
    <a href="#main-content" class="skip-link">メインコンテンツへスキップ</a>
    <div class="header__inner">
        <div class="header__logo">
            <a href="#top" aria-label="ページの先頭へ戻る">
                <img src="${path}logo-dark-trim.png" alt="NSK_AIZU">
            </a>
        </div>
        <div class="header__nav-area">
            <button class="header__menu-btn"
                    id="js-menu-btn"
                    aria-label="ナビゲーションメニューを開く"
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
         aria-label="メインナビゲーション">
        <ul class="global-nav__list">
${navItems.map(item => `            <li class="global-nav__item">
                <a href="${item.link}">
                    <span class="global-nav__en">- ${item.en} -</span>
                    <span class="global-nav__jp">${item.jp}</span>
                </a>
            </li>`).join('\n')}
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
                   aria-label="X (Twitter) でフォロー"
                   class="footer__social-link">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.instagram.com/nsk_aizu_press/"
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="Instagram でフォロー"
                   class="footer__social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                </svg>
                </a>
                <a href="https://www.youtube.com/@NSK_AIZU"
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="YouTube チャンネルを見る"
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
                    ? ('ナビゲーションメニューを閉じる')
                    : ('ナビゲーションメニューを開く')
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
                    'ナビゲーションメニューを開く'
                );
            });
        });
    }

    // 3. お問い合わせフォーム
    const form = document.getElementById("contact-form");
    const statusEl = document.getElementById("form-status");

    if (form) {
        const FORM_ENDPOINT = form.action;
        const REDIRECT_TO = "/"; 
        const REDIRECT_DELAY_MS = 2000;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            statusEl.textContent = "送信中…";
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
                    statusEl.textContent = "送信しました。トップページに戻ります。";
                    statusEl.className = "form-status form-status--success";
                    form.reset();
                    setTimeout(() => { window.location.href = REDIRECT_TO; }, REDIRECT_DELAY_MS);
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    const errorMsg = errorData.error || ("送信に失敗しました。もう一度お試しください。");
                    statusEl.textContent = errorMsg;
                    statusEl.className = "form-status form-status--error";
                    statusEl.setAttribute('role', 'alert');
                }
            } catch (err) {
                statusEl.textContent = "通信エラーで送信できませんでした。インターネット接続を確認してもう一度お試しください。";
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

    // 表示先が無ければ取得しない（NEWSを廃止したため通常は何もしない）
    if (!document.getElementById('js-news-list') && !document.getElementById('js-news-list-home')) return;

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

});

// ==========================================
// BGM トグルプレイヤー（ホームページ専用）
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const bgm = document.getElementById('js-bgm');
    const toggleBtn = document.getElementById('js-bgm-toggle');
    if (!bgm || !toggleBtn) return;

    const iconOff = toggleBtn.querySelector('.bgm-toggle__icon--off');
    const iconOn = toggleBtn.querySelector('.bgm-toggle__icon--on');

    // 音量をやや控えめに
    bgm.volume = 0.3;

    function updateUI(playing) {
        if (playing) {
            toggleBtn.classList.add('is-playing');
            toggleBtn.setAttribute('aria-label', 'BGMを停止する');
            iconOff.style.display = 'none';
            iconOn.style.display = '';
        } else {
            toggleBtn.classList.remove('is-playing');
            toggleBtn.setAttribute('aria-label', 'BGMを再生する');
            iconOff.style.display = '';
            iconOn.style.display = 'none';
        }
    }

    toggleBtn.addEventListener('click', () => {
        if (bgm.paused) {
            bgm.play().then(() => updateUI(true)).catch(() => {});
        } else {
            bgm.pause();
            updateUI(false);
        }
    });

    // タブ非表示時は一時停止
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !bgm.paused) {
            bgm.pause();
            updateUI(false);
        }
    });
});



// ==========================================
// 写真プレースホルダー（画像が未設置のとき、置き場所を明示）
// ==========================================
function showPhotoPlaceholder(img) {
    if (img.dataset.placeholderShown) return;
    img.dataset.placeholderShown = '1';

    const box = document.createElement('div');
    box.className = 'photo-placeholder';
    box.innerHTML = `
        <span class="photo-placeholder__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <circle cx="8.5" cy="10" r="1.5"/>
                <path d="M21 15l-5-5L5 19"/>
            </svg>
        </span>
        <span class="photo-placeholder__title">${img.dataset.placeholder || '写真'}</span>
        <code class="photo-placeholder__file">${img.dataset.filename || ''}</code>
        <span class="photo-placeholder__note">${img.dataset.note || ''}</span>
    `;
    img.replaceWith(box);
}

// HTMLに直接書かれた画像は common.js の読み込み前に失敗しうるため、
// 読み込み完了後にもう一度チェックする
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('img[data-placeholder]').forEach(img => {
        if (img.complete && img.naturalWidth === 0) showPhotoPlaceholder(img);
    });
});

// ==========================================
// プロジェクト一覧（data/projects.json）
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const fieldEl = document.getElementById('js-projects-field');
    const beyondEl = document.getElementById('js-projects-beyond');
    if (!fieldEl && !beyondEl) return;

    fetch('/data/projects.json')
        .then(res => res.json())
        .then(data => {
            const render = (items) => items.map(p => `
                <article class="project-card">
                    <div class="project-card__media">
                        <img src="${p.image}" alt="${p.title}"
                             data-placeholder="${p.title}${p.place ? '（' + p.place + '）' : ''}の写真"
                             data-filename="${p.image}"
                             data-note="${p.imageNote || ''}"
                             onerror="showPhotoPlaceholder(this)">
                    </div>
                    <div class="project-card__body">
                        <h4 class="project-card__title">
                            ${p.title}${p.place ? `<span class="project-card__place">${p.place}</span>` : ''}
                        </h4>
                        ${p.badge ? `<p class="project-card__badge">${p.badge}</p>` : ''}
                        ${p.body.map(t => `<p class="project-card__text">${t}</p>`).join('')}
                        ${p.link ? `<a class="project-card__link" href="${p.link.url}" target="_blank" rel="noopener noreferrer">${p.link.label} →</a>` : ''}
                    </div>
                </article>
            `).join('');

            const pub = data.filter(p => p.published);
            if (fieldEl)  fieldEl.innerHTML  = render(pub.filter(p => p.group === 'field'));
            if (beyondEl) beyondEl.innerHTML = render(pub.filter(p => p.group === 'beyond'));
        })
        .catch(() => {
            if (fieldEl) fieldEl.innerHTML = '<p class="project-error">プロジェクト情報の読み込みに失敗しました。</p>';
        });
});

// ==========================================
// これまでの歩み（data/timeline-data.json）
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const listEl = document.getElementById('js-timeline-list');
    if (!listEl) return;

    fetch('/data/timeline-data.json')
        .then(res => res.json())
        .then(data => {
            listEl.innerHTML = data.map(item => `
                <div class="history-item">
                    <time class="history-item__date">${item.date}</time>
                    <div class="history-item__body">
                        <h3 class="history-item__title">${item.title}</h3>
                        ${item.desc ? `<p class="history-item__desc">${item.desc}</p>` : ''}
                    </div>
                </div>
            `).join('');
        })
        .catch(() => {
            listEl.innerHTML = '<p class="project-error">読み込みに失敗しました。</p>';
        });
});


// ==========================================
// ページ内スクロール（1ページ構成）
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const HEADER_OFFSET = 80;

    const scrollToId = (id) => {
        if (id === 'top' || id === '') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return true;
        }
        const target = document.getElementById(id);
        if (!target) return false;
        const y = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return true;
    };

    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href').slice(1);
        if (scrollToId(id)) {
            e.preventDefault();
            if (id) history.replaceState(null, '', '#' + id);
        }

        // 応援カードから来た場合、件名を先に入れておく
        const subject = a.dataset.subject;
        if (subject) {
            const field = document.getElementById('subject');
            if (field) field.value = subject;
        }
    });

    // 別ページや外部から #xxx 付きで開かれたときの位置補正
    if (location.hash.length > 1) {
        setTimeout(() => scrollToId(location.hash.slice(1)), 300);
    }
});
