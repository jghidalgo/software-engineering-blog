import Link from 'next/link';
import { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';
import Reveal from '@/components/Reveal';
import Pagination from '@/components/Pagination';
import TagFilter from '@/components/TagFilter';
import { getAllPosts, topTags } from '@/lib/posts';
import type { SourceCategory } from '@/lib/rss';

export const metadata: Metadata = {
  title: 'Engineering - AWSMindset',
  description:
    'Engineering at scale, modern web platform, and industry signal — curated reading alongside the AWS work.',
};

// ISR — re-fetch Airtable at most once a minute
export const revalidate = 60;

const PAGE_SIZE = 9;

const TABS: { key: SourceCategory; label: string; blurb: string }[] = [
  {
    key: 'at-scale',
    label: 'At Scale',
    blurb: 'How Netflix, Uber, Meta, and others actually operate in production.',
  },
  {
    key: 'web-platform',
    label: 'Web Platform',
    blurb: 'React, the browser, V8 — the layer that ships to users.',
  },
  {
    key: 'industry',
    label: 'Industry',
    blurb: 'High-signal reading from GitHub, HN, and engineering leaders.',
  },
];

function tabHref(category: SourceCategory): string {
  return `/engineering?category=${category}`;
}

function isValidCategory(value: string | undefined): value is SourceCategory {
  return value === 'at-scale' || value === 'web-platform' || value === 'industry';
}

interface EngineeringPageProps {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}

export default async function EngineeringPage({ searchParams }: EngineeringPageProps) {
  const params = await searchParams;
  const category: SourceCategory = isValidCategory(params.category)
    ? params.category
    : 'at-scale';
  const requested = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const tagFilter = params.tag?.trim().toLowerCase() || null;

  const allPosts = await getAllPosts({ category });
  const tagOptions = topTags(allPosts);
  const filtered = tagFilter
    ? allPosts.filter((p) => p.tags.some((t) => t.toLowerCase() === tagFilter))
    : allPosts;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(requested, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const posts = filtered.slice(start, start + PAGE_SIZE);

  const activeTab = TABS.find((t) => t.key === category) ?? TABS[0];
  const basePath = `/engineering?category=${category}`;

  return (
    <div className="relative overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-20 bg-mesh opacity-80 dark:opacity-60" />
      <div className="absolute inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[460px] w-[800px] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl dark:bg-primary-500/10" />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-8">
        {/* Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-3 py-1 text-xs font-medium text-secondary-700 dark:text-secondary-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            Engineering at Scale
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-5xl">
            What the rest of the <span className="text-gradient">industry</span> is shipping
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-secondary-600 dark:text-secondary-300">
            Curated commentary on engineering blogs, web platform updates, and
            industry signal — the reading that informs the AWS work.
          </p>
        </Reveal>

        {/* Tabs */}
        <Reveal className="mt-12 scroll-mt-24" delay={80}>
          <div
            id="articles"
            role="tablist"
            aria-label="Engineering content categories"
            className="mx-auto flex w-fit items-center gap-1 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] p-1.5 backdrop-blur"
          >
            {TABS.map((tab) => {
              const isActive = tab.key === category;
              return (
                <Link
                  key={tab.key}
                  href={tabHref(tab.key)}
                  scroll={false}
                  role="tab"
                  aria-selected={isActive}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-glow bg-gradient-to-br from-primary-600 to-primary-700'
                      : 'text-secondary-700 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100/70 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          <p className="mt-4 text-center text-sm text-secondary-500 dark:text-secondary-400">
            {activeTab.blurb}
          </p>
        </Reveal>

        {/* Articles */}
        <Reveal className="mt-12" delay={120}>
          <TagFilter tags={tagOptions} currentTag={tagFilter} basePath={basePath} />

          {posts.length === 0 ? (
            <div className="mx-auto max-w-md text-center rounded-2xl border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-6 py-16 backdrop-blur">
              <p className="text-base text-secondary-600 dark:text-secondary-300">
                {tagFilter
                  ? `No ${activeTab.label.toLowerCase()} articles tagged "${tagFilter}" yet.`
                  : `No ${activeTab.label.toLowerCase()} articles published yet. New drafts arrive daily — review them in Airtable to publish.`}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <Reveal
                    key={post.slug}
                    delay={Math.min(i * 60, 320)}
                    className="h-full"
                  >
                    <BlogCard post={post} href={post.href} />
                  </Reveal>
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/engineering"
                extraParams={{
                  category,
                  ...(tagFilter ? { tag: tagFilter } : {}),
                }}
              />
            </>
          )}
        </Reveal>
      </div>
    </div>
  );
}
