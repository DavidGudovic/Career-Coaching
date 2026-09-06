// Deliberately allow only public routes and a small set of anonymous events.
export const ANALYTICS_EVENTS = ['reading-30s', 'reading-60s', 'reading-120s', 'reading-300s', 'resource-download', 'contact-click', 'booking-click'] as const
export const READING_THRESHOLDS = [30, 60, 120, 300] as const

export function publicAnalyticsPath(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 500 || !value.startsWith('/') || value.startsWith('//') || /[\\\s?#]/.test(value)) return null
  const path = value.replace(/\/$/, '') || '/'
  return /^(?:\/en)?(?:\/(?:o-meni|rad-sa-mnom|kontakt|besplatni-resursi|karijerne-bjeleske(?:\/[a-z0-9-]+)?))?$/.test(path === '/' ? '' : path) ? path : null
}

export function referrerOrigin(value: unknown): string {
  try {
    const url = new URL(String(value))
    return ['https:', 'http:'].includes(url.protocol) ? url.origin : ''
  } catch { return '' }
}

export function analyticsRange(value: unknown, now = Date.now()) {
  const days = ['7', '30', '90'].includes(String(value)) ? Number(value) : 30
  return { days, startAt: now - days * 86400000, endAt: now }
}

// Count only visible, recently active time. Cap timer gaps after sleep/suspension.
export function readingSeconds(elapsed: number, gapMs: number, visible: boolean, idleMs: number): number {
  return elapsed + (visible && idleMs < 60000 ? Math.max(0, Math.min(gapMs, 5000)) / 1000 : 0)
}
