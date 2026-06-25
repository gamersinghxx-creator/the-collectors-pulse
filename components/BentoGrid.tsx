import NewsCard from './NewsCard';
import { NewsItem } from '../types';

interface BentoGridProps { items: NewsItem[]; }

export default function BentoGrid({ items }: BentoGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center grad-border" style={{ borderRadius: 'var(--radius-lg)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600, color: 'var(--mist)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>No stories yet</div>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '22px', fontStyle: 'italic', color: 'var(--mist)' }}>Try a different category or check back later.</p>
      </div>
    );
  }

  const [featured, ...rest] = items;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {featured && <NewsCard item={featured} index={0} featured={true} />}
      {rest.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 'var(--space-lg)' }}>
          {rest.map((item, i) => <NewsCard key={item.id} item={item} index={i + 1} />)}
        </div>
      )}
    </div>
  );
}
