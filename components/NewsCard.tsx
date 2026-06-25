'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { NewsItem } from '../types';

interface NewsCardProps { item: NewsItem; index: number; featured?: boolean; className?: string; }

const CAT_GRADIENT: Record<string, string> = {
  tcg: 'linear-gradient(135deg, rgba(46,139,255,0.34), rgba(7,7,13,0.92))',
  figures: 'linear-gradient(135deg, rgba(194,75,245,0.34), rgba(7,7,13,0.92))',
  watches: 'linear-gradient(135deg, rgba(232,201,106,0.26), rgba(7,7,13,0.92))',
  general: 'linear-gradient(135deg, rgba(242,118,46,0.22), rgba(7,7,13,0.92))',
};
const CAT_COLOR: Record<string, string> = { tcg: 'var(--accent-tcg)', figures: 'var(--accent-figures)', watches: 'var(--accent-watches)', general: 'var(--gold)' };
const CAT_BG: Record<string, string> = { tcg: 'var(--accent-tcg-soft)', figures: 'var(--accent-figures-soft)', watches: 'var(--accent-watches-soft)', general: 'var(--glow-gold)' };
const CAT_BORDER: Record<string, string> = { tcg: 'rgba(46,139,255,0.4)', figures: 'rgba(194,75,245,0.4)', watches: 'rgba(232,201,106,0.35)', general: 'rgba(216,182,90,0.45)' };
const CAT_GLOW: Record<string, string> = { tcg: 'rgba(46,139,255,0.35)', figures: 'rgba(194,75,245,0.35)', watches: 'rgba(232,201,106,0.3)', general: 'var(--glow-ember)' };

export default function NewsCard({ item, index, featured = false, className = '' }: NewsCardProps) {
  const catKey = item.category.toLowerCase();
  const gradient = CAT_GRADIENT[catKey] || CAT_GRADIENT.general;
  const catColor = CAT_COLOR[catKey] || 'var(--gold)';
  const catBg = CAT_BG[catKey] || 'var(--glow-gold)';
  const catBorder = CAT_BORDER[catKey] || 'rgba(216,182,90,0.45)';
  const catGlow = CAT_GLOW[catKey] || 'var(--glow-ember)';
  const [imgSrc] = React.useState(item.image_url || '');
  const [imgFailed, setImgFailed] = React.useState(!item.image_url);
  const timeAgo = item.published_at ? formatDistanceToNow(new Date(item.published_at), { addSuffix: true }) : 'Recently';

  return (
    <Link
      href={`/article/${item.slug}`}
      className={`story-card group ${className}`}
      style={{ ['--card-accent' as string]: catColor, ['--card-glow' as string]: catGlow, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--vault)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', cursor: 'pointer', animationDelay: `${index * 0.05}s` }}
    >
      <span className="card-sheen" />
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: featured ? '16/7' : '16/9' }}>
        {!imgFailed ? (
          <Image src={imgSrc} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="collector-image object-cover" unoptimized={imgSrc.startsWith('http')} onError={() => setImgFailed(true)} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: gradient }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,13,0.82) 0%, transparent 58%)' }} />
        {/* top accent hairline */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: catColor, opacity: 0.9 }} />
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 9px', borderRadius: 'var(--radius-sm)', background: catBg, color: catColor, border: `1px solid ${catBorder}`, backdropFilter: 'blur(6px)' }}>{item.category}</span>
          {item.is_drop_alert && <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 9px', borderRadius: 'var(--radius-sm)', background: 'var(--grad-ember)', color: 'var(--on-accent)' }}>Drop</span>}
          {item.is_restock && <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, padding: '4px 9px', borderRadius: 'var(--radius-sm)', background: 'rgba(22,214,160,0.16)', color: 'var(--accent-restock)', border: '1px solid rgba(22,214,160,0.35)' }}>Restock</span>}
        </div>
        {item.hype_score >= 7 && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, color: item.hype_score >= 9 ? 'var(--crimson)' : 'var(--gold-bright)', background: 'rgba(7,7,13,0.78)', border: `1px solid ${item.hype_score >= 9 ? 'rgba(226,59,46,0.45)' : 'var(--border-bright)'}`, padding: '4px 9px', borderRadius: 'var(--radius-sm)', backdropFilter: 'blur(8px)' }}>
            {item.hype_score >= 9 ? '🔥 ' : ''}{item.hype_score}/10
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 'var(--space-lg)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: catColor, marginBottom: 'var(--space-sm)' }}>{item.source_name}</div>
        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: featured ? '30px' : '21px', fontWeight: 600, color: 'var(--ivory)', lineHeight: 1.2, marginBottom: 'var(--space-sm)' }}>{item.title}</h3>
        {item.summary_short && <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'var(--mist)', lineHeight: 1.6, flexGrow: 1, marginBottom: 'var(--space-md)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{item.summary_short}</p>}
        <div className="flex items-center justify-between" style={{ marginTop: 'auto', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--mist-dim)' }} suppressHydrationWarning>{timeAgo}</span>
          <span className="read-more" style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600, color: catColor, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>Read →</span>
        </div>
      </div>
    </Link>
  );
}
