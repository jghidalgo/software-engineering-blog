import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import {
  fetchAwsFeed,
  normalizeLink,
  categoryFor,
  labelFor,
  RSS_SOURCE_KEYS,
  type RssSource,
} from '@/lib/rss';
import { rewriteAwsAnnouncement, computeReadTime } from '@/lib/ai-rewrite';
import { listExistingDedupKeys, insertDraft } from '@/lib/airtable-posts';
import { slugify, uniqueSlug } from '@/lib/slugify';
import { HARDCODED_SLUGS } from '@/lib/posts';

// Vercel Hobby tier — serverless functions max at 60s
export const maxDuration = 60;

// Run on the Node runtime (Airtable SDK + crypto need Node, not Edge)
export const runtime = 'nodejs';

/**
 * Per-source item caps. AWS sources get the lion's share because the blog's
 * mission is AWS-first; other sources fill remaining time budget.
 */
const ITEMS_PER_SOURCE: Record<RssSource, number> = {
  // AWS — highest priority, generous cap
  'whats-new': 3,
  'aws-blogs': 3,
  // Big tech eng — secondary, lighter cap
  'netflix-tech': 1,
  'pragmatic-eng': 1,
  'uber-eng': 1,
  'meta-eng': 1,
  // Web platform
  'react-blog': 1,
  'web-dev': 1,
  // Industry / signal
  'github-blog': 1,
  'hn-100': 1,
};

// Defensive throttle between AI calls — keeps us under Gemini's free-tier
// 15 RPM cap with comfortable headroom.
const INTER_CALL_DELAY_MS = 4000;

// Stop scheduling new AI calls once elapsed exceeds this. The remaining
// budget is preserved for in-flight work + response serialization, keeping
// the whole run safely under Vercel Hobby's 60s ceiling.
const TIME_BUDGET_MS = 45_000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface SourceResult {
  source: RssSource;
  processed: number;
  skipped: number;
  /** Items deferred to a later run because the time budget was used up. */
  deferred: number;
  errors: { guid: string; message: string }[];
}

interface RunResult {
  sources: SourceResult[];
  processed: number;
  errors: number;
  budgetExhausted: boolean;
  elapsedMs: number;
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
  budget: { startedAt: number; reached: boolean },
): Promise<SourceResult> {
  const result: SourceResult = {
    source,
    processed: 0,
    skipped: 0,
    deferred: 0,
    errors: [],
  };

  const items = await fetchAwsFeed(source);
  const newItems = items.filter((item) => {
    const link = normalizeLink(item.link);
    if (dedupGuids.has(item.guid)) return false;
    if (link && dedupLinks.has(link)) return false;
    return true;
  });

  const cap = ITEMS_PER_SOURCE[source] ?? 1;
  const batch = newItems.slice(0, cap);
  result.skipped = items.length - batch.length;

  for (let i = 0; i < batch.length; i++) {
    // Stop scheduling more AI calls if the budget is reached. Remaining items
    // come back as "deferred" rather than errors.
    if (Date.now() - budget.startedAt > TIME_BUDGET_MS) {
      budget.reached = true;
      result.deferred = batch.length - i;
      break;
    }

    const item = batch[i];
    try {
      if (i > 0) await sleep(INTER_CALL_DELAY_MS);
      const rewritten = await rewriteAwsAnnouncement(item, {
        source,
        sourceLabel: labelFor(source),
        category: categoryFor(source),
      });
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
  const startedAt = Date.now();
  const budget = { startedAt, reached: false };

  const dedup = await listExistingDedupKeys();
  const takenSlugs = new Set<string>([...HARDCODED_SLUGS, ...dedup.slugs]);

  // RSS_SOURCE_KEYS is already in priority order (AWS sources first — see
  // src/lib/rss.ts). The time budget naturally lets AWS run first and fills
  // remaining slots with secondary feeds.
  const sourceResults: SourceResult[] = [];
  for (const source of RSS_SOURCE_KEYS) {
    if (budget.reached) {
      // Record the remaining sources as fully deferred so the response
      // explains why they didn't run.
      sourceResults.push({
        source,
        processed: 0,
        skipped: 0,
        deferred: ITEMS_PER_SOURCE[source] ?? 1,
        errors: [],
      });
      continue;
    }
    try {
      const r = await processSource(source, takenSlugs, dedup.guids, dedup.links, budget);
      sourceResults.push(r);
    } catch (err) {
      // Feed unreachable (404/timeout/etc). One bad feed never kills the run —
      // we log it and move on to the next source.
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[cron/aws-news] [${source}] feed unreachable, skipping: ${message}`);
      sourceResults.push({
        source,
        processed: 0,
        skipped: 0,
        deferred: 0,
        errors: [{ guid: '*', message: `feed unreachable: ${message}` }],
      });
    }
  }

  return {
    sources: sourceResults,
    processed: sourceResults.reduce((sum, s) => sum + s.processed, 0),
    errors: sourceResults.reduce((sum, s) => sum + s.errors.length, 0),
    budgetExhausted: budget.reached,
    elapsedMs: Date.now() - startedAt,
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
