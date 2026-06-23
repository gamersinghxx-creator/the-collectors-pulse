'use client';

import { NewsItem } from '../types';
import Link from 'next/link';

interface LiveTickerProps {
  items: NewsItem[];
}

export default function LiveTicker({ items }: LiveTickerProps) {
  if (!items || items.length === 0) return null;

  // Duplicating items for infinite loop scroll
  const duplicatedItems = [...items, ...items, ...items];
  const animationDuration = Math.max(items.length * 4, 15); // Dynamic duration scaling

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 overflow-hidden flex items-center h-11 sticky top-0 z-50 shadow-md">
      
      {/* Radar Label */}
      <div className="flex-shrink-0 bg-red-950/50 border-r border-red-500/20 text-red-400 px-5 h-full flex items-center gap-2 font-outfit text-xs font-black tracking-[0.2em] z-10 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        COLLECTOR RADAR
      </div>
      
      {/* Scrollable feed */}
      <div className="flex flex-1 overflow-hidden relative h-full">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
        
        <div
          className="flex items-center hover:[animation-play-state:paused] w-max h-full"
          style={{
            animation: `ticker-scroll ${animationDuration}s linear infinite`,
          }}
        >
          {duplicatedItems.map((item, idx) => {
            const isAlert = item.is_drop_alert || item.is_restock;
            const isTCG = item.category.toLowerCase() === 'tcg';
            const isWatch = item.category.toLowerCase() === 'watches';
            
            return (
              <div key={`${item.id}-${idx}`} className="flex items-center gap-4 px-10 h-full border-r border-white/5">
                {/* Dot status */}
                <span className={`w-2 h-2 rounded-full ${
                  isAlert 
                    ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                    : isTCG 
                    ? 'bg-blue-500' 
                    : 'bg-amber-500'
                }`} />
                
                {/* Alert Badge */}
                {item.is_drop_alert && (
                  <span className="font-outfit text-[9px] font-black text-red-400 border border-red-500/20 bg-red-500/10 px-2 py-0.5 rounded-md tracking-wider whitespace-nowrap uppercase">
                    DROP ALERT
                  </span>
                )}
                {item.is_restock && (
                  <span className="font-outfit text-[9px] font-black text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-md tracking-wider whitespace-nowrap uppercase">
                    RESTOCK
                  </span>
                )}

                {/* Article Link */}
                <Link href={`/article/${item.slug}`} className="font-inter font-medium text-xs md:text-sm text-gray-400 hover:text-white hover:underline transition-colors whitespace-nowrap">
                  {item.title}
                </Link>

                {/* Hype Level */}
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                  item.hype_score >= 9
                    ? 'text-red-400 border-red-500/20 bg-red-500/5'
                    : isTCG
                    ? 'text-blue-400 border-blue-500/20 bg-blue-500/5'
                    : 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                } whitespace-nowrap`}>
                  HYPE: {item.hype_score}/10
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
