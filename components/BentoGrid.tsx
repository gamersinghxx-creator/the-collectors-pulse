import NewsCard from './NewsCard';
import { NewsItem } from '../types';

interface BentoGridProps {
  items: NewsItem[];
}

export default function BentoGrid({ items }: BentoGridProps) {
  const getSpanClasses = (index: number) => {
    // 1st Card: Large Hero
    if (index === 0) return 'md:col-span-2 md:row-span-2';
    // 4th Card: Wide format
    if (index === 3) return 'md:col-span-2';
    // 7th Card: Tall format
    if (index === 6) return 'md:row-span-2';
    // Default
    return 'col-span-1 row-span-1';
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[var(--color-vault-card)] backdrop-blur-md border border-[var(--color-vault-border)] rounded-2xl">
        <p className="font-outfit text-gray-500 dark:text-gray-400 text-lg">No signals detected in the vault yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(380px,auto)]">
      {items.map((item, index) => (
        <NewsCard 
          key={item.id} 
          item={item} 
          index={index}
          className={getSpanClasses(index)}
        />
      ))}
    </div>
  );
}
