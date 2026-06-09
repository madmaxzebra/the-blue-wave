import { fetchWithTimeout, getApiBase } from './api';
import { isTestSubscriberEmail } from './testEmails';



const API_TIMEOUT_MS = 10000;

const REGISTER_TIMEOUT_MS = 25000;

const LOCAL_CACHE_KEY = 'bluewave-subscriber-count';



/** Historical signups before the live counter. */

export const SUBSCRIBER_COUNT_FALLBACK = 5156;



/** Persists across Render redeploys (Render SQLite resets on deploy). */

const GLOBAL_COUNTER_KEY = 'thebluewavefans-subscribers';

const GLOBAL_COUNTER_BASE = 'https://countapi.mileshilliard.com/api/v1';



export type RegisterSubscriberResult = {

  count: number;

  added: boolean;

};



export function formatSubscriberCount(count: number): string {

  return count.toLocaleString('de-DE');

}



export function getCachedSubscriberCount(): number | null {

  if (typeof window === 'undefined') return null;

  try {

    const raw = window.localStorage.getItem(LOCAL_CACHE_KEY);

    if (!raw) return null;

    const n = Number.parseInt(raw, 10);

    if (!Number.isFinite(n) || n < SUBSCRIBER_COUNT_FALLBACK) return null;

    return n;

  } catch {

    return null;

  }

}



function cacheSubscriberCount(count: number): void {

  if (typeof window === 'undefined') return;

  try {

    window.localStorage.setItem(LOCAL_CACHE_KEY, String(count));

  } catch {

    /* ignore */

  }

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



function pickBestCount(...candidates: (number | null | undefined)[]): number {

  const maxReasonable = SUBSCRIBER_COUNT_FALLBACK + 5000;

  let best = SUBSCRIBER_COUNT_FALLBACK;

  for (const candidate of candidates) {

    if (

      typeof candidate === 'number' &&

      candidate >= SUBSCRIBER_COUNT_FALLBACK &&

      candidate <= maxReasonable &&

      candidate > best

    ) {

      best = candidate;

    }

  }

  return best;

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



/** Only raise the global counter — never lower it (Render DB can reset on deploy). */

async function syncGlobalCounterUp(value: number): Promise<void> {

  const global = await fetchGlobalCounterValue();

  if (global === null || value > global) {

    await setGlobalCounterValue(value);

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



/** Highest value from Render, CountAPI, and browser cache — counter never goes down. */

async function resolveSubscriberCount(): Promise<number> {

  const [render, global, cached] = await Promise.all([

    fetchRenderSubscriberCount(),

    fetchGlobalCounterValue(),

    Promise.resolve(getCachedSubscriberCount()),

  ]);



  const best = pickBestCount(render, global, cached);

  cacheSubscriberCount(best);

  void syncGlobalCounterUp(best);

  return best;

}



/** Load the public total — shared across all visitors via CountAPI + Render. */

export async function fetchSubscriberCount(): Promise<number | null> {

  try {

    return await resolveSubscriberCount();

  } catch {

    return getCachedSubscriberCount() ?? SUBSCRIBER_COUNT_FALLBACK;

  }

}



async function registerOnRender(email: string): Promise<{ added: boolean; count: number | null }> {

  const apiBase = getApiBase();

  if (!apiBase) return { added: false, count: null };

  const headers = { ...apiHeaders(apiBase), 'Content-Type': 'application/json' };

  const trimmed = email.trim();

  const origin =

    typeof window !== 'undefined' ? window.location.origin : 'https://www.thebluewavefans.com';



  const attempts: Array<{ path: string; body: Record<string, unknown> }> = [

    { path: '/api/register-subscriber', body: { email: trimmed } },

    { path: '/api/subscribe', body: { email: trimmed, countOnly: true, origin } },

  ];



  for (const attempt of attempts) {

    const data = await fetchJson(

      `${apiBase}${attempt.path}`,

      {

        method: 'POST',

        headers,

        body: JSON.stringify(attempt.body),

      },

      REGISTER_TIMEOUT_MS

    );

    if (data && typeof data === 'object') {

      const row = data as { added?: boolean; count?: number; subscriberCount?: number };

      const count = parseCountValue(row);

      if (row.added === true) {

        return { added: true, count };

      }

      if (row.added === false) {

        return { added: false, count };

      }

    }

  }

  return { added: false, count: null };

}



/** Instant UI bump + persist on CountAPI (survives Render redeploys). */

export function bumpSubscriberCountOptimistic(): RegisterSubscriberResult {

  const cached = getCachedSubscriberCount() ?? SUBSCRIBER_COUNT_FALLBACK;

  const next = cached + 1;

  cacheSubscriberCount(next);

  void incrementGlobalCounter().then((afterHit) => {

    const best = pickBestCount(next, afterHit);

    cacheSubscriberCount(best);

    void syncGlobalCounterUp(best);

  });

  return { count: next, added: true };

}



/** After signup: save on Render and bump CountAPI for new subscribers. */

export async function registerSubscriberCount(email: string): Promise<RegisterSubscriberResult | null> {

  const before = getCachedSubscriberCount() ?? (await resolveSubscriberCount());

  const { added, count: renderCount } = await registerOnRender(email);
  const isTest = isTestSubscriberEmail(email);

  if (added || isTest) {
    const afterHit = await incrementGlobalCounter();
    const best = pickBestCount(renderCount, afterHit, before + 1);
    cacheSubscriberCount(best);
    void syncGlobalCounterUp(best);
    return { count: best, added: true };
  }

  const latest = await resolveSubscriberCount();
  return { count: latest, added: false };

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


