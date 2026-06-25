'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);

  const isDark = resolvedTheme === 'dark';

  const base: React.CSSProperties = {
    width: '38px', height: '38px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-bright)',
    background: 'rgba(127,127,127,0.06)', color: 'var(--mist)', cursor: 'pointer',
    transition: 'color 0.2s ease, border-color 0.2s ease, background 0.2s ease',
  };

  if (!mounted) {
    return <button aria-label="Toggle theme" style={{ ...base, cursor: 'default', opacity: 0.5 }}><span style={{ width: 16, height: 16 }} /></button>;
  }

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={base}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--mist)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-bright)'; }}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export default ThemeToggle;
