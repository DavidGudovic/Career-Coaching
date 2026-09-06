import React from 'react'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { buildMetadata, abs, jsonLdString, hasArticleTranslation } from '../src/lib/seo'
import robots from '../src/app/robots'
import { analyticsRange, publicAnalyticsPath, readingSeconds, referrerOrigin } from '../src/lib/analytics-shared'
import { POST } from '../src/app/telemetry/collect/route'
import { AnalyticsDashboard } from '../src/components/admin/AnalyticsDashboard'
import type { AnalyticsReport } from '../src/lib/analytics'

test('English canonical URLs are self-referential with reciprocal alternates and one brand name', () => {
  const meta = buildMetadata({ locale: 'en', path: '/o-meni', title: 'About — Jelena Rajković' })
  assert.equal(meta.alternates?.canonical, abs('/en/o-meni'))
  assert.equal(meta.alternates?.languages?.['sr-ME'], abs('/o-meni'))
  assert.deepEqual(meta.title, { absolute: 'About — Jelena Rajković' })
  assert.ok(JSON.stringify(meta.openGraph).includes(abs('/og-default.jpg')))
})

test('untranslated English articles are noindex and do not advertise an English alternate', () => {
  const meta = buildMetadata({ locale: 'en', path: '/karijerne-bjeleske/test', title: 'Naslov', availableLocales: ['me'] })
  assert.deepEqual(meta.robots, { index: false, follow: true })
  assert.equal(meta.alternates?.canonical, abs('/karijerne-bjeleske/test'))
  assert.equal(meta.alternates?.languages?.en, undefined)
  assert.equal(hasArticleTranslation({ title: 'Translated title', content: { root: { children: [{ type: 'paragraph', children: [] }] } } }), false)
  assert.equal(hasArticleTranslation({ title: 'Translated title', content: { root: { children: [{ text: 'Translated body' }] } } }), true)
})

test('structured data cannot terminate its script, absolute media URLs stay intact, crawlers can fetch uploads', () => {
  assert.ok(!jsonLdString({ headline: '</script><script>alert(1)</script>' }).includes('<'))
  assert.equal(abs('https://cdn.example.com/photo.jpg'), 'https://cdn.example.com/photo.jpg')
  assert.ok(JSON.stringify(robots().rules).includes('/api/media/file/'))
})

test('analytics allows public pages only and strips referrer paths and queries', () => {
  for (const value of ['/', '/en', '/kontakt', '/en/karijerne-bjeleske/career-notes']) assert.equal(publicAnalyticsPath(value), value)
  for (const value of ['/admin', '/api/users', '/kontakt?email=private', '//evil.test', '/%61dmin', '/en/../admin', '/kontakt#private', '/contact\\admin']) assert.equal(publicAnalyticsPath(value), null)
  assert.equal(referrerOrigin('https://example.com/private?email=a@b.com'), 'https://example.com')
  assert.equal(referrerOrigin('javascript:alert(1)'), '')
  assert.equal(analyticsRange('999999', 10000000000).days, 30)
})

test('engagement pauses for background and idle tabs and caps sleep gaps', () => {
  assert.equal(readingSeconds(30, 5000, false, 0), 30)
  assert.equal(readingSeconds(30, 5000, true, 60001), 30)
  assert.equal(readingSeconds(30, 3600000, true, 0), 35)
  assert.equal(readingSeconds(30, 5000, true, 100), 35)
})

test('collector authenticates origin, strips sensitive fields, excludes editors and fails quietly', async () => {
  const before = { ...process.env }
  const originalFetch = global.fetch
  process.env.ANALYTICS_ENABLED = 'true'
  process.env.ANALYTICS_TRUST_PROXY = 'true'
  process.env.UMAMI_URL = 'http://umami:3000'
  process.env.UMAMI_WEBSITE_ID = 'configured-website'
  process.env.NEXT_PUBLIC_SERVER_URL = 'https://site.test'
  const requests: { url: string; body: any; headers: Headers }[] = []
  global.fetch = async (url, init) => {
    requests.push({ url: String(url), body: JSON.parse(String(init?.body)), headers: init?.headers as Headers })
    return Response.json({ cache: 'short-lived-cache', secret: 'do-not-forward' })
  }
  const request = (body: unknown, extra = {}) => new Request('https://site.test/telemetry/collect', {
    method: 'POST', headers: { origin: 'https://site.test', 'content-type': 'application/json', 'x-real-ip': '203.0.113.4', ...extra }, body: JSON.stringify(body),
  })
  try {
    const result = await POST(request({ path: '/en', referrer: 'https://search.test/private?q=secret', name: 'reading-30s', email: 'secret', website: 'attacker', ip: '1.2.3.4', language: 'en', screen: '1440x900' }))
    assert.equal(result.status, 200)
    assert.deepEqual(await result.json(), { cache: 'short-lived-cache' })
    assert.equal(requests[0].body.payload.website, 'configured-website')
    assert.equal(requests[0].body.payload.referrer, 'https://search.test')
    assert.equal(requests[0].body.payload.email, undefined)
    assert.equal(requests[0].body.payload.ip, undefined)
    assert.equal(requests[0].headers.get('x-forwarded-for'), '203.0.113.4')
    assert.equal((await POST(request({ path: '/en' }, { origin: 'https://evil.test' }))).status, 403)
    assert.equal((await POST(request({ path: '/admin' }))).status, 400)
    assert.equal((await POST(request({ path: '/', name: 'secret-data' }))).status, 400)
    assert.equal((await POST(request({ path: '/' }, { cookie: 'payload-token=editor' }))).status, 204)
    assert.equal((await POST(request({ path: '/' }, { 'sec-gpc': '1' }))).status, 204)
    assert.equal((await POST(request({ path: '/', junk: 'x'.repeat(9000) }))).status, 413)
    assert.equal(requests.length, 1)
    global.fetch = async () => { throw new Error('Offline') }
    assert.equal((await POST(request({ path: '/' }))).status, 204)
  } finally { global.fetch = originalFetch; process.env = before }
})

test('dashboard distinguishes empty data from unavailable data and renders real report values safely', () => {
  const report: AnalyticsReport = { days: 30, path: null, startAt: 0, endAt: 1,
    stats: { pageviews: 42, visitors: 10, visits: 14, bounces: 3, totaltime: 1400 },
    series: { pageviews: [{ x: '2026-09-06', y: 42 }] }, pages: [{ name: '/o-meni', pageviews: 42, visitors: 10 }],
    devices: [{ x: 'mobile', y: 8 }], countries: [{ x: 'ME', y: 10 }], referrers: [{ x: '<script>bad</script>', y: 1 }], languages: [], events: [{ x: 'reading-30s', y: 7 }],
  }
  const html = renderToStaticMarkup(<AnalyticsDashboard report={report} />)
  assert.ok(html.includes('42') && html.includes('Telefon') && html.includes('1 min 40 s'))
  assert.ok(html.includes('path=%2Fo-meni'))
  assert.ok(!html.includes('<script>bad'))
  report.stats.pageviews = 0
  assert.match(renderToStaticMarkup(<AnalyticsDashboard report={report} />), /Još nema posjeta/)
})
