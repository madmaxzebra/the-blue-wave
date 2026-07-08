import { fetchWithTimeout, getApiBase } from './api';
import { resolveIndexedTotal } from './lib/sessionIndex';

const API_TIMEOUT_MS = 15000;
const REGISTER_TIMEOUT_MS = 25000;
const CACHE_KEY = 'tbw_sc_v1';
const BLUEHOST_COUNT_URL =
  (import.meta.env.VITE_BLUEHOST_SUBSCRIBER_COUNT_URL as string | undefined)?.trim() ||
  'https://www.thebluewavefans.com/thebluewave-subscribers/count.php';

export type RegisterSubscriberResult = {
  count: number;
  added: boolean;
};

export function formatSubscriberCount(count: number): string {
  return count.toLocaleString('de-DE');
}

/** Fallback when count endpoints and cache are unavailable. */
function offlineIndexedTotal(): number {
  return resolveIndexedTotal();
}

export function readCachedSubscriberCount(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

function writeCachedSubscriberCount(count: number): void {
  if (typeof window === 'undefined' || !Number.isFinite(count) || count <= 0) return;
  try {
    localStorage.setItem(CACHE_KEY, String(count));
  } catch {
    /* private mode / quota */
  }
}

function apiHeaders(apiBase: string): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (apiBase.includes('loca.lt')) {
    headers['bypass-tunnel-reminder'] = '1';
  }
  return headers;
}

function parseCount(data: unknown): number | null {
  if (!data || typeof data !== 'object') return null;
  const row = data as Record<string, unknown>;
  const raw = row.count ?? row.subscriberCount ?? row.subscribers ?? row.value;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

async function fetchJson(url: string, init?: RequestInit, timeoutMs = API_TIMEOUT_MS): Promise<unknown | null> {
  try {
    const res = await fetchWithTimeout(url, init, timeoutMs);
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.trimStart().startsWith('<!')) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function subscriberCountUrl(): string {
  const apiBase = getApiBase();
  return apiBase ? `${apiBase}/api/subscriber-count` : '/api/subscriber-count';
}

/**
 * Live count from the server. On success, caches for offline use.
 * Offline / error: returns last cached count, or null (show loading — not the seed).
 */
export async function fetchSubscriberCount(): Promise<number | null> {
  const apiBase = getApiBase();
  const renderUrl = apiBase ? `${apiBase}/api/subscriber-count` : 'https://the-blue-wave.onrender.com/api/subscriber-count';
  const sources = [
    renderUrl,
    subscriberCountUrl(),
    BLUEHOST_COUNT_URL,
  ];

  for (const url of sources) {
    const data = await fetchJson(url, {
      headers: apiHeaders(apiBase),
    });
    const count = parseCount(data);
    if (count !== null && count >= 1000) {
      writeCachedSubscriberCount(count);
      return count;
    }
  }

  const cached = readCachedSubscriberCount();
  if (cached !== null && cached >= 1000) return cached;
  return null;
}

/** Best available count for signup bookkeeping (cache → live → offline index). */
export async function resolveSubscriberCount(): Promise<number> {
  const live = await fetchSubscriberCount();
  if (live !== null) return live;
  return offlineIndexedTotal();
}

/** Register email on the server; server updates the official counter. */
export async function registerSubscriberCount(email: string): Promise<RegisterSubscriberResult | null> {
  const apiBase = getApiBase();
  const trimmed = email.trim();
  const headers = { ...apiHeaders(apiBase), 'Content-Type': 'application/json' };
  const url = apiBase ? `${apiBase}/api/register-subscriber` : '/api/register-subscriber';

  const data = await fetchJson(
    url,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ email: trimmed }),
    },
    REGISTER_TIMEOUT_MS
  );

  if (!data || typeof data !== 'object') return null;

  const row = data as { added?: boolean; count?: number };
  const count = parseCount(row);
  if (count === null) return null;

  writeCachedSubscriberCount(count);
  return {
    count,
    added: row.added === true,
  };
}

type SubscriberCounterProps = {
  count: number | null;
};

export function SubscriberCounter({ count }: SubscriberCounterProps) {
  return (
    <p className="subscriber-counter" aria-live="polite">
      <strong className="subscriber-counter__number">
        {count === null ? '…' : formatSubscriberCount(count)}
      </strong>{' '}
      subscribers and counting
    </p>
  );
}
