# HANDOFF — The Collector's Pulse

> Quick resume doc. If a new AI/dev picks this up, read this first, then `PROJECT_BIBLE.md`.
> Last updated: 2026-06-29

## Where we are
A premium, AI-curated collector-news web app (trading cards, anime figures, luxury watches) built on Next.js 16 / React 19 / Tailwind v4, with Supabase + Google Gemini for data/AI. The UI redesign is complete; the data pipeline works on live RSS and is now wired to populate Supabase so pages become fast DB reads.

## What's done
- Full "Luxe-but-Vivid" redesign (design system in `DESIGN_SYSTEM.md`).
- Routes: `/` (art-driven Hub front door), `/news` (cyberpunk newsroom feed), `/article/[slug]` (article), `/hub` → redirects to `/`.
- Light/dark theme toggle (persists); cinematic sections (Hero, Watches) stay dark by design; TCG/Figures lean light.
- Living, breathing per-category backgrounds (component `LivingBackground`): Pokémon & Watches (dark), TCG & Figures (light). Background images live in `public/*-bg-*.jpg`.
- Live data via Google News RSS (`lib/liveFetcher.ts`) across all 3 categories; on-screen auto-refresh (`AutoRefresh`).
- Detailed article bodies: real source excerpt (`lib/articleContent.ts`) → AI-written fallback (`lib/generateArticle.ts`), cached.
- Image pipeline (`lib/imageFetcher.ts`, `lib/resolveArticleImage.ts`): real photos (feed/og/largest-content image) → clean category fallback. No Google-logo/placeholder boxes. Vercel-aware (serves remote URLs on serverless).
- Performance: cached shared feed (`getCachedLiveFeed`), cached article body, loading skeletons, SEO `generateMetadata`.
- Ingestion: `lib/ingest.ts` (`runIngestion`) upserts the feed into Supabase; `app/api/cron/route.ts` + `vercel.json` cron; local worker (`scripts/worker.ts`) pings the cron route.

## Where we left off / In progress
- **Supabase is configured but may be empty** until the worker/cron has run. Pages read Supabase first, fall back to live RSS.
- **Not yet verified by a production build** — run `npm run build` locally to confirm before deploy.
- Real-image coverage depends on Google's link decoder (intermittent); fills in over time / via the worker.

## How to run
```
# terminal 1
npm run dev                 # http://localhost:3000
# terminal 2 (optional, fills DB + Reddit/AI)
npm run start:worker
```
Trigger one ingestion manually: open `http://localhost:3000/api/cron`.

## Next steps (suggested)
1. `npm run build` to confirm production build.
2. Run the worker to populate Supabase → pages become instant.
3. Deploy to Vercel: set env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `CRON_SECRET`). Note: Hobby cron runs once/day — use Pro or an external scheduler for frequent updates.
4. Optional: have `runIngestion` pre-store full article bodies so first-time article clicks are instant.

## Secrets / env
`.env.local` (git-ignored) holds `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`. Never commit these.
