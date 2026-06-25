// The cyberpunk newsroom feed — browse & filter all stories.
export const dynamic = 'force-dynamic';

import Hero from '../../components/Hero';
import AutoRefresh from '../../components/AutoRefresh';
import LivingBackground from '../../components/LivingBackground';
import FeaturedSpotlight from '../../components/FeaturedSpotlight';
import BentoGrid from '../../components/BentoGrid';
import TrendingSidebar from '../../components/TrendingSidebar';
import { mockItems } from '../../lib/mockData';
import { supabase } from '../../lib/supabase/client';
import { fetchLiveMarketData } from '../../lib/liveFetcher';
import { NewsItem } from '../../types';

export const metadata = {
  title: "The Collector's Pulse | Newsroom",
  description: 'Live, AI-curated news feed for trading cards, anime figures, and luxury watches.',
};

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
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
      if (!error && data && data.length > 0) rawItems = data as NewsItem[];
    }
  } catch (err) {
    console.error('Supabase fetch failed:', err);
  }

  if (rawItems.length === 0) {
    try { rawItems = await fetchLiveMarketData(); } catch { /* fallback */ }
  }
  if (rawItems.length === 0) rawItems = mockItems;

  // Top story respects the active category, and prefers an item with a real photo.
  const hasRealImage = (i: NewsItem) => typeof i.image_url === 'string' && i.image_url.includes('/images/articles/');
  const inCategory = currentCategory === 'ALL'
    ? rawItems
    : rawItems.filter(i => i.category.toUpperCase() === currentCategory);
  const basePool = inCategory.length > 0 ? inCategory : rawItems;
  const spotlightPool = basePool.some(hasRealImage) ? basePool.filter(hasRealImage) : basePool;
  const spotlightItem = spotlightPool.reduce(
    (max, item) => (item.hype_score > max.hype_score ? item : max),
    spotlightPool[0]
  );

  const trendingItems = rawItems
    .filter(i => i.is_trending)
    .sort((a, b) => (b.hype_score || 0) - (a.hype_score || 0));

  let gridItems = rawItems;
  if (currentCategory !== 'ALL') {
    gridItems = gridItems.filter(i => i.category.toUpperCase() === currentCategory);
  }
  const showcasedItems = gridItems.slice(0, 9);

  const SECTION_TITLE: Record<string, string> = {
    ALL: 'Latest Stories',
    TCG: 'Trading Card News',
    FIGURES: 'Figure News',
    WATCHES: 'Watch News',
  };

  const SECTION_BG: Record<string, { img: string; tone: 'dark' | 'light'; theme: 'dark' | 'light'; accent: string }> = {
    WATCHES: { img: '/watch-bg-section.jpg', tone: 'dark', theme: 'dark', accent: 'rgba(232,201,106,0.20)' },
    TCG: { img: '/tcg-bg-section.jpg', tone: 'light', theme: 'light', accent: 'rgba(46,139,255,0.16)' },
    FIGURES: { img: '/figure-bg-section.jpg', tone: 'light', theme: 'light', accent: 'rgba(194,75,245,0.16)' },
  };
  const sectionBg = SECTION_BG[currentCategory];

  return (
    <main
      className={sectionBg ? sectionBg.theme : undefined}
      style={sectionBg
        ? { minHeight: '100vh', background: 'transparent', position: 'relative', zIndex: 0 }
        : { minHeight: '100vh', background: 'var(--obsidian)' }}
    >

      <AutoRefresh />
      {sectionBg && <LivingBackground images={[sectionBg.img]} accent={sectionBg.accent} tone={sectionBg.tone} behind />}
      <Hero tickerItems={rawItems} category={currentCategory} />
      {spotlightItem && <FeaturedSpotlight item={spotlightItem} />}

      <section style={{ padding: 'var(--space-2xl) 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-10">

            <div className="flex-grow lg:w-2/3">
              <div
                className="flex items-center justify-between mb-8"
                style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-lg)' }}
              >
                <div className="flex items-center gap-4">
                  <span style={{ width: '5px', height: '30px', borderRadius: '3px', background: 'var(--grad-ember)', display: 'inline-block' }} />
                  <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '36px', fontWeight: 600, color: 'var(--ivory)', letterSpacing: '-0.015em' }}>
                    {SECTION_TITLE[currentCategory] || 'Latest Stories'}
                  </h2>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600, color: 'var(--mist-dim)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {showcasedItems.length} of {gridItems.length}
                </span>
              </div>

              <BentoGrid items={showcasedItems} />

              <div
                className="mt-12 p-7 flex items-start gap-4"
                style={{ background: 'linear-gradient(120deg, rgba(242,118,46,0.10), rgba(226,59,46,0.05))', border: '1px solid rgba(242,118,46,0.28)', borderRadius: 'var(--radius-lg)' }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', flexShrink: 0, lineHeight: 1, marginTop: '1px' }} className="text-gradient-ember">✦</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-bright)', marginBottom: '7px' }}>
                    Curated by Claude AI
                  </div>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'var(--mist)', lineHeight: 1.65 }}>
                    Every story is sourced and summarized by Claude AI — Anthropic&apos;s AI assistant — tracking drops, restocks, and market movements across the collector universe.
                  </p>
                </div>
              </div>
            </div>

            <aside className="lg:w-1/3" style={{ flexShrink: 0 }}>
              <TrendingSidebar initialTrending={trendingItems.length > 0 ? trendingItems : rawItems.slice(0, 5)} />
            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}
