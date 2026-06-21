import Link from 'next/link'
import LangToggle from './LangToggle'
import { MailIcon, InstagramIcon } from './icons'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import type { NavItem } from './Header'

export default function Footer({
  locale,
  brandName,
  bio,
  nav,
  email,
  instagramUrl,
  instagramHandle,
  copyright,
  tagline,
}: {
  locale: Locale
  brandName: string
  bio: string
  nav: NavItem[]
  email: string
  instagramUrl: string
  instagramHandle: string
  copyright: string
  tagline: string
}) {
  const linkStyle = { textDecoration: 'none', color: 'rgba(242,239,232,.82)', fontSize: 15 }
  const colTitle = {
    fontSize: 12,
    letterSpacing: '.18em',
    textTransform: 'uppercase' as const,
    color: 'var(--mint)',
    fontWeight: 600,
    display: 'block',
    marginBottom: 18,
  }

  return (
    <footer className="bg-footer px" style={{ padding: 'clamp(60px,8vw,90px) var(--pad-x) 40px' }}>
      <div className="wrap">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'clamp(36px,5vw,60px)',
            paddingBottom: 'clamp(40px,5vw,56px)',
            borderBottom: '1px solid rgba(242,239,232,.14)',
          }}
        >
          <div style={{ maxWidth: '30ch' }}>
            <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 24, display: 'block', marginBottom: 14 }}>
              {brandName}
            </span>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(242,239,232,.72)', margin: 0 }}>{bio}</p>
          </div>

          <div>
            <span style={colTitle}>{t(locale, 'foot_nav')}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {nav.map((item) => (
                <Link key={item.href} href={item.href} style={linkStyle}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <span style={colTitle}>{t(locale, 'foot_reach')}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <a href={`mailto:${email}`} style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                <MailIcon /> {email}
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', gap: 9 }}
              >
                <InstagramIcon /> @{instagramHandle}
              </a>
            </div>
          </div>

          <div>
            <span style={colTitle}>{t(locale, 'foot_lang')}</span>
            <LangToggle locale={locale} ariaLabel={t(locale, 'lang_switch')} variant="dark" />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between', paddingTop: 28 }}>
          <span style={{ fontSize: 13, color: 'rgba(242,239,232,.5)' }}>{copyright}</span>
          <span style={{ fontSize: 13, color: 'rgba(242,239,232,.5)' }}>{tagline}</span>
        </div>
      </div>
    </footer>
  )
}
