/**
 * Cloudflare Pages Function: OCR Proxy
 *
 * Google Cloud Vision API を使って名刺画像からテキストを読み取る。
 * APIキーはCloudflare環境変数 GOOGLE_CLOUD_VISION_API_KEY に設定すること。
 *
 * エンドポイント: POST /api/ocr
 * リクエスト: { "imageUrl": "https://..." }
 * レスポンス: { "text": "...", "parsed": { ... } }
 */

// ==========================================
// メールアドレスの正規表現
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// 電話番号
const PHONE_REGEX = /(?:TEL|Tel|tel|電話|Phone|phone|Ph)?[:\s]?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{3,4}/g;
const MOBILE_REGEX = /0[789]0[-.\s]?\d{4}[-.\s]?\d{4}/;
const FAX_REGEX = /(?:FAX|Fax|fax|ファクス|ファックス)[:\s]?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{3,4}/;
const URL_REGEX = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}(?:\/[^\s]*)*/;
const ADDRESS_REGEX = /〒?\s?\d{3}[-ー]\d{4}[\s\S]*?(?:都|道|府|県)[\s\S]*?(?:\d+[-ー]\d+|\d+番)/;
const SIMPLE_ADDRESS_REGEX = /(?:東京都|北海道|(?:大阪|京都)府|.{2,3}県)[^\n\r]{5,}/;

const COMPANY_KEYWORDS = ['株式会社','有限会社','合同会社','一般社団法人','一般財団法人','NPO法人','特定非営利活動法人','Co.','Co.,Ltd.','Inc.','Corp.','Ltd.','LLC','Corporation'];
const POSITION_KEYWORDS = ['代表取締役','取締役','社長','副社長','専務','常務','部長','次長','課長','係長','主任','リーダー','マネージャー','ディレクター','CEO','CTO','CFO','COO','理事長','理事','事務局長','会長'];
const DEPARTMENT_KEYWORDS = ['部','課','室','グループ','チーム','センター','事業部','営業','開発','企画','総務','人事','経理','広報','事務局'];

function parseBusinessCard(ocrText) {
    const result = {};
    const lines = ocrText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const emailMatch = ocrText.match(EMAIL_REGEX);
    if (emailMatch) result.email = emailMatch[0];

    const urlMatch = ocrText.match(URL_REGEX);
    if (urlMatch && !urlMatch[0].includes('@')) {
        result.website = urlMatch[0].startsWith('http') ? urlMatch[0] : 'https://' + urlMatch[0];
    }

    const faxMatch = ocrText.match(FAX_REGEX);
    const phoneMatches = ocrText.match(PHONE_REGEX);
    if (phoneMatches) {
        const faxStr = faxMatch ? faxMatch[0] : '';
        const phones = phoneMatches.filter(p => !p.match(/FAX|Fax|fax|ファクス|ファックス/) && !faxStr.includes(p));
        const mobileMatch = ocrText.match(MOBILE_REGEX);
        if (mobileMatch) {
            result.mobile = mobileMatch[0].replace(/\s/g, '');
            const landlines = phones.filter(p => !p.match(/0[789]0/));
            if (landlines.length > 0) result.phone = landlines[0].replace(/^(?:TEL|Tel|tel|電話|Phone|phone|Ph)[:\s]?/, '').trim();
        } else if (phones.length > 0) {
            result.phone = phones[0].replace(/^(?:TEL|Tel|tel|電話|Phone|phone|Ph)[:\s]?/, '').trim();
            if (phones.length > 1) result.mobile = phones[1].replace(/^(?:TEL|Tel|tel|電話|Phone|phone|Ph)[:\s]?/, '').trim();
        }
    }

    const addressMatch = ocrText.match(ADDRESS_REGEX);
    if (addressMatch) {
        result.address = addressMatch[0].replace(/\s+/g, ' ').trim();
    } else {
        const simpleMatch = ocrText.match(SIMPLE_ADDRESS_REGEX);
        if (simpleMatch) result.address = simpleMatch[0].replace(/\s+/g, ' ').trim();
    }

    for (const line of lines) {
        if (COMPANY_KEYWORDS.some(kw => line.includes(kw))) { result.company = line; break; }
    }

    for (const line of lines) {
        if (POSITION_KEYWORDS.some(kw => line.includes(kw))) { result.position = line; break; }
    }

    if (!result.department) {
        for (const line of lines) {
            if (DEPARTMENT_KEYWORDS.some(kw => line.includes(kw)) && line !== result.company && line !== result.position) {
                result.department = line; break;
            }
        }
    }

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

// ==========================================
// メインハンドラ
// ==========================================

export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS Preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders() });
    }

    try {
        const { imageUrl } = await request.json();

        if (!imageUrl) {
            return jsonResponse({ error: '画像URLが必要です' }, 400);
        }

        const apiKey = env.GOOGLE_CLOUD_VISION_API_KEY;
        if (!apiKey) {
            return jsonResponse({ error: 'Google Cloud Vision APIキーが設定されていません' }, 500);
        }

        // 画像をBase64に変換
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));

        // Google Cloud Vision API にリクエスト
        const visionResponse = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requests: [{
                        image: { content: base64Image },
                        features: [{ type: 'TEXT_DETECTION' }],
                        imageContext: { languageHints: ['ja', 'en'] },
                    }],
                }),
            }
        );

        const visionData = await visionResponse.json();

        if (visionData.error) {
            return jsonResponse({ error: `Vision API エラー: ${visionData.error.message}` }, 500);
        }

        const annotations = visionData.responses?.[0]?.textAnnotations;
        if (!annotations || annotations.length === 0) {
            return jsonResponse({ text: '', parsed: {}, message: 'テキストが検出されませんでした' }, 200);
        }

        const fullText = annotations[0].description;
        const parsed = parseBusinessCard(fullText);

        return jsonResponse({ text: fullText, parsed }, 200);
    } catch (error) {
        return jsonResponse({ error: 'OCR処理中にエラーが発生しました: ' + error.message }, 500);
    }
}

// CORS対応 OPTIONS
export async function onRequestOptions() {
    return new Response(null, { headers: corsHeaders() });
}

function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
}

function jsonResponse(data, status) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });
}
