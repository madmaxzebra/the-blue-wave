import { useEffect, useId, useState } from 'react'
import { CommunityError, getReviews, postReview, type ReviewSummary } from '../../lib/community'
import { StarsDisplay, StarsInput } from './Stars'
import './community.css'

type Props = {
  partnerId: string
  partnerName: string
}

function dateLabel(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function ReviewSection({ partnerId, partnerName }: Props) {
  const id = useId()
  const [summary, setSummary] = useState<ReviewSummary | null>(null)
  const [rating, setRating] = useState(0)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [website, setWebsite] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [thanks, setThanks] = useState(false)

  useEffect(() => {
    let alive = true
    setSummary(null)
    setThanks(false)
    setRating(0)
    setText('')
    getReviews(partnerId).then((s) => alive && setSummary(s))
    return () => {
      alive = false
    }
  }, [partnerId])

  async function submit(e: { preventDefault: () => void }) {
    e.preventDefault()
    setError('')
    if (!rating) {
      setError('Please choose 1 to 5 stars.')
      return
    }
    if (text.trim().length < 3) {
      setError('Please write a short review.')
      return
    }
    setBusy(true)
    try {
      setSummary(await postReview(partnerId, { name, rating, text, website }))
      setThanks(true)
      setRating(0)
      setText('')
    } catch (err) {
      setError(err instanceof CommunityError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="reviews" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="fashion-store__section">
        Reviews
      </h3>

      <div className="reviews__summary">
        {summary && summary.count > 0 ? (
          <>
            <strong className="reviews__avg">{summary.average.toFixed(1)}</strong>
            <StarsDisplay value={summary.average} />
            <span className="reviews__count">
              {summary.count} review{summary.count === 1 ? '' : 's'}
            </span>
          </>
        ) : (
          <span className="reviews__count">
            {summary ? `No reviews yet. Be the first to review ${partnerName}!` : 'Loading reviews…'}
          </span>
        )}
      </div>

      {summary && summary.reviews.length > 0 ? (
        <ul className="reviews__list">
          {summary.reviews.slice(0, 8).map((r) => (
            <li key={r.id} className="reviews__item">
              <div className="reviews__item-head">
                <StarsDisplay value={r.rating} size="sm" />
                <strong>{r.name}</strong>
                <time dateTime={r.created}>{dateLabel(r.created)}</time>
              </div>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>
      ) : null}

      <form className="reviews__form" onSubmit={submit} noValidate>
        <h4>Leave a review</h4>
        {thanks ? (
          <p className="community__done" role="status">
            Thank you for your review!
          </p>
        ) : null}
        <StarsInput value={rating} onChange={setRating} name={`${id}-rating`} />
        <label>
          Your name (optional)
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoComplete="given-name" />
        </label>
        <label>
          Your review
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder={`What did you think of ${partnerName}?`}
          />
          <span className="community__count">{text.length}/500</span>
        </label>
        <input
          className="hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          name="website"
        />
        {error ? (
          <p className="community__error" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="community__submit" disabled={busy}>
          {busy ? 'Sending…' : 'Post review'}
        </button>
        <p className="community__fine">
          Please keep it friendly and leave out web links. Reviews are public.
          {summary?.mode === 'local' ? ' Preview mode: reviews are only kept on this device.' : ''}
        </p>
      </form>
    </section>
  )
}
