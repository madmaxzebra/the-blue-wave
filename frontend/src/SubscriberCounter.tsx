import { fetchWithTimeout, getApiBase } from './api';

const API_TIMEOUT_MS = 15000;
const REGISTER_TIMEOUT_MS = 25000;

/** Shown only when the server cannot be reached. */
export const SUBSCRIBER_COUNT_FALLBACK = 5156;

export type RegisterSubscriberResult = {
  count: number;
  added: boolean;
};

export function formatSubscriberCount(count: number): string {
  return count.toLocaleString('de-DE');
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

/** Official total from the server — single source of truth. */
export async function fetchSubscriberCount(): Promise<number> {
  const apiBase = getApiBase();
  if (!apiBase) return SUBSCRIBER_COUNT_FALLBACK;

  const data = await fetchJson(`${apiBase}/api/subscriber-count`, { headers: apiHeaders(apiBase) });
  const count = parseCount(data);
  return count ?? SUBSCRIBER_COUNT_FALLBACK;
}

/** Register email on the server; server updates the official counter. */
export async function registerSubscriberCount(email: string): Promise<RegisterSubscriberResult | null> {
  const apiBase = getApiBase();
  if (!apiBase) return null;

  const trimmed = email.trim();
  const headers = { ...apiHeaders(apiBase), 'Content-Type': 'application/json' };

  const data = await fetchJson(
    `${apiBase}/api/register-subscriber`,
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

  return {
    count,
    added: row.added === true,
  };
}

type SubscriberCounterProps = {
  count: number;
};

export function SubscriberCounter({ count }: SubscriberCounterProps) {
  return (
    <p className="subscriber-counter" aria-live="polite">
      <strong className="subscriber-counter__number">{formatSubscriberCount(count)}</strong>{' '}
      subscribers and counting
    </p>
  );
}
