import Link from 'next/link';
import BentoGrid from '../components/BentoGrid';
import TrendingSidebar from '../components/TrendingSidebar';
import LiveTicker from '../components/LiveTicker';
import AdSlot from '../components/AdSlot';
import { ThemeToggle } from '../components/ThemeToggle';
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
        .order('published_at', { ascending: false })
        .limit(20);
      
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

  const categories = ['ALL', 'TCG', 'FIGURES', 'WATCHES'];

  return (
    <main className="min-h-screen relative overflow-hidden transition-colors">
      <LiveTicker items={tickerItems} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Banner Ad / Top Navigation Area */}
        <div className="mb-12 flex justify-between items-center relative">
          <div className="flex-1" />
          <AdSlot slotId="banner_top" adFormat="horizontal" className="w-[728px] h-[90px] bg-white/5 dark:bg-black/20 backdrop-blur-md border border-[var(--color-vault-border)] rounded-xl hidden md:flex items-center justify-center text-gray-400 font-inter text-sm" />
          <div className="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-6 mb-12 border-b border-[var(--color-vault-border)] pb-2 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={cat === 'ALL' ? '/' : `/?category=${cat.toLowerCase()}`}
              className={`font-outfit text-sm font-bold tracking-[0.2em] px-2 py-3 border-b-2 whitespace-nowrap transition-all duration-300 ${
                currentCategory === cat 
                  ? 'border-[var(--color-accent-watches)] text-gray-900 dark:text-white drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-grow lg:w-2/3 xl:w-3/4">
            <BentoGrid items={gridItems} />
          </div>

          {/* Right Rail */}
          <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-8">
            <TrendingSidebar initialTrending={trendingItems} />
            <AdSlot slotId="sidebar_rect" adFormat="rectangle" className="w-[300px] h-[250px] mx-auto bg-[var(--color-vault-card)] border border-[var(--color-vault-border)] flex items-center justify-center text-[var(--color-vault-border)] font-mono text-sm" />
          </div>
        </div>
      </div>
    </main>
  );
}
