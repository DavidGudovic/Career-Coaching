import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { isLocale, t, type Locale } from '@/lib/i18n'
import { href, ROUTES } from '@/lib/routes'
import { getPostBySlug, getRelatedPosts } from '@/lib/payload'
import { buildMetadata, abs, SITE_URL } from '@/lib/seo'
import { formatDate } from '@/lib/format'
import { MediaImage } from '@/components/MediaImage'
import PostCard from '@/components/PostCard'
import { CtaBand } from '@/components/sections'
import type { Category, Media } from '@/payload-types'

type Params = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params
  const l: Locale = isLocale(locale) ? locale : 'me'
  const post = await getPostBySlug(slug, l)
  if (!post) return {}
  const meta = (post as { meta?: { title?: string; description?: string; image?: Media | number } }).meta
  const ogImage =
    meta?.image && typeof meta.image === 'object' && meta.image.sizes?.og?.url
      ? abs(meta.image.sizes.og.url)
      : undefined
  return buildMetadata({
    locale: l,
    path: `${ROUTES.blog}/${slug}`,
    title: meta?.title || post.title,
    description: meta?.description || post.excerpt || undefined,
    image: ogImage,
    type: 'article',
  })
}

export default async function ArticlePage({ params }: Params) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const l = locale
  const post = await getPostBySlug(slug, l)
  if (!post) notFound()

  const related = await getRelatedPosts(l, post.id, 3)
  const category = typeof post.category === 'object' ? (post.category as Category) : null
  const fromLZ = post.source === 'ljepota-i-zdravlje'
  const dateStr = formatDate(post.publishedAt, l)
  const readStr = post.readingMinutes ? `${post.readingMinutes} ${t(l, 'read_suffix')}` : null

  const metaLine = [dateStr, category?.title, readStr].filter(Boolean).join(' · ')

  const cover = typeof post.coverImage === 'object' ? (post.coverImage as Media) : null
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedAt || undefined,
    inLanguage: l === 'en' ? 'en' : 'sr-ME',
    author: { '@type': 'Person', name: 'Jelena Rajković' },
    image: cover?.sizes?.og?.url ? abs(cover.sizes.og.url) : `${SITE_URL}/og-default.jpg`,
    mainEntityOfPage: abs(href(l, `${ROUTES.blog}/${slug}`)),
    isBasedOn: fromLZ && post.sourceUrl ? post.sourceUrl : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-teal px" style={{ padding: 'clamp(120px,15vh,180px) var(--pad-x) clamp(50px,7vw,80px)' }}>
        <div className="wrap-read">
          <Link href={href(l, ROUTES.blog)} style={{ textDecoration: 'none', color: 'var(--mint)', fontSize: 13.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 26 }}>
            <span style={{ fontFamily: 'var(--serif)' }}>←</span> {t(l, 'art_back')}
          </Link>
          {metaLine && (
            <span style={{ fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--mint)', fontWeight: 600, display: 'block', marginBottom: 18 }}>
              {metaLine}
            </span>
          )}
          <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 340, fontSize: 'clamp(34px,5vw,58px)', lineHeight: 1.08, letterSpacing: '-.015em', margin: 0, color: 'var(--offwhite)' }}>
            {post.title}
          </h1>
          {fromLZ && (
            <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
              <span className="badge on-dark">{t(l, 'source_lz')}</span>
              {post.sourceUrl && (
                <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--mint-light)', fontSize: 14, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  {t(l, 'read_original')} →
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="bg-paper px" style={{ padding: '0 var(--pad-x) clamp(60px,9vw,110px)' }}>
        <div className="wrap-read">
          {cover && (
            <div data-reveal style={{ margin: '-40px 0 clamp(40px,6vw,60px)', boxShadow: '0 30px 60px -36px rgba(20,41,43,.5)' }}>
              <MediaImage media={cover} ratio="16 / 9" sizes="(max-width: 800px) 100vw, 760px" priority />
            </div>
          )}
          <div data-reveal className="prose" style={{ paddingTop: cover ? 0 : 'clamp(40px,6vw,60px)' }}>
            {post.content ? <RichText data={post.content as never} /> : null}
          </div>

          {fromLZ && post.sourceUrl && (
            <p style={{ marginTop: 32, fontSize: 14.5, color: 'rgba(20,41,43,.6)' }}>
              {t(l, 'published_in')} <em>Ljepota i zdravlje Montenegro</em>.{' '}
              <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-deep)' }}>
                {t(l, 'read_original')} →
              </a>
            </p>
          )}

          <div data-reveal style={{ marginTop: 'clamp(48px,6vw,72px)', padding: 'clamp(32px,4vw,44px)', borderRadius: 5, textAlign: 'center' }} className="bg-teal">
            <p style={{ fontFamily: 'var(--serif)', fontWeight: 340, fontSize: 'clamp(24px,3vw,34px)', lineHeight: 1.15, margin: '0 0 22px' }}>
              {l === 'en' ? 'See yourself in this?' : 'Prepoznaješ se?'}
            </p>
            <Link href={href(l, ROUTES.contact)} className="btn btn-paper">
              {t(l, 'cta_book')}
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-sage px" style={{ padding: 'clamp(56px,8vw,90px) var(--pad-x)' }}>
          <div className="wrap-narrow">
            <h2 data-reveal style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(22px,3vw,32px)', margin: '0 0 30px' }}>
              {t(l, 'read_more')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 24 }}>
              {related.map((p, i) => (
                <PostCard key={p.id} post={p} locale={l} delay={i * 80} compact />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
