# PROJECT REPORT — The Collector's Pulse

> Technical architecture & status report. Last updated: 2026-06-29

## 1. Overview
A daily, AI-curated news site for collectors of **trading cards (TCG), anime figures, and luxury watches**. Premium "Luxe-but-Vivid" visual design with per-category living backgrounds, light/dark theming, live news ingestion, and AI-written article bodies.

## 2. Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4 + a custom CSS design-token system (`app/globals.css`)
- **Data:** Supabase (Postgres) — table `news_items`
- **AI:** Google Gemini (`@google/generative-ai`) for classification + article bodies
- **Live source:** Google News RSS (TCG / Figures / Watches)
- **Motion/UX:** framer-motion, lucide-react, next-themes

## 3. Routes & flow
| Route | Purpose |
|---|---|
| `/` | Art-driven **Hub** front door (Pokémon + One Piece backdrop, hero, CTA, featured, trending) |
| `/news` | **Newsroom** feed (cyberpunk hero + live console, category filter, top story, grid, sidebar) |
| `/article/[slug]` | Article/blog page (detailed body, related, source link) |
| `/hub` | Redirects to `/` |
| `/api/cron` | Ingestion endpoint (Vercel Cron + local worker) |

Flow: **Hub → Newsroom (browse/filter) → Article**.

## 4. Data pipeline
- **Read path:** pages query Supabase (`processing_status='published'`) first; if empty, fall back to cached live RSS (`getCachedLiveFeed`), then mock data.
- **Ingestion (`lib/ingest.ts` → `runIngestion`)**: fetches the live RSS feed (images resolved), upserts rows into Supabase as published. Triggered by `/api/cron` (Vercel Cron in prod; local worker pings it in dev).
- **Worker (`scripts/worker.ts`)**: Reddit scraper (15 min) + Gemini AI processor (2 min) + RSS-ingestion ping (10 min). Run with `npm run start:worker`.
- **Caching:** `getCachedLiveFeed` (90s) and per-slug article body (24h) via `unstable_cache`.

## 5. Image pipeline (`lib/imageFetcher.ts`, `resolveArticleImage.ts`)
Resolution order: cached → RSS feed image (`media:content`/`enclosure`) → `og:image`/`twitter:image`/largest content image → **category fallback photo**. Rejects Google-News interstitial logos. **Vercel-aware**: on serverless (`process.env.VERCEL`) it serves remote image URLs instead of writing to the read-only disk. Local cache version is `v3` (in `public/images/articles/`, git-ignored).

## 6. Design system (`DESIGN_SYSTEM.md`, `app/globals.css`)
Dark obsidian base + ember/gold + vivid category accents (TCG blue, Figures violet, Watches gold). Fonts: Cormorant (serif), Space Grotesk (display), Inter (body). Light & dark themes via `.light`/`.dark` token scopes. Motion: ken-burns, breathing glow, scanlines, shimmer skeletons.

## 7. Key components
Hero, Header, Footer, HubLanding, LivingBackground, AutoRefresh, FeaturedSpotlight, BentoGrid, NewsCard, TrendingSidebar, CategoryRealms, ThemeToggle/Provider, HypeMeter, AdSlot.

## 8. Status
- ✅ UI redesign, theming, backgrounds, navigation, SEO metadata, loading states.
- ✅ Live RSS across all categories; auto-refresh; detailed article bodies.
- ✅ Image pipeline fixed (no logos/placeholders; Vercel-ready).
- ✅ Ingestion + cron wired; Supabase configured.
- ⏳ Needs `npm run build` verification; worker run to populate DB; Vercel env + deploy.

## 9. Known limitations
1. Real-image coverage depends on Google's intermittent link decoder (improves over time / via worker).
2. Vercel Hobby cron runs once/day — use Pro or external scheduler for frequent updates.
3. Worker is a separate process (or Vercel Cron); not running = site uses live RSS.
4. Verified via dev server, not a production build, in the build environment.
