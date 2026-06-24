import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { Resend } from 'resend';
import Airtable from 'airtable';
import { getAllPosts } from '@/lib/posts';
import { labelFor } from '@/lib/rss';
import {
  renderDigestHtml,
  renderDigestText,
  type DigestPost,
} from '@/lib/email-template';

export const runtime = 'nodejs';
export const maxDuration = 60;

const NEWSLETTER_TABLE = 'Newsletter Subscribers';
const POSTS_PER_DIGEST = 5;

interface Subscriber {
  email: string;
  name: string;
}

interface RunResult {
  ok: boolean;
  sent: number;
  failed: number;
  errors: { email: string; message: string }[];
  postsIncluded: number;
  recipients: number;
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

async function listActiveSubscribers(): Promise<Subscriber[]> {
  const token = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!token || !baseId) return [];
  const base = new Airtable({ apiKey: token }).base(baseId);
  const subs: Subscriber[] = [];
  await base(NEWSLETTER_TABLE)
    .select({
      filterByFormula: `{Status} = 'active'`,
      fields: ['Email', 'Name'],
      pageSize: 100,
    })
    .eachPage((records, next) => {
      for (const r of records) {
        const email = String(r.get('Email') ?? '').trim();
        if (email) {
          subs.push({ email, name: String(r.get('Name') ?? '').trim() });
        }
      }
      next();
    });
  return subs;
}

async function runDigest(): Promise<RunResult> {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://www.awsmindset.com';

  const allPosts = await getAllPosts({ limit: POSTS_PER_DIGEST });
  if (allPosts.length === 0) {
    return {
      ok: false,
      sent: 0,
      failed: 0,
      errors: [{ email: '*', message: 'No published posts to send' }],
      postsIncluded: 0,
      recipients: 0,
    };
  }

  const subs = await listActiveSubscribers();
  if (subs.length === 0) {
    return {
      ok: true,
      sent: 0,
      failed: 0,
      errors: [],
      postsIncluded: allPosts.length,
      recipients: 0,
    };
  }

  const digestPosts: DigestPost[] = allPosts.map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    href: `${SITE_URL}${p.href}`,
    sourceLabel: p.source === 'hardcoded' ? 'AWSMindset' : labelFor(p.source),
    readTime: p.readTime,
  }));

  const from =
    process.env.NEWSLETTER_FROM_EMAIL ||
    'AWSMindset <onboarding@resend.dev>'; // Resend's test sender — works without a verified domain
  const replyTo = process.env.NEWSLETTER_REPLY_TO;
  const subject = `AWSMindset digest · ${allPosts.length} new ${
    allPosts.length === 1 ? 'article' : 'articles'
  }`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const result: RunResult = {
    ok: true,
    sent: 0,
    failed: 0,
    errors: [],
    postsIncluded: allPosts.length,
    recipients: subs.length,
  };

  // Send one email per subscriber — never bcc transactional/marketing mail.
  // Resend free tier allows ~2 req/sec; for a personal blog this is fine.
  // If subscriber count grows past a few hundred, swap to Resend batch API.
  for (const sub of subs) {
    try {
      await resend.emails.send({
        from,
        to: sub.email,
        subject,
        html: renderDigestHtml({ posts: digestPosts, name: sub.name }),
        text: renderDigestText({ posts: digestPosts, name: sub.name }),
        ...(replyTo ? { replyTo } : {}),
      });
      result.sent += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[send-digest] ${sub.email} failed:`, message);
      result.errors.push({ email: sub.email, message });
      result.failed += 1;
    }
  }

  result.ok = result.failed === 0;
  return result;
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY not configured' },
      { status: 500 },
    );
  }

  try {
    const result = await runDigest();
    return NextResponse.json(result);
  } catch (err) {
    console.error('[send-digest] fatal:', err);
    const message = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

// Also accept GET — easier to trigger manually via browser/curl.
export const GET = POST;
