import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { fetchAwsFeed, normalizeLink, RSS_SOURCE_KEYS, type RssSource } from '@/lib/rss';
import { rewriteAwsAnnouncement, computeReadTime } from '@/lib/ai-rewrite';
import { listExistingDedupKeys, insertDraft } from '@/lib/airtable-posts';
import { slugify, uniqueSlug } from '@/lib/slugify';
import { HARDCODED_SLUGS } from '@/lib/posts';

// Vercel Hobby tier — serverless functions max at 60s
export const maxDuration = 60;

// Run on the Node runtime (Airtable SDK + crypto need Node, not Edge)
export const runtime = 'nodejs';

// Cap per-run, PER SOURCE, to keep total runtime well under the 60s ceiling.
// With 2 sources this is up to ~6 AI/Airtable round-trips per source.
const MAX_ITEMS_PER_SOURCE_PER_RUN = 3;

// Defensive throttle between AI calls — keeps us safely under Gemini's
// free-tier RPM cap even if Google ever lowers it.
const INTER_CALL_DELAY_MS = 4000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface SourceResult {
  source: RssSource;
  processed: number;
  skipped: number;
  errors: { guid: string; message: string }[];
}

interface RunResult {
  sources: SourceResult[];
  processed: number;
  errors: number;
}

function authorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = req.headers.get('authorization') ?? '';
  const presented = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!presented || presented.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(presented), Buffer.from(expected));
  } catch {
    return false;
  }
}

async function processSource(
  source: RssSource,
  takenSlugs: Set<string>,
  dedupGuids: Set<string>,
  dedupLinks: Set<string>,
): Promise<SourceResult> {
  const result: SourceResult = { source, processed: 0, skipped: 0, errors: [] };

  const items = await fetchAwsFeed(source);
  const newItems = items.filter((item) => {
    const link = normalizeLink(item.link);
    if (dedupGuids.has(item.guid)) return false;
    if (link && dedupLinks.has(link)) return false;
    return true;
  });

  const batch = newItems.slice(0, MAX_ITEMS_PER_SOURCE_PER_RUN);
  result.skipped = items.length - batch.length;

  for (let i = 0; i < batch.length; i++) {
    const item = batch[i];
    try {
      if (i > 0) await sleep(INTER_CALL_DELAY_MS);
      const rewritten = await rewriteAwsAnnouncement(item);
      const baseSlug = slugify(rewritten.suggestedSlug || rewritten.title);
      const slug = uniqueSlug(baseSlug || source, takenSlugs);
      takenSlugs.add(slug);

      await insertDraft({
        slug,
        title: rewritten.title,
        excerpt: rewritten.excerpt,
        body: rewritten.body,
        tags: rewritten.tags,
        readTime: computeReadTime(rewritten.body),
        source,
        sourceUrl: item.link,
        sourceTitle: item.title,
        sourceGuid: item.guid,
        sourceLinkNorm: normalizeLink(item.link),
      });

      // Reserve newly-inserted dedup keys so a second source can't dupe them
      dedupGuids.add(item.guid);
      dedupLinks.add(normalizeLink(item.link));
      result.processed += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[cron/aws-news] [${source}] item ${item.guid} failed:`, message);
      result.errors.push({ guid: item.guid, message });
    }
  }

  return result;
}

async function runPipeline(): Promise<RunResult> {
  const dedup = await listExistingDedupKeys();
  const takenSlugs = new Set<string>([...HARDCODED_SLUGS, ...dedup.slugs]);

  // Process sources sequentially to predictably stay under maxDuration.
  const sourceResults: SourceResult[] = [];
  for (const source of RSS_SOURCE_KEYS) {
    try {
      const r = await processSource(source, takenSlugs, dedup.guids, dedup.links);
      sourceResults.push(r);
    } catch (err) {
      console.error(`[cron/aws-news] [${source}] fatal source error:`, err);
      sourceResults.push({
        source,
        processed: 0,
        skipped: 0,
        errors: [{ guid: '*', message: err instanceof Error ? err.message : String(err) }],
      });
    }
  }

  return {
    sources: sourceResults,
    processed: sourceResults.reduce((sum, s) => sum + s.processed, 0),
    errors: sourceResults.reduce((sum, s) => sum + s.errors.length, 0),
  };
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  try {
    const result = await runPipeline();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('[cron/aws-news] fatal:', err);
    const message = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

// Vercel Cron sends GET by default; expose POST for manual triggers too.
export const POST = GET;
