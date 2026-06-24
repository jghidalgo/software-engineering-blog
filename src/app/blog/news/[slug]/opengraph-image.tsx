import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getNewsPostBySlug } from '@/lib/posts';
import { categoryFor, labelFor, type SourceCategory } from '@/lib/rss';

// Node runtime so we can read Logo.png from disk via fs
export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'AWSMindset article preview';

const ACCENT: Record<SourceCategory, string> = {
  'aws':          '#ff9900',
  'at-scale':     '#3b82f6',
  'web-platform': '#06b6d4',
  'industry':     '#94a3b8',
};

const CATEGORY_LABEL: Record<SourceCategory, string> = {
  'aws':          'AWS NEWS',
  'at-scale':     'ENGINEERING · AT SCALE',
  'web-platform': 'ENGINEERING · WEB PLATFORM',
  'industry':     'ENGINEERING · INDUSTRY',
};

function fitTitle(title: string): { text: string; fontSize: number } {
  const text = title.length > 130 ? title.slice(0, 127).trimEnd() + '…' : title;
  // Three tiers — shorter titles get bigger, dramatic display sizing.
  if (text.length <= 50) return { text, fontSize: 76 };
  if (text.length <= 90) return { text, fontSize: 60 };
  return { text, fontSize: 48 };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  const logoData = await readFile(join(process.cwd(), 'public', 'Logo.png'));
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

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
          <img src={logoSrc} width={120} height={120} alt="" />
          <span style={{ marginLeft: 32 }}>AWSMindset</span>
        </div>
      ),
      { ...size },
    );
  }

  const category = categoryFor(post.source);
  const sourceLabel = labelFor(post.source);
  const accent = ACCENT[category];
  const categoryLabel = CATEGORY_LABEL[category];
  const { text: titleText, fontSize: titleSize } = fitTitle(post.title);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#060a14',
          padding: '60px 72px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Corner glow — accent color matched to the source category */}
        <div
          style={{
            position: 'absolute',
            top: '-220px',
            right: '-180px',
            width: '720px',
            height: '720px',
            borderRadius: '9999px',
            background: `radial-gradient(circle, ${accent}40 0%, ${accent}00 65%)`,
          }}
        />

        {/* Secondary glow — cobalt, opposite corner, adds depth */}
        <div
          style={{
            position: 'absolute',
            bottom: '-260px',
            left: '-160px',
            width: '640px',
            height: '640px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, #2563eb33 0%, #2563eb00 65%)',
          }}
        />

        {/* Top row — brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img src={logoSrc} width={72} height={72} alt="" />
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span
              style={{
                color: 'white',
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: '-1px',
              }}
            >
              AWS
            </span>
            <span
              style={{
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: '-1px',
                background: 'linear-gradient(90deg, #60a5fa 0%, #22d3ee 50%, #ff9900 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Mindset
            </span>
          </div>
        </div>

        {/* Middle — category eyebrow + title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            marginTop: 12,
          }}
        >
          {/* Category eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: 28,
            }}
          >
            <span
              style={{
                display: 'flex',
                width: 12,
                height: 12,
                borderRadius: '9999px',
                background: accent,
              }}
            />
            <span
              style={{
                color: accent,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '4px',
              }}
            >
              {categoryLabel}
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              color: 'white',
              fontSize: titleSize,
              fontWeight: 800,
              letterSpacing: '-2px',
              lineHeight: 1.05,
              maxWidth: '1050px',
            }}
          >
            {titleText}
          </div>
        </div>

        {/* Bottom row — source + URL */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#cbd5e1',
            fontSize: 22,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                display: 'flex',
                width: 8,
                height: 8,
                borderRadius: '9999px',
                background: '#10b981',
              }}
            />
            <span>
              Source: <span style={{ color: 'white', fontWeight: 600 }}>{sourceLabel}</span>
            </span>
            <span style={{ color: '#475569' }}>·</span>
            <span>{post.readTime}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
            <span>awsmindset.com</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
