# 📖 PROJECT BIBLE — The Collector's Pulse

> The single source of truth for this project — written to be usable by **both AI assistants and humans**.
> Last updated: 2026-06-29

---

## 1. What this product is
**The Collector's Pulse** is a premium, AI-curated daily-news website for hobby collectors. It tracks three worlds:
- **Trading Cards (TCG)** — Pokémon, One Piece, Magic, Lorcana, etc.
- **Anime Figures** — Nendoroid, S.H.Figuarts, Funko, scale figures.
- **Luxury Watches** — Rolex, Omega, Patek Philippe, Grand Seiko, etc.

It pulls live news, attaches real images, writes detailed article bodies with AI, and presents everything in a premium, animated, themeable interface.

## 2. The experience / user flow
1. **`/` — The Hub** (front door): full-bleed Pokémon + One Piece artwork, "Every rare find, decoded." hero, **Enter the Newsroom** CTA, a featured story, and a trending list.
2. **`/news` — The Newsroom**: a cyberpunk "DECODED BY AI" hero with a live PULSE console; category filter (All / Cards / Figures / Watches) in the top header; a top story, an article grid, and a trending sidebar. Each category shows its own **living background**.
3. **`/article/[slug]` — The Article**: detailed body, tags, related stories, and a link to the original source. Pokémon/Watch articles render on cinematic dark art; Figure articles on a brighter art background.

## 3. Tech stack
- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind v4** + custom CSS design tokens (`app/globals.css`)
- **Supabase** (Postgres) — `news_items` table
- **Google Gemini** — AI classification + article bodies
- **Google News RSS** — live news source
- `framer-motion`, `lucide-react`, `next-themes`

## 4. Project map
```
app/
  page.tsx              → Hub front door (renders HubLanding)
  news/page.tsx         → Newsroom feed (Hero + grid + sidebar)
  article/[slug]/page.tsx → Article page (+ generateMetadata, cached body)
  hub/page.tsx          → redirects to /
  api/cron/route.ts     → ingestion endpoint (Vercel Cron + worker)
  layout.tsx            → root layout, fonts, ThemeProvider, Header/Footer
  globals.css           → design tokens, themes, animations
  */loading.tsx         → instant skeletons
components/             → Hero, HubLanding, LivingBackground, AutoRefresh,
                          NewsCard, FeaturedSpotlight, BentoGrid, Trending…,
                          Header, Footer, ThemeToggle, etc.
lib/
  liveFetcher.ts        → Google News RSS fetch + getCachedLiveFeed
  ingest.ts             → runIngestion (RSS → Supabase upsert)
  imageFetcher.ts       → OG/feed/content image extraction + download (Vercel-aware)
  resolveArticleImage.ts→ image resolution order + category fallback
  articleContent.ts     → extract real article body from source
  generateArticle.ts    → AI-written article body (Gemini)
  supabase/client.ts    → browser/anon Supabase client
  mockData.ts, constants.ts, svgGenerator.ts, imageGenerator.ts
scripts/
  worker.ts             → Reddit scrape + AI processor + ingestion ping
  reddit-scraper.ts, ai-processor.ts, …
supabase/migrations/initial_schema.sql → DB schema
public/*-bg-*.jpg       → living background art assets
```

## 5. Design system (essentials)
- **Palette:** obsidian base; ember/gold signature; category accents — TCG blue, Figures violet, Watches gold.
- **Type:** Cormorant Garamond (editorial serif), Space Grotesk (display/labels), Inter (body).
- **Theming:** light & dark via `.light` / `.dark` token scopes (`next-themes`, persisted). Cinematic sections force-dark; TCG/Figures lean light.
- **Motion:** ken-burns drift, breathing glow (`poke-breathe`/`poke-pulse`), scanlines, gradient pans, shimmer skeletons. All respect `prefers-reduced-motion`.
- Full reference: `DESIGN_SYSTEM.md`.

## 6. How data flows
1. **Read:** pages query Supabase published rows → else cached live RSS (`getCachedLiveFeed`, 90s) → else mock data.
2. **Ingest:** `runIngestion()` fetches RSS (images resolved) and upserts to Supabase. Triggered by `/api/cron` (Vercel Cron in prod; the local worker pings it).
3. **Article body:** cached per slug (24h) — real source excerpt → AI fallback.
4. **Images:** feed image → og/twitter/largest-content → category fallback. Downloads to `public/images/articles/` locally; serves **remote URLs on Vercel**.

## 7. Setup (local)
1. `npm install`
2. Create `.env.local` (see `SUPABASE_SETUP.md`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   GEMINI_API_KEY=...
   # CRON_SECRET=...   (optional locally)
   ```
3. Run the migration in Supabase (`supabase/migrations/initial_schema.sql`).
4. `npm run dev` → http://localhost:3000
5. (Optional) `npm run start:worker` to fill the DB + Reddit/AI. Or hit `http://localhost:3000/api/cron` once.

## 8. Deployment (Vercel)
1. Push to GitHub (`origin` = the project repo).
2. Vercel → Settings → Environment Variables: the 4 keys above **+ `CRON_SECRET`**.
3. Deploy. `vercel.json` schedules `/api/cron`.
4. **Hobby plan caveat:** cron runs only once/day. For frequent updates, use **Pro** or an external scheduler hitting `https://DOMAIN/api/cron?secret=CRON_SECRET`.
5. Images: served as remote URLs automatically on Vercel (read-only FS).

## 9. Commands
| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (run before deploy) |
| `npm run start` | Start production build |
| `npm run start:worker` | Background worker (Reddit + AI + ingestion ping) |
| `npm run lint` | ESLint |

## 10. Troubleshooting
- **Few real images / category fallbacks showing:** Google's link decoder is intermittent; coverage fills as the cache/DB populate. Running the worker (Reddit images) is the most reliable fix.
- **Figures/Watches empty:** handled — broadened queries, relaxed age filter, guaranteed category coverage.
- **Article shows only a headline:** body builder enriches it (source excerpt → AI) and caches it.
- **Slow first article load:** loading skeleton shows instantly; the feed + body are cached after first compute. Running the worker makes pages pure DB reads.
- **Worker says "Supabase not configured":** fill `.env.local` (no spaces around `=`, no `#`) and restart the worker.

## 11. Conventions
- Theme/colors via CSS variables only (never hardcode hex in components).
- Secrets only in `.env.local` (git-ignored) / Vercel env — never committed.
- Background art assets: `public/<topic>-bg-*.jpg`.
- Living backgrounds via the `LivingBackground` component (`tone="light" | "dark"`).
