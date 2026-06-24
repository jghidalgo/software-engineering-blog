'use client';

import { useCallback, useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  HomeIcon,
  CodeBracketIcon,
  CloudIcon,
  CpuChipIcon,
  EnvelopeIcon,
  UserCircleIcon,
  DocumentTextIcon,
  ListBulletIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import { applyTheme } from '@/lib/theme';

interface SearchPost {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  href: string;
  source: string;
  category: string;
}

const NAV_ITEMS = [
  { label: 'Home', href: '/', Icon: HomeIcon },
  { label: 'Blog (AWS Blogs)', href: '/blog', Icon: CodeBracketIcon },
  { label: 'AWS (What’s New)', href: '/aws', Icon: CloudIcon },
  { label: 'Engineering: At Scale', href: '/engineering?category=at-scale', Icon: CpuChipIcon },
  { label: 'Engineering: Web Platform', href: '/engineering?category=web-platform', Icon: CpuChipIcon },
  { label: 'Engineering: Industry', href: '/engineering?category=industry', Icon: CpuChipIcon },
  { label: 'Series (reading paths)', href: '/series', Icon: ListBulletIcon },
  { label: 'About', href: '/about', Icon: UserCircleIcon },
  { label: 'Contact', href: '/contact', Icon: EnvelopeIcon },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Global keyboard shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Fetch the search index lazily on first open
  useEffect(() => {
    if (!open || loaded || loading) return;
    setLoading(true);
    fetch('/api/search')
      .then((r) => r.json())
      .then((data: { posts: SearchPost[] }) => {
        setPosts(data.posts ?? []);
        setLoaded(true);
      })
      .catch((err) => console.error('[palette] search index failed:', err))
      .finally(() => setLoading(false));
  }, [open, loaded, loading]);

  // Listen for "open palette" events fired by the Header button
  useEffect(() => {
    const onOpen = () => setOpen(true);
    document.addEventListener('open-command-palette', onOpen);
    return () => document.removeEventListener('open-command-palette', onOpen);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  const setTheme = useCallback((mode: 'light' | 'dark' | 'system') => {
    applyTheme(mode);
    setOpen(false);
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Search and navigate"
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh] data-[state=closed]:hidden"
      overlayClassName="fixed inset-0 z-[99] bg-secondary-950/70 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-secondary-200/70 dark:border-white/10 bg-white dark:bg-[#0b1220] shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-secondary-200/60 dark:border-white/10 px-4">
          <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-secondary-400" />
          <Command.Input
            placeholder="Search articles, jump to a page…"
            className="w-full bg-transparent py-4 text-base text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex shrink-0 items-center rounded border border-secondary-200/70 dark:border-white/10 bg-secondary-50 dark:bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-secondary-500 dark:text-secondary-400">
            esc
          </kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="px-4 py-8 text-center text-sm text-secondary-500 dark:text-secondary-400">
            {loading ? 'Loading…' : 'No results.'}
          </Command.Empty>

          {/* Pages */}
          <Command.Group
            heading="Pages"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-500 dark:text-secondary-400 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
          >
            {NAV_ITEMS.map(({ label, href, Icon }) => (
              <Command.Item
                key={href}
                value={`page ${label}`}
                onSelect={() => navigate(href)}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-secondary-700 dark:text-secondary-200 data-[selected=true]:bg-primary-50 dark:data-[selected=true]:bg-primary-500/10 data-[selected=true]:text-primary-700 dark:data-[selected=true]:text-primary-300"
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{label}</span>
                <span className="text-xs text-secondary-400">{href}</span>
              </Command.Item>
            ))}
          </Command.Group>

          {/* Theme actions */}
          <Command.Group
            heading="Theme"
            className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-secondary-500 dark:text-secondary-400 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
          >
            <Command.Item
              value="theme light"
              onSelect={() => setTheme('light')}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-secondary-700 dark:text-secondary-200 data-[selected=true]:bg-primary-50 dark:data-[selected=true]:bg-primary-500/10"
            >
              <SunIcon className="h-4 w-4" />
              Switch to light mode
            </Command.Item>
            <Command.Item
              value="theme dark"
              onSelect={() => setTheme('dark')}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-secondary-700 dark:text-secondary-200 data-[selected=true]:bg-primary-50 dark:data-[selected=true]:bg-primary-500/10"
            >
              <MoonIcon className="h-4 w-4" />
              Switch to dark mode
            </Command.Item>
            <Command.Item
              value="theme system"
              onSelect={() => setTheme('system')}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-secondary-700 dark:text-secondary-200 data-[selected=true]:bg-primary-50 dark:data-[selected=true]:bg-primary-500/10"
            >
              <ComputerDesktopIcon className="h-4 w-4" />
              Match system theme
            </Command.Item>
          </Command.Group>

          {/* Articles */}
          {posts.length > 0 && (
            <Command.Group
              heading={`Articles (${posts.length})`}
              className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-secondary-500 dark:text-secondary-400 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
            >
              {posts.map((post) => (
                <Command.Item
                  key={post.href}
                  value={`${post.title} ${post.excerpt} ${post.tags.join(' ')}`}
                  onSelect={() => navigate(post.href)}
                  className="flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm text-secondary-700 dark:text-secondary-200 data-[selected=true]:bg-primary-50 dark:data-[selected=true]:bg-primary-500/10 data-[selected=true]:text-primary-700 dark:data-[selected=true]:text-primary-300"
                >
                  <DocumentTextIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-secondary-900 dark:text-white">
                      {post.title}
                    </div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-secondary-500 dark:text-secondary-400">
                      {post.excerpt}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-secondary-100 dark:bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                    {post.category === 'aws' ? 'AWS' : post.category}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t border-secondary-200/60 dark:border-white/10 px-4 py-2 text-xs text-secondary-400">
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-secondary-200/70 dark:border-white/10 bg-secondary-50 dark:bg-white/[0.04] px-1 py-0.5">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-secondary-200/70 dark:border-white/10 bg-secondary-50 dark:bg-white/[0.04] px-1 py-0.5">↵</kbd>
            select
          </span>
          <span className="hidden sm:flex items-center gap-2">
            <kbd className="rounded border border-secondary-200/70 dark:border-white/10 bg-secondary-50 dark:bg-white/[0.04] px-1 py-0.5">⌘K</kbd>
            toggle
          </span>
        </div>
      </div>
    </Command.Dialog>
  );
}
