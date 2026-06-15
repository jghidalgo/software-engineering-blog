'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { CloudIcon, BookOpenIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import ThemeToggle from './ThemeToggle';

const navigation = [
  { name: 'Home', href: '/', icon: BookOpenIcon },
  { name: 'Blog', href: '/blog', icon: CodeBracketIcon },
  { name: 'AWS', href: '/aws', icon: CloudIcon },
  { name: 'About', href: '/about', icon: null },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong shadow-[0_10px_30px_-12px_rgba(2,6,23,0.25)]'
          : 'bg-white/40 dark:bg-[#060a14]/40 backdrop-blur-md'
      } border-b border-secondary-200/60 dark:border-white/5`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/Logo.png"
              alt="AWSMindset"
              width={40}
              height={40}
              priority
              className="h-9 w-9 object-contain transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-tight text-secondary-900 dark:text-white">
                AWS<span className="text-gradient">Mindset</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-secondary-500 dark:text-secondary-400">
                Cloud · Engineering
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 rounded-full border border-secondary-200/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] px-1.5 py-1 backdrop-blur">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-glow bg-gradient-to-br from-primary-600 to-primary-700'
                      : 'text-secondary-700 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100/70 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {item.icon && <item.icon className="h-3.5 w-3.5" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-2 rounded-full bg-aws-ink dark:bg-white text-white dark:text-secondary-900 px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-glow-amber transition-all duration-200"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-aws-smile group-hover:scale-125 transition-transform" />
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-white/5"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-secondary-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-xs glass-strong p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/Logo.png"
                  alt="AWSMindset"
                  width={40}
                  height={40}
                  className="h-9 w-9 object-contain"
                />
                <span className="text-base font-semibold text-secondary-900 dark:text-white">
                  AWS<span className="text-gradient">Mindset</span>
                </span>
              </Link>
              <button
                type="button"
                className="rounded-md p-2 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-8 space-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-glow'
                        : 'text-secondary-700 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-white/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <Link
                href="/contact"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-aws-ink dark:bg-white text-white dark:text-secondary-900 px-4 py-2.5 text-sm font-semibold shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-aws-smile" />
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

