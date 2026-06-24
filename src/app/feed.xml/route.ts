import { getAllPosts } from '@/lib/posts';
import { labelFor } from '@/lib/rss';

// ISR — regenerate the feed at most once a minute
export const revalidate = 60;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://www.awsmindset.com';

const SITE_TITLE = 'AWSMindset';
const SITE_DESCRIPTION =
  'A personal field journal on Amazon Web Services — fresh service launches, real-world architectures, and engineering signal from the rest of the industry.';

/**
 * Escape XML-significant characters. Applied to any field that gets
 * concatenated into the feed body to keep the XML well-formed even when
 * Airtable content contains `&`, `<`, `>`, etc.
 */
function xml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

export async function GET() {
  const posts = await getAllPosts();
  const buildDate = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}${post.href}`;
      const sourceLabel =
        post.source === 'hardcoded' ? 'AWSMindset' : labelFor(post.source);
      const author = `${sourceLabel} (via AWSMindset)`;
      const categories = post.tags
        .map((t) => `    <category>${xml(t)}</category>`)
        .join('\n');
      return `  <item>
    <title>${xml(post.title)}</title>
    <link>${xml(link)}</link>
    <guid isPermaLink="true">${xml(link)}</guid>
    <pubDate>${toRfc822(post.date)}</pubDate>
    <description>${xml(post.excerpt)}</description>
    <dc:creator>${xml(author)}</dc:creator>
${categories}
  </item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(SITE_TITLE)}</title>
    <link>${xml(SITE_URL)}</link>
    <description>${xml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${xml(`${SITE_URL}/feed.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
    },
  });
}
