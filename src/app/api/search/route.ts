import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import { categoryFor } from '@/lib/rss';

// ISR — the palette refetches per session; this caches at the edge for 1m.
export const revalidate = 60;

/**
 * Compact JSON of all renderable posts — consumed client-side by the ⌘K
 * palette. Kept tiny: no body, no source URLs, no metadata. Just enough
 * to render a result row and route to it.
 */
export async function GET() {
  const posts = await getAllPosts();
  const data = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tags: p.tags,
    href: p.href,
    source: p.source,
    category: p.source === 'hardcoded' ? 'hardcoded' : categoryFor(p.source),
  }));

  return NextResponse.json(
    { posts: data },
    {
      headers: {
        // Long browser cache + short revalidation — palette is opened
        // repeatedly within a session, no need to refetch each time.
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    },
  );
}
