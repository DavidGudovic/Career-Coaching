'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Emphasis } from '@/lib/emphasis'
import { externalUrl } from '@/lib/links'

export default function WebinarInvitation({ title, text, url, buttonLabel, closeLabel, eyebrow }: {
  title: string; text?: string | null; url: string; buttonLabel: string; closeLabel: string; eyebrow: string
}) {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()
  const target = externalUrl(url)
  const storageKey = `webinar-dismissed:${url}`

  useEffect(() => {
    setVisible(false)
    try { if (sessionStorage.getItem(storageKey)) return } catch { /* Storage may be disabled. */ }
    const timer = window.setTimeout(() => setVisible(true), 6000)
    return () => window.clearTimeout(timer)
  }, [storageKey])

  function dismiss() {
    setVisible(false)
    try { sessionStorage.setItem(storageKey, '1') } catch { /* Still dismiss for this page. */ }
  }

  useEffect(() => {
    if (!visible) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setVisible(false)
        try { sessionStorage.setItem(storageKey, '1') } catch { /* Optional persistence. */ }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [visible, storageKey])

  // Keep the contact task clear; this is a non-modal invitation and never takes focus.
  if (!visible || !target || pathname.endsWith('/kontakt')) return null
  return (
    <aside className="webinar-invitation" aria-labelledby="webinar-title">
      <button className="webinar-close" type="button" onClick={dismiss} aria-label={closeLabel}>×</button>
      <span className="eyebrow">{eyebrow}</span>
      <h2 id="webinar-title"><Emphasis text={title} /></h2>
      {text && <p><Emphasis text={text} /></p>}
      <a className="btn btn-solid" href={target} target="_blank" rel="noopener noreferrer" onClick={dismiss}>{buttonLabel} ↗</a>
    </aside>
  )
}
