import { decodeGoogleNewsUrl } from './imageFetcher';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;|&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8216;|&lsquo;/g, '‘').replace(/&#8220;|&ldquo;/g, '“')
    .replace(/&#8221;|&rdquo;/g, '”').replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—').replace(/&[a-z0-9#]+;/gi, ' ');
}

const BOILERPLATE = /^(share|tweet|advertisement|sponsored|subscribe|sign up|sign in|log in|cookie|related|read more|read next|follow us|comments?|newsletter|terms|privacy|copyright|all rights reserved|photo|image|getty|reuters|©|published|updated)\b/i;

/**
 * Fetch the real article behind a (possibly Google-News) link and extract a
 * substantial, readable excerpt of its body paragraphs.
 * Returns paragraphs joined by blank lines, or null if nothing usable.
 *
 * This is an excerpt for on-site reading; the article page still links out to
 * the original source for the full story and attribution.
 */
export async function fetchArticleContent(sourceUrl: string): Promise<string | null> {
  if (!sourceUrl) return null;
  try {
    // Resolve Google News links to the real article URL.
    let target = sourceUrl;
    if (sourceUrl.includes('news.google.com')) {
      const decoded = await decodeGoogleNewsUrl(sourceUrl);
      if (decoded) target = decoded;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(target, {
      signal: controller.signal,
      headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml' },
      redirect: 'follow',
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;

    let html = await res.text();
    // Drop obvious non-content containers before extracting paragraphs.
    html = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<(nav|header|footer|aside|form|figure|figcaption)[\s\S]*?<\/\1>/gi, ' ');

    // Prefer the <article> region if present, else the whole doc.
    const articleMatch = html.match(/<article\b[\s\S]*?<\/article>/i);
    const region = articleMatch ? articleMatch[0] : html;

    const paras = [...region.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
      .map(m => decodeEntities(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim())
      .filter(t => t.length >= 60 && !BOILERPLATE.test(t));

    const seen = new Set<string>();
    const out: string[] = [];
    let total = 0;
    for (const p of paras) {
      if (seen.has(p)) continue;
      seen.add(p);
      out.push(p);
      total += p.length;
      if (total > 1800 || out.length >= 8) break; // excerpt cap
    }

    if (out.length < 2) return null;
    return out.join('\n\n');
  } catch {
    return null;
  }
}
