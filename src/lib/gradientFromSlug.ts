// AWS-themed palette pool — every gradient stays within the brand range.
// Tuples are [from, via, to].
const PALETTES: ReadonlyArray<readonly [string, string, string]> = [
  ['#1d4ed8', '#06b6d4', '#22d3ee'], // royal blue → cyan
  ['#0ea5e9', '#22d3ee', '#f59e0b'], // sky → cyan → AWS amber
  ['#2563eb', '#7c3aed', '#22d3ee'], // blue → violet → cyan
  ['#0f172a', '#1e40af', '#f59e0b'], // navy → blue → amber
  ['#0e7490', '#22d3ee', '#a7f3d0'], // teal → cyan → mint
  ['#1e3a8a', '#312e81', '#f59e0b'], // deep navy → indigo → amber
  ['#075985', '#0ea5e9', '#fcd34d'], // ocean → sky → gold
  ['#312e81', '#7c3aed', '#22d3ee'], // indigo → violet → cyan
];

function hash(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function gradientFromSlug(slug: string): {
  from: string;
  via: string;
  to: string;
  css: string;
} {
  const palette = PALETTES[hash(slug) % PALETTES.length];
  const [from, via, to] = palette;
  // Subtle off-axis angle adds variety between cards
  const angle = 110 + (hash(slug + 'angle') % 60); // 110–170deg
  return {
    from,
    via,
    to,
    css: `linear-gradient(${angle}deg, ${from} 0%, ${via} 50%, ${to} 100%)`,
  };
}
