import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SUBREDDITS = [
  { name: 'PokemonTCG', category: 'TCG' },
  { name: 'magicTCG', category: 'TCG' },
  { name: 'AnimeFigures', category: 'Figures' },
  { name: 'Watches', category: 'Watches' },
  { name: 'rolex', category: 'Watches' }
];

// Fallback headers to avoid Reddit blocking basic fetch requests
const FETCH_OPTIONS = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

function generateSlug(title: string, id: string) {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
  return `${cleanTitle}-${id}`;
}

async function scrapeReddit() {
  console.log("[Scraper] Starting Reddit Live Data Ingestion...");
  
  let totalInserted = 0;

  for (const sub of SUBREDDITS) {
    console.log(`[Scraper] Fetching r/${sub.name}...`);
    try {
      const response = await fetch(`https://www.reddit.com/r/${sub.name}/new.json?limit=10`, FETCH_OPTIONS);
      
      if (!response.ok) {
        console.error(`[Scraper] Failed to fetch r/${sub.name}: ${response.statusText}`);
        continue;
      }

      const json = await response.json();
      const posts = json.data?.children || [];

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
