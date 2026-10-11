import { useEffect, useState } from 'react'
import { EVENT, FAQ, NAV, PREP, REGISTRATION, SDLC_STAGES, SESSIONS, VALUE } from '../content.js'
import RegistrationForm from '../registration/RegistrationForm.jsx'
import { MotionToggle } from '../theme/WinterGrid.jsx'
import { AgenticLoop, PullRequestSimulator } from '../viz/AgenticLoop.jsx'

function Brand() {
  return (
    <a className="brand" href="#top" aria-label={`${EVENT.name} home`}>
      <span aria-hidden="true">&lt;/&gt;</span>
      <div><strong>Agentic Dev</strong><small>Winter Bootcamp</small></div>
    </a>
  )
}

function SpeakerPlaceholder() {
  return (
    <div className="speaker-placeholder" aria-label="Speaker headshot to be confirmed">
      <span />
      <i />
    </div>
  )
}

export default function Site({ motion, onToggleMotion }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const shouldFocusRegistration = new URLSearchParams(window.location.search).get('register') === '1'
    if (shouldFocusRegistration) {
      window.setTimeout(() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }), 250)
    }
  }, [])

  return (
    <div className="site-shell" id="top">
      <header className="site-header">
        <Brand />
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span /><span />
        </button>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">
          {NAV.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          <a href="#/deck">Deck</a>
          <a className="nav-register" href="#register" onClick={() => setMenuOpen(false)}>Register</a>
        </nav>
      </header>

      <main>
        <section className="hero section">
          <div className="hero-copy">
            <div className="eyebrow"><span>Winter 2026</span>{EVENT.eyebrow}</div>
            <h1>Build the<br /><em>next loop.</em></h1>
            <p>{EVENT.subtitle}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#register">Register interest</a>
              <a className="button button-secondary" href="#sdlc">Explore the SDLC</a>
            </div>
            <div className="hero-meta">
              <span><small>FORMAT</small>{EVENT.format}</span>
              <span><small>COMMUNITY</small>Software builders at every stage</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="copilot-core">
              <small>HUMAN</small>
              <strong>+</strong>
              <small>AGENT</small>
            </div>
            {SDLC_STAGES.map((stage, index) => (
              <span key={stage.id} className={`orbit-node node-${index + 1}`}>{stage.object}</span>
            ))}
          </div>
          <div className="hero-side-label">ISSUE → SPEC → CODE → PR → CI → PROD</div>
        </section>

        <section className="marquee" aria-label="Event themes">
          <div>
            <span>GitHub Copilot</span><i>✦</i><span>Human judgement</span><i>✦</i>
            <span>Agentic SDLC</span><i>✦</i><span>Community practice</span><i>✦</i>
            <span>GitHub Copilot</span><i>✦</i><span>Human judgement</span><i>✦</i>
          </div>
        </section>

        <section className="section split-intro" id="why">
          <div>
            <span className="section-index">01 / WHY NOW</span>
            <h2>Software development is becoming a conversation.</h2>
          </div>
          <div className="intro-copy">
            <p className="lead">The useful question is no longer whether AI can produce code.</p>
            <p>It is how teams make intent legible, delegate safely, review evidence and learn faster without losing engineering accountability.</p>
          </div>
          <div className="value-grid">
            {VALUE.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section lifecycle-section" id="sdlc">
          <div className="section-heading">
            <span className="section-index">02 / THE AGENTIC SDLC</span>
            <h2>One connected delivery loop.</h2>
            <p>Tap a stage to see the artefact, agent interaction and human-readable signal it should produce.</p>
          </div>
          <AgenticLoop active={motion} />
        </section>

        <section className="section evidence-section">
          <div className="evidence-copy">
            <span className="section-index">03 / EVIDENCE OVER OUTPUT</span>
            <h2>A good agent does not just write code.</h2>
            <p>It leaves a trail that a team can inspect: scoped intent, a focused branch, tests, review context and visible checks.</p>
            <ul>
              <li><span>01</span> Bound the task before delegation</li>
              <li><span>02</span> Review the diff and the behaviour</li>
              <li><span>03</span> Let automation report release confidence</li>
            </ul>
          </div>
          <PullRequestSimulator active={motion} />
        </section>

        <section className="section sessions-section" id="sessions">
          <div className="section-heading">
            <span className="section-index">04 / SIX SESSIONS</span>
            <h2>The programme is taking shape.</h2>
            <p>Six places are reserved across the lifecycle. Topics, dates and community speakers will be added as they are confirmed.</p>
          </div>
          <div className="session-grid">
            {SESSIONS.map((session) => (
              <article key={session.id}>
                <div className="session-number">{session.number}</div>
                <div className="session-date"><span>{session.date}</span><small>{session.time}</small></div>
                <h3>{session.title}</h3>
                <p>{session.subtitle}</p>
                <div className="speaker-row">
                  <SpeakerPlaceholder />
                  <div><strong>{session.speaker}</strong><span>{session.role}</span></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section prep-section" id="prepare">
          <div className="section-heading">
            <span className="section-index">05 / PRE-FLIGHT</span>
            <h2>Bring curiosity. Prepare the basics.</h2>
          </div>
          <div className="prep-list">
            {PREP.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{item.title}</h3><p>{item.body}</p></div>
                <strong>{item.state}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-heading">
            <span className="section-index">06 / FAQ</span>
            <h2>Before you join.</h2>
          </div>
          <div className="faq-list">
            {FAQ.map((item, index) => (
              <details key={item.question}>
                <summary><span>{String(index + 1).padStart(2, '0')}</span>{item.question}<i>+</i></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section register-section" id="register">
          <div className="register-heading">
            <span className="section-index">07 / REGISTER</span>
            <h2>{REGISTRATION.heading}</h2>
            <p>{REGISTRATION.body}</p>
          </div>
          <RegistrationForm />
        </section>
      </main>

      <footer>
        <Brand />
        <p>Built for the broader software development community with GitHub Copilot and human judgement.</p>
        <div>
          <a href="#/deck">Open deck</a>
          <MotionToggle enabled={motion} onToggle={onToggleMotion} />
        </div>
      </footer>
    </div>
  )
}
