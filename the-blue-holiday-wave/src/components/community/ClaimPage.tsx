import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { CommunityError, postClaim, prepareForm } from '../../lib/community'
import './community.css'

type Props = {
  partnerId: string
  partnerName: string
  /** restaurant, store, agency, company ... used in the small text */
  noun: string
}

export function ClaimPage({ partnerId, partnerName, noun }: Props) {
  const formId = useId()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<'emailed' | 'received' | 'local' | null>(null)
  const [form, setForm] = useState({ ownerName: '', email: '', phone: '', message: '', website: '' })

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  async function submit(e: { preventDefault: () => void }) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      setDone(await postClaim({ partner: partnerId, partnerName, ...form }))
    } catch (err) {
      setError(err instanceof CommunityError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <aside className="claim" aria-labelledby={`${formId}-title`}>
      <button
        type="button"
        id={`${formId}-title`}
        className="claim__btn"
        aria-expanded={open}
        aria-controls={`${formId}-form`}
        onClick={() => {
          prepareForm()
          setOpen((v) => !v)
        }}
      >
        <span className="claim__btn-shine" aria-hidden="true" />
        <span className="claim__btn-icon" aria-hidden="true">
          ✦
        </span>
        CLAIM THIS PAGE
      </button>
      <p className="claim__text">
        If you are the owner of this {noun}, you can claim this page. You will get full control
        over the management of this page and you can change photos, change text, and add new
        photos.
      </p>

      <p className="claim__login">
        Already claimed? <Link to="/owner">Log in to edit your page</Link>
      </p>

      {open ? (
        <div id={`${formId}-form`} className="claim__panel">
          {done ? (
            <p className="claim__done" role="status">
              {done === 'emailed'
                ? 'Thank you! We just emailed you a confirmation. Your request is being processed and will be confirmed within 4 hours.'
                : done === 'received'
                  ? 'Thank you! We received your request. It is being processed and will be confirmed within 4 hours.'
                  : 'Preview mode: this request was only kept on this device. On the live website it is sent to us.'}
            </p>
          ) : (
            <form onSubmit={submit} noValidate>
              <h4>Claim {partnerName}</h4>
              <label>
                Your name
                <input
                  value={form.ownerName}
                  onChange={set('ownerName')}
                  autoComplete="name"
                  maxLength={80}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                  maxLength={120}
                  required
                />
              </label>
              <label>
                Phone (optional)
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  autoComplete="tel"
                  maxLength={40}
                />
              </label>
              <label>
                How can we confirm you are the owner?
                <textarea
                  value={form.message}
                  onChange={set('message')}
                  rows={3}
                  maxLength={800}
                  placeholder="For example your role, or the business email or phone number we can call."
                />
              </label>
              <input
                className="hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={set('website')}
                name="website"
              />
              {error ? (
                <p className="community__error" role="alert">
                  {error}
                </p>
              ) : null}
              <button type="submit" className="community__submit" disabled={busy}>
                {busy ? 'Sending…' : 'Send claim request'}
              </button>
              <p className="community__fine">
                We only use these details to contact you about this page.
              </p>
            </form>
          )}
        </div>
      ) : null}
    </aside>
  )
}
