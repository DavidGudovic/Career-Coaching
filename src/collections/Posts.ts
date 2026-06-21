import type { CollectionConfig } from 'payload'
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
            { name: 'content', type: 'richText', localized: true },
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
