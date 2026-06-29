import { NextResponse } from 'next/server';
import { runIngestion } from '../../../lib/ingest';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Ingestion endpoint. Triggered by:
 *  - Vercel Cron (sends `Authorization: Bearer <CRON_SECRET>` automatically), and
 *  - the local worker (pings `/api/cron?secret=<CRON_SECRET>`).
 * If CRON_SECRET is unset (local dev), it's open for convenience.
 */
async function handle(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    const qSecret = new URL(request.url).searchParams.get('secret');
    if (auth !== `Bearer ${secret}` && qSecret !== secret) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
  }
  const result = await runIngestion();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

export async function GET(request: Request) { return handle(request); }
export async function POST(request: Request) { return handle(request); }
