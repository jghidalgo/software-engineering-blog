'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { TagCount } from '@/lib/posts';

interface TagFilterProps {
  tags: TagCount[];
  currentTag: string | null;
  /** Page path without query — e.g. "/blog" or "/aws". */
  basePath: string;
  /** How many pills to show inline before everything else moves to the dropdown. */
  topN?: number;
}

function tagHref(basePath: string, tagKey: string | null): string {
  if (!tagKey) return basePath;
  return `${basePath}?${new URLSearchParams({ tag: tagKey }).toString()}`;
}

const pillBase =
  'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all';
const pillActive =
  'border-primary-500/40 bg-primary-600 text-white shadow-glow';
const pillInactive =
  'border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] text-secondary-700 dark:text-secondary-300 backdrop-blur hover:text-secondary-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/[0.08]';

export default function TagFilter({
  tags,
  currentTag,
  basePath,
  topN = 5,
}: TagFilterProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKey);
    // Focus search input when opened
    inputRef.current?.focus();
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const topPills = tags.slice(0, topN);
  const overflow = tags.slice(topN);

  const filteredOverflow = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return overflow;
    return overflow.filter(
      (t) => t.name.toLowerCase().includes(q) || t.key.includes(q),
    );
  }, [overflow, query]);

  // If the current tag isn't among the top pills, highlight the "More" button
  // so users can see they have an active filter that's not visible inline.
  const currentInOverflow =
    currentTag !== null &&
    !topPills.some((t) => t.key === currentTag) &&
    overflow.some((t) => t.key === currentTag);
  const currentOverflowName = currentInOverflow
    ? overflow.find((t) => t.key === currentTag)?.name
    : null;

  if (tags.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="mb-10 flex flex-wrap items-center gap-2"
    >
      <span className="mr-1 hidden text-xs font-semibold uppercase tracking-[0.16em] text-secondary-500 dark:text-secondary-400 sm:inline">
        Filter
      </span>

      <Link
        href={tagHref(basePath, null)}
        scroll={false}
        className={`${pillBase} ${!currentTag ? pillActive : pillInactive}`}
        aria-current={!currentTag ? 'page' : undefined}
      >
        All
      </Link>

      {topPills.map((t) => {
        const active = currentTag === t.key;
        return (
          <Link
            key={t.key}
            href={tagHref(basePath, t.key)}
            scroll={false}
            className={`${pillBase} ${active ? pillActive : pillInactive}`}
            aria-current={active ? 'page' : undefined}
          >
            <span>{t.name}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                active ? 'bg-white/20' : 'bg-secondary-200/70 text-secondary-600 dark:bg-white/10 dark:text-secondary-400'
              }`}
            >
              {t.count}
            </span>
          </Link>
        );
      })}

      {overflow.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`${pillBase} ${currentInOverflow ? pillActive : pillInactive}`}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            {currentOverflowName ? (
              <>
                <span>{currentOverflowName}</span>
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] tabular-nums">
                  active
                </span>
              </>
            ) : (
              <>
                <span>More services</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                    currentInOverflow ? 'bg-white/20' : 'bg-secondary-200/70 text-secondary-600 dark:bg-white/10 dark:text-secondary-400'
                  }`}
                >
                  +{overflow.length}
                </span>
              </>
            )}
            <ChevronDownIcon
              className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {open && (
            <div
              role="dialog"
              aria-label="All services"
              className="absolute left-0 z-30 mt-2 w-72 sm:w-80 overflow-hidden rounded-2xl border border-secondary-200/70 dark:border-white/10 bg-white dark:bg-[#0b1220] shadow-card-hover backdrop-blur"
            >
              <div className="relative border-b border-secondary-200/60 dark:border-white/10 px-3 py-2">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services…"
                  className="w-full bg-transparent pl-7 pr-2 py-1.5 text-sm text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none"
                />
              </div>

              <ul className="max-h-72 overflow-y-auto py-1">
                {filteredOverflow.length === 0 ? (
                  <li className="px-4 py-3 text-xs text-secondary-500 dark:text-secondary-400">
                    No services match &ldquo;{query}&rdquo;
                  </li>
                ) : (
                  filteredOverflow.map((t) => {
                    const active = currentTag === t.key;
                    return (
                      <li key={t.key}>
                        <Link
                          href={tagHref(basePath, t.key)}
                          scroll={false}
                          onClick={() => setOpen(false)}
                          className={`flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors ${
                            active
                              ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300 font-semibold'
                              : 'text-secondary-700 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-white/[0.06]'
                          }`}
                        >
                          <span className="truncate">{t.name}</span>
                          <span className="shrink-0 rounded-full bg-secondary-100 dark:bg-white/[0.06] px-1.5 py-0.5 text-[10px] tabular-nums text-secondary-600 dark:text-secondary-400">
                            {t.count}
                          </span>
                        </Link>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {currentTag && (
        <Link
          href={tagHref(basePath, null)}
          scroll={false}
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
