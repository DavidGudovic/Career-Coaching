import Link from 'next/link'
import { Emphasis } from '@/lib/emphasis'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import { href, ROUTES } from '@/lib/routes'
import { ArrowRight } from './icons'
import Parallax from './Parallax'

// Dark inner-page hero (About / Work / Blog / Contact)
export function PageHero({
  eyebrow,
  headline,
  sub,
}: {
  eyebrow: string
  headline: string
  sub?: string
}) {
  return (
    <section
      className="bg-teal px"
      style={{ padding: 'clamp(130px,16vh,190px) var(--pad-x) clamp(56px,8vw,90px)' }}
    >
      <div className="wrap-text">
        <span data-reveal className="eyebrow on-dark" style={{ marginBottom: 24 }}>
          {eyebrow}
        </span>
        <h1 data-reveal className="display-1" style={{ color: 'var(--offwhite)', maxWidth: '16ch', margin: 0 }}>
          <Emphasis text={headline} tone="dark" />
        </h1>
        {sub && (
          <p data-reveal data-reveal-delay="80" className="lead" style={{ color: 'rgba(242,239,232,.82)', maxWidth: '46ch', margin: '22px 0 0' }}>
            {sub}
          </p>
        )}
      </div>
    </section>
  )
}

// Reusable closing CTA band
export function CtaBand({
  locale,
  headline,
  sub,
  centered = true,
  background = 'teal',
}: {
  locale: Locale
  headline: string
  sub?: string
  centered?: boolean
  background?: 'teal' | 'sage'
}) {
  const dark = background === 'teal'
  return (
    <section
      className={dark ? 'bg-teal px' : 'bg-sage px'}
      style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(70px,11vw,140px) var(--pad-x)', textAlign: centered ? 'center' : 'left' }}
    >
      {dark && (
        <Parallax
          speed={0.08}
          style={{
            position: 'absolute',
            inset: '-20%',
            background:
              'radial-gradient(70% 80% at 50% 0%, rgba(44,99,106,.45), rgba(44,99,106,.12) 50%, transparent 85%)',
          }}
        />
      )}
      <div data-reveal style={{ position: 'relative', maxWidth: 760, margin: centered ? '0 auto' : 0 }}>
        <h2 className="display-3" style={{ color: dark ? 'var(--offwhite)' : 'var(--ink)', margin: '0 0 22px' }}>
          <Emphasis text={headline} tone={dark ? 'dark' : 'light'} />
        </h2>
        {sub && (
          <p className="lead" style={{ color: dark ? 'rgba(242,239,232,.82)' : 'rgba(20,41,43,.8)', margin: '0 0 36px' }}>
            {sub}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: centered ? 'center' : 'flex-start' }}>
          <Link href={href(locale, ROUTES.contact)} className={dark ? 'btn btn-paper' : 'btn btn-solid'}>
            {t(locale, 'cta_book')}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}
