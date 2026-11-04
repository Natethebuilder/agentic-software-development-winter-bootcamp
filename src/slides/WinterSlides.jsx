import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BottomBar, Editable, Slide, useSlides } from '@deckio/deck-engine'
import PillarMark from '../agentic/PillarMark.jsx'
import RegistrationForm from '../registration/RegistrationForm.jsx'
import { Logos, Mascot } from '../winter/Decor.jsx'
import {
  BOOTCAMP, DATES_NOTE, GITHUB_ACCESS, PERSONAS, PILLARS, PREP, PREREQUISITES, REGISTER_STEPS, REGISTRATION_SOON,
  SESSION_DATES, SESSIONS, TEAM,
} from '../content.js'
import { PREREQUISITES_STATE, REGISTRATION_OPEN } from '../siteState.js'
import s from './Slides.module.css'

function SlideProgress({ index }) {
  const { visibleIndices = [], totalSlides } = useSlides()
  const order = visibleIndices.length ? visibleIndices : Array.from({ length: totalSlides }, (_, i) => i)
  const pos = Math.max(0, order.indexOf(index))
  const progress = ((pos + 1) / order.length) * 100
  return (
    <div className="slide-delivery-progress" aria-hidden="true">
      <span style={{ width: `${progress}%` }} />
      {Array.from({ length: 6 }, (_, node) => <i key={node} className={progress >= ((node + 1) / 6) * 100 ? 'is-complete' : ''} />)}
    </div>
  )
}

function Frame({ index, id, children, orbs = ['orbIce', 'orbPine'] }) {
  return (
    <Slide index={index} className={s.slide}>
      <SlideProgress index={index} />
      {orbs.map((o) => <div key={o} className={`orb ${s[o]}`} />)}
      <div className={`${s.body} content-frame content-gutter`}>{children}</div>
      <BottomBar text={<Editable as="span" id={`${id}.footer`}>{BOOTCAMP.footer}</Editable>} />
    </Slide>
  )
}

function Header({ id, eyebrow, title, subtitle }) {
  return (
    <div className={s.header}>
      <Editable as="p" id={`${id}.eyebrow`} className={s.eyebrow}>{eyebrow}</Editable>
      <Editable as="h1" id={`${id}.title`}>{title}</Editable>
      {subtitle && <Editable as="p" id={`${id}.subtitle`} multiline className={s.subtitle}>{subtitle}</Editable>}
    </div>
  )
}

const stopPropagation = (event) => event.stopPropagation()

function RegistrationDialog({ onClose }) {
  const titleId = useId()
  const dialogRef = useRef(null)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape, true)
    return () => window.removeEventListener('keydown', closeOnEscape, true)
  }, [onClose])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  return createPortal(
    <div
      className={s.registrationOverlay}
      role="presentation"
      onPointerDown={stopPropagation}
      onTouchStart={stopPropagation}
      onTouchEnd={stopPropagation}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={s.registrationModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={stopPropagation}
        onKeyDown={stopPropagation}
      >
        <div className={s.registrationModalHeader}>
          <div>
            <span>{BOOTCAMP.name}</span>
            <h2 id={titleId}>Bootcamp registration</h2>
          </div>
          <button type="button" aria-label="Close registration" onClick={onClose}>×</button>
        </div>
        <RegistrationForm />
      </div>
    </div>,
    document.body,
  )
}

function RegistrationButton({ className, initiallyOpen = false, children }) {
  const [open, setOpen] = useState(initiallyOpen)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <button type="button" className={className} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {children}
      </button>
      {open && <RegistrationDialog onClose={close} />}
    </>
  )
}

