'use client';

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import {
  applyTheme,
  getStoredTheme,
  resolveTheme,
  type ThemeMode,
} from '@/lib/theme';

const MODES: ThemeMode[] = ['light', 'dark', 'system'];

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initial hydration — read stored mode
  useEffect(() => {
    setMode(getStoredTheme());
    setMounted(true);
  }, []);

  // Re-apply when system pref changes — only matters in 'system' mode
  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mode]);

  // Close menu on outside click / escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-theme-toggle]')) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (next: ThemeMode) => {
    setMode(next);
    applyTheme(next);
    setOpen(false);
  };

  const resolved = mounted ? resolveTheme(mode) : 'light';

  return (
    <div className="relative" data-theme-toggle>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Theme: ${mode}`}
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] text-secondary-700 dark:text-secondary-200 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-white/[0.08] transition-colors overflow-hidden"
      >
        {/* Sun/Moon morph — both rendered, the resolved theme is shown */}
        <SunIcon
          className={`absolute h-4 w-4 transition-all duration-300 ${
            resolved === 'dark'
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <MoonIcon
          className={`absolute h-4 w-4 transition-all duration-300 ${
            resolved === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
        {/* Tiny system indicator dot when mode === 'system' */}
        {mode === 'system' && mounted && (
          <span
            aria-hidden="true"
            className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-aws-smile ring-2 ring-white dark:ring-[#060a14]"
          />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-secondary-200/70 dark:border-white/10 glass-strong shadow-card-hover"
        >
          {MODES.map((m) => {
            const Icon =
              m === 'light' ? SunIcon : m === 'dark' ? MoonIcon : ComputerDesktopIcon;
            const active = mode === m;
            return (
              <button
                key={m}
                role="menuitemradio"
                aria-checked={active}
                type="button"
                onClick={() => pick(m)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300'
                    : 'text-secondary-700 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="capitalize">{m}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500 dark:bg-primary-400" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
