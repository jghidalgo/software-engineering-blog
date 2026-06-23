import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { TagCount } from '@/lib/posts';

interface TagFilterProps {
  tags: TagCount[];
  currentTag: string | null;
  /** Page path without query — e.g. "/blog" or "/aws". */
  basePath: string;
}

function tagHref(basePath: string, tagKey: string | null): string {
  if (!tagKey) return basePath;
  const params = new URLSearchParams({ tag: tagKey });
  return `${basePath}?${params.toString()}`;
}

export default function TagFilter({ tags, currentTag, basePath }: TagFilterProps) {
  if (tags.length === 0) return null;

  const allActive = !currentTag;
  const activeClass =
    'inline-flex items-center gap-1.5 rounded-full border border-primary-500/40 bg-primary-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-glow transition-all';
  const inactiveClass =
    'inline-flex items-center gap-1.5 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-secondary-700 dark:text-secondary-300 backdrop-blur hover:text-secondary-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/[0.08] transition-all';

  return (
    <div className="mb-10 flex flex-wrap items-center gap-2">
      <span className="mr-1 hidden text-xs font-semibold uppercase tracking-[0.16em] text-secondary-500 dark:text-secondary-400 sm:inline">
        Filter
      </span>

      <Link
        href={tagHref(basePath, null)}
        className={allActive ? activeClass : inactiveClass}
        aria-current={allActive ? 'page' : undefined}
      >
        All
      </Link>

      {tags.map((t) => {
        const active = currentTag === t.key;
        return (
          <Link
            key={t.key}
            href={tagHref(basePath, t.key)}
            className={active ? activeClass : inactiveClass}
            aria-current={active ? 'page' : undefined}
          >
            <span>{t.name}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                active
                  ? 'bg-white/20'
                  : 'bg-secondary-200/70 text-secondary-600 dark:bg-white/10 dark:text-secondary-400'
              }`}
            >
              {t.count}
            </span>
          </Link>
        );
      })}

      {currentTag && (
        <Link
          href={tagHref(basePath, null)}
          className="ml-1 inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-1.5 text-xs text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white transition-colors"
          aria-label="Clear filter"
        >
          <XMarkIcon className="h-3.5 w-3.5" />
          Clear
        </Link>
      )}
    </div>
  );
}
