import Link from 'next/link';
import { CalendarIcon, ClockIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Badge from './ui/Badge';
import Spotlight from './Spotlight';
import { gradientFromSlug } from '@/lib/gradientFromSlug';

/**
 * Extract a plain-text preview from a markdown body — for the hero card so
 * it doesn't look half-empty when the excerpt is short. Strips headings,
 * inline formatting, links and bullets, then returns the first paragraph.
 */
function previewFromContent(content: string, max = 260): string {
  if (!content) return '';
  const plain = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#{1,6}\s+.+$/gm, '')
    .replace(/\*\*?(.+?)\*\*?/g, '$1')
    .replace(/\[(.+?)\]\((?:.+?)\)/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^\s*[-*+>]\s+/gm, '')
    .replace(/\n{2,}/g, '\n\n')
    .trim();
  const firstPara = plain.split(/\n\n/).find((p) => p.trim().length > 0)?.trim() ?? '';
  if (firstPara.length <= max) return firstPara;
  return firstPara.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
  featured?: boolean;
  /** Kebab-case series slug (e.g. "aws-lambda-mastery"). Omit for standalone posts. */
  series?: string;
  /** 1-indexed position within the series. Used for prev/next + the /series/[slug] order. */
  seriesOrder?: number;
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  /** Visual size variant for bento layouts. */
  variant?: 'hero' | 'standard';
  /** Optional href override (defaults to `/blog/<slug>`). */
  href?: string;
}

export default function BlogCard({
  post,
  featured = false,
  variant = 'standard',
  href,
}: BlogCardProps) {
  const postDate = new Date(post.date);
  const isAWS = post.tags.some((t) => t.toLowerCase() === 'aws');
  const grad = gradientFromSlug(post.slug);
  const isHero = variant === 'hero';
  const linkHref = href ?? `/blog/${post.slug}`;

  return (
    <Spotlight
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-secondary-200/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Cover with abstract gradient */}
      <div
        className={`relative w-full overflow-hidden ${
          isHero ? 'h-40 sm:h-44' : 'h-32'
        }`}
        style={{ background: grad.css }}
      >
        {/* Subtle grid + radial overlay */}
        <div className="cover-pattern" />

        {/* Floating glyph */}
        <svg
          className="absolute -right-6 -bottom-6 h-32 w-32 text-white/15"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="1.5" />
          <path d="M20 100 L180 100" stroke="currentColor" strokeWidth="1" />
          <path d="M100 20 L100 180" stroke="currentColor" strokeWidth="1" />
        </svg>

        {/* AWS chip on cover */}
        {isAWS && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm ring-1 ring-white/20">
            <span className="h-1.5 w-1.5 rounded-full bg-aws-smile" />
            AWS
          </span>
        )}

        {featured && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-aws-smile px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-900 shadow-glow-amber">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Featured
          </span>
        )}

        {/* Reading time pill on cover bottom */}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm ring-1 ring-white/15">
          <ClockIcon className="h-3 w-3" />
          {post.readTime}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-x-3 text-xs text-secondary-500 dark:text-secondary-400">
          <span className="inline-flex items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            <time dateTime={post.date}>{format(postDate, 'MMM dd, yyyy')}</time>
          </span>
          <span className="h-1 w-1 rounded-full bg-secondary-300 dark:bg-secondary-600" />
          <span className="inline-flex items-center gap-1">
            <UserIcon className="h-3.5 w-3.5" />
            {post.author}
          </span>
        </div>

        <h3
          className={`font-semibold leading-snug text-secondary-900 dark:text-white transition-colors duration-200 group-hover:text-primary-700 dark:group-hover:text-primary-300 ${
            isHero ? 'text-2xl sm:text-3xl' : 'text-lg'
          }`}
        >
          <Link href={linkHref}>
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </h3>

        <p
          className={`mt-3 leading-relaxed text-secondary-600 dark:text-secondary-300 ${
            isHero ? 'text-base sm:text-lg line-clamp-4' : 'text-sm line-clamp-3'
          }`}
        >
          {post.excerpt}
        </p>

        {isHero && post.content && (
          <p className="mt-4 text-sm leading-relaxed text-secondary-500 dark:text-secondary-400 line-clamp-4 border-l-2 border-primary-500/40 dark:border-primary-400/30 pl-4">
            {previewFromContent(post.content)}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="primary" size="sm">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="default" size="sm">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-700 dark:text-primary-300 group-hover:text-primary-800 dark:group-hover:text-primary-200">
            Read
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Spotlight>
  );
}
