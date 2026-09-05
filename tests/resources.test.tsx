import React from 'react'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import ResourceLibrary from '../src/components/ResourceLibrary'
import type { Media, ResourcesPage } from '../src/payload-types'

const pdf = { id: 1, url: '/api/media/file/guide.pdf', filename: 'guide.pdf', mimeType: 'application/pdf', filesize: 2048 } as Media

test('resources keep working PDF downloads and previews while excluding disabled and unusable entries', () => {
  const page = { id: 1, resources: [
    { id: 'available', title: 'Moj **vodič**', description: 'Prvi red.\nDrugi red.\n\nDrugi pasus.', file: pdf, buttonLabel: 'Preuzmi vodič' },
    { id: 'hidden', title: 'Hidden guide', enabled: false, file: pdf },
    { id: 'image', title: 'Wrong type', file: { ...pdf, mimeType: 'image/jpeg' } },
    { id: 'missing', title: 'Missing URL', file: { ...pdf, url: null } },
    { id: 'unresolved', title: 'Unresolved relation', file: 1 },
  ] } as ResourcesPage
  const html = renderToStaticMarkup(<ResourceLibrary page={page} locale="me" />)
  assert.equal((html.match(/<article/g) || []).length, 1)
  assert.match(html, /href="\/api\/media\/file\/guide.pdf" download="guide.pdf"/)
  assert.match(html, /target="_blank" rel="noopener noreferrer"/)
  assert.match(html, /Preuzmi vodič/)
  assert.match(html, /Pogledaj PDF/)
  assert.match(html, /<strong[^>]*>vodič<\/strong>/)
  assert.match(html, /Prvi red.<br\/>Drugi red./)
  for (const excluded of ['Hidden guide', 'Wrong type', 'Missing URL', 'Unresolved relation']) assert.ok(!html.includes(excluded))
})

test('empty resource libraries preserve the authored message and provide a localized notes link', () => {
  const page = { id: 1, resources: [], emptyText: 'Coming _soon_.' } as ResourcesPage
  const html = renderToStaticMarkup(<ResourceLibrary page={page} locale="en" />)
  assert.match(html, /Coming <em[^>]*>soon<\/em>/)
  assert.match(html, /href="\/en\/karijerne-bjeleske"/)
  assert.match(html, /Career notes/)
  assert.ok(!html.includes('download='))
})
