import Parser from 'rss-parser';

export interface AwsRssItem {
  title: string;
  link: string;
  guid: string;
  pubDate: string;
  contentSnippet: string;
  categories: string[];
}

/** Top-level groupings used to route posts to the right page. */
export type SourceCategory = 'aws' | 'at-scale' | 'web-platform' | 'industry';

interface SourceConfig {
  url: string;
  label: string;
  category: SourceCategory;
}

/**
 * All RSS feeds we generate editorial summaries from.
 *
 * Order matters — see `PRIORITY_ORDER` in the cron route. AWS sources are
 * always processed first, then big tech, web platform, and industry feeds
 * fill remaining time budget on each cron run.
 */
export const RSS_SOURCES = {
  // ── AWS (highest priority) ──────────────────────────────────────────────
  'whats-new': {
    url: 'https://aws.amazon.com/about-aws/whats-new/recent/feed/',
    label: "AWS What's New",
    category: 'aws',
  },
  'aws-blogs': {
    url: 'https://aws.amazon.com/blogs/aws/feed/',
    label: 'AWS News Blog',
    category: 'aws',
  },

  // ── Engineering at scale ────────────────────────────────────────────────
  'netflix-tech': {
    url: 'https://netflixtechblog.com/feed',
    label: 'Netflix Tech Blog',
    category: 'at-scale',
  },
  'pragmatic-eng': {
    url: 'https://blog.pragmaticengineer.com/rss/',
    label: 'The Pragmatic Engineer',
    category: 'at-scale',
  },
  'uber-eng': {
    // Uber Engineering's canonical RSS is now the Medium syndication —
    // the old www.uber.com/blog/engineering/rss/ URL 404s.
    url: 'https://medium.com/feed/uber-eng',
    label: 'Uber Engineering',
    category: 'at-scale',
  },
  'meta-eng': {
    url: 'https://engineering.fb.com/feed/',
    label: 'Meta Engineering',
    category: 'at-scale',
  },

  // ── Web platform ────────────────────────────────────────────────────────
  'react-blog': {
    url: 'https://react.dev/rss.xml',
    label: 'React Blog',
    category: 'web-platform',
  },
  'web-dev': {
    url: 'https://web.dev/feed.xml',
    label: 'web.dev',
    category: 'web-platform',
  },

  // ── Industry / signal ──────────────────────────────────────────────────
  'github-blog': {
    url: 'https://github.blog/feed/',
    label: 'GitHub Blog',
    category: 'industry',
  },
  'hn-100': {
    url: 'https://hnrss.org/frontpage?points=100',
    label: 'Hacker News (100+ points)',
    category: 'industry',
  },
} as const satisfies Record<string, SourceConfig>;

export type RssSource = keyof typeof RSS_SOURCES;
export const RSS_SOURCE_KEYS = Object.keys(RSS_SOURCES) as RssSource[];

export function categoryFor(source: RssSource): SourceCategory {
  return RSS_SOURCES[source].category;
}

export function labelFor(source: RssSource): string {
  return RSS_SOURCES[source].label;
}

const parser = new Parser<unknown, AwsRssItem>();

export async function fetchAwsFeed(source: RssSource): Promise<AwsRssItem[]> {
  const feed = await parser.parseURL(RSS_SOURCES[source].url);
  return feed.items
    .map((raw) => {
      const item = raw as unknown as Partial<AwsRssItem> & { isoDate?: string };
      return {
        title: (item.title ?? '').trim(),
        link: (item.link ?? '').trim(),
        guid: (item.guid ?? item.link ?? '').trim(),
        pubDate: (item.pubDate ?? item.isoDate ?? '').trim(),
        contentSnippet: stripHtml(item.contentSnippet ?? '').slice(0, 4000),
        categories: Array.isArray(item.categories) ? item.categories.map(String) : [],
      };
    })
    .filter((i) => i.guid && i.link && i.title);
}

/**
 * Lowercase, strip query string and trailing slash. Used as a fallback dedup
 * key in case the source ever changes a guid for the same URL.
 */
export function normalizeLink(url: string): string {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}${u.pathname.replace(/\/$/, '')}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

/**
 * Remove HTML tags and decode common entities. Defense against prompt-injection
 * in feed bodies before sending to the LLM.
 */
export function stripHtml(input: string): string {
  return input
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
