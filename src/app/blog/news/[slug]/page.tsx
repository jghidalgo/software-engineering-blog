import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import Badge from '@/components/ui/Badge';
import MarkdownArticle from '@/components/MarkdownArticle';
import Reveal from '@/components/Reveal';
import { getNewsPostBySlug } from '@/lib/posts';
import { categoryFor, labelFor, type SourceCategory } from '@/lib/rss';

interface ChipStyle {
  chipClass: string;
  dotClass: string;
  label: string;
  backHref: string;
  backLabel: string;
}

function chipFor(category: SourceCategory, sourceLabel: string): ChipStyle {
  switch (category) {
    case 'aws':
      return {
        chipClass: 'border-aws-smile/30 bg-aws-smile/10 text-aws-smile',
        dotClass: 'bg-aws-smile',
        label: sourceLabel,
        backHref: '/aws',
        backLabel: 'Back to AWS content',
      };
    case 'at-scale':
      return {
        chipClass: 'border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-primary-300',
        dotClass: 'bg-primary-500',
        label: sourceLabel,
        backHref: '/engineering?category=at-scale',
        backLabel: 'Back to Engineering',
      };
    case 'web-platform':
      return {
        chipClass: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
        dotClass: 'bg-cyan-500',
        label: sourceLabel,
        backHref: '/engineering?category=web-platform',
        backLabel: 'Back to Web Platform',
      };
    case 'industry':
      return {
        chipClass: 'border-secondary-500/30 bg-secondary-500/10 text-secondary-700 dark:text-secondary-200',
        dotClass: 'bg-secondary-500',
        label: sourceLabel,
        backHref: '/engineering?category=industry',
        backLabel: 'Back to Industry',
      };
  }
}

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// ISR — re-fetch at most once a minute
export const revalidate = 60;

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);
  if (!post) return { title: 'Article not found - AWSMindset' };
  return {
    title: `${post.title} - AWSMindset`,
    description: post.excerpt,
    alternates: { canonical: post.sourceUrl || undefined },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: post.sourceUrl || undefined,
      type: 'article',
    },
  };
}

export default async function NewsArticlePage({ params }: RouteParams) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);
  if (!post) notFound();

  const postDate = new Date(post.publishedAt || post.createdAt || Date.now());
  const category = categoryFor(post.source);
  const sourceLabel = labelFor(post.source);
  const chip = chipFor(category, sourceLabel);

  return (
    <div className="relative overflow-hidden">
      {/* Decorative backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-aws-smile/10 via-primary-500/5 to-transparent dark:from-aws-smile/[0.08]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-grid" />

      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20 lg:px-8">
        <Reveal>
          <Link
            href={chip.backHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {chip.backLabel}
          </Link>

          {/* Source-of-origin chip — color and label adapt to the feed */}
          <div className={`mt-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${chip.chipClass}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${chip.dotClass}`} />
            {chip.label}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-secondary-600 dark:text-secondary-300">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-secondary-500 dark:text-secondary-400">
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4" />
              <time dateTime={postDate.toISOString()}>
                {format(postDate, 'MMM dd, yyyy')}
              </time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" />
              {post.readTime}
            </span>
            <span className="text-secondary-400 dark:text-secondary-500">·</span>
            <span className="inline-flex items-center gap-1.5">
              Curated &amp; commentary by{' '}
              <span className="font-medium text-secondary-700 dark:text-secondary-300">
                AWS News Bot
              </span>
            </span>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <Badge key={t} variant="primary" size="sm">
                  {t}
                </Badge>
              ))}
            </div>
          )}

          {/* Source attribution — top */}
          {post.sourceUrl && (
            <div className="mt-8 rounded-xl border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-4 py-3 text-sm backdrop-blur">
              <p className="text-secondary-600 dark:text-secondary-300">
                Editorial summary and commentary based on the original from{' '}
                <span className="font-semibold text-secondary-800 dark:text-secondary-100">
                  {sourceLabel}
                </span>
                .{' '}
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 font-semibold hover:underline ${
                    category === 'aws'
                      ? 'text-aws-smile'
                      : 'text-primary-700 dark:text-primary-300'
                  }`}
                >
                  Read the original
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                </a>
              </p>
            </div>
          )}
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <MarkdownArticle body={post.body} />
        </Reveal>

        {/* Source attribution — bottom */}
        {post.sourceUrl && (
          <Reveal delay={180} className="mt-12 border-t border-secondary-200/70 dark:border-white/10 pt-6">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              <span className="font-semibold text-secondary-700 dark:text-secondary-300">
                Source ({sourceLabel}):
              </span>{' '}
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-700 dark:text-primary-300 hover:underline"
              >
                {post.sourceTitle || sourceLabel}
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              </a>
            </p>
          </Reveal>
        )}
      </article>
    </div>
  );
}
