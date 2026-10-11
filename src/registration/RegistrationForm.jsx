import { useEffect, useState } from 'react'
import { EVENT, REGISTRATION, SESSIONS } from '../content.js'

async function loadPrincipal() {
  if (import.meta.env.DEV) {
    return { identityProvider: 'github', userDetails: 'preview-github-user', userId: 'local-preview' }
  }

  const response = await fetch('/.auth/me', { headers: { Accept: 'application/json' } })
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('GitHub authentication is unavailable.')
  }
  const payload = await response.json()
  return payload.clientPrincipal
}

export default function RegistrationForm({ postLoginRedirect = '/?register=1' }) {
  const [principal, setPrincipal] = useState(undefined)
  const [authError, setAuthError] = useState('')
  const [sessions, setSessions] = useState([])
  const [organisation, setOrganisation] = useState('')
  const [email, setEmail] = useState('')
  const [environment, setEnvironment] = useState('browser')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadPrincipal()
      .then(setPrincipal)
      .catch((error) => {
        setPrincipal(null)
        setAuthError(error.message)
      })
  }, [])

  const signedIn = principal?.identityProvider === 'github'
  const isValid = signedIn && sessions.length > 0 && organisation.trim() && email.trim() && consent
  const loginUrl = `/.auth/login/github?post_login_redirect_uri=${encodeURIComponent(postLoginRedirect)}`

  const toggleSession = (id) => {
    setSessions((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!isValid || status === 'submitting') return

    setStatus('submitting')
    setMessage('')

    try {
      if (import.meta.env.DEV) {
        await new Promise((resolve) => window.setTimeout(resolve, 550))
      } else {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: EVENT.registrationEventId,
            organisation: organisation.trim(),
            email: email.trim(),
            sessions,
            environment,
            consent,
          }),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Registration could not be saved.')
      }

      setStatus('success')
      setMessage(`Thanks @${principal.userDetails}. Your registration is saved and can be updated later.`)
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  if (principal === undefined) {
    return <div className="auth-card"><span className="spinner" /> Checking GitHub sign-in…</div>
  }

  if (!signedIn) {
    return (
      <div className="auth-card">
        <img src="/github-mark.svg" alt="" />
        <div>
          <h3>Sign in with GitHub to register</h3>
          <p>Your verified handle anchors one updateable event registration.</p>
          {authError && <small>{authError}</small>}
        </div>
        <a className="button button-primary" href={loginUrl}>Continue with GitHub</a>
      </div>
    )
  }

  return (
    <form className="registration-form" onSubmit={submit}>
      <div className="verified-identity">
        <img src="/github-mark.svg" alt="" />
        <div>
          <span>Verified GitHub account</span>
          <strong>@{principal.userDetails}</strong>
        </div>
        {!import.meta.env.DEV && (
          <a href="/.auth/logout?post_logout_redirect_uri=/">Use another account</a>
        )}
      </div>

      <div className="form-fields">
        <label>
          <span>Company or organisation</span>
          <input
            required
            maxLength="160"
            autoComplete="organization"
            value={organisation}
            onChange={(event) => setOrganisation(event.target.value)}
          />
        </label>
        <label>
          <span>Company email address</span>
          <input
            required
            maxLength="254"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
      </div>

      <fieldset className="session-picker">
        <legend>Choose your sessions</legend>
        <div>
          {SESSIONS.map((session) => {
            const checked = sessions.includes(session.id)
            return (
              <label key={session.id} className={checked ? 'is-selected' : ''}>
                <input type="checkbox" checked={checked} onChange={() => toggleSession(session.id)} />
                <span><strong>Session {session.number}</strong><small>{session.title}</small></span>
                <i>{checked ? '✓' : '+'}</i>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="environment-picker">
        <legend>Preferred environment</legend>
        <div>
          {REGISTRATION.environments.map((option) => (
            <label key={option.id}>
              <input
                type="radio"
                name="environment"
                value={option.id}
                checked={environment === option.id}
                onChange={(event) => setEnvironment(event.target.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="consent-field">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        <span>{REGISTRATION.consent}</span>
      </label>

      <div className="submit-row">
        <button className="button button-primary" type="submit" disabled={!isValid || status === 'submitting' || status === 'success'}>
          {status === 'submitting' ? 'Saving…' : status === 'success' ? 'Registered ✓' : 'Submit registration'}
        </button>
        <small>GitHub supplies identity only. We never ask for or store your GitHub password.</small>
      </div>
      {message && <p className={`form-message ${status}`} role="status">{message}</p>}
    </form>
  )
}
