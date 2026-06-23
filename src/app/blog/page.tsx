import { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';
import Pagination from '@/components/Pagination';
import TagFilter from '@/components/TagFilter';
import { getAllPosts, topTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog - AWSMindset',
  description:
    'Editorial coverage of the latest from the AWS blog — patterns, deep dives, and the engineering takeaways behind each release.',
};

// ISR — re-fetch Airtable at most once a minute
export const revalidate = 60;

const PAGE_SIZE = 9;

interface BlogPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page, tag } = await searchParams;
  const requested = Math.max(1, parseInt(page ?? '1', 10) || 1);
  const tagFilter = tag?.trim().toLowerCase() || null;

  // /blog shows ONLY Airtable posts sourced from the AWS Blogs feed.
  const allPosts = await getAllPosts({ source: 'aws-blogs' });

  // Compute tag pills from the FULL pool so all options stay visible even
  // when the user has drilled into one tag.
  const tagOptions = topTags(allPosts);

  // Then apply the tag filter for what's actually rendered.
  const filtered = tagFilter
    ? allPosts.filter((p) => p.tags.some((t) => t.toLowerCase() === tagFilter))
    : allPosts;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(requested, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const posts = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-lg leading-8 text-secondary-600 dark:text-secondary-300">
            Curated commentary on the latest from the AWS engineering blog
          </p>
        </div>

        <TagFilter tags={tagOptions} currentTag={tagFilter} basePath="/blog" />

        {posts.length === 0 ? (
          <div className="mx-auto max-w-md text-center rounded-2xl border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-6 py-16 backdrop-blur">
            <p className="text-base text-secondary-600 dark:text-secondary-300">
              {tagFilter
                ? `No articles tagged "${tagFilter}" yet.`
                : 'No published articles yet. Check back soon — drafts come in daily.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} href={post.href} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/blog"
              extraParams={tagFilter ? { tag: tagFilter } : undefined}
            />
          </>
        )}
      </div>
    </div>
  );
}
