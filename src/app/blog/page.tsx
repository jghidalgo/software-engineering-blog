import { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog - AWSMindset',
  description:
    'Explore the latest articles on AWS services, cloud architecture, and modern software engineering.',
};

// ISR — re-fetch Airtable at most once a minute
export const revalidate = 60;

export default async function BlogPage() {
  // /blog shows hardcoded posts + AI articles sourced from the AWS Blogs feed.
  // AWS announcement-style posts live on /aws.
  const posts = await getAllPosts({ source: 'aws-blogs' });

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
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} href={post.href} />
          ))}
        </div>
      </div>
    </div>
  );
}
