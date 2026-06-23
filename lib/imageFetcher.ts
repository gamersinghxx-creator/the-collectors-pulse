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

    // Read only first 50KB to find meta tags (don't download entire page)
    const reader = res.body?.getReader();
    if (!reader) return null;

    let html = '';
    const decoder = new TextDecoder();
    let bytesRead = 0;
    const MAX_BYTES = 50 * 1024; // 50KB should be enough for <head>

    while (bytesRead < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
      bytesRead += value.length;

      // If we've passed the </head> tag, stop reading
      if (html.includes('</head>')) break;
    }

    reader.cancel();

    // Extract og:image
    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
    );

    if (ogImageMatch?.[1]) {
      console.log(`[ImageFetcher] Found OG image for ${resolvedUrl.slice(0, 50)}...`);
      return ogImageMatch[1];
    }

    // Fallback: twitter:image
    const twitterImageMatch = html.match(
      /<meta[^>]*(?:name|property)=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["']twitter:image["']/i
    );

    if (twitterImageMatch?.[1]) {
      console.log(`[ImageFetcher] Found Twitter image for ${resolvedUrl.slice(0, 50)}...`);
      return twitterImageMatch[1];
    }

    console.log(`[ImageFetcher] No OG/Twitter image found in ${resolvedUrl.slice(0, 60)}...`);
    return null;
  } catch (err) {
    console.log(`[ImageFetcher] Failed to extract OG image from ${sourceUrl.slice(0, 60)}...: ${(err as Error).message}`);
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
    if (buffer.length < 2000) {
      console.log(`[ImageFetcher] Image too small (${buffer.length} bytes), likely a tracking pixel`);
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
 * Main export: Fetch the OG image from a source URL, download it, and return the local path.
 * Returns null if the entire pipeline fails.
 */
export async function fetchArticleImage(sourceUrl: string, slug: string): Promise<string | null> {
  // 1. Check cache first
  const cached = getCachedArticleImage(slug);
  if (cached) {
    return cached;
  }

  // 2. Skip Google News redirect URLs — they resolve to Google's own OG image (logo),
  //    not the actual article image. These URLs require JS/browser to resolve.
  if (sourceUrl.includes('news.google.com')) {
    console.log(`[ImageFetcher] Skipping Google News redirect URL (requires browser to resolve)`);
    return null;
  }

  // 3. Extract OG image URL
  const ogUrl = await extractOGImage(sourceUrl);
  if (!ogUrl) {
    return null;
  }

  // 4. Download and cache
  return await downloadImage(ogUrl, slug);
}
