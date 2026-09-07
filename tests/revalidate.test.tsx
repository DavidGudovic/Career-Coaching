import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { PayloadRequest } from 'payload'
import { pathsForGlobal, pathsForPost, purge, cachePath, revalidatePost, revalidateGlobal } from '../src/hooks/revalidate'

const req = (context: Record<string, unknown> = {}) => ({ context, payload: { logger: { warn() {} } } }) as unknown as PayloadRequest

test('cache paths are the public URLs: Montenegrin at the root, English under /en', () => {
  assert.equal(cachePath('me', '/'), '/')
  assert.equal(cachePath('me', '/o-meni'), '/o-meni')
  assert.equal(cachePath('en', '/'), '/en')
  assert.equal(cachePath('en', '/kontakt'), '/en/kontakt')
})

test('a page global purges its page in both languages, site settings purge everything, unknown globals nothing', () => {
  assert.deepEqual(pathsForGlobal('about-page'), ['/o-meni', '/en/o-meni'])
  assert.deepEqual(pathsForGlobal('home-page'), ['/', '/en'])
  assert.equal(pathsForGlobal('site-settings'), 'all')
  assert.deepEqual(pathsForGlobal('something-else'), [])
})

test('a post purges its page, the blog index and the home page in both languages, plus a renamed slug', () => {
  const paths = pathsForPost({ slug: 'novi' }, { slug: 'stari' })
  for (const p of ['/', '/en', '/karijerne-bjeleske', '/en/karijerne-bjeleske', '/karijerne-bjeleske/novi', '/en/karijerne-bjeleske/novi', '/karijerne-bjeleske/stari', '/en/karijerne-bjeleske/stari']) {
    assert.ok(paths.includes(p), `missing ${p}`)
  }
  assert.equal(new Set(paths).size, paths.length, 'no duplicate paths')
  assert.equal(pathsForPost({ slug: 'isti' }, { slug: 'isti' }).filter((p) => p.endsWith('/isti')).length, 2)
})

test('purge calls Next once per path, or once for the whole layout, and honours disableRevalidate', () => {
  process.env.NEXT_RUNTIME = 'nodejs'
  const calls: [string, string?][] = []
  const spy = (path: string, type?: 'page' | 'layout') => { calls.push([path, type]) }

  assert.deepEqual(purge(['/', '/en'], req(), spy), ['/', '/en'])
  assert.deepEqual(calls, [['/', undefined], ['/en', undefined]])

  calls.length = 0
  assert.deepEqual(purge('all', req(), spy), ['/'])
  assert.deepEqual(calls, [['/', 'layout']])

  calls.length = 0
  assert.deepEqual(purge('all', req({ disableRevalidate: true }), spy), [])
  assert.deepEqual(calls, [])

  delete process.env.NEXT_RUNTIME
  assert.deepEqual(purge('all', req(), spy), [], 'outside the Next.js server there is no cache to purge')
  assert.deepEqual(calls, [])
})

test('purge survives a revalidation failure and reports nothing purged', () => {
  process.env.NEXT_RUNTIME = 'nodejs'
  const boom = () => { throw new Error('no store') }
  assert.deepEqual(purge(['/'], req(), boom), [])
  delete process.env.NEXT_RUNTIME
})

test('hooks return the document unchanged and only react to published content', () => {
  const doc = { slug: 'x', _status: 'draft' }
  const out = revalidatePost({ doc, previousDoc: { slug: 'x', _status: 'draft' }, req: req(), operation: 'update', collection: {} as never, context: {} } as never)
  assert.equal(out, doc)
  const g = { title: 'Home' }
  assert.equal(revalidateGlobal({ doc: g, previousDoc: g, req: req(), global: { slug: 'home-page' } as never, context: {} } as never), g)
})
