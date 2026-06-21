import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '@/lib/i18n'
import { href, ROUTES } from '@/lib/routes'
import { getPageGlobal, getPosts, getSettings } from '@/lib/payload'
import { buildMetadata, abs, SITE_URL } from '@/lib/seo'
import { Emphasis, plain } from '@/lib/emphasis'
import { MediaImage } from '@/components/MediaImage'
import PostCard from '@/components/PostCard'
import { CtaBand } from '@/components/sections'
import { ArrowRight } from '@/components/icons'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l: Locale = isLocale(locale) ? locale : 'me'
  const home = await getPageGlobal('home-page', l)
  return buildMetadata({
    locale: l,
    path: ROUTES.home,
    title: l === 'en' ? 'Jelena Rajković — Career-change mentor' : 'Jelena Rajković — Mentor za karijernu promjenu',
    description: plain(home?.heroSub),
  })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const l = locale

  const [home, postsRes, settings] = await Promise.all([
    getPageGlobal('home-page', l),
    getPosts(l, { limit: 3 }),
    getSettings(l),
  ])
  const posts = postsRes.docs

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Jelena Rajković — Mentor za karijernu promjenu',
    description: plain(home?.heroSub),
    url: abs(href(l, ROUTES.home)),
    image: `${SITE_URL}/og-default.jpg`,
    areaServed: 'ME',
    founder: {
      '@type': 'Person',
      name: 'Jelena Rajković',
      jobTitle: settings?.brandRole || 'Mentor za karijernu promjenu',
      email: settings?.email,
      sameAs: settings?.instagramUrl ? [settings.instagramUrl] : undefined,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="bg-teal px" style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(130px,16vh,200px) var(--pad-x) clamp(70px,10vw,120px)' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-10% -10% -20% 40%',
            background:
              'radial-gradient(80% 70% at 70% 30%, var(--teal) 0%, rgba(44,99,106,0) 60%), radial-gradient(60% 80% at 90% 80%, var(--teal-darker) 0%, rgba(22,62,65,0) 70%)',
            opacity: 0.9,
            pointerEvents: 'none',
          }}
        />
        <div className="wrap" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: 'clamp(40px,5vw,80px)', alignItems: 'center' }}>
          <div>
            <div data-reveal style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <span style={{ width: 26, height: 1, background: 'var(--mint)', display: 'block' }} />
              <span className="eyebrow on-dark">{home?.heroEyebrow}</span>
            </div>
            <h1 data-reveal className="display-1" style={{ color: 'var(--offwhite)', margin: '0 0 26px' }}>
              <Emphasis text={home?.heroHeadline} tone="dark" />
            </h1>
            <p data-reveal data-reveal-delay="90" className="lead" style={{ color: 'rgba(242,239,232,.82)', maxWidth: '30em', margin: '0 0 38px' }}>
              {home?.heroSub}
            </p>
            <div data-reveal data-reveal-delay="180" style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link href={href(l, ROUTES.contact)} className="btn btn-paper">
                {t(l, 'cta_book')}
                <ArrowRight />
              </Link>
              <Link href={href(l, ROUTES.work)} className="btn btn-ghost">
                {t(l, 'cta_more')}
              </Link>
            </div>
          </div>
          <div data-reveal data-reveal-delay="120" style={{ position: 'relative' }}>
            <MediaImage
              media={home?.heroPortrait}
              ratio="4 / 5"
              sizes="(max-width: 800px) 100vw, 480px"
              priority
              placeholderLabel="Portret — zamijeni fotografijom"
              style={{ boxShadow: '0 40px 80px -40px rgba(0,0,0,.6)' }}
            />
            {home?.heroBadge && (
              <div style={{ position: 'absolute', top: 24, left: -22, background: 'var(--paper)', color: 'var(--ink)', padding: '14px 18px', borderRadius: 3, boxShadow: '0 18px 40px -20px rgba(0,0,0,.5)', maxWidth: 200 }}>
                <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, lineHeight: 1.25 }}>{home.heroBadge}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EMPATHY */}
      <section className="bg-paper section">
        <div className="wrap-narrow" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 'clamp(40px,6vw,90px)', alignItems: 'start' }}>
          <div>
            <span data-reveal className="eyebrow" style={{ marginBottom: 20 }}>{home?.empathyEyebrow}</span>
            <h2 data-reveal className="display-2" style={{ margin: 0 }}>
              <Emphasis text={home?.empathyHeadline} />
            </h2>
          </div>
          <ul data-reveal data-reveal-delay="100" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
            {(home?.empathyItems || []).map((item, i, arr) => (
              <li
                key={item.id || i}
                style={{
                  fontSize: 'clamp(17px,1.6vw,21px)',
                  lineHeight: 1.5,
                  padding: '20px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(20,41,43,.12)' : 'none',
                }}
              >
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* STORY TEASER */}
      <section className="bg-sage section">
        <div className="wrap-narrow grid-2">
          <div data-reveal>
            <MediaImage media={home?.storyImage} ratio="5 / 4" sizes="(max-width: 700px) 100vw, 520px" placeholderLabel="Otvoreni put — placeholder" />
          </div>
          <div data-reveal data-reveal-delay="90">
            <span className="eyebrow" style={{ marginBottom: 22 }}>{home?.storyEyebrow}</span>
            <p style={{ fontFamily: 'var(--serif)', fontWeight: 340, fontSize: 'clamp(24px,3vw,38px)', lineHeight: 1.18, letterSpacing: '-.01em', margin: '0 0 30px' }}>
              <Emphasis text={home?.storyLine} />
            </p>
            <Link href={href(l, ROUTES.about)} className="link-underline" style={{ color: 'var(--teal-deep)', fontSize: 15.5, display: 'inline-flex', gap: 9, alignItems: 'center' }}>
              {home?.storyLinkLabel || t(l, 'story_link')}
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* WORK CARDS */}
      <section className="bg-paper section">
        <div className="wrap">
          <div data-reveal style={{ maxWidth: 640, marginBottom: 'clamp(40px,6vw,64px)' }}>
            <span className="eyebrow" style={{ marginBottom: 18 }}>{home?.workEyebrow}</span>
            <h2 className="display-2" style={{ margin: 0 }}>
              <Emphasis text={home?.workHeadline} />
            </h2>
          </div>
          <div className="grid-auto">
            {(home?.workCards || []).map((card, i) => (
              <div key={card.id || i} className="card" data-reveal data-reveal-delay={i * 70}>
                <span className="card-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
          <div data-reveal style={{ marginTop: 40 }}>
            <Link href={href(l, ROUTES.work)} className="btn btn-solid">
              {home?.workLinkLabel || t(l, 'work_link')}
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* BLOG TEASER */}
      <section className="bg-sage section">
        <div className="wrap">
          <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'clamp(36px,5vw,56px)' }}>
            <div style={{ maxWidth: 560 }}>
              <span className="eyebrow" style={{ marginBottom: 18 }}>{home?.blogEyebrow}</span>
              <h2 className="display-2" style={{ margin: 0 }}>
                <Emphasis text={home?.blogHeadline} />
              </h2>
            </div>
            <Link href={href(l, ROUTES.blog)} className="link-underline" style={{ color: 'var(--teal-deep)', fontSize: 15 }}>
              {t(l, 'blog_all')} →
            </Link>
          </div>
          {posts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 24 }}>
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} locale={l} delay={i * 90} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'rgba(20,41,43,.6)' }}>{t(l, 'no_posts')}</p>
          )}
        </div>
      </section>

      <CtaBand locale={l} headline={home?.ctaHeadline || ''} sub={home?.ctaSub || undefined} />
    </>
  )
}
