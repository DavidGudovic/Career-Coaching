import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '@/lib/i18n'
import { href, ROUTES } from '@/lib/routes'
import { getPageGlobal, getPosts, getCategories } from '@/lib/payload'
import { buildMetadata, abs } from '@/lib/seo'
import { Emphasis, plain } from '@/lib/emphasis'
import PostCard from '@/components/PostCard'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l: Locale = isLocale(locale) ? locale : 'me'
  const page = await getPageGlobal('blog-page', l)
  return buildMetadata({
    locale: l,
    path: ROUTES.blog,
    title: l === 'en' ? 'Career notes — Jelena Rajković' : 'Karijerne bjeleške — Jelena Rajković',
    description: plain(page?.sub),
  })
}

export default async function BlogIndex({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ kategorija?: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const l = locale
  const { kategorija } = await searchParams

  const [page, postsRes, categories] = await Promise.all([
    getPageGlobal('blog-page', l),
    getPosts(l, { category: kategorija }),
    getCategories(l),
  ])
  const posts = postsRes.docs

  const chip = (active: boolean) => ({
    padding: '9px 18px',
    borderRadius: 999,
    fontSize: 13.5,
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all .3s ease',
    ...(active
      ? { background: 'var(--teal-deep)', color: 'var(--offwhite)' }
      : { background: 'transparent', border: '1px solid rgba(20,41,43,.2)', color: 'var(--ink)' }),
  })

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(href(l, `${ROUTES.blog}/${p.slug}`)),
      name: p.title,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <section className="bg-teal px" style={{ padding: 'clamp(130px,16vh,190px) var(--pad-x) clamp(56px,8vw,84px)' }}>
        <div className="wrap-narrow">
          <span data-reveal className="eyebrow on-dark" style={{ marginBottom: 24 }}>{page?.eyebrow}</span>
          <h1 data-reveal className="display-1" style={{ color: 'var(--offwhite)', maxWidth: '16ch', margin: '0 0 22px' }}>
            <Emphasis text={page?.headline} tone="dark" />
          </h1>
          <p data-reveal data-reveal-delay="80" className="lead" style={{ color: 'rgba(242,239,232,.8)', maxWidth: '48ch', margin: 0 }}>
            {page?.sub}
          </p>
        </div>
      </section>

      <section className="bg-paper px" style={{ padding: 'clamp(40px,6vw,64px) var(--pad-x) clamp(70px,10vw,120px)' }}>
        <div className="wrap">
          <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 'clamp(36px,5vw,52px)' }}>
            <Link href={href(l, ROUTES.blog)} style={chip(!kategorija)}>
              {t(l, 'filter_all')}
            </Link>
            {categories.map((c) => (
              <Link key={c.id} href={`${href(l, ROUTES.blog)}?kategorija=${c.slug}`} style={chip(kategorija === c.slug)}>
                {c.title}
              </Link>
            ))}
          </div>

          {posts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 30 }}>
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} locale={l} delay={(i % 3) * 70} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'rgba(20,41,43,.6)' }}>{t(l, 'no_posts')}</p>
          )}
        </div>
      </section>
    </>
  )
}
