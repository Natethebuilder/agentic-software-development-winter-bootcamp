import { useRef, useState } from 'react'
import { REGISTRATION, SESSION_DATES, SESSIONS, registrationSlotId } from '../content.js'
import s from './RegistrationForm.module.css'

// The token is the only registration state this browser keeps.
const TOKEN_KEY = 'agentic-software-development-winter-bootcamp:registration-token'

function readRegistrationToken() {
  try { return localStorage.getItem(TOKEN_KEY) || '' } catch { return '' }
}

function saveRegistrationToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token) } catch { /* ignore */ }
}

function clearRegistrationToken() {
  try { localStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
}

export default function RegistrationForm() {
  const companyInput = useRef(null)
  const [slots, setSlots] = useState([])
  const [activeDate, setActiveDate] = useState(SESSION_DATES[0].id)
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [emailConfirmation, setEmailConfirmation] = useState('')
  const [registrationToken, setRegistrationToken] = useState(readRegistrationToken)
  const [consent, setConsent] = useState(false)
  // idle | submitting | received | updated | error
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const normalizedEmail = email.trim().toLowerCase()
  const normalizedConfirmation = emailConfirmation.trim().toLowerCase()
  const emailsMatch = Boolean(normalizedEmail) && normalizedEmail === normalizedConfirmation
  const emailMismatch = Boolean(emailConfirmation) && !emailsMatch
  const valid = slots.length > 0 && company.trim() && emailsMatch && consent
  const selectedDateCount = new Set(slots.map((slot) => slot.split('|')[0])).size
  const done = status === 'received' || status === 'updated'

  const toggleSlot = (id) => setSlots((current) => (
    current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  ))

  // For shared devices: forget this browser's registration and start an empty one.
  const startNewRegistration = () => {
    clearRegistrationToken()
    setRegistrationToken('')
    setSlots([])
    setActiveDate(SESSION_DATES[0].id)
    setCompany('')
    setEmail('')
    setEmailConfirmation('')
    setConsent(false)
    setStatus('idle')
    setMessage('')
    companyInput.current?.focus()
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!valid || status === 'submitting') return
    setStatus('submitting')
    setMessage('')
    try {
      let result
      if (import.meta.env.DEV) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        result = {
          outcome: registrationToken ? 'updated' : 'received',
          registrationToken: registrationToken || crypto.randomUUID(),
        }
      } else {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company: company.trim(),
            email: normalizedEmail,
            emailConfirmation: normalizedConfirmation,
            registrationToken,
            sessions: slots,
            consent,
          }),
        })
        result = (await response.json().catch(() => null)) || {}
        // A 409 means the email does not match this browser's saved registration. The token is
        // kept so the person can correct the address, or start a new registration instead.
        if (!response.ok || result.ok !== true) throw new Error(result.error || 'Registration could not be saved')
      }
      if (result.registrationToken) {
        saveRegistrationToken(result.registrationToken)
        setRegistrationToken(result.registrationToken)
      }
      const outcome = result.outcome === 'updated' ? 'updated' : 'received'
      setStatus(outcome)
      setMessage(REGISTRATION[outcome])
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  return (
    <form className={s.form} onSubmit={submit}>
      <div className={s.ticketNotice}>
        <span aria-hidden="true">GH</span>
        <div>
          <strong>GitHub organization access</strong>
          <p>A few days before the event, your invitation will include the link to join the event GitHub organization. GitHub Copilot AI credits are provided in the environment.</p>
        </div>
      </div>

      <div className={s.fields}>
        <label className={s.companyField}>
          <span>Company or organisation</span>
          <input ref={companyInput} required autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
        <label>
          <span>Company email address</span>
          <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <span>Re-enter company email address</span>
          <input
            required
            type="email"
            autoComplete="off"
            aria-invalid={emailMismatch}
            value={emailConfirmation}
            onChange={(e) => setEmailConfirmation(e.target.value)}
          />
          {emailConfirmation && <small className={emailsMatch ? s.emailMatch : s.emailMismatch}>{emailsMatch ? 'Email addresses match.' : 'Email addresses do not match.'}</small>}
        </label>
      </div>

      <fieldset className={s.sessionField}>
        <legend>Choose your dates and session times</legend>
        <p className={s.sessionHint}>{REGISTRATION.slotHelp}</p>
        <div className={s.dateTabs} role="tablist" aria-label="Choose a bootcamp date">
          {SESSION_DATES.map((date) => {
            const count = slots.filter((slot) => slot.startsWith(`${date.id}|`)).length
            return (
              <button
                key={date.id}
                type="button"
                role="tab"
                aria-selected={date.id === activeDate}
                className={date.id === activeDate ? s.dateTabOn : ''}
                onClick={() => setActiveDate(date.id)}
              >
                <span>{date.short}</span>
                <small>{count ? `${count} selected` : 'Choose sessions'}</small>
              </button>
            )
          })}
        </div>
        <div className={s.sessionGrid} role="tabpanel">
          {SESSIONS.map((session) => {
            const id = registrationSlotId(activeDate, session)
            const selected = slots.includes(id)
            return (
              <label key={session.id} className={selected ? s.sessionOn : ''}>
                <input type="checkbox" checked={selected} onChange={() => toggleSlot(id)} />
                <time dateTime={`${activeDate}T${session.time}`}>{session.time}</time>
                <span><strong>{session.number} · {session.title}</strong><small>{session.subtitle}</small></span>
                <i aria-hidden="true">{selected ? '✓' : '+'}</i>
              </label>
            )
          })}
        </div>
        <p className={s.selectionSummary}>
          {slots.length
            ? `${slots.length} session time${slots.length === 1 ? '' : 's'} selected across ${selectedDateCount} date${selectedDateCount === 1 ? '' : 's'}`
            : 'No date or session time selected yet'}
        </p>
      </fieldset>

      <label className={s.consent}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{REGISTRATION.consent}</span>
      </label>

      <div className={s.submitRow}>
        <button type="submit" disabled={!valid || status === 'submitting' || done}>
          {status === 'submitting' ? 'Saving…' : status === 'received' ? 'Received ✓' : status === 'updated' ? 'Updated ✓' : 'Submit registration'}
        </button>
        <small>No GitHub sign-in is required. The organization invitation is sent to your confirmed company email.</small>
      </div>
      {message && <p className={`${s.message} ${status === 'error' ? s.error : ''}`} role="status">{message}</p>}
      {registrationToken && (
        <div className={s.newRegistration}>
          <span>This browser has already sent a registration.</span>
          <button type="button" onClick={startNewRegistration} disabled={status === 'submitting'}>
            Not you? Start a new registration
          </button>
        </div>
      )}
    </form>
  )
}
