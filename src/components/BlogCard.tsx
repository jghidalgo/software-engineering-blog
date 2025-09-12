import Link from 'next/link';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Badge from './ui/Badge';

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
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const postDate = new Date(post.date);

  return (
    <article className={`group relative bg-gradient-to-br from-primary-50 to-primary-100 dark:bg-gradient-to-br dark:from-primary-900/20 dark:to-primary-800/10 rounded-xl border border-primary-200 dark:border-primary-700/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${featured ? 'lg:col-span-2' : ''}`}>
      <div className="p-6">
        <div className="flex items-center gap-x-4 text-xs mb-4">
          <div className="flex items-center gap-1 text-secondary-600 dark:text-secondary-300">
            <CalendarIcon className="h-4 w-4" />
            <time dateTime={post.date}>
              {format(postDate, 'MMM dd, yyyy')}
            </time>
          </div>
          <div className="flex items-center gap-1 text-secondary-600 dark:text-secondary-300">
            <ClockIcon className="h-4 w-4" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-1 text-secondary-600 dark:text-secondary-300">
            <UserIcon className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
        </div>

        <div className="group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
          <h3 className={`font-semibold leading-6 text-secondary-900 dark:text-white mb-3 ${featured ? 'text-xl' : 'text-lg'}`}>
            <Link href={`/blog/${post.slug}`}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h3>
          <p className="text-sm leading-6 text-secondary-700 dark:text-secondary-200 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="primary" size="sm">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="default" size="sm">
                +{post.tags.length - 3} more
              </Badge>
            )}
          </div>
          
          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
          >
            Read more →
          </Link>
        </div>
      </div>

      {featured && (
        <div className="absolute top-4 right-4">
          <Badge variant="warning" size="sm">
            Featured
          </Badge>
        </div>
      )}
    </article>
  );
}
