import type { CollectionConfig } from 'payload'
import { lexicalEditor, HeadingFeature, FixedToolbarFeature } from '@payloadcms/richtext-lexical'
import { slugField } from '../fields/slug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: ({ req }) => {
      // Public sees only published; logged-in editors see everything
      if (req.user) return true
      return { _status: { equals: 'published' } }
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'source', '_status'],
    description: 'Karijerne bjeleške — blog. Svaki tekst postoji na oba jezika.',
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 20,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sadržaj',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            { name: 'excerpt', type: 'textarea', localized: true, admin: { description: 'Kratak opis za karticu i SEO.' } },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
            {
              name: 'content',
              type: 'richText',
              localized: true,
              // The default Lexical editor already ships rich text (bold/italic, lists,
              // checklist, blockquote, links, inline images, hr, align, inline code) AND
              // markdown typing shortcuts (## , **bold**, - , > , ---). We only tweak it for
              // blogging: a persistent toolbar (easier for a non-technical writer) and limit
              // headings to h2–h4 (h1 is reserved for the post title).
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                ],
              }),
            },
          ],
        },
        {
          label: 'Izvor',
          description: 'Ako je tekst preuzet iz magazina, označi izvor — prikazuje se poseban tag.',
          fields: [
            {
              name: 'source',
              type: 'select',
              defaultValue: 'original',
              options: [
                { label: 'Originalni tekst', value: 'original' },
                { label: 'Ljepota i zdravlje', value: 'ljepota-i-zdravlje' },
              ],
            },
            {
              name: 'sourceUrl',
              type: 'text',
              admin: {
                condition: (data) => data?.source && data.source !== 'original',
                description: 'Link na originalni članak (prikazuje se kao „Pročitaj original").',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd. MMMM yyyy' } },
    },
    {
      name: 'readingMinutes',
      type: 'number',
      admin: { position: 'sidebar', description: 'Procjena vremena čitanja (min).' },
    },
    ...slugField('title'),
  ],
}
