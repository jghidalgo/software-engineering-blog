import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowTopRightOnSquareIcon,
  BoltIcon,
  CheckBadgeIcon,
  RssIcon,
} from '@heroicons/react/24/outline';
import Reveal from '@/components/Reveal';
import ArchitectureDiagram from '@/components/architecture/ArchitectureDiagram';
import { getPostStats } from '@/lib/airtable-posts';
import { RSS_SOURCE_KEYS, categoryFor } from '@/lib/rss';

export const metadata: Metadata = {
  title: 'Architecture — How this site works · AWSMindset',
  description:
    'A live, interactive look at the pipeline behind AWSMindset — RSS feeds, Vercel Cron, Google Gemini, Airtable, and Next.js ISR. $0/month, end to end.',
};

// ISR — stats refresh every 5 minutes
export const revalidate = 300;

interface StackItem {
  name: string;
  role: string;
  cost: string;
  link?: string;
  category: 'compute' | 'data' | 'ai' | 'comms' | 'frontend';
}

const STACK: StackItem[] = [
  // Compute / runtime
  { name: 'Next.js 15',     role: 'App Router, RSC, ISR',                cost: '$0 · OSS',          link: 'https://nextjs.org',          category: 'compute' },
  { name: 'Vercel',         role: 'Edge hosting + daily cron',           cost: '$0 · Hobby tier',   link: 'https://vercel.com',          category: 'compute' },
  { name: 'Node 20',        role: 'Runtime for cron + OG image gen',     cost: '$0 · bundled',                                          category: 'compute' },
  // Data
  { name: 'Airtable',       role: 'Posts, subscribers, contact messages', cost: '$0 · 1.2k records', link: 'https://airtable.com',       category: 'data' },
  { name: 'RSS feeds',      role: '10 curated engineering sources',      cost: '$0 · public',                                            category: 'data' },
  // AI
  { name: 'Google Gemini',  role: 'gemini-2.5-flash-lite, JSON mode',    cost: '$0 · 15 RPM free',  link: 'https://aistudio.google.com', category: 'ai' },
  // Comms
  { name: 'Resend',         role: 'Newsletter delivery',                 cost: '$0 · 100/day',      link: 'https://resend.com',          category: 'comms' },
  { name: 'EmailJS',        role: 'Contact form (browser-side)',         cost: '$0 · 200/mo',       link: 'https://emailjs.com',         category: 'comms' },
  // Frontend
  { name: 'Tailwind v4',    role: 'CSS-first config, @theme tokens',     cost: '$0 · OSS',          link: 'https://tailwindcss.com',     category: 'frontend' },
  { name: 'cmdk',           role: 'Command palette (⌘K)',                cost: '$0 · OSS',          link: 'https://cmdk.paco.me',        category: 'frontend' },
  { name: 'next/og',        role: 'Per-post OG images at the edge',      cost: '$0 · built-in',                                          category: 'frontend' },
  { name: 'react-markdown', role: 'GFM article rendering',               cost: '$0 · OSS',                                               category: 'frontend' },
];

const CATEGORY_META: Record<StackItem['category'], { label: string; accent: string }> = {
  compute:  { label: 'Compute',  accent: 'text-cyan-600 dark:text-cyan-300' },
  data:     { label: 'Data',     accent: 'text-primary-700 dark:text-primary-300' },
  ai:       { label: 'AI',       accent: 'text-purple-600 dark:text-purple-300' },
  comms:    { label: 'Comms',    accent: 'text-aws-smile' },
  frontend: { label: 'Frontend', accent: 'text-emerald-600 dark:text-emerald-400' },
};

