import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Base path without query string — e.g. "/blog" or "/aws". */
  basePath: string;
  /** Extra query params to preserve across page changes (e.g. `tag`). */
  extraParams?: Record<string, string>;
}

/**
 * Build a compact list of page tokens with ellipses for large page counts.
 * Always shows: 1, current-1, current, current+1, last. Gaps become "…".
 */
function buildPageList(current: number, total: number): (number | '…')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const set = new Set<number>([1, total, current - 1, current, current + 1]);
  const pages = Array.from(set).filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const result: (number | '…')[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) result.push('…');
    result.push(pages[i]);
  }
  return result;
}

function pageHref(
  basePath: string,
  page: number,
  extraParams?: Record<string, string>,
): string {
  const params = new URLSearchParams(extraParams || {});
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  extraParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;
  const pages = buildPageList(currentPage, totalPages);

  const baseLinkClass =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-3 text-sm font-medium text-secondary-700 dark:text-secondary-300 backdrop-blur transition-colors hover:bg-white dark:hover:bg-white/[0.08] hover:text-secondary-900 dark:hover:text-white';
  const activeClass =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-primary-500/40 bg-primary-600 px-3 text-sm font-semibold text-white shadow-glow';
  const disabledClass =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-secondary-200/40 dark:border-white/5 bg-white/30 dark:bg-white/[0.02] px-3 text-sm text-secondary-400 dark:text-secondary-600 cursor-not-allowed';

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex items-center justify-center gap-1.5 sm:gap-2"
    >
      {prevDisabled ? (
        <span className={`${disabledClass} gap-1`} aria-disabled="true">
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </span>
      ) : (
        <Link
          href={pageHref(basePath, currentPage - 1, extraParams)}
          scroll={false}
          className={`${baseLinkClass} gap-1`}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </Link>
      )}

      {pages.map((p, idx) =>
        p === '…' ? (
          <span
            key={`gap-${idx}`}
            aria-hidden="true"
            className="px-1 text-sm text-secondary-400 dark:text-secondary-600"
          >
            …
          </span>
        ) : p === currentPage ? (
          <span key={p} aria-current="page" className={activeClass}>
            {p}
          </span>
        ) : (
          <Link key={p} href={pageHref(basePath, p, extraParams)} scroll={false} className={baseLinkClass}>
            {p}
          </Link>
        ),
      )}

      {nextDisabled ? (
        <span className={`${disabledClass} gap-1`} aria-disabled="true">
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon className="h-4 w-4" />
        </span>
      ) : (
        <Link
          href={pageHref(basePath, currentPage + 1, extraParams)}
          scroll={false}
          className={`${baseLinkClass} gap-1`}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
