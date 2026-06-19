import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { fetchAwsWhatsNew, normalizeLink } from '@/lib/rss';
import { rewriteAwsAnnouncement, computeReadTime } from '@/lib/openai-rewrite';
import { listExistingDedupKeys, insertDraft } from '@/lib/airtable-posts';
import { slugify, uniqueSlug } from '@/lib/slugify';
import { HARDCODED_SLUGS } from '@/lib/posts';

// Vercel Hobby tier — serverless functions max at 60s
export const maxDuration = 60;

// Run on the Node runtime (Airtable SDK + crypto need Node, not Edge)
export const runtime = 'nodejs';

// Cap per-run to keep total runtime well under the 60s ceiling
const MAX_ITEMS_PER_RUN = 5;

interface RunResult {
  processed: number;
  skipped: number;
  errors: { guid: string; message: string }[];
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

async function runPipeline(): Promise<RunResult> {
  const result: RunResult = { processed: 0, skipped: 0, errors: [] };

  const [items, dedup] = await Promise.all([
    fetchAwsWhatsNew(),
    listExistingDedupKeys(),
  ]);

  const newItems = items.filter((item) => {
    const link = normalizeLink(item.link);
    if (dedup.guids.has(item.guid)) return false;
    if (link && dedup.links.has(link)) return false;
    return true;
  });

  const takenSlugs = new Set<string>([...HARDCODED_SLUGS, ...dedup.slugs]);
  const batch = newItems.slice(0, MAX_ITEMS_PER_RUN);
  result.skipped = items.length - batch.length;

  for (const item of batch) {
    try {
      const rewritten = await rewriteAwsAnnouncement(item);
      const baseSlug = slugify(rewritten.suggestedSlug || rewritten.title);
      const slug = uniqueSlug(baseSlug || 'aws-news', takenSlugs);
      takenSlugs.add(slug);

      await insertDraft({
        slug,
        title: rewritten.title,
        excerpt: rewritten.excerpt,
        body: rewritten.body,
        tags: rewritten.tags,
        readTime: computeReadTime(rewritten.body),
        sourceUrl: item.link,
        sourceTitle: item.title,
        sourceGuid: item.guid,
        sourceLinkNorm: normalizeLink(item.link),
      });

      result.processed += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[cron/aws-news] item ${item.guid} failed:`, message);
      result.errors.push({ guid: item.guid, message });
    }
  }

  return result;
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
