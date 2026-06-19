import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownArticleProps {
  body: string;
}

/**
 * Allowlist URL transformer — only http(s) and mailto links survive.
 * Defends against AI-generated `javascript:` URLs and other unexpected schemes.
 */
function urlTransform(url: string): string {
  try {
    const lower = url.trim().toLowerCase();
    if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('mailto:')) {
      return url;
    }
    if (lower.startsWith('/') || lower.startsWith('#')) return url;
    return '';
  } catch {
    return '';
  }
}

export default function MarkdownArticle({ body }: MarkdownArticleProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:tracking-tight prose-a:text-primary-700 dark:prose-a:text-primary-300 prose-code:rounded prose-code:bg-secondary-100 dark:prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.9em] prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={urlTransform}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
