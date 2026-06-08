import { getApiBase } from './api';

/** Matches backend SUBSCRIBER_COUNT_BASE default (historical signups before the live counter). */
export const SUBSCRIBER_COUNT_FALLBACK = 4732;

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

function normalizeStatsCount(raw: number): number {
  return raw >= SUBSCRIBER_COUNT_FALLBACK ? raw : SUBSCRIBER_COUNT_FALLBACK + raw;
}

function parseRegisterPayload(data: unknown): RegisterSubscriberResult | null {
  if (!data || typeof data !== 'object') return null;
  const row = data as Record<string, unknown>;
  const count =
    typeof row.count === 'number'
      ? row.count
      : typeof row.subscriberCount === 'number'
        ? row.subscriberCount
        : typeof row.subscribers === 'number'
          ? normalizeStatsCount(row.subscribers)
          : null;
  if (count === null || !Number.isFinite(count)) return null;
  return {
    count,
    added: row.added === true,
  };
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/** Load public subscriber total (works with old and new Render API). */
export async function fetchSubscriberCount(): Promise<number | null> {
  const apiBase = getApiBase();
  if (!apiBase) return null;

  const headers = apiHeaders(apiBase);

  const fresh = await fetchJson(`${apiBase}/api/subscriber-count`, { headers });
  const fromFresh = parseRegisterPayload(fresh);
  if (fromFresh) return fromFresh.count;

  const stats = await fetchJson(`${apiBase}/api/stats`, { headers });
  const fromStats = parseRegisterPayload(stats);
  if (fromStats) return fromStats.count;

  return null;
}

async function postRegister(
  apiBase: string,
  email: string,
  path: string,
  body: Record<string, unknown>
): Promise<RegisterSubscriberResult | null> {
  const headers = { ...apiHeaders(apiBase), 'Content-Type': 'application/json' };
  const data = await fetchJson(`${apiBase}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return parseRegisterPayload(data);
}

/** Save signup on the server and return the updated public total. */
export async function registerSubscriberCount(email: string): Promise<RegisterSubscriberResult | null> {
  const apiBase = getApiBase();
  if (!apiBase) return null;

  const trimmed = email.trim();
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.thebluewavefans.com';

  let result =
    (await postRegister(apiBase, trimmed, '/api/register-subscriber', { email: trimmed })) ??
    (await postRegister(apiBase, trimmed, '/api/subscribe', {
      email: trimmed,
      countOnly: true,
      origin,
    }));

  if (result?.added) return result;

  for (const delayMs of [200, 600, 1200]) {
    await sleep(delayMs);
    const count = await fetchSubscriberCount();
    if (count !== null) {
      return { count, added: result?.added ?? false };
    }
  }

  return result;
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
