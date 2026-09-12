import { ROUTES } from './routes'

export const BLOG_PAGE_SIZE = 12
export type BlogSearch = { page?: string | string[]; kategorija?: string | string[] }

export function blogQuery(query: BlogSearch) {
  if (Array.isArray(query.page) || Array.isArray(query.kategorija)) return null
  const value = query.page ?? '1'
  if (!/^[1-9]\d*$/.test(value)) return null
  const page = Number(value)
  if (!Number.isSafeInteger(page)) return null
  return { page, category: query.kategorija || undefined }
}

export function blogListingPath(page = 1, category?: string | null): string {
  const query = new URLSearchParams()
  if (category) query.set('kategorija', category)
  if (page > 1) query.set('page', String(page))
  return `${ROUTES.blog}${query.size ? `?${query}` : ''}`
}
