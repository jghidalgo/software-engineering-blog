import Parser from 'rss-parser';

export interface AwsRssItem {
  title: string;
  link: string;
  guid: string;
  pubDate: string;
  contentSnippet: string;
  categories: string[];
}

const parser = new Parser<unknown, AwsRssItem>();

const FEED_URL = 'https://aws.amazon.com/about-aws/whats-new/recent/feed/';

export async function fetchAwsWhatsNew(): Promise<AwsRssItem[]> {
  const feed = await parser.parseURL(FEED_URL);
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
 * Lowercase, strip query string and trailing slash. Used as a fallback dedup key
 * in case AWS ever changes a guid for the same URL.
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
