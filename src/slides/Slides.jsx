import { BottomBar, Slide, useSlides } from '@deckio/deck-engine'
import { EVENT, PREP, SDLC_STAGES, SESSIONS, VALUE } from '../content.js'
import RegistrationForm from '../registration/RegistrationForm.jsx'
import { AgenticLoop, PullRequestSimulator } from '../viz/AgenticLoop.jsx'

function Frame({ index, children, className = '' }) {
  return (
    <Slide index={index} className={`software-slide ${className}`}>
      <div className="slide-frame">{children}</div>
    </Slide>
  )
}

function Kicker({ children }) {
  return <div className="slide-kicker"><span>&lt;/&gt;</span>{children}</div>
}

function Header({ kicker, title }) {
  return <header className="slide-header"><Kicker>{kicker}</Kicker><h2>{title}</h2></header>
}

function Footer({ left, right }) {
  return <BottomBar left={left} right={right} />
}

export function TitleSlide({ index }) {
  return (
    <Frame index={index} className="title-slide">
      <div className="slide-code-watermark">agentic / sdlc</div>
      <Kicker>WINTER 2026 · COMMUNITY BOOTCAMP</Kicker>
      <div className="title-lockup">
        <p>{EVENT.eyebrow}</p>
        <h1>Build the<br /><em>next loop.</em></h1>
        <span>{EVENT.name}</span>
      </div>
      <div className="title-path">ISSUE <i>→</i> SPEC <i>→</i> CODE <i>→</i> PR <i>→</i> CI <i>→</i> PROD</div>
      <Footer left="GitHub Copilot × human judgement" right="Six sessions · Dates TBC" />
    </Frame>
  )
}

export function CommunitySlide({ index }) {
  return (
    <Frame index={index}>
      <Header kicker="WHY NOW" title="Software development is becoming a conversation." />
      <div className="slide-value-grid">
        {VALUE.map((item) => (
          <article key={item.number}>
            <span>{item.number}</span><h3>{item.title}</h3><p>{item.body}</p>
          </article>
        ))}
      </div>
      <Footer left={EVENT.audience} right="01 / 12" />
    </Frame>
  )
}

export function LifecycleSlide({ index }) {
  const { current } = useSlides()
  return (
    <Frame index={index}>
      <Header kicker="THE AGENTIC SDLC" title="One connected delivery loop." />
      <AgenticLoop compact active={current === index} />
      <Footer left="Every stage creates reviewable context for the next." right="02 / 12" />
    </Frame>
  )
}

export function WorkflowSlide({ index }) {
  const { current } = useSlides()
  return (
    <Frame index={index}>
      <Header kicker="EVIDENCE OVER OUTPUT" title="A good agent leaves a trail." />
      <div className="slide-workflow">
        <PullRequestSimulator active={current === index} />
        <div>
          <blockquote>“Fast code is useful. Reviewable intent, tested behaviour and visible release confidence are better.”</blockquote>
          <p>Humans remain accountable for scope, architecture, risk, approval and production outcomes.</p>
        </div>
      </div>
      <Footer left="Issue → branch → pull request → checks → deployment" right="03 / 12" />
    </Frame>
  )
}

export function SessionOverviewSlide({ index }) {
  return (
    <Frame index={index}>
      <Header kicker="PROGRAMME" title="Six sessions. One lifecycle." />
      <div className="slide-session-grid">
        {SESSIONS.map((session) => (
          <article key={session.id}><span>{session.number}</span><strong>{session.title}</strong><small>{session.date}</small></article>
        ))}
      </div>
      <Footer left="Topics, dates and speakers will be added when confirmed." right="04 / 12" />
    </Frame>
  )
}

function SessionSlide({ index, session }) {
  const stage = SDLC_STAGES[Number(session.number) - 1]
  return (
    <Frame index={index} className="session-slide">
      <div className="session-slide-number">{session.number}</div>
      <Kicker>SESSION PLACEHOLDER · {stage.object.toUpperCase()}</Kicker>
      <div className="session-slide-content">
        <div>
          <h1>{session.title}</h1>
          <p>{session.subtitle}</p>
          <div className="session-slide-meta"><span>{session.date}</span><span>{session.time}</span></div>
        </div>
        <div className="session-speaker-placeholder">
          <div><span /><i /></div>
          <strong>{session.speaker}</strong>
          <small>{session.role}</small>
        </div>
      </div>
      <div className="session-stage-note"><span>{stage.label}</span><strong>{stage.title}</strong><p>{stage.prompt}</p></div>
      <Footer left="Programme details intentionally left open." right={`${String(index + 1).padStart(2, '0')} / 12`} />
    </Frame>
  )
}

export const sessionSlides = SESSIONS.map((session) => function SessionPlaceholder(props) {
  return <SessionSlide {...props} session={session} />
})

export function PrepareSlide({ index }) {
  return (
    <Frame index={index}>
      <Header kicker="PRE-FLIGHT" title="Prepare the basics." />
      <div className="slide-prep-list">
        {PREP.map((item, itemIndex) => (
          <article key={item.title}><span>{String(itemIndex + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3><p>{item.body}</p></div><strong>{item.state}</strong></article>
        ))}
      </div>
      <Footer left="A current browser is enough to follow." right="11 / 12" />
    </Frame>
  )
}

export function RegistrationSlide({ index }) {
  return (
    <Frame index={index} className="registration-slide">
      <Header kicker="REGISTER" title="Reserve your place in the loop." />
      <RegistrationForm postLoginRedirect="/?register=1#/deck" />
    </Frame>
  )
}

export function ClosingSlide({ index }) {
  return (
    <Frame index={index} className="closing-slide">
      <Kicker>AGENTIC SOFTWARE DEVELOPMENT WINTER BOOTCAMP</Kicker>
      <h1>Build with agents.<br /><em>Ship with judgement.</em></h1>
      <p>Six community sessions · Topics, dates and speakers TBC</p>
      <div className="closing-actions"><a href="#/">Visit website</a><a href="#register">Register</a></div>
      <Footer left="GitHub Copilot across the SDLC" right="END / START AGAIN" />
    </Frame>
  )
}
