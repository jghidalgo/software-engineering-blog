import { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';
import Reveal from '@/components/Reveal';
import { getAllPosts } from '@/lib/posts';
import {
  AwsSmileLogo,
  LambdaIcon,
  EC2Icon,
  S3Icon,
  DynamoDBIcon,
  IAMIcon,
  VPCIcon,
  ApiGatewayIcon,
  CloudWatchIcon,
} from '@/components/aws-icons';

export const metadata: Metadata = {
  title: 'AWS Content - AWSMindset',
  description: 'Comprehensive guides, tutorials, and best practices for AWS cloud technologies.',
};

// ISR — re-fetch Airtable at most once a minute
export const revalidate = 60;

const awsServices = [
  { name: 'Lambda',       category: 'Compute',     desc: 'Run code without managing servers', Icon: LambdaIcon },
  { name: 'EC2',          category: 'Compute',     desc: 'Virtual servers in the cloud',      Icon: EC2Icon },
  { name: 'S3',           category: 'Storage',     desc: 'Scalable object storage',           Icon: S3Icon },
  { name: 'DynamoDB',     category: 'Database',    desc: 'Managed NoSQL at any scale',        Icon: DynamoDBIcon },
  { name: 'API Gateway',  category: 'Networking',  desc: 'Create, deploy and manage APIs',    Icon: ApiGatewayIcon },
  { name: 'VPC',          category: 'Networking',  desc: 'Isolated cloud networks',           Icon: VPCIcon },
  { name: 'IAM',          category: 'Security',    desc: 'Identity & access management',      Icon: IAMIcon },
  { name: 'CloudWatch',   category: 'Management',  desc: 'Observability & telemetry',         Icon: CloudWatchIcon },
];

export default async function AWSPage() {
  const awsPosts = await getAllPosts({ tag: 'AWS' });
  return (
    <div className="relative overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 -z-20 bg-mesh opacity-80 dark:opacity-60" />
      <div className="absolute inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[460px] w-[800px] -translate-x-1/2 rounded-full bg-aws-smile/20 blur-3xl dark:bg-aws-smile/10" />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-8">
        {/* Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <AwsSmileLogo className="h-16 w-auto text-secondary-900 dark:text-white" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-3 py-1 text-xs font-medium text-secondary-700 dark:text-secondary-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-aws-smile" />
            Field journal on Amazon Web Services
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-5xl">
            Built for <span className="text-gradient">the cloud</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-secondary-600 dark:text-secondary-300">
            Hands-on guides, architecture patterns, and real-world lessons across the
            AWS services that power modern production systems.
          </p>
        </Reveal>

        {/* Services overview */}
        <Reveal className="mt-20" delay={100}>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-aws-smile">
                Services covered
              </p>
              <h2 className="mt-1 text-2xl font-bold text-secondary-900 dark:text-white sm:text-3xl">
                AWS, end to end
              </h2>
            </div>
            <p className="hidden max-w-sm text-sm text-secondary-500 dark:text-secondary-400 sm:block">
              From the compute layer to identity, networking, and observability — the
              services I write about most.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {awsServices.map((service, i) => (
              <Reveal
                key={service.name}
                delay={Math.min(i * 60, 360)}
                className="group relative overflow-hidden rounded-2xl border border-secondary-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] p-5 backdrop-blur-sm shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex items-start gap-3">
                  <service.Icon className="h-12 w-12 shrink-0 drop-shadow-sm transition-transform duration-300 group-hover:scale-110" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                      {service.category}
                    </p>
                    <p className="text-base font-semibold text-secondary-900 dark:text-white">
                      {service.name}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-secondary-600 dark:text-secondary-300">
                  {service.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* Articles */}
        <Reveal className="mt-24" delay={100}>
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-aws-smile">
              Reading list
            </p>
            <h2 className="mt-1 text-2xl font-bold text-secondary-900 dark:text-white sm:text-3xl">
              Latest AWS articles
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {awsPosts.map((post, i) => (
              <Reveal
                key={post.slug}
                delay={Math.min(i * 70, 350)}
                className="h-full"
              >
                <BlogCard post={post} href={post.href} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
