import { PageHero } from '@/components/sections'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, t, type Locale } from '@/lib/i18n'
import { href, ROUTES } from '@/lib/routes'
import { getPageGlobal, getPosts, getCategories } from '@/lib/payload'
import { buildMetadata, abs, jsonLdString } from '@/lib/seo'
import { BLOG_PAGE_SIZE, blogQuery, blogListingPath, type BlogSearch } from '@/lib/blog'
import { plain } from '@/lib/emphasis'
import PostCard from '@/components/PostCard'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<BlogSearch> }

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  const l: Locale = isLocale(locale) ? locale : 'me'
  const query = blogQuery(await searchParams)
  if (!query) notFound()
  const page = await getPageGlobal('blog-page', l)
  const title = l === 'en' ? 'Career notes' : 'Savjeti za karijeru i promjenu posla'
  const pageLabel = l === 'en' ? 'Page' : 'Stranica'
  const metadata = buildMetadata({
    locale: l,
    path: blogListingPath(query.page, query.category),
    title: query.page > 1 ? `${title} — ${pageLabel} ${query.page}` : `${title} — Jelena Rajković`,
    description: plain(page?.sub),
  })
  // Category filters are useful navigation, but do not need separate search results.
  if (query.category) metadata.robots = { index: false, follow: true }
  return metadata
}

// The category filter lives in the query string (?kategorija=), so this page is rendered per
// request; it cannot share the page cache used by the rest of the site.
export const dynamic = 'force-dynamic'

export default async function BlogIndex({
  params,
  searchParams,
}: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const l = locale
  const query = blogQuery(await searchParams)
  if (!query) notFound()
  const { category: kategorija, page: pageNumber } = query

  const [page, postsRes, categories] = await Promise.all([
    getPageGlobal('blog-page', l),
    getPosts(l, { category: kategorija, page: pageNumber, limit: BLOG_PAGE_SIZE }),
    getCategories(l),
  ])
  const posts = postsRes.docs
  if (pageNumber > Math.max(1, postsRes.totalPages)) notFound()
  if (kategorija && !categories.some((c) => c.slug === kategorija)) notFound()

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
      position: (pageNumber - 1) * BLOG_PAGE_SIZE + i + 1,
      url: abs(href(l, `${ROUTES.blog}/${p.slug}`)),
      name: p.title,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(itemListLd) }} />

      <PageHero eyebrow={page?.eyebrow} headline={page?.headline} sub={page?.sub} />

      <section className="bg-paper px" style={{ padding: 'clamp(40px,6vw,64px) var(--pad-x) clamp(70px,10vw,120px)' }}>
        <div className="wrap">
          <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 'clamp(36px,5vw,52px)' }}>
            <Link href={href(l, ROUTES.blog)} style={chip(!kategorija)}>
              {t(l, 'filter_all')}
            </Link>
            {categories.map((c) => (
              <Link key={c.id} href={href(l, blogListingPath(1, c.slug))} style={chip(kategorija === c.slug)}>
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
          {postsRes.totalPages > 1 && (
            <nav aria-label={l === 'en' ? 'Career notes pages' : 'Stranice karijernih bilješki'} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginTop: 40 }}>
              {postsRes.hasPrevPage && <Link rel="prev" className="btn btn-solid" href={href(l, blogListingPath(pageNumber - 1, kategorija))}>
                {l === 'en' ? '← Previous' : '← Prethodna'}
              </Link>}
              <span aria-current="page">{l === 'en' ? `Page ${pageNumber} of ${postsRes.totalPages}` : `Stranica ${pageNumber} od ${postsRes.totalPages}`}</span>
              {postsRes.hasNextPage && <Link rel="next" className="btn btn-solid" href={href(l, blogListingPath(pageNumber + 1, kategorija))}>
                {l === 'en' ? 'Next →' : 'Sljedeća →'}
              </Link>}
            </nav>
          )}
        </div>
      </section>
    </>
  )
}
