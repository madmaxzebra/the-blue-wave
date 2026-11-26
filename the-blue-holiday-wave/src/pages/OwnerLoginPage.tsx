import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OwnerError, ownerApi } from '../lib/owner'
import './OwnerPages.css'

export function OwnerLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: { preventDefault: () => void }) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await ownerApi.login(username, password)
      navigate('/edit', { replace: true })
    } catch (err) {
      setError(err instanceof OwnerError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="page owner">
      <p className="page__kicker">Page owners</p>
      <h2 className="page__title">Log in to edit your page</h2>
      <p className="page__lead">
        Use the username and password you chose when you activated your page.
      </p>
      <form className="owner__card" onSubmit={submit} noValidate>
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error ? (
          <p className="owner__error" role="alert">
            {error}
          </p>
        ) : null}
        <button className="owner__primary" type="submit" disabled={busy}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>
        <p className="owner__fine">
          Forgot your password? Reply to your approval email and we will help you.
        </p>
      </form>
    </section>
  )
}
