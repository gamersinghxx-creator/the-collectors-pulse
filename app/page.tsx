import Link from 'next/link';

// Force dynamic rendering - fetch fresh Supabase data at runtime, not build time
export const dynamic = 'force-dynamic';
import BentoGrid from '../components/BentoGrid';
import TrendingSidebar from '../components/TrendingSidebar';
import LiveTicker from '../components/LiveTicker';
import AdSlot from '../components/AdSlot';
import { mockItems } from '../lib/mockData';
import { supabase } from '../lib/supabase/client';
import { NewsItem } from '../types';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const currentCategory = params.category?.toUpperCase() || 'ALL';

  let rawItems: NewsItem[] = mockItems;
  
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
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

  const tickerItems = rawItems;
  const trendingItems = rawItems.filter(i => i.is_trending).sort((a, b) => (b.hype_score || 0) - (a.hype_score || 0));
  
  let gridItems = rawItems;
  if (currentCategory !== 'ALL') {
    gridItems = gridItems.filter(i => i.category.toUpperCase() === currentCategory);
  }

  return (
    <main className="min-h-screen relative overflow-hidden transition-colors">
      <LiveTicker items={tickerItems} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="font-outfit text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              {currentCategory === 'ALL' ? 'Latest Drops' : currentCategory}
            </h1>
            <p className="font-inter text-sm text-gray-500 dark:text-gray-400 mt-1">
              {currentCategory === 'ALL' 
                ? 'AI-curated news from across the collectibles world' 
                : `Showing ${currentCategory.toLowerCase()} news and drops`}
            </p>
          </div>
          <span className="font-mono text-xs text-gray-400 dark:text-gray-600 hidden sm:block">
            {gridItems.length} signal{gridItems.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-grow lg:w-2/3 xl:w-3/4">
            <BentoGrid items={gridItems} />
          </div>

          {/* Right Rail */}
          <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-8">
            <TrendingSidebar initialTrending={trendingItems} />
            <AdSlot slotId="sidebar_rect" adFormat="rectangle" className="w-[300px] h-[250px] mx-auto bg-[var(--color-vault-card)] border border-[var(--color-vault-border)] rounded-2xl flex items-center justify-center text-[var(--color-vault-border)] font-mono text-sm" />
          </div>
        </div>
      </div>
    </main>
  );
}
