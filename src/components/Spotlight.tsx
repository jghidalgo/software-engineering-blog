'use client';

import { useRef, type ReactNode } from 'react';

interface SpotlightProps {
  children: ReactNode;
  className?: string;
  /** Tailwind/CSS color for the glow — accepts any valid CSS color. */
  color?: string;
  /** Radius of the glow in px. */
  size?: number;
}

export default function Spotlight({
  children,
  className = '',
  color = 'rgba(56, 189, 248, 0.18)',
  size = 420,
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`spotlight-host ${className}`}
      style={
        {
          '--spot-color': color,
          '--spot-size': `${size}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
