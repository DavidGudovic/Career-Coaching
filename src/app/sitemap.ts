import type { MetadataRoute } from 'next'
import { locales, type Locale } from '@/lib/i18n'
import { ROUTES, href } from '@/lib/routes'
import { abs, alternates } from '@/lib/seo'
import { getPosts, getTranslatedPostIds } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  const add = (path: string, available: Locale[], lastModified?: string) => {
    for (const locale of available) entries.push({
      url: abs(href(locale, path)),
      lastModified,
      alternates: { languages: alternates(path, locale, available).languages as Record<string, string> },
    })
  }
  for (const path of Object.values(ROUTES)) add(path, [...locales])
  add('/statistika-posjeta', [...locales])

  // Page through the collection so older posts do not disappear after a fixed cap.
  let page = 1
  while (true) {
    const posts = await getPosts('me', { limit: 100, page })
    const translated = await getTranslatedPostIds(posts.docs.map((p) => p.id))
    for (const post of posts.docs) {
      add(`${ROUTES.blog}/${post.slug}`, translated.has(post.id) ? ['me', 'en'] : ['me'], post.updatedAt)
    }
    if (!posts.hasNextPage) break
    page++
  }
  return entries
}
