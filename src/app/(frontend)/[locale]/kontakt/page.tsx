import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '@/lib/i18n'
import { ROUTES } from '@/lib/routes'
import { getPageGlobal, getSettings } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { Emphasis, plain } from '@/lib/emphasis'
import ContactForm from '@/components/ContactForm'
import { MailIcon, InstagramIcon } from '@/components/icons'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l: Locale = isLocale(locale) ? locale : 'me'
  const page = await getPageGlobal('contact-page', l)
  return buildMetadata({
    locale: l,
    path: ROUTES.contact,
    title: l === 'en' ? 'Contact — Jelena Rajković' : 'Kontakt — Jelena Rajković',
    description: plain(page?.sub),
  })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const l = locale
  const [page, settings] = await Promise.all([getPageGlobal('contact-page', l), getSettings(l)])

  const email = settings?.email || 'jelena.rajkovic.coach@gmail.com'
  const instagramUrl = settings?.instagramUrl || 'https://instagram.com/jelena.rajkovic.coach'
  const instagramHandle = settings?.instagramHandle || 'jelena.rajkovic.coach'

  const channel = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    textDecoration: 'none',
    background: '#fff',
    border: '1px solid rgba(20,41,43,.1)',
    borderRadius: 6,
    padding: '18px 20px',
    color: 'var(--ink)',
    transition: 'transform .35s ease, border-color .35s ease',
  } as const

  return (
    <>
      <section className="bg-teal px" style={{ padding: 'clamp(130px,16vh,190px) var(--pad-x) clamp(56px,8vw,84px)' }}>
        <div className="wrap-text">
          <span data-reveal className="eyebrow on-dark" style={{ marginBottom: 24 }}>{page?.eyebrow}</span>
          <h1 data-reveal className="display-1" style={{ color: 'var(--offwhite)', maxWidth: '16ch', margin: '0 0 22px' }}>
            <Emphasis text={page?.headline} tone="dark" />
          </h1>
          <p data-reveal data-reveal-delay="80" className="lead" style={{ color: 'rgba(242,239,232,.82)', maxWidth: '46ch', margin: 0 }}>
            {page?.sub}
          </p>
        </div>
      </section>

      <section className="bg-paper section-sm">
        <div className="wrap-narrow" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 'clamp(36px,5vw,56px)', alignItems: 'start' }}>
          {/* direct channels */}
          <div data-reveal>
            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(22px,2.6vw,30px)', margin: '0 0 16px' }}>{page?.directHeading}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(20,41,43,.72)', margin: '0 0 24px' }}>{page?.directText}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a href={`mailto:${email}`} style={channel} className="channel">
                <span style={{ color: 'var(--teal)' }}><MailIcon /></span>
                <span>
                  <strong style={{ display: 'block', fontWeight: 600 }}>{t(l, 'email_label')}</strong>
                  <span style={{ color: 'var(--teal)' }}>{email}</span>
                </span>
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={channel} className="channel">
                <span style={{ color: 'var(--teal)' }}><InstagramIcon /></span>
                <span>
                  <strong style={{ display: 'block', fontWeight: 600 }}>{t(l, 'instagram_label')}</strong>
                  <span style={{ color: 'var(--teal)' }}>@{instagramHandle}</span>
                </span>
              </a>
            </div>
          </div>

          {/* form */}
          <div data-reveal data-reveal-delay="90">
            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(22px,2.6vw,30px)', margin: '0 0 16px' }}>{page?.formHeading}</h2>
            {page?.formNote && <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'rgba(20,41,43,.72)', margin: '0 0 22px' }}>{page.formNote}</p>}
            <ContactForm locale={l} />
          </div>
        </div>
      </section>
    </>
  )
}
