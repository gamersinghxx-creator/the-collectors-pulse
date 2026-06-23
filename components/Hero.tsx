'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Shield, Sparkles, TrendingUp } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Motion values for mouse movement parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for lag-free premium feel
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Transforms for background grid shift
  const bgShiftX = useTransform(springX, [-0.5, 0.5], ['-15px', '15px']);
  const bgShiftY = useTransform(springY, [-0.5, 0.5], ['-15px', '15px']);

  // Floating elements tilt / transform
  const cardX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const cardY = useTransform(springY, [-0.5, 0.5], [-30, 30]);
  const cardRotate = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  const figureX = useTransform(springX, [-0.5, 0.5], [40, -40]);
  const figureY = useTransform(springY, [-0.5, 0.5], [-20, 20]);
  const figureRotate = useTransform(springY, [-0.5, 0.5], [10, -10]);

  const watchX = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const watchY = useTransform(springY, [-0.5, 0.5], [40, -40]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;  // -0.5 to 0.5
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleScrollToExplore = () => {
    const realms = document.getElementById('realms-section');
    if (realms) {
      realms.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTrending = () => {
    const trending = document.getElementById('trending-section');
    if (trending) {
      trending.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={heroRef}
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 dark:bg-black py-20 px-4"
    >
      {/* Background Interactive grid */}
      <motion.div 
        style={{ x: bgShiftX, y: bgShiftY }}
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
      />

      {/* Spotlights and Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />

      {/* Radial Spotlight Center Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_80%)] pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Subhead Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-outfit text-xs font-bold tracking-[0.2em] text-gray-300 uppercase">
            The Ultimate Collector Portal
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-outfit text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 tracking-tight leading-none mb-6"
        >
          COLLECTOR&apos;S UNIVERSE
        </motion.h1>

        {/* Subheadlines / Buzzwords */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 font-outfit text-lg md:text-2xl text-gray-400 mb-10 max-w-2xl font-light"
        >
          <span className="flex items-center gap-2">Discover<span className="w-1.5 h-1.5 rounded-full bg-blue-500" /></span>
          <span className="flex items-center gap-2">Track<span className="w-1.5 h-1.5 rounded-full bg-red-500" /></span>
          <span className="flex items-center gap-2">Collect<span className="w-1.5 h-1.5 rounded-full bg-amber-500" /></span>
          <span className="text-white font-medium tracking-wide">Experience.</span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <button
            onClick={handleScrollToExplore}
            className="group relative px-8 py-4 rounded-xl font-outfit font-extrabold text-sm tracking-wider text-black bg-white hover:bg-gray-100 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-[1.03] cursor-pointer"
          >
            EXPLORE UNIVERSE
          </button>
          
          <button
            onClick={handleScrollToTrending}
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-outfit font-bold text-sm tracking-wider text-white border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-red-500" />
            TRENDING DROPS
          </button>
        </motion.div>
      </div>

      {/* Floating Parallax Collectible Artworks */}
      
      {/* 1. TCG Card (Left Side) */}
      <motion.div
        style={{ x: cardX, y: cardY, rotate: cardRotate }}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 50, delay: 0.4 }}
        className="absolute left-6 md:left-[10%] top-[45%] -translate-y-1/2 w-32 md:w-44 aspect-[3/4] rounded-2xl border border-blue-500/30 bg-blue-900/10 backdrop-blur-md p-3 hidden sm:block pointer-events-none select-none shadow-[0_0_40px_rgba(59,130,246,0.15)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-purple-500/10 to-transparent" />
        <div className="w-full h-2/3 rounded-lg bg-blue-950/80 border border-blue-500/20 mb-3 flex items-center justify-center">
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <div className="h-2 w-16 bg-blue-500/40 rounded-full mb-1.5" />
        <div className="h-1.5 w-10 bg-blue-500/20 rounded-full" />
      </motion.div>

      {/* 2. Figure Grid (Right Side, lower) */}
      <motion.div
        style={{ x: figureX, y: figureY, rotate: figureRotate }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 50, delay: 0.5 }}
        className="absolute right-6 md:right-[10%] top-[35%] -translate-y-1/2 w-28 md:w-36 aspect-square rounded-2xl border border-red-500/30 bg-red-900/10 backdrop-blur-md p-4 hidden sm:block pointer-events-none select-none shadow-[0_0_40px_rgba(239,68,68,0.15)] flex flex-col justify-between"
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-red-500/20 via-amber-500/10 to-transparent" />
        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
          <span className="text-red-400 font-bold">LVL</span>
        </div>
        <div>
          <div className="h-2 w-20 bg-red-500/40 rounded-full mb-1.5" />
          <div className="h-1.5 w-12 bg-red-500/20 rounded-full" />
        </div>
      </motion.div>

      {/* 3. Luxury Watch Silhouette (Bottom Left) */}
      <motion.div
        style={{ x: watchX, y: watchY }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, delay: 0.6 }}
        className="absolute left-[15%] bottom-[12%] w-24 md:w-32 aspect-square rounded-full border border-amber-500/30 bg-amber-900/10 backdrop-blur-md p-3 hidden md:flex items-center justify-center pointer-events-none select-none shadow-[0_0_40px_rgba(245,158,11,0.15)]"
      >
        <div className="w-full h-full rounded-full border-2 border-dashed border-amber-500/20 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-amber-500/40 flex items-center justify-center">
            <span className="text-amber-400 text-xs">XI</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