export function WinterTitleSlide({ index }) {
  return (
    <Slide index={index} className={s.slide}>
      <SlideProgress index={index} />
      <div className={`orb ${s.orbIce}`} />
      <div className={`orb ${s.orbHolly}`} />
      <div className={`orb ${s.orbPine}`} />
      <div className={`${s.hero} content-frame content-gutter`}>
        <div>
          <span className={s.pill}><Editable as="span" id="title.pill">{BOOTCAMP.season} edition · Online</Editable></span>
          <h1>
            <Editable as="span" id="title.before">Agentic Software Development</Editable>{' '}
            <Editable as="span" id="title.highlight" className={s.highlight}>Winter Bootcamp</Editable>
          </h1>
          <Editable as="p" id="title.subtitle" multiline className={s.subtitle}>
            {`${BOOTCAMP.tagline} ${BOOTCAMP.subtitle}`}
          </Editable>
          <div className={s.heroCta}>
            {REGISTRATION_OPEN ? (
              <RegistrationButton className={s.heroRegister}>
                Register now <span aria-hidden="true">→</span>
              </RegistrationButton>
            ) : (
              <span className={s.heroSoon} role="status"><i aria-hidden="true" />{REGISTRATION_SOON.cta}</span>
            )}
            <Editable as="span" id="title.ctaNote" className={s.heroCtaNote}>Free · $100 AI credits included</Editable>
          </div>
        </div>
        <Mascot className={s.heroMascot} />
      </div>
      <Logos className={s.heroLogos} size="md" />
      <BottomBar text={<Editable as="span" id="title.footer">{BOOTCAMP.footer}</Editable>} />
    </Slide>
  )
}

