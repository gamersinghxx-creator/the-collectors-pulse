'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';
import { NewsItem } from '../types';
import { getCategoryStyle } from '../lib/constants';
import Link from 'next/link';

interface TrendingSidebarProps {
  initialTrending: NewsItem[];
}

export default function TrendingSidebar({ initialTrending }: TrendingSidebarProps) {
  return (
    <div id="trending-section" className="bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      
      {/* Decorative scanning line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-pulse" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <h2 className="font-outfit text-md font-black tracking-[0.2em] text-white">
            LEADERBOARD
          </h2>
        </div>
        <span className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          LIVE INDEX
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-6">
        <AnimatePresence>
          {initialTrending.map((item, index) => {
            const style = getCategoryStyle(item.category);
            const rankGlow = index === 0 
              ? 'text-amber-400 font-black' 
              : index === 1 
              ? 'text-gray-300' 
              : index === 2 
              ? 'text-amber-600' 
              : 'text-gray-600';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05, ease: 'easeOut' }}
                className="group flex gap-4 p-3 rounded-2xl bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300"
              >
                {/* Position / Rank */}
                <div className={`font-mono text-xl w-6 text-center ${rankGlow}`}>
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`font-outfit text-[9px] font-black uppercase tracking-widest opacity-90 ${style.text}`}>
                      {item.category} Realm
                    </span>
                    <span className="font-mono text-[9px] text-emerald-400 font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      +{item.hype_score * 7}%
                    </span>
                  </div>

                  <Link href={`/article/${item.slug}`}>
                    <h4 className="font-outfit text-sm font-bold text-gray-300 leading-snug mb-2 group-hover:text-white transition-colors truncate">
                      {item.title}
                    </h4>
                  </Link>

                  {/* High Tech Momentum Bar */}
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.hype_score / 10) * 100}%` }}
                        transition={{ duration: 1.2, delay: index * 0.05, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: style.hex,
                          boxShadow: `0 0 8px ${style.hex}`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-gray-400 tracking-wider">
                      {item.hype_score}.0
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
