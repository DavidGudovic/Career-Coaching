import React from 'react'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { Emphasis, FormattedText, plain } from '../src/lib/emphasis'
import { bookingHref, externalUrl, validateExternalUrl } from '../src/lib/links'
import { isMailConfigured } from '../src/lib/mail'
import { MediaImage } from '../src/components/MediaImage'
import type { Media } from '../src/payload-types'

test('editor formatting preserves paragraphs, line breaks and emphasis without injecting HTML', () => {
  const html = renderToStaticMarkup(<FormattedText text={'Prvi **korak**.\nDrugi red.\n\n_Stani_ i razmisli. <script>alert(1)</script>'} />)
  assert.equal((html.match(/<p>/g) || []).length, 2)
  assert.match(html, /<strong[^>]*>korak<\/strong>/)
  assert.match(html, /<br\/>Drugi red/)
  assert.match(html, /<em[^>]*>Stani<\/em>/)
  assert.ok(!html.includes('<script>'))
})

test('headlines support Windows line breaks and metadata stays on one line', () => {
  assert.equal(renderToStaticMarkup(<Emphasis text={'Jedan\r\nDva'} />), 'Jedan<br/>Dva')
  assert.equal(plain('**Jedan**\n\n_Dva_'), 'Jedan Dva')
})

test('CMS links allow HTTPS registration pages and reject executable or credential URLs', () => {
  assert.equal(externalUrl(' https://forms.gle/example '), 'https://forms.gle/example')
  for (const url of ['javascript:alert(1)', '//example.com', 'http://example.com', 'https://user:pass@example.com', 'not a url']) {
    assert.equal(externalUrl(url), null)
    assert.notEqual(validateExternalUrl(url), true)
  }
  assert.equal(validateExternalUrl(''), true)
  assert.equal(bookingHref('en', ''), '/en/kontakt')
  assert.equal(bookingHref('me', 'https://forms.gle/example'), 'https://forms.gle/example')
})

test('missing or placeholder SMTP settings cannot enable contact delivery', () => {
  const keys = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'] as const
  const before = keys.map((key) => process.env[key])
  try {
    keys.forEach((key) => { process.env[key] = '' })
    assert.equal(isMailConfigured(), false)
    Object.assign(process.env, { SMTP_HOST: 'smtp.example.test', SMTP_USER: 'test', SMTP_PASS: 'local-test', SMTP_FROM: 'sender@example.test' })
    assert.equal(isMailConfigured(), true)
    process.env.SMTP_HOST = '...'
    assert.equal(isMailConfigured(), false)
  } finally {
    keys.forEach((key, i) => { if (before[i] === undefined) delete process.env[key]; else process.env[key] = before[i] })
  }
})

test('story images retain their natural ratio and expose originals for high-DPI screens', () => {
  const media = { id: 1, url: '/original.jpg', width: 3600, height: 5400, focalX: 40, focalY: 20, sizes: { feature: { url: '/feature.webp', width: 1600 } } } as Media
  const html = renderToStaticMarkup(<MediaImage media={media} ratio="4 / 5" natural />)
  assert.match(html, /aspect-ratio:3600 \/ 5400/)
  assert.match(html, /original.jpg 3600w/)
  assert.match(html, /object-position:40% 20%/)
})
