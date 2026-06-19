import BlogCard from './BlogCard';
import Reveal from './Reveal';
import { getAllPosts } from '@/lib/posts';

interface FeaturedPostsProps {
  readonly limit?: number;
}

// Bento placement classes for the first 6 posts
const BENTO_SLOTS = [
  'lg:col-span-2 lg:row-span-2', // hero — large
  'lg:col-span-1',                // top right
  'lg:col-span-1',                // mid right
  'lg:col-span-1',                // bottom row
  'lg:col-span-1',                // bottom row
  'lg:col-span-1',                // bottom row
];

// ISR — re-fetch Airtable at most once a minute
export const revalidate = 60;

export default async function FeaturedPosts({ limit = 6 }: FeaturedPostsProps) {
  const posts = await getAllPosts({ limit });

  return (
    <section className="relative py-24 sm:py-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-secondary-100/60 to-transparent dark:from-white/[0.02]" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-3 py-1 text-xs font-medium text-secondary-700 dark:text-secondary-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            Featured this week
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-4xl">
            Latest from the <span className="text-gradient">cloud</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-secondary-600 dark:text-secondary-300">
            Hand-picked deep dives into AWS services, architecture patterns, and the
            engineering decisions that make production systems tick.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:auto-rows-fr lg:gap-7">
          {posts.map((post, index) => {
            const slot = BENTO_SLOTS[index] ?? 'lg:col-span-1';
            const isHero = index === 0;
            return (
              <Reveal
                key={post.slug}
                delay={Math.min(index * 80, 320)}
                className={`h-full ${slot}`}
              >
                <BlogCard
                  post={post}
                  href={post.href}
                  featured={isHero}
                  variant={isHero ? 'hero' : 'standard'}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
