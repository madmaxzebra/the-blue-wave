import { getApiBase } from './api';

/** Historical signups before the live counter (CountAPI + Render). */
export const SUBSCRIBER_COUNT_FALLBACK = 4732;

const COUNTAPI_NAMESPACE = 'thebluewavefans';
const COUNTAPI_KEY = 'subscribers';

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

function parseCountPayload(data: unknown): number | null {
  if (!data || typeof data !== 'object') return null;
  const row = data as Record<string, unknown>;
  if (typeof row.value === 'number' && Number.isFinite(row.value)) return row.value;
  if (typeof row.count === 'number' && Number.isFinite(row.count)) return row.count;
  if (typeof row.subscriberCount === 'number' && Number.isFinite(row.subscriberCount)) {
    return row.subscriberCount;
  }
  if (typeof row.subscribers === 'number' && Number.isFinite(row.subscribers)) {
    return normalizeStatsCount(row.subscribers);
  }
  return null;
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

/** Global persistent counter (same number for every visitor worldwide). */
async function fetchCountApiValue(): Promise<number | null> {
  const data = await fetchJson(
    `https://api.countapi.xyz/get/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`
  );
  return parseCountPayload(data);
}

async function incrementCountApi(): Promise<number | null> {
  const data = await fetchJson(
    `https://api.countapi.xyz/hit/${COUNTAPI_NAMESPACE}/${COUNTAPI_KEY}`
  );
  return parseCountPayload(data);
}

async function ensureCountApiInitialized(): Promise<void> {
  const current = await fetchCountApiValue();
  if (current !== null) return;
  await fetch(
    `https://api.countapi.xyz/create?namespace=${COUNTAPI_NAMESPACE}&key=${COUNTAPI_KEY}&value=${SUBSCRIBER_COUNT_FALLBACK}`
  );
}

async function fetchRenderSubscriberCount(): Promise<number | null> {
  const apiBase = getApiBase();
  if (!apiBase) return null;
  const headers = apiHeaders(apiBase);

  const fresh = await fetchJson(`${apiBase}/api/subscriber-count`, { headers });
  const fromFresh = parseCountPayload(fresh);
  if (fromFresh !== null) return fromFresh;

  const stats = await fetchJson(`${apiBase}/api/stats`, { headers });
  return parseCountPayload(stats);
}

/** Load the public total — CountAPI first so everyone sees the same live number. */
export async function fetchSubscriberCount(): Promise<number | null> {
  await ensureCountApiInitialized();
  const global = await fetchCountApiValue();
  if (global !== null) return global;

  const render = await fetchRenderSubscriberCount();
  if (render !== null) return render;

  return SUBSCRIBER_COUNT_FALLBACK;
}

async function registerOnRender(email: string): Promise<boolean> {
  const apiBase = getApiBase();
  if (!apiBase) return false;
  const headers = { ...apiHeaders(apiBase), 'Content-Type': 'application/json' };
  const trimmed = email.trim();
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.thebluewavefans.com';

  const attempts: Array<{ path: string; body: Record<string, unknown> }> = [
    { path: '/api/register-subscriber', body: { email: trimmed } },
    { path: '/api/subscribe', body: { email: trimmed, countOnly: true, origin } },
  ];

  for (const attempt of attempts) {
    const data = await fetchJson(`${apiBase}${attempt.path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(attempt.body),
    });
    if (data && typeof data === 'object' && (data as { added?: boolean }).added === true) {
      return true;
    }
    if (data && typeof data === 'object' && (data as { ok?: boolean }).ok === true) {
      return true;
    }
  }
  return false;
}

/** After a successful signup, bump the global counter once. */
export async function registerSubscriberCount(email: string): Promise<RegisterSubscriberResult | null> {
  await ensureCountApiInitialized();
  const before = await fetchCountApiValue();

  await registerOnRender(email);

  const afterHit = await incrementCountApi();
  if (afterHit !== null) {
    const added = before === null || afterHit > before;
    return { count: afterHit, added };
  }

  for (const delayMs of [300, 800]) {
    await sleep(delayMs);
    const latest = await fetchSubscriberCount();
    if (latest !== null) {
      return { count: latest, added: before === null || latest > (before ?? SUBSCRIBER_COUNT_FALLBACK) };
    }
  }

  return null;
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
