import type { Field } from 'payload'

const slugify = (val: string): string =>
  val
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics (č→c, ž→z, ...)
    .replace(/đ/g, 'dj')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

// A non-localized slug, auto-derived from `source` field if left empty.
export const slugField = (source = 'title'): Field[] => [
  {
    name: 'slug',
    type: 'text',
    index: true,
    unique: true,
    admin: {
      position: 'sidebar',
      description: 'URL dio. Ostavi prazno da se generiše automatski.',
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === 'string' && value.length > 0) return slugify(value)
          const fallback = (data?.[source] as string) || ''
          return fallback ? slugify(fallback) : value
        },
      ],
    },
  },
]
