// ==========================================
// ギャラリーページ（リニューアル版）
// グリッド表示 + ライトボックス
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const isEn = location.pathname.includes('/en/');
    const dataPath = '/data/gallery-data.json';

    // DOM
    const gridEl = document.getElementById('gallery-grid');
    const activityGridEl = document.getElementById('activity-grid');
    const lightboxEl = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxType = document.getElementById('lightbox-type');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let artworks = [];
    let currentIndex = 0;

    // サムネイルパスを生成（image パスの最後のフォルダに /thumb を挿入）
    function getThumbPath(imagePath) {
        const lastSlash = imagePath.lastIndexOf('/');
        return imagePath.substring(0, lastSlash) + '/thumb' + imagePath.substring(lastSlash);
    }

    // ==========================================
    // グリッド描画
    // ==========================================
    function renderArtGrid(data) {
        artworks = data;
        gridEl.innerHTML = '';

        data.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', item.title + 'を拡大表示');

            const title = (isEn && item.title_en) ? item.title_en : item.title;
            const thumbSrc = getThumbPath(item.image);

            card.innerHTML = `
                <img class="gallery-card__image" src="${thumbSrc}" alt="${title}" loading="lazy">
                <div class="gallery-card__overlay">
                    <p class="gallery-card__title">${title}</p>
                </div>
            `;

            card.addEventListener('click', () => openLightbox(index));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });

            gridEl.appendChild(card);
        });
    }

    function renderActivityGrid(photos) {
        if (!activityGridEl || !photos || photos.length === 0) return;
        activityGridEl.innerHTML = '';

        photos.forEach((photo) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';

            card.innerHTML = `
                <img class="gallery-card__image" src="${photo.image}" alt="${photo.title}" loading="lazy">
                <div class="gallery-card__overlay">
                    <p class="gallery-card__title">${photo.title}</p>
                </div>
            `;

            activityGridEl.appendChild(card);
        });
    }

    // ==========================================
    // ライトボックス
    // ==========================================
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxContent();
        lightboxEl.style.display = 'flex';
        // トリガーアニメーション
        requestAnimationFrame(() => {
            lightboxEl.classList.add('is-visible');
        });
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxEl.classList.remove('is-visible');
        setTimeout(() => {
            lightboxEl.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const item = artworks[currentIndex];
        if (!item) return;

        const title = (isEn && item.title_en) ? item.title_en : item.title;
        const description = (isEn && item.description_en) ? item.description_en : item.description;

        lightboxImage.src = item.image;
        lightboxImage.alt = title;

        let typeText = '';
        if (item.type === 'art') {
            typeText = isEn ? "Grandmother's Painting" : '祖母の絵';
        } else if (item.type === 'stamp') {
            typeText = isEn ? "Mother's Stamp" : '母の切手';
        }
        lightboxType.textContent = typeText;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
    }

    function goNext() {
        currentIndex = (currentIndex + 1) % artworks.length;
        updateLightboxContent();
    }

    function goPrev() {
        currentIndex = (currentIndex - 1 + artworks.length) % artworks.length;
        updateLightboxContent();
    }

    // イベントリスナー
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', goNext);
    lightboxPrev.addEventListener('click', goPrev);

    // 背景クリックで閉じる
    lightboxEl.addEventListener('click', (e) => {
        if (e.target === lightboxEl) closeLightbox();
    });

    // キーボード操作
    document.addEventListener('keydown', (e) => {
        if (lightboxEl.style.display === 'none') return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
    });

    // ==========================================
    // データ読み込み
    // ==========================================
    async function init() {
        try {
            // 祖母の絵データ
            const response = await fetch(dataPath);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            if (!data || data.length === 0) throw new Error('No data');
            renderArtGrid(data);

            // 活動写真データ
            const actRes = await fetch('/data/activity-photos.json');
            if (actRes.ok) {
                const actData = await actRes.json();
                renderActivityGrid(actData);
            }

        } catch (error) {
            console.error('Gallery load error:', error);
            gridEl.innerHTML = '<p class="gallery-loading">作品の読み込みに失敗しました。</p>';
        }
    }

    init();
});
