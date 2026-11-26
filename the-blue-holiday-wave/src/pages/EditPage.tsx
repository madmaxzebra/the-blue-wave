import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { findPartner } from '../data/allPartners'
import { OwnerError, ownerApi, type Me } from '../lib/owner'
import {
  applyOverrides,
  assetUrl,
  setPartnerContent,
  type Overrides,
} from '../lib/ownerContent'
import './OwnerPages.css'

type Loose = Record<string, unknown>
type Item = { title?: string; text?: string; img?: string }

const MAX_MB = 6
const TEXT_FIELDS: { key: string; label: string; hint: string; rows: number; max: number }[] = [
  { key: 'tagline', label: 'Short line under your name', hint: 'One friendly sentence.', rows: 2, max: 140 },
  { key: 'intro', label: 'About you', hint: 'Who you are and what visitors will love.', rows: 5, max: 700 },
  { key: 'heroTitle', label: 'Big photo title', hint: 'Shown on your main photo.', rows: 1, max: 100 },
  { key: 'heroText', label: 'Big photo text', hint: 'A short line under that title.', rows: 3, max: 400 },
  { key: 'quote', label: 'Your motto', hint: 'A short quote in your own words.', rows: 2, max: 200 },
  { key: 'shopNote', label: 'Good to know', hint: 'Parking, reservations, offers, anything handy.', rows: 3, max: 400 },
  { key: 'lifestyleTitle', label: 'Story title', hint: 'Heading of your story at the bottom.', rows: 1, max: 100 },
  { key: 'lifestyleText', label: 'Your story', hint: 'Tell your story your way.', rows: 4, max: 600 },
]
const CONTACT_FIELDS: { key: string; label: string; hint: string; max: number; type?: string }[] = [
  { key: 'openingHours', label: 'Opening hours', hint: 'For example: Mon-Sat 9:00-18:00', max: 200 },
  { key: 'phone', label: 'Phone', hint: 'For example: +599 9 123 4567', max: 40, type: 'tel' },
  { key: 'whatsapp', label: 'WhatsApp number', hint: 'With country code, for example 59997353131', max: 20, type: 'tel' },
  { key: 'websiteUrl', label: 'Website', hint: 'Starting with https://', max: 200, type: 'url' },
]

type PhotoProps = {
  label: string
  hint?: string
  current: string
  changed: boolean
  busy: boolean
  onPick: (file: File) => void
  onReset: () => void
  contain?: boolean
}

function PhotoSlot({ label, hint, current, changed, busy, onPick, onReset, contain }: PhotoProps) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <div className="owner__photo">
      <div className={`owner__thumb${contain ? ' owner__thumb--contain' : ''}`}>
        {current ? <img src={current} alt="" /> : <span>No photo</span>}
      </div>
      <div className="owner__photo-body">
        <strong>{label}</strong>
        {hint ? <small>{hint}</small> : null}
        <div className="owner__row">
          <button type="button" className="owner__secondary" disabled={busy} onClick={() => input.current?.click()}>
            {busy ? 'Uploading…' : 'Change photo'}
          </button>
          {changed ? (
            <button type="button" className="owner__link" disabled={busy} onClick={onReset}>
              Use the original
            </button>
          ) : null}
        </div>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (file) onPick(file)
          }}
        />
      </div>
    </div>
  )
}

