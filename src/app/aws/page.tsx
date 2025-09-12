import { Metadata } from 'next';
import { CloudIcon, CpuChipIcon, ServerIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import BlogCard, { BlogPost } from '@/components/BlogCard';

export const metadata: Metadata = {
  title: 'AWS Content - DevBlog',
  description: 'Comprehensive guides, tutorials, and best practices for AWS cloud technologies.',
};

const awsPosts: BlogPost[] = [
  {
    slug: 'aws-lambda-best-practices',
    title: 'AWS Lambda Best Practices: Building Serverless Applications',
    excerpt: 'Learn the essential best practices for building efficient, scalable, and maintainable serverless applications with AWS Lambda. From cold start optimization to error handling.',
    content: '',
    date: '2025-01-10',
    author: 'DevBlog',
    tags: ['AWS', 'Lambda', 'Serverless', 'Best Practices'],
    readTime: '8 min read',
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
    slug: 'aws-security-best-practices',
    title: 'AWS Security Best Practices: A Comprehensive Guide',
    excerpt: 'Essential security practices for AWS environments, including IAM, VPC configuration, encryption, and monitoring.',
    content: '',
    date: '2024-12-20',
    author: 'DevBlog',
    tags: ['AWS', 'Security', 'IAM', 'Best Practices'],
    readTime: '16 min read',
  },
  {
    slug: 'aws-cost-optimization',
    title: 'AWS Cost Optimization Strategies',
    excerpt: 'Learn how to optimize your AWS costs without compromising performance using reserved instances, spot instances, and monitoring tools.',
    content: '',
    date: '2024-12-15',
    author: 'DevBlog',
    tags: ['AWS', 'Cost Optimization', 'FinOps', 'Cloud Economics'],
    readTime: '13 min read',
  },
];

const awsServices = [
  {
    name: 'Compute',
    description: 'EC2, Lambda, ECS, Fargate',
    icon: CpuChipIcon,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    name: 'Storage',
    description: 'S3, EBS, EFS, Glacier',
    icon: ServerIcon,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    name: 'Serverless',
    description: 'Lambda, API Gateway, DynamoDB',
    icon: CloudIcon,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    name: 'Security',
    description: 'IAM, VPC, CloudTrail, GuardDuty',
    icon: ShieldCheckIcon,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
];

export default function AWSPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="flex justify-center mb-6">
            <CloudIcon className="h-16 w-16 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-5xl">
            AWS Content
          </h1>
          <p className="mt-4 text-lg leading-8 text-secondary-600 dark:text-secondary-300">
            Comprehensive guides, tutorials, and best practices for AWS cloud technologies
          </p>
        </div>

        {/* AWS Services Overview */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 text-center">
            AWS Services We Cover
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {awsServices.map((service) => (
              <div key={service.name} className="relative group">
                <div className={`${service.bgColor} rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200`}>
                  <service.icon className={`h-8 w-8 mx-auto mb-4 ${service.color}`} />
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-300">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AWS Articles */}
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 text-center">
            Latest AWS Articles
          </h2>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {awsPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
