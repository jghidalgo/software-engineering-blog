import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import Badge from '@/components/ui/Badge';
import MarkdownArticle from '@/components/MarkdownArticle';
import Reveal from '@/components/Reveal';
import { getNewsPostBySlug } from '@/lib/posts';

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

  return (
    <div className="relative overflow-hidden">
      {/* Decorative backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-aws-smile/10 via-primary-500/5 to-transparent dark:from-aws-smile/[0.08]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-grid" />

      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20 lg:px-8">
        <Reveal>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to all articles
          </Link>

          {/* Source-of-origin chip */}
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-aws-smile/30 bg-aws-smile/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-aws-smile">
            <span className="h-1.5 w-1.5 rounded-full bg-aws-smile" />
            AWS News
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
                This article is an editorial summary and commentary based on an
                official AWS announcement.{' '}
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-aws-smile hover:underline"
                >
                  Read the original on AWS
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
              <span className="font-semibold text-secondary-700 dark:text-secondary-300">Source:</span>{' '}
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-700 dark:text-primary-300 hover:underline"
              >
                {post.sourceTitle || 'AWS announcement'}
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              </a>
            </p>
          </Reveal>
        )}
      </article>
    </div>
  );
}
