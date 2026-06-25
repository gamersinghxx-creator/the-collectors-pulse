'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { CATEGORIES } from '../lib/constants';

const NAV_LABELS: Record<string, string> = { ALL: 'All News', TCG: 'Cards', FIGURES: 'Figures', WATCHES: 'Watches' };
const NAV_ACCENT: Record<string, string> = { ALL: 'var(--gold)', TCG: 'var(--accent-tcg)', FIGURES: 'var(--accent-figures)', WATCHES: 'var(--accent-watches)' };

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const currentCategory = searchParams.get('category')?.toUpperCase() || 'ALL';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // The Hub front door (/) and its alias ship their own header/footer.
  if (pathname === '/' || pathname?.startsWith('/hub')) return null;

  // Transparent over the dark cinematic hero only in dark mode; otherwise a readable backdrop.
  const transparentTop = !scrolled && resolvedTheme === 'dark';
  const navStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    background: transparentTop ? 'transparent' : 'var(--header-bg)',
    backdropFilter: transparentTop ? 'none' : 'blur(22px) saturate(1.6)',
    borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
    transition: 'all 0.35s ease',
  };

  return (
    <header style={navStyle}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'var(--grad-ember)', color: 'var(--on-accent)', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, boxShadow: '0 0 22px -4px var(--glow-ember)' }}>CP</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '19px', fontWeight: 600, color: 'var(--ivory)', letterSpacing: '-0.01em' }}>The Collector&apos;s Pulse</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 500, letterSpacing: '0.18em', color: 'var(--mist)', textTransform: 'uppercase', marginTop: '3px' }}>Curated by Claude AI</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat;
            const accent = NAV_ACCENT[cat] || 'var(--gold)';
            return (
              <Link
                key={cat}
                href={cat === 'ALL' ? '/news' : `/news?category=${cat.toLowerCase()}`}
                className="nav-link"
                style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: isActive ? 'var(--ivory)' : 'var(--mist)', textDecoration: 'none', position: 'relative', paddingBottom: '5px', borderBottom: isActive ? `2px solid ${accent}` : '2px solid transparent', transition: 'color 0.2s ease' }}
              >
                {NAV_LABELS[cat] || cat}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2" style={{ color: 'var(--ivory)', background: 'transparent', border: 'none', cursor: 'pointer' }} aria-label="Toggle menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ background: 'var(--header-bg)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border-color)' }}>
          <nav className="flex flex-col p-4 gap-1">
            {CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat;
              const accent = NAV_ACCENT[cat] || 'var(--gold)';
              return (
                <Link key={cat} href={cat === 'ALL' ? '/news' : `/news?category=${cat.toLowerCase()}`} onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: isActive ? accent : 'var(--mist)', background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent', padding: '13px 16px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', display: 'block', borderLeft: isActive ? `2px solid ${accent}` : '2px solid transparent' }}>
                  {NAV_LABELS[cat] || cat}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
