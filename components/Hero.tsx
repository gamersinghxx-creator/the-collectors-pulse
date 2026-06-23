'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Motion values for mouse movement parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for lag-free premium feel
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Transforms for background grid shift
  const bgShiftX = useTransform(springX, [-0.5, 0.5], ['-20px', '20px']);
  const bgShiftY = useTransform(springY, [-0.5, 0.5], ['-20px', '20px']);

  // Parallax shifts for characters
  const pikachuX = useTransform(springX, [-0.5, 0.5], [-50, 50]);
  const pikachuY = useTransform(springY, [-0.5, 0.5], [-50, 50]);
  const pikachuRotate = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  const luffyX = useTransform(springX, [-0.5, 0.5], [60, -60]);
  const luffyY = useTransform(springY, [-0.5, 0.5], [-40, 40]);
  const luffyRotate = useTransform(springY, [-0.5, 0.5], [12, -12]);

  const gokuX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const gokuY = useTransform(springY, [-0.5, 0.5], [60, -60]);
  const gokuRotate = useTransform(springX, [-0.5, 0.5], [-8, 8]);

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
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 dark:bg-black py-24 px-4"
    >
      {/* Background Interactive grid */}
      <motion.div 
        style={{ x: bgShiftX, y: bgShiftY }}
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
      />

      {/* Dynamic spotlights and Auras matching floating characters */}
      <div className="absolute top-[35%] left-[15%] w-80 h-80 rounded-full bg-yellow-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[25%] right-[15%] w-80 h-80 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[30%] w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

      {/* Radial Spotlight Center Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_80%)] pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Subhead Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-outfit text-xs font-black tracking-[0.25em] text-amber-400 uppercase">
            3D COLLECTIBLE REALM
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

        {/* Subheadlines */}
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

      {/* Floating 3D Toy Characters with mouse parallax */}
      
      {/* 1. 3D Pikachu Toy (Left side) */}
      <motion.div
        style={{ x: pikachuX, y: pikachuY, rotate: pikachuRotate }}
        initial={{ opacity: 0, scale: 0.5, x: -150 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 40, damping: 15, delay: 0.4 }}
        className="absolute left-[6%] top-[38%] w-36 md:w-56 aspect-square hidden sm:block pointer-events-none select-none filter drop-shadow-[0_10px_30px_rgba(234,179,8,0.35)]"
      >
        <Image
          src="/3d_pikachu_toy.png"
          alt="3D Pikachu Toy Figure"
          width={240}
          height={240}
          className="object-contain"
          priority
        />
        {/* Under character platform shadows */}
        <div className="w-2/3 h-3 bg-black/40 rounded-full blur-md mx-auto mt-[-10px] opacity-60 animate-pulse" />
      </motion.div>

      {/* 2. 3D Luffy Gear 5 Toy (Right side) */}
      <motion.div
        style={{ x: luffyX, y: luffyY, rotate: luffyRotate }}
        initial={{ opacity: 0, scale: 0.5, x: 150 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 40, damping: 15, delay: 0.5 }}
        className="absolute right-[6%] top-[28%] w-36 md:w-56 aspect-square hidden sm:block pointer-events-none select-none filter drop-shadow-[0_10px_30px_rgba(168,85,247,0.3)]"
      >
        <Image
          src="/3d_luffy_toy.png"
          alt="3D Luffy Gear 5 Toy Figure"
          width={240}
          height={240}
          className="object-contain"
          priority
        />
        <div className="w-2/3 h-3 bg-black/40 rounded-full blur-md mx-auto mt-[-10px] opacity-60 animate-pulse" />
      </motion.div>

      {/* 3. 3D Goku Super Saiyan Toy (Bottom Right) */}
      <motion.div
        style={{ x: gokuX, y: gokuY, rotate: gokuRotate }}
        initial={{ opacity: 0, scale: 0.5, y: 150 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 40, damping: 15, delay: 0.6 }}
        className="absolute right-[22%] bottom-[12%] w-32 md:w-48 aspect-square hidden md:block pointer-events-none select-none filter drop-shadow-[0_10px_30px_rgba(245,158,11,0.35)]"
      >
        <Image
          src="/3d_goku_toy.png"
          alt="3D Goku Toy Figure"
          width={200}
          height={200}
          className="object-contain"
          priority
        />
        <div className="w-2/3 h-3 bg-black/40 rounded-full blur-md mx-auto mt-[-10px] opacity-60 animate-pulse" />
      </motion.div>
      
    </div>
  );
}
