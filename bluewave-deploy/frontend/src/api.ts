/**
 * API base URL for fetch calls.
 * - When using tunnel (trycloudflare.com) or production: use '' (same origin, share server proxies /api)
 * - When VITE_API_URL is set: use it (e.g. for direct dev)
 * - Otherwise: '' (Vite dev server proxies /api to backend)
 */
export function getApiBase(): string {
  const env = import.meta.env.VITE_API_URL;
  if (env && typeof env === 'string') return env;
  // On tunnel or production, always use same origin - never localhost
  if (typeof window !== 'undefined') {
    const h = window.location.hostname;
    if (h !== 'localhost' && h !== '127.0.0.1') return '';
  }
  return '';
}
