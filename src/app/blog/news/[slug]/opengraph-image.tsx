import { ImageResponse } from 'next/og';
import { getNewsPostBySlug } from '@/lib/posts';
import { categoryFor, labelFor } from '@/lib/rss';
import { loadLogoDataUrl, renderArticleOg, OG_SIZE } from '@/lib/og';

// Node runtime so we can read Logo.png from disk via fs
export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'AWSMindset article preview';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const [post, logoSrc] = await Promise.all([
    getNewsPostBySlug(slug),
    loadLogoDataUrl(),
  ]);

  // Graceful fallback if the post no longer exists
  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#060a14',
            color: 'white',
            fontSize: 56,
            fontWeight: 700,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={120} height={120} alt="" />
          <span style={{ marginLeft: 32 }}>AWSMindset</span>
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    renderArticleOg({
      logoSrc,
      title: post.title,
      sourceLabel: labelFor(post.source),
      readTime: post.readTime,
      category: categoryFor(post.source),
    }),
    { ...size },
  );
}
