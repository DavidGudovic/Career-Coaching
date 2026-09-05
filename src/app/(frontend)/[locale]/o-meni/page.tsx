import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n'
import { ROUTES } from '@/lib/routes'
import { getPageGlobal } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { Emphasis, plain } from '@/lib/emphasis'
import { MediaImage } from '@/components/MediaImage'
import { CtaBand, PageHero } from '@/components/sections'

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
      <PageHero eyebrow={page?.eyebrow} headline={page?.headline} />

      <section className="bg-paper section-sm">
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px),1fr))', gap: 'clamp(40px,6vw,70px)', alignItems: 'start' }}>
          <div data-reveal className="about-portrait">
            <MediaImage
              media={page?.portrait}
              ratio="3 / 4"
              natural
              sizes="(max-width: 700px) 100vw, 550px"
              placeholderLabel="Portret — zamijeni fotografijom"
              style={{ boxShadow: '0 30px 60px -36px rgba(20,41,43,.6)' }}
            />
          </div>
          <div data-reveal data-reveal-delay="90" className="prose">
            {(page?.body || []).map((p, i) => (
              <p key={p.id || i}><Emphasis text={p.text} /></p>
            ))}
            {page?.quote && <blockquote>{page.quote}</blockquote>}
          </div>
        </div>
      </section>

      <CtaBand locale={locale} headline={page?.ctaHeadline || ''} background="sage" />
    </>
  )
}
