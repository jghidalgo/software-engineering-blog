import { ImageResponse } from 'next/og';
import { HARDCODED_POSTS } from '@/lib/posts';
import { loadLogoDataUrl, renderArticleOg, OG_SIZE } from '@/lib/og';

export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'AWSMindset article preview';

const SLUG = 'aws-api-gateway-patterns';

export default async function Image() {
  const post = HARDCODED_POSTS.find((p) => p.slug === SLUG);
  const logoSrc = await loadLogoDataUrl();
  if (!post) throw new Error(`Hardcoded post not found: ${SLUG}`);

  return new ImageResponse(
    renderArticleOg({
      logoSrc,
      title: post.title,
      sourceLabel: 'AWSMindset',
      readTime: post.readTime,
      category: 'hardcoded',
    }),
    { ...size },
  );
}
