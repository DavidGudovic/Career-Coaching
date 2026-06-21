'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import LangToggle from './LangToggle'
import type { Locale } from '@/lib/i18n'

export type NavItem = { label: string; href: string }

export default function Header({
  locale,
  brandName,
  brandRole,
  nav,
  ctaLabel,
  ctaHref,
  langAria,
  menuOpenLabel,
  menuCloseLabel,
  ctaBookLabel,
}: {
  locale: Locale
  brandName: string
  brandRole: string
  nav: NavItem[]
  ctaLabel: string
  ctaHref: string
  langAria: string
  menuOpenLabel: string
  menuCloseLabel: string
  ctaBookLabel: string
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className="px"
        data-scrolled={scrolled}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 120,
          paddingTop: scrolled ? 13 : 22,
          paddingBottom: scrolled ? 13 : 22,
          transition: 'padding .4s cubic-bezier(.2,.7,.2,1), background .4s ease, box-shadow .4s ease',
          background: scrolled ? 'rgba(246,242,234,.88)' : 'transparent',
          backdropFilter: scrolled ? 'saturate(180%) blur(14px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(14px)' : 'none',
          boxShadow: scrolled ? '0 1px 0 rgba(20,41,43,.08)' : 'none',
        }}
      >
        <div
          className="wrap"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}
        >
        <Link
          href={nav[0]?.href || '/'}
          style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', lineHeight: 1 }}
        >
          <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 21, color: 'var(--ink)' }}>
            {brandName}
          </span>
          <span
            style={{
              fontSize: 10.5,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              color: 'var(--teal)',
              marginTop: 5,
              fontWeight: 600,
            }}
          >
            {brandRole}
          </span>
        </Link>

        <nav className="desk-nav" style={{ alignItems: 'center', gap: 30 }}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="link-underline" style={{ color: 'var(--ink)', fontSize: 15 }}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <LangToggle locale={locale} ariaLabel={langAria} />
          <Link href={ctaHref} className="btn btn-solid head-cta" style={{ padding: '11px 20px', fontSize: 14 }}>
            {ctaLabel}
          </Link>
          <button
            type="button"
            className="burger"
            aria-label={open ? menuCloseLabel : menuOpenLabel}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{
              flexDirection: 'column',
              gap: 5,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 4px',
            }}
          >
            <span style={{ width: 24, height: 2, background: 'var(--ink)', display: 'block', borderRadius: 2 }} />
            <span style={{ width: 24, height: 2, background: 'var(--ink)', display: 'block', borderRadius: 2 }} />
          </button>
        </div>
        </div>
      </header>

      {/* mobile overlay */}
      <div
        style={{
          display: open ? 'flex' : 'none',
          position: 'fixed',
          inset: 0,
          zIndex: 130,
          background: 'var(--teal-deep)',
          flexDirection: 'column',
          padding: '28px clamp(20px,6vw,40px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 21, color: 'var(--offwhite)' }}>
            {brandName}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={menuCloseLabel}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--offwhite)',
              fontSize: 30,
              lineHeight: 1,
              cursor: 'pointer',
              fontFamily: 'var(--serif)',
            }}
          >
            ×
          </button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 48 }}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                textDecoration: 'none',
                color: 'var(--offwhite)',
                fontFamily: 'var(--serif)',
                fontSize: 34,
                fontWeight: 300,
                padding: '14px 0',
                borderBottom: '1px solid rgba(242,239,232,.14)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href={ctaHref}
          onClick={() => setOpen(false)}
          className="btn btn-paper"
          style={{ marginTop: 'auto', justifyContent: 'center' }}
        >
          {ctaBookLabel}
        </Link>
      </div>
    </>
  )
}
