'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // The Hub front door (/) and its alias ship their own footer.
  if (pathname === '/' || pathname?.startsWith('/hub')) return null;

  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', background: 'var(--vault)', marginTop: 'var(--space-3xl)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 50% 80% at 85% 0%, var(--glow-ember), transparent 65%)' }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: '36px', height: '36px', background: 'var(--grad-ember)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--on-accent)' }}>
                  CP
                </div>
                <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '20px', fontWeight: 600, color: 'var(--ivory)' }}>
                  The Collector&apos;s Pulse
                </span>
              </div>
            </Link>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'var(--mist)', lineHeight: 1.65, maxWidth: '300px' }}>
              Daily news for card collectors, figure hunters, and watch enthusiasts — curated and summarized by AI the moment it breaks.
            </p>
          </div>

          {/* Categories */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--mist-dim)', marginBottom: 'var(--space-lg)' }}>
              Categories
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {[
                { label: 'Trading Cards', href: '/news?category=tcg', accent: 'var(--accent-tcg)' },
                { label: 'Anime Figures', href: '/news?category=figures', accent: 'var(--accent-figures)' },
                { label: 'Luxury Watches', href: '/news?category=watches', accent: 'var(--accent-watches)' },
              ].map(({ label, href, accent }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, flexShrink: 0 }} />
                  <Link href={href} style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'var(--mist)', textDecoration: 'none' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--mist-dim)', marginBottom: 'var(--space-lg)' }}>
              Powered by
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {['Claude AI', 'Next.js', 'Supabase'].map((item) => (
                <li key={item} style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'var(--mist)' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: 'var(--mist-dim)', letterSpacing: '0.04em' }}>
            {`© ${currentYear} The Collector's Pulse`}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: 'var(--mist-dim)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            ✦ Curated by Claude AI ✦
          </span>
        </div>
      </div>
    </footer>
  );
}
