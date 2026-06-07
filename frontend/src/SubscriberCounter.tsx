import { getApiBase } from './api';

/** Matches backend SUBSCRIBER_COUNT_BASE default (historical signups before the live counter). */
export const SUBSCRIBER_COUNT_FALLBACK = 4732;

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

function normalizeStatsCount(raw: number): number {
  // New API returns base + DB; old Render API returns DB rows only (usually small).
  return raw >= SUBSCRIBER_COUNT_FALLBACK ? raw : SUBSCRIBER_COUNT_FALLBACK + raw;
}

async function fetchJson(url: string, init?: RequestInit): Promise<unknown | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.trimStart().startsWith('<!')) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Load public subscriber total (works with old and new Render API). */
export async function fetchSubscriberCount(): Promise<number | null> {
  const apiBase = getApiBase();
  if (!apiBase) return null;

  const headers = apiHeaders(apiBase);

  const fresh = await fetchJson(`${apiBase}/api/subscriber-count`, { headers });
  if (
    fresh &&
    typeof fresh === 'object' &&
    'count' in fresh &&
    typeof (fresh as { count: unknown }).count === 'number'
  ) {
    return (fresh as { count: number }).count;
  }

  const stats = await fetchJson(`${apiBase}/api/stats`, { headers });
  if (
    stats &&
    typeof stats === 'object' &&
    'subscribers' in stats &&
    typeof (stats as { subscribers: unknown }).subscribers === 'number'
  ) {
    return normalizeStatsCount((stats as { subscribers: number }).subscribers);
  }

  return null;
}

/** Register email and return updated total (falls back to refresh if new route not deployed yet). */
export async function registerSubscriberCount(email: string): Promise<number | null> {
  const apiBase = getApiBase();
  if (!apiBase) return null;

  const headers = { ...apiHeaders(apiBase), 'Content-Type': 'application/json' };

  const registered = await fetchJson(`${apiBase}/api/register-subscriber`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: email.trim() }),
  });

  if (
    registered &&
    typeof registered === 'object' &&
    'count' in registered &&
    typeof (registered as { count: unknown }).count === 'number'
  ) {
    return (registered as { count: number }).count;
  }

  return fetchSubscriberCount();
}

type SubscriberCounterProps = {
  count: number;
};

export function SubscriberCounter({ count }: SubscriberCounterProps) {
  return (
    <p className="subscriber-counter" aria-live="polite">
      The number of subscribers is now{' '}
      <strong className="subscriber-counter__number">{formatSubscriberCount(count)}</strong> and
      still counting.
    </p>
  );
}
