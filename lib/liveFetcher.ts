import { NewsItem } from '../types';
import { resolveArticleImage } from './resolveArticleImage';
import { mockItems } from './mockData';

const FEEDS = [
  {
    url: 'https://news.google.com/rss/search?q=%22pokemon+tcg%22+OR+%22one+piece+card+game%22+OR+%22magic+the+gathering%22+OR+%22lorcana%22+OR+%22trading+cards%22&hl=en-US&gl=US&ceid=US:en',
    category: 'TCG',
    fallbackSource: 'TCG News'
  },
  {
    url: 'https://news.google.com/rss/search?q=%22anime+figure%22+OR+nendoroid+OR+%22shfiguarts%22+OR+%22funko+pop%22+OR+%22scale+figure%22+OR+%22action+figure%22&hl=en-US&gl=US&ceid=US:en',
    category: 'Figures',
    fallbackSource: 'Figure News'
  },
  {
    url: 'https://news.google.com/rss/search?q=%22luxury+watches%22+OR+rolex+OR+%22omega+watch%22+OR+%22patek+philippe%22+OR+%22audemars+piguet%22+OR+%22grand+seiko%22+OR+%22watch+release%22&hl=en-US&gl=US&ceid=US:en',
    category: 'Watches',
    fallbackSource: 'Watch News'
  }
];

const FETCH_OPTIONS = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
  },
  next: { revalidate: 60 } // Fresh updates every minute
};

function cleanXMLText(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') // Strip CDATA tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, '') // Strip HTML tags after decoding
    .replace(/\s+/g, ' ')
    .trim();
}

function generateSlug(title: string, id: string) {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
  return `${cleanTitle}-${id}`;
}

