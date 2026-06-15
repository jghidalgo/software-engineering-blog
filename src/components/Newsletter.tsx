'use client';

import { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Reveal from './Reveal';

interface SubscriptionResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    subscribedAt: string;
  };
}

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email address is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data: SubscriptionResponse = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setEmail('');
        
        // Reset the success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setError(data.message || 'An error occurred while subscribing');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="relative isolate overflow-hidden rounded-3xl border border-secondary-200/60 dark:border-white/10 bg-gradient-to-br from-secondary-900 via-aws-ink to-secondary-900 px-6 py-16 sm:px-12 sm:py-20 shadow-card-hover">
          {/* Decorative mesh & grid inside card */}
          <div className="absolute inset-0 -z-10 bg-mesh opacity-30" />
          <div className="absolute inset-0 -z-10 bg-grid opacity-40" />
          <div className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-aws-smile/20 blur-3xl float-slow" />
          <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl float-slow [animation-delay:2s]" />

          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
              <EnvelopeIcon className="h-7 w-7 text-aws-smile" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              The AWS Mindset, in your inbox
            </h2>
            <p className="mt-4 text-base leading-relaxed text-secondary-300">
              One email a week: notable AWS releases, sharp architecture patterns, and the
              behind-the-scenes notes you won&apos;t find in the docs.
            </p>

            {isSubmitted ? (
              <div className="mx-auto mt-8 max-w-md rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 backdrop-blur">
                <p className="text-sm font-medium text-emerald-200">
                  Subscribed. The next issue lands in your inbox soon.
                </p>
              </div>
            ) : (
              <div className="mx-auto mt-8 max-w-md">
                {error && (
                  <div className="mb-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200 backdrop-blur">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-stretch gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="you@company.com"
                    required
                    disabled={isLoading}
                    className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-secondary-400 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-aws-smile px-5 py-2.5 text-sm font-semibold text-secondary-900 shadow-glow-amber transition-all duration-200 hover:bg-aws-smile-soft disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="-ml-1 h-4 w-4 animate-spin text-secondary-900" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Subscribing
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </form>
              </div>
            )}

            <p className="mt-4 text-xs text-secondary-400">
              No spam. Unsubscribe in one click.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
