'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import { GlobeIcon } from './icons'

export default function LangToggle({
  locale,
  ariaLabel,
  variant = 'light',
}: {
  locale: Locale
  ariaLabel: string
  variant?: 'light' | 'dark'
}) {
  const pathname = usePathname() || '/'
  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const target = isEn ? pathname.replace(/^\/en/, '') || '/' : `/en${pathname === '/' ? '' : pathname}`

  const a = locale === 'en' ? 'EN' : 'MNE'
  const b = locale === 'en' ? 'MNE' : 'EN'

  const border = variant === 'dark' ? 'rgba(242,239,232,.28)' : 'rgba(20,41,43,.22)'
  const color = variant === 'dark' ? 'var(--offwhite)' : 'var(--ink)'

  return (
    <Link
      href={target}
      aria-label={ariaLabel}
      className="lang-toggle"
      style={{
        border: `1px solid ${border}`,
        background: 'transparent',
        borderRadius: 999,
        padding: '7px 13px',
        fontFamily: 'var(--sans)',
        fontSize: 12.5,
        fontWeight: 600,
        letterSpacing: '.06em',
        color,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all .3s ease',
      }}
    >
      <GlobeIcon />
      {a}&nbsp;·&nbsp;<span style={{ opacity: 0.45 }}>{b}</span>
    </Link>
  )
}
