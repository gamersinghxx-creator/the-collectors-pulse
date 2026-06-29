// Front door → the art-driven Collector's Hub landing page.
export const dynamic = 'force-dynamic';

import HubLanding from '../components/HubLanding';
import AutoRefresh from '../components/AutoRefresh';
import { mockItems } from '../lib/mockData';
import { supabase } from '../lib/supabase/client';
import { getCachedLiveFeed } from '../lib/liveFetcher';
import { NewsItem } from '../types';

export default async function HomePage() {
  let rawItems: NewsItem[] = [];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'placeholder') {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('processing_status', 'published')
        .order('published_at', { ascending: false })
        .limit(50);
      if (!error && data && data.length > 0) rawItems = data as NewsItem[];
    }
  } catch (err) {
    console.error('[Home] Supabase fetch failed:', err);
  }

  if (rawItems.length === 0) {
    try { rawItems = await getCachedLiveFeed(); } catch { /* fallback */ }
  }
  if (rawItems.length === 0) rawItems = mockItems;

  return (
    <>
      <AutoRefresh />
      <HubLanding items={rawItems} />
    </>
  );
}
