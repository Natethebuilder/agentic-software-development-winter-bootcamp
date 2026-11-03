import { useEffect, useRef } from 'react'

export default function Snowfall({ enabled = true, density = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let particles = []
    let width = 0
    let height = 0
    let paused = false
    const pointer = { x: -9999, y: -9999 }
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const symbols = [
      { text: '0', rgb: '212, 160, 106' },
      { text: '1', rgb: '212, 160, 106' },
      { text: '0', rgb: '212, 160, 106' },
      { text: '1', rgb: '212, 160, 106' },
      { text: '{ }', rgb: '122, 170, 200' },
      { text: '[]', rgb: '122, 170, 200' },
      { text: '</>', rgb: '122, 170, 200' },
      { text: '=>', rgb: '144, 128, 192' },
      { text: 'git', rgb: '212, 160, 106' },
      { text: 'CI', rgb: '106, 158, 132' },
      { text: 'PR', rgb: '144, 128, 192' },
    ]
    const spawn = (anywhere) => {
      const token = symbols[Math.floor(Math.random() * symbols.length)]
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : -10,
        size: 8 + Math.random() * 5,
        symbol: token.text,
        rgb: token.rgb,
        vy: 0.3 + Math.random() * 0.9,
        vx: -0.18 + Math.random() * 0.36,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.07 + Math.random() * 0.12,
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(115, (width * height) / 16500) * density)
      particles = Array.from({ length: Math.round(count * 0.65) }, () => spawn(true))
    }

    const onMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
    }

    const tick = (t) => {
      if (paused) {
        raf = 0
        return
      }
      ctx.clearRect(0, 0, width, height)
      for (const f of particles) {
        f.y += f.vy
        f.x += f.vx + Math.sin(t / 1400 + f.phase) * 0.35
        // Code symbols drift away from the cursor.
        const dx = f.x - pointer.x
        const dy = f.y - pointer.y
        const dist = Math.hypot(dx, dy) || 1
        if (dist < 90) {
          f.x += (dx / dist) * 1.6
          f.y += (dy / dist) * 0.6
        }
        if (f.y > height + 10 || f.x < -20 || f.x > width + 20) Object.assign(f, spawn(false))
        ctx.font = `${f.size}px ui-monospace, SFMono-Regular, Consolas, monospace`
        ctx.fillStyle = `rgba(${f.rgb}, ${f.alpha})`
        ctx.fillText(f.symbol, f.x, f.y)
      }
      raf = requestAnimationFrame(tick)
    }

    const syncMotion = () => {
      paused = document.hidden || motionQuery.matches
      if (paused) {
        cancelAnimationFrame(raf)
        raf = 0
        ctx.clearRect(0, 0, width, height)
      } else if (!raf) {
        raf = requestAnimationFrame(tick)
      }
    }

    resize()
    syncMotion()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    document.addEventListener('visibilitychange', syncMotion)
    motionQuery.addEventListener('change', syncMotion)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', syncMotion)
      motionQuery.removeEventListener('change', syncMotion)
    }
  }, [enabled, density])

  if (!enabled) return null
  return <canvas ref={canvasRef} className="snowfall" aria-hidden="true" />
}