export default async function ArchitecturePage() {
  let publishedCount = 0;
  let draftsCount = 0;
  try {
    const stats = await getPostStats();
    publishedCount = stats.published;
    draftsCount = stats.drafts;
  } catch (err) {
    console.error('[architecture] failed to load stats:', err);
  }

  const sourcesCount = RSS_SOURCE_KEYS.length;
  const categories = Array.from(new Set(RSS_SOURCE_KEYS.map((k) => categoryFor(k))));
  const categoriesCount = categories.length;

  // Group stack items by category for the rendering
  const stackByCategory = STACK.reduce<Record<string, StackItem[]>>((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  return (
    <div className="relative overflow-hidden">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-mesh opacity-80 dark:opacity-60" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[460px] w-[800px] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl dark:bg-primary-500/10" />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-8">
        {/* Hero */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-3 py-1 text-xs font-medium text-secondary-700 dark:text-secondary-300 backdrop-blur">
            <BoltIcon className="h-3.5 w-3.5 text-aws-smile" />
            How this site actually works
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-5xl lg:text-6xl">
            One pipeline. <span className="text-gradient">$0 / month.</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-secondary-600 dark:text-secondary-300">
            AWSMindset is a personal field journal that publishes itself — almost.
            RSS feeds get drafted into Airtable by an LLM every morning, I review
            and approve, the site reflects the change within 60 seconds. The whole
            thing runs on free tiers.
          </p>
        </Reveal>

        {/* Stats row */}
        <Reveal delay={100} className="mt-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              label="Published"
              value={String(publishedCount)}
              accent="text-emerald-500"
              caption="articles live"
            />
            <StatCard
              label="In review"
              value={String(draftsCount)}
              accent="text-aws-smile"
              caption="drafts pending"
            />
            <StatCard
              label="Sources"
              value={String(sourcesCount)}
              accent="text-cyan-500"
              caption="RSS feeds active"
            />
            <StatCard
              label="Categories"
              value={String(categoriesCount)}
              accent="text-primary-500"
              caption="content arcs"
            />
          </div>
        </Reveal>

        {/* The pipeline diagram */}
        <Reveal delay={140} className="mt-16">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-500 dark:text-secondary-400">
              The pipeline
            </p>
            <h2 className="mt-1 text-2xl font-bold text-secondary-900 dark:text-white sm:text-3xl">
              From RSS to reader, in five stages
            </h2>
          </div>
          <ArchitectureDiagram
            sourcesCount={sourcesCount}
            draftsCount={draftsCount}
            publishedCount={publishedCount}
          />
        </Reveal>

        {/* Stack */}
        <Reveal delay={180} className="mt-20">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-500 dark:text-secondary-400">
              The stack
            </p>
            <h2 className="mt-1 text-2xl font-bold text-secondary-900 dark:text-white sm:text-3xl">
              Every tool, every cost
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-secondary-600 dark:text-secondary-300">
              Twelve building blocks. Nothing exotic, nothing locked in. Everything
              picked for &ldquo;stays free at this volume, swappable when it doesn&apos;t&rdquo;.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {(['compute', 'data', 'ai', 'comms', 'frontend'] as const).map((cat) => (
              <div
                key={cat}
                className="rounded-2xl border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-6 backdrop-blur"
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.16em] ${CATEGORY_META[cat].accent}`}
                >
                  {CATEGORY_META[cat].label}
                </p>
                <ul className="mt-4 divide-y divide-secondary-200/60 dark:divide-white/5">
                  {(stackByCategory[cat] ?? []).map((item) => (
                    <li
                      key={item.name}
                      className="flex items-start justify-between gap-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-secondary-900 dark:text-white">
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:underline"
                            >
                              {item.name}
                              <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-60" />
                            </a>
                          ) : (
                            item.name
                          )}
                        </p>
                        <p className="mt-0.5 text-sm text-secondary-600 dark:text-secondary-300">
                          {item.role}
                        </p>
                      </div>
                      <span className="shrink-0 inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                        {item.cost}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Cost summary */}
        <Reveal delay={220} className="mt-20">
          <div className="rounded-3xl border border-emerald-400/30 dark:border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-primary-500/[0.06] to-aws-smile/10 p-8 sm:p-10 backdrop-blur">
            <div className="flex items-center gap-3">
              <CheckBadgeIcon className="h-8 w-8 text-emerald-500" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                Total monthly cost
              </p>
            </div>
            <p className="mt-3 text-5xl sm:text-6xl font-bold tracking-tight">
              <span className="text-gradient">$0.00</span>
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-secondary-700 dark:text-secondary-200">
              Every layer of the stack lives within a generous free tier at this
              volume. The constraints push back well before the wallet does:
              Vercel Hobby caps at 1 cron/day, Gemini free tier at 15 RPM, Airtable
              at 1.2k records, Resend at 100 emails/day. If any of those become a
              ceiling, the cost is a small fraction of the alternative — Hobby →
              Pro is $20/mo, Airtable Pro is $20/mo, Resend Pro is $20/mo. Even at
              full upgrade, the bill stays under what a Cloudflare Workers Paid
              plan would cost.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/feed.xml"
                className="inline-flex items-center gap-2 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-4 py-2 text-sm font-semibold text-secondary-800 dark:text-secondary-100 backdrop-blur hover:bg-white dark:hover:bg-white/[0.08]"
              >
                <RssIcon className="h-4 w-4" />
                Subscribe to the feed
              </Link>
              <a
                href="https://github.com/jghidalgo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-aws-ink dark:bg-white text-white dark:text-secondary-900 px-4 py-2 text-sm font-semibold hover:shadow-glow-amber transition-all duration-200"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-aws-smile" />
                View source on GitHub
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  caption,
  accent,
}: {
  label: string;
  value: string;
  caption: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-secondary-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] p-5 backdrop-blur shadow-card">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-secondary-500 dark:text-secondary-400">
        {label}
      </p>
      <p className={`mt-1 text-4xl font-bold tracking-tight tabular-nums ${accent}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-secondary-600 dark:text-secondary-400">
        {caption}
      </p>
    </div>
  );
}
