import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n'
import { ROUTES } from '@/lib/routes'
import { getPageGlobal } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'
import { Emphasis } from '@/lib/emphasis'
import { MediaImage } from '@/components/MediaImage'
import { CtaBand, PageHero } from '@/components/sections'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l: Locale = isLocale(locale) ? locale : 'me'
  return buildMetadata({
    locale: l,
    path: ROUTES.about,
    title: l === 'en' ? 'About Jelena Rajković, career-change mentor' : 'O meni — Jelena Rajković, karijerna mentorka',
    // The page opens with a greeting, which made a poor search snippet: describe the page instead.
    description: l === 'en'
      ? 'From biology to IT: Jelena Rajković, a career-change mentor, helps women who want a career change find a clearer direction and their next realistic step.'
      : 'Iz biologije u IT: Jelena Rajković, karijerna mentorka, pomaže ženama koje žele promjenu karijere da pronađu jasniji pravac i svoj sljedeći realan korak.',
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
          </div>
        </div>
        {page?.quote && (
          <blockquote className="about-pullquote wrap-text" data-reveal>
            <span className="about-quote-symbol" aria-hidden="true">“</span>
            <p><Emphasis text={page.quote} /></p>
            <svg viewBox="0 0 340 30" fill="none" aria-hidden="true" focusable="false">
              <path pathLength="1" d="M8 20C72 7 224 4 330 12M73 25C148 16 208 17 264 20" />
            </svg>
          </blockquote>
        )}
      </section>

      <CtaBand locale={locale} headline={page?.ctaHeadline || ''} background="sage" />
    </>
  )
}
