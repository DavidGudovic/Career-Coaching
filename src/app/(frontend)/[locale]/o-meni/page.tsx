import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n'
import { ROUTES } from '@/lib/routes'
import { getPageGlobal } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { Emphasis, plain } from '@/lib/emphasis'
import { MediaImage } from '@/components/MediaImage'
import { CtaBand } from '@/components/sections'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l: Locale = isLocale(locale) ? locale : 'me'
  const page = await getPageGlobal('about-page', l)
  return buildMetadata({
    locale: l,
    path: ROUTES.about,
    title: l === 'en' ? 'About — Jelena Rajković' : 'O meni — Jelena Rajković',
    description: plain(page?.body?.[0]?.text),
  })
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const page = await getPageGlobal('about-page', locale)

  return (
    <>
      <section className="bg-teal px" style={{ padding: 'clamp(130px,16vh,190px) var(--pad-x) clamp(60px,8vw,90px)' }}>
        <div className="wrap-text">
          <span data-reveal className="eyebrow on-dark" style={{ marginBottom: 24 }}>{page?.eyebrow}</span>
          <h1 data-reveal className="display-1" style={{ color: 'var(--offwhite)', maxWidth: '14ch', margin: 0 }}>
            <Emphasis text={page?.headline} tone="dark" />
          </h1>
        </div>
      </section>

      <section className="bg-paper section-sm">
        <div className="wrap-narrow" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 'clamp(40px,6vw,70px)', alignItems: 'start' }}>
          <div data-reveal style={{ position: 'sticky', top: 110 }}>
            <MediaImage
              media={page?.portrait}
              ratio="4 / 5"
              sizes="(max-width: 700px) 100vw, 480px"
              placeholderLabel="Portret — zamijeni fotografijom"
              style={{ boxShadow: '0 30px 60px -36px rgba(20,41,43,.6)' }}
            />
          </div>
          <div data-reveal data-reveal-delay="90" className="prose">
            {(page?.body || []).map((p, i) => (
              <p key={p.id || i}>{p.text}</p>
            ))}
            {page?.quote && <blockquote>{page.quote}</blockquote>}
          </div>
        </div>
      </section>

      <CtaBand locale={locale} headline={page?.ctaHeadline || ''} background="sage" />
    </>
  )
}
