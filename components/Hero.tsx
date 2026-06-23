'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Sparkles, TrendingUp, Radio, Calendar, FileText } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Motion values for mouse movement parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for lag-free premium feel
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Transforms for background grid shift
  const bgShiftX = useTransform(springX, [-0.5, 0.5], ['-30px', '30px']);
  const bgShiftY = useTransform(springY, [-0.5, 0.5], ['-30px', '30px']);

  // Parallax shifts for characters (larger values to feel organic and deep)
  const pikachuX = useTransform(springX, [-0.5, 0.5], [-80, 80]);
  const pikachuY = useTransform(springY, [-0.5, 0.5], [-80, 80]);
  const pikachuRotate = useTransform(springX, [-0.5, 0.5], [-20, 20]);

  const luffyX = useTransform(springX, [-0.5, 0.5], [100, -100]);
  const luffyY = useTransform(springY, [-0.5, 0.5], [-60, 60]);
  const luffyRotate = useTransform(springY, [-0.5, 0.5], [18, -18]);

  const gokuX = useTransform(springX, [-0.5, 0.5], [-50, 50]);
  const gokuY = useTransform(springY, [-0.5, 0.5], [100, -100]);
  const gokuRotate = useTransform(springX, [-0.5, 0.5], [-12, 12]);

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
      className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-slate-950 dark:bg-black py-28 px-4 border-b border-white/5"
    >
      {/* Background Interactive grid */}
      <motion.div 
        style={{ x: bgShiftX, y: bgShiftY }}
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none"
      />

      {/* Dynamic spotlights and Auras matching floating characters */}
      <div className="absolute top-[30%] left-[10%] w-[400px] h-[400px] rounded-full bg-yellow-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[25%] w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* Radial Spotlight Center Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_80%)] pointer-events-none" />

      {/* Top and Bottom Tech Line Borders */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Content wrapper */}
      <div className="relative z-20 max-w-5xl mx-auto text-center flex flex-col items-center select-none">
        
        {/* Hub telemetry badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-md mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-mono text-[10px] font-black tracking-[0.3em] text-amber-400 uppercase">
            LIVE INTEL • REVEALS • EVENTS • GUIDES
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-outfit text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 tracking-tight leading-none mb-6"
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

        {/* Hub stats overview directly in hero for informational density */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="grid grid-cols-3 gap-6 md:gap-12 px-8 py-4 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-md mb-12 text-left"
        >
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <span className="block font-mono text-lg font-black text-white leading-none">2,854</span>
              <span className="font-outfit text-[9px] font-bold text-gray-500 tracking-widest uppercase">Drops Tracked</span>
            </div>
          </div>
          <div className="flex items-center gap-3 border-x border-white/5 px-6 md:px-12">
            <Calendar className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <span className="block font-mono text-lg font-black text-white leading-none">14 Active</span>
              <span className="font-outfit text-[9px] font-bold text-gray-500 tracking-widest uppercase">Release Events</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="block font-mono text-lg font-black text-white leading-none">95 Guides</span>
              <span className="font-outfit text-[9px] font-bold text-gray-500 tracking-widest uppercase">Expert Articles</span>
            </div>
          </div>
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
            EXPLORE REALMS
          </button>
          
          <button
            onClick={handleScrollToTrending}
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-outfit font-bold text-sm tracking-wider text-white border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-red-500" />
            TRENDING LEADERBOARD
          </button>
        </motion.div>
      </div>

      {/* Floating 3D Character Artworks (Blended using mix-blend-mode: screen/lighten to dissolve the black background) */}
      
      {/* 1. 3D Pikachu Toy (Left side - Large, bleeding off-screen slightly, fused with background) */}
      <motion.div
        style={{ x: pikachuX, y: pikachuY, rotate: pikachuRotate }}
        initial={{ opacity: 0, scale: 0.8, x: -200 }}
        animate={{ opacity: 0.85, scale: 1.1, x: 0 }}
        transition={{ type: 'spring', stiffness: 35, damping: 18, delay: 0.4 }}
        className="absolute left-[-2%] md:left-[2%] top-[25%] w-[250px] md:w-[380px] aspect-square hidden sm:block pointer-events-none select-none mix-blend-screen filter drop-shadow-[0_0_40px_rgba(234,179,8,0.2)]"
      >
        <Image
          src="/3d_pikachu_toy.png"
          alt="3D Pikachu Toy Figure"
          width={380}
          height={380}
          className="object-contain"
          priority
        />
        {/* Telemetry info box overlay floating next to Pikachu */}
        <div className="absolute bottom-10 left-10 p-3 rounded-lg border border-yellow-500/10 bg-slate-950/80 backdrop-blur-md font-mono text-[9px] text-yellow-500/60 leading-tight hidden lg:block">
          <div className="font-bold text-white mb-0.5">INTEL REPORT: #TCG-025</div>
          <div>STATUS: HIGH DEMAND SIGNAL</div>
          <div>EST HYPE: 10.0 // CHARIZARD EX</div>
        </div>
      </motion.div>

      {/* 2. 3D Luffy Gear 5 Toy (Right side - Large, bleeding off-screen, fused with background) */}
      <motion.div
        style={{ x: luffyX, y: luffyY, rotate: luffyRotate }}
        initial={{ opacity: 0, scale: 0.8, x: 200 }}
        animate={{ opacity: 0.85, scale: 1.15, x: 0 }}
        transition={{ type: 'spring', stiffness: 35, damping: 18, delay: 0.5 }}
        className="absolute right-[-4%] md:right-[2%] top-[15%] w-[250px] md:w-[380px] aspect-square hidden sm:block pointer-events-none select-none mix-blend-screen filter drop-shadow-[0_0_40px_rgba(168,85,247,0.15)]"
      >
        <Image
          src="/3d_luffy_toy.png"
          alt="3D Luffy Gear 5 Toy Figure"
          width={380}
          height={380}
          className="object-contain"
          priority
        />
        <div className="absolute top-10 right-10 p-3 rounded-lg border border-purple-500/10 bg-slate-950/80 backdrop-blur-md font-mono text-[9px] text-purple-400/60 leading-tight hidden lg:block">
          <div className="font-bold text-white mb-0.5">DATABASE REVEAL: OP-07</div>
          <div>STATUS: PRE-ORDER SCHEDULED</div>
          <div>REALM: ANIME FIGURES</div>
        </div>
      </motion.div>

      {/* 3. 3D Goku Super Saiyan Toy (Bottom Right - Large, floating, fused with background) */}
      <motion.div
        style={{ x: gokuX, y: gokuY, rotate: gokuRotate }}
        initial={{ opacity: 0, scale: 0.8, y: 200 }}
        animate={{ opacity: 0.85, scale: 1.1, y: 0 }}
        transition={{ type: 'spring', stiffness: 35, damping: 18, delay: 0.6 }}
        className="absolute right-[15%] bottom-[5%] w-[200px] md:w-[320px] aspect-square hidden md:block pointer-events-none select-none mix-blend-screen filter drop-shadow-[0_0_40px_rgba(245,158,11,0.2)]"
      >
        <Image
          src="/3d_goku_toy.png"
          alt="3D Goku Toy Figure"
          width={320}
          height={320}
          className="object-contain"
          priority
        />
        <div className="absolute bottom-5 right-[-20px] p-3 rounded-lg border border-amber-500/10 bg-slate-950/80 backdrop-blur-md font-mono text-[9px] text-amber-500/60 leading-tight hidden lg:block">
          <div className="font-bold text-white mb-0.5">RELEASE EVENT: BANDAI EXCLUSIVE</div>
          <div>DATE: FRIDAY 10:00 AM PST</div>
          <div>TYPE: DROP ALERTS ENABLED</div>
        </div>
      </motion.div>
      
    </div>
  );
}
