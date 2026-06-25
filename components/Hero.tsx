'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { NewsItem } from '../types';

const CATEGORY_HERO: Record<string, { eyebrow: string; jp: string; small: string; big: string; tail: string }> = {
  ALL: {
    eyebrow: 'リアルタイム・インテル · AI-CURATED COLLECTOR INTEL',
    jp: 'コレクター',
    small: 'Every drop. Every restock.',
    big: 'DECODED BY AI.',
    tail: 'The moment it breaks.',
  },
  TCG: {
    eyebrow: 'トレカ・マーケット · TRADING CARD MARKET FEED',
    jp: 'トレカ',
    small: 'The market moves.',
    big: 'BE FIRST',
    tail: 'to know.',
  },
  FIGURES: {
    eyebrow: 'フィギュア · FIGURE & COLLECTIBLE DROPS',
    jp: 'フィギュア',
    small: 'Every release.',
    big: 'EVERY DROP.',
    tail: 'Tracked live.',
  },
  WATCHES: {
    eyebrow: 'ホロロジー · LUXURY HOROLOGY DESK',
    jp: '時計',
    small: 'Rare timepieces.',
    big: 'RARER ODDS.',
    tail: 'Caught early.',
  },
};

const PILLS = [
  { key: 'ALL', label: 'All News', href: '/news', accent: 'var(--gold)' },
  { key: 'TCG', label: 'Trading Cards', href: '/news?category=tcg', accent: 'var(--accent-tcg)' },
  { key: 'FIGURES', label: 'Figures', href: '/news?category=figures', accent: 'var(--accent-figures)' },
  { key: 'WATCHES', label: 'Watches', href: '/news?category=watches', accent: 'var(--accent-watches)' },
];

const CHANNELS = [
  { key: 'TCG', label: 'TCG', accent: 'var(--accent-tcg)' },
  { key: 'FIGURES', label: 'FIGURES', accent: 'var(--accent-figures)' },
  { key: 'WATCHES', label: 'WATCHES', accent: 'var(--accent-watches)' },
];

interface HeroProps { tickerItems?: NewsItem[]; category?: string; }

