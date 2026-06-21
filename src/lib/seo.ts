import type { Metadata } from 'next'
import type { Locale } from './i18n'
import { htmlLang } from './i18n'
import { href } from './routes'

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SERVER_URL || 'https://jelena.dgudovic.dev'
).replace(/\/$/, '')

export const abs = (path: string): string => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

// hreflang alternates for a given canonical (Montenegrin) path.
export function alternates(path: string): NonNullable<Metadata['alternates']> {
  return {
    canonical: abs(href('me', path)),
    languages: {
      [htmlLang.me]: abs(href('me', path)),
      [htmlLang.en]: abs(href('en', path)),
      'x-default': abs(href('me', path)),
    },
  }
}

type MetaArgs = {
  locale: Locale
  path: string
  title: string
  description?: string
  image?: string
  type?: 'website' | 'article'
}

export function buildMetadata({ locale, path, title, description, image, type = 'website' }: MetaArgs): Metadata {
  const url = abs(href(locale, path))
  return {
    title,
    description,
    alternates: alternates(path),
    openGraph: {
      title,
      description,
      url,
      siteName: 'Jelena Rajković',
      locale: htmlLang[locale],
      type,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}
