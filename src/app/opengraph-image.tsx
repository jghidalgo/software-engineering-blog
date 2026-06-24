import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Node runtime so we can read Logo.png from disk
export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'AWSMindset — AWS news & engineering signal';

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'public', 'Logo.png'));
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#060a14',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand gradient corner glows */}
        <div
          style={{
            position: 'absolute',
            top: '-240px',
            right: '-180px',
            width: '760px',
            height: '760px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, #ff990040 0%, #ff990000 65%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-260px',
            left: '-200px',
            width: '720px',
            height: '720px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, #2563eb40 0%, #2563eb00 65%)',
          }}
        />

        {/* Logo — next/og's ImageResponse only supports raw <img>, not next/image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={220} height={220} alt="" />

        {/* Wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            marginTop: 32,
          }}
        >
          <span
            style={{
              color: 'white',
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: '-3px',
            }}
          >
            AWS
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: '-3px',
              background: 'linear-gradient(90deg, #60a5fa 0%, #22d3ee 50%, #ff9900 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Mindset
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            marginTop: 24,
            color: '#94a3b8',
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '0.5px',
          }}
        >
          AWS news · Engineering signal · Patterns that ship
        </div>

        {/* URL pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: 48,
            padding: '12px 24px',
            borderRadius: '9999px',
            background: '#0b1220',
            color: '#cbd5e1',
            fontSize: 22,
            fontWeight: 500,
          }}
        >
          <span
            style={{
              display: 'flex',
              width: 10,
              height: 10,
              borderRadius: '9999px',
              background: '#ff9900',
            }}
          />
          awsmindset.com
        </div>
      </div>
    ),
    { ...size },
  );
}
