import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { coverGradient, type Book } from '@/lib/books';

export const LEVEL_BADGE: Record<NonNullable<Book['level']>, string> = {
  beginner: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/30',
  intermediate: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/40',
  advanced: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/30',
};

export default function BookCard({ book }: { readonly book: Book }) {
  const gradient = coverGradient(book.asin);

  return (
    <Link
      href={`/books/${book.asin}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-secondary-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
      aria-label={`${book.title} by ${book.author} — read the review`}
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden" style={{ background: gradient }}>
        {book.coverUrl ? (
          // Plain <img> — cover hosts vary, no central allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Recommended reading
            </span>
            <div>
              <p className="text-lg font-bold leading-tight line-clamp-3">{book.title}</p>
              <p className="mt-2 text-sm text-white/80">{book.author}</p>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-base font-bold text-secondary-900 dark:text-white">
            {book.title}
          </h3>
          <p className="mt-0.5 text-sm text-secondary-600 dark:text-secondary-400">
            {book.author}
          </p>
        </div>

        <p className="line-clamp-4 text-sm leading-relaxed text-secondary-700 dark:text-secondary-300">
          {book.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          {book.level && (
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${LEVEL_BADGE[book.level]}`}
            >
              {book.level}
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-aws-smile transition-all group-hover:gap-1.5">
            Read review
            <ArrowRightIcon className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
