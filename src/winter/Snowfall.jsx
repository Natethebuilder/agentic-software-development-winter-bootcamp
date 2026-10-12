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
    const pointer = { x: -9999, y: -9999 }

    const symbols = ['0', '1', '{ }', '</>', 'git', 'CI']
    const spawn = (anywhere) => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : -10,
      size: 8 + Math.random() * 5,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      vy: 0.3 + Math.random() * 0.9,
      vx: -0.18 + Math.random() * 0.36,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.04 + Math.random() * 0.11,
    })

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
      particles = Array.from({ length: Math.round(count * 0.58) }, () => spawn(true))
    }

    const onMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
    }

    const tick = (t) => {
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
        ctx.fillStyle = `rgba(111, 207, 255, ${f.alpha})`
        ctx.fillText(f.symbol, f.x, f.y)
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [enabled, density])

  if (!enabled) return null
  return <canvas ref={canvasRef} className="snowfall" aria-hidden="true" />
}
