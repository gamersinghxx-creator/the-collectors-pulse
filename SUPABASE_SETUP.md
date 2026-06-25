# Supabase Setup — Enabling Real-Time Flow

This turns on the full pipeline: **Reddit scraper → Gemini AI summarizer → database → live site**.
Without it, the site still runs on live Google News RSS — but there's no continuous background ingestion or AI summarization.

You'll do steps 1–4 (they need your account + secret keys). Steps 5–6 are just commands.

---

## Step 1 — Create a Supabase project

1. Go to https://supabase.com and sign in (free tier is fine).
2. Click **New project**.
3. Name it (e.g. `collectors-pulse`), set a database password (save it somewhere), pick a region near you.
4. Wait ~2 minutes for it to provision.

## Step 2 — Create the database table

1. In your project, open **SQL Editor** (left sidebar) → **New query**.
2. Open the file `supabase/migrations/initial_schema.sql` in this repo, copy its entire contents, paste into the editor.
3. Click **Run**. You should see "Success". This creates the `news_items` table, indexes, and a public read policy.

To confirm: open **Table Editor** → you should see an empty `news_items` table.

## Step 3 — Copy your API keys

1. Open **Settings** (gear icon) → **API**.
2. You need three values:
   - **Project URL** — e.g. `https://abcdefgh.supabase.co`
   - **anon / public** key (under "Project API keys")
   - **service_role** key (same page) — **this is secret. Never commit it or share it publicly.**

## Step 4 — Paste the keys into `.env.local`

Open `.env.local` in this folder and fill the three blank values (already prepared for you):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
GEMINI_API_KEY=...        # already set — leave it
```

Save the file. `.env.local` is git-ignored, so your keys stay local.

## Step 5 — Run the site + the background worker

Open **two** terminals in the `the-collectors-pulse` folder:

**Terminal 1 — the website:**
```
npm run dev
```
Then open http://localhost:3000

**Terminal 2 — the real-time worker:**
```
npm run start:worker
```

The worker does this automatically:
- **Reddit scraper** runs immediately, then every **15 minutes** — pulls new posts from r/PokemonTCG, r/magicTCG, r/AnimeFigures, r/Watches, r/rolex and queues them as `pending_ai`.
- **Gemini AI processor** runs every **2 minutes** — reads pending items, classifies category/tags, writes punchy + full summaries, scores hype 1–10, marks them `published`.

(If Supabase keys are missing, the worker now prints a clear message and stops instead of crashing.)

## Step 6 — Verify the flow

1. Watch Terminal 2 — within ~2 minutes you should see lines like
   `[Scraper] Successfully queued N new posts...` and `[AI] Successfully published item ... with Hype Score: N`.
2. In Supabase **Table Editor → news_items**, rows should appear; `processing_status` flips from `pending_ai` → `published`.
3. Reload http://localhost:3000 — the published Reddit/AI items now appear alongside the Google News RSS articles.

---

## Notes & next steps

- **Source images:** Google News RSS articles get images via the OG-image download pipeline (saved to `public/images/articles/`). Reddit posts use the image URL Reddit provides.
- **The homepage does not auto-refresh yet.** New items appear on page reload. To get true on-screen live flow (no reload), the front end needs a polling/refresh layer added (`router.refresh()` on an interval, or a Supabase realtime subscription). Ask me to add this and I will.
- **Gemini model:** the processor uses `gemini-flash-latest`. If you hit a model error, run `npx tsx scripts/list-models.ts` to see what your key can access.
- **Costs:** Supabase free tier and Gemini free tier cover light usage. Watch your Gemini quota if the 2-minute cycle processes many items.
