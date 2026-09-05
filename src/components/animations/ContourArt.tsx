'use client'

import { useEffect, useRef } from 'react'

// A small kinetic drawing: each contour follows the pointer by a different
// amount. Events belong to the surrounding section, never an invisible overlay.
export default function ContourArt({ className = '' }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    const surface = svg?.closest('section')
    if (!svg || !surface) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(pointer: fine)')
    const lines = Array.from(svg.querySelectorAll<SVGGElement>('[data-contour]'))
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let frame = 0
    let visible = false

    const draw = () => {
      frame = 0
      current.x += (target.x - current.x) * 0.065
      current.y += (target.y - current.y) * 0.065
      lines.forEach((line, i) => {
        const depth = (i + 1) / lines.length
        line.setAttribute('transform', `translate(${current.x * depth} ${current.y * depth})`)
      })
      if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.05) {
        frame = requestAnimationFrame(draw)
      }
    }
    const start = () => {
      if (!frame && visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(draw)
    }
    const move = (event: PointerEvent) => {
      if (!fine.matches || motion.matches) return
      const box = surface.getBoundingClientRect()
      target.x = ((event.clientX - box.left) / box.width - 0.5) * 60
      target.y = ((event.clientY - box.top) / box.height - 0.5) * 46
      start()
    }
    // On a phone, the drawing follows the section's passage through the viewport.
    const scroll = () => {
      if (fine.matches || motion.matches || !visible || document.hidden) return
      const box = surface.getBoundingClientRect()
      const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - box.top - box.height / 2) / window.innerHeight))
      target.x = progress * 24
      target.y = progress * -18
      start()
    }
    const reset = () => { target.x = 0; target.y = 0; start() }
    const sync = () => {
      cancelAnimationFrame(frame)
      frame = 0
      if (motion.matches) {
        current.x = current.y = target.x = target.y = 0
        lines.forEach((line) => line.removeAttribute('transform'))
      } else start()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) { scroll(); start() }
      else { cancelAnimationFrame(frame); frame = 0 }
    })
    observer.observe(svg)
    surface.addEventListener('pointermove', move, { passive: true })
    surface.addEventListener('pointerleave', reset)
    window.addEventListener('scroll', scroll, { passive: true })
    motion.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      surface.removeEventListener('pointermove', move)
      surface.removeEventListener('pointerleave', reset)
      window.removeEventListener('scroll', scroll)
      motion.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return (
    <svg ref={ref} className={`contour-art ${className}`} viewBox="0 0 600 600" fill="none" aria-hidden="true" focusable="false">
      {Array.from({ length: 13 }, (_, i) => (
        <g key={i} data-contour="">
          <path
            d="M302 66C414 29 523 118 520 240C517 325 557 405 458 482C364 554 223 533 145 454C71 378 60 251 114 172C158 108 221 93 302 66Z"
            transform={`translate(300 300) rotate(${i * 5}) scale(${1 - i * 0.057}) translate(-300 -300)`}
            stroke="currentColor"
            strokeWidth="0.9"
            vectorEffect="non-scaling-stroke"
            opacity={0.3 + i * 0.04}
          />
        </g>
      ))}
      <circle cx="300" cy="300" r="4" fill="currentColor" />
      <path d="M300 275V261M300 325V339M275 300H261M325 300H339" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}
