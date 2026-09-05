import { isMailConfigured } from '@/lib/mail'
import { externalUrl } from '@/lib/links'
import { PageHero } from '@/components/sections'
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

  const bookingUrl = externalUrl(settings?.bookingUrl)
  const mailConfigured = isMailConfigured()
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
      <PageHero eyebrow={page?.eyebrow} headline={page?.headline} sub={page?.sub} />

      <section className="bg-paper section-sm">
        <div className="wrap-narrow" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px),1fr))', gap: 'clamp(36px,5vw,56px)', alignItems: 'start' }}>
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
            {bookingUrl && <a href={bookingUrl} className="btn btn-solid" style={{ marginBottom: 24 }}>{t(l, 'cta_book')} ↗</a>}
            {mailConfigured ? <ContactForm locale={l} /> : (
              <p>{t(l, 'form_unavailable')} <a href={`mailto:${email}`}>{email}</a></p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
