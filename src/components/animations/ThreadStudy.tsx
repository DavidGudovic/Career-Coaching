'use client'

import { useEffect, useRef } from 'react'

const THREADS = 12
const restingPoint = { x: 580, y: 120 }

function threadPath(index: number, x: number, y: number) {
  return `M-20 ${65 + index * 9} C180 ${-100 + index * 25} ${x - 170} ${y + 140 - index * 23} ${x} ${y} S980 ${-60 + index * 27} 1220 ${80 + index * 7}`
}

// A drawing that gathers separate threads into one point. It only animates
// while responding to interaction; the server-rendered drawing is the fallback.
export default function ThreadStudy() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const drawing = ref.current
    if (!drawing) return
    const surface = drawing.closest('section') || drawing
    const paths = Array.from(drawing.querySelectorAll<SVGPathElement>('[data-thread]'))
    const point = drawing.querySelector<SVGGElement>('[data-thread-point]')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(pointer: fine)')
    const target = { ...restingPoint }
    const current = { ...restingPoint }
    let visible = false
    let raf = 0

    const paint = () => {
      paths.forEach((path, index) => path.setAttribute('d', threadPath(index, current.x, current.y)))
      point?.setAttribute('transform', `translate(${current.x} ${current.y})`)
    }
    const frame = () => {
      raf = 0
      current.x += (target.x - current.x) * 0.075
      current.y += (target.y - current.y) * 0.075
      paint()
      if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.05) start()
    }
    const start = () => {
      if (!raf && visible && !motion.matches && !document.hidden) raf = requestAnimationFrame(frame)
    }
    const move = (event: PointerEvent) => {
      if (!fine.matches || motion.matches) return
      const box = surface.getBoundingClientRect()
      target.x = 240 + Math.max(0, Math.min(1, (event.clientX - box.left) / box.width)) * 720
      target.y = 55 + Math.max(0, Math.min(1, (event.clientY - box.top) / box.height)) * 130
      start()
    }
    const reset = () => { Object.assign(target, restingPoint); start() }
    const scroll = () => {
      if (fine.matches || motion.matches || !visible || document.hidden) return
      const box = surface.getBoundingClientRect()
      const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - box.top - box.height / 2) / window.innerHeight))
      target.x = restingPoint.x + progress * 260
      target.y = restingPoint.y + progress * 35
      start()
    }
    const sync = () => {
      cancelAnimationFrame(raf)
      raf = 0
      if (motion.matches) {
        Object.assign(target, restingPoint)
        Object.assign(current, restingPoint)
        paint()
      } else { scroll(); start() }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    observer.observe(drawing)
    surface.addEventListener('pointermove', move, { passive: true })
    surface.addEventListener('pointerleave', reset)
    window.addEventListener('scroll', scroll, { passive: true })
    motion.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      surface.removeEventListener('pointermove', move)
      surface.removeEventListener('pointerleave', reset)
      window.removeEventListener('scroll', scroll)
      motion.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return (
    <div ref={ref} className="thread-study" aria-hidden="true">
      <svg viewBox="0 0 1200 240" fill="none" preserveAspectRatio="none" focusable="false">
        {Array.from({ length: THREADS }, (_, index) => (
          <path key={index} data-thread="" d={threadPath(index, restingPoint.x, restingPoint.y)} stroke="currentColor" strokeWidth="0.85" opacity={0.14 + index * 0.035} vectorEffect="non-scaling-stroke" />
        ))}
        <g data-thread-point="" transform={`translate(${restingPoint.x} ${restingPoint.y})`}>
          <circle r="19" stroke="currentColor" strokeWidth="0.7" opacity="0.45" vectorEffect="non-scaling-stroke" />
          <circle r="5" fill="currentColor" />
        </g>
      </svg>
    </div>
  )
}
