const base = import.meta.env.BASE_URL
const API = (import.meta.env.VITE_COMMUNITY_API as string | undefined) ?? `${base}api/community.php`

export type Review = {
  id: string
  name: string
  rating: number
  text: string
  created: string
}

export type ReviewSummary = {
  count: number
  average: number
  reviews: Review[]
  /** "live" = saved on the website server; "local" = server not reachable, saved on this device only */
  mode: 'live' | 'local'
}

export type ClaimInput = {
  partner: string
  partnerName: string
  ownerName: string
  email: string
  phone: string
  message: string
  website: string
}

export class CommunityError extends Error {}

const LOCAL_REVIEWS = 'bhw-reviews-v1'
const LOCAL_CLAIMS = 'bhw-claims-v1'

type ServerAnswer = { status: number; data: Record<string, unknown> }

/** Returns null when there is no working server (static preview, offline). */
async function ask(action: string, init?: RequestInit, query = ''): Promise<ServerAnswer | null> {
  try {
    const res = await fetch(`${API}?action=${action}${query}`, init)
    const type = res.headers.get('content-type') ?? ''
    if (!type.includes('application/json')) return null
    return { status: res.status, data: await res.json() }
  } catch {
    return null
  }
}

type Token = { value: string; at: number }
let tokenCache: Token | null = null

/** The server hands out a short-lived "real visitor" code. Returns null when there is no server. */
async function freshToken(): Promise<Token | null> {
  const answer = await ask('token')
  const value = answer && answer.status === 200 ? String(answer.data.token ?? '') : ''
  tokenCache = value ? { value, at: Date.now() } : null
  return tokenCache
}

/** Warm up when a form opens, so the code is old enough by the time the visitor presses send. */
export function prepareForm(): void {
  if (!tokenCache || Date.now() - tokenCache.at > 30 * 60 * 1000) void freshToken()
}

async function readyToken(refresh = false): Promise<string> {
  const token = refresh || !tokenCache || Date.now() - tokenCache.at > 30 * 60 * 1000 ? await freshToken() : tokenCache
  if (!token) return ''
  const wait = token.at + 2500 - Date.now()
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))
  return token.value
}

/** The real-visitor code, for the owner activation form (empty when there is no server). */
export async function getFormToken(): Promise<string> {
  return readyToken()
}

/** POST with the real-visitor code; asks for a new code once if the old one was refused. */
async function send(action: string, payload: Record<string, unknown>): Promise<ServerAnswer | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const token = await readyToken(attempt > 0)
    const answer = await ask(action, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...payload, token }),
    })
    if (answer && answer.status === 400 && String(answer.data.error ?? '').includes('reload') && attempt === 0) continue
    return answer
  }
  return null
}

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or blocked: ignore */
  }
}

function summarize(reviews: Review[], mode: ReviewSummary['mode']): ReviewSummary {
  const count = reviews.length
  const sum = reviews.reduce((total, r) => total + r.rating, 0)
  const newest = [...reviews].sort((a, b) => b.created.localeCompare(a.created)).slice(0, 30)
  return { count, average: count ? Math.round((sum / count) * 10) / 10 : 0, reviews: newest, mode }
}

export async function getReviews(partner: string): Promise<ReviewSummary> {
  const answer = await ask('reviews', undefined, `&partner=${encodeURIComponent(partner)}`)
  if (answer && answer.status === 200) return { ...(answer.data as Omit<ReviewSummary, 'mode'>), mode: 'live' }
  const all = readLocal<Record<string, Review[]>>(LOCAL_REVIEWS, {})
  return summarize(all[partner] ?? [], 'local')
}

export async function postReview(
  partner: string,
  input: { name: string; rating: number; text: string; website: string },
): Promise<ReviewSummary> {
  const answer = await send('review', { partner, ...input })
  if (answer) {
    if (answer.status === 201) return { ...(answer.data as Omit<ReviewSummary, 'mode'>), mode: 'live' }
    throw new CommunityError(String(answer.data.error ?? 'Something went wrong. Please try again.'))
  }
  const all = readLocal<Record<string, Review[]>>(LOCAL_REVIEWS, {})
  const list = all[partner] ?? []
  list.push({
    id: `local-${Date.now()}`,
    name: input.name.trim() || 'Visitor',
    rating: input.rating,
    text: input.text.trim(),
    created: new Date().toISOString(),
  })
  all[partner] = list
  writeLocal(LOCAL_REVIEWS, all)
  return summarize(list, 'local')
}

/**
 * "emailed" = request saved and the thank-you email was sent; "received" = saved, email could not be sent;
 * "local" = no server, only kept on this device.
 */
export async function postClaim(input: ClaimInput): Promise<'emailed' | 'received' | 'local'> {
  const answer = await send('claim', input)
  if (answer) {
    if (answer.status === 201) return answer.data.confirmationSent === true ? 'emailed' : 'received'
    throw new CommunityError(String(answer.data.error ?? 'Something went wrong. Please try again.'))
  }
  const claims = readLocal<unknown[]>(LOCAL_CLAIMS, [])
  claims.push({ ...input, created: new Date().toISOString() })
  writeLocal(LOCAL_CLAIMS, claims)
  return 'local'
}
