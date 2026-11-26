import { getFormToken } from './community'
import type { Overrides } from './ownerContent'

const base = import.meta.env.BASE_URL
const API = (import.meta.env.VITE_OWNER_API as string | undefined) ?? `${base}api/owner.php`

export class OwnerError extends Error {
  status: number
  constructor(message: string, status = 0) {
    super(message)
    this.status = status
  }
}

type Json = Record<string, unknown>

async function call<T extends Json>(
  action: string,
  opts: { method?: 'GET' | 'POST'; query?: string; body?: Json; form?: FormData; csrf?: string } = {},
): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API}?action=${action}${opts.query ?? ''}`, {
      method: opts.method ?? (opts.body || opts.form ? 'POST' : 'GET'),
      headers: {
        ...(opts.body ? { 'content-type': 'application/json' } : {}),
        ...(opts.csrf ? { 'x-csrf': opts.csrf } : {}),
      },
      body: opts.form ?? (opts.body ? JSON.stringify(opts.body) : undefined),
      credentials: 'same-origin',
      cache: 'no-store',
    })
  } catch {
    throw new OwnerError('We could not reach the website. Please check your connection and try again.')
  }
  const type = res.headers.get('content-type') ?? ''
  if (!type.includes('application/json')) {
    throw new OwnerError('Owner pages only work on the live website, not in this preview.', res.status)
  }
  const data = (await res.json()) as Json
  if (!res.ok) throw new OwnerError(String(data.error ?? 'Something went wrong. Please try again.'), res.status)
  return data as T
}

export type Session = { username: string; partner: string; csrf: string }
export type Me = Session & { content: Overrides }

export const ownerApi = {
  activationInfo: (token: string) =>
    call<{ partner: string; partnerName: string }>('activation', { query: `&token=${encodeURIComponent(token)}` }),

  async activate(token: string, username: string, password: string) {
    const formToken = await getFormToken()
    if (!formToken) throw new OwnerError('Owner pages only work on the live website, not in this preview.')
    return call<Session>('activate', { body: { token, username, password, formToken } })
  },

  login: (username: string, password: string) => call<Session>('login', { body: { username, password } }),
  me: () => call<Me>('me'),
  logout: (csrf: string) => call('logout', { method: 'POST', csrf, body: {} }),
  save: (csrf: string, body: Json) => call<{ content: Overrides }>('save', { csrf, body }),

  upload(csrf: string, slot: string, file: File) {
    const form = new FormData()
    form.append('slot', slot)
    form.append('photo', file)
    return call<{ content: Overrides }>('upload', { csrf, form })
  },

  removePhoto: (csrf: string, slot: string, url?: string) =>
    call<{ content: Overrides }>('remove-photo', { csrf, body: { slot, url: url ?? '' } }),
}
