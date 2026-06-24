import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRightIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import Reveal from '@/components/Reveal';
import { listSeries } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Series - AWSMindset',
  description:
    'Curated reading paths — multi-part series on AWS services, architecture patterns, and engineering deep dives.',
};

// ISR — re-fetch the series index at most once a minute
export const revalidate = 60;

export default async function SeriesIndexPage() {
  const series = await listSeries();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-mesh opacity-80 dark:opacity-60" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[460px] w-[800px] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl dark:bg-primary-500/10" />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-3 py-1 text-xs font-medium text-secondary-700 dark:text-secondary-300 backdrop-blur">
            <ListBulletIcon className="h-3.5 w-3.5" />
            Reading paths
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-5xl">
            Posts grouped into <span className="text-gradient">series</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-secondary-600 dark:text-secondary-300">
            Multi-part walkthroughs and deep dives — read them in order, or
            jump in wherever the headline grabs you.
          </p>
        </Reveal>

        {series.length === 0 ? (
          <Reveal delay={120} className="mt-16">
            <div className="mx-auto max-w-md text-center rounded-2xl border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-6 py-16 backdrop-blur">
              <p className="text-base text-secondary-600 dark:text-secondary-300">
                No series yet. The first one will appear here once two or more
                posts share a series tag.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={120} className="mt-16">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {series.map((s, i) => {
                const cover = s.posts[0];
                return (
                  <Reveal
                    key={s.slug}
                    delay={Math.min(i * 80, 320)}
                    className="h-full"
                  >
                    <Link
                      href={`/series/${s.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-secondary-200/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                    >
                      <div className="h-2 w-full bg-gradient-to-r from-primary-500 via-cyan-400 to-aws-smile" />
                      <div className="flex flex-1 flex-col p-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300">
                          {s.count} {s.count === 1 ? 'part' : 'parts'} · series
                        </p>
                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-secondary-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                          {s.title}
                        </h2>
                        {cover && (
                          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-secondary-600 dark:text-secondary-300">
                            Starts with: {cover.title}
                          </p>
                        )}

                        <ul className="mt-5 space-y-2">
                          {s.posts.slice(0, 4).map((post, idx) => (
                            <li
                              key={post.slug}
                              className="flex items-start gap-3 text-sm text-secondary-700 dark:text-secondary-300"
                            >
                              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] text-[10px] font-bold text-secondary-500 dark:text-secondary-400">
                                {idx + 1}
                              </span>
                              <span className="truncate">{post.title}</span>
                            </li>
                          ))}
                          {s.posts.length > 4 && (
                            <li className="pl-8 text-xs text-secondary-500 dark:text-secondary-400">
                              + {s.posts.length - 4} more
                            </li>
                          )}
                        </ul>

                        <div className="mt-auto pt-5 flex items-center gap-1 text-sm font-semibold text-primary-700 dark:text-primary-300">
                          Read the series
                          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
