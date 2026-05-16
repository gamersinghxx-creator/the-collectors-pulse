'use client';

import { motion } from 'framer-motion';

interface HypeMeterProps {
  score: number; // 1-10
}

export default function HypeMeter({ score }: HypeMeterProps) {
  const normalizedScore = Math.max(1, Math.min(10, Math.round(score)));

  let label = "Low Interest";
  let activeColor = "bg-gray-400";
  let glowClass = "";

  if (normalizedScore >= 9) {
    label = "FRENZY";
    activeColor = "bg-[var(--color-accent-figures)]";
    glowClass = "shadow-[0_0_8px_rgba(239,68,68,0.8)]";
  } else if (normalizedScore >= 7) {
    label = "High Demand";
    activeColor = "bg-[var(--color-accent-watches)]";
  } else if (normalizedScore >= 4) {
    label = "Building Hype";
    activeColor = "bg-[var(--color-accent-tcg)]";
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-gray-400 uppercase tracking-wider">Hype Level</span>
        <span className={`font-mono text-xs font-bold ${normalizedScore >= 9 ? 'text-[var(--color-accent-figures)] animate-pulse' : 'text-gray-600 dark:text-gray-300'}`}>
          {label}
        </span>
      </div>
      <div className="flex gap-1 h-6">
        {Array.from({ length: 10 }).map((_, i) => {
          const isActive = i < normalizedScore;
          return (
            <div key={i} className="flex-1 bg-[var(--color-vault-bg)] rounded-sm overflow-hidden border border-[var(--color-vault-border)]/50 relative">
              {isActive && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
                  className={`absolute bottom-0 w-full ${activeColor} ${normalizedScore >= 9 ? glowClass : ''}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
