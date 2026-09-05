import type { Locale } from './i18n'
import { href, ROUTES } from './routes'

// CMS links may point to Google Forms, MailerLite, or another HTTPS page.
export function externalUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null
  } catch {
    return null
  }
}

export const validateExternalUrl = (value: unknown): true | string =>
  !value || externalUrl(value) ? true : 'Unesi puni HTTPS link (https://…).'

export const bookingHref = (locale: Locale, url?: string | null): string =>
  externalUrl(url) || href(locale, ROUTES.contact)
