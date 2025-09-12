import Link from 'next/link';
import { ArrowRightIcon, CodeBracketIcon, CloudIcon, CpuChipIcon } from '@heroicons/react/24/outline';

export default function HeroSection() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-400 to-accent-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4 text-primary-600 dark:text-primary-400">
              <CodeBracketIcon className="h-12 w-12" />
              <CloudIcon className="h-12 w-12" />
              <CpuChipIcon className="h-12 w-12" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-6xl">
            Software Engineering &{' '}
            <span style={{ color: '#8c5b08' }}>
              AWS
            </span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-secondary-700 dark:text-secondary-200 max-w-2xl mx-auto">
            Welcome to my technical blog where I share insights, tutorials, and best practices about software engineering, 
            with a special focus on AWS cloud technologies and modern development practices.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all duration-200"
            >
              Explore Articles
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <Link
              href="/aws"
              className="inline-flex items-center gap-2 text-sm font-semibold leading-6 transition-colors duration-200"
              style={{ color: '#8c5b08' }}
            >
              AWS Content
              <CloudIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-accent-400 to-primary-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  );
}
