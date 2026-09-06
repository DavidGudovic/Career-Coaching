import type { Metadata } from 'next'
import type { Locale } from './i18n'
import { htmlLang } from './i18n'
import { href } from './routes'
import { plain } from './emphasis'

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SERVER_URL || 'https://jelena.rajkovic.coach'
).replace(/\/$/, '')

export const abs = (path: string): string => new URL(path, `${SITE_URL}/`).toString()

export const jsonLdString = (value: unknown): string => JSON.stringify(value).replace(/</g, '\\u003c')

export function hasArticleTranslation(post: { title?: string | null; content?: unknown } | undefined): boolean {
  const hasContent = (node: unknown): boolean => {
    if (!node || typeof node !== 'object') return false
    const value = node as { text?: string; type?: string; root?: unknown; children?: unknown[]; value?: unknown }
    return Boolean(value.text?.trim() || (value.type === 'upload' && value.value) ||
      (value.root && hasContent(value.root)) || value.children?.some(hasContent))
  }
  return Boolean(post?.title?.trim() && hasContent(post.content))
}

// hreflang alternates for a given canonical (Montenegrin) path.
export function alternates(path: string, locale: Locale = 'me', available: Locale[] = ['me', 'en']): NonNullable<Metadata['alternates']> {
  return {
    canonical: abs(href(locale, path)),
    languages: {
      ...Object.fromEntries(available.map((l) => [htmlLang[l], abs(href(l, path))])),
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
  availableLocales?: Locale[]
  publishedTime?: string | null
  modifiedTime?: string | null
}

export function buildMetadata({ locale, path, title, description, image, type = 'website', availableLocales = ['me', 'en'], publishedTime, modifiedTime }: MetaArgs): Metadata {
  const url = abs(href(locale, path))
  const fullTitle = plain(title).includes('Jelena Rajković') ? plain(title) : `${plain(title)} · Jelena Rajković`
  const summary = plain(description) || (locale === 'en'
    ? 'Career mentoring with Jelena Rajković. Find clarity, explore your options and take your next realistic career step.'
    : 'Karijerno mentorstvo sa Jelenom Rajković. Pronađi jasnoću, istraži mogućnosti i napravi svoj sljedeći realan korak.')
  const shareImage = abs(image || '/og-default.jpg')
  const translated = availableLocales.includes(locale)
  return {
    title: { absolute: fullTitle },
    description: summary,
    alternates: alternates(path, translated ? locale : 'me', availableLocales),
    ...(!translated ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description: summary,
      url,
      siteName: 'Jelena Rajković',
      locale: locale === 'en' ? 'en_US' : 'sr_ME',
      alternateLocale: availableLocales.filter((l) => l !== locale).map((l) => l === 'en' ? 'en_US' : 'sr_ME'),
      type,
      images: [{ url: shareImage, alt: fullTitle }],
      ...(type === 'article' ? { publishedTime: publishedTime || undefined, modifiedTime: modifiedTime || undefined, authors: [abs(href(locale, '/o-meni'))] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: summary,
      images: [shareImage],
    },
  }
}
