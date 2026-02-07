// ==========================================
// ギャラリーページのメインロジック
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // 言語判定
    const isEn = location.pathname.includes('/en/');

    // データファイルのパス
    const dataPath = isEn ? '../data.json' : 'data.json';

    // DOM要素の取得
    const loadingEl = document.getElementById('gallery-loading');
    const containerEl = document.getElementById('gallery-container');
    const errorEl = document.getElementById('gallery-error');
    const bgEl = document.getElementById('gallery-bg');
    const typeEl = document.getElementById('gallery-type');
    const titleEl = document.getElementById('gallery-title');
    const descriptionEl = document.getElementById('gallery-description');
    const yearEl = document.getElementById('gallery-year');

    /**
     * 日付ベースのシード値から疑似乱数を生成する関数
     * @param {string} seed - シード値（YYYY-MM-DD形式の日付文字列）
     * @returns {number} - 0から1の間の疑似乱数
     */
    function seededRandom(seed) {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash = hash & hash; // 32bit整数に変換
        }
        const x = Math.sin(hash) * 10000;
        return x - Math.floor(x);
    }

    /**
     * 今日の日付を YYYY-MM-DD 形式で取得
     * @returns {string} - 今日の日付文字列
     */
    function getTodayString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * 日付をシードとして配列からランダムに1つ選ぶ
     * @param {Array} array - データ配列
     * @param {string} dateStr - 日付文字列
     * @returns {Object} - 選択されたアイテム
     */
    function selectDailyItem(array, dateStr) {
        const random = seededRandom(dateStr);
        const index = Math.floor(random * array.length);
        return array[index];
    }

    /**
     * データを読み込んで表示する
     */
    async function loadAndDisplayGallery() {
        try {
            // データの読み込み
            const response = await fetch(dataPath);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            if (!data || data.length === 0) {
                throw new Error('No data available');
            }

            // 今日の日付を取得
            const todayStr = getTodayString();

            // 今日の作品を選択
            const todayItem = selectDailyItem(data, todayStr);

            // 作品の表示
            displayArtwork(todayItem);

            // ローディングを非表示にし、コンテンツを表示
            loadingEl.style.display = 'none';
            containerEl.style.display = 'block';

        } catch (error) {
            console.error('Error loading gallery data:', error);
            loadingEl.style.display = 'none';
            errorEl.style.display = 'block';
        }
    }

    /**
     * 作品を画面に表示する
     * @param {Object} item - 作品データオブジェクト
     */
    function displayArtwork(item) {
        // 背景画像の設定
        bgEl.style.backgroundImage = `url('${isEn ? '../' : ''}${item.image}')`;
        bgEl.style.backgroundSize = '25%';
        bgEl.style.backgroundPosition = 'center';
        bgEl.style.backgroundRepeat = 'no-repeat';

        // タイプの表示
        let typeText = '';
        if (item.type === 'art') {
            typeText = isEn ? 'Grandmother\'s Painting' : '祖母の絵';
        } else if (item.type === 'stamp') {
            typeText = isEn ? 'Mother\'s Stamp' : '母の切手';
        }
        typeEl.textContent = typeText;

        // タイトルと説明の表示
        if (isEn && item.title_en) {
            titleEl.textContent = item.title_en;
            descriptionEl.textContent = item.description_en || item.description;
        } else {
            titleEl.textContent = item.title;
            descriptionEl.textContent = item.description;
        }

        // 制作年の表示
        if (item.year) {
            yearEl.textContent = item.year;
        } else {
            yearEl.textContent = '';
        }
    }

    // ページ読み込み時にギャラリーを表示
    loadAndDisplayGallery();
});
