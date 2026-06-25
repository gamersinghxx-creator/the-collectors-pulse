'use client';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ThemeToggle } from './ThemeToggle';
import { NewsItem } from '../types';

const CAT_COLOR: Record<string, string> = { tcg: 'var(--accent-tcg)', figures: 'var(--accent-figures)', watches: 'var(--accent-watches)', general: 'var(--gold)' };
const CAT_BG: Record<string, string> = { tcg: 'var(--accent-tcg-soft)', figures: 'var(--accent-figures-soft)', watches: 'var(--accent-watches-soft)', general: 'var(--glow-gold)' };

const NAV = [
  { label: 'All Items', href: '/' },
  { label: 'Newsroom', href: '/news' },
  { label: 'Features', href: '/news#realms-section' },
  { label: 'About Us', href: '/news#trending-section' },
];

function timeAgo(d?: string) {
  return d ? formatDistanceToNow(new Date(d), { addSuffix: true }) : 'Recently';
}

export default function HubLanding({ items }: { items: NewsItem[] }) {
  const filtered = items;
  const hasRealImage = (i: NewsItem) => typeof i.image_url === 'string' && i.image_url.includes('/images/articles/');
  const featPool = filtered.some(hasRealImage) ? filtered.filter(hasRealImage) : filtered;
  const featured = featPool.reduce((m, i) => (i.hype_score > (m?.hype_score ?? -1) ? i : m), featPool[0]);
  const grid = filtered.filter(i => i.slug !== featured?.slug).slice(0, 4);
  const trending = [...items].sort((a, b) => (b.hype_score || 0) - (a.hype_score || 0)).slice(0, 2);

  return (
    <main className="dark" style={{ position: 'relative', minHeight: '100vh', background: 'var(--obsidian)', overflow: 'hidden' }}>

      {/* ── Art background: Pokémon (left) + One Piece (right) ─────── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="kenburns-left" style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '48%', backgroundImage: 'url(/hub-bg-left.jpg)', backgroundSize: 'cover', backgroundPosition: 'left center', filter: 'saturate(1.12) contrast(1.03)' }} />
        <div className="kenburns-right" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '48%', backgroundImage: 'url(/hub-bg-right.jpg)', backgroundSize: 'cover', backgroundPosition: 'right center', filter: 'saturate(1.12) contrast(1.03)' }} />
        {/* Readability overlays — lighter at the edges so the art breathes */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(7,7,13,0.42) 0%, rgba(7,7,13,0.88) 27%, rgba(7,7,13,0.93) 50%, rgba(7,7,13,0.88) 73%, rgba(7,7,13,0.42) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,7,13,0.8) 0%, transparent 16%, transparent 78%, var(--obsidian) 100%)' }} />
        {/* Brand glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(242,118,46,0.08), transparent 70%)' }} />
      </div>

      <div className="relative" style={{ zIndex: 2 }}>
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
            <div style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'var(--grad-ember)', color: 'var(--on-accent)', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, boxShadow: '0 0 22px -4px var(--glow-ember)' }}>CP</div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '20px', fontWeight: 600, color: 'var(--ivory)' }}>The Collector&apos;s Hub</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.24em', color: 'var(--gold)', textTransform: 'uppercase', marginTop: '3px' }}>Collect · Track · Discover</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-9">
            {NAV.map(n => (
              <Link key={n.label} href={n.href} className="nav-link" style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: n.label === 'All Items' ? 'var(--gold)' : 'var(--mist)', textDecoration: 'none' }}>
                {n.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        </header>

        {/* ── Hero title ─────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-2 text-center">
          <span className="animate-fade-up" style={{ display: 'inline-block', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '14px' }}>
            ✦ AI-Curated · Updated Daily ✦
          </span>
          <h1 className="animate-fade-up" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 600, color: 'var(--ivory)', lineHeight: 1.02, letterSpacing: '-0.02em', margin: '0 0 18px', animationDelay: '0.08s' }}>
            Every rare find, <span className="text-gradient-ember" style={{ fontStyle: 'italic' }}>decoded.</span>
          </h1>
          <p className="animate-fade-up" style={{ fontFamily: 'var(--font-inter)', fontSize: '16px', color: 'var(--mist)', lineHeight: 1.65, maxWidth: '620px', margin: '0 auto', animationDelay: '0.15s' }}>
            Trading cards, anime figures &amp; luxury collectibles — tracked 24/7, ranked by hype, and summarized by AI the moment they break.
          </p>
          <div className="animate-fade-up flex items-center justify-center gap-3 mt-7 flex-wrap" style={{ animationDelay: '0.22s' }}>
            <Link href="/news" style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--on-accent)', background: 'var(--grad-ember)', padding: '13px 28px', borderRadius: 'var(--radius-pill)', textDecoration: 'none', boxShadow: '0 0 30px -8px var(--glow-ember)' }}>
              Enter the Newsroom →
            </Link>
          </div>
        </div>

        {/* ── Content grid ───────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 flex flex-col gap-6">

              {/* Featured */}
              {featured && (
                <Link href={`/article/${featured.slug}`} className="story-card group" style={{ ['--card-accent' as string]: CAT_COLOR[featured.category.toLowerCase()] || 'var(--gold)', display: 'block', position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', textDecoration: 'none', minHeight: '320px' }}>
                  {featured.image_url
                    ? <Image src={featured.image_url} alt={featured.title} fill sizes="(max-width:1024px) 100vw, 66vw" className="collector-image object-cover" unoptimized={featured.image_url.startsWith('http')} />
                    : <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--chamber), var(--vault))' }} />}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,13,0.96) 0%, rgba(7,7,13,0.4) 45%, transparent 70%)' }} />
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 'var(--space-xl)' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: CAT_BG[featured.category.toLowerCase()] || 'var(--glow-gold)', color: CAT_COLOR[featured.category.toLowerCase()] || 'var(--gold)', border: `1px solid ${CAT_COLOR[featured.category.toLowerCase()] || 'var(--gold)'}` }}>{featured.category}</span>
                    <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 600, color: 'var(--ivory)', lineHeight: 1.12, margin: '14px 0 8px', maxWidth: '32ch' }}>{featured.title}</h2>
                    {featured.summary_short && <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'var(--mist)', lineHeight: 1.6, maxWidth: '60ch', marginBottom: '12px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{featured.summary_short}</p>}
                    <div className="flex items-center justify-between" style={{ maxWidth: '60ch' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--mist-dim)' }} suppressHydrationWarning>{featured.source_name} · {timeAgo(featured.published_at)}</span>
                      <span className="read-more" style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)' }}>Read More →</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* 2×2 grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {grid.map((item) => {
                  const c = CAT_COLOR[item.category.toLowerCase()] || 'var(--gold)';
                  return (
                    <Link key={item.id} href={`/article/${item.slug}`} className="story-card group" style={{ ['--card-accent' as string]: c, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', background: 'rgba(16,16,25,0.72)', backdropFilter: 'blur(8px)', textDecoration: 'none' }}>
                      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--chamber)' }}>
                        {item.image_url
                          ? <Image src={item.image_url} alt={item.title} fill sizes="(max-width:640px) 100vw, 33vw" className="collector-image object-cover" unoptimized={item.image_url.startsWith('http')} />
                          : <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--chamber), var(--vault))' }} />}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: c }} />
                        <span style={{ position: 'absolute', top: '10px', left: '10px', fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 'var(--radius-sm)', background: 'rgba(7,7,13,0.7)', color: c, border: `1px solid ${c}`, backdropFilter: 'blur(6px)' }}>{item.category}</span>
                      </div>
                      <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '20px', fontWeight: 600, color: 'var(--ivory)', lineHeight: 1.22, margin: '0 0 6px' }}>{item.title}</h3>
                        {item.summary_short && <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--mist)', lineHeight: 1.55, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{item.summary_short}</p>}
                        <div className="flex items-center justify-between" style={{ marginTop: 'auto', paddingTop: '12px' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: 'var(--mist-dim)' }}>{item.source_name}</span>
                          <span className="read-more" style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: c }}>Read More →</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── Trending sidebar ─────────────────────────────────── */}
            <aside className="lg:w-1/3">
              <div className="grad-border" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'rgba(16,16,25,0.72)', backdropFilter: 'blur(10px)' }}>
                <div className="flex items-center gap-2" style={{ padding: 'var(--space-lg) var(--space-xl)', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--gold)' }}>✦</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ivory)' }}>Trending</span>
                </div>
                {trending.map((item, i) => {
                  const c = CAT_COLOR[item.category.toLowerCase()] || 'var(--gold)';
                  return (
                    <Link key={item.id} href={`/article/${item.slug}`} style={{ display: 'grid', gridTemplateColumns: '34px 1fr', gap: 'var(--space-md)', padding: 'var(--space-lg) var(--space-xl)', borderBottom: '1px solid var(--border-color)', textDecoration: 'none' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: c, lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: c, display: 'block', marginBottom: '5px' }}>{item.category}</span>
                        <h4 style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 500, color: 'var(--ivory)', lineHeight: 1.45, margin: '0 0 8px' }}>{item.title}</h4>
                        <span className="read-more" style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gold)' }}>Read More →</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </aside>
          </div>

          {/* ── Promo banner ─────────────────────────────────────── */}
          <div className="mt-10 flex items-start gap-4 p-6" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid rgba(242,118,46,0.32)', background: 'linear-gradient(120deg, rgba(242,118,46,0.12), rgba(226,59,46,0.05))', backdropFilter: 'blur(8px)' }}>
            <span className="text-gradient-ember" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>⚡</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-bright)', marginBottom: '6px' }}>Real-time alerts, zero noise</div>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'var(--mist)', lineHeight: 1.6, margin: 0 }}>
                Every drop, restock, and market move across cards, figures, and collectibles — tracked 24/7 and summarized by AI the moment it breaks. You bring the passion; we make sure you never miss a beat.
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(16,16,25,0.85)', backdropFilter: 'blur(10px)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: '34px', height: '34px', background: 'var(--grad-ember)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--on-accent)' }}>CP</div>
                <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '19px', fontWeight: 600, color: 'var(--ivory)' }}>The Collector&apos;s Hub</span>
              </div>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--mist)', lineHeight: 1.65, maxWidth: '300px' }}>
                Every item has a story to discover. From rare finds to market intel — your ultimate destination for all things rare and valuable.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--mist-dim)', marginBottom: '16px' }}>Categories</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
                {[{ l: 'Trading Cards', h: '/news?category=tcg' }, { l: 'Action Figures', h: '/news?category=figures' }, { l: 'Luxury Collectibles', h: '/news?category=watches' }].map(x => (
                  <li key={x.l} className="flex items-center gap-2"><span style={{ color: 'var(--gold)' }}>›</span><Link href={x.h} style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--mist)', textDecoration: 'none' }}>{x.l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--mist-dim)', marginBottom: '16px' }}>Powered by</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
                {['Claude AI', 'Next.js', 'Supabase'].map(x => (<li key={x} style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--mist)' }}>{x}</li>))}
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: 'var(--mist-dim)' }}>© {new Date().getFullYear()} The Collector&apos;s Hub</span>
            <Link href="/news" style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mist-dim)', textDecoration: 'none' }}>Enter the Newsroom →</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
