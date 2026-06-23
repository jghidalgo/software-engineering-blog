import Airtable, { type FieldSet, type Records } from 'airtable';
import type { RssSource } from './rss';

export interface PostRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  readTime: string;
  status: 'draft' | 'published';
  /** Which AWS RSS feed this article was generated from. Falls back to
   *  'whats-new' for legacy rows that pre-date this field. */
  source: RssSource;
  sourceUrl: string;
  sourceTitle: string;
  sourceGuid: string;
  sourceLinkNorm: string;
  publishedAt: string | null;
  createdAt: string;
}

export interface DraftInsert {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  readTime: string;
  source: RssSource;
  sourceUrl: string;
  sourceTitle: string;
  sourceGuid: string;
  sourceLinkNorm: string;
}

const TABLE = 'Posts';

function getBase() {
  const token = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!token || !baseId) return null;
  return new Airtable({ apiKey: token }).base(baseId);
}

/**
 * Case-insensitive field lookup. Airtable's REST API IS case-sensitive on
 * field names, so `f.title` won't match a field called `Title`. This walks
 * the keys once and returns whichever variant exists.
 */
function pick(f: FieldSet, name: string): unknown {
  if (f[name] !== undefined && f[name] !== null) return f[name];
  const lower = name.toLowerCase();
  for (const k of Object.keys(f)) {
    if (k.toLowerCase() === lower) {
      const v = f[k];
      if (v !== undefined && v !== null) return v;
    }
  }
  return undefined;
}

function mapRecord(r: Records<FieldSet>[number]): PostRecord {
  const f = r.fields;
  const tagsRaw = (pick(f, 'tags') as string | undefined) ?? '';
  const tagsArr = Array.isArray(pick(f, 'tags'))
    ? (pick(f, 'tags') as string[]).map(String)
    : tagsRaw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

  const title = String(pick(f, 'title') ?? '');
  if (!title) {
    console.warn(
      `[airtable-posts] record ${r.id} has empty title. Available fields:`,
      Object.keys(f),
    );
  }

  const rawSource = String(pick(f, 'source') ?? '').trim();
  const source: RssSource =
    rawSource === 'aws-blogs' ? 'aws-blogs' : 'whats-new';

  return {
    id: r.id,
    slug: String(pick(f, 'slug') ?? ''),
    title,
    excerpt: String(pick(f, 'excerpt') ?? ''),
    body: String(pick(f, 'body') ?? ''),
    tags: tagsArr,
    readTime: String(pick(f, 'readTime') ?? '5 min read'),
    status: (pick(f, 'status') as 'draft' | 'published') ?? 'draft',
    source,
    sourceUrl: String(pick(f, 'sourceUrl') ?? ''),
    sourceTitle: String(pick(f, 'sourceTitle') ?? ''),
    sourceGuid: String(pick(f, 'sourceGuid') ?? ''),
    sourceLinkNorm: String(pick(f, 'sourceLinkNorm') ?? ''),
    publishedAt: pick(f, 'publishedAt') ? String(pick(f, 'publishedAt')) : null,
    createdAt: String(pick(f, 'createdAt') ?? ''),
  };
}

export async function listPublishedPosts(): Promise<PostRecord[]> {
  const base = getBase();
  if (!base) return [];
  const rows = await base(TABLE)
    .select({
      filterByFormula: `{status} = 'published'`,
      sort: [{ field: 'publishedAt', direction: 'desc' }],
      pageSize: 100,
    })
    .all();
  return rows.map(mapRecord);
}

export async function findPublishedBySlug(slug: string): Promise<PostRecord | null> {
  const base = getBase();
  if (!base) return null;
  const safeSlug = slug.replace(/'/g, "\\'");
  const rows = await base(TABLE)
    .select({
      filterByFormula: `AND({status} = 'published', {slug} = '${safeSlug}')`,
      maxRecords: 1,
    })
    .all();
  return rows[0] ? mapRecord(rows[0]) : null;
}

export async function listExistingDedupKeys(): Promise<{
  guids: Set<string>;
  links: Set<string>;
  slugs: Set<string>;
}> {
  const base = getBase();
  const guids = new Set<string>();
  const links = new Set<string>();
  const slugs = new Set<string>();
  if (!base) return { guids, links, slugs };
  await base(TABLE)
    .select({ fields: ['sourceGuid', 'sourceLinkNorm', 'slug'], pageSize: 100 })
    .eachPage((records, next) => {
      for (const r of records) {
        const g = r.get('sourceGuid');
        const l = r.get('sourceLinkNorm');
        const s = r.get('slug');
        if (g) guids.add(String(g));
        if (l) links.add(String(l));
        if (s) slugs.add(String(s));
      }
      next();
    });
  return { guids, links, slugs };
}

export async function insertDraft(draft: DraftInsert): Promise<string> {
  const base = getBase();
  if (!base) throw new Error('Airtable not configured');
  const created = await base(TABLE).create([
    {
      fields: {
        slug: draft.slug,
        title: draft.title,
        excerpt: draft.excerpt,
        body: draft.body,
        tags: draft.tags.join(', '),
        readTime: draft.readTime,
        status: 'draft',
        source: draft.source,
        sourceUrl: draft.sourceUrl,
        sourceTitle: draft.sourceTitle,
        sourceGuid: draft.sourceGuid,
        sourceLinkNorm: draft.sourceLinkNorm,
      },
    },
  ]);
  return created[0].id;
}
