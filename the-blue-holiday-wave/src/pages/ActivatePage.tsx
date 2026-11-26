import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { OwnerError, ownerApi } from '../lib/owner'
import { prepareForm } from '../lib/community'
import './OwnerPages.css'

export function ActivatePage() {
  const { token = '' } = useParams()
  const navigate = useNavigate()
  const [pageName, setPageName] = useState('')
  const [problem, setProblem] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [again, setAgain] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    prepareForm()
    ownerApi
      .activationInfo(token)
      .then((info) => setPageName(info.partnerName))
      .catch((e) => setProblem(e instanceof OwnerError ? e.message : 'This link does not work.'))
  }, [token])

  async function submit(e: { preventDefault: () => void }) {
    e.preventDefault()
    setError('')
    if (password !== again) {
      setError('The two passwords are not the same.')
      return
    }
    setBusy(true)
    try {
      await ownerApi.activate(token, username, password)
      navigate('/edit', { replace: true })
    } catch (err) {
      setError(err instanceof OwnerError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="page owner">
      <p className="page__kicker">Welcome to the Blue Wave Family</p>
      <h2 className="page__title">Activate your page</h2>

      {problem ? (
        <div className="owner__card">
          <p className="owner__error" role="alert">
            {problem}
          </p>
        </div>
      ) : !pageName ? (
        <p className="page__lead">Checking your link…</p>
      ) : (
        <>
          <p className="page__lead">
            You are about to take over <strong>{pageName}</strong>. Choose your own username and
            password. We never see your password.
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
                maxLength={30}
                required
              />
              <small>3 to 30 characters: letters, numbers, dot, dash or underscore.</small>
            </label>
            <label>
              Password
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                maxLength={100}
                required
              />
              <small>At least 10 characters. A few words together make a strong password.</small>
            </label>
            <label>
              Password again
              <input
                type={show ? 'text' : 'password'}
                value={again}
                onChange={(e) => setAgain(e.target.value)}
                autoComplete="new-password"
                maxLength={100}
                required
              />
            </label>
            <label className="owner__check">
              <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
              Show password
            </label>
            {error ? (
              <p className="owner__error" role="alert">
                {error}
              </p>
            ) : null}
            <button className="owner__primary" type="submit" disabled={busy}>
              {busy ? 'Activating…' : 'Activate and start editing'}
            </button>
          </form>
        </>
      )}
    </section>
  )
}
