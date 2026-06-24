import { existsSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, extname } from 'path';

const ARTICLES_DIR = join(process.cwd(), 'public', 'images', 'articles');
const FETCH_TIMEOUT_MS = 5000;

// Ensure directory exists
function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Check if we already have a cached image for this slug.
 * Returns the public-relative path if found, null otherwise.
 */
export function getCachedArticleImage(slug: string): string | null {
  ensureDir(ARTICLES_DIR);
  try {
    const files = readdirSync(ARTICLES_DIR);
    const match = files.find(f => f.startsWith(slug + '.'));
    if (match) {
      return `/images/articles/${match}`;
    }
  } catch {
    // Directory read failed — treat as cache miss
  }
  return null;
}

/**
 * Resolve a Google News redirect URL to the actual article URL.
 * Google News URLs (https://news.google.com/rss/articles/...) redirect to the real article.
 */
async function resolveRedirectUrl(url: string): Promise<string> {
  // If it's not a Google News URL, return as-is
  if (!url.includes('news.google.com')) {
    return url;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    // Follow the redirect manually to get the final URL
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
      redirect: 'follow',
    });

    clearTimeout(timeout);

    // The final URL after redirect is the actual article URL
    if (res.url && res.url !== url) {
      console.log(`[ImageFetcher] Resolved redirect: ${url.slice(0, 60)}... → ${res.url.slice(0, 60)}...`);
      return res.url;
    }

    // If no redirect happened, try to extract URL from HTML content
    const html = await res.text();
    const metaRefreshMatch = html.match(/content=["']\d+;\s*url=([^"']+)["']/i);
    if (metaRefreshMatch?.[1]) {
      return metaRefreshMatch[1];
    }

    // Try to find canonical link
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    if (canonicalMatch?.[1]) {
      return canonicalMatch[1];
    }

    return url;
  } catch (err) {
    console.log(`[ImageFetcher] Redirect resolution failed: ${(err as Error).message}`);
    return url; // Use original URL as fallback
  }
}

/**
 * Extract og:image or twitter:image from a web page's <head>.
 * Returns the image URL string or null.
 */
/**
 * Decodes a Google News redirect URL to the actual destination URL using the batchexecute API.
 */
export async function decodeGoogleNewsUrl(sourceUrl: string): Promise<string | null> {
  try {
    const url = new URL(sourceUrl);
    const pathParts = url.pathname.split('/');
    const base64Str = pathParts[pathParts.length - 1];
    if (!base64Str) {
      console.log('[ImageFetcher] Invalid Google News URL path parts:', sourceUrl);
      return null;
    }

    // 1. Fetch the articles redirect page to get signature and timestamp
    const targetUrl = `https://news.google.com/articles/${base64Str}`;
    const pageRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!pageRes.ok) {
      console.log(`[ImageFetcher] Failed to fetch article page ${targetUrl}: Status ${pageRes.status}`);
      return null;
    }
    const html = await pageRes.text();
    
    // Extract signature and timestamp via regex
    const sgMatch = html.match(/data-n-a-sg=["']([^"']+)["']/);
    const tsMatch = html.match(/data-n-a-ts=["']([^"']+)["']/);
    
    if (!sgMatch || !tsMatch) {
      console.log('[ImageFetcher] Failed to extract signature/timestamp from Google News page');
      return null;
    }
    
    const signature = sgMatch[1];
    const timestamp = tsMatch[1];

    // 2. Post to batchexecute
    const batchUrl = 'https://news.google.com/_/DotsSplashUi/data/batchexecute';
    const payload = [
      'Fbv4je',
      JSON.stringify([
        'garturlreq',
        [
          ['X', 'X', ['X', 'X'], null, null, 1, 1, 'US:en', null, 1, null, null, null, null, null, 0, 1],
          'X',
          'X',
          1,
          [1, 1, 1],
          1,
          1,
          null,
          0,
          0,
          null,
          0
        ],
        base64Str,
        Number(timestamp),
        signature
      ])
    ];
    
    const fReq = JSON.stringify([[payload]]);
    const bodyStr = 'f.req=' + encodeURIComponent(fReq);
    
    const batchRes = await fetch(batchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
      },
      body: bodyStr
    });
    
    if (!batchRes.ok) {
      console.log(`[ImageFetcher] BatchExecute call failed: Status ${batchRes.status}`);
      return null;
    }
    
    const resText = await batchRes.text();
    const parts = resText.split('\n\n');
    if (parts.length < 2) {
      console.log('[ImageFetcher] Invalid response format from batchexecute');
      return null;
    }
    
    const parsedData = JSON.parse(parts[1]);
    const innerDataStr = parsedData[0][2];
    const innerData = JSON.parse(innerDataStr);
    const decodedUrl = innerData[1];
    
    console.log(`[ImageFetcher] Decoded Google News redirect URL to: ${decodedUrl}`);
    return decodedUrl;
  } catch (err) {
    console.log('[ImageFetcher] Error decoding Google News URL:', (err as Error).message);
    return null;
  }
}

/**
 * Extract og:image, twitter:image, or high-quality content image from a webpage.
 * Returns the image URL string or null.
 */
