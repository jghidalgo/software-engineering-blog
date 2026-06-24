import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/Reveal';
import { getSeriesPosts, listSeries, titleizeSeries } from '@/lib/posts';

// ISR — re-fetch the series at most once a minute
export const revalidate = 60;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const title = titleizeSeries(slug);
  return {
    title: `${title} — Series · AWSMindset`,
    description: `Curated multi-part series: ${title}. Read in order or jump in anywhere.`,
  };
}

export async function generateStaticParams() {
  // Pre-build pages for every series so they ship as static HTML.
  const series = await listSeries();
  return series.map((s) => ({ slug: s.slug }));
}

export default async function SeriesDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  const posts = await getSeriesPosts(slug);
  if (posts.length === 0) notFound();

  const title = titleizeSeries(slug);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-mesh opacity-80 dark:opacity-60" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[460px] w-[800px] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl dark:bg-primary-500/10" />

      <div className="mx-auto max-w-4xl px-6 py-24 sm:py-28 lg:px-8">
        <Reveal>
          <Link
            href="/series"
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            All series
          </Link>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
            <ListBulletIcon className="h-3.5 w-3.5" />
            Series · {posts.length} {posts.length === 1 ? 'part' : 'parts'}
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-5xl">
            {title}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-secondary-600 dark:text-secondary-300">
            A reading path through {posts.length} related posts. Each part stands on its own,
            but reading them in order builds the picture faster.
          </p>
        </Reveal>

        {/* Timeline of posts */}
        <Reveal delay={120} className="mt-14">
          <ol className="relative space-y-5 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-primary-500/60 before:via-primary-500/20 before:to-transparent">
            {posts.map((post, idx) => {
              const postDate = post.date ? new Date(post.date) : null;
              return (
                <Reveal
                  key={post.slug}
                  delay={Math.min(idx * 70, 280)}
                  className="relative"
                >
                  <li className="relative">
                    {/* Step indicator */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-bold shadow-glow ring-4 ring-white dark:ring-[#060a14]"
                    >
                      {idx + 1}
                    </span>

                    <Link
                      href={post.href}
                      className="group block rounded-2xl border border-secondary-200/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ml-12 px-5 py-4 sm:px-6 sm:py-5"
                    >
                      <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-xs text-secondary-500 dark:text-secondary-400">
                        {postDate && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <time dateTime={postDate.toISOString()}>
                              {format(postDate, 'MMM dd, yyyy')}
                            </time>
                          </span>
                        )}
                        <span className="h-1 w-1 rounded-full bg-secondary-300 dark:bg-secondary-600" />
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="h-3.5 w-3.5" />
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-secondary-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-secondary-600 dark:text-secondary-300">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="mt-3 flex items-end justify-between gap-4">
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((t) => (
                            <Badge key={t} variant="primary" size="sm">
                              {t}
                            </Badge>
                          ))}
                        </div>
                        <span className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 dark:text-primary-300">
                          Read part {idx + 1}
                          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </div>
  );
}
