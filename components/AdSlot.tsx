'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slotId: string;
  className?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
}

export default function AdSlot({ slotId, className = '', adFormat = 'auto' }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!isLoaded.current && typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className={`overflow-hidden relative ${className}`}>
      {isDev && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300 dark:text-gray-700 text-xs font-mono opacity-50">
          AD · {adFormat}
        </span>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-1234'}
        data-ad-slot={slotId}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}