export function EditPage() {
  const navigate = useNavigate()
  const [me, setMe] = useState<Me | null>(null)
  const [redirect, setRedirect] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [form, setForm] = useState<Record<string, string>>({})
  const [items, setItems] = useState<Item[]>([])
  const [content, setContent] = useState<Overrides>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; bad: boolean } | null>(null)
  const [busySlot, setBusySlot] = useState('')
  const galleryInput = useRef<HTMLInputElement>(null)

  const found = me ? findPartner(me.partner) : null

  const fill = useCallback((partner: Loose, overrides: Overrides) => {
    const merged = applyOverrides(partner, overrides) as Loose
    const next: Record<string, string> = {}
    for (const f of [...TEXT_FIELDS, ...CONTACT_FIELDS]) next[f.key] = String(merged[f.key] ?? '')
    setForm(next)
    const list = (merged.items ?? merged.looks ?? []) as Item[]
    setItems(list.slice(0, 6).map((i) => ({ title: i.title ?? '', text: i.text ?? '' })))
  }, [])

  useEffect(() => {
    ownerApi
      .me()
      .then((data) => {
        setMe(data)
        setContent(data.content)
        const f = findPartner(data.partner)
        if (f) fill(f.partner as unknown as Loose, data.content)
      })
      .catch((e) => {
        if (e instanceof OwnerError && e.status === 401) setRedirect(true)
        else setLoadError(e instanceof OwnerError ? e.message : 'Something went wrong. Please try again.')
      })
  }, [fill])

  if (redirect) return <Navigate to="/owner" replace />
  if (loadError) {
    return (
      <section className="page owner">
        <div className="owner__card">
          <p className="owner__error" role="alert">
            {loadError}
          </p>
        </div>
      </section>
    )
  }
  if (!me || !found) return <section className="page owner"><p className="page__lead">Loading your page…</p></section>

  const partner = found.partner as unknown as Loose
  const merged = applyOverrides(partner, content) as Loose
  const original = partner
  const images = content.images ?? {}
  const gallery = content.gallery ?? []
  const staticItems = (partner.items ?? partner.looks ?? []) as Item[]

  function accept(text: string, bad = false) {
    setMessage({ text, bad })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updated(next: Overrides) {
    setContent(next)
    setPartnerContent(me!.partner, next)
  }

  async function save(e: { preventDefault: () => void }) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const out = await ownerApi.save(me!.csrf, { ...form, items: items.map((i) => ({ title: i.title, text: i.text })) })
      updated(out.content)
      accept('Saved! Your page is updated for everyone.')
    } catch (err) {
      accept(err instanceof OwnerError ? err.message : 'Something went wrong. Please try again.', true)
    } finally {
      setSaving(false)
    }
  }

  function checkFile(file: File): string {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return 'Please choose a JPG, PNG or WebP photo.'
    if (file.size > MAX_MB * 1024 * 1024) return `That photo is too big. Please use one under ${MAX_MB} MB.`
    return ''
  }

  async function upload(slot: string, file: File) {
    const problem = checkFile(file)
    if (problem) return accept(problem, true)
    setBusySlot(slot)
    setMessage(null)
    try {
      updated((await ownerApi.upload(me!.csrf, slot, file)).content)
      accept('Photo saved. It is live on your page.')
    } catch (err) {
      accept(err instanceof OwnerError ? err.message : 'Something went wrong. Please try again.', true)
    } finally {
      setBusySlot('')
    }
  }

  async function remove(slot: string, url?: string) {
    setBusySlot(url ?? slot)
    try {
      updated((await ownerApi.removePhoto(me!.csrf, slot, url)).content)
      accept(slot === 'gallery' ? 'Photo removed.' : 'Back to the original photo.')
    } catch (err) {
      accept(err instanceof OwnerError ? err.message : 'Something went wrong. Please try again.', true)
    } finally {
      setBusySlot('')
    }
  }

  async function logout() {
    try {
      await ownerApi.logout(me!.csrf)
    } finally {
      navigate('/owner', { replace: true })
    }
  }

  const set = (key: string) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setItem = (i: number, key: 'title' | 'text') => (e: { target: { value: string } }) =>
    setItems((list) => list.map((item, n) => (n === i ? { ...item, [key]: e.target.value } : item)))

  const imageOf = (slot: string, fallback: unknown) => (images[slot] ? assetUrl(images[slot]) : String(fallback ?? ''))

  return (
    <section className="page owner owner--edit">
      <div className="owner__top">
        <div>
          <p className="page__kicker">Your page</p>
          <h2 className="page__title">{String(original.name)}</h2>
          <p className="owner__fine">Logged in as {me.username}</p>
        </div>
        <div className="owner__row">
          <Link className="owner__secondary owner__a" to={`/${found.route}/${String(original.id)}`}>
            View my page
          </Link>
          <button type="button" className="owner__link" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      {message ? (
        <p className={`owner__message${message.bad ? ' owner__message--bad' : ''}`} role="status">
          {message.text}
        </p>
      ) : null}

      <div className="owner__card">
        <h3>Your logo and photos</h3>
        <p className="owner__fine">Photos go live straight away. JPG, PNG or WebP, up to {MAX_MB} MB each.</p>
        <PhotoSlot
          label="Your logo"
          hint="Best on a transparent background (PNG)."
          current={imageOf('logo', merged.logoImg)}
          changed={!!images.logo}
          busy={busySlot === 'logo'}
          contain
          onPick={(f) => upload('logo', f)}
          onReset={() => remove('logo')}
        />
        <PhotoSlot
          label="Main photo"
          hint="The big photo at the top of your page."
          current={imageOf('hero', merged.heroImg)}
          changed={!!images.hero}
          busy={busySlot === 'hero'}
          onPick={(f) => upload('hero', f)}
          onReset={() => remove('hero')}
        />
        <PhotoSlot
          label="List photo"
          hint="The photo next to your name in the list."
          current={imageOf('highlight', merged.highlightImg)}
          changed={!!images.highlight}
          busy={busySlot === 'highlight'}
          onPick={(f) => upload('highlight', f)}
          onReset={() => remove('highlight')}
        />
        <PhotoSlot
          label="Story photo"
          hint="The photo next to your story."
          current={imageOf('lifestyle', merged.lifestyleImg)}
          changed={!!images.lifestyle}
          busy={busySlot === 'lifestyle'}
          onPick={(f) => upload('lifestyle', f)}
          onReset={() => remove('lifestyle')}
        />
      </div>

      <form onSubmit={save} noValidate>
        <div className="owner__card">
          <h3>Your text</h3>
          {TEXT_FIELDS.map((f) => (
            <label key={f.key}>
              {f.label}
              {f.rows === 1 ? (
                <input value={form[f.key] ?? ''} onChange={set(f.key)} maxLength={f.max} />
              ) : (
                <textarea value={form[f.key] ?? ''} onChange={set(f.key)} rows={f.rows} maxLength={f.max} />
              )}
              <small>
                {f.hint} <span>{(form[f.key] ?? '').length}/{f.max}</span>
              </small>
            </label>
          ))}
        </div>

        {items.length > 0 ? (
          <div className="owner__card">
            <h3>Your highlights</h3>
            <p className="owner__fine">The cards in the middle of your page. Save your text with the button below.</p>
            {items.map((item, i) => (
              <div key={i} className="owner__item">
                <PhotoSlot
                  label={`Highlight ${i + 1} photo`}
                  current={imageOf(`item${i}`, staticItems[i]?.img)}
                  changed={!!images[`item${i}`]}
                  busy={busySlot === `item${i}`}
                  onPick={(f) => upload(`item${i}`, f)}
                  onReset={() => remove(`item${i}`)}
                />
                <label>
                  Title
                  <input value={item.title ?? ''} onChange={setItem(i, 'title')} maxLength={80} />
                </label>
                <label>
                  Text
                  <textarea value={item.text ?? ''} onChange={setItem(i, 'text')} rows={3} maxLength={300} />
                </label>
              </div>
            ))}
          </div>
        ) : null}

        <div className="owner__card">
          <h3>Contact details</h3>
          {CONTACT_FIELDS.map((f) => (
            <label key={f.key}>
              {f.label}
              <input
                type={f.type ?? 'text'}
                value={form[f.key] ?? ''}
                onChange={set(f.key)}
                maxLength={f.max}
                autoCapitalize="none"
              />
              <small>{f.hint}</small>
            </label>
          ))}
        </div>

        <div className="owner__savebar">
          <button className="owner__primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save my text'}
          </button>
        </div>
      </form>

      <div className="owner__card">
        <h3>More photos</h3>
        <p className="owner__fine">
          Add up to 12 extra photos. They appear in a gallery at the bottom of your page.
        </p>
        {gallery.length > 0 ? (
          <ul className="owner__gallery">
            {gallery.map((url) => (
              <li key={url}>
                <img src={assetUrl(url)} alt="" />
                <button
                  type="button"
                  className="owner__remove"
                  disabled={busySlot === url}
                  aria-label="Remove this photo"
                  onClick={() => remove('gallery', url)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <button
          type="button"
          className="owner__secondary"
          disabled={busySlot === 'gallery' || gallery.length >= 12}
          onClick={() => galleryInput.current?.click()}
        >
          {busySlot === 'gallery' ? 'Uploading…' : gallery.length >= 12 ? 'Gallery is full' : 'Add photos'}
        </button>
        <input
          ref={galleryInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? [])
            e.target.value = ''
            for (const file of files.slice(0, 12 - gallery.length)) await upload('gallery', file)
          }}
        />
      </div>
    </section>
  )
}
