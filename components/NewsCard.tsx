'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Flame } from 'lucide-react';
import { NewsItem } from '../types';
import { getCategoryStyle, getFallbackImage, getSourceIcon, BLUR_DATA_URL } from '../lib/constants';

interface NewsCardProps {
  item: NewsItem;
  index: number;
  className?: string;
}

export default function NewsCard({ item, index, className = '' }: NewsCardProps) {
  const styleConf = getCategoryStyle(item.category);
  const fallbackImage = getFallbackImage(item.category);

  const [imgSrc, setImgSrc] = useState(item.image_url || fallbackImage);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(fallbackImage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      whileHover={{ y: -6, scale: 1.01 }}
      style={{ '--glow-color': styleConf.hex } as React.CSSProperties}
      className={`group relative flex flex-col bg-[var(--color-vault-card)] backdrop-blur-md border border-[var(--color-vault-border)] hover:border-[var(--color-vault-border-hover)] rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all duration-300 ${styleConf.className} border-l-[4px] ${className} ${item.is_drop_alert ? 'animate-pulse-glow' : ''}`}
    >
      <Link href={`/article/${item.slug}`} className="flex flex-col h-full w-full relative z-10">
        
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
          <div className="flex flex-col gap-2">
            {/* Category Badge */}
            <div className={`px-2.5 py-1 rounded-full backdrop-blur-md border ${styleConf.bg} ${styleConf.border}`}>
              <span className={`font-outfit text-[10px] font-extrabold uppercase tracking-widest ${styleConf.text}`}>
                {item.category}
              </span>
            </div>
            {item.is_drop_alert && (
              <div className="flex items-center gap-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-md border border-[var(--color-accent-figures)]/50 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent-figures)] animate-live-blink" />
                <span className="font-outfit text-xs font-extrabold text-[var(--color-accent-figures)] tracking-wider">LIVE DROP</span>
              </div>
            )}
            {item.is_restock && (
              <div className="bg-white/90 dark:bg-black/60 backdrop-blur-md border border-[var(--color-accent-restock)]/50 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <span className="font-outfit text-xs font-extrabold text-[var(--color-accent-restock)] tracking-wider">RESTOCK</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--color-vault-border)]">
            <span className="font-outfit text-sm font-extrabold text-gray-900 dark:text-white">{item.hype_score}/10</span>
            <Flame className={`w-4 h-4 ${item.hype_score >= 8 ? 'text-[var(--color-accent-figures)] animate-pulse' : 'text-[var(--color-accent-watches)]'}`} />
          </div>
        </div>

        {/* Image Container with Dynamic Gradient Overlay */}
        <div className="relative w-full aspect-[4/3] bg-[var(--color-vault-bg-alt)] overflow-hidden">
          <Image
            src={imgSrc}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            placeholder="blur"
            blurDataURL={item.thumbnail_url || BLUR_DATA_URL}
            unoptimized={!!item.image_url && !item.image_url.startsWith('/')}
            onError={handleImageError}
          />
          {/* If no real image, show a category gradient + label overlay */}
          {(!item.image_url || imgError) && (
            <div className={`absolute inset-0 bg-gradient-to-t ${styleConf.gradient} opacity-60`} />
          )}
          {/* Standard bottom gradient to make title pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-vault-card)] via-[var(--color-vault-card)]/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-70" />
        </div>

        {/* Content Body */}
        <div className="flex flex-col flex-grow p-5 md:p-6 relative z-10 -mt-12">
          <h3 className="font-outfit text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-400 transition-all">
            {item.title}
          </h3>
          <p className="font-inter text-sm md:text-base text-gray-600 dark:text-gray-300 line-clamp-2 mb-6 flex-grow leading-relaxed">
            {item.summary_short}
          </p>
          
          {/* Footer Metadata */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--color-vault-border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-[var(--color-vault-border)] flex items-center justify-center group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
                {React.createElement(getSourceIcon(item.source_type), { className: "w-4 h-4 text-gray-600 dark:text-gray-400" })}
              </div>
              <span className="font-inter font-medium text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                {item.source_name}
              </span>
            </div>
            <span suppressHydrationWarning className="font-inter text-xs text-gray-400 dark:text-gray-500 font-medium">
              {item.published_at ? formatDistanceToNow(new Date(item.published_at), { addSuffix: true }) : 'Just now'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
