'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// One IntersectionObserver for all [data-reveal] elements on the current page.
// Re-scans on client navigation — including search-param changes (e.g. blog
// filters), which keep the same pathname. Honors reduced-motion.
export default function RevealManager() {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = el.getAttribute('data-reveal-delay')
            if (delay) el.style.transitionDelay = `${delay}ms`
            el.classList.add('is-visible')
            io.unobserve(el)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    )
    els.forEach((el) => io.observe(el))
    // Safety: reveal anything already in view on load
    requestAnimationFrame(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.92) el.classList.add('is-visible')
      })
    })
    return () => io.disconnect()
  }, [pathname, search])
  return null
}
