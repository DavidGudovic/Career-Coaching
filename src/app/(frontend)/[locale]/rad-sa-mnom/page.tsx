import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '@/lib/i18n'
import { href, ROUTES } from '@/lib/routes'
import { getPageGlobal } from '@/lib/payload'
import { buildMetadata, abs } from '@/lib/seo'
import { Emphasis, plain } from '@/lib/emphasis'
import { CtaBand } from '@/components/sections'

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

      <section className="bg-teal px" style={{ padding: 'clamp(130px,16vh,190px) var(--pad-x) clamp(60px,8vw,90px)' }}>
        <div className="wrap-text">
          <span data-reveal className="eyebrow on-dark" style={{ marginBottom: 24 }}>{page?.eyebrow}</span>
          <h1 data-reveal className="display-1" style={{ color: 'var(--offwhite)', maxWidth: '16ch', margin: '0 0 26px' }}>
            <Emphasis text={page?.headline} tone="dark" />
          </h1>
          <p data-reveal data-reveal-delay="90" className="lead" style={{ color: 'rgba(242,239,232,.82)', maxWidth: '42ch', margin: 0 }}>
            {page?.sub}
          </p>
        </div>
      </section>

      {/* FOR WHOM */}
      <section className="bg-paper section-sm">
        <div className="wrap-text" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 'clamp(36px,6vw,70px)' }}>
          <h2 data-reveal style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(24px,3vw,34px)', margin: 0 }}>
            {page?.forWhomHeading}
          </h2>
          <p data-reveal data-reveal-delay="80" style={{ fontSize: 'clamp(16px,1.4vw,18.5px)', lineHeight: 1.75, margin: 0 }}>
            {page?.forWhomText}
          </p>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="bg-sage section-sm">
        <div className="wrap-narrow">
          <h2 data-reveal className="display-3" style={{ margin: '0 0 clamp(36px,5vw,56px)', maxWidth: '18ch' }}>
            <Emphasis text={page?.journeyHeading} />
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 24 }}>
            {(page?.journeySteps || []).map((step, i) => (
              <div key={step.id || i} data-reveal data-reveal-delay={i * 90} style={{ background: 'var(--paper)', borderRadius: 4, padding: '34px 30px', border: '1px solid rgba(20,41,43,.07)' }}>
                <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 30, color: 'var(--teal)' }}>{i + 1}</span>
                <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 24, margin: '14px 0 10px' }}>{step.title}</h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'rgba(20,41,43,.72)', margin: 0 }}>{step.text}</p>
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
        <div className="wrap-text" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 'clamp(40px,6vw,70px)', alignItems: 'start' }}>
          <div data-reveal className="bg-teal" style={{ borderRadius: 5, padding: 'clamp(32px,4vw,48px)' }}>
            <span className="eyebrow on-dark">{l === 'en' ? 'Pricing' : 'Cijena'}</span>
            <p style={{ fontFamily: 'var(--serif)', fontWeight: 340, fontSize: 'clamp(28px,3.5vw,40px)', lineHeight: 1.1, margin: '16px 0 18px' }}>
              <Emphasis text={page?.priceHeading} tone="dark" />
            </p>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'rgba(242,239,232,.82)', margin: '0 0 28px' }}>{page?.priceText}</p>
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
                <p>{f.answer}</p>
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
