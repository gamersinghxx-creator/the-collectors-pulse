import Link from 'next/link';

// Force dynamic rendering - fetch fresh Supabase data at runtime, not build time
export const dynamic = 'force-dynamic';

import Hero from '../components/Hero';
import CategoryRealms from '../components/CategoryRealms';
import FeaturedSpotlight from '../components/FeaturedSpotlight';
import BentoGrid from '../components/BentoGrid';
import TrendingSidebar from '../components/TrendingSidebar';
import LiveTicker from '../components/LiveTicker';
import AdSlot from '../components/AdSlot';
import { mockItems } from '../lib/mockData';
import { supabase } from '../lib/supabase/client';
import { fetchLiveMarketData } from '../lib/liveFetcher';
import { NewsItem } from '../types';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const currentCategory = params.category?.toUpperCase() || 'ALL';

  let rawItems: NewsItem[] = [];
  
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'placeholder') {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('processing_status', 'published')
        .order('published_at', { ascending: false })
        .limit(50);
      
      if (!error && data && data.length > 0) {
        rawItems = data as NewsItem[];
      }
    }
  } catch (err) {
    console.error("Failed to fetch from Supabase:", err);
  }

  // Fallback: If Supabase returns no data (or is unconfigured), query real-time market feeds directly!
  if (rawItems.length === 0) {
    try {
      rawItems = await fetchLiveMarketData();
    } catch (err) {
      console.error("Failed to fetch live market data:", err);
    }
  }

  // Double fallback: if live feeds also fail, use mock items
  if (rawItems.length === 0) {
    rawItems = mockItems;
  }

  // Ticker and Trending items
  const tickerItems = rawItems;
  const trendingItems = rawItems.filter(i => i.is_trending).sort((a, b) => (b.hype_score || 0) - (a.hype_score || 0));

  // Determine top featured item (highest hype score)
  const spotlightItem = rawItems.reduce((max, item) => (item.hype_score > max.hype_score ? item : max), rawItems[0]);

  // Grid items filtered by category
  let gridItems = rawItems;
  if (currentCategory !== 'ALL') {
    gridItems = gridItems.filter(i => i.category.toUpperCase() === currentCategory);
  }

  // Reduce visible grid items by 70% (Show maximum 4 high-signal showcases on home page)
  const showcasedGridItems = gridItems.slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-950 text-white transition-colors relative">
      
      {/* 1. Live Collector Radar (Ticker) */}
      <LiveTicker items={tickerItems} />

      {/* 2. Immersive Hero Section */}
      <Hero />

      {/* 3. Category Realms Portals */}
      <CategoryRealms />

      {/* 4. Featured Collectible Spotlight */}
      {spotlightItem && <FeaturedSpotlight item={spotlightItem} />}

      {/* 5. Curation Grid Feed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-10 flex items-end justify-between border-b border-white/5 pb-6">
          <div>
            <span className="font-mono text-[10px] text-amber-500 font-bold tracking-[0.3em] uppercase">
              HIGH-SIGNAL FEEDS
            </span>
            <h2 className="font-outfit text-3xl font-black text-white mt-1 tracking-tight">
              {currentCategory === 'ALL' ? 'CURATED REVEALS' : `${currentCategory} REALM FEED`}
            </h2>
            <p className="font-inter text-sm text-gray-400 mt-2 max-w-md">
              Selected high-priority collector signals from around the universe.
            </p>
          </div>
          <span className="font-mono text-xs text-gray-500 hidden sm:block">
            Showcasing {showcasedGridItems.length} of {gridItems.length} signals
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Curated Grid showcases */}
          <div className="flex-grow lg:w-2/3 xl:w-3/4">
            <BentoGrid items={showcasedGridItems} />
          </div>

          {/* Right Rail Leaderboard & Ads */}
          <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-10">
            <TrendingSidebar initialTrending={trendingItems} />
            <AdSlot slotId="sidebar_rect" adFormat="rectangle" className="w-[300px] h-[250px] mx-auto bg-slate-950/40 border border-white/5 rounded-3xl flex items-center justify-center text-gray-600 font-mono text-xs" />
          </div>
        </div>
      </div>
    </main>
  );
}
