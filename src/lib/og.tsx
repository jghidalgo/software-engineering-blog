import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ReactElement } from 'react';
import type { SourceCategory } from './rss';

/** Visual category — extends RssSource categories with 'hardcoded' for hand-authored posts. */
export type OgCategory = SourceCategory | 'hardcoded';

const ACCENT: Record<OgCategory, string> = {
  hardcoded:      '#ff9900', // hand-authored posts share AWS amber
  'aws':          '#ff9900',
  'at-scale':     '#3b82f6',
  'web-platform': '#06b6d4',
  'industry':     '#94a3b8',
};

const CATEGORY_EYEBROW: Record<OgCategory, string> = {
  hardcoded:      'AWSMINDSET',
  'aws':          'AWS NEWS',
  'at-scale':     'ENGINEERING · AT SCALE',
  'web-platform': 'ENGINEERING · WEB PLATFORM',
  'industry':     'ENGINEERING · INDUSTRY',
};

export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Load Logo.png from disk and return a base64 data URL. Used by every
 * opengraph-image route since next/og can't read fs in JSX.
 */
export async function loadLogoDataUrl(): Promise<string> {
  const data = await readFile(join(process.cwd(), 'public', 'Logo.png'));
  return `data:image/png;base64,${data.toString('base64')}`;
}

function fitTitle(title: string): { text: string; fontSize: number } {
  const text = title.length > 130 ? title.slice(0, 127).trimEnd() + '…' : title;
  // Three tiers — shorter titles get bigger, dramatic display sizing.
  if (text.length <= 50) return { text, fontSize: 76 };
  if (text.length <= 90) return { text, fontSize: 60 };
  return { text, fontSize: 48 };
}

export interface RenderArticleOgArgs {
  logoSrc: string;
  title: string;
  /** Friendly source name shown in the bottom row (e.g. "Netflix Tech Blog"). */
  sourceLabel: string;
  /** Reading time, e.g. "5 min read". */
  readTime: string;
  category: OgCategory;
}

/**
 * Renders the per-article OG card. Used by /blog/news/[slug]/opengraph-image
 * and by each hand-authored /blog/<slug>/opengraph-image so every shared link
 * gets the same branded preview.
 */
export function renderArticleOg(args: RenderArticleOgArgs): ReactElement {
  const { logoSrc, title, sourceLabel, readTime, category } = args;
  const accent = ACCENT[category];
  const categoryLabel = CATEGORY_EYEBROW[category];
  const { text: titleText, fontSize: titleSize } = fitTitle(title);

  return (
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
      {/* Corner glow — accent color matched to the category */}
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

      {/* Secondary cobalt glow — opposite corner, adds depth */}
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
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

      {/* Bottom row — source + read time + url */}
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
          <span>{readTime}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
          <span>awsmindset.com</span>
        </div>
      </div>
    </div>
  );
}
