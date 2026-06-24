import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import type { SeriesContext } from '@/lib/posts';

interface SeriesWidgetProps {
  context: SeriesContext;
}

/**
 * In-article series widget — shows the series name, current position, and
 * prev/next links. Renders nothing if the post isn't part of a series.
 */
export default function SeriesWidget({ context }: SeriesWidgetProps) {
  const { slug, title, posts, currentIndex, previous, next } = context;
  const total = posts.length;

  return (
    <aside
      aria-label={`Part of the ${title} series`}
      className="my-10 rounded-2xl border border-primary-500/20 dark:border-primary-400/20 bg-primary-50/60 dark:bg-primary-500/[0.06] p-5 backdrop-blur"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white shadow-glow">
          <ListBulletIcon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300">
            Part {currentIndex} of {total} in the series
          </p>
          <Link
            href={`/series/${slug}`}
            className="mt-0.5 inline-block text-lg font-bold text-secondary-900 dark:text-white hover:underline"
          >
            {title}
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {previous ? (
          <Link
            href={previous.href}
            className="group flex items-start gap-2 rounded-xl border border-secondary-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] px-3 py-2.5 text-left transition-colors hover:border-primary-400/50 dark:hover:border-primary-400/40"
          >
            <ArrowLeftIcon className="mt-0.5 h-4 w-4 shrink-0 text-secondary-500 dark:text-secondary-400 group-hover:-translate-x-0.5 transition-transform" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                Previous
              </p>
              <p className="text-sm font-medium text-secondary-800 dark:text-secondary-100 truncate">
                {previous.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="rounded-xl border border-dashed border-secondary-200/60 dark:border-white/5 px-3 py-2.5 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary-400 dark:text-secondary-600">
              Start of series
            </p>
            <p className="text-sm text-secondary-400 dark:text-secondary-600">
              You are at the start
            </p>
          </div>
        )}

        {next ? (
          <Link
            href={next.href}
            className="group flex items-start gap-2 rounded-xl border border-secondary-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] px-3 py-2.5 text-left transition-colors hover:border-primary-400/50 dark:hover:border-primary-400/40 sm:text-right sm:flex-row-reverse"
          >
            <ArrowRightIcon className="mt-0.5 h-4 w-4 shrink-0 text-secondary-500 dark:text-secondary-400 group-hover:translate-x-0.5 transition-transform" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                Up next
              </p>
              <p className="text-sm font-medium text-secondary-800 dark:text-secondary-100 truncate">
                {next.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="rounded-xl border border-dashed border-secondary-200/60 dark:border-white/5 px-3 py-2.5 text-left sm:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary-400 dark:text-secondary-600">
              End of series
            </p>
            <p className="text-sm text-secondary-400 dark:text-secondary-600">
              You finished it
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
