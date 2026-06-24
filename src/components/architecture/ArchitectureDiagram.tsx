'use client';

import { useEffect, useState } from 'react';
import {
  RssIcon,
  ClockIcon,
  SparklesIcon,
  CircleStackIcon,
  GlobeAltIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type NodeKey = 'sources' | 'cron' | 'ai' | 'airtable' | 'site' | 'editor';

interface ArchitectureDiagramProps {
  /** Number of RSS sources currently active — shown in the Sources node. */
  sourcesCount: number;
  /** Number of drafts currently in Airtable — shown in the Airtable node. */
  draftsCount: number;
  /** Number of published articles — shown in the Site node. */
  publishedCount: number;
}

interface NodeDetail {
  key: NodeKey;
  title: string;
  tagline: string;
  details: string;
  tech: string[];
  cost: string;
  link?: { href: string; label: string };
}

const NODE_DETAILS: Record<NodeKey, NodeDetail> = {
  sources: {
    key: 'sources',
    title: '1. Sources',
    tagline: 'Curated RSS feeds.',
    details:
      'Ten engineering and AWS-focused feeds, ordered by editorial priority. AWS announcements and the AWS blog run first; Netflix, Uber, Meta, Pragmatic Engineer, React, web.dev, GitHub Blog, and Hacker News (filtered to 100+ points) fill the time budget.',
    tech: ['rss-parser', 'AWS What\'s New', 'AWS Blogs', 'Hacker News'],
    cost: 'Free · public RSS',
  },
  cron: {
    key: 'cron',
    title: '2. Cron',
    tagline: 'Daily orchestrator.',
    details:
      'One Vercel Cron run per day on the Hobby tier. Fetches each feed, dedups against the last 100 published items, then schedules AI rewrites in priority order until the 45-second time budget is reached. Items that miss the budget are deferred to the next run.',
    tech: ['Vercel Cron', 'Node runtime', 'maxDuration 60s'],
    cost: 'Free · Hobby tier',
  },
  ai: {
    key: 'ai',
    title: '3. AI rewrite',
    tagline: 'Editorial commentary, not paraphrase.',
    details:
      'Each new item gets a structured JSON-mode call to Gemini. The system prompt enforces the AWSMindset voice (banned hype words, "What\'s new / Why it matters / How to use it" structure, a quotable bottom line), and the per-source framing adapts tone for AWS announcements vs. engineering blogs vs. industry news.',
    tech: ['Google Gemini 2.5 Flash-Lite', '@google/generative-ai', 'responseSchema'],
    cost: 'Free · 15 RPM / 1k RPD',
  },
  airtable: {
    key: 'airtable',
    title: '4. Airtable',
    tagline: 'Draft inbox.',
    details:
      'AI output lands in a Posts table with status=draft. Every row keeps the source URL, original title, RSS guid, and a normalized link — enough to dedupe and to credit the source. The cron never publishes; that\'s the human-in-the-loop step.',
    tech: ['Airtable Posts table', 'airtable SDK', 'typecast: true'],
    cost: 'Free · 1.2k records',
  },
  editor: {
    key: 'editor',
    title: 'Editor',
    tagline: 'You — the only human in the loop.',
    details:
      'You read the draft, edit anything that feels off, then flip status from draft to published. That\'s it. No build, no deploy, no markdown commit — the change shows up on the site within 60 seconds via ISR.',
    tech: ['Airtable web UI', 'status: draft → published'],
    cost: 'Time, not money',
  },
  site: {
    key: 'site',
    title: '5. Reader',
    tagline: 'Static pages with 60s revalidate.',
    details:
      'Next.js App Router renders article pages statically and revalidates them on a 60-second budget. The same loader powers /blog, /aws, /engineering, /series, /api/search, /feed.xml, and /sitemap.xml. OG images, JSON-LD article schema, and the ⌘K palette all consume the same unified post list.',
    tech: ['Next.js 15', 'App Router', 'ISR', 'Vercel CDN'],
    cost: 'Free · Hobby tier',
  },
};

const NODE_ORDER: NodeKey[] = ['sources', 'cron', 'ai', 'airtable', 'site'];

export default function ArchitectureDiagram({
  sourcesCount,
  draftsCount,
  publishedCount,
}: ArchitectureDiagramProps) {
  const [selected, setSelected] = useState<NodeKey>('sources');
  const detail = NODE_DETAILS[selected];

  // Node positions in the SVG viewBox (0 0 1200 460)
  const NODES: Record<NodeKey, { x: number; y: number }> = {
    sources:  { x: 120,  y: 220 },
    cron:     { x: 360,  y: 220 },
    ai:       { x: 600,  y: 220 },
    airtable: { x: 840,  y: 220 },
    site:     { x: 1080, y: 220 },
    editor:   { x: 840,  y: 380 }, // branches off Airtable
  };

  // Style per node — accent color used for ring, animated dot color, etc.
  const ACCENT: Record<NodeKey, string> = {
    sources:  '#ff9900',  // AWS amber
    cron:     '#22d3ee',  // cyan
    ai:       '#a855f7',  // purple
    airtable: '#3b82f6',  // primary blue
    site:     '#10b981',  // emerald
    editor:   '#94a3b8',  // slate
  };

  return (
    <div className="relative">
      {/* The diagram itself — scales via viewBox */}
      <div className="rounded-3xl border border-secondary-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.02] p-4 sm:p-6 backdrop-blur shadow-card-hover overflow-hidden">
        <svg
          viewBox="0 0 1200 460"
          className="w-full h-auto"
          role="img"
          aria-label="AWSMindset content pipeline diagram"
        >
          <defs>
            {/* Subtle grid background pattern */}
            <pattern id="arch-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-secondary-300/40 dark:text-white/[0.06]"
              />
            </pattern>
            {/* Glow filter for hovered nodes */}
            <filter id="node-glow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Arrowhead used on connecting paths */}
            <marker
              id="arrow-cyan"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee" opacity="0.6" />
            </marker>

            {/* Motion paths for the animated dots */}
            <path id="path-1" d="M 180 220 L 300 220" />
            <path id="path-2" d="M 420 220 L 540 220" />
            <path id="path-3" d="M 660 220 L 780 220" />
            <path id="path-4" d="M 900 220 L 1020 220" />
            {/* Editor → Airtable branch */}
            <path id="path-5" d="M 840 320 L 840 280" />
          </defs>

          {/* Backdrop grid */}
          <rect width="1200" height="460" fill="url(#arch-grid)" />

          {/* Connecting paths (visible) */}
          <g stroke="currentColor" strokeWidth="2" fill="none" className="text-secondary-300/70 dark:text-white/15">
            <line x1="180" y1="220" x2="300" y2="220" markerEnd="url(#arrow-cyan)" />
            <line x1="420" y1="220" x2="540" y2="220" markerEnd="url(#arrow-cyan)" />
            <line x1="660" y1="220" x2="780" y2="220" markerEnd="url(#arrow-cyan)" />
            <line x1="900" y1="220" x2="1020" y2="220" markerEnd="url(#arrow-cyan)" />
            {/* Editor branch — dashed to indicate human step */}
            <line
              x1="840"
              y1="350"
              x2="840"
              y2="280"
              strokeDasharray="4 4"
              markerEnd="url(#arrow-cyan)"
            />
          </g>

          {/* Animated data dots — one per pipe, varied delays */}
          {[
            { path: 'path-1', color: ACCENT.sources, delay: '0s', dur: '2.6s' },
            { path: 'path-2', color: ACCENT.cron, delay: '0.6s', dur: '2.6s' },
            { path: 'path-3', color: ACCENT.ai, delay: '1.2s', dur: '2.6s' },
            { path: 'path-4', color: ACCENT.airtable, delay: '1.8s', dur: '2.6s' },
          ].map((d, i) => (
            <circle key={i} r="5" fill={d.color}>
              <animateMotion
                dur={d.dur}
                begin={d.delay}
                repeatCount="indefinite"
                rotate="auto"
              >
                <mpath href={`#${d.path}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.9;1"
                dur={d.dur}
                begin={d.delay}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Nodes — interactive */}
          {NODE_ORDER.map((key) => {
            const { x, y } = NODES[key];
            const isSelected = selected === key;
            const accent = ACCENT[key];
            return (
              <g
                key={key}
                transform={`translate(${x}, ${y})`}
                onClick={() => setSelected(key)}
                style={{ cursor: 'pointer' }}
                className="transition-opacity"
                aria-label={NODE_DETAILS[key].title}
              >
                <rect
                  x="-60"
                  y="-58"
                  width="120"
                  height="116"
                  rx="14"
                  fill={isSelected ? accent : '#0b1220'}
                  fillOpacity={isSelected ? 0.18 : 0.6}
                  stroke={accent}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  strokeOpacity={isSelected ? 1 : 0.55}
                  filter={isSelected ? 'url(#node-glow)' : undefined}
                />
                {/* Pulse ring while selected */}
                {isSelected && (
                  <rect
                    x="-60"
                    y="-58"
                    width="120"
                    height="116"
                    rx="14"
                    fill="none"
                    stroke={accent}
                    strokeWidth="2"
                    opacity="0"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.8;0"
                      dur="1.6s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="x"
                      values="-60;-72"
                      dur="1.6s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="y"
                      values="-58;-70"
                      dur="1.6s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="width"
                      values="120;144"
                      dur="1.6s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="height"
                      values="116;140"
                      dur="1.6s"
                      repeatCount="indefinite"
                    />
                  </rect>
                )}
                {/* Node title */}
                <text
                  x="0"
                  y="-28"
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="700"
                  letterSpacing="-0.3"
                >
                  {NODE_DETAILS[key].title.replace(/^\d+\.\s/, '')}
                </text>
                {/* Number badge */}
                <circle cx="-40" cy="-40" r="11" fill={accent} />
                <text
                  x="-40"
                  y="-36"
                  textAnchor="middle"
                  fill="#060a14"
                  fontSize="11"
                  fontWeight="800"
                >
                  {NODE_DETAILS[key].title.match(/^(\d+)/)?.[1] ?? ''}
                </text>
                {/* Big number / live count */}
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  fill={accent}
                  fontSize="34"
                  fontWeight="800"
                  letterSpacing="-1"
                >
                  {key === 'sources' && sourcesCount}
                  {key === 'cron' && '1×'}
                  {key === 'ai' && 'AI'}
                  {key === 'airtable' && draftsCount}
                  {key === 'site' && publishedCount}
                </text>
                {/* Sub-label */}
                <text
                  x="0"
                  y="38"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="500"
                  letterSpacing="0.5"
                >
                  {key === 'sources' && 'FEEDS'}
                  {key === 'cron' && 'PER DAY'}
                  {key === 'ai' && 'REWRITE'}
                  {key === 'airtable' && 'DRAFTS'}
                  {key === 'site' && 'PUBLISHED'}
                </text>
              </g>
            );
          })}

          {/* Editor (human-in-the-loop) — distinct visual treatment */}
          <g
            transform={`translate(${NODES.editor.x}, ${NODES.editor.y})`}
            onClick={() => setSelected('editor')}
            style={{ cursor: 'pointer' }}
          >
            <rect
              x="-58"
              y="-26"
              width="116"
              height="52"
              rx="26"
              fill={selected === 'editor' ? `${ACCENT.editor}33` : '#0b122080'}
              stroke={ACCENT.editor}
              strokeWidth={selected === 'editor' ? 2 : 1.2}
              strokeDasharray={selected === 'editor' ? undefined : '4 3'}
            />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fill="white"
              fontSize="13"
              fontWeight="700"
            >
              Editor (you)
            </text>
          </g>
        </svg>

        {/* Mobile-friendly hint */}
        <p className="mt-4 text-center text-xs text-secondary-500 dark:text-secondary-400">
          Tap any stage to see how it works.
        </p>
      </div>

      {/* Detail panel — adapts to whatever node is selected */}
      <div className="mt-6 rounded-2xl border border-secondary-200/70 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] p-6 backdrop-blur shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
              style={{ background: ACCENT[detail.key] }}
            >
              <NodeIcon nodeKey={detail.key} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-500 dark:text-secondary-400">
                {detail.tagline}
              </p>
              <h3 className="mt-0.5 text-xl font-bold text-secondary-900 dark:text-white">
                {detail.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelected('sources')}
            aria-label="Reset to first stage"
            className="rounded-full p-1.5 text-secondary-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-white/[0.06]"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-secondary-700 dark:text-secondary-300">
          {detail.details}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {detail.tech.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full border border-secondary-200/70 dark:border-white/10 bg-secondary-50 dark:bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-secondary-700 dark:text-secondary-300"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-secondary-200/60 dark:border-white/5 pt-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Cost · {detail.cost}
          </span>
          {detail.link && (
            <a
              href={detail.link.href}
              className="text-xs font-semibold text-primary-700 dark:text-primary-300 hover:underline"
            >
              {detail.link.label} →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function NodeIcon({ nodeKey }: { nodeKey: NodeKey }) {
  const cls = 'h-5 w-5';
  switch (nodeKey) {
    case 'sources':  return <RssIcon className={cls} />;
    case 'cron':     return <ClockIcon className={cls} />;
    case 'ai':       return <SparklesIcon className={cls} />;
    case 'airtable': return <CircleStackIcon className={cls} />;
    case 'editor':   return <UserIcon className={cls} />;
    case 'site':     return <GlobeAltIcon className={cls} />;
  }
}
