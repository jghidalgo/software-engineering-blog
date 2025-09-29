import Link from 'next/link';
import { CodeBracketIcon } from '@heroicons/react/24/solid';

interface IconProps {
  className?: string;
}

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'AWS', href: '/aws' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  social: [
    {
      name: 'X (Twitter)',
      href: 'https://x.com/Joan57002536',
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com/jghidalgo',
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/joan-rodriguez-hidalgo-56a2a',
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'Dev.to',
      href: 'https://dev.to/jghidalgo',
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45c.56-.02.82-.13 1.14-.42.32-.29.5-.66.5-1.11s-.18-.84-.5-1.13c-.32-.29-.78-.42-1.14-.42-.18 0-.37.07-.55.23zm12.39 4.13c-.18-.16-.46-.23-.84-.23h-.58l.02 2.44.04 2.45c.56-.02.82-.13 1.14-.42.32-.29.5-.66.5-1.11s-.18-.84-.5-1.13c-.32-.29-.78-.42-1.14-.42-.18 0-.37.07-.55.23zM24 12.02c0 6.628-5.373 12-12 12S0 18.648 0 12.02C0 5.394 5.373.02 12 .02s12 5.374 12 11.98zm-5.39-.645c.57.124.84.457.84 1.011 0 .337-.211.750-.498.993-.287.244-.707.414-1.26.414-.553 0-.97-.17-1.257-.414-.287-.244-.498-.656-.498-.993 0-.337.211-.75.498-.993.287-.244.707-.414 1.26-.414.553 0 .97.17 1.257.414.287.244.498.656.498.993zm-.84-1.011c-.57-.124-.84-.457-.84-1.011 0-.337.211-.75.498-.993.287-.244.707-.414 1.26-.414.553 0 .97.17 1.257.414.287.244.498.656.498.993 0 .337-.211.75-.498.993-.287.244-.707.414-1.26.414-.553 0-.97-.17-1.257-.414z"/>
        </svg>
      ),
    },
    {
      name: 'Blog',
      href: 'https://awsmindset.com/',
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary-800 to-primary-900 dark:bg-gradient-to-r dark:from-primary-900 dark:to-secondary-900 border-t border-primary-700 dark:border-secondary-700">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-primary-600">
              <CodeBracketIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              DevBlog
            </span>
          </Link>
        </div>
        
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <Link
                href={item.href}
                className="text-sm leading-6 text-primary-100 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        
        <div className="mt-10 flex justify-center space-x-10">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-primary-200 hover:text-white transition-colors duration-200"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        
        <div className="mt-10 border-t border-primary-600 pt-8">
          <div className="text-center">
            <p className="text-xs leading-5 text-primary-100">
              &copy; 2025 DevBlog. All rights reserved. Built with Next.js and Tailwind CSS.
            </p>
            <p className="mt-2 text-xs leading-5 text-primary-200">
              Sharing knowledge about software engineering and AWS cloud technologies.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
