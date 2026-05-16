'use client';

import { NewsItem } from '../types';
import Link from 'next/link';

interface LiveTickerProps {
  items: NewsItem[];
}

export default function LiveTicker({ items }: LiveTickerProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full bg-[var(--color-vault-card)]/80 backdrop-blur-lg border-b border-[var(--color-vault-border)] overflow-hidden flex items-center h-10 sticky top-0 z-50 shadow-sm">
      <div className="flex-shrink-0 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 h-full flex items-center font-outfit text-xs font-bold tracking-widest z-10 shadow-[4px_0_10px_rgba(0,0,0,0.1)]">
        LIVE TICKER
      </div>
      
      <div className="flex flex-1 overflow-hidden relative">
        <div className="absolute left-0 w-8 h-full bg-gradient-to-r from-[var(--color-vault-bg)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 w-8 h-full bg-gradient-to-l from-[var(--color-vault-bg)] to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-ticker-scroll hover:[animation-play-state:paused] w-max">
          {[...items, ...items, ...items].map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center gap-3 px-8">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-figures)] animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              <Link href={`/article/${item.slug}`} className="font-inter font-medium text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:underline transition-colors whitespace-nowrap">
                {item.title}
              </Link>
              <span className="font-outfit text-xs font-extrabold text-[var(--color-accent-watches)] bg-[var(--color-accent-watches)]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                🔥 {item.hype_score}/10
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
