import type { Locale } from './i18n'

// Canonical (Montenegrin) path segments, shared across both languages.
// English pages live under the /en prefix with the same segments.
export const ROUTES = {
  home: '/',
  about: '/o-meni',
  work: '/rad-sa-mnom',
  blog: '/karijerne-bjeleske',
  contact: '/kontakt',
} as const

export type RouteKey = keyof typeof ROUTES

export const NAV: { key: RouteKey; uiKey: string }[] = [
  { key: 'home', uiKey: 'nav_home' },
  { key: 'about', uiKey: 'nav_about' },
  { key: 'work', uiKey: 'nav_work' },
  { key: 'blog', uiKey: 'nav_blog' },
  { key: 'contact', uiKey: 'nav_contact' },
]

// Build a locale-aware href. Montenegrin = root, English = /en prefix.
export function href(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path
  if (locale === 'en') return `/en${clean}` || '/en'
  return clean || '/'
}

export const postHref = (locale: Locale, slug: string): string =>
  href(locale, `${ROUTES.blog}/${slug}`)
