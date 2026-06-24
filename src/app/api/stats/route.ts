import { NextResponse } from 'next/server';
import { getPostStats } from '@/lib/airtable-posts';
import { RSS_SOURCE_KEYS, RSS_SOURCES, categoryFor } from '@/lib/rss';

// ISR — these numbers move slowly; revalidate at most every 5 minutes
export const revalidate = 300;

export async function GET() {
  let published = 0;
  let drafts = 0;
  try {
    const stats = await getPostStats();
    published = stats.published;
    drafts = stats.drafts;
  } catch (err) {
    console.error('[api/stats] Airtable unreachable:', err);
  }

  // Distinct categories across the active source list
  const categories = Array.from(
    new Set(RSS_SOURCE_KEYS.map((k) => categoryFor(k))),
  );

  return NextResponse.json(
    {
      publishedCount: published,
      draftsCount: drafts,
      sourcesActive: RSS_SOURCE_KEYS.length,
      sources: RSS_SOURCE_KEYS.map((k) => ({
        key: k,
        label: RSS_SOURCES[k].label,
        category: RSS_SOURCES[k].category,
      })),
      categories,
      categoriesCount: categories.length,
      asOf: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    },
  );
}
