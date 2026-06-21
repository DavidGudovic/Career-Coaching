import 'server-only'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import type { Locale } from './i18n'

export const client = cache(async () => getPayload({ config }))

export const getSettings = cache(async (locale: Locale) => {
  const payload = await client()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 1 })
})

type PageSlug = 'home-page' | 'about-page' | 'work-page' | 'blog-page' | 'contact-page'

// Generic over slug so each call resolves to its specific global type.
export async function getPageGlobal<S extends PageSlug>(slug: S, locale: Locale) {
  const payload = await client()
  return payload.findGlobal({ slug, locale, depth: 2 })
}

export const getPosts = cache(
  async (locale: Locale, opts?: { limit?: number; category?: string }) => {
    const payload = await client()
    const where: Where = { _status: { equals: 'published' } }
    if (opts?.category) where['category.slug'] = { equals: opts.category }
    return payload.find({
      collection: 'posts',
      locale,
      depth: 2,
      limit: opts?.limit ?? 50,
      sort: '-publishedAt',
      where,
    })
  },
)

export const getPostBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await client()
  const res = await payload.find({
    collection: 'posts',
    locale,
    depth: 2,
    limit: 1,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return res.docs[0] ?? null
})

export const getCategories = cache(async (locale: Locale) => {
  const payload = await client()
  const res = await payload.find({ collection: 'categories', locale, depth: 0, limit: 50, sort: 'title' })
  return res.docs
})

export const getRelatedPosts = cache(
  async (locale: Locale, excludeId: string | number, limit = 3) => {
    const payload = await client()
    const res = await payload.find({
      collection: 'posts',
      locale,
      depth: 2,
      limit,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' }, id: { not_equals: excludeId } },
    })
    return res.docs
  },
)
