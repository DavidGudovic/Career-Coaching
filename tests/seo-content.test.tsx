import assert from 'node:assert/strict'
import { test } from 'node:test'
import { articleSeo, articleStructuredData, buildMetadata, abs, jsonLdString } from '../src/lib/seo'
import { blogQuery, blogListingPath } from '../src/lib/blog'
import type { Post, Media } from '../src/payload-types'

const post = {
  id: 1, slug: 'career-change', title: 'Career change', excerpt: 'Your next career step.',
  updatedAt: '2026-09-12T12:00:00Z', createdAt: '2026-09-01T12:00:00Z',
  meta: { title: 'Promjena karijere', description: 'Sljedeći korak.' },
} as Post

test('empty English SEO fields fall back to English article text, not inherited Montenegrin metadata', () => {
  const localized = { ...post, meta: { title: null, description: null } }
  const meta = buildMetadata({ locale: 'en', path: '/karijerne-bjeleske/career-change', ...articleSeo(post, localized) })
  assert.deepEqual(meta.title, { absolute: 'Career change · Jelena Rajković' })
  assert.equal(meta.description, 'Your next career step.')
  assert.equal(meta.alternates?.canonical, abs('/en/karijerne-bjeleske/career-change'))
  assert.equal(meta.robots, undefined)
  assert.deepEqual(articleSeo(post, { ...localized, meta: { title: '  ', description: '\n ' } }), articleSeo(post, localized))
  assert.equal(articleSeo(post, { ...localized, meta: { title: '_A fresh start_', description: '**Your** options.' } }).title, 'A fresh start')
})

test('sharing prefers the chosen SEO image, then the cover and its original when no OG crop exists', () => {
  const cover = { url: '/cover.jpg' } as Media
  const withCover = { ...post, coverImage: cover }
  assert.equal(articleSeo(withCover, { ...withCover, meta: {} }).image, '/cover.jpg')
  const selected = { url: '/selected.jpg', sizes: { og: { url: '/selected-og.webp' } } } as Media
  assert.equal(articleSeo(withCover, { ...post, meta: { image: selected } }).image, '/selected-og.webp')
  assert.equal(articleSeo(post, { ...post, meta: {} }).image, undefined)
})

test('article structured data identifies the author and actual content language, using only a real cover', () => {
  const english = articleStructuredData(post, 'en', ['me', 'en'])
  assert.equal(english.inLanguage, 'en')
  assert.equal(english.author.url, abs('/en/o-meni'))
  assert.equal(english.image, undefined)
  const fallback = articleStructuredData({ ...post, coverImage: { url: '/cover.jpg' } as Media }, 'en', ['me'])
  assert.equal(fallback.inLanguage, 'sr-ME')
  assert.equal(fallback.mainEntityOfPage, abs('/karijerne-bjeleske/career-change'))
  assert.equal(fallback.image, abs('/cover.jpg'))
})

test('JSON-LD survives CMS script delimiters without breaking out of its script element', () => {
  for (const type of ['ItemList', 'FAQPage', 'BlogPosting']) {
    const value = { '@type': type, name: '</script><script>alert("test")</script> & č' }
    const serialized = jsonLdString(value)
    assert.ok(!serialized.includes('<'))
    assert.deepEqual(JSON.parse(serialized), value)
  }
})

test('blog pagination has distinct canonical URLs and preserves an encoded category', () => {
  assert.deepEqual(blogQuery({}), { page: 1, category: undefined })
  assert.deepEqual(blogQuery({ page: '2', kategorija: 'career' }), { page: 2, category: 'career' })
  for (const page of ['0', '-1', '1.5', '2x', '01', '9007199254740992', '']) assert.equal(blogQuery({ page }), null)
  assert.equal(blogQuery({ page: ['1', '2'] }), null)
  assert.equal(blogQuery({ kategorija: ['a', 'b'] }), null)
  assert.equal(blogListingPath(1), '/karijerne-bjeleske')
  assert.equal(blogListingPath(2, 'a&b'), '/karijerne-bjeleske?kategorija=a%26b&page=2')
  const meta = buildMetadata({ locale: 'en', path: blogListingPath(2), title: 'Career notes — Page 2' })
  assert.equal(meta.alternates?.canonical, abs('/en/karijerne-bjeleske?page=2'))
  assert.equal(meta.alternates?.languages?.['sr-ME'], abs('/karijerne-bjeleske?page=2'))
})
