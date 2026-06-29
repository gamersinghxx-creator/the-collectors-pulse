import { createClient } from '@supabase/supabase-js';
import { fetchLiveMarketData } from './liveFetcher';
import { NewsItem } from '../types';

/**
 * Ingestion job: pull the live feed (RSS, with images already resolved),
 * and upsert everything into Supabase as published rows. Once this has run,
 * the home / newsroom / article pages read straight from the DB (fast indexed
 * queries) instead of doing live fetches + image resolution at request time.
 *
 * Runs both from the local worker (via the /api/cron ping) and from the
 * Vercel Cron job in production.
 */
export async function runIngestion(): Promise<{ ok: boolean; count?: number; reason?: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === 'placeholder') {
    return { ok: false, reason: 'Supabase not configured (set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)' };
  }

  let items: NewsItem[] = [];
  try {
    items = await fetchLiveMarketData();
  } catch (e) {
    return { ok: false, reason: 'feed error: ' + (e as Error).message };
  }
  if (!items.length) return { ok: false, reason: 'no items fetched' };

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const rows = items.map((i) => ({
    title: i.title,
    slug: i.slug,
    summary_short: i.summary_short ?? null,
    summary_full: i.summary_full ?? null,
    content_raw: i.content_raw || i.title,
    source_url: i.source_url,
    source_name: i.source_name,
    source_type: 'rss',
    category: i.category,
    sub_category: i.sub_category ?? null,
    hype_score: i.hype_score ?? 0,
    engagement_count: i.engagement_count ?? 0,
    image_url: i.image_url || null,
    thumbnail_url: i.thumbnail_url || null,
    is_drop_alert: !!i.is_drop_alert,
    is_restock: !!i.is_restock,
    is_trending: !!i.is_trending,
    tags: i.tags ?? [],
    processing_status: 'published',
    published_at: i.published_at,
  }));

  const { data, error } = await supabase
    .from('news_items')
    .upsert(rows, { onConflict: 'slug' })
    .select('id');

  if (error) return { ok: false, reason: error.message };
  return { ok: true, count: data?.length ?? rows.length };
}
