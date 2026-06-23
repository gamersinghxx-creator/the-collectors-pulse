'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Shield, Eye, Flame, Box, Compass, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface RealmCardProps {
  title: string;
  name: string;
  description: string;
  href: string;
  active: boolean;
  colorClass: string;
  gradientClass: string;
  glowColor: string;
  icon: React.ReactNode;
  characterSnippet?: string;
  miniBgImage?: string;
}

function RealmCard({
  title,
  name,
  description,
  href,
  active,
  colorClass,
  gradientClass,
  glowColor,
  icon,
  characterSnippet,
  miniBgImage,
}: RealmCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ '--glow-color': glowColor } as React.CSSProperties}
      className={`relative flex flex-col justify-between p-8 rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer min-h-[300px] group ${
        active
          ? 'bg-slate-900/90 border-[color:var(--glow-color)] shadow-[0_0_35px_var(--glow-color)]/25'
          : 'bg-slate-950/40 border-white/5 hover:border-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]'
      }`}
    >
      {/* Background Realm-specific Gradient on Hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
      />

      {/* Decorative Character Silhouette background */}
      {miniBgImage && (
        <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500 pointer-events-none">
          <Image
            src={miniBgImage}
            alt="Character silhouette overlay"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>
      )}

      {/* Decorative Particle Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_20%,black_80%)] opacity-60 pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300 ${colorClass}`}>
            {icon}
          </div>
          {active && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-outfit text-[10px] font-bold tracking-widest text-white uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              ACTIVE REALM
            </span>
          )}
        </div>

        <span className="font-mono text-xs font-bold tracking-[0.2em] text-gray-500 group-hover:text-gray-400 transition-colors uppercase">
          {name}
        </span>
        <h3 className="font-outfit text-2xl font-black text-white mt-1 leading-tight tracking-tight">
          {title}
        </h3>
        
        {/* Character Highlight Snippet */}
        {characterSnippet && (
          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold font-mono text-amber-400 uppercase">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {characterSnippet}
          </div>
        )}

        <p className="font-inter text-sm text-gray-400 mt-3 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action button */}
      <Link href={href} className="relative z-10 mt-6 inline-flex items-center gap-2 font-outfit text-xs font-bold tracking-[0.15em] text-white group-hover:translate-x-2 transition-transform duration-300">
        <span>ENTER REALM</span>
        <span className={`text-sm ${colorClass}`}>→</span>
      </Link>
    </motion.div>
  );
}

export default function CategoryRealms() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category')?.toUpperCase() || 'ALL';

  const realms = [
    {
      title: 'ALL REALMS',
      name: 'Omniverse',
      description: 'Unified stream of all cards, drops, watches, and collector events in the database.',
      href: '/',
      active: currentCategory === 'ALL',
      colorClass: 'text-purple-400',
      gradientClass: 'from-purple-600/30 via-transparent to-transparent',
      glowColor: '#c084fc',
      icon: <Compass className="w-6 h-6" />,
      characterSnippet: 'PIKACHU • GOKU • LUFFY ACTIVE',
    },
    {
      title: 'TCG REALM',
      name: 'Card Vault',
      description: 'Discover rare Pokémon cards, One Piece booster reveals, and trending tabletop singles.',
      href: '/?category=tcg',
      active: currentCategory === 'TCG',
      colorClass: 'text-blue-400',
      gradientClass: 'from-blue-600/30 via-transparent to-transparent',
      glowColor: '#3b82f6',
      icon: <Shield className="w-6 h-6" />,
      characterSnippet: '3D Pikachu Card Radar Live',
      miniBgImage: '/3d_pikachu_toy.png',
    },
    {
      title: 'FIGURE VAULT',
      name: 'Figure Citadel',
      description: 'Premium S.H.Figuarts, anime scaling sculpts, rare statue reveals, and Premium Bandai drops.',
      href: '/?category=figures',
      active: currentCategory === 'FIGURES',
      colorClass: 'text-red-400',
      gradientClass: 'from-red-600/30 via-transparent to-transparent',
      glowColor: '#ef4444',
      icon: <Box className="w-6 h-6" />,
      characterSnippet: 'Luffy Gear 5 & Goku SSJ Vault',
      miniBgImage: '/3d_luffy_toy.png',
    },
    {
      title: 'WATCH OBSERVATORY',
      name: 'Observatory',
      description: 'Real-time restock alerts, mechanical chronographs, steel submariners, and luxury watch guides.',
      href: '/?category=watches',
      active: currentCategory === 'WATCHES',
      colorClass: 'text-amber-400',
      gradientClass: 'from-amber-600/30 via-transparent to-transparent',
      glowColor: '#f59e0b',
      icon: <Flame className="w-6 h-6" />,
      characterSnippet: 'Luxury Restock Radar Live',
      miniBgImage: '/3d_goku_toy.png', // Goku theme aura matches watch amber tones
    },
  ];

  return (
    <section id="realms-section" className="py-16 border-b border-white/5 relative bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 text-center md:text-left">
          <span className="font-mono text-xs text-amber-500 font-bold tracking-[0.3em] uppercase">
            IMMERSIVE PATHWAYS
          </span>
          <h2 className="font-outfit text-3xl md:text-4xl font-black text-white mt-2 tracking-tight">
            CATEGORY REALMS
          </h2>
          <p className="font-inter text-sm text-gray-400 mt-2 max-w-lg">
            Step into dedicated portals engineered for specialized collectors. Filter signals instantly.
          </p>
        </div>

        {/* Realms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {realms.map((realm) => (
            <RealmCard key={realm.title} {...realm} />
          ))}
        </div>

      </div>
    </section>
  );
}
