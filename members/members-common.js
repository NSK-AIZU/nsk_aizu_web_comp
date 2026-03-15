// ==========================================
// メンバーエリア共通 JS
// Supabase クライアント + 認証ガード + ヘッダー
// ==========================================

const SUPABASE_URL = 'https://wiwumonqzyxhkgwmtdte.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpd3Vtb25xenl4aGtnd210ZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDYxNzEsImV4cCI6MjA4ODYyMjE3MX0.AifBX8wVFVcqL8ANfatcGkcuGd1Yfopn_o_O95-T1MY';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 現在ログイン中のユーザー（認証ガード完了後にセットされる）
let currentUser = null;

/**
 * 認証ガード — 未ログインなら /login へリダイレクト
 * @returns {Promise<object>} user
 */
async function requireAuth() {
    const { data: { user }, error } = await sb.auth.getUser();
    if (!user) {
        window.location.href = '/login.html';
        // リダイレクト中に後続処理が走らないよう待機
        await new Promise(() => {});
    }
    currentUser = user;
    return user;
}

/**
 * ログアウト
 */
async function logout() {
    await sb.auth.signOut();
    window.location.href = '/login.html';
}

/**
 * メンバーエリア用ヘッダーを挿入
 */
function renderMembersHeader() {
    const headerEl = document.getElementById('members-header');
    if (!headerEl) return;

    // ユーザーのメールからイニシャルを取得
    const initial = currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U';

    // 名刺ページかどうか判定
    const isMeishi = location.pathname.includes('/meishi');
    const appName = isMeishi ? 'Who_Are_You?' : '';

    headerEl.innerHTML = `
        <div class="m-header__inner${isMeishi ? '' : ' m-header__inner--center'}">
            ${isMeishi ? `<a href="/members/" class="m-header__back" aria-label="ダッシュボードに戻る">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>` : ''}
            <a href="/members/" class="m-header__brand">
                <img src="/images/logo.png" alt="NSK_AIZU" class="m-header__logo">
                ${appName ? `<span class="m-header__app-name">${appName}</span>` : ''}
            </a>
            <div class="m-header__actions">
                <div class="m-header__user" id="js-user-menu">
                    <button type="button" class="m-header__avatar" id="js-avatar-btn">${initial}</button>
                    <div class="m-header__dropdown" id="js-dropdown">
                        <a href="/" class="m-header__dropdown-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6l6-4.5L14 6v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            トップページ
                        </a>
                        <button type="button" id="js-logout-btn" class="m-header__dropdown-item m-header__dropdown-item--logout">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            ログアウト
                        </button>
                    </div>
                </div>
                <button type="button" class="m-header__burger" id="js-m-menu-btn" aria-label="メニューを開く" aria-expanded="false">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
        <nav class="m-header__nav" id="js-m-nav">
            <a href="/members/meishi/new.html" class="m-header__nav-item">新規登録</a>
            <a href="/" class="m-header__nav-item">トップページ</a>
            <button type="button" id="js-logout-btn-mobile" class="m-header__nav-item m-header__nav-item--logout">ログアウト</button>
        </nav>
    `;

    // アバタードロップダウン（デスクトップ）
    const avatarBtn = document.getElementById('js-avatar-btn');
    const dropdown = document.getElementById('js-dropdown');
    avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('is-open');
    });
    document.addEventListener('click', () => dropdown.classList.remove('is-open'));

    // ハンバーガーメニュー（モバイル）
    const menuBtn = document.getElementById('js-m-menu-btn');
    const nav = document.getElementById('js-m-nav');
    menuBtn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        menuBtn.classList.toggle('is-open', isOpen);
        menuBtn.setAttribute('aria-expanded', isOpen.toString());
    });

    // ログアウト
    document.getElementById('js-logout-btn').addEventListener('click', logout);
    document.getElementById('js-logout-btn-mobile').addEventListener('click', logout);
}

// ==========================================
// OCR パーサー（クライアント側）
// ==========================================

/**
 * OCRテキストから名刺情報を解析する
 */
