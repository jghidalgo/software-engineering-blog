import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpenIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import BookCard from '@/components/BookCard';
import Reveal from '@/components/Reveal';
import {
  BOOKS,
  BOOK_CATEGORIES,
  isValidBookCategory,
  type BookCategory,
} from '@/lib/books';

export const metadata: Metadata = {
  title: 'Books - AWSMindset',
  description:
    'Hand-picked AWS, system design, and software engineering books — the ones I actually re-read.',
};

interface BooksPageProps {
  searchParams: Promise<{ category?: string }>;
}

function tabHref(category: BookCategory | 'all'): string {
  return category === 'all' ? '/books' : `/books?category=${category}`;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const category: BookCategory | 'all' = isValidBookCategory(params.category)
    ? params.category
    : 'all';

  const books = category === 'all' ? BOOKS : BOOKS.filter((b) => b.category === category);
  const activeBlurb =
    category === 'all'
      ? 'Books that have shaped how I think about cloud, systems, and the craft of shipping software.'
      : BOOK_CATEGORIES.find((c) => c.key === category)?.blurb ?? '';

  return (
    <div className="relative overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-20 bg-mesh opacity-80 dark:opacity-60" />
      <div className="absolute inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[460px] w-[800px] -translate-x-1/2 rounded-full bg-aws-smile/20 blur-3xl dark:bg-aws-smile/10" />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-8">
        {/* Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 dark:bg-white/[0.04] ring-1 ring-secondary-200/70 dark:ring-white/10 backdrop-blur">
            <BookOpenIcon className="h-7 w-7 text-aws-smile" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-3 py-1 text-xs font-medium text-secondary-700 dark:text-secondary-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-aws-smile" />
            Books I&apos;ve actually re-read
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-5xl">
            Recommended <span className="text-gradient">reading</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-secondary-600 dark:text-secondary-300">
            {activeBlurb}
          </p>
        </Reveal>

        {/* Affiliate disclosure — required by the Amazon Associates Operating Agreement. */}
        <Reveal className="mx-auto mt-10 max-w-3xl" delay={60}>
          <div className="flex items-start gap-3 rounded-2xl border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-5 py-4 backdrop-blur">
            <InformationCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-aws-smile" />
            <p className="text-sm leading-relaxed text-secondary-600 dark:text-secondary-300">
              <span className="font-semibold text-secondary-900 dark:text-white">Disclosure:</span>{' '}
              As an Amazon Associate I earn from qualifying purchases. The links below are
              affiliate links — clicking them and buying costs you nothing extra, and helps
              keep this site running. I only recommend books I&apos;ve read and would buy again.
            </p>
          </div>
        </Reveal>

        {/* Category filter */}
        <Reveal className="mt-12" delay={100}>
          <div
            role="tablist"
            aria-label="Book categories"
            className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-1 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] p-1.5 backdrop-blur"
          >
            <Link
              href={tabHref('all')}
              role="tab"
              aria-selected={category === 'all'}
              className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                category === 'all'
                  ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-glow'
                  : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100/70 hover:text-secondary-900 dark:hover:bg-white/[0.06] dark:hover:text-white'
              }`}
            >
              All
            </Link>
            {BOOK_CATEGORIES.map((tab) => {
              const isActive = tab.key === category;
              return (
                <Link
                  key={tab.key}
                  href={tabHref(tab.key)}
                  role="tab"
                  aria-selected={isActive}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-glow'
                      : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100/70 hover:text-secondary-900 dark:hover:bg-white/[0.06] dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </Reveal>

        {/* Grid */}
        <Reveal className="mt-12" delay={140}>
          {books.length === 0 ? (
            <div className="mx-auto max-w-md text-center rounded-2xl border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-6 py-16 backdrop-blur">
              <p className="text-base text-secondary-600 dark:text-secondary-300">
                No books in this category yet — check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book, i) => (
                <Reveal
                  key={book.asin}
                  delay={Math.min(i * 60, 320)}
                  className="h-full"
                >
                  <BookCard book={book} />
                </Reveal>
              ))}
            </div>
          )}
        </Reveal>

        {/* Footer disclosure — second placement for visibility on long pages */}
        <Reveal className="mx-auto mt-20 max-w-3xl text-center" delay={160}>
          <p className="text-xs leading-relaxed text-secondary-500 dark:text-secondary-400">
            AWSMindset is a participant in the Amazon Services LLC Associates Program, an
            affiliate advertising program designed to provide a means for sites to earn
            advertising fees by advertising and linking to Amazon.com.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
