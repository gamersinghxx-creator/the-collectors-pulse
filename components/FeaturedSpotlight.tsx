'use client';

import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { NewsItem } from '../types';
import { getCategoryStyle, getFallbackImage, BLUR_DATA_URL } from '../lib/constants';

interface FeaturedSpotlightProps {
  item: NewsItem;
}

export default function FeaturedSpotlight({ item }: FeaturedSpotlightProps) {
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

  // Parallax on mouse move
  const cardRef = useState<HTMLDivElement | null>(null)[0];
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  
  // Spotlight position
  const spotlightX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const spotlightY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Rarity calculation
  let rarityLabel = 'LEGENDARY SIGNAL';
  let rarityColor = 'from-red-500 to-amber-500 text-amber-300';
  if (item.hype_score >= 10) {
    rarityLabel = 'GRAIL MYTHIC DROP';
    rarityColor = 'from-purple-600 via-pink-500 to-amber-500 text-pink-300';
  } else if (item.is_restock) {
    rarityLabel = 'RESTOCK DISCOVERY';
    rarityColor = 'from-emerald-600 to-teal-400 text-teal-300';
  }

  return (
    <section className="py-12 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="mb-8">
          <span className="font-mono text-xs text-red-500 font-bold tracking-[0.3em] uppercase flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            VALUABLE SPOTLIGHT
          </span>
          <h2 className="font-outfit text-3xl font-black text-white mt-1 tracking-tight">
            FEATURED COLLECTIBLE
          </h2>
        </div>

        {/* 3D Interactive Card */}
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            perspective: 1000,
          }}
          className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-white/5 rounded-3xl p-6 md:p-10 lg:p-12 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] group"
        >
          {/* Custom Spotlight Glow Overlay */}
          <motion.div 
            style={{
              background: `radial-gradient(800px circle at ${spotlightX} ${spotlightY}, rgba(255,255,255,0.06), transparent 40%)`
            }}
            className="absolute inset-0 pointer-events-none"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Rarity & Realm tags */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${rarityColor} bg-opacity-10 border border-white/10`}>
                  <span className="font-outfit text-[10px] font-black tracking-[0.25em] uppercase">
                    {rarityLabel}
                  </span>
                </div>
                <div className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold font-outfit uppercase tracking-widest ${styleConf.bg} ${styleConf.border} ${styleConf.text}`}>
                  {item.category}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-outfit text-3xl md:text-5xl font-black text-white leading-none tracking-tight mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
                {item.title}
              </h3>

              {/* Description */}
              <p className="font-inter text-sm md:text-base text-gray-400 leading-relaxed mb-8 max-w-xl">
                {item.summary_short}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 mb-8 max-w-md">
                <div className="text-center border-r border-white/5">
                  <span className="block font-mono text-2xl font-black text-white">{item.hype_score}/10</span>
                  <span className="block font-outfit text-[10px] font-bold text-gray-500 tracking-wider uppercase mt-1">Hype Index</span>
                </div>
                <div className="text-center border-r border-white/5">
                  <span className="block font-mono text-2xl font-black text-white">{(item.engagement_count || 1200).toLocaleString()}</span>
                  <span className="block font-outfit text-[10px] font-bold text-gray-500 tracking-wider uppercase mt-1">Signals</span>
                </div>
                <div className="text-center">
                  <span className="block font-mono text-2xl font-black text-white">1st Class</span>
                  <span className="block font-outfit text-[10px] font-bold text-gray-500 tracking-wider uppercase mt-1">Rarity Class</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/article/${item.slug}`}
                  className="px-8 py-4 rounded-xl font-outfit font-extrabold text-xs tracking-wider text-black bg-white hover:bg-gray-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02]"
                >
                  ACQUIRE DETAILS
                </Link>
                {item.is_drop_alert && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 font-outfit text-xs font-bold tracking-wider text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live-blink" />
                    LIVE DROP ALERT
                  </span>
                )}
              </div>

            </div>

            {/* Right Media Frame Column */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative w-full max-w-[340px] aspect-[4/5] rounded-3xl border border-white/10 bg-slate-950 p-3 shadow-2xl overflow-hidden group/frame"
              >
                {/* Holographic light reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/frame:translate-x-[100%] transition-transform duration-1000 ease-out z-20 pointer-events-none" />

                {/* Card glow halo */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${rarityColor} rounded-3xl opacity-20 blur-xl group-hover/frame:opacity-40 transition-opacity duration-500`} />

                {/* Content Inner Frame */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-white/5">
                  <Image
                    src={imgSrc}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover transition-transform duration-700 ease-out group-hover/frame:scale-110"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    unoptimized={!!item.image_url}
                    onError={handleImageError}
                  />

                  {/* Corner styling accents */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/30" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/30" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/30" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/30" />

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                    <span className="font-mono text-xs font-black text-white">{item.hype_score}</span>
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
