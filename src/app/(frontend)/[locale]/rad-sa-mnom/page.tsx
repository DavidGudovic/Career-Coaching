import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '@/lib/i18n'
import { href, ROUTES } from '@/lib/routes'
import { getPageGlobal } from '@/lib/payload'
import { buildMetadata, abs } from '@/lib/seo'
import { Emphasis, plain } from '@/lib/emphasis'
import { CtaBand, PageHero } from '@/components/sections'
import AudienceSection from '@/components/AudienceSection'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l: Locale = isLocale(locale) ? locale : 'me'
  const page = await getPageGlobal('work-page', l)
  return buildMetadata({
    locale: l,
    path: ROUTES.work,
    title: l === 'en' ? 'Work with me — 1:1 mentoring' : 'Rad sa mnom — 1:1 mentorstvo',
    description: plain(page?.sub),
  })
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const l = locale
  const page = await getPageGlobal('work-page', l)

  const faqJsonLd = page?.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null

  return (
    <>
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <PageHero eyebrow={page?.eyebrow} headline={page?.headline} sub={page?.sub} />

      {/* FOR WHOM */}
      <AudienceSection heading={page?.forWhomHeading} text={page?.forWhomText} />

      {/* JOURNEY */}
      <section className="bg-sage section-sm">
        <div className="wrap-narrow">
          <h2 data-reveal className="display-3" style={{ margin: '0 0 clamp(36px,5vw,56px)', maxWidth: '18ch' }}>
            <Emphasis text={page?.journeyHeading} />
          </h2>
          <div className="journey-grid journey-path" style={{ '--journey-columns': Math.min(page?.journeySteps?.length || 1, 4) } as CSSProperties}>
            {(page?.journeySteps || []).map((step, i) => (
              <div key={step.id || i} className="journey-step" data-reveal data-reveal-delay={i * 90}>
                {i === 0 && (
                  <>
                    <svg className="journey-approach journey-approach-vertical" viewBox="0 0 176 80" fill="none" aria-hidden="true" focusable="false">
                      <path d="M166 6C144 28 115 4 87 12S43 47 66 49S94 23 62 25S13 36 17 53S26 65 26 80" />
                    </svg>
                    <svg className="journey-approach journey-approach-horizontal" viewBox="0 0 300 100" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
                      <path d="M2 52C40 52 45 14 85 18S135 90 158 62S126 13 108 37S168 91 213 68S263 50 300 50" />
                    </svg>
                  </>
                )}
                <span className="journey-step-number">{String(i + 1).padStart(2, '0')}</span>
                <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 22, margin: '14px 0 10px' }}>{step.title}</h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'rgba(20,41,43,.72)', margin: 0 }}><Emphasis text={step.text} /></p>
              </div>
            ))}
          </div>
          {page?.journeyQuote && (
            <blockquote data-reveal style={{ fontFamily: 'var(--serif)', fontWeight: 340, fontStyle: 'italic', fontSize: 'clamp(22px,3vw,32px)', lineHeight: 1.3, color: 'var(--teal-deep)', margin: 'clamp(44px,6vw,64px) auto 0', maxWidth: '24ch', textAlign: 'center' }}>
              {page.journeyQuote}
            </blockquote>
          )}
        </div>
      </section>

      {/* PRICING + FAQ */}
      <section className="bg-paper section-sm">
        <div className="wrap-text" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px),1fr))', gap: 'clamp(40px,6vw,70px)', alignItems: 'start' }}>
          <div data-reveal className="bg-teal" style={{ borderRadius: 5, padding: 'clamp(32px,4vw,48px)' }}>
            <span className="eyebrow on-dark">{l === 'en' ? 'Pricing' : 'Cijena'}</span>
            <p style={{ fontFamily: 'var(--serif)', fontWeight: 340, fontSize: 'clamp(28px,3.5vw,40px)', lineHeight: 1.1, margin: '16px 0 18px' }}>
              <Emphasis text={page?.priceHeading} tone="dark" />
            </p>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'rgba(242,239,232,.82)', margin: '0 0 28px' }}><Emphasis text={page?.priceText} tone="dark" /></p>
            <Link href={href(l, ROUTES.contact)} className="btn btn-paper" style={{ padding: '14px 24px', fontSize: 15 }}>
              {t(l, 'price_cta')}
            </Link>
          </div>
          <div data-reveal data-reveal-delay="90" className="faq">
            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(24px,3vw,34px)', margin: '0 0 18px' }}>{page?.faqHeading}</h2>
            {(page?.faq || []).map((f, i) => (
              <details key={f.id || i}>
                <summary>
                  {f.question}
                  <span className="plus">+</span>
                </summary>
                <p><Emphasis text={f.answer} /></p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials placeholder — flip `showTestimonials` on in the CMS to reveal later */}
      {page?.showTestimonials ? null : null}

      <CtaBand locale={l} headline={page?.ctaHeadline || ''} background="sage" />
    </>
  )
}
