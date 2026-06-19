import Airtable, { type FieldSet, type Records } from 'airtable';

export interface PostRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  readTime: string;
  status: 'draft' | 'published';
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

function mapRecord(r: Records<FieldSet>[number]): PostRecord {
  const f = r.fields;
  const tagsRaw = (f.tags as string | undefined) ?? '';
  return {
    id: r.id,
    slug: String(f.slug ?? ''),
    title: String(f.title ?? ''),
    excerpt: String(f.excerpt ?? ''),
    body: String(f.body ?? ''),
    tags: tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    readTime: String(f.readTime ?? '5 min read'),
    status: (f.status as 'draft' | 'published') ?? 'draft',
    sourceUrl: String(f.sourceUrl ?? ''),
    sourceTitle: String(f.sourceTitle ?? ''),
    sourceGuid: String(f.sourceGuid ?? ''),
    sourceLinkNorm: String(f.sourceLinkNorm ?? ''),
    publishedAt: f.publishedAt ? String(f.publishedAt) : null,
    createdAt: String(f.createdAt ?? ''),
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
        sourceUrl: draft.sourceUrl,
        sourceTitle: draft.sourceTitle,
        sourceGuid: draft.sourceGuid,
        sourceLinkNorm: draft.sourceLinkNorm,
      },
    },
  ]);
  return created[0].id;
}