async function extractOGImage(sourceUrl: string): Promise<string | null> {
  try {
    // First, resolve any redirects (especially Google News URLs)
    const resolvedUrl = await resolveRedirectUrl(sourceUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(resolvedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.log(`[ImageFetcher] Source returned ${res.status} for ${resolvedUrl}`);
      return null;
    }

    // Read up to 300KB to find metadata and high-quality body images
    const reader = res.body?.getReader();
    if (!reader) return null;

    let html = '';
    const decoder = new TextDecoder();
    let bytesRead = 0;
    const MAX_BYTES = 300 * 1024; // 300KB is enough for metadata and top page images

    while (bytesRead < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
      bytesRead += value.length;
    }

    reader.cancel();

    // 1. Extract og:image
    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
    );

    if (ogImageMatch?.[1]) {
      console.log(`[ImageFetcher] Found OG image for ${resolvedUrl.slice(0, 50)}...`);
      return ogImageMatch[1];
    }

    // 2. Fallback: twitter:image
    const twitterImageMatch = html.match(
      /<meta[^>]*(?:name|property)=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["']twitter:image["']/i
    );

    if (twitterImageMatch?.[1]) {
      console.log(`[ImageFetcher] Found Twitter image for ${resolvedUrl.slice(0, 50)}...`);
      return twitterImageMatch[1];
    }

    // 3. Fallback: Scrape inline body images
    const imgMatches = html.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
    for (const imgTag of imgMatches) {
      const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
      if (srcMatch?.[1]) {
        const imgUrl = srcMatch[1];
        const lowercaseImgUrl = imgUrl.toLowerCase();
        
        // Skip base64, tracking pixels, logos, avatars, icons, and buttons
        const isExcluded = [
          'logo', 'icon', 'avatar', 'spacer', 'pixel', 'ad', 'banner', 'button', 'sprite',
          'loading', 'spinner', 'placeholder', 'header', 'footer', 'social', 'facebook',
          'twitter', 'instagram', 'linkedin', 'pinterest', 'youtube', 'github', 'arrow',
          'chevron', 'check', 'close', 'search', 'menu'
        ].some(keyword => lowercaseImgUrl.includes(keyword)) ||
        imgUrl.startsWith('data:');

        if (!isExcluded) {
          // Resolve relative URLs to absolute URLs
          let absoluteImgUrl = imgUrl;
          try {
            if (imgUrl.startsWith('//')) {
              absoluteImgUrl = 'https:' + imgUrl;
            } else if (imgUrl.startsWith('/')) {
              const parsedBase = new URL(resolvedUrl);
              absoluteImgUrl = parsedBase.origin + imgUrl;
            } else if (!imgUrl.startsWith('http://') && !imgUrl.startsWith('https://')) {
              const parsedBase = new URL(resolvedUrl);
              absoluteImgUrl = parsedBase.origin + '/' + imgUrl;
            }
            console.log(`[ImageFetcher] Scraped high-quality fallback body image: ${absoluteImgUrl}`);
            return absoluteImgUrl;
          } catch {
            // Ignore parse errors for badly formatted URLs
          }
        }
      }
    }

    console.log(`[ImageFetcher] No usable image found in ${resolvedUrl.slice(0, 60)}...`);
    return null;
  } catch (err) {
    console.log(`[ImageFetcher] Failed to extract image from ${sourceUrl.slice(0, 60)}...: ${(err as Error).message}`);
    return null;
  }
}

/**
 * Download an image from a URL and save it locally.
 * Returns the public-relative path or null on failure.
 */
async function downloadImage(imageUrl: string, slug: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      redirect: 'follow',
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.log(`[ImageFetcher] Image download failed: ${res.status} for ${imageUrl}`);
      return null;
    }

    const contentType = res.headers.get('content-type') || '';
    let ext = '.jpg'; // default
    if (contentType.includes('png')) ext = '.png';
    else if (contentType.includes('webp')) ext = '.webp';
    else if (contentType.includes('gif')) ext = '.gif';
    else if (contentType.includes('svg')) ext = '.svg';

    // Also check URL extension
    const urlExt = extname(new URL(imageUrl).pathname).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(urlExt)) {
      ext = urlExt === '.jpeg' ? '.jpg' : urlExt;
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    // Validate minimum size (skip tiny tracking pixels)
    if (buffer.length < 5000) { // filter out tiny images/icons
      console.log(`[ImageFetcher] Image too small (${buffer.length} bytes), skipping`);
      return null;
    }

    ensureDir(ARTICLES_DIR);
    const filename = `${slug}${ext}`;
    const filepath = join(ARTICLES_DIR, filename);
    writeFileSync(filepath, buffer);

    console.log(`[ImageFetcher] ✅ Saved ${filename} (${(buffer.length / 1024).toFixed(1)}KB)`);
    return `/images/articles/${filename}`;
  } catch (err) {
    console.log(`[ImageFetcher] Download failed for ${imageUrl}:`, (err as Error).message);
    return null;
  }
}

/**
 * Main export: Fetch the OG or scraped image from a source URL, download it, and return the local path.
 * Returns null if the entire pipeline fails.
 */
export async function fetchArticleImage(sourceUrl: string, slug: string): Promise<string | null> {
  // 1. Check cache first
  const cached = getCachedArticleImage(slug);
  if (cached) {
    return cached;
  }

  let targetUrl = sourceUrl;

  // 2. Decode Google News redirect URLs if applicable
  if (sourceUrl.includes('news.google.com')) {
    console.log(`[ImageFetcher] Decoding Google News URL: ${sourceUrl.slice(0, 60)}...`);
    const decoded = await decodeGoogleNewsUrl(sourceUrl);
    if (decoded) {
      targetUrl = decoded;
    } else {
      console.log('[ImageFetcher] Could not decode Google News URL, falling back to original redirect');
    }
  }

  // 3. Extract best available image URL (OG, Twitter, or body scraper fallback)
  const imageUrl = await extractOGImage(targetUrl);
  if (!imageUrl) {
    return null;
  }

  // 4. Download and cache
  return await downloadImage(imageUrl, slug);
}
