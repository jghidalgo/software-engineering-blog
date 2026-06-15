import BlogCard, { BlogPost } from './BlogCard';
import Reveal from './Reveal';

// Real featured posts with valuable AWS and software engineering content
const featuredPosts: BlogPost[] = [
  {
    slug: 'aws-lambda-console-ide-remote-debugging',
    title: 'Accelerating Local Serverless Development with Console-to-IDE and Remote Debugging for AWS Lambda',
    excerpt: 'AWS has introduced a game-changer: Console-to-IDE integration with Remote Debugging for AWS Lambda. Learn how to debug Lambda functions in real-time with breakpoints, variable inspection, and local test events.',
    content: '',
    date: '2025-09-12',
    author: 'DevBlog',
    tags: ['AWS', 'Lambda', 'Serverless', 'Debugging', 'IDE', 'Development'],
    readTime: '6 min read',
    featured: true,
  },
  {
    slug: 'aws-lambda-best-practices',
    title: 'AWS Lambda Best Practices: Building Serverless Applications',
    excerpt: 'Learn the essential best practices for building efficient, scalable, and maintainable serverless applications with AWS Lambda. From cold start optimization to error handling and security.',
    content: '',
    date: '2025-09-14',
    author: 'DevBlog',
    tags: ['AWS', 'Lambda', 'Serverless', 'Best Practices', 'Performance'],
    readTime: '8 min read',
    featured: true,
  },
  {
    slug: 'aws-infrastructure-as-code',
    title: 'Infrastructure as Code with AWS CDK: A Complete Guide',
    excerpt: 'Discover how to manage your AWS infrastructure using the AWS CDK and TypeScript for better maintainability, version control, and type safety in your infrastructure code.',
    content: '',
    date: '2025-09-14',
    author: 'DevBlog',
    tags: ['AWS', 'CDK', 'Infrastructure', 'TypeScript', 'DevOps'],
    readTime: '10 min read',
    featured: true,
  },
  {
    slug: 'aws-api-gateway-patterns',
    title: 'AWS API Gateway Patterns and Best Practices',
    excerpt: 'Learn how to design robust APIs using AWS API Gateway with proper authentication, rate limiting, monitoring, and advanced patterns for production-ready applications.',
    content: '',
    date: '2025-09-14',
    author: 'DevBlog',
    tags: ['AWS', 'API Gateway', 'REST', 'Serverless', 'Architecture'],
    readTime: '11 min read',
    featured: true,
  },
  {
    slug: 'typescript-advanced-patterns',
    title: 'Advanced TypeScript Patterns for Better Code',
    excerpt: 'Explore advanced TypeScript patterns and techniques that will help you write more maintainable and type-safe applications with real-world examples.',
    content: '',
    date: '2025-01-08',
    author: 'DevBlog',
    tags: ['TypeScript', 'JavaScript', 'Patterns'],
    readTime: '12 min read',
  },
  {
    slug: 'react-performance-optimization',
    title: 'React Performance Optimization Techniques',
    excerpt: 'Learn proven techniques to optimize your React applications for better performance and user experience including memoization, code splitting, and more.',
    content: '',
    date: '2025-01-03',
    author: 'DevBlog',
    tags: ['React', 'Performance', 'Optimization'],
    readTime: '15 min read',
  },
];

interface FeaturedPostsProps {
  readonly limit?: number;
}

// Bento placement classes for the first 6 posts
const BENTO_SLOTS = [
  'lg:col-span-2 lg:row-span-2', // hero — large
  'lg:col-span-1',                // top right
  'lg:col-span-1',                // mid right
  'lg:col-span-1',                // bottom row
  'lg:col-span-1',                // bottom row
  'lg:col-span-1',                // bottom row
];

export default function FeaturedPosts({ limit = 6 }: FeaturedPostsProps) {
  const posts = limit ? featuredPosts.slice(0, limit) : featuredPosts;

  return (
    <section className="relative py-24 sm:py-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-secondary-100/60 to-transparent dark:from-white/[0.02]" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal as="div" className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-3 py-1 text-xs font-medium text-secondary-700 dark:text-secondary-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            Featured this week
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-4xl">
            Latest from the <span className="text-gradient">cloud</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-secondary-600 dark:text-secondary-300">
            Hand-picked deep dives into AWS services, architecture patterns, and the
            engineering decisions that make production systems tick.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:auto-rows-fr lg:gap-7">
          {posts.map((post, index) => {
            const slot = BENTO_SLOTS[index] ?? 'lg:col-span-1';
            const isHero = index === 0;
            return (
              <Reveal
                key={post.slug}
                delay={Math.min(index * 80, 320)}
                className={`h-full ${slot}`}
              >
                <BlogCard post={post} featured={isHero} variant={isHero ? 'hero' : 'standard'} />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
