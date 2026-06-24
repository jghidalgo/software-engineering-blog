/**
 * Newsletter digest HTML template. Built for email-client compatibility:
 * inline styles only, table-based layout, no remote CSS, no JS.
 *
 * Keep dependencies minimal — emails don't render React. This module just
 * produces an HTML string.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://www.awsmindset.com';

export interface DigestPost {
  title: string;
  excerpt: string;
  href: string;
  sourceLabel: string;
  readTime: string;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface DigestArgs {
  posts: DigestPost[];
  /** Recipient's display name, optional. */
  name?: string;
  /** Intro sentence shown above the list — falls back to a default. */
  intro?: string;
}

export function renderDigestHtml({ posts, name, intro }: DigestArgs): string {
  const greeting = name ? `Hi ${esc(name)},` : 'Hi there,';
  const introLine = esc(
    intro ??
      `Here are the latest articles from AWSMindset — fresh AWS announcements and engineering signal worth your scan.`,
  );

  const postsHtml = posts
    .map(
      (p) => `
    <tr>
      <td style="padding: 0 0 24px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 20px 24px;">
              <p style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #ff9900;">
                ${esc(p.sourceLabel)} · ${esc(p.readTime)}
              </p>
              <h2 style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 20px; line-height: 1.3; font-weight: 700; color: #0f172a;">
                <a href="${esc(p.href)}" style="color: #0f172a; text-decoration: none;">${esc(p.title)}</a>
              </h2>
              <p style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 15px; line-height: 1.55; color: #475569;">
                ${esc(p.excerpt)}
              </p>
              <a href="${esc(p.href)}" style="display: inline-block; padding: 8px 14px; background: #2563eb; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                Read on AWSMindset →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AWSMindset digest</title>
</head>
<body style="margin: 0; padding: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8fafc;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto;">
          <!-- Header / brand mark -->
          <tr>
            <td style="padding: 0 0 24px 0; text-align: center;">
              <img src="${SITE_URL}/Logo.png" alt="AWSMindset" width="64" height="64" style="display: inline-block; width: 64px; height: 64px;">
              <h1 style="margin: 12px 0 4px 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #0f172a;">
                AWS<span style="color: #ff9900;">Mindset</span>
              </h1>
              <p style="margin: 0; font-size: 13px; letter-spacing: 0.5px; color: #64748b;">
                AWS news · Engineering signal
              </p>
            </td>
          </tr>

          <!-- Greeting + intro -->
          <tr>
            <td style="padding: 12px 0 24px 0;">
              <p style="margin: 0 0 8px 0; font-size: 16px; color: #0f172a; font-weight: 600;">
                ${greeting}
              </p>
              <p style="margin: 0; font-size: 15px; line-height: 1.55; color: #475569;">
                ${introLine}
              </p>
            </td>
          </tr>

          <!-- Posts -->
          ${postsHtml}

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 0 0 0; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.55; color: #64748b;">
                You're receiving this because you subscribed at
                <a href="${SITE_URL}" style="color: #2563eb; text-decoration: none;">awsmindset.com</a>.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Want to unsubscribe? Reply to this email with "unsubscribe" and you'll be removed.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Plain-text alternative for clients that prefer it (and for spam-filter signal).
 */
export function renderDigestText({ posts, name, intro }: DigestArgs): string {
  const greeting = name ? `Hi ${name},` : 'Hi there,';
  const introLine =
    intro ??
    'Here are the latest articles from AWSMindset — fresh AWS announcements and engineering signal worth your scan.';
  const lines = [
    greeting,
    '',
    introLine,
    '',
    ...posts.flatMap((p) => [
      `── ${p.sourceLabel} · ${p.readTime}`,
      p.title,
      p.excerpt,
      `→ ${p.href}`,
      '',
    ]),
    '──',
    `You're receiving this because you subscribed at ${SITE_URL}.`,
    'To unsubscribe, reply with "unsubscribe".',
  ];
  return lines.join('\n');
}
