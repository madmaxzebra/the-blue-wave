import { useEffect, useState } from 'react'

import {
  fetchSubscriberCount,
  formatSubscriberCount,
  readCachedSubscriberCount,
  submitStayUpdatedSignup,
} from '../lib/stayUpdated'
import './StayUpdatedBox.css'

const LOADING_MESSAGES = [
  'Verifying your email…',
  'Adding you to the list…',
  'Sending your welcome email…',
] as const

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

function SubscriberCounter({ count }: { count: number | null }) {
  return (
    <p className="stay-updated__counter" aria-live="polite">
      <strong className="stay-updated__counter-number">
        {count === null ? '…' : formatSubscriberCount(count)}
      </strong>{' '}
      subscribers and counting
    </p>
  )
}

export function StayUpdatedBox() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')
  const [loadingHint, setLoadingHint] = useState<string>(LOADING_MESSAGES[0])
  const [subscriberCount, setSubscriberCount] = useState<number | null>(() =>
    readCachedSubscriberCount(),
  )

  useEffect(() => {
    let cancelled = false
    const refresh = () => {
      void fetchSubscriberCount().then((count) => {
        if (!cancelled && count !== null) setSubscriberCount(count)
      })
    }
    refresh()
    const interval = window.setInterval(refresh, 15_000)
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  useEffect(() => {
    if (status !== 'loading') {
      setLoadingHint(LOADING_MESSAGES[0])
      return
    }
    let index = 0
    setLoadingHint(LOADING_MESSAGES[0])
    const interval = window.setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length
      setLoadingHint(LOADING_MESSAGES[index])
    }, 1800)
    return () => window.clearInterval(interval)
  }, [status])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const form = e.currentTarget
      const botcheck = form.botcheck instanceof HTMLInputElement ? form.botcheck.checked : false
      if (botcheck) {
        setStatus('idle')
        return
      }
      const result = await submitStayUpdatedSignup(email)
      if (result.ok) {
        setStatus('success')
        setMessage(result.message)
        setEmail('')
        setSubscriberCount((prev) => {
          const base = prev ?? 0
          if (typeof result.subscriberCount === 'number') {
            if (result.subscriberAdded) {
              return Math.max(result.subscriberCount, base + 1)
            }
            return Math.max(result.subscriberCount, base)
          }
          return result.subscriberAdded ? base + 1 : prev
        })
        return
      }
      setStatus('error')
      setMessage(result.message)
    } catch (err) {
      setStatus('error')
      const msg = err instanceof Error ? err.message : 'Please try again later.'
      setMessage(msg === 'Failed to fetch' ? 'Network error — please try again.' : msg)
    }
  }

  return (
    <div
      id="stay-updated"
      className="stay-updated"
      aria-labelledby="stay-updated-heading"
    >
      <h2 id="stay-updated-heading" className="stay-updated__title">
        Stay Updated
      </h2>
      <SubscriberCounter count={subscriberCount} />
      <form onSubmit={handleSubmit} className="stay-updated__form">
        <input
          type="checkbox"
          name="botcheck"
          id="stay-updated-botcheck"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="stay-updated__honeypot"
        />
        <input
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="you@email.com"
          disabled={status === 'loading'}
          required
          aria-label="Email address"
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Please wait…' : 'Notify Me'}
        </button>
      </form>
      {status === 'loading' && (
        <p className="stay-updated__hint" aria-live="polite" role="status">
          {loadingHint}
        </p>
      )}
      {message && (
        <p
          className={
            status === 'success' ? 'stay-updated__message--ok' : 'stay-updated__message--err'
          }
        >
          {message}
        </p>
      )}
    </div>
  )
}