export default function Hero({ tickerItems = [], category: propCategory }: HeroProps) {
  const searchParams = useSearchParams();
  const cat = (propCategory || searchParams.get('category') || 'ALL').toUpperCase();
  const hero = CATEGORY_HERO[cat] || CATEGORY_HERO.ALL;

  const duplicated = [...tickerItems, ...tickerItems];
  const tickerDuration = Math.max(tickerItems.length * 5, 30);
  const dropCount = tickerItems.filter(i => i.is_drop_alert).length;
  const trendingCount = tickerItems.filter(i => i.is_trending).length;
  const countFor = (k: string) => tickerItems.filter(i => i.category.toUpperCase() === k).length;
  const feed = tickerItems.slice(0, 6);
  const feedLoop = feed.length > 0 ? [...feed, ...feed] : [];

  const CAT_COLOR: Record<string, string> = { tcg: 'var(--accent-tcg)', figures: 'var(--accent-figures)', watches: 'var(--accent-watches)', general: 'var(--gold)' };

  return (
    <section className="dark" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--obsidian)', overflow: 'hidden' }}>
      {/* Backdrops */}
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.7, maskImage: 'radial-gradient(ellipse 80% 70% at 50% 35%, #000 30%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 35%, #000 30%, transparent 80%)' }} />
      <div style={{ position: 'absolute', inset: '-10%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse 50% 45% at 80% 28%, rgba(255,39,71,0.16), transparent 60%), radial-gradient(ellipse 45% 50% at 12% 70%, rgba(43,231,255,0.12), transparent 62%), radial-gradient(ellipse 40% 40% at 60% 95%, rgba(242,118,46,0.10), transparent 60%)' }} />
      <div className="scanlines" style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.5 }} />

      {/* Giant katakana watermark */}
      <span aria-hidden style={{ position: 'absolute', right: '-2%', top: '6%', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(120px, 22vw, 300px)', color: 'transparent', WebkitTextStroke: '1px rgba(255,39,71,0.07)', zIndex: 0, lineHeight: 0.8, pointerEvents: 'none', userSelect: 'none' }}>
        {hero.jp}
      </span>

      <div className="relative flex-1 max-w-7xl mx-auto w-full px-6 lg:px-10 pt-28 pb-0" style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: '2.5rem', alignItems: 'center', zIndex: 2 }}>

        {/* ── Left: message ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="animate-fade-up self-start mb-7 flex items-center gap-3" style={{ padding: '7px 16px', borderRadius: '2px', background: 'rgba(43,231,255,0.06)', border: '1px solid rgba(43,231,255,0.3)' }}>
            <span className="animate-rec-blink" style={{ width: '7px', height: '7px', background: 'var(--neon-red)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.16em', color: 'var(--neon-cyan)', textTransform: 'uppercase' }}>
              {hero.eyebrow}
            </span>
          </div>

          <h1 className="animate-fade-up" style={{ margin: '0 0 1.6rem', animationDelay: '0.08s', lineHeight: 0.98 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(30px, 3.6vw, 54px)', color: 'var(--ivory)', letterSpacing: '-0.01em' }}>
              {hero.small}
            </span>
            <span className="cyber-glitch" style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(56px, 9vw, 132px)', color: 'var(--ember)', letterSpacing: '-0.04em', textTransform: 'uppercase', margin: '2px 0' }}>
              {hero.big}
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(30px, 3.6vw, 54px)', color: 'var(--ivory)', letterSpacing: '-0.01em' }}>
              {hero.tail}
            </span>
          </h1>

          <p className="animate-fade-up" style={{ fontFamily: 'var(--font-inter)', fontSize: '16px', color: 'var(--mist)', lineHeight: 1.65, maxWidth: '460px', marginBottom: '1.6rem', animationDelay: '0.15s' }}>
            The real-time newsroom for <strong style={{ color: 'var(--ivory)', fontWeight: 500 }}>trading cards, anime figures &amp; luxury watches</strong>. We scan the market 24/7 — every drop, restock, and price move — and an AI summarizes and hype-scores it the second it breaks.
          </p>

          {/* Spec chip */}
          <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'stretch', gap: '0', marginBottom: '2rem', maxWidth: '460px', border: '1px solid var(--border-bright)', borderLeft: '2px solid var(--neon-red)', background: 'rgba(255,255,255,0.02)', animationDelay: '0.2s' }}>
            <div style={{ padding: '12px 16px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--neon-cyan)', marginBottom: '4px' }}>
                ⬢ PULSE.AI <span style={{ color: 'var(--mist-dim)' }}>// v2</span>
              </div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--mist)', lineHeight: 1.5 }}>
                Always-on intelligence across the collector universe — so you&apos;re first to every release and never miss a restock.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 animate-fade-up" style={{ animationDelay: '0.26s' }}>
            {PILLS.map(({ key, label, href, accent }) => {
              const isActive = cat === key;
              return (
                <Link
                  key={key}
                  href={href}
                  style={{
                    fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '10px 20px', borderRadius: '2px',
                    border: `1px solid ${isActive ? accent : 'var(--border-bright)'}`,
                    color: isActive ? 'var(--obsidian)' : 'var(--ivory)',
                    background: isActive ? accent : 'rgba(255,255,255,0.02)',
                    textDecoration: 'none', transition: 'all 0.22s ease',
                    boxShadow: isActive ? `0 0 22px -4px ${accent}` : 'none',
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="animate-fade-up flex items-center gap-7 mt-8" style={{ animationDelay: '0.32s' }}>
            {[
              { label: 'Live drops', value: dropCount, color: 'var(--neon-red)' },
              { label: 'Trending', value: trendingCount, color: 'var(--ember)' },
              { label: 'Stories', value: tickerItems.length, color: 'var(--neon-cyan)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: s.color, lineHeight: 1 }}>{String(s.value).padStart(2, '0')}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mist-dim)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: live PULSE feed console ────────────────────────── */}
        <div className="relative hidden lg:block animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <span className="vert-label" aria-hidden style={{ position: 'absolute', left: '-34px', top: '12%', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600, color: 'var(--neon-red)', textTransform: 'uppercase' }}>
            ライブ // LIVE FEED
          </span>

          <div className="neon-frame" style={{ position: 'relative', borderRadius: '2px', background: 'linear-gradient(170deg, rgba(16,16,25,0.96), rgba(7,7,13,0.98))', overflow: 'hidden', height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div className="scanlines" style={{ position: 'absolute', inset: 0, zIndex: 3, opacity: 0.6 }} />

            {/* Console header */}
            <div className="flex items-center justify-between" style={{ padding: '14px 18px', borderBottom: '1px solid rgba(43,231,255,0.18)', zIndex: 2 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--neon-cyan)' }}>◢ PULSE.OS</span>
              <span className="flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--neon-red)', textTransform: 'uppercase' }}>
                <span className="animate-rec-blink" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--neon-red)', display: 'inline-block' }} />REC
              </span>
            </div>

            {/* Channel monitors */}
            <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(43,231,255,0.12)', display: 'flex', flexDirection: 'column', gap: '11px', zIndex: 2 }}>
              {CHANNELS.map(ch => {
                const n = countFor(ch.key);
                const pct = tickerItems.length ? Math.round((n / tickerItems.length) * 100) : 0;
                return (
                  <div key={ch.key} className="flex items-center gap-3">
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: ch.accent, width: '74px' }}>{ch.label}</span>
                    <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: ch.accent, boxShadow: `0 0 10px ${ch.accent}` }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, color: 'var(--ivory)', width: '24px', textAlign: 'right' }}>{String(n).padStart(2, '0')}</span>
                  </div>
                );
              })}
            </div>

            {/* Streaming headlines */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 2 }}>
              <div style={{ position: 'absolute', inset: 0, padding: '6px 0' }}>
                <div className={feedLoop.length ? 'feed-scroll-track' : ''}>
                  {feedLoop.map((item, idx) => {
                    const c = CAT_COLOR[item.category.toLowerCase()] || 'var(--gold)';
                    return (
                      <div key={`${item.id}-${idx}`} className="flex items-start gap-2.5" style={{ padding: '9px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: c, marginTop: '1px', flexShrink: 0 }}>
                          {item.is_drop_alert ? '◤DROP' : '▸'}
                        </span>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: 'var(--mist)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const }}>
                          {item.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70px', background: 'linear-gradient(to top, var(--obsidian), transparent)', pointerEvents: 'none', zIndex: 3 }} />
            </div>

            {/* Console footer */}
            <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(43,231,255,0.18)', fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--mist-dim)', textTransform: 'uppercase', zIndex: 2 }}>
              <span style={{ color: 'var(--neon-cyan)' }}>&gt;</span> curated by claude ai · scanning_
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom live ticker ────────────────────────────────────── */}
      {tickerItems.length > 0 && (
        <div style={{ width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', height: '46px', marginTop: 'auto', background: 'rgba(7,7,13,0.8)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(43,231,255,0.2)', position: 'relative', zIndex: 2 }}>
        <div style={{ flexShrink: 0, height: '100%', display: 'flex', alignItems: 'center', gap: '9px', padding: '0 22px', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, color: 'var(--on-accent)', letterSpacing: '0.18em', textTransform: 'uppercase', background: 'var(--neon-red)' }}>
            <span className="animate-rec-blink" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--obsidian)', display: 'inline-block' }} />
            Live
          </div>
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: 'max-content', animation: `ticker-scroll ${tickerDuration}s linear infinite` }}>
              {duplicated.map((item, idx) => (
                <span key={`${item.id}-${idx}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', padding: '0 28px', fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--mist)', whiteSpace: 'nowrap' }}>
                  {item.is_drop_alert && <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--neon-red)' }}>DROP</span>}
                  {item.is_restock && <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-restock)' }}>RESTOCK</span>}
                  {item.title}
                  <span style={{ color: 'var(--neon-cyan)' }}>{'//'}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
