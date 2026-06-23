import { NewsItem } from '../types';

const SUBREDDITS = [
  { name: 'PokemonTCG', category: 'TCG' },
  { name: 'magicTCG', category: 'TCG' },
  { name: 'AnimeFigures', category: 'Figures' },
  { name: 'Watches', category: 'Watches' },
  { name: 'rolex', category: 'Watches' }
];

const FETCH_OPTIONS = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  next: { revalidate: 60 } // Cache for 60 seconds to prevent rate limits
};

function generateSlug(title: string, id: string) {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
  return `${cleanTitle}-${id}`;
}

export async function fetchLiveMarketData(): Promise<NewsItem[]> {
  const allItems: NewsItem[] = [];

  try {
    const promises = SUBREDDITS.map(async (sub) => {
      try {
        const res = await fetch(`https://www.reddit.com/r/${sub.name}/new.json?limit=10`, FETCH_OPTIONS);
        if (!res.ok) return [];

        const json = await res.json();
        const children = json?.data?.children || [];

        return children.map((child: any) => {
          const data = child.data;
          
          // Image resolving
          let imageUrl = '';
          if (data.preview?.images?.[0]?.source?.url) {
            imageUrl = data.preview.images[0].source.url.replace(/&amp;/g, '&');
          } else if (data.thumbnail && data.thumbnail.startsWith('http')) {
            imageUrl = data.thumbnail;
          }

          // Calculate a realistic hype score (4 to 10) based on score and upvote ratio
          const baseScore = data.score || 0;
          const ratio = data.upvote_ratio || 0.8;
          const rawHype = Math.min(Math.max(4 + Math.round((baseScore * ratio) / 10), 4), 10);

          return {
            id: data.id,
            title: data.title,
            slug: generateSlug(data.title, data.id),
            summary_short: data.selftext ? data.selftext.slice(0, 160) + '...' : `New release alert and community discussion on r/${sub.name} about ${data.title}.`,
            summary_full: data.selftext || data.title,
            content_raw: data.selftext || data.title,
            source_url: `https://reddit.com${data.permalink}`,
            source_name: `r/${sub.name}`,
            source_type: 'reddit',
            category: sub.category,
            sub_category: sub.name.toLowerCase(),
            hype_score: rawHype,
            engagement_count: baseScore * 5 + (data.num_comments || 0) * 12,
            image_url: imageUrl,
            is_drop_alert: rawHype >= 9 || data.title.toLowerCase().includes('drop') || data.title.toLowerCase().includes('release'),
            is_restock: data.title.toLowerCase().includes('restock') || data.title.toLowerCase().includes('back in stock'),
            is_trending: rawHype >= 8 || data.score > 25,
            tags: [sub.category.toLowerCase(), sub.name.toLowerCase()],
            published_at: new Date(data.created_utc * 1000).toISOString(),
            scraped_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            processing_status: 'published'
          } as NewsItem;
        });
      } catch (err) {
        console.error(`Failed to fetch live feed for r/${sub.name}:`, err);
        return [];
      }
    });

    const results = await Promise.all(promises);
    results.forEach((list) => {
      allItems.push(...list);
    });

    // Sort items by published date (newest first)
    return allItems.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  } catch (globalErr) {
    console.error('Error fetching live market data:', globalErr);
    return [];
  }
}
