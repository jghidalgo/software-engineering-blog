import type { BlogPost } from '@/components/BlogCard';
import {
  listPublishedPosts,
  findPublishedBySlug,
  type PostRecord,
} from './airtable-posts';
import type { RssSource } from './rss';

/**
 * The unified blog post shape — extends BlogCard's BlogPost with an optional
 * href so news-sourced posts can route to /blog/news/<slug> while hardcoded
 * posts continue to route to /blog/<slug>.
 */
export interface UnifiedPost extends BlogPost {
  href: string;
  /** 'hardcoded' for hand-written posts, or the RssSource for AI drafts. */
  source: 'hardcoded' | RssSource;
}

/**
 * Single source of truth for hand-authored posts. Each entry has a matching
 * src/app/blog/<slug>/page.tsx file with the full article body.
 */
const HARDCODED_POSTS: BlogPost[] = [
  {
    slug: 'localstack-vs-code-integration',
    title: 'LocalStack VS Code Integration: Revolutionary Local AWS Development',
    excerpt:
      'AWS launches game-changing LocalStack integration in VS Code IDE, enabling seamless local testing and debugging of serverless applications without leaving your favorite editor.',
    content: '',
    date: '2025-09-23',
    author: 'AWS Blog Team',
    tags: ['AWS', 'LocalStack', 'VS Code', 'Local Development', 'Serverless', 'IDE'],
    readTime: '12 min read',
    featured: true,
  },
  {
    slug: 'aws-lambda-console-ide-remote-debugging',
    title:
      'Accelerating Local Serverless Development with Console-to-IDE and Remote Debugging for AWS Lambda',
    excerpt:
      'AWS has introduced a game-changer: Console-to-IDE integration with Remote Debugging for AWS Lambda. Learn how to debug Lambda functions in real-time with breakpoints, variable inspection, and local test events.',
    content: '',
    date: '2025-09-12',
    author: 'DevBlog',
    tags: ['AWS', 'Lambda', 'Serverless', 'Debugging', 'IDE', 'Development'],
    readTime: '6 min read',
    featured: true,
  },
  {
    slug: 'aws-lambda-best-practices',
    title: 'AWS Lambda Best Practices: Building Serverless Applications',
    excerpt:
      'Learn the essential best practices for building efficient, scalable, and maintainable serverless applications with AWS Lambda. From cold start optimization to error handling and security.',
    content: '',
    date: '2025-09-14',
    author: 'DevBlog',
    tags: ['AWS', 'Lambda', 'Serverless', 'Best Practices', 'Performance'],
    readTime: '8 min read',
    featured: true,
  },
  {
    slug: 'aws-infrastructure-as-code',
    title: 'Infrastructure as Code with AWS CDK: A Complete Guide',
    excerpt:
      'Discover how to manage your AWS infrastructure using the AWS CDK and TypeScript for better maintainability, version control, and type safety in your infrastructure code.',
    content: '',
    date: '2025-09-14',
    author: 'DevBlog',
    tags: ['AWS', 'CDK', 'Infrastructure', 'TypeScript', 'DevOps'],
    readTime: '10 min read',
    featured: true,
  },
  {
    slug: 'aws-api-gateway-patterns',
    title: 'AWS API Gateway Patterns and Best Practices',
    excerpt:
      'Learn how to design robust APIs using AWS API Gateway with proper authentication, rate limiting, monitoring, and advanced patterns for production-ready applications.',
    content: '',
    date: '2025-09-14',
    author: 'DevBlog',
    tags: ['AWS', 'API Gateway', 'REST', 'Serverless', 'Architecture'],
    readTime: '11 min read',
    featured: true,
  },
  {
    slug: 'typescript-advanced-patterns',
    title: 'Advanced TypeScript Patterns for Better Code',
    excerpt:
      'Explore advanced TypeScript patterns and techniques that will help you write more maintainable and type-safe applications with real-world examples.',
    content: '',
    date: '2025-01-08',
    author: 'DevBlog',
    tags: ['TypeScript', 'JavaScript', 'Patterns'],
    readTime: '12 min read',
  },
  {
    slug: 'react-performance-optimization',
    title: 'React Performance Optimization Techniques',
    excerpt:
      'Learn proven techniques to optimize your React applications for better performance and user experience including memoization, code splitting, and more.',
    content: '',
    date: '2025-01-03',
    author: 'DevBlog',
    tags: ['React', 'Performance', 'Optimization'],
    readTime: '15 min read',
  },
  {
    slug: 'microservices-architecture-aws',
    title: 'Building Microservices Architecture on AWS',
    excerpt:
      'A comprehensive guide to designing and implementing microservices architecture using AWS services like ECS, API Gateway, RDS, and best practices for scalable systems.',
    content: '',
    date: '2025-01-01',
    author: 'DevBlog',
    tags: ['AWS', 'Microservices', 'Architecture', 'ECS'],
    readTime: '18 min read',
  },
  {
    slug: 'docker-containerization-guide',
    title: 'Complete Guide to Docker Containerization',
    excerpt:
      'Master Docker containerization from basics to advanced techniques for modern application deployment, including best practices and security considerations.',
    content: '',
    date: '2024-12-22',
    author: 'DevBlog',
    tags: ['Docker', 'Containerization', 'DevOps'],
    readTime: '14 min read',
  },
];

