'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ANALYTICS_EVENTS, publicAnalyticsPath, READING_THRESHOLDS, readingSeconds, referrerOrigin } from '@/lib/analytics-shared'

// Umami's short-lived session cache stays in memory; no visitor identifier in storage.
let sessionCache = ''
let previousPage = ''
let lastView = { path: '', at: 0 }

export default function AnalyticsTracker() {
  const pathname = usePathname()
  useEffect(() => {
    if (navigator.doNotTrack === '1' || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return
    try { if (localStorage.getItem('umami.disabled') === '1') return } catch { /* storage can be disabled */ }
    const path = publicAnalyticsPath(window.location.pathname)
    if (!path) return
    const referrer = previousPage ? location.origin : referrerOrigin(document.referrer)
    previousPage = path
    let disposed = false
    const send = (name?: typeof ANALYTICS_EVENTS[number]) => {
      void fetch('/telemetry/collect', {
        method: 'POST', keepalive: true, credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, referrer, language: navigator.language, screen: `${screen.width}x${screen.height}`, name, cache: sessionCache }),
      }).then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          if (typeof data.cache === 'string') sessionCache = data.cache
        }
      }).catch(() => { /* analytics must never break the site */ })
    }
    // Delay until the committed route is ready; Strict Mode's discarded effect is cancelled.
    const pageview = window.setTimeout(() => {
      if (lastView.path !== path || Date.now() - lastView.at > 1000) {
        send()
        lastView = { path, at: Date.now() }
      }
    }, 0)
    let elapsed = 0
    let lastTick = performance.now()
    let activeAt = lastTick
    const sent = new Set<number>()
    const active = () => { activeAt = performance.now() }
    const visibility = () => { lastTick = performance.now(); if (!document.hidden) active() }
    const tick = window.setInterval(() => {
      const now = performance.now()
      elapsed = readingSeconds(elapsed, now - lastTick, !document.hidden && document.hasFocus(), now - activeAt)
      lastTick = now
      for (const seconds of READING_THRESHOLDS) {
        if (!disposed && elapsed >= seconds && !sent.has(seconds)) {
          sent.add(seconds)
          send(`reading-${seconds}s`)
        }
      }
    }, 5000)
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null
      if (!link) return
      const explicit = link.getAttribute('data-analytics-event')
      if (ANALYTICS_EVENTS.includes(explicit as typeof ANALYTICS_EVENTS[number])) send(explicit as typeof ANALYTICS_EVENTS[number])
      else if (link.hasAttribute('download')) send('resource-download')
      else if (link.href.startsWith('mailto:') || link.href.startsWith('tel:')) send('contact-click')
    }
    for (const name of ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart']) window.addEventListener(name, active, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    document.addEventListener('click', click)
    return () => {
      disposed = true
      clearTimeout(pageview)
      clearInterval(tick)
      for (const name of ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart']) window.removeEventListener(name, active)
      document.removeEventListener('visibilitychange', visibility)
      document.removeEventListener('click', click)
    }
  }, [pathname])
  return null
}
