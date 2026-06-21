'use client'
import { useEffect, useRef } from 'react'

// Subtle parallax for decorative background layers. Reduced-motion = no movement.
export default function Parallax({
  speed = 0.12,
  style,
  className,
}: {
  speed?: number
  style?: React.CSSProperties
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        el.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [speed])
  return <div ref={ref} aria-hidden className={className} style={{ pointerEvents: 'none', ...style }} />
}