export function OfferingSlide({ index }) {
  return (
    <Frame index={index} id="offering" orbs={['orbIce', 'orbHolly']}>
      <div className={s.header}>
        <Editable as="p" id="offering.eyebrow" className={s.eyebrow}>Your invitation · Online event</Editable>
        <h1>
          <Editable as="span" id="offering.titleBefore">Build software with agents.</Editable>{' '}
          <Editable as="span" id="offering.titleHighlight" className={s.highlight}>Ship with confidence.</Editable>
        </h1>
        <Editable as="p" id="offering.subtitle" multiline className={s.subtitle}>
          Practical, hands-on learning across the software development lifecycle with GitHub Copilot, from the first idea to reviewed, tested and running software.
        </Editable>
      </div>
      <div className={`${s.grid} ${s.grid3}`}>
        {PILLARS.map((p) => (
          <div key={p.id} className={s.card}>
            <PillarMark id={p.id} size="sm" tag={<Editable as="span" id={`offering.${p.id}.tag`}>{p.tag}</Editable>} />
            <Editable as="h3" id={`offering.${p.id}.title`}>{p.title}</Editable>
            <Editable as="p" id={`offering.${p.id}.desc`}>{p.desc}</Editable>
          </div>
        ))}
      </div>
      <div className={s.stats}>
        {[
          ['online', 'Online', 'Join live from anywhere'],
          ['weeks', 'Winter Fridays', `15 Jan – 19 Feb 2027${BOOTCAMP.datesConfirmed ? '' : ' · preliminary'}`],
          ['credits', '$100 AI credits', 'Included with event access'],
          ['cost', 'Free', 'Only your time'],
          ['team', 'Delivered by', 'Microsoft Solution Engineers & Architects'],
        ].map(([k, v, l]) => (
          <div key={k} className={s.stat}>
            <Editable as="span" id={`offering.stats.${k}.value`} className={s.statValue}>{v}</Editable>
            <Editable as="span" id={`offering.stats.${k}.label`} className={s.statLabel}>{l}</Editable>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function AudienceSlide({ index }) {
  return (
    <Frame index={index} id="audience" orbs={['orbIce', 'orbPine']}>
      <Header
        id="audience"
        eyebrow="Who it's for"
        title="Made for the software community"
        subtitle="Anyone who helps design, build, test, deliver or operate software."
      />
      <div className={`${s.grid} ${s.grid3}`}>
        {PERSONAS.map((p) => (
          <div key={p.id} className={s.card}>
            <span className={s.icon}>{p.icon}</span>
            <Editable as="h3" id={`audience.${p.id}.title`}>{p.label}</Editable>
            <Editable as="p" id={`audience.${p.id}.desc`}>{p.desc}</Editable>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function FormatSlide({ index }) {
  return (
    <Frame index={index} id="format" orbs={['orbIce', 'orbPine']}>
      <Header
        id="format"
        eyebrow="How you take part"
        title="Two ways to take part"
        subtitle="Every session has clear prerequisites. Meet them and build along, or sit back and follow live."
      />
      <div className={`${s.grid} ${s.grid2}`}>
        <div className={s.card}>
          <span className={s.kicker}>Hands-on</span>
          <span className={s.icon}>🧑‍💻</span>
          <Editable as="h3" id="format.handson.title">Build it yourself</Editable>
          <Editable as="p" id="format.handson.desc">
            Build with the software tools used in each session while GitHub Copilot and agents support the workflow.
          </Editable>
        </div>
        <div className={s.card}>
          <span className={s.kicker}>Presenter-led</span>
          <span className={s.icon}>👀</span>
          <Editable as="h3" id="format.follow.title">Follow along</Editable>
          <Editable as="p" id="format.follow.desc">
            Watch the presenter build it live, ask questions, and take the materials home to try later.
          </Editable>
        </div>
      </div>
    </Frame>
  )
}

export function TimetableSlide({ index }) {
  return (
    <Frame index={index} id="timetable" orbs={['orbIce', 'orbHolly']}>
      <Header
        id="timetable"
        eyebrow="Programme schedule"
        title="Six dates. The same six-session day."
        subtitle={`Every date runs all six sessions. ${REGISTRATION_OPEN ? 'Pick' : 'Once registration opens, pick'} as many as you like, on as many dates as you like.`}
      />
      <div className={s.scheduleDates}>
        {SESSION_DATES.map((date) => (
          <div key={date.id} className={s.scheduleDate}>
            <span>{date.month}</span>
            <strong>{date.day}</strong>
            <small>Full programme</small>
          </div>
        ))}
      </div>
      <div className={s.scheduleAgenda}>
        {SESSIONS.map((session) => (
          <div key={session.id} className={s.scheduleSlot} style={{ '--slot-accent': session.accent }}>
            <time dateTime={session.time}>{session.time}</time>
            <div>
              <span>{session.number} · {session.track}</span>
              <strong>{session.shortTitle}</strong>
            </div>
          </div>
        ))}
      </div>
      <Editable as="p" id="timetable.caption" className={s.caption}>
        {`All six sessions run on 15, 22 and 29 January, and 5, 12 and 19 February 2027.${DATES_NOTE ? ` ${DATES_NOTE}` : ''}`}
      </Editable>
    </Frame>
  )
}

export function SetupSlide({ index }) {
  if (PREREQUISITES_STATE !== 'ready') {
    const soon = PREREQUISITES.soon
    return (
      <Frame index={index} id="setup" orbs={['orbIce', 'orbHolly']}>
        <Header
          id="setup"
          eyebrow="Get ready"
          title="Prerequisites are on their way"
          subtitle={soon.subtitle}
        />
        <div className={s.soonCard} role="status">
          <span className={s.soonMark} aria-hidden="true">{soon.mark}</span>
          <div>
            <small><i aria-hidden="true" />{soon.label}</small>
            <Editable as="h3" id="setup.soon.heading">{soon.heading}</Editable>
            <Editable as="p" id="setup.soon.body" multiline>{soon.body}</Editable>
          </div>
        </div>
      </Frame>
    )
  }

  return (
    <Frame index={index} id="setup" orbs={['orbIce', 'orbHolly']}>
      <Header
        id="setup"
        eyebrow="Get ready"
        title="Your hands-on development setup"
        subtitle="This setup is required for hands-on participation. Complete it locally before your first session or request a limited cloud environment."
      />
      <div className={`${s.grid} ${s.grid4}`}>
        {PREP.slice(0, 4).map((p) => (
          <div key={p.id} className={s.card}>
            <span className={s.icon}>{p.icon}</span>
            <Editable as="h3" id={`setup.${p.id}.title`}>{p.title}</Editable>
            <Editable as="p" id={`setup.${p.id}.desc`}>{p.desc}</Editable>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function SessionDetailsIntroSlide({ index }) {
  return (
    <Frame index={index} id="session-details-intro" orbs={['orbIce', 'orbHolly', 'orbPine']}>
      <div className={s.detailIntro}>
        <span className={s.pill}>The programme</span>
        <Editable as="h1" id="sessionDetailsIntro.title">
          Six sessions. <span className={s.highlight}>One delivery loop.</span>
        </Editable>
        <Editable as="p" id="sessionDetailsIntro.subtitle" multiline className={s.subtitle}>
          The next slides go deeper into the purpose, tools and hands-on outcome of every session.
        </Editable>
        <div className={s.detailIntroTracks}>
          {SESSIONS.map((session) => (
            <span key={session.id}><b>{session.number}</b>{session.track}</span>
          ))}
        </div>
      </div>
    </Frame>
  )
}

function SessionDetailSlide({ index, session }) {
  return (
    <Frame index={index} id={`detail-${session.id}`} orbs={['orbIce', 'orbPine']}>
      <div className={s.detailBody} style={{ '--session-accent': session.accent }}>
        <div className={s.detailMeta}>
          <span className={s.detailNumber}>SESSION {session.number}</span>
          <span className={`${s.tag} ${s.tagIce}`}>{session.time}</span>
          <span className={s.tag}>{session.audience}</span>
          <span className={`${s.tag} ${s.tagPine}`}>{session.format}</span>
          {session.prerequisite && <span className={`${s.tag} ${s.tagHolly}`}>Prerequisite: {session.prerequisite}</span>}
        </div>
        <div className={s.detailHeader}>
          <div>
            <Editable as="h1" id={`detail.${session.id}.title`}>{session.title}</Editable>
            <Editable as="p" id={`detail.${session.id}.subtitle`} className={s.detailSubtitle}>{session.subtitle}</Editable>
          </div>
        </div>
        <Editable as="p" id={`detail.${session.id}.overview`} multiline className={s.detailOverview}>
          {session.overview}
        </Editable>
        <div className={s.detailGrid}>
          <div className={s.detailPanel}>
            <span className={s.detailLabel}>What you will explore</span>
            <ul>
              {session.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
            </ul>
          </div>
          <div className={s.detailStack}>
            <div className={`${s.detailPanel} ${s.detailChallenge}`}>
              <span className={s.detailLabel}>Session focus</span>
              <p>{session.spotlight}</p>
            </div>
            <div className={`${s.detailPanel} ${s.detailToolbox} ${s.detailToolboxPlain}`}>
              <span className={s.detailLabel}>Tools and concepts</span>
              <div className={s.detailTools}>{session.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  )
}

export const sessionDetailSlides = SESSIONS.map((session) => {
  function SessionDetailComponent({ index }) {
    return <SessionDetailSlide index={index} session={session} />
  }
  SessionDetailComponent.displayName = `${session.id}SessionDetailSlide`
  return SessionDetailComponent
})

export function SurveySlide({ index }) {
  return (
    <Frame index={index} id="survey" orbs={['orbIce', 'orbPine']}>
      <Header
        id="survey"
        eyebrow="One request from us"
        title="Tell us how we did"
        subtitle="After each session, we will ask how we did so your feedback can improve the next session."
      />
      <div className={s.points}>
        {[
          ['⏱️', 'short', 'Very short, about 2 minutes'],
          ['🔒', 'pii', 'No PII captured. Feedback links to a company, not a person'],
          ['📈', 'improve', 'Used to improve the next session'],
        ].map(([icon, k, text]) => (
          <div key={k} className={s.point}>
            <span className={s.icon}>{icon}</span>
            <Editable as="span" id={`survey.${k}`}>{text}</Editable>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function RegisterSlide({ index }) {
  const [openOnLoad] = useState(
    () => REGISTRATION_OPEN && new URLSearchParams(window.location.search).get('deckRegister') === '1',
  )

  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.get('deckRegister') !== '1') return
    url.searchParams.delete('deckRegister')
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }, [])

  return (
    <Frame index={index} id="register" orbs={['orbIce', 'orbHolly']}>
      <Header
        id="register"
        eyebrow="Ready to join?"
        title={REGISTRATION_OPEN ? 'How to register' : REGISTRATION_SOON.title}
        subtitle={REGISTRATION_OPEN
          ? 'Registration is open. Confirm your company email; no GitHub sign-in is required.'
          : 'When registration opens, it takes about two minutes:'}
      />
      <div className={s.registerSlideGrid}>
        <div className={s.points}>
          {REGISTER_STEPS.map((text, i) => (
            <div key={i} className={s.point}>
              <span className={s.stepNum}>{i + 1}</span>
              <Editable as="span" id={`register.step${i + 1}`}>{text}</Editable>
            </div>
          ))}
        </div>
        <div className={`${s.registerPrompt} ${REGISTRATION_OPEN ? '' : s.registerPromptSoon}`}>
          <span className={s.registerPromptMark} aria-hidden="true">{REGISTRATION_OPEN ? '🔑' : '📅'}</span>
          <div>
            <strong>{REGISTRATION_OPEN ? GITHUB_ACCESS.eyebrow : REGISTRATION_SOON.heading}</strong>
            <p>{REGISTRATION_OPEN
              ? 'The organization invitation and $100 of GitHub Copilot AI credits arrive a few days before the event.'
              : REGISTRATION_SOON.body}</p>
          </div>
          {REGISTRATION_OPEN
            ? <RegistrationButton initiallyOpen={openOnLoad}>Open registration</RegistrationButton>
            : <span className={s.registerSoonBadge} role="status"><i aria-hidden="true" />{REGISTRATION_SOON.badge}</span>}
        </div>
      </div>
    </Frame>
  )
}

export function TeamSlide({ index }) {
  return (
    <Frame index={index} id="team" orbs={['orbIce', 'orbPine']}>
      <Header
        id="team"
        eyebrow="Brought to you by"
        title="Your Team"
        subtitle="Programme coordination and session facilitators will be announced as the programme is finalised."
      />
      <div className={`${s.grid} ${s.teamGrid}`}>
        {TEAM.map((person) => (
          <div key={person.id} className={`${s.card} ${s.helper}`}>
            <span className={s.helperAvatar} style={{ '--avatar-accent': person.accent }} aria-label={person.name}>
              {person.initials}
            </span>
            <Editable as="h3" id={`team.${person.id}.name`}>{person.name}</Editable>
            <span className={s.helperRole}>{person.role}</span>
            <Editable as="p" id={`team.${person.id}.topic`} className={s.helperTopic}>{person.focus}</Editable>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function DisclaimerSlide({ index }) {
  const items = [
    ['advisory', 'Educational, not consulting', "This is an educational, hands-on workshop series. Microsoft's role is advisory and facilitative on a best-effort basis. It is not a consulting engagement, managed service, implementation project, or delivery of a finished product. Exercises are for learning only and should not be used in production without your own review, testing, security, privacy and compliance approvals."],
    ['code', 'No sensitive code or credentials', 'Do not use confidential source code, production credentials, secrets, personal data, production systems or business-critical repositories during the workshops. Use sample or non-sensitive repositories only.'],
    ['outputs', 'Sample artifacts only', 'Any workshop outputs are sample and learning artifacts only. You are responsible for reviewing, adapting, testing, securing and approving any later use outside the workshop.'],
  ]
  return (
    <Frame index={index} id="disclaimer" orbs={['orbIce', 'orbHolly']}>
      <Header id="disclaimer" eyebrow="Please note" title="Workshop disclaimer" />
      <div className={`${s.grid} ${s.grid3} ${s.small}`}>
        {items.map(([k, title, desc]) => (
          <div key={k} className={s.card}>
            <Editable as="h3" id={`disclaimer.${k}.title`}>{title}</Editable>
            <Editable as="p" id={`disclaimer.${k}.desc`} multiline>{desc}</Editable>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function ThankYouSlide({ index }) {
  return (
    <Slide index={index} className={s.slide}>
      <SlideProgress index={index} />
      <div className={`orb ${s.orbIce}`} />
      <div className={`orb ${s.orbHolly}`} />
      <div className={`orb ${s.orbPine}`} />
      <div className={`${s.thanks} content-frame content-gutter`}>
        <span className={s.pill}>Thank you</span>
        <h1><Editable as="span" id="thankYou.title" className={s.highlight}>See you this winter</Editable></h1>
        <Editable as="p" id="thankYou.subtitle" multiline className={s.subtitle}>
          Questions? Reach out to your Microsoft contact.
        </Editable>
        <div className={s.thanksMascots}><Mascot className={s.thanksCopilot} /></div>
        <Logos size="sm" />
      </div>
      <BottomBar text={<Editable as="span" id="thankYou.footer">{BOOTCAMP.footer}</Editable>} />
    </Slide>
  )
}
