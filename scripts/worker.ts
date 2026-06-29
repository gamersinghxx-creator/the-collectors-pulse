import cron from 'node-cron';
import { scrapeReddit } from './reddit-scraper';

// Import processPendingItems from ai-processor by refactoring it or executing it via child_process, 
// OR simpler: since ai-processor is already setting up a cron job when not run with --run, 
// we can just import it and it will start its own cron job!
// Wait, ai-processor uses `process.argv.includes('--run')` to decide whether to run once or start cron.
// If we just import it, it will start its cron job.
import './ai-processor';

console.log('[Worker] Starting Master Background Worker...');

// The AI processor already started its own cron job on import (every 2 minutes).
// We just need to schedule the Reddit scraper here.

// Run scraper every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  console.log('[Worker] Triggering scheduled Reddit Scrape...');
  await scrapeReddit();
});

console.log('[Worker] Scheduled Reddit Scraper to run every 15 minutes.');
console.log('[Worker] AI Processor is already scheduled to run every 2 minutes.');

// ── RSS → Supabase ingestion ────────────────────────────────────────────────
// Pings the running app's /api/cron route so the live RSS feed (with images) is
// upserted into Supabase. This makes the pages fast DB reads. Requires the dev
// server (`npm run dev`) to be running alongside the worker.
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const ingestUrl = `${APP_URL}/api/cron${process.env.CRON_SECRET ? `?secret=${process.env.CRON_SECRET}` : ''}`;

async function ingest() {
  try {
    const res = await fetch(ingestUrl);
    console.log('[Worker] Ingestion:', await res.text());
  } catch (e) {
    console.error('[Worker] Ingestion ping failed (is `npm run dev` running?):', (e as Error).message);
  }
}

// Run ingestion every 10 minutes + once at boot.
cron.schedule('*/10 * * * *', ingest);
console.log('[Worker] Scheduled RSS→Supabase ingestion every 10 minutes.');

// Do initial runs right when the worker boots up.
scrapeReddit().catch(err => console.error('[Worker] Initial scrape error:', err));
ingest();
