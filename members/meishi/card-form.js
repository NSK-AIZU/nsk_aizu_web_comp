// ==========================================
// 名刺フォーム共通ロジック（new.html / edit.html 共用）
// members-common.js が先に読み込まれていること前提
// ==========================================

(async function() {
    await requireAuth();
    renderMembersHeader();

    const loadingEl = document.getElementById('js-loading');
    const contentEl = document.getElementById('js-content');
    const form = document.getElementById('js-card-form');
    const errorEl = document.getElementById('js-form-error');
    const submitBtn = document.getElementById('js-submit-btn');

    // 編集モードかどうか
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('id');
    const isEdit = !!cardId;

    // タグ関連の状態
    let allTags = [];
    let selectedTags = [];
    const TAG_COLORS = ['#EF4444','#F97316','#EAB308','#22C55E','#3B82F6','#8B5CF6','#EC4899','#6B7280'];
    let newTagColor = TAG_COLORS[4];

    // 画像URL
    let cardImageFront = '';
    let cardImageBack = '';

    // 全タグ取得
    const { data: tagsData } = await sb.from('tags').select('*').order('name');
    allTags = tagsData || [];

    // 編集時: カードデータを読み込み
    if (isEdit) {
        const { data: card, error } = await sb
            .from('business_cards')
            .select('*')
            .eq('id', cardId)
            .single();

        if (error || !card) {
            loadingEl.innerHTML = '<p style="color:#ff6b6b;">名刺が見つかりません。</p>';
            return;
        }

        // ページタイトルを変更
        const titleEl = document.querySelector('.m-page-title');
        if (titleEl) titleEl.textContent = '名刺を編集';
        document.title = '名刺を編集 | Who_Are_You? | NSK_AIZU';
        if (submitBtn) submitBtn.textContent = '更新する';

        // フォームに値をセット
        const fields = ['last_name','first_name','last_name_kana','first_name_kana','company','department','position','email','phone','mobile','address','website','memo'];
        fields.forEach(f => {
            const input = form.querySelector(`[name="${f}"]`);
            if (input && card[f]) input.value = card[f];
        });

        // 画像
        cardImageFront = card.card_image_front || '';
        cardImageBack = card.card_image_back || '';
        if (cardImageFront) showPreview('front', cardImageFront);
        if (cardImageBack) showPreview('back', cardImageBack);

        // タグ
        const { data: cardTagsData } = await sb
            .from('card_tags')
            .select('tag_id, tags(*)')
            .eq('card_id', cardId);
        if (cardTagsData) {
            selectedTags = cardTagsData.map(ct => ct.tags).filter(Boolean);
        }
    }

    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
    renderSelectedTags();

    // ==========================================
    // PDF→画像変換
    // ==========================================
    async function convertPdfToImage(file) {
        // pdf.jsがロードされるまで待つ
        let retries = 0;
        while (!window.pdfjsLib && retries < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }
        if (!window.pdfjsLib) {
            throw new Error('PDFライブラリの読み込みに失敗しました');
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        // 高解像度でレンダリング（名刺のOCR精度向上のため）
        const scale = 2;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        // CanvasをBlobに変換
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(new File([blob], file.name.replace(/\.pdf$/i, '.png'), { type: 'image/png' }));
            }, 'image/png');
        });
    }

    // ==========================================
    // 画像アップロード
    // ==========================================
    function setupImageUpload(side) {
        const dropzone = document.getElementById('js-dropzone-' + side);
        const fileInput = document.getElementById('js-file-' + side);
        const removeBtn = document.getElementById('js-remove-' + side);

        dropzone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', async (e) => {
            let file = e.target.files[0];
            if (!file) return;

            // PDFの場合は画像に変換
            const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
            if (isPdf) {
                dropzone.querySelector('p').textContent = 'PDFを変換中...';
                try {
                    file = await convertPdfToImage(file);
                } catch (err) {
                    alert('PDF変換エラー: ' + err.message);
                    dropzone.querySelector('p').textContent = 'クリックして画像/PDFを選択';
                    return;
                }
            }

            // プレビュー表示
            const reader = new FileReader();
            reader.onload = (ev) => showPreview(side, ev.target.result);
            reader.readAsDataURL(file);

            // Supabase Storage にアップロード
            dropzone.querySelector('p').textContent = 'アップロード中...';
            const ext = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const filePath = `cards/${fileName}`;

            const { error } = await sb.storage.from('card-images').upload(filePath, file);
            if (error) {
                alert('アップロードエラー: ' + error.message);
                return;
            }

            const { data: { publicUrl } } = sb.storage.from('card-images').getPublicUrl(filePath);
            if (side === 'front') {
                cardImageFront = publicUrl;
                // OCR表示
                document.getElementById('js-ocr-area').style.display = 'block';
            } else {
                cardImageBack = publicUrl;
            }
        });

        removeBtn.addEventListener('click', () => {
            hidePreview(side);
            fileInput.value = '';
            if (side === 'front') {
                cardImageFront = '';
                document.getElementById('js-ocr-area').style.display = 'none';
            } else {
                cardImageBack = '';
            }
        });
    }

    function showPreview(side, src) {
        const dropzone = document.getElementById('js-dropzone-' + side);
        const preview = document.getElementById('js-preview-' + side);
        const img = document.getElementById('js-preview-img-' + side);
        dropzone.style.display = 'none';
        preview.style.display = 'block';
        img.src = src;
        if (side === 'front') {
            document.getElementById('js-ocr-area').style.display = 'block';
        }
    }

    function hidePreview(side) {
        const dropzone = document.getElementById('js-dropzone-' + side);
        const preview = document.getElementById('js-preview-' + side);
        dropzone.style.display = 'flex';
        preview.style.display = 'none';
    }

    setupImageUpload('front');
    setupImageUpload('back');

    // ==========================================
    // OCR
    // ==========================================
    const ocrBtn = document.getElementById('js-ocr-btn');
    const ocrStatus = document.getElementById('js-ocr-status');

    ocrBtn.addEventListener('click', async () => {
        if (!cardImageFront) return;

        ocrBtn.disabled = true;
        ocrBtn.innerHTML = '<span class="m-ocr__spinner"></span> 読み取り中...';
        ocrStatus.textContent = cardImageBack
            ? 'Google Cloud Vision で表裏を読み取り中...'
            : 'Google Cloud Vision で読み取り中...';
        ocrStatus.className = 'm-ocr__status';

        try {
            const ocrBody = { imageUrl: cardImageFront };
            if (cardImageBack) ocrBody.imageUrlBack = cardImageBack;

            const response = await fetch('/api/ocr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ocrBody),
            });

            const data = await response.json();
            if (!response.ok) {
                ocrStatus.textContent = 'エラー: ' + (data.error || '読み取りに失敗しました');
                ocrStatus.className = 'm-ocr__status m-ocr__status--error';
                return;
            }

            if (data.parsed && Object.keys(data.parsed).length > 0) {
                // 空のフィールドのみ上書き
                const parsed = data.parsed;
                const fields = ['last_name','first_name','last_name_kana','first_name_kana','company','department','position','email','phone','mobile','address','website'];
                fields.forEach(f => {
                    const input = form.querySelector(`[name="${f}"]`);
                    if (input && !input.value && parsed[f]) {
                        input.value = parsed[f];
                    }
                });
                ocrStatus.textContent = '読み取り完了！';
                ocrStatus.className = 'm-ocr__status m-ocr__status--success';
            } else {
                ocrStatus.textContent = 'テキストを検出できませんでした';
                ocrStatus.className = 'm-ocr__status';
            }
        } catch (err) {
            ocrStatus.textContent = '読み取りに失敗しました';
            ocrStatus.className = 'm-ocr__status m-ocr__status--error';
        } finally {
            ocrBtn.disabled = false;
            ocrBtn.innerHTML = '<svg class="m-ocr__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> OCRで読み取り';
            setTimeout(() => { ocrStatus.textContent = ''; }, 3000);
        }
    });

    // ==========================================
    // タグ入力
    // ==========================================
    const tagInput = document.getElementById('js-tag-input');
    const suggestionsEl = document.getElementById('js-tag-suggestions');
    const colorPickerEl = document.getElementById('js-tag-color-picker');

    function renderSelectedTags() {
        const container = document.getElementById('js-selected-tags');
        container.innerHTML = selectedTags.map(tag => `
            <span class="m-tag-chip" style="background-color:${tag.color};">
                ${tag.name}
                <button type="button" class="m-tag-chip__remove" data-id="${tag.id}">&times;</button>
            </span>
        `).join('');

        container.querySelectorAll('.m-tag-chip__remove').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedTags = selectedTags.filter(t => t.id !== btn.dataset.id);
                renderSelectedTags();
            });
        });
    }

    tagInput.addEventListener('input', () => {
        const val = tagInput.value.trim().toLowerCase();
        colorPickerEl.style.display = 'none';

        if (!val) { suggestionsEl.style.display = 'none'; return; }

        const suggestions = allTags.filter(t =>
            t.name.toLowerCase().includes(val) && !selectedTags.some(s => s.id === t.id)
        );

        const exactMatch = allTags.some(t => t.name.toLowerCase() === val);

        let html = suggestions.map(t => `
            <button type="button" class="m-tag-suggestion" data-id="${t.id}">
                <span class="m-tag-suggestion__dot" style="background-color:${t.color};"></span>
                ${t.name}
            </button>
        `).join('');

        if (!exactMatch && val) {
            html += `<button type="button" class="m-tag-suggestion m-tag-suggestion--new" data-new="true">+ 「${tagInput.value.trim()}」を新しいタグとして作成</button>`;
        }

        suggestionsEl.innerHTML = html;
        suggestionsEl.style.display = html ? 'block' : 'none';

        // イベント
        suggestionsEl.querySelectorAll('.m-tag-suggestion').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.new) {
                    showColorPicker();
                } else {
                    const tag = allTags.find(t => t.id === btn.dataset.id);
                    if (tag) {
                        selectedTags.push(tag);
                        renderSelectedTags();
                        tagInput.value = '';
                        suggestionsEl.style.display = 'none';
                    }
                }
            });
        });
    });

    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstBtn = suggestionsEl.querySelector('.m-tag-suggestion:not(.m-tag-suggestion--new)');
            if (firstBtn) firstBtn.click();
            else if (tagInput.value.trim()) showColorPicker();
        }
        if (e.key === 'Backspace' && !tagInput.value && selectedTags.length > 0) {
            selectedTags.pop();
            renderSelectedTags();
        }
    });

    function showColorPicker() {
        suggestionsEl.style.display = 'none';
        const name = tagInput.value.trim();
        colorPickerEl.innerHTML = `
            <p class="m-tag-color-picker__label">「${name}」のタグ色を選択：</p>
            <div class="m-tag-color-picker__colors">
                ${TAG_COLORS.map(c => `<button type="button" class="m-tag-color-picker__dot ${c === newTagColor ? 'm-tag-color-picker__dot--active' : ''}" data-color="${c}" style="background-color:${c};"></button>`).join('')}
            </div>
            <button type="button" class="m-tag-color-picker__create" id="js-create-tag-btn">タグを作成</button>
        `;
        colorPickerEl.style.display = 'block';

        colorPickerEl.querySelectorAll('.m-tag-color-picker__dot').forEach(dot => {
            dot.addEventListener('click', () => {
                newTagColor = dot.dataset.color;
                colorPickerEl.querySelectorAll('.m-tag-color-picker__dot').forEach(d => d.classList.remove('m-tag-color-picker__dot--active'));
                dot.classList.add('m-tag-color-picker__dot--active');
            });
        });

        document.getElementById('js-create-tag-btn').addEventListener('click', async () => {
            const { data, error } = await sb.from('tags').insert({ name, color: newTagColor }).select().single();
            if (!error && data) {
                allTags.push(data);
                selectedTags.push(data);
                renderSelectedTags();
                tagInput.value = '';
                colorPickerEl.style.display = 'none';
            }
        });
    }

    // 外側クリックで閉じる
    document.addEventListener('click', (e) => {
        const wrap = document.getElementById('js-tag-input-wrap');
        if (!wrap.contains(e.target) && !suggestionsEl.contains(e.target) && !colorPickerEl.contains(e.target)) {
            suggestionsEl.style.display = 'none';
            colorPickerEl.style.display = 'none';
        }
    });

    // ==========================================
    // フォーム送信
    // ==========================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = '保存中...';
        errorEl.style.display = 'none';

        const formData = new FormData(form);
        const cleanData = {};
        const fields = ['last_name','first_name','last_name_kana','first_name_kana','company','department','position','email','phone','mobile','address','website','memo'];
        fields.forEach(f => {
            const val = (formData.get(f) || '').trim();
            cleanData[f] = val || null;
        });
        cleanData.card_image_front = cardImageFront || null;
        cleanData.card_image_back = cardImageBack || null;

        if (!cleanData.last_name || !cleanData.first_name) {
            errorEl.textContent = '姓と名は必須です。';
            errorEl.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = isEdit ? '更新する' : '登録する';
            return;
        }

        let savedCardId = cardId;

        if (isEdit) {
            const { error } = await sb
                .from('business_cards')
                .update({ ...cleanData, updated_at: new Date().toISOString() })
                .eq('id', cardId);
            if (error) {
                errorEl.textContent = '更新エラー: ' + error.message;
                errorEl.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = '更新する';
                return;
            }
        } else {
            const { data: insertData, error } = await sb
                .from('business_cards')
                .insert({ ...cleanData, created_by: currentUser.id })
                .select('id')
                .single();
            if (error) {
                errorEl.textContent = '登録エラー: ' + error.message;
                errorEl.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = '登録する';
                return;
            }
            savedCardId = insertData?.id;
        }

        // タグ保存
        if (savedCardId) {
            await sb.from('card_tags').delete().eq('card_id', savedCardId);
            if (selectedTags.length > 0) {
                await sb.from('card_tags').insert(
                    selectedTags.map(tag => ({ card_id: savedCardId, tag_id: tag.id }))
                );
            }
        }

        window.location.href = '/members/meishi/';
    });
})();
