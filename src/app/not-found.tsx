import Link from 'next/link';
import Image from 'next/image';
import {
  HomeIcon,
  CodeBracketIcon,
  CloudIcon,
  CpuChipIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import BlogCard from '@/components/BlogCard';
import Reveal from '@/components/Reveal';
import { getAllPosts } from '@/lib/posts';

// ISR — pull a fresh "recent posts" set hourly so the 404 page doesn't go stale
export const revalidate = 3600;

const QUICK_LINKS = [
  { label: 'Home',        href: '/',                              Icon: HomeIcon },
  { label: 'Blog',        href: '/blog',                          Icon: CodeBracketIcon },
  { label: 'AWS',         href: '/aws',                           Icon: CloudIcon },
  { label: 'Engineering', href: '/engineering',                   Icon: CpuChipIcon },
];

export default async function NotFound() {
  // Show a small strip of fresh reads — gives the visitor somewhere to go
  // that's more useful than just "404".
  let recent: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    recent = await getAllPosts({ limit: 3 });
  } catch {
    // If Airtable is unreachable, render the page without the recent strip.
  }

  return (
    <div className="relative isolate overflow-hidden">
      {/* Decorative backdrop — consistent with /aws and /engineering */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-mesh opacity-80 dark:opacity-60" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[460px] w-[800px] -translate-x-1/2 rounded-full bg-aws-smile/20 blur-3xl dark:bg-aws-smile/10" />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-8 inline-flex items-center justify-center">
            <Image
              src="/Logo.png"
              alt=""
              width={96}
              height={96}
              className="h-20 w-20 object-contain opacity-90"
              priority
            />
          </div>

          {/* Status code — large brand-gradient numbers */}
          <div className="text-[120px] sm:text-[160px] font-bold leading-none tracking-tight">
            <span className="text-gradient">404</span>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-4xl">
            This route returned no records.
          </h1>

          <p className="mt-4 text-base leading-relaxed text-secondary-600 dark:text-secondary-300 sm:text-lg">
            Either the URL is stale, the article was unpublished, or you typed
            it wrong. Honest mistake — happens at any tier.
          </p>

          {/* ⌘K hint — discoverable, not required */}
          <button
            type="button"
            // The Header's button uses the same custom event to open the palette.
            // Inline onClick wired via a tiny client island would be cleaner,
            // but since this is a server component, we use a plain <button> with
            // an explicit data-attribute and rely on the keyboard shortcut as
            // the primary path. The button itself is purely informational here.
            disabled
            aria-disabled="true"
            className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-4 py-2 text-sm text-secondary-600 dark:text-secondary-300 backdrop-blur"
          >
            <CommandLineIcon className="h-4 w-4" />
            <span>Press</span>
            <kbd className="rounded border border-secondary-200/70 dark:border-white/10 bg-secondary-50 dark:bg-white/[0.06] px-1.5 py-0.5 text-xs font-medium">⌘K</kbd>
            <span>to search</span>
          </button>

          {/* Quick links */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {QUICK_LINKS.map(({ label, href, Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 backdrop-blur hover:text-secondary-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/[0.08] transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </Reveal>

        {/* Recent posts strip — keep the visitor on the site */}
        {recent.length > 0 && (
          <Reveal delay={140} className="mt-20">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-500 dark:text-secondary-400">
                Or try one of these
              </p>
              <h2 className="mt-1 text-2xl font-bold text-secondary-900 dark:text-white sm:text-3xl">
                Latest articles
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((post, i) => (
                <Reveal
                  key={post.slug}
                  delay={Math.min(i * 70, 210)}
                  className="h-full"
                >
                  <BlogCard post={post} href={post.href} />
                </Reveal>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
