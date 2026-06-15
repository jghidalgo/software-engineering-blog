export type ThemeMode = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'theme';

/**
 * Inline script — runs before paint to set html.dark from localStorage or system pref.
 * MUST be self-contained (no imports, no closures over module scope) since it
 * is serialized into the HTML head via dangerouslySetInnerHTML.
 */
export const NO_FOUC_SCRIPT = `(function(){try{
  var k='${THEME_STORAGE_KEY}';
  var s=localStorage.getItem(k);
  var mq=window.matchMedia('(prefers-color-scheme: dark)');
  var resolved = (s==='dark'||s==='light') ? s : (mq.matches ? 'dark' : 'light');
  var root=document.documentElement;
  if(resolved==='dark') root.classList.add('dark'); else root.classList.remove('dark');
  root.style.colorScheme = resolved;
}catch(e){}})();`;

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const v = localStorage.getItem(THEME_STORAGE_KEY);
  if (v === 'light' || v === 'dark') return v;
  return 'system';
}

export function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const resolved = resolveTheme(mode);
  const root = document.documentElement;

  // Temporary class enables smooth color transitions only when triggered by user.
  root.classList.add('theme-transition');
  if (resolved === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  root.style.colorScheme = resolved;

  // Remove transition class after the animation completes
  window.setTimeout(() => {
    root.classList.remove('theme-transition');
  }, 280);

  if (mode === 'system') {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }
}
