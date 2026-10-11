import { useEffect, useState } from 'react'
import { SDLC_STAGES } from '../content.js'

export function AgenticLoop({ compact = false, active = true }) {
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!active) return undefined
    const timer = window.setInterval(() => {
      setSelected((current) => (current + 1) % SDLC_STAGES.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [active])

  const stage = SDLC_STAGES[selected]

  return (
    <div className={`agentic-loop ${compact ? 'is-compact' : ''}`}>
      <div className="loop-rail" role="tablist" aria-label="Agentic software development lifecycle">
        {SDLC_STAGES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected === index}
            className={selected === index ? 'is-active' : ''}
            onClick={() => setSelected(index)}
          >
            <span>{item.label}</span>
            <strong>{item.object}</strong>
          </button>
        ))}
      </div>
      <div className="loop-terminal" role="tabpanel">
        <div className="terminal-bar">
          <span /><span /><span />
          <code>agentic-sdlc/{stage.id}</code>
        </div>
        <div className="terminal-body">
          <p><span className="terminal-prompt">$</span> {stage.command}</p>
          <div className="terminal-response">
            <small>STAGE {stage.label}</small>
            <h3>{stage.title}</h3>
            <p>{stage.prompt}</p>
            <div><span>signal</span><strong>{stage.signal}</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const runs = [
  { name: 'spec-check', state: 'passed', width: '100%' },
  { name: 'tests', state: 'passed', width: '100%' },
  { name: 'security-review', state: 'running', width: '72%' },
  { name: 'preview-deploy', state: 'queued', width: '24%' },
]

export function PullRequestSimulator({ active = true }) {
  const [approved, setApproved] = useState(false)

  useEffect(() => {
    if (!active) setApproved(false)
  }, [active])

  return (
    <div className="pr-simulator">
      <header>
        <span className="branch-pill">feature/agentic-loop</span>
        <span className="arrow">→</span>
        <span className="branch-pill base">main</span>
      </header>
      <div className="pr-title">
        <div>
          <small>Pull request #42</small>
          <h3>Connect intent to delivery evidence</h3>
        </div>
        <span className={`review-state ${approved ? 'approved' : ''}`}>
          {approved ? 'Approved' : 'Reviewing'}
        </span>
      </div>
      <div className="checks">
        {runs.map((run) => (
          <div className={`check ${run.state}`} key={run.name}>
            <span className="check-icon">{run.state === 'passed' ? '✓' : run.state === 'running' ? '↻' : '·'}</span>
            <strong>{run.name}</strong>
            <i><b style={{ width: approved ? '100%' : run.width }} /></i>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setApproved((value) => !value)}>
        {approved ? 'Re-open review' : 'Approve the evidence'}
      </button>
    </div>
  )
}
