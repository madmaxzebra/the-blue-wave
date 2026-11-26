import { useEffect, useState } from 'react'

const base = import.meta.env.BASE_URL
const API = (import.meta.env.VITE_OWNER_API as string | undefined) ?? `${base}api/owner.php`

export type Overrides = {
  tagline?: string
  intro?: string
  heroTitle?: string
  heroText?: string
  quote?: string
  shopNote?: string
  lifestyleTitle?: string
  lifestyleText?: string
  openingHours?: string
  phone?: string
  whatsapp?: string
  websiteUrl?: string
  websiteLabel?: string
  items?: { title?: string; text?: string }[]
  images?: Record<string, string>
  gallery?: string[]
}

type ContentMap = Record<string, Overrides>

let cache: ContentMap | null = null
let loading: Promise<ContentMap> | null = null
const listeners = new Set<(map: ContentMap) => void>()

function publish(map: ContentMap) {
  cache = map
  listeners.forEach((fn) => fn(map))
}

/** What page owners changed, for every page. Empty when there is no server (static preview). */
export function loadContent(): Promise<ContentMap> {
  if (cache) return Promise.resolve(cache)
  loading ??= fetch(`${API}?action=content`, { cache: 'no-cache' })
    .then(async (res) => {
      if (!(res.headers.get('content-type') ?? '').includes('application/json')) return {}
      const data = (await res.json()) as { content?: ContentMap }
      return data.content ?? {}
    })
    .catch(() => ({}) as ContentMap)
    .then((map) => {
      publish(map)
      return map
    })
  return loading
}

/** After an owner saved, show the new content everywhere without a reload. */
export function setPartnerContent(partner: string, content: Overrides) {
  publish({ ...(cache ?? {}), [partner]: content })
}

export function useOwnerContent(): ContentMap {
  const [map, setMap] = useState<ContentMap>(cache ?? {})
  useEffect(() => {
    listeners.add(setMap)
    void loadContent().then(setMap)
    return () => {
      listeners.delete(setMap)
    }
  }, [])
  return map
}

export function assetUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${base}${path.replace(/^\//, '')}`
}

type Loose = Record<string, unknown>

const TEXT_KEYS = [
  'tagline',
  'intro',
  'heroTitle',
  'heroText',
  'quote',
  'shopNote',
  'lifestyleTitle',
  'lifestyleText',
  'openingHours',
  'phone',
  'whatsapp',
  'websiteUrl',
  'websiteLabel',
] as const

/** Puts the owner's changes on top of the built-in page data. */
export function applyOverrides<T extends object>(item: T, overrides?: Overrides): T {
  if (!overrides) return item
  const next: Loose = { ...(item as Loose) }

  for (const key of TEXT_KEYS) {
    const value = overrides[key]
    if (typeof value === 'string' && value !== '') next[key] = value
  }
  if (overrides.intro) delete next.listBlurb

  const images = overrides.images ?? {}
  if (images.logo) {
    next.logoImg = assetUrl(images.logo)
    next.logoOnDark = false
  }
  if (images.hero) next.heroImg = assetUrl(images.hero)
  if (images.highlight) next.highlightImg = assetUrl(images.highlight)
  if (images.lifestyle) next.lifestyleImg = assetUrl(images.lifestyle)

  for (const listKey of ['items', 'looks']) {
    const list = next[listKey]
    if (!Array.isArray(list)) continue
    next[listKey] = list.map((entry: Loose, i: number) => {
      const edit = overrides.items?.[i]
      const photo = images[`item${i}`]
      return {
        ...entry,
        ...(edit?.title ? { title: edit.title } : {}),
        ...(edit?.text ? { text: edit.text } : {}),
        ...(photo ? { img: assetUrl(photo) } : {}),
      }
    })
  }
  return next as T
}
