import { isIP } from 'node:net'
import { ANALYTICS_EVENTS, publicAnalyticsPath, referrerOrigin } from '@/lib/analytics-shared'

export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }
const empty = () => new Response(null, { status: 204, headers })
// Bounded, process-local abuse protection. IPs are never persisted or logged here.
const rates = new Map<string, { count: number; until: number }>()

export async function POST(request: Request) {
  if (process.env.ANALYTICS_ENABLED !== 'true' || !process.env.UMAMI_URL || !process.env.UMAMI_WEBSITE_ID) return empty()
  const origin = new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://jelena.rajkovic.coach').origin
  if (request.headers.get('origin') !== origin || !request.headers.get('content-type')?.startsWith('application/json')) return new Response(null, { status: 403, headers })
  if (request.headers.get('dnt') === '1' || request.headers.get('sec-gpc') === '1' || /(?:^|;\s*)payload-token=/.test(request.headers.get('cookie') || '')) return empty()
  // nginx must overwrite X-Real-IP, and the app port must only be accessible locally.
  const ip = process.env.ANALYTICS_TRUST_PROXY === 'true' ? request.headers.get('x-real-ip') || '' : ''
  const now = Date.now()
  if (ip && isIP(ip)) {
    if (rates.size >= 10000) for (const [key, value] of rates) if (value.until < now) rates.delete(key)
    const rate = rates.get(ip)
    if (rate && rate.until > now) {
      if (++rate.count > 120) return new Response(null, { status: 429, headers })
    } else if (rates.size < 10000) rates.set(ip, { count: 1, until: now + 60000 })
    else return new Response(null, { status: 429, headers })
  }
  try {
    // Stream with a hard bound, including requests without a Content-Length header.
    const reader = request.body?.getReader()
    if (!reader) return new Response(null, { status: 400, headers })
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 8192) { await reader.cancel(); return new Response(null, { status: 413, headers }) }
      chunks.push(value)
    }
    const input = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    const path = publicAnalyticsPath(input?.path)
    if (!path || (input.name !== undefined && !ANALYTICS_EVENTS.includes(input.name))) return new Response(null, { status: 400, headers })
    const forwarded = new Headers({ 'Content-Type': 'application/json', 'User-Agent': request.headers.get('user-agent') || '' })
    if (isIP(ip)) forwarded.set('x-forwarded-for', ip)
    if (typeof input.cache === 'string' && input.cache.length < 2048) forwarded.set('x-umami-cache', input.cache)
    const response = await fetch(`${process.env.UMAMI_URL.replace(/\/$/, '')}/api/send`, {
      method: 'POST', headers: forwarded, cache: 'no-store', signal: AbortSignal.timeout(4000),
      body: JSON.stringify({ type: 'event', payload: {
        website: process.env.UMAMI_WEBSITE_ID, hostname: new URL(origin).hostname,
        url: path, referrer: referrerOrigin(input.referrer),
        language: typeof input.language === 'string' ? input.language.slice(0, 35) : undefined,
        screen: typeof input.screen === 'string' && /^\d{1,5}x\d{1,5}$/.test(input.screen) ? input.screen : undefined,
        ...(input.name ? { name: input.name } : {}),
      } }),
    })
    if (!response.ok) return empty()
    const data = await response.json()
    return Response.json({ cache: typeof data.cache === 'string' ? data.cache : '' }, { headers })
  } catch { return empty() }
}
