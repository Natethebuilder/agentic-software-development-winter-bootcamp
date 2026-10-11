import { useEffect, useState } from 'react'

const STORAGE_KEY = 'agentic-dev-motion'

export function useMotionPreference() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved !== null) return saved === 'on'
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
  }, [enabled])

  return [enabled, setEnabled]
}

export function MotionToggle({ enabled, onToggle }) {
  return (
    <button
      className="motion-toggle"
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      title={`${enabled ? 'Pause' : 'Play'} ambient animation`}
    >
      <span aria-hidden="true">{enabled ? 'Ⅱ' : '▶'}</span>
      <span>{enabled ? 'Pause motion' : 'Play motion'}</span>
    </button>
  )
}

const traces = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  delay: `${(index % 7) * -1.7}s`,
  duration: `${7 + (index % 5) * 1.5}s`,
}))

export default function WinterGrid({ enabled, density = 1 }) {
  return (
    <div className={`winter-grid ${enabled ? 'is-moving' : 'is-paused'}`} aria-hidden="true">
      <div className="grid-plane" />
      {traces.slice(0, Math.max(6, Math.round(traces.length * density))).map((trace) => (
        <i
          key={trace.id}
          className="code-trace"
          style={{ left: trace.left, animationDelay: trace.delay, animationDuration: trace.duration }}
        />
      ))}
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
    </div>
  )
}
