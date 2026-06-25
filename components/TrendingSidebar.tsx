'use client';
import Link from 'next/link';
import { NewsItem } from '../types';

interface TrendingSidebarProps { initialTrending: NewsItem[]; }

const CAT_COLOR: Record<string, string> = { tcg: 'var(--accent-tcg)', figures: 'var(--accent-figures)', watches: 'var(--accent-watches)', general: 'var(--gold)' };

export default function TrendingSidebar({ initialTrending }: TrendingSidebarProps) {
  return (
    <div id="trending-section" className="grad-border" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'sticky', top: '128px' }}>
      <div className="flex items-center justify-between" style={{ padding: 'var(--space-lg) var(--space-xl)', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(120deg, rgba(242,118,46,0.08), transparent)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ivory)' }}>🔥 Trending</span>
        <span className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600, color: 'var(--ember)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span className="animate-pulse-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--ember)', display: 'inline-block' }} />Live
        </span>
      </div>
      <div>
        {initialTrending.length === 0 && (
          <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--mist)' }}>Nothing trending yet.</p>
          </div>
        )}
        {initialTrending.map((item, index) => {
          const catColor = CAT_COLOR[item.category.toLowerCase()] || 'var(--gold)';
          return (
            <Link key={item.id} href={`/article/${item.slug}`} className="group" style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 'var(--space-md)', padding: 'var(--space-md) var(--space-xl)', borderBottom: '1px solid var(--border-color)', textDecoration: 'none', cursor: 'pointer', transition: 'background 0.2s ease' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: index === 0 ? catColor : 'var(--mist-dim)', lineHeight: 1, opacity: index === 0 ? 1 : 0.7 }}>
                {String(index + 1).padStart(2, '0')}
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: catColor, display: 'block', marginBottom: '5px' }}>
                  {item.category}
                </span>
                <h4 style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 500, color: 'var(--ivory)', lineHeight: 1.45, margin: '0 0 9px' }}>
                  {item.title}
                </h4>
                <div className="flex items-center gap-2">
                  <div style={{ height: '3px', flex: 1, background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(item.hype_score / 10) * 100}%`, background: catColor, borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 600, color: 'var(--mist)', flexShrink: 0 }}>{item.hype_score}/10</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
