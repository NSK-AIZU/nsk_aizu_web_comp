/* =========================================
   Activity Diary - microCMS Integration
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ▼ 設定 ▼
    const SERVICE_DOMAIN = 's1260097';
    const API_KEY = 'wmJ9w2bf00HbvmHmWBwUpTa63v4c7v1kzvJG';
    const ENDPOINT = 'activity'; // microCMSに「activity」エンドポイントを作成してください
    // ▲▲▲▲▲▲

    const grid = document.getElementById('js-activity-grid');
    if (!grid) return;

    const API_URL = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}?orders=-date&limit=30`;

    // カテゴリの日本語マッピング
    const categoryLabels = {
        field: '田畑',
        team: 'チーム',
        event: 'イベント'
    };

    // データ取得
    fetch(API_URL, {
        headers: { 'X-MICROCMS-API-KEY': API_KEY }
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    })
    .then(data => {
        if (!data.contents || data.contents.length === 0) {
            // コンテンツがない場合はプレースホルダーを維持
            return;
        }

        let html = '';
        data.contents.forEach(post => {
            const date = new Date(post.date);
            const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
            const category = post.category || 'field';
            const categoryLabel = categoryLabels[category] || category;
            const imageUrl = post.image ? post.image.url : '';
            const description = post.description || '';

            html += `
                <article class="activity-card" data-category="${category}">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${post.title}" class="activity-card__image" loading="lazy">` : '<div class="activity-card__image" style="display:flex;align-items:center;justify-content:center;color:#555;">No Image</div>'}
                    <div class="activity-card__content">
                        <time class="activity-card__date">${formattedDate}</time>
                        <h3 class="activity-card__title">${post.title}</h3>
                        ${description ? `<p class="activity-card__desc">${description}</p>` : ''}
                        <span class="activity-card__category">${categoryLabel}</span>
                    </div>
                </article>
            `;
        });

        grid.innerHTML = html;

        // フィルター機能を有効化
        initFilters();
    })
    .catch(err => {
        // microCMSに「activity」エンドポイントがまだ存在しない場合はプレースホルダーを維持
        console.log('Activity diary: endpoint not yet configured or error:', err.message);
    });

    // フィルター機能
    function initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const cards = grid.querySelectorAll('.activity-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // ボタンのアクティブ状態切り替え
                filterBtns.forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');

                const filter = btn.dataset.filter;

                cards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});
