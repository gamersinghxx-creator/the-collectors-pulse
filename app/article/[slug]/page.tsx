import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

import { unstable_cache } from 'next/cache';
import { supabase } from '../../../lib/supabase/client';
import { getCachedLiveFeed } from '../../../lib/liveFetcher';
import { fetchArticleContent } from '../../../lib/articleContent';
import { generateArticleBody } from '../../../lib/generateArticle';
import LivingBackground from '../../../components/LivingBackground';
import { mockItems } from '../../../lib/mockData';
import { BLUR_DATA_URL } from '../../../lib/constants';
import { ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { NewsItem } from '../../../types';

// Build + cache the detailed article body per slug (computed once, reused ~1 day).
const getArticleBody = unstable_cache(
  async (slug: string, sourceUrl: string, title: string, category: string, sourceName: string, summary: string): Promise<string> => {
    let body = summary || '';
    try {
      const sourced = await fetchArticleContent(sourceUrl);
      if (sourced && sourced.length > body.length) body = sourced;
    } catch { /* keep fallback */ }
    if (body.replace(/\s+/g, ' ').trim().length < 420) {
      try {
        const ai = await generateArticleBody(title, category, body, sourceName);
        if (ai && ai.length > body.length) body = ai;
      } catch { /* keep fallback */ }
    }
    return body;
  },
  ['article-body-v1'],
  { revalidate: 86400 }
);

const CATEGORY_COLOR: Record<string, string> = {
  tcg: 'var(--accent-tcg)',
  figures: 'var(--accent-figures)',
  watches: 'var(--accent-watches)',
  general: 'var(--gold)',
};
const CATEGORY_BG: Record<string, string> = {
  tcg: 'var(--accent-tcg-soft)',
  figures: 'var(--accent-figures-soft)',
  watches: 'var(--accent-watches-soft)',
  general: 'var(--glow-gold)',
};
const CATEGORY_BORDER: Record<string, string> = {
  tcg: 'rgba(46,139,255,0.4)',
  figures: 'rgba(194,75,245,0.4)',
  watches: 'rgba(232,201,106,0.35)',
  general: 'rgba(216,182,90,0.45)',
};
const CATEGORY_GLOW: Record<string, string> = {
  tcg: 'rgba(46,139,255,0.18)',
  figures: 'rgba(194,75,245,0.18)',
  watches: 'rgba(232,201,106,0.16)',
  general: 'var(--glow-ember)',
};

async function getAllItems(): Promise<NewsItem[]> {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'placeholder') {
      const { data, error } = await supabase
        .from('news_items').select('*').eq('processing_status', 'published')
        .order('published_at', { ascending: false }).limit(50);
      if (!error && data && data.length > 0) return data as NewsItem[];
    }
  } catch { /* fallback */ }
  try {
    const live = await getCachedLiveFeed();
    if (live.length > 0) return live;
  } catch { /* fallback */ }
  return mockItems;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const items = await getAllItems();
  const item = items.find(i => i.slug === slug);
  if (!item) return { title: "Article | The Collector's Pulse" };
  const desc = (item.summary_short || item.summary_full || '').slice(0, 160);
  return {
    title: `${item.title} | The Collector's Pulse`,
    description: desc,
    openGraph: {
      title: item.title,
      description: desc,
      type: 'article',
      images: item.image_url ? [item.image_url] : undefined,
    },
    twitter: { card: 'summary_large_image', title: item.title, description: desc },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const allItems = await getAllItems();
  let item: NewsItem | null = allItems.find(i => i.slug === slug) || null;

  if (!item) {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'placeholder') {
        const { data, error } = await supabase.from('news_items').select('*').eq('slug', slug).single();
        if (!error && data) item = data as NewsItem;
      }
    } catch { /* fallback */ }
  }
  if (!item) item = mockItems.find(i => i.slug === slug) || null;
  if (!item) notFound();

  const catKey = item.category.toLowerCase() as keyof typeof CATEGORY_COLOR;
  const catColor = CATEGORY_COLOR[catKey] || 'var(--gold)';
  const catBg = CATEGORY_BG[catKey] || 'var(--glow-gold)';
  const catBorder = CATEGORY_BORDER[catKey] || 'rgba(216,182,90,0.45)';
  const catGlow = CATEGORY_GLOW[catKey] || 'var(--glow-ember)';

  // Pokémon-themed articles get a living, art-filled background.
  const pokeHaystack = [item.title, item.slug, item.sub_category, ...(item.tags || [])].join(' ').toLowerCase();
  const isPokemon = /pok[eé]mon|pikachu|charizard|charmander|squirtle|bulbasaur|eevee|mewtwo|scarlet|violet|rayquaza/.test(pokeHaystack);
  const isWatch = catKey === 'watches';
  const isFigure = catKey === 'figures' && !isPokemon;

  // Detailed, on-site readable body (cached per slug): real source excerpt →
  // original AI-written article → existing summary.
  const bodyText = await getArticleBody(
    item.slug, item.source_url, item.title, item.category, item.source_name,
    item.summary_full || item.summary_short || ''
  );

  const paragraphs = bodyText
    .split('\n')
    .filter((p: string) => p.trim());

  const wordCount = (item.summary_full || item.summary_short || '').split(/\s+/).filter(Boolean).length;
  const readMins = Math.max(1, Math.round(wordCount / 200));

  const related = allItems
    .filter(i => i.slug !== item!.slug && i.category.toLowerCase() === catKey)
    .slice(0, 3);
  const relatedFinal = related.length > 0 ? related : allItems.filter(i => i.slug !== item!.slug).slice(0, 3);

  return (
    <main className={(isPokemon || isWatch) ? 'dark' : isFigure ? 'light' : undefined} style={{ minHeight: '100vh', background: 'var(--obsidian)', paddingBottom: 'var(--space-3xl)', position: 'relative' }}>
      {isWatch ? (
        <LivingBackground images={['/watch-bg-article.jpg']} accent="rgba(232,201,106,0.22)" behind={false} />
      ) : isFigure ? (
        <LivingBackground images={['/figure-bg-article.jpg']} accent="rgba(194,75,245,0.20)" tone="light" behind={false} />
      ) : isPokemon ? (
        /* Living Pokémon art background */
        <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%', backgroundImage: 'url(/pokemon-bg-left.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', animation: 'kenburns-left 22s ease-in-out infinite, poke-breathe 9s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%', backgroundImage: 'url(/pokemon-bg-right.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', animation: 'kenburns-right 26s ease-in-out infinite, poke-breathe 9s ease-in-out infinite 1.5s' }} />
          {/* animated energy glow — electric / water / fire pulses */}
          <div className="poke-pulse" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 48% 38% at 24% 32%, rgba(255,203,5,0.22), transparent 60%), radial-gradient(ellipse 44% 40% at 80% 55%, rgba(46,139,255,0.20), transparent 60%), radial-gradient(ellipse 40% 34% at 56% 86%, rgba(226,59,46,0.18), transparent 60%)' }} />
          {/* art breathes at the top hero; body zone stays readable */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(7,7,13,0.06) 0%, rgba(7,7,13,0.34) 36%, rgba(7,7,13,0.40) 50%, rgba(7,7,13,0.34) 64%, rgba(7,7,13,0.06) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,7,13,0.12) 0%, rgba(7,7,13,0.16) 40%, rgba(7,7,13,0.60) 60%, rgba(7,7,13,0.82) 82%, var(--obsidian) 100%)' }} />
        </div>
      ) : (
        /* category-tinted glow behind header */
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '70vh', pointerEvents: 'none', background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${catGlow}, transparent 70%)` }} />
      )}

      {/* Sticky back nav */}
      <div style={{ position: 'sticky', top: '64px', zIndex: 40, background: 'var(--header-bg)', backdropFilter: 'blur(22px)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="max-w-4xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href="/news" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', color: 'var(--mist)', textDecoration: 'none' }}>
            <ArrowLeft className="w-4 h-4" />
            Back to the Newsroom
          </Link>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: catColor, padding: '4px 11px', background: catBg, border: `1px solid ${catBorder}`, borderRadius: 'var(--radius-sm)' }}>
            {item.category}
          </span>
        </div>
      </div>

      {/* Article header */}
      <article className="relative" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto" style={{ padding: 'var(--space-3xl) var(--space-xl) var(--space-2xl)' }}>
          <div className="flex flex-wrap items-center gap-3 mb-7">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: catColor }}>
              {item.category}
            </span>
            {item.is_drop_alert && (
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--grad-ember)', color: 'var(--on-accent)' }}>
                Drop Alert
              </span>
            )}
            {item.is_restock && (
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: 'rgba(22,214,160,0.14)', color: 'var(--accent-restock)', border: '1px solid rgba(22,214,160,0.32)' }}>
                Restock
              </span>
            )}
            {item.hype_score >= 8 && (
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 'var(--radius-sm)', background: 'rgba(226,59,46,0.12)', color: 'var(--crimson)', border: '1px solid rgba(226,59,46,0.4)' }}>
                🔥 Hype {item.hype_score}/10
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 600, color: 'var(--ivory)', lineHeight: 1.06, letterSpacing: '-0.02em', marginBottom: 'var(--space-lg)', textShadow: (isPokemon || isWatch) ? '0 2px 32px rgba(0,0,0,0.92), 0 2px 8px rgba(0,0,0,0.85)' : isFigure ? '0 1px 3px rgba(255,255,255,0.9), 0 2px 22px rgba(255,255,255,0.55)' : undefined }}>
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4" style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 500, color: 'var(--mist)', letterSpacing: '0.04em', paddingBottom: 'var(--space-lg)', borderBottom: '1px solid var(--border-color)' }} suppressHydrationWarning>
            <span style={{ color: 'var(--ivory)' }}>{item.source_name}</span>
            {item.published_at && (
              <span suppressHydrationWarning>{format(new Date(item.published_at), 'MMMM d, yyyy')}</span>
            )}
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{readMins} min read</span>
          </div>
        </div>

        {/* Hero image */}
        {item.image_url && (
          <div className="max-w-5xl mx-auto" style={{ padding: '0 var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
            <div className="relative overflow-hidden" style={{ borderRadius: 'var(--radius-xl)', border: `1px solid ${catBorder}`, aspectRatio: '21/9', boxShadow: `0 30px 80px -30px ${catGlow}` }}>
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
                style={{ filter: 'brightness(0.9) saturate(0.95)' }}
                placeholder="blur"
                blurDataURL={item.thumbnail_url || BLUR_DATA_URL}
                unoptimized
                priority
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,13,0.4), transparent 50%)' }} />
            </div>
          </div>
        )}

        {/* Article body */}
        <div className="mx-auto" style={{ maxWidth: '68ch', padding: '0 var(--space-xl)' }}>
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph: string, idx: number) => {
              if (idx === 0) {
                return (
                  <p key={idx} className="drop-cap" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '25px', fontWeight: 400, color: 'var(--ivory)', lineHeight: 1.5, margin: '0 0 var(--space-xl)' }}>
                    {paragraph}
                  </p>
                );
              }
              return (
                <p key={idx} style={{ fontFamily: 'var(--font-inter)', fontSize: '18px', color: 'var(--ivory)', lineHeight: 1.8, margin: '0 0 var(--space-lg)' }}>
                  {paragraph}
                </p>
              );
            })
          ) : (
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '18px', color: 'var(--ivory)', lineHeight: 1.8 }}>
              Visit the original source for the full story.
            </p>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
              {item.tags.map((tag: string) => (
                <span key={tag} style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 13px', border: '1px solid var(--border-bright)', borderRadius: 'var(--radius-pill)', color: 'var(--mist)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Source CTA */}
          {item.source_url && (
            <div className="mt-10">
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--on-accent)', textDecoration: 'none', padding: '14px 28px', background: 'var(--grad-ember)', borderRadius: 'var(--radius-pill)', boxShadow: '0 0 30px -8px var(--glow-ember)' }}
              >
                View on {item.source_name} →
              </a>
            </div>
          )}

          {/* AI byline */}
          <div className="mt-12 p-5 flex items-start gap-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <span className="text-gradient-ember" style={{ fontFamily: 'var(--font-display)', fontSize: '16px', lineHeight: 1, marginTop: '1px' }}>✦</span>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'var(--mist)', lineHeight: 1.6, margin: 0 }}>
              Summarized by Claude AI from {item.source_name}. The Collector&apos;s Pulse tracks drops, restocks, and market movements across trading cards, figures, and luxury watches.
            </p>
          </div>
        </div>
      </article>

      {/* Related stories */}
      {relatedFinal.length > 0 && (
        <section className="max-w-5xl mx-auto" style={{ position: 'relative', zIndex: 1, padding: 'var(--space-3xl) var(--space-xl) 0' }}>
          <div className="flex items-center gap-4 mb-8">
            <span style={{ width: '5px', height: '26px', borderRadius: '3px', background: catColor, display: 'inline-block' }} />
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '30px', fontWeight: 600, color: 'var(--ivory)' }}>More to explore</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedFinal.map((rel) => {
              const rk = rel.category.toLowerCase() as keyof typeof CATEGORY_COLOR;
              const rc = CATEGORY_COLOR[rk] || 'var(--gold)';
              return (
                <Link key={rel.id} href={`/article/${rel.slug}`} className="story-card" style={{ ['--card-accent' as string]: rc, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--vault)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', textDecoration: 'none' }}>
                  <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: 'var(--chamber)' }}>
                    {rel.image_url && (
                      <Image src={rel.image_url} alt={rel.title} fill sizes="33vw" className="collector-image object-cover" unoptimized={rel.image_url.startsWith('http')} />
                    )}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: rc }} />
                  </div>
                  <div style={{ padding: 'var(--space-md)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: rc, marginBottom: '7px' }}>{rel.category}</div>
                    <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '19px', fontWeight: 600, color: 'var(--ivory)', lineHeight: 1.25, margin: 0 }}>{rel.title}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
