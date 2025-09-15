import BlogCard, { BlogPost } from './BlogCard';

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

export default function FeaturedPosts({ limit = 6 }: FeaturedPostsProps) {
  const posts = limit ? featuredPosts.slice(0, limit) : featuredPosts;

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-4xl">
            Featured Articles
          </h2>
          <p className="mt-4 text-lg leading-8 text-secondary-700 dark:text-secondary-200">
            Explore our latest insights on software engineering and AWS cloud technologies
          </p>
        </div>
        
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post, index) => (
            <BlogCard
              key={post.slug}
              post={post}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
