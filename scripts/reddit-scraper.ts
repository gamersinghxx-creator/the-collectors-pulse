import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabase = SUPABASE_CONFIGURED
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    )
  : null;

const SUBREDDITS = [
  { name: 'PokemonTCG', category: 'TCG' },
  { name: 'magicTCG', category: 'TCG' },
  { name: 'AnimeFigures', category: 'Figures' },
  { name: 'Watches', category: 'Watches' },
  { name: 'rolex', category: 'Watches' }
];

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json,text/html;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * Resilient Reddit fetch. Reddit frequently 403/429s plain requests, so we rotate
 * hosts (www / old) and listings (new / hot) with retry + backoff.
 * Returns the array of post "children", or [] if every attempt fails.
 */
async function fetchRedditPosts(name: string): Promise<any[]> {
  const endpoints = [
    `https://www.reddit.com/r/${name}/new.json?limit=15`,
    `https://old.reddit.com/r/${name}/new.json?limit=15`,
    `https://www.reddit.com/r/${name}/hot.json?limit=15`,
  ];
  for (const url of endpoints) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(url, { headers: HEADERS });
        if (res.ok) {
          const json = await res.json();
          const children = json?.data?.children || [];
          if (children.length > 0) return children;
        } else if (res.status === 429 || res.status === 403) {
          console.warn(`[Scraper]   r/${name} ${res.status} on ${new URL(url).host} (try ${attempt + 1}) — backing off`);
          await sleep(1500 * (attempt + 1));
          continue;
        }
      } catch (e) {
        console.warn(`[Scraper]   r/${name} error: ${(e as Error).message}`);
      }
      await sleep(500);
    }
  }
  return [];
}

function generateSlug(title: string, id: string) {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
  return `${cleanTitle}-${id}`;
}

async function scrapeReddit() {
  if (!SUPABASE_CONFIGURED || !supabase) {
    console.error('\n[Scraper] ⚠ Supabase is not configured — skipping Reddit ingestion.');
    console.error('[Scraper]   Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (see SUPABASE_SETUP.md).\n');
    return;
  }

  console.log("[Scraper] Starting Reddit Live Data Ingestion...");

  let totalInserted = 0;

  for (const sub of SUBREDDITS) {
    console.log(`[Scraper] Fetching r/${sub.name}...`);
    try {
      const posts = await fetchRedditPosts(sub.name);

      if (posts.length === 0) {
        console.error(`[Scraper] r/${sub.name}: Reddit blocked all endpoints — skipping this round.`);
        continue;
      }

      const formattedItems = posts
        .filter((post: any) => !post.data.stickied && !post.data.is_video)
        .map((post: any) => {
          const data = post.data;
          
          // Try to extract a clean image URL (Reddit JSON can be messy with image URLs)
          let imageUrl = null;
          if (data.url && (data.url.endsWith('.jpg') || data.url.endsWith('.png'))) {
            imageUrl = data.url;
          } else if (data.thumbnail && data.thumbnail.startsWith('http')) {
            imageUrl = data.thumbnail;
          }

          return {
            title: data.title,
            slug: generateSlug(data.title, data.id),
            content_raw: data.selftext || data.title, // If no body text, use title as content
            source_url: `https://reddit.com${data.permalink}`,
            source_name: `r/${sub.name}`,
            source_type: 'reddit',
            category: sub.category,
            image_url: imageUrl,
            processing_status: 'pending_ai',
            published_at: new Date(data.created_utc * 1000).toISOString()
          };
        });

      if (formattedItems.length === 0) continue;

      // Insert into Supabase
      const { data, error } = await supabase
        .from('news_items')
        .upsert(formattedItems, { onConflict: 'slug', ignoreDuplicates: true })
        .select('id');

      if (error) {
        console.error(`[Scraper] Error inserting data for r/${sub.name}:`, error.message);
      } else {
        const insertedCount = data?.length || 0;
        totalInserted += insertedCount;
        console.log(`[Scraper] Successfully queued ${insertedCount} new posts from r/${sub.name} for AI processing.`);
      }

      // Respect API rate limits (wait 1.5 seconds between requests)
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (err: any) {
      console.error(`[Scraper] Exception fetching r/${sub.name}:`, err.message);
    }
  }

  console.log(`[Scraper] Complete! Queued a total of ${totalInserted} real internet posts for Gemini to process.`);
}

// Run the script directly if called via CLI
if (require.main === module) {
  scrapeReddit();
}

export { scrapeReddit };
