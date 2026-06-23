import Parser from 'rss-parser';

export interface AwsRssItem {
  title: string;
  link: string;
  guid: string;
  pubDate: string;
  contentSnippet: string;
  categories: string[];
}

/**
 * AWS RSS feeds we draft articles from. The key is stored in the Airtable
 * `source` field so each page can render only its own pool.
 */
export const RSS_SOURCES = {
  'whats-new': {
    url: 'https://aws.amazon.com/about-aws/whats-new/recent/feed/',
    label: "AWS What's New",
  },
  'aws-blogs': {
    url: 'https://aws.amazon.com/blogs/aws/feed/',
    label: 'AWS News Blog',
  },
} as const;

export type RssSource = keyof typeof RSS_SOURCES;
export const RSS_SOURCE_KEYS = Object.keys(RSS_SOURCES) as RssSource[];

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
 * key in case AWS ever changes a guid for the same URL.
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
 * in the AWS RSS body before sending to the LLM.
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
