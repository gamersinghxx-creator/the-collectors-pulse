'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { NewsItem } from '../types';
import Link from 'next/link';

interface TrendingSidebarProps {
  initialTrending: NewsItem[];
}

export default function TrendingSidebar({ initialTrending }: TrendingSidebarProps) {
  const [trending, setTrending] = useState(initialTrending);

  useEffect(() => {
    setTrending(initialTrending);
  }, [initialTrending]);

  return (
    <div className="bg-[var(--color-vault-card)] backdrop-blur-xl border border-[var(--color-vault-border)] rounded-3xl p-6 shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
      <div className="flex items-center gap-3 mb-8 border-b border-[var(--color-vault-border)] pb-4">
        <Flame className="w-6 h-6 text-[var(--color-accent-figures)] animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        <h2 className="font-outfit text-xl font-bold tracking-wider text-gray-900 dark:text-white">TRENDING NOW</h2>
      </div>

      <div className="flex flex-col gap-6">
        <AnimatePresence>
          {trending.map((item, index) => {
            const HypeBarColor = item.category === 'TCG' ? 'bg-[var(--color-accent-tcg)]' : 
                                 item.category === 'Figures' ? 'bg-[var(--color-accent-figures)]' : 
                                 item.category === 'Watches' ? 'bg-[var(--color-accent-watches)]' : 
                                 'bg-gray-400';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1, ease: 'easeOut' }}
                className="group flex gap-4"
              >
                <div className="font-outfit text-3xl font-black text-[var(--color-vault-border)] opacity-60 w-6 text-center group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <span className="font-outfit text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-accent-tcg)] mb-1 block opacity-80">
                    {item.category}
                  </span>
                  <Link href={`/article/${item.slug}`}>
                    <h4 className="font-inter text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 leading-tight mb-2 group-hover:text-black dark:group-hover:text-white group-hover:underline transition-all">
                      {item.title}
                    </h4>
                  </Link>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.hype_score / 10) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + (index * 0.1), ease: "easeOut" }}
                      className={`h-full ${HypeBarColor} shadow-[0_0_10px_currentColor]`}
                    />
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
