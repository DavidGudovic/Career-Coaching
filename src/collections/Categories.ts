import type { CollectionConfig } from 'payload'
import { revalidateSite, revalidateSiteOnDelete } from '../hooks/revalidate'
import { slugField } from '../fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: { read: () => true },
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSiteOnDelete] },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    ...slugField('title'),
  ],
}
