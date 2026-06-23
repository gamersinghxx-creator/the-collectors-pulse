import { notFound } from 'next/navigation';

// Force dynamic rendering - never pre-render at build time
export const dynamic = 'force-dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase/client';
import { mockItems } from '../../../lib/mockData';
import { getCategoryStyle, getFallbackImage, getSourceIcon, BLUR_DATA_URL } from '../../../lib/constants';
import { ArrowLeft, ExternalLink, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { NewsItem } from '../../../types';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let item: NewsItem | null = null;

  // Try Supabase first
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'placeholder') {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        item = data as NewsItem;
      }
    }
  } catch (err) {
    console.error("Failed to fetch article from Supabase:", err);
  }

  // Fallback to live market data search
  if (!item) {
    try {
      const { fetchLiveMarketData } = await import('../../../lib/liveFetcher');
      const liveItems = await fetchLiveMarketData();
      item = liveItems.find(i => i.slug === slug) || null;
    } catch (err) {
      console.error("Failed to fetch live article fallback:", err);
    }
  }

  // Fallback to mock data
  if (!item) {
    item = mockItems.find(i => i.slug === slug) || null;
  }

  if (!item) {
    notFound();
  }

  const Icon = getSourceIcon(item.source_type);
  const styleConf = getCategoryStyle(item.category);
  const fallbackImage = getFallbackImage(item.category);

  return (
    <main className="min-h-screen bg-[var(--color-vault-bg)] text-gray-900 dark:text-gray-200 transition-colors pb-20">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-50 bg-[var(--color-vault-card)]/80 backdrop-blur-xl border-b border-[var(--color-vault-border)] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-inter font-medium">Back to Pulse</span>
          </Link>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-[var(--color-vault-bg)] border border-[var(--color-vault-border)] flex items-center justify-center">
                <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Hero Section */}
        <div className="relative w-full aspect-[21/9] md:aspect-[2.5/1] bg-[var(--color-vault-bg-alt)] rounded-3xl overflow-hidden mb-10 shadow-2xl border border-[var(--color-vault-border)]">
          <Image
              src={item.image_url || fallbackImage}
              alt={item.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              placeholder="blur"
              blurDataURL={item.thumbnail_url || BLUR_DATA_URL}
              unoptimized={!!item.image_url}
              priority
            />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-vault-bg)] via-transparent to-transparent opacity-60" />
        </div>

        {/* Header Content */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
             <span className={`font-outfit text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full ${styleConf.bg} ${styleConf.border} border ${styleConf.text}`}>
               {item.category}
             </span>
             {item.is_drop_alert && (
               <div className="flex items-center gap-1.5 bg-red-500/10 dark:bg-red-500/20 border border-red-500/50 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-live-blink" />
                 <span className="font-outfit text-xs font-extrabold text-red-600 dark:text-red-400 tracking-wider">LIVE DROP</span>
               </div>
             )}
             {item.is_restock && (
               <div className="bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/50 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                 <span className="font-outfit text-xs font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">RESTOCK</span>
               </div>
             )}
             <div className="flex items-center gap-1.5 bg-[var(--color-vault-card)] backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--color-vault-border)]">
                <span className="font-outfit text-sm font-extrabold text-gray-900 dark:text-white">{item.hype_score}/10</span>
                <Flame className={`w-4 h-4 ${item.hype_score >= 8 ? 'text-red-500 animate-pulse' : 'text-amber-500'}`} />
             </div>
          </div>

          <h1 className="font-outfit text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6">
            {item.title}
          </h1>

          <div className="flex items-center gap-4 text-sm font-inter text-gray-500 dark:text-gray-400">
            <span>{item.published_at ? format(new Date(item.published_at), 'MMMM d, yyyy • h:mm a') : 'Recently'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Via {item.source_name}
            </span>
          </div>
        </header>

        {/* Article Body */}
        <div className="prose prose-lg dark:prose-invert prose-gray max-w-none font-inter mb-16">
          {item.summary_full ? (
            item.summary_full.split('\n').map((paragraph: string, idx: number) => (
              paragraph.trim() ? <p key={idx} className="leading-relaxed text-gray-700 dark:text-gray-300 text-lg md:text-xl mb-6">{paragraph}</p> : null
            ))
          ) : item.summary_short ? (
            <p className="leading-relaxed text-gray-700 dark:text-gray-300 text-lg md:text-xl mb-6">{item.summary_short}</p>
          ) : (
            <p className="leading-relaxed text-gray-500 dark:text-gray-400 text-lg italic">No detailed summary available for this article yet.</p>
          )}
        </div>

        {/* Footer / CTA */}
        <div className="mt-12 pt-8 border-t border-[var(--color-vault-border)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {item.tags?.map((tag: string) => (
              <span key={tag} className="font-inter text-xs text-gray-500 dark:text-gray-400 bg-[var(--color-vault-bg-alt)] px-3 py-1.5 rounded-full border border-[var(--color-vault-border)]">
                #{tag}
              </span>
            ))}
          </div>

          <a 
            href={item.source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-outfit font-bold text-white bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:-translate-y-1 w-full md:w-auto justify-center"
          >
            <span>View Original Post on {item.source_name}</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </article>
    </main>
  );
}
