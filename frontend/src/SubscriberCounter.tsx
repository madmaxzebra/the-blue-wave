import { getApiBase } from './api';

/** Historical signups before the live counter. */
export const SUBSCRIBER_COUNT_FALLBACK = 4732;

/** Global counter — same number for every visitor (Render DB alone is not reliable). */
const GLOBAL_COUNTER_KEY = 'thebluewavefans-subscribers';
const GLOBAL_COUNTER_BASE = 'https://countapi.mileshilliard.com/api/v1';

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

function parseCountValue(data: unknown): number | null {
  if (!data || typeof data !== 'object') return null;
  const row = data as Record<string, unknown>;
  const raw = row.value ?? row.count ?? row.subscriberCount ?? row.subscribers;
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return row.subscribers !== undefined ? normalizeStatsCount(raw) : raw;
  }
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n)) return n;
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

async function fetchGlobalCounterValue(): Promise<number | null> {
  const data = await fetchJson(`${GLOBAL_COUNTER_BASE}/get/${GLOBAL_COUNTER_KEY}`);
  return parseCountValue(data);
}

async function setGlobalCounterValue(value: number): Promise<number | null> {
  const data = await fetchJson(
    `${GLOBAL_COUNTER_BASE}/set/${GLOBAL_COUNTER_KEY}?value=${encodeURIComponent(String(value))}`
  );
  return parseCountValue(data) ?? value;
}

async function incrementGlobalCounter(): Promise<number | null> {
  const data = await fetchJson(`${GLOBAL_COUNTER_BASE}/hit/${GLOBAL_COUNTER_KEY}`);
  return parseCountValue(data);
}

async function ensureGlobalCounterInitialized(): Promise<void> {
  const current = await fetchGlobalCounterValue();
  if (current === null || current < SUBSCRIBER_COUNT_FALLBACK) {
    await setGlobalCounterValue(
      current === null ? SUBSCRIBER_COUNT_FALLBACK : Math.max(SUBSCRIBER_COUNT_FALLBACK, current)
    );
  }
}

async function fetchRenderSubscriberCount(): Promise<number | null> {
  const apiBase = getApiBase();
  if (!apiBase) return null;
  const headers = apiHeaders(apiBase);

  const fresh = await fetchJson(`${apiBase}/api/subscriber-count`, { headers });
  const fromFresh = parseCountValue(fresh);
  if (fromFresh !== null) return fromFresh;

  const stats = await fetchJson(`${apiBase}/api/stats`, { headers });
  return parseCountValue(stats);
}

/** Load the public total — global counter first. */
export async function fetchSubscriberCount(): Promise<number | null> {
  await ensureGlobalCounterInitialized();
  const global = await fetchGlobalCounterValue();
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
    { path: '/api/subscribe', body: { email: trimmed, welcomeOnly: true, origin } },
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
  }
  return false;
}

/** After signup: save on Render if possible, bump global counter for new subscribers. */
export async function registerSubscriberCount(email: string): Promise<RegisterSubscriberResult | null> {
  await ensureGlobalCounterInitialized();
  const before = await fetchGlobalCounterValue();

  const addedOnRender = await registerOnRender(email);

  if (addedOnRender || before === null) {
    const afterHit = await incrementGlobalCounter();
    if (afterHit !== null) {
      return { count: afterHit, added: true };
    }
  }

  const latest = await fetchSubscriberCount();
  if (latest !== null) {
    return { count: latest, added: false };
  }

  return before !== null ? { count: before, added: false } : null;
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
