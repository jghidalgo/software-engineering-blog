'use client';

import { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your newsletter service
    console.log('Newsletter signup:', email);
    setIsSubmitted(true);
    setEmail('');
    
    // Reset the success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="bg-primary-50 dark:bg-secondary-800/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/20">
              <EnvelopeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-4xl">
            Stay Updated
          </h2>
          <p className="mt-4 text-lg leading-8 text-secondary-700 dark:text-secondary-200">
            Get the latest articles on software engineering and AWS delivered directly to your inbox. 
            No spam, just quality content.
          </p>
          
          {isSubmitted ? (
            <div className="mt-8 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200">
                Thanks for subscribing! You&apos;ll receive our latest updates soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 min-w-0 px-4 py-3 text-base text-secondary-900 placeholder-secondary-500 bg-white border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-700 dark:border-secondary-600 dark:text-white dark:placeholder-secondary-400 dark:focus:ring-primary-400 dark:focus:border-primary-400"
              />
              <button
                type="submit"
                className="px-6 py-3 text-base font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-secondary-800 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          )}
          
          <p className="mt-4 text-xs text-secondary-500 dark:text-secondary-400">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
