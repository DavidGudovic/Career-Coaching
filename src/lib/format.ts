import type { Locale } from './i18n'

const MONTHS_ME = [
  'januar', 'februar', 'mart', 'april', 'maj', 'jun',
  'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar',
]

// Montenegrin long date: "12. mart 2026" — Intl has no cnr/sr-ME long month
// we control, so format manually for MNE; use Intl for EN.
export function formatDate(date: string | Date | null | undefined, locale: Locale): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return ''
  if (locale === 'en') {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
  }
  return `${d.getDate()}. ${MONTHS_ME[d.getMonth()]} ${d.getFullYear()}`
}


export function formatFileSize(bytes: number, locale: Locale): string {
  const megabytes = bytes >= 1024 * 1024
  const value = megabytes ? bytes / 1024 / 1024 : Math.max(1, Math.round(bytes / 1024))
  return `${new Intl.NumberFormat(locale === 'en' ? 'en' : 'sr-Latn-ME', { maximumFractionDigits: megabytes ? 1 : 0 }).format(value)} ${megabytes ? 'MB' : 'KB'}`
}
