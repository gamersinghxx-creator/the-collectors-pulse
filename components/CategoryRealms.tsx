'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const FILTERS = [
  { key: 'ALL', label: 'All News', href: '/news', accent: 'var(--gold)' },
  { key: 'TCG', label: 'Trading Cards', href: '/news?category=tcg', accent: 'var(--accent-tcg)' },
  { key: 'FIGURES', label: 'Figures', href: '/news?category=figures', accent: 'var(--accent-figures)' },
  { key: 'WATCHES', label: 'Watches', href: '/news?category=watches', accent: 'var(--accent-watches)' },
];

export default function CategoryRealms() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category')?.toUpperCase() || 'ALL';

  return (
    <div id="realms-section" style={{ position: 'sticky', top: '64px', zIndex: 40, background: 'rgba(7,7,13,0.88)', backdropFilter: 'blur(22px) saturate(1.4)', borderBottom: '1px solid var(--border-color)', width: '100%' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3.5 flex items-center gap-3 flex-wrap">
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--mist-dim)', marginRight: '4px' }}>Explore</span>
        {FILTERS.map(({ key, label, href, accent }) => {
          const isActive = currentCategory === key;
          return (
            <Link
              key={key}
              href={href}
              style={{
                fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '7px 17px', borderRadius: 'var(--radius-pill)',
                border: `1px solid ${isActive ? accent : 'var(--border-bright)'}`,
                color: isActive ? 'var(--obsidian)' : 'var(--mist)',
                background: isActive ? accent : 'transparent',
                textDecoration: 'none', transition: 'all 0.22s ease',
                boxShadow: isActive ? `0 0 20px -5px ${accent}` : 'none',
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
