import type { GlobalConfig } from 'payload'
import { emphasisDescription } from '../fields/emphasis'

export const BlogPage: GlobalConfig = {
  slug: 'blog-page',
  label: 'Bjeleške (naslov)',
  access: { read: () => true },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'Karijerne bjeleške' },
    { name: 'headline', type: 'text', localized: true, defaultValue: 'Karijerno, _iskreno_.', admin: { description: emphasisDescription } },
    { name: 'sub', type: 'textarea', localized: true, defaultValue: 'Bjeleške o promjeni karijere, prelasku u IT i pronalaženju smjera — uključujući kolumne iz magazina Ljepota i zdravlje Montenegro.' },
  ],
}
