'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Emphasis, plain } from '@/lib/emphasis'
import { externalUrl } from '@/lib/links'

export default function WebinarInvitation({ title, text, url, buttonLabel, closeLabel, laterLabel, openLabel, eyebrow }: {
  title: string; text?: string | null; url: string; buttonLabel: string; closeLabel: string; laterLabel: string; openLabel: string; eyebrow: string
}) {
  const [ready, setReady] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const pathname = usePathname()
  const contactPage = pathname.endsWith('/kontakt')
  const target = externalUrl(url)
  const storageKey = `webinar-dismissed:${url}`
  const id = useId()
  const timer = useRef<number | undefined>(undefined)
  const heading = useRef<HTMLHeadingElement>(null)
  const panel = useRef<HTMLElement>(null)
  const teaser = useRef<HTMLButtonElement>(null)
  const focusNext = useRef<'heading' | 'teaser' | null>(null)

  useEffect(() => {
    setReady(false)
    setExpanded(false)
    if (contactPage || !target) return
    setReady(true)
    // Match the compact CSS treatment, including a phone held sideways.
    const compact = window.matchMedia('(max-width: 767px), (pointer: coarse) and (max-height: 600px)')
    const onLayoutChange = () => {
      if (!compact.matches) return
      window.clearTimeout(timer.current)
      if (panel.current?.contains(document.activeElement)) focusNext.current = 'teaser'
      setExpanded(false)
    }
    compact.addEventListener('change', onLayoutChange)
    const cleanup = () => {
      window.clearTimeout(timer.current)
      compact.removeEventListener('change', onLayoutChange)
    }
    // Phones open the invitation only after a tap. Desktop keeps its timed welcome.
    if (compact.matches) return cleanup
    try { if (sessionStorage.getItem(storageKey)) return cleanup } catch { /* Storage may be disabled. */ }
    timer.current = window.setTimeout(() => {
      // Do not remove a control while someone is reaching it with the keyboard.
      if (!compact.matches && document.activeElement !== teaser.current) setExpanded(true)
    }, 3000)
    return cleanup
  }, [storageKey, contactPage, target])

  function minimise() {
    window.clearTimeout(timer.current)
    if (panel.current?.contains(document.activeElement)) focusNext.current = 'teaser'
    setExpanded(false)
    try { sessionStorage.setItem(storageKey, '1') } catch { /* Still minimise on this page. */ }
  }

  function open() {
    window.clearTimeout(timer.current)
    focusNext.current = 'heading'
    setExpanded(true)
  }

  useEffect(() => {
    if (!expanded) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      window.clearTimeout(timer.current)
      if (panel.current?.contains(document.activeElement)) focusNext.current = 'teaser'
      setExpanded(false)
      try { sessionStorage.setItem(storageKey, '1') } catch { /* Optional persistence. */ }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [expanded, storageKey])

  useEffect(() => {
    if (expanded && focusNext.current === 'heading') heading.current?.focus({ preventScroll: true })
    if (!expanded && focusNext.current === 'teaser') teaser.current?.focus({ preventScroll: true })
    focusNext.current = null
  }, [expanded])

  // Non-modal: automatic opening never moves focus or blocks the page.
  if (!ready || !target || contactPage) return null
  return (
    <div className="webinar-widget" data-expanded={expanded}>
      {expanded ? (
        <aside ref={panel} className="webinar-invitation" id={`${id}-panel`} aria-labelledby={`${id}-title`}>
          <div className="webinar-topline">
            <span className="eyebrow">{eyebrow}</span>
            <button className="webinar-minimise" type="button" onClick={minimise} aria-label={closeLabel}>
              <span aria-hidden="true">−</span> {laterLabel}
            </button>
          </div>
          <h2 ref={heading} id={`${id}-title`} tabIndex={-1}><Emphasis text={title} /></h2>
          {text && <p><Emphasis text={text} /></p>}
          <a className="btn btn-solid" href={target} target="_blank" rel="noopener noreferrer" onClick={minimise}>{buttonLabel} <span aria-hidden="true">↗</span></a>
        </aside>
      ) : (
        <button ref={teaser} type="button" className="webinar-teaser" onClick={open} aria-expanded={false} aria-label={`${openLabel}: ${plain(title)}`}>
          <span>
            <span className="eyebrow">{eyebrow}</span>
            <span className="webinar-teaser-title"><Emphasis text={title} /></span>
          </span>
          <span className="webinar-teaser-arrow" aria-hidden="true">↗</span>
        </button>
      )}
    </div>
  )
}
