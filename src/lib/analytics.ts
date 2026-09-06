import 'server-only'
import { analyticsRange, publicAnalyticsPath } from './analytics-shared'

export type Metric = { x: string; y: number }
export type PageMetric = { name: string; pageviews: number; visitors: number }
export type AnalyticsReport = {
  days: number; path: string | null; startAt: number; endAt: number
  stats: { pageviews: number; visitors: number; visits: number; bounces: number; totaltime: number }
  series: { pageviews: Metric[] }
  pages: PageMetric[]; devices: Metric[]; countries: Metric[]; referrers: Metric[]; languages: Metric[]; events: Metric[]
}

export function analyticsConfigured() {
  return Boolean(process.env.UMAMI_URL && process.env.UMAMI_WEBSITE_ID && process.env.UMAMI_USERNAME && process.env.UMAMI_PASSWORD)
}

export async function getAnalyticsReport(days: unknown, requestedPath: unknown): Promise<AnalyticsReport> {
  if (!analyticsConfigured()) throw new Error('Analytics is not configured')
  const base = process.env.UMAMI_URL!.replace(/\/$/, '')
  const website = encodeURIComponent(process.env.UMAMI_WEBSITE_ID!)
  const range = analyticsRange(days)
  const path = publicAnalyticsPath(requestedPath)
  // No browser-visible credentials, share URLs or cross-user cached report responses.
  const login = await fetch(`${base}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(5000),
    body: JSON.stringify({ username: process.env.UMAMI_USERNAME, password: process.env.UMAMI_PASSWORD }),
  })
  if (!login.ok) throw new Error('Analytics sign-in failed')
  const auth = await login.json()
  if (typeof auth.token !== 'string') throw new Error('Invalid analytics sign-in response')
  const params = new URLSearchParams({ startAt: String(range.startAt), endAt: String(range.endAt) })
  if (path) params.set('path', `eq.${path}`)
  async function get<T>(endpoint: string, extra: Record<string, string> = {}): Promise<T> {
    const query = new URLSearchParams(params)
    for (const [key, value] of Object.entries(extra)) query.set(key, value)
    const res = await fetch(`${base}/api/websites/${website}/${endpoint}?${query}`, {
      headers: { Authorization: `Bearer ${auth.token}` }, cache: 'no-store', signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error('Analytics report unavailable')
    return res.json()
  }
  const [stats, series, pages, devices, countries, referrers, languages, events] = await Promise.all([
    get<AnalyticsReport['stats']>('stats'),
    get<AnalyticsReport['series']>('pageviews', { unit: 'day', timezone: 'Europe/Podgorica' }),
    get<Array<Omit<PageMetric, 'pageviews'> & { pageviews: number | string }>>('metrics/expanded', { type: 'path', limit: '20' }),
    get<Metric[]>('metrics', { type: 'device', limit: '10' }),
    get<Metric[]>('metrics', { type: 'country', limit: '15' }),
    get<Metric[]>('metrics', { type: 'referrer', limit: '15' }),
    get<Metric[]>('metrics', { type: 'language', limit: '10' }),
    get<Metric[]>('metrics', { type: 'event', limit: '20' }),
  ])
  if (!Number.isFinite(stats.pageviews) || !Array.isArray(series.pageviews) || ![pages, devices, countries, referrers, languages, events].every(Array.isArray)) throw new Error('Unsupported analytics response')
  // PostgreSQL-backed Umami returns expanded pageview counts as numeric strings.
  const normalizedPages = pages.map((page) => ({ ...page, pageviews: Number(page.pageviews) }))
  if (normalizedPages.some((page) => !Number.isFinite(page.pageviews))) throw new Error('Unsupported analytics page count')
  return { ...range, path, stats, series, pages: normalizedPages, devices, countries, referrers, languages, events }
}
