import { fetchWithTimeout } from './fetchWithTimeout'

const CACHE_KEY = 'tbw_sc_v1'
const REGISTER_TIMEOUT_MS = 25_000
const COUNT_TIMEOUT_MS = 15_000

const BLUEHOST_SUBSCRIBERS_URL =
  (import.meta.env.VITE_BLUEHOST_SUBSCRIBERS_URL as string | undefined)?.trim() ||
  'https://www.thebluewavefans.com/thebluewave-subscribers/register.php'
const BLUEHOST_COUNT_URL =
  (import.meta.env.VITE_BLUEHOST_SUBSCRIBER_COUNT_URL as string | undefined)?.trim() ||
  'https://www.thebluewavefans.com/thebluewave-subscribers/count.php'
const BLUEHOST_WELCOME_URL =
  (import.meta.env.VITE_BLUEHOST_WELCOME_URL as string | undefined)?.trim() ||
  'https://www.thebluewavefans.com/thebluewave-subscribers/send-welcome.php'
const RENDER_REGISTER_URL =
  (import.meta.env.VITE_RENDER_REGISTER_URL as string | undefined)?.trim() ||
  'https://the-blue-wave.onrender.com/api/register-subscriber'
const RENDER_COUNT_URL =
  (import.meta.env.VITE_RENDER_COUNT_URL as string | undefined)?.trim() ||
  'https://the-blue-wave.onrender.com/api/subscriber-count'

export function formatSubscriberCount(count: number): string {
  return count.toLocaleString('de-DE')
}

export function readCachedSubscriberCount(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const n = Number.parseInt(raw, 10)
    return Number.isFinite(n) && n > 0 ? n : null
  } catch {
    return null
  }
}

function writeCachedSubscriberCount(count: number): void {
  if (!Number.isFinite(count) || count <= 0) return
  try {
    localStorage.setItem(CACHE_KEY, String(count))
  } catch {
    /* private mode */
  }
}

function parseCount(data: unknown): number | null {
  if (!data || typeof data !== 'object') return null
  const row = data as Record<string, unknown>
  const raw = row.count ?? row.subscriberCount ?? row.subscribers
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number.parseInt(raw, 10)
    if (Number.isFinite(n)) return n
  }
  return null
}

async function fetchJson(url: string, init?: RequestInit, timeoutMs = COUNT_TIMEOUT_MS) {
  try {
    const res = await fetchWithTimeout(url, init, timeoutMs)
    if (!res.ok) return null
    const text = await res.text()
    if (!text || text.trimStart().startsWith('<!')) return null
    return JSON.parse(text) as unknown
  } catch {
    return null
  }
}

export async function fetchSubscriberCount(): Promise<number | null> {
  for (const url of [BLUEHOST_COUNT_URL, RENDER_COUNT_URL]) {
    const data = await fetchJson(url, { headers: { Accept: 'application/json' } })
    const count = parseCount(data)
    if (count !== null && count >= 1000) {
      writeCachedSubscriberCount(count)
      return count
    }
  }
  return readCachedSubscriberCount()
}

async function registerOnBluehost(email: string) {
  const data = await fetchJson(
    BLUEHOST_SUBSCRIBERS_URL,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, source: 'holidays-blue-wave' }),
    },
    REGISTER_TIMEOUT_MS,
  )
  if (!data || typeof data !== 'object') return null
  const row = data as { count?: number; subscriberCount?: number; added?: boolean; welcomeSent?: boolean }
  const count = parseCount(row)
  if (count === null) return null
  writeCachedSubscriberCount(count)
  return { count, added: row.added === true, welcomeSent: row.welcomeSent === true }
}

async function registerOnRender(email: string) {
  const data = await fetchJson(
    RENDER_REGISTER_URL,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email }),
    },
    REGISTER_TIMEOUT_MS,
  )
  if (!data || typeof data !== 'object') return null
  const row = data as { count?: number; added?: boolean }
  const count = parseCount(row)
  if (count === null) return null
  writeCachedSubscriberCount(count)
  return { count, added: row.added === true, welcomeSent: false }
}

async function sendWelcomeEmail(email: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(
      BLUEHOST_WELCOME_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      },
      REGISTER_TIMEOUT_MS,
    )
    if (!res.ok) return false
    const data = (await res.json()) as { welcomeSent?: boolean }
    return data.welcomeSent === true
  } catch {
    return false
  }
}

export type StayUpdatedResult =
  | { ok: true; message: string; subscriberCount?: number; subscriberAdded?: boolean; welcomeSent: boolean }
  | { ok: false; message: string }

const MIN_LOADING_MS = 1500

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export async function submitStayUpdatedSignup(email: string): Promise<StayUpdatedResult> {
  const trimmed = email.trim()
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, message: 'Please enter a valid email address.' }
  }

  const started = Date.now()
  let result = await registerOnBluehost(trimmed)
  if (!result) {
    result = await registerOnRender(trimmed)
  }

  let welcomeSent = result?.welcomeSent === true
  if (!welcomeSent && result) {
    welcomeSent = await sendWelcomeEmail(trimmed)
  }

  const elapsed = Date.now() - started
  if (elapsed < MIN_LOADING_MS) {
    await sleep(MIN_LOADING_MS - elapsed)
  }

  let subscriberCount = result?.count
  if (subscriberCount === undefined) {
    subscriberCount = (await fetchSubscriberCount()) ?? undefined
  }

  const inboxHint = welcomeSent
    ? 'Check your inbox for your welcome email.'
    : 'Check your inbox (and spam folder) for your welcome email.'

  return {
    ok: true,
    welcomeSent,
    subscriberCount,
    subscriberAdded: result?.added ?? false,
    message: [`You're registered with: ${trimmed}`, inboxHint].join('\n\n'),
  }
}