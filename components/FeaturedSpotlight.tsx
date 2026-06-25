'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { NewsItem } from '../types';

interface FeaturedSpotlightProps { item: NewsItem; }

const CAT_COLOR: Record<string, string> = { tcg: 'var(--accent-tcg)', figures: 'var(--accent-figures)', watches: 'var(--accent-watches)', general: 'var(--gold)' };
const CAT_BG: Record<string, string> = { tcg: 'var(--accent-tcg-soft)', figures: 'var(--accent-figures-soft)', watches: 'var(--accent-watches-soft)', general: 'var(--glow-gold)' };
const CAT_BORDER: Record<string, string> = { tcg: 'rgba(46,139,255,0.4)', figures: 'rgba(194,75,245,0.4)', watches: 'rgba(232,201,106,0.35)', general: 'rgba(216,182,90,0.45)' };
const CAT_GLOW: Record<string, string> = { tcg: 'rgba(46,139,255,0.22)', figures: 'rgba(194,75,245,0.22)', watches: 'rgba(232,201,106,0.2)', general: 'var(--glow-ember)' };

export default function FeaturedSpotlight({ item }: FeaturedSpotlightProps) {
  const catKey = item.category.toLowerCase();
  const catColor = CAT_COLOR[catKey] || 'var(--gold)';
  const catBg = CAT_BG[catKey] || 'var(--glow-gold)';
  const catBorder = CAT_BORDER[catKey] || 'rgba(216,182,90,0.45)';
  const catGlow = CAT_GLOW[catKey] || 'var(--glow-ember)';
  const [imgSrc] = React.useState(item.image_url || '');
  const [imgFailed, setImgFailed] = React.useState(!item.image_url);
  const timeAgo = item.published_at ? formatDistanceToNow(new Date(item.published_at), { addSuffix: true }) : 'Recently';

  return (
    <section style={{ padding: 'var(--space-3xl) 0 var(--space-2xl)', position: 'relative' }}>
      {/* section glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 60% 50% at 30% 40%, ${catGlow}, transparent 70%)` }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <div className="flex items-center gap-3 mb-7">
          <span className="animate-pulse-dot" style={{ width: '9px', height: '9px', borderRadius: '50%', background: 'var(--crimson)', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ivory)' }}>Top Story</span>
          <span style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, var(--border-bright), transparent)' }} />
        </div>
        <Link
          href={`/article/${item.slug}`}
          className="top-story group"
          style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '0', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', background: 'var(--vault)', textDecoration: 'none', overflow: 'hidden' }}
        >
          <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3', minHeight: '340px' }}>
            {!imgFailed ? (
              <Image src={imgSrc} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 55vw" className="collector-image object-cover" unoptimized={imgSrc.startsWith('http')} onError={() => setImgFailed(true)} />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--chamber), var(--vault))' }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 55%, var(--vault) 100%)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
            <div className="flex items-center gap-2 flex-wrap mb-5">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 11px', borderRadius: 'var(--radius-sm)', background: catBg, color: catColor, border: `1px solid ${catBorder}` }}>{item.category}</span>
              {item.hype_score >= 8 && <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 11px', borderRadius: 'var(--radius-sm)', background: 'var(--grad-ember)', color: 'var(--on-accent)' }}>🔥 Hot</span>}
            </div>
            <h2 className="story-headline" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(28px, 3.4vw, 44px)', fontWeight: 600, color: 'var(--ivory)', lineHeight: 1.1, letterSpacing: '-0.015em', marginBottom: 'var(--space-md)' }}>{item.title}</h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: 'var(--mist)', lineHeight: 1.7, marginBottom: 'var(--space-xl)' }}>{item.summary_short}</p>
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--mist-dim)', letterSpacing: '0.04em' }} suppressHydrationWarning>{item.source_name} · {timeAgo}</span>
              <span className="read-more" style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: catColor, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>Read Story →</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
