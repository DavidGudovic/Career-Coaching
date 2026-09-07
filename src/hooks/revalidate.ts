import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'
import { revalidatePath } from 'next/cache'
import { locales, type Locale } from '@/lib/i18n'
import { href, ROUTES } from '@/lib/routes'
import type { Post } from '@/payload-types'

// The public site is rendered once and cached by Next.js (see app/(frontend)/[locale]/layout.tsx).
// These hooks purge exactly the cached pages an edit can affect, so a change made in the
// admin is live on the next request instead of waiting for the time-based revalidation.

/** Next tags a cached page with the public URL it was requested under (`/o-meni`,
 *  `/en/o-meni`), not the internal `/[locale]/...` route the rewrite maps it to, so
 *  purges are addressed by public URL. */
export const cachePath = (locale: Locale, path: string) => href(locale, path)

const forAllLocales = (path: string) => locales.map((l) => cachePath(l, path))

const PAGE_GLOBALS: Record<string, string> = {
  'home-page': ROUTES.home,
  'about-page': ROUTES.about,
  'work-page': ROUTES.work,
  'blog-page': ROUTES.blog,
  'contact-page': ROUTES.contact,
  'resources-page': ROUTES.resources,
}

/** Site settings feed the header, footer and theme of every page: purge everything.
 *  A page global maps to its own page in both languages. */
export function pathsForGlobal(slug: string): string[] | 'all' {
  if (slug === 'site-settings') return 'all'
  const path = PAGE_GLOBALS[slug]
  return path ? forAllLocales(path) : []
}

type PostLike = { slug?: string | null }

/** A post appears on its own page, in the blog index and (as one of the latest three)
 *  on the home page. A renamed slug also leaves a stale page behind under the old name. */
export function pathsForPost(doc: PostLike, previousDoc?: PostLike): string[] {
  const paths = [...forAllLocales(ROUTES.home), ...forAllLocales(ROUTES.blog)]
  for (const slug of new Set([doc.slug, previousDoc?.slug])) {
    if (slug) paths.push(...forAllLocales(`${ROUTES.blog}/${slug}`))
  }
  return paths
}

export type Revalidate = (path: string, type?: 'page' | 'layout') => void

/** Purge cached pages. Skipped when the caller opts out via `context.disableRevalidate`
 *  (Payload's convention for scripts and imports) or when Payload runs outside the
 *  Next.js server, e.g. the seed script, where there is no page cache to purge. */
export function purge(paths: string[] | 'all', req: PayloadRequest, revalidate: Revalidate = revalidatePath): string[] {
  if (req.context?.disableRevalidate || !process.env.NEXT_RUNTIME) return []
  const purged = paths === 'all' ? ['/'] : paths
  try {
    if (paths === 'all') revalidate('/', 'layout')
    else for (const path of paths) revalidate(path)
  } catch (err) {
    req.payload.logger.warn({ err, paths: purged }, 'Could not revalidate cached pages')
    return []
  }
  return purged
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, global, req }) => {
  purge(pathsForGlobal(global.slug), req)
  return doc
}

const isPublished = (doc?: { _status?: string | null }) => doc?._status === 'published'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({ doc, previousDoc, req }) => {
  // Draft saves do not change the public site; publishing and unpublishing do.
  if (isPublished(doc) || isPublished(previousDoc)) purge(pathsForPost(doc, previousDoc), req)
  return doc
}

export const revalidatePostDelete: CollectionAfterDeleteHook<Post> = ({ doc, req }) => {
  purge(pathsForPost(doc), req)
  return doc
}

/** Media and categories can be referenced from any page: purge everything. */
export const revalidateSite: CollectionAfterChangeHook = ({ doc, req }) => {
  purge('all', req)
  return doc
}

export const revalidateSiteOnDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  purge('all', req)
  return doc
}
