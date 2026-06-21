import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'
import { ROUTES, href } from '@/lib/routes'
import { abs } from '@/lib/seo'
import { getPosts } from '@/lib/payload'

// Generated on request (reads the DB), so it stays current and needs no DB at build time.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = Object.values(ROUTES)
  const entries: MetadataRoute.Sitemap = []

  for (const path of staticPaths) {
    entries.push({
      url: abs(href('me', path)),
      changeFrequency: 'monthly',
      priority: path === ROUTES.home ? 1 : 0.7,
      alternates: { languages: { 'sr-ME': abs(href('me', path)), en: abs(href('en', path)) } },
    })
  }

  // Posts (Montenegrin canonical; English alternate)
  const posts = await getPosts('me', { limit: 500 })
  for (const post of posts.docs) {
    const p = `${ROUTES.blog}/${post.slug}`
    entries.push({
      url: abs(href('me', p)),
      lastModified: post.updatedAt || post.publishedAt || undefined,
      changeFrequency: 'yearly',
      priority: 0.6,
      alternates: { languages: { 'sr-ME': abs(href('me', p)), en: abs(href('en', p)) } },
    })
  }

  return entries
}
