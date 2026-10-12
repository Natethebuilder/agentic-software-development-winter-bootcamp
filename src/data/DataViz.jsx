import { useEffect, useState } from 'react'
import { PIPELINE, SESSION_DATES, SESSIONS, TERMINAL_SCRIPTS } from '../content.js'
import d from './Data.module.css'

/* ── Countdown to the first session, styled as a scheduled pipeline run ── */
export function Countdown({ target, date, dateLabel, className = '' }) {
  const t = target ? new Date(target).getTime() : null
  const dateOnly = !t && date ? new Date(`${date}T12:00:00`) : null
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!t) return undefined
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [t])

  const diff = t == null ? null : Math.max(0, t - now)
  const parts = diff != null
    ? [
        Math.floor(diff / 86400000),
        Math.floor(diff / 3600000) % 24,
        Math.floor(diff / 60000) % 60,
        Math.floor(diff / 1000) % 60,
      ].map((n) => String(n).padStart(2, '0'))
    : dateOnly
      ? [
          String(dateOnly.getDate()).padStart(2, '0'),
          dateOnly.toLocaleString('en', { month: 'short' }).toUpperCase(),
          String(dateOnly.getFullYear()),
          dateOnly.toLocaleString('en', { weekday: 'short' }).toUpperCase(),
        ]
      : ['--', '--', '--', '--']
  const labels = dateOnly ? ['day', 'month', 'year', 'starts'] : ['days', 'hrs', 'min', 'sec']
  const status = t == null ? (dateOnly ? 'dates confirmed' : 'awaiting schedule') : diff > 0 ? 'scheduled' : 'live now'
  const statusClass = t == null ? (dateOnly ? d.statusOk : d.statusWait) : diff > 0 ? d.statusOk : d.statusLive

  return (
    <div className={`${d.countdown} ${className}`} role={t ? 'timer' : 'group'} aria-live="off">
      <div className={d.cdHead}>
        <span className={d.mono}>▸ next run · session_01</span>
        <span className={`${d.status} ${statusClass}`}><i />{status}</span>
      </div>
      <div className={d.cdDigits}>
        {labels.map((label, i) => (
          <div key={label} className={d.cdCell}>
            <span className={`${d.cdNum} ${t == null && !dateOnly ? d.cdPending : ''}`}>{parts[i]}</span>
            <span className={d.cdLabel}>{label}</span>
          </div>
        ))}
      </div>
      {(t != null || dateLabel) && (
        <p className={d.cdFoot}>
          First session: {t != null ? new Date(t).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) : dateLabel}
        </p>
      )}
    </div>
  )
}

/* ── Copilot CLI terminal that rotates through the delivery lifecycle ── */
export function AgentTerminal({ className = '', children }) {
  const [scriptIndex, setScriptIndex] = useState(0)
  const { workspace, prompt, lines } = TERMINAL_SCRIPTS[scriptIndex]
  const [chars, setChars] = useState(0)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    let id
    if (chars < prompt.length) id = setTimeout(() => setChars((c) => c + 1), 24)
    else if (shown < lines.length) id = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 700 : 520)
    else {
      id = setTimeout(() => {
        setChars(0)
        setShown(0)
        setScriptIndex((current) => (current + 1) % TERMINAL_SCRIPTS.length)
      }, 4200)
    }
    return () => clearTimeout(id)
  }, [chars, shown, prompt.length, lines.length, scriptIndex])

  const typing = chars < prompt.length
  const working = !typing && shown < lines.length

  return (
    <div className={`${d.terminal} ${className}`}>
      {children}
      <div className={d.termBar}>
        <span className={d.dots}><i /><i /><i /></span>
        <span className={d.termTitle}>copilot · {workspace}</span>
      </div>
      <div className={d.termBody} aria-label={`Example: ${prompt}`}>
        <p className={d.termDim}>$ copilot</p>
        <p className={d.termPrompt}>
          <span className={d.termUser}>›</span> {prompt.slice(0, chars)}
          {typing && <span className={d.caret} />}
        </p>
        <ul className={d.termLines}>
          {lines.slice(0, shown).map((l) => (
            <li key={l.text} className={d[`line_${l.kind}`]}>
              <span className={d.lineIcon}>{l.kind === 'ok' ? '✓' : l.kind === 'done' ? '★' : '●'}</span>
              <span className={d.lineText}>{l.text}</span>
              {l.meta && <span className={d.lineMeta}>{l.meta}</span>}
            </li>
          ))}
          {working && (
            <li className={d.line_info}>
              <span className={d.spinner} />
              <span className={d.termDim}>working…</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

/* ── Placeholder Friday schedule and the shared delivery lifecycle ── */
export function ProgrammeBoard() {
  return (
    <div className={d.programmeBoard}>
      <div className={d.programmeHead}>
        <div>
          <span>programme.yml</span>
          <strong>Six placeholder Fridays · 36 selectable sessions</strong>
        </div>
        <p>Every session is available on every placeholder date. Dates, topics and owners remain TBC until the programme is confirmed.</p>
      </div>
      <div className={d.scheduleDates}>
        {SESSION_DATES.map((date) => (
          <article key={date.id} className={d.scheduleDate}>
            <header>
              <span><b>{date.day}</b>{date.month}</span>
              <div><strong>{date.label}</strong><small>Placeholder date · final schedule TBC</small></div>
            </header>
            <div className={d.scheduleSlots}>
              {SESSIONS.map((session) => (
                <span key={`${date.id}-${session.id}`} style={{ '--slot-accent': session.accent }}>
                  <time dateTime={`${date.id}T${session.time}`}>{session.time}</time>
                  <b>{session.shortTitle}</b>
                  <small>Topic TBC</small>
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className={d.lifecycle} aria-label="Software delivery lifecycle">
        {PIPELINE.map((stage, index) => (
          <span key={stage.id} style={{ '--stage-accent': stage.color }}>
            <b>{String(index + 1).padStart(2, '0')}</b>{stage.label}
          </span>
        ))}
      </div>
    </div>
  )
}
