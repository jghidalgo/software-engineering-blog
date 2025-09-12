import { Metadata } from 'next';
import BlogCard, { BlogPost } from '@/components/BlogCard';

export const metadata: Metadata = {
  title: 'Blog - DevBlog',
  description: 'Explore our latest articles on software engineering, AWS, and modern development practices.',
};

// Mock data - in a real app, this would come from a database or CMS
const allPosts: BlogPost[] = [
  {
    slug: 'aws-lambda-best-practices',
    title: 'AWS Lambda Best Practices: Building Serverless Applications',
    excerpt: 'Learn the essential best practices for building efficient, scalable, and maintainable serverless applications with AWS Lambda. From cold start optimization to error handling.',
    content: '',
    date: '2025-01-10',
    author: 'DevBlog',
    tags: ['AWS', 'Lambda', 'Serverless', 'Best Practices'],
    readTime: '8 min read',
    featured: true,
  },
  {
    slug: 'typescript-advanced-patterns',
    title: 'Advanced TypeScript Patterns for Better Code',
    excerpt: 'Explore advanced TypeScript patterns and techniques that will help you write more maintainable and type-safe applications.',
    content: '',
    date: '2025-01-08',
    author: 'DevBlog',
    tags: ['TypeScript', 'JavaScript', 'Patterns'],
    readTime: '12 min read',
  },
  {
    slug: 'aws-infrastructure-as-code',
    title: 'Infrastructure as Code with AWS CDK',
    excerpt: 'Discover how to manage your AWS infrastructure using the AWS CDK and TypeScript for better maintainability and version control.',
    content: '',
    date: '2025-01-05',
    author: 'DevBlog',
    tags: ['AWS', 'CDK', 'Infrastructure', 'TypeScript'],
    readTime: '10 min read',
  },
  {
    slug: 'react-performance-optimization',
    title: 'React Performance Optimization Techniques',
    excerpt: 'Learn proven techniques to optimize your React applications for better performance and user experience.',
    content: '',
    date: '2025-01-03',
    author: 'DevBlog',
    tags: ['React', 'Performance', 'Optimization'],
    readTime: '15 min read',
  },
  {
    slug: 'microservices-architecture-aws',
    title: 'Building Microservices Architecture on AWS',
    excerpt: 'A comprehensive guide to designing and implementing microservices architecture using AWS services like ECS, API Gateway, and RDS.',
    content: '',
    date: '2025-01-01',
    author: 'DevBlog',
    tags: ['AWS', 'Microservices', 'Architecture', 'ECS'],
    readTime: '18 min read',
  },
  {
    slug: 'nextjs-13-app-directory',
    title: 'Getting Started with Next.js 13 App Directory',
    excerpt: 'Explore the new app directory structure in Next.js 13 and how it improves developer experience and application performance.',
    content: '',
    date: '2024-12-28',
    author: 'DevBlog',
    tags: ['Next.js', 'React', 'Web Development'],
    readTime: '7 min read',
  },
  {
    slug: 'aws-api-gateway-patterns',
    title: 'AWS API Gateway Patterns and Best Practices',
    excerpt: 'Learn how to design robust APIs using AWS API Gateway with proper authentication, rate limiting, and monitoring.',
    content: '',
    date: '2024-12-25',
    author: 'DevBlog',
    tags: ['AWS', 'API Gateway', 'REST', 'Serverless'],
    readTime: '11 min read',
  },
  {
    slug: 'docker-containerization-guide',
    title: 'Complete Guide to Docker Containerization',
    excerpt: 'Master Docker containerization from basics to advanced techniques for modern application deployment.',
    content: '',
    date: '2024-12-22',
    author: 'DevBlog',
    tags: ['Docker', 'Containerization', 'DevOps'],
    readTime: '14 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-lg leading-8 text-secondary-600 dark:text-secondary-300">
            Insights, tutorials, and best practices for modern software development
          </p>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {allPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
