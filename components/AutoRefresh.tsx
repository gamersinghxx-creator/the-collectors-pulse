'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Silently re-fetches the server-rendered feed on an interval (and when the tab
 * regains focus) so new stories appear without a manual reload. Shows a small,
 * unobtrusive "live" pill in the corner.
 */
export default function AutoRefresh({ intervalMs = 60000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const tick = () => {
      router.refresh();
      setPulse(true);
      setTimeout(() => setPulse(false), 1200);
    };
    const id = setInterval(tick, intervalMs);
    const onFocus = () => router.refresh();
    window.addEventListener('focus', onFocus);
    return () => { clearInterval(id); window.removeEventListener('focus', onFocus); };
  }, [router, intervalMs]);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', bottom: '18px', right: '18px', zIndex: 60,
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        padding: '6px 12px', borderRadius: 'var(--radius-pill)',
        background: 'var(--header-bg)', backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-bright)',
        fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mist)',
        transition: 'color 0.3s ease',
      }}
    >
      <span
        style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: pulse ? 'var(--accent-restock)' : 'var(--ember)',
          boxShadow: pulse ? '0 0 10px var(--accent-restock)' : 'none',
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
        }}
      />
      {pulse ? 'Updated' : 'Live'}
    </div>
  );
}