export async function fetchLiveMarketData(): Promise<NewsItem[]> {
  const allItems: NewsItem[] = [];

  try {
    const promises = FEEDS.map(async (feed) => {
      try {
        console.log(`[LiveFetcher] Querying Google News RSS for ${feed.category}...`);

        // Fetch with one retry — Google News occasionally throttles bursts.
        let xmlText = '';
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const res = await fetch(feed.url, FETCH_OPTIONS);
            if (res.ok) { xmlText = await res.text(); if (xmlText.includes('<item>')) break; }
            else console.error(`[LiveFetcher] ${feed.category} status ${res.status} (attempt ${attempt + 1})`);
          } catch (e) {
            console.error(`[LiveFetcher] ${feed.category} fetch error (attempt ${attempt + 1}):`, (e as Error).message);
          }
          if (attempt === 0) await new Promise(r => setTimeout(r, 600));
        }

        // Find item tags
        const itemsMatch = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];
        console.log(`[LiveFetcher] Found ${itemsMatch.length} raw elements for ${feed.category}`);
        
        return itemsMatch.slice(0, 8).map((itemXml) => {
          const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
          const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
          const dateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
          const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);

          const rawTitle = titleMatch ? titleMatch[1] : '';
          const rawLink = linkMatch ? linkMatch[1] : '';
          const rawDate = dateMatch ? dateMatch[1] : '';
          const rawDesc = descMatch ? descMatch[1] : '';

          // Article-specific image straight from the feed item, if present.
          const mediaMatch =
            itemXml.match(/<media:content[^>]*\burl=["']([^"']+)["'][^>]*>/i) ||
            itemXml.match(/<media:thumbnail[^>]*\burl=["']([^"']+)["'][^>]*>/i) ||
            itemXml.match(/<enclosure[^>]*\burl=["']([^"']+)["'][^>]*type=["']image\//i) ||
            rawDesc.match(/<img[^>]+src=["']([^"']+)["']/i);
          const feedImage = mediaMatch ? mediaMatch[1].replace(/&amp;/g, '&').trim() : '';

          let fullTitle = cleanXMLText(rawTitle);
          const sourceUrl = cleanXMLText(rawLink);
          
          // Google News title format is: "Title of article - Publisher Name"
          // We can split this to extract title and source name cleanly
          let sourceName = feed.fallbackSource;
          const lastDashIndex = fullTitle.lastIndexOf(' - ');
          if (lastDashIndex !== -1) {
            sourceName = fullTitle.slice(lastDashIndex + 3).trim();
            fullTitle = fullTitle.slice(0, lastDashIndex).trim();
          }

          const cleanDesc = cleanXMLText(rawDesc);
          const id = Buffer.from(sourceUrl).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(-8);
          const slug = generateSlug(fullTitle, id);

          // Calculate Hype Scores dynamically based on popularity keywords
          let hype = 6 + Math.floor(Math.random() * 3); // random base 6-8
          const textToScore = (fullTitle + ' ' + cleanDesc).toLowerCase();
          if (textToScore.includes('reveal') || textToScore.includes('leak') || textToScore.includes('hype') || textToScore.includes('first look')) {
            hype = 9;
          } else if (textToScore.includes('restock') || textToScore.includes('alert') || textToScore.includes('selling out')) {
            hype = 10;
          }

          // Image URL will be resolved after parsing via the image pipeline
          const imageUrl = '';

          const publishedDate = rawDate ? new Date(rawDate) : new Date();
          const ageMs = Date.now() - publishedDate.getTime();
          // Keep ~6 months so less-frequent feeds (figures / watches) aren't emptied.
          const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
          if (rawDate && ageMs > MAX_AGE_MS) {
            return null;
          }

          return {
            id,
            title: fullTitle,
            slug,
            summary_short: cleanDesc.slice(0, 160) + (cleanDesc.length > 160 ? '...' : ''),
            summary_full: cleanDesc || `Latest market updates and expert analysis on ${fullTitle} from ${sourceName}.`,
            content_raw: cleanDesc || fullTitle,
            source_url: sourceUrl,
            source_name: sourceName,
            source_type: 'rss',
            category: feed.category,
            hype_score: hype,
            engagement_count: hype * 140 + Math.floor(Math.random() * 100),
            image_url: imageUrl,
            thumbnail_url: feedImage,
            is_drop_alert: hype >= 9,
            is_restock: textToScore.includes('restock') || textToScore.includes('back in stock') || textToScore.includes('re-release'),
            is_trending: hype >= 8,
            tags: [feed.category.toLowerCase(), sourceName.toLowerCase().replace(/\s+/g, '')],
            published_at: publishedDate.toISOString(),
            scraped_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            processing_status: 'published'
          } as NewsItem;
        }).filter((item): item is NewsItem => item !== null);
      } catch (err) {
        console.error(`[LiveFetcher] Exception parsing feed for ${feed.category}:`, err);
        return [];
      }
    });

    const results = await Promise.all(promises);
    results.forEach((list) => {
      allItems.push(...list);
    });

    // Deduplicate items by ID to prevent duplicate React keys
    const uniqueItems = allItems.filter((item, index, self) =>
      self.findIndex(t => t.id === item.id) === index
    );

    // Guarantee every category has content. If a feed returned nothing usable,
    // supplement that category from the built-in editorial set so Figures /
    // Watches blogs are never empty.
    for (const cat of ['TCG', 'Figures', 'Watches']) {
      const hasCat = uniqueItems.some(i => i.category.toUpperCase() === cat.toUpperCase());
      if (!hasCat) {
        const filler = mockItems.filter(m => m.category.toUpperCase() === cat.toUpperCase());
        if (filler.length > 0) {
          console.log(`[LiveFetcher] No live ${cat} items — backfilling ${filler.length} from editorial set.`);
          uniqueItems.push(...filler);
        }
      }
    }

    // Resolve images in parallel for all items via the OG → AI → fallback pipeline
    console.log(`[LiveFetcher] Resolving images for ${uniqueItems.length} articles...`);
    const imageResults = await Promise.allSettled(
      uniqueItems.map(item =>
        resolveArticleImage(item.source_url, item.title, item.category, item.slug, item.thumbnail_url)
      )
    );

    imageResults.forEach((result, idx) => {
      if (result.status === 'fulfilled' && result.value) {
        uniqueItems[idx].image_url = result.value;
      }
    });

    // Sort items newest first
    return uniqueItems.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  } catch (globalErr) {
    console.error('[LiveFetcher] Global fetch error:', globalErr);
    return [];
  }
}
