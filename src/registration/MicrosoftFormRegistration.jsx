import { useEffect, useRef, useState } from 'react'
import { REGISTRATION_FORM } from '../content.js'
import { REGISTRATION_FORM_EMBED_URL, REGISTRATION_FORM_URL } from '../siteState.js'
import s from './MicrosoftFormRegistration.module.css'

// Registration state 4: registrations go to this bootcamp's Microsoft Form, embedded on the page.

function FormFrame({ frameRef }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={s.frameWrap}>
      {!loaded && <p className={s.loading} aria-hidden="true">{REGISTRATION_FORM.loading}</p>}
      <iframe
        ref={frameRef}
        className={s.frame}
        src={REGISTRATION_FORM_EMBED_URL}
        title={REGISTRATION_FORM.frameTitle}
        onLoad={() => setLoaded(true)}
        allowFullScreen
      />
    </div>
  )
}

function NewTabLink() {
  return (
    <a className={s.newTab} href={REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer">
      {REGISTRATION_FORM.newTab} <span aria-hidden="true">↗</span>
    </a>
  )
}

function Toolbar() {
  return (
    <div className={s.toolbar}>
      <small>{REGISTRATION_FORM.provider}</small>
      <NewTabLink />
    </div>
  )
}

// The landing site's register section. Nothing loads from Microsoft Forms until the visitor starts.
export default function MicrosoftFormRegistration() {
  const [started, setStarted] = useState(false)
  const cardRef = useRef(null)
  const frameRef = useRef(null)

  // The Start button disappears, so bring the whole form card into view below the sticky nav and move focus to the form.
  useEffect(() => {
    if (!started) return
    cardRef.current?.scrollIntoView({ block: 'start' })
    frameRef.current?.focus({ preventScroll: true })
  }, [started])

  if (started) {
    return (
      <div ref={cardRef} className={`${s.card} ${s.started}`}>
        <Toolbar />
        <FormFrame frameRef={frameRef} />
      </div>
    )
  }

  return (
    <div className={s.card}>
      <div className={s.intro}>
        <span className={s.mark} aria-hidden="true">{REGISTRATION_FORM.mark}</span>
        <div>
          <small className={s.badge}><i aria-hidden="true" />{REGISTRATION_FORM.badge}</small>
          <h3>{REGISTRATION_FORM.heading}</h3>
          <p>{REGISTRATION_FORM.body}</p>
        </div>
      </div>
      <ul className={s.needs}>
        {REGISTRATION_FORM.needs.map((need) => (
          <li key={need.title}>
            <strong>{need.title}</strong>
            <span>{need.desc}</span>
          </li>
        ))}
      </ul>
      <div className={s.actions}>
        <div className={s.access}>
          <span aria-hidden="true">GH</span>
          <p><strong>{REGISTRATION_FORM.access.title}</strong> {REGISTRATION_FORM.access.body}</p>
        </div>
        <button type="button" className={s.start} onClick={() => setStarted(true)}>
          {REGISTRATION_FORM.start} <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className={s.footer}>
        <NewTabLink />
        <small>{REGISTRATION_FORM.providerBeforeStart}</small>
      </div>
    </div>
  )
}

// The deck's registration dialog. Opening the dialog is already the visitor's choice, so the form loads at once.
export function MicrosoftFormDialogBody() {
  return (
    <div className={s.dialog}>
      <Toolbar />
      <FormFrame />
    </div>
  )
}
