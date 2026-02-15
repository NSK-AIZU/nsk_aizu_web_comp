/**
 * Cloudflare Pages Function: note.com RSS Proxy
 *
 * note.com のRSSフィードを取得し、CORSヘッダー付きのJSONで返す。
 * エンドポイント: /api/note-rss
 *
 * レスポンス例:
 * {
 *   "articles": [
 *     { "title": "...", "link": "...", "pubDate": "...", "thumbnail": "..." },
 *     ...
 *   ]
 * }
 */

const NOTE_RSS_URL = "https://note.com/terushon/m/m602cfbc789e4/rss";
const CACHE_TTL = 600; // 10分キャッシュ

export async function onRequestGet(context) {
    const cacheKey = new Request(NOTE_RSS_URL);
    const cache = caches.default;

    // キャッシュチェック
    let cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
        const cachedData = await cachedResponse.text();
        return new Response(cachedData, {
            headers: corsHeaders("application/json"),
        });
    }

    try {
        // note RSS を取得
        const rssResponse = await fetch(NOTE_RSS_URL, {
            headers: { "User-Agent": "NSK-AIZU-Website/1.0" },
        });

        if (!rssResponse.ok) {
            return new Response(
                JSON.stringify({ error: "Failed to fetch RSS", status: rssResponse.status }),
                { status: 502, headers: corsHeaders("application/json") }
            );
        }

        const xmlText = await rssResponse.text();
        const articles = parseRSS(xmlText);

        const jsonBody = JSON.stringify({ articles });

        // キャッシュに保存
        const responseToCache = new Response(jsonBody, {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": `s-maxage=${CACHE_TTL}`,
            },
        });
        context.waitUntil(cache.put(cacheKey, responseToCache.clone()));

        return new Response(jsonBody, {
            headers: corsHeaders("application/json"),
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ error: "Internal error", message: err.message }),
            { status: 500, headers: corsHeaders("application/json") }
        );
    }
}

/**
 * シンプルなXMLパーサー（RSSの<item>を抽出）
 * 外部ライブラリ不要で Cloudflare Workers 上で動作する
 */
function parseRSS(xml) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[1];
        const title = extractTag(itemXml, "title");
        const link = extractTag(itemXml, "link");
        const pubDate = extractTag(itemXml, "pubDate");
        const description = extractTag(itemXml, "description");

        // note独自: <media:thumbnail>URL</media:thumbnail>
        const thumbnail = extractTag(itemXml, "media:thumbnail")
            || extractMediaUrl(itemXml);

        items.push({
            title: decodeHTMLEntities(title),
            link,
            pubDate,
            thumbnail: thumbnail || "",
            description: stripHTML(decodeHTMLEntities(description)).slice(0, 120),
        });
    }

    return items;
}

function extractTag(xml, tagName) {
    // CDATA対応
    const cdataRegex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`);
    const cdataMatch = xml.match(cdataRegex);
    if (cdataMatch) return cdataMatch[1].trim();

    const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`);
    const match = xml.match(regex);
    return match ? match[1].trim() : "";
}

function extractMediaUrl(xml) {
    // <media:thumbnail url="..."> 形式にも対応
    const match = xml.match(/<media:thumbnail[^>]*url=["']([^"']+)["'][^>]*\/?>/);
    return match ? match[1] : "";
}

function decodeHTMLEntities(text) {
    return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'");
}

function stripHTML(html) {
    return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function corsHeaders(contentType) {
    return {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": `public, max-age=${CACHE_TTL}`,
    };
}
