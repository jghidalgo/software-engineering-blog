import type { MetadataRoute } from 'next';
import { getAllPosts, listSeries } from '@/lib/posts';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://www.awsmindset.com';

// Regenerate the sitemap at most once an hour
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,                              lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/blog`,                          lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/aws`,                           lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/engineering`,                   lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${SITE_URL}/engineering?category=at-scale`, lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${SITE_URL}/engineering?category=web-platform`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/engineering?category=industry`, lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${SITE_URL}/series`,                        lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/architecture`,                  lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${SITE_URL}/about`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/contact`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Add a sitemap entry for each series detail page
  let seriesRoutes: MetadataRoute.Sitemap = [];
  try {
    const series = await listSeries();
    seriesRoutes = series.map((s) => ({
      url: `${SITE_URL}/series/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error('[sitemap] failed to load series:', err);
  }

  // All posts — hardcoded blog pages and published Airtable posts together.
  // The merged loader already returns the correct `href` for each (/blog/<slug>
  // for hardcoded, /blog/news/<slug> for AI-generated).
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPosts();
    postRoutes = posts.map((p) => ({
      url: `${SITE_URL}${p.href}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error('[sitemap] failed to load posts:', err);
  }

  return [...staticRoutes, ...seriesRoutes, ...postRoutes];
}
