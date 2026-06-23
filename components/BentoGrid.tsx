import NewsCard from './NewsCard';
import { NewsItem } from '../types';

interface BentoGridProps {
  items: NewsItem[];
}

export default function BentoGrid({ items }: BentoGridProps) {
  const getSpanClasses = (index: number) => {
    // 1st Card: Large Hero — spans 2 columns on desktop
    if (index === 0) return 'md:col-span-2 md:row-span-2';
    // 4th Card: Wide format
    if (index === 3) return 'md:col-span-2';
    // Default
    return 'col-span-1 row-span-1';
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-[var(--color-vault-card)] backdrop-blur-md border border-[var(--color-vault-border)] rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <span className="text-3xl">📡</span>
        </div>
        <p className="font-outfit text-gray-500 dark:text-gray-400 text-lg text-center">No signals detected in the vault yet.</p>
        <p className="font-inter text-gray-400 dark:text-gray-500 text-sm mt-2 text-center">Try selecting a different category or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[minmax(360px,auto)]">
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