function parseBusinessCard(ocrText) {
    const result = {};
    const lines = ocrText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // メールアドレス
    const emailMatch = ocrText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) result.email = emailMatch[0];

    // URL
    const urlMatch = ocrText.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}(?:\/[^\s]*)*/);
    if (urlMatch && !urlMatch[0].includes('@')) {
        result.website = urlMatch[0].startsWith('http') ? urlMatch[0] : 'https://' + urlMatch[0];
    }

    // FAX（除外用）
    const faxMatch = ocrText.match(/(?:FAX|Fax|fax|ファクス|ファックス)[:\s]?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{3,4}/);

    // 電話番号
    const phoneMatches = ocrText.match(/(?:TEL|Tel|tel|電話|Phone|phone|Ph)?[:\s]?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{3,4}/g);
    if (phoneMatches) {
        const faxStr = faxMatch ? faxMatch[0] : '';
        const phones = phoneMatches.filter(p => !p.match(/FAX|Fax|fax|ファクス|ファックス/) && !faxStr.includes(p));
        const mobileMatch = ocrText.match(/0[789]0[-.\s]?\d{4}[-.\s]?\d{4}/);
        if (mobileMatch) {
            result.mobile = mobileMatch[0].replace(/\s/g, '');
            const landlines = phones.filter(p => !p.match(/0[789]0/));
            if (landlines.length > 0) {
                result.phone = landlines[0].replace(/^(?:TEL|Tel|tel|電話|Phone|phone|Ph)[:\s]?/, '').trim();
            }
        } else if (phones.length > 0) {
            result.phone = phones[0].replace(/^(?:TEL|Tel|tel|電話|Phone|phone|Ph)[:\s]?/, '').trim();
            if (phones.length > 1) result.mobile = phones[1].replace(/^(?:TEL|Tel|tel|電話|Phone|phone|Ph)[:\s]?/, '').trim();
        }
    }

    // 住所
    const addressMatch = ocrText.match(/〒?\s?\d{3}[-ー]\d{4}[\s\S]*?(?:都|道|府|県)[\s\S]*?(?:\d+[-ー]\d+|\d+番)/);
    if (addressMatch) {
        result.address = addressMatch[0].replace(/\s+/g, ' ').trim();
    } else {
        const simpleMatch = ocrText.match(/(?:東京都|北海道|(?:大阪|京都)府|.{2,3}県)[^\n\r]{5,}/);
        if (simpleMatch) result.address = simpleMatch[0].replace(/\s+/g, ' ').trim();
    }

    // 会社名
    const companyKeywords = ['株式会社','有限会社','合同会社','一般社団法人','一般財団法人','NPO法人','特定非営利活動法人','Co.','Inc.','Corp.','Ltd.','LLC'];
    for (const line of lines) {
        if (companyKeywords.some(kw => line.includes(kw))) { result.company = line; break; }
    }

    // 役職
    const positionKeywords = ['代表取締役','取締役','社長','副社長','専務','常務','部長','次長','課長','係長','主任','リーダー','マネージャー','CEO','CTO','CFO','理事長','理事','事務局長','会長'];
    for (const line of lines) {
        if (positionKeywords.some(kw => line.includes(kw))) { result.position = line; break; }
    }

    // 部署
    const deptKeywords = ['部','課','室','グループ','チーム','センター','事業部','営業','開発','企画','総務','人事','経理','広報','事務局'];
    if (!result.department) {
        for (const line of lines) {
            if (deptKeywords.some(kw => line.includes(kw)) && line !== result.company && line !== result.position) {
                result.department = line; break;
            }
        }
    }

    // 氏名推定
    const usedValues = [result.company, result.department, result.position, result.email, result.phone, result.mobile, result.address, result.website].filter(Boolean);
    const nameCandidates = lines.filter(line => {
        if (usedValues.some(v => line.includes(v))) return false;
        if ((line.match(/\d/g) || []).length > 3) return false;
        if (line.includes('@') || line.match(/https?:|www\./) || line.match(/FAX|TEL|Tel|Fax|電話|ファクス/)) return false;
        if (line.length > 20 || line.length < 2) return false;
        return true;
    });

    if (nameCandidates.length > 0) {
        const nameLine = nameCandidates[0];
        const parts = nameLine.split(/[\s　]+/);
        if (parts.length >= 2) {
            result.last_name = parts[0];
            result.first_name = parts.slice(1).join(' ');
        } else {
            result.last_name = nameLine;
        }
        // カナ候補
        const nameIndex = lines.indexOf(nameLine);
        if (nameIndex >= 0 && nameIndex + 1 < lines.length) {
            const nextLine = lines[nameIndex + 1];
            if (nextLine.match(/^[ァ-ヶー\s　]+$/)) {
                const kanaParts = nextLine.split(/[\s　]+/);
                if (kanaParts.length >= 2) {
                    result.last_name_kana = kanaParts[0];
                    result.first_name_kana = kanaParts.slice(1).join(' ');
                }
            }
        }
    }

    return result;
}