export const HARDCODED_SLUGS = new Set(HARDCODED_POSTS.map((p) => p.slug));

function recordToPost(r: PostRecord): UnifiedPost {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.body,
    date: r.publishedAt || r.createdAt || new Date().toISOString().slice(0, 10),
    author: 'AWS News Bot',
    tags: r.tags,
    readTime: r.readTime,
    featured: false,
    href: `/blog/news/${r.slug}`,
    source: r.source,
  };
}

function hardcodedToUnified(p: BlogPost): UnifiedPost {
  return { ...p, href: `/blog/${p.slug}`, source: 'hardcoded' };
}

interface PostQuery {
  tag?: string;
  limit?: number;
  /** Filter by source. 'hardcoded' for hand-written, an RssSource for AI.
   *  When provided, hardcoded posts are still kept ONLY if they pass the tag
   *  filter — letting /blog and /aws show curated content alongside AI drafts. */
  source?: 'hardcoded' | RssSource;
}

/**
 * Merge hardcoded posts with published Airtable posts and sort by date desc.
 * Airtable failures degrade gracefully — hardcoded posts always render.
 */
export async function getAllPosts(query: PostQuery = {}): Promise<UnifiedPost[]> {
  let news: PostRecord[] = [];
  try {
    news = await listPublishedPosts();
  } catch (err) {
    console.error('[posts] failed to load Airtable posts:', err);
  }

  let merged: UnifiedPost[] = [
    ...HARDCODED_POSTS.map(hardcodedToUnified),
    ...news.map(recordToPost),
  ];

  // Drop posts with no real title (e.g. published Airtable rows that haven't
  // had their AI-generated fields filled in yet). They'd render as empty
  // cards and would otherwise dominate the hero slot.
  merged = merged.filter((p) => p.title.trim().length > 0);

  if (query.tag) {
    const needle = query.tag.toLowerCase();
    merged = merged.filter((p) => p.tags.some((t) => t.toLowerCase() === needle));
  }

  if (query.source) {
    // Strict source filter — used by /blog and /aws which now show ONLY
    // Airtable-sourced posts for that feed. Hardcoded posts remain visible
    // on the home page (which doesn't pass a source filter) and via their
    // own direct URLs.
    merged = merged.filter((p) => p.source === query.source);
  }

  merged.sort((a, b) => (a.date < b.date ? 1 : -1));

  return query.limit ? merged.slice(0, query.limit) : merged;
}

export interface TagCount {
  /** Original casing of the first occurrence, used for display. */
  name: string;
  /** Lowercase key — used in the URL and for case-insensitive matching. */
  key: string;
  count: number;
}

/**
 * Compute the most-used tags across a post list, sorted by frequency then
 * alphabetically. The generic "AWS" tag is excluded because every post is
 * AWS-related on these pages and a filter pill for it would be a no-op.
 */
export function topTags(posts: UnifiedPost[], limit = 12): TagCount[] {
  const map = new Map<string, TagCount>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const key = tag.trim().toLowerCase();
      if (!key || key === 'aws') continue;
      const existing = map.get(key);
      if (existing) existing.count += 1;
      else map.set(key, { name: tag.trim(), key, count: 1 });
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

/**
 * Fetch a single AI-generated news post by slug. Returns null if not found or
 * not yet published, or if Airtable is unreachable.
 */
export async function getNewsPostBySlug(
  slug: string,
): Promise<(PostRecord & { href: string }) | null> {
  try {
    const record = await findPublishedBySlug(slug);
    return record ? { ...record, href: `/blog/news/${record.slug}` } : null;
  } catch (err) {
    console.error('[posts] failed to load news post:', err);
    return null;
  }
}
