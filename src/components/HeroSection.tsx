import Link from 'next/link';
import {
  ArrowRightIcon,
  CloudIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  BoltIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import Reveal from './Reveal';
import Spotlight from './Spotlight';

const stats = [
  { label: 'AWS Services covered', value: '40+' },
  { label: 'Deep-dive articles', value: '120+' },
  { label: 'Updated', value: 'Weekly' },
];

const pills = [
  { label: 'Lambda', icon: BoltIcon },
  { label: 'API Gateway', icon: ServerStackIcon },
  { label: 'IAM', icon: ShieldCheckIcon },
  { label: 'CDK', icon: SparklesIcon },
];

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Backdrops */}
      <div className="absolute inset-0 -z-20 bg-mesh opacity-90 dark:opacity-70" />
      <div className="absolute inset-0 -z-10 bg-grid" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[460px] w-[800px] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl dark:bg-primary-500/15" />
      <div className="pointer-events-none absolute -bottom-32 right-10 -z-10 h-[360px] w-[520px] rounded-full bg-aws-smile/20 blur-3xl dark:bg-aws-smile/10 float-slow" />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Copy column */}
          <Reveal className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-3 py-1 text-xs font-medium text-secondary-700 dark:text-secondary-300 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aws-smile opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-aws-smile" />
              </span>
              Latest AWS news, patterns &amp; deep dives
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-secondary-900 dark:text-white sm:text-5xl lg:text-6xl">
              Build sharper{' '}
              <span className="text-gradient">on AWS</span>
              <span className="block text-secondary-700 dark:text-secondary-300 text-3xl sm:text-4xl lg:text-5xl mt-2 font-semibold">
                Cloud news. Real-world solutions.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-secondary-600 dark:text-secondary-300">
              A personal field journal on Amazon Web Services — fresh service launches,
              production-ready architectures, and the engineering trade-offs behind them.
              No fluff, just patterns that ship.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 px-6 py-3 text-sm font-semibold text-white shadow-glow hover:from-primary-500 hover:to-primary-700 transition-all duration-200"
              >
                Explore articles
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/aws"
                className="group inline-flex items-center gap-2 rounded-full border border-secondary-300/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-6 py-3 text-sm font-semibold text-secondary-800 dark:text-secondary-100 backdrop-blur hover:bg-white dark:hover:bg-white/[0.08] transition-all duration-200"
              >
                <CloudIcon className="h-4 w-4 text-aws-smile" />
                AWS content
              </Link>
            </div>

            {/* Tag pills */}
            <div className="mt-10 flex flex-wrap gap-2">
              {pills.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-3 py-1 text-xs font-medium text-secondary-700 dark:text-secondary-300 backdrop-blur"
                >
                  <Icon className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                  {label}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Visual column */}
          <Reveal className="lg:col-span-5" delay={200}>
            <div className="relative mx-auto max-w-md">
              {/* Floating card #1 (spotlight) */}
              <Spotlight
                className="relative rounded-2xl glass-strong p-6 shadow-card-hover"
                color="rgba(56, 189, 248, 0.22)"
                size={460}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-glow">
                    <CloudIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-aws-smile">
                      AWS re:Invent recap
                    </p>
                    <p className="text-sm font-semibold text-secondary-900 dark:text-white">
                      What landed for builders
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-secondary-200/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] p-3"
                    >
                      <p className="text-lg font-bold text-secondary-900 dark:text-white">
                        {s.value}
                      </p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-secondary-500 dark:text-secondary-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Live · updated weekly
                  </span>
                  <span className="font-mono text-secondary-600 dark:text-secondary-300">us-east-1</span>
                </div>
              </Spotlight>

              {/* Floating card #2 — subtle, behind */}
              <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-2xl glass p-4 shadow-card -rotate-3 float-slow">
                <div className="flex items-center gap-2">
                  <BoltIcon className="h-4 w-4 text-aws-smile" />
                  <span className="text-xs font-semibold text-secondary-800 dark:text-secondary-200">
                    Lambda · cold start &lt; 100ms
                  </span>
                </div>
              </div>

              {/* Floating card #3 */}
              <div className="absolute -top-5 -right-5 hidden sm:block rounded-2xl glass p-3 shadow-card rotate-3 float-slow [animation-delay:1.5s]">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-secondary-800 dark:text-secondary-200">
                    IAM least-privilege
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
