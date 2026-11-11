import { useId } from 'react'
import { SESSIONS } from '../content.js'
import a from './Agentic.module.css'

const ACCENTS = SESSIONS.map((session) => session.accent)

const polar = (cx, cy, r, deg) => {
  const rad = (deg * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

const RING = Array.from({ length: 6 }, (_, k) => polar(32, 32, 22, 60 * k - 90))

// A terminal session types its first prompt while three foundation blocks light up beneath it:
// the app, sessions and context that every later session builds on.
function FoundationsGlyph() {
  return (
    <svg viewBox="0 0 64 64" className={a.svg} aria-hidden="true" focusable="false">
      <rect x="8.5" y="9.5" width="47" height="34" rx="6" className={a.frame} />
      <path d="M8.5 19.5 H55.5" className={a.divider} />
      <circle cx="14.5" cy="14.5" r="1.5" className={a.winDot} />
      <circle cx="19.5" cy="14.5" r="1.5" className={a.winDot} />
      <circle cx="24.5" cy="14.5" r="1.5" className={a.winDot} />
      <path d="M14.5 26 L18.5 29 L14.5 32" className={a.prompt} />
      <rect x="22" y="27.5" width="22" height="3" rx="1.5" className={a.typed} />
      <rect x="14.5" y="35.5" width="30" height="3" rx="1.5" className={`${a.typed} ${a.typedLate}`} />
      <rect x="46.5" y="34.5" width="2.4" height="5" rx="0.8" className={a.cursor} />
      {[0, 1, 2].map((k) => (
        <rect
          key={k}
          x={8.5 + k * 16.2}
          y="48.5"
          width="14.6"
          height="7"
          rx="2.6"
          className={a.block}
          style={{ '--node': ACCENTS[k], '--k': k }}
        />
      ))}
    </svg>
  )
}

// A change travels the whole delivery loop: each of the six stages lights up as it passes.
function LoopGlyph() {
  const gradient = `trail-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <svg viewBox="0 0 64 64" className={a.svg} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradient} gradientUnits="userSpaceOnUse" x1="12.95" y1="21" x2="32" y2="10">
          <stop offset="0" className={a.trailFrom} />
          <stop offset="1" className={a.trailTo} />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="22" className={a.track} />
      <g className={a.orbit}>
        <path d="M12.95 21 A22 22 0 0 1 32 10" className={a.trail} stroke={`url(#${gradient})`} />
        <circle cx="32" cy="10" r="2.6" className={a.head} />
      </g>
      {RING.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r="3.6" className={a.stage} style={{ '--node': ACCENTS[k], '--k': k }} />
      ))}
      <circle cx="32" cy="32" r="9.5" className={a.core} />
      <path d="M34.75 27.24 A5.5 5.5 0 1 1 27.24 29.25" className={a.loopArrow} />
      <path d="M24.4 30.6 L27.24 29.25 L27.9 32.4" className={a.loopArrow} />
    </svg>
  )
}

// A legacy application becomes connected, modern modules.
function ModernizationGlyph() {
  return (
    <svg viewBox="0 0 64 64" className={a.svg} aria-hidden="true" focusable="false">
      <rect x="5" y="17" width="18" height="30" rx="3" className={a.legacyApp} />
      <path d="M5 24 H23 M9 30 H19 M9 35 H19 M9 40 H16" className={a.divider} />
      <path d="M27 32 H37 M32 27 L37 32 L32 37" className={a.migrationArrow} />
      <path d="M40 16 V48 M40 16 H43 M40 32 H43 M40 48 H43" className={a.modernConnections} />
      {[0, 1, 2].map((k) => (
        <rect
          key={k}
          x="43"
          y={11 + k * 16}
          width="15"
          height="10"
          rx="2.5"
          className={a.modernModule}
          style={{ '--k': k }}
        />
      ))}
    </svg>
  )
}

const GLYPHS = { foundations: FoundationsGlyph, 'whole-loop': LoopGlyph, evidence: ModernizationGlyph }

export default function PillarMark({ id, tag, size = 'md', className = '' }) {
  const Glyph = GLYPHS[id] ?? LoopGlyph
  return (
    <div className={`${a.mark} ${size === 'sm' ? a.sm : ''} ${className}`}>
      <span className={a.tile}><Glyph /></span>
      {tag && <span className={a.tag}>{tag}</span>}
    </div>
  )
}
