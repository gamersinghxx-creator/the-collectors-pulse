import { Globe, Hash, MessageCircle, MessageSquare, Rss } from 'lucide-react';

// ─── Category Accent Styles ─────────────────────────────────────────────────
export const CATEGORY_STYLES = {
  tcg: {
    hex: '#3b82f6',
    label: 'TCG',
    className: 'border-l-[var(--color-accent-tcg)] text-[var(--color-accent-tcg)]',
    gradient: 'from-blue-900/80 via-blue-800/40 to-transparent',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-[var(--color-accent-tcg)]',
  },
  figures: {
    hex: '#ef4444',
    label: 'Figures',
    className: 'border-l-[var(--color-accent-figures)] text-[var(--color-accent-figures)]',
    gradient: 'from-red-900/80 via-red-800/40 to-transparent',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-[var(--color-accent-figures)]',
  },
  watches: {
    hex: '#f59e0b',
    label: 'Watches',
    className: 'border-l-[var(--color-accent-watches)] text-[var(--color-accent-watches)]',
    gradient: 'from-amber-900/80 via-amber-800/40 to-transparent',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-[var(--color-accent-watches)]',
  },
  general: {
    hex: '#9ca3af',
    label: 'General',
    className: 'border-l-gray-400 text-gray-400',
    gradient: 'from-gray-900/80 via-gray-800/40 to-transparent',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
  },
} as const;

export type CategoryKey = keyof typeof CATEGORY_STYLES;

export function getCategoryStyle(category: string) {
  return CATEGORY_STYLES[category.toLowerCase() as CategoryKey] || CATEGORY_STYLES.general;
}

// ─── Category Fallback Images ───────────────────────────────────────────────
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  tcg: '/fallback_tcg.png',
  figures: '/fallback_figures.png',
  watches: '/fallback_watches.png',
  general: '/fallback_general.png',
};

export function getFallbackImage(category: string): string {
  return CATEGORY_FALLBACK_IMAGES[category.toLowerCase()] || '/fallback_general.png';
}

// ─── Source Type Icons ──────────────────────────────────────────────────────
export const SOURCE_ICONS = {
  twitter: Hash,
  reddit: MessageSquare,
  rss: Rss,
  scrape: Globe,
  facebook: MessageCircle,
} as const;

export function getSourceIcon(sourceType: string) {
  return SOURCE_ICONS[sourceType as keyof typeof SOURCE_ICONS] || Globe;
}

// ─── Category Filter Tabs ───────────────────────────────────────────────────
export const CATEGORIES = ['ALL', 'TCG', 'FIGURES', 'WATCHES'] as const;

// ─── Blur placeholder for images ────────────────────────────────────────────
export const BLUR_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
