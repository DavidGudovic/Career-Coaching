import type { GlobalConfig } from 'payload'
import { emphasisDescription } from '../fields/emphasis'

export const ResourcesPage: GlobalConfig = {
  slug: 'resources-page',
  label: 'Besplatni resursi',
  access: { read: () => true },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'Besplatni resursi' },
    { name: 'headline', type: 'textarea', localized: true, defaultValue: 'Mali koraci za _tvoju_ karijeru.', admin: { description: emphasisDescription } },
    { name: 'sub', type: 'textarea', localized: true, defaultValue: 'Vodiči i vježbe koji ti pomažu da zastaneš, razmisliš i napraviš sljedeći korak — svojim tempom.' },
    { name: 'emptyText', type: 'textarea', localized: true, defaultValue: 'Prvi besplatni resurs stiže uskoro. Svrati ponovo.' },
    {
      name: 'resources', type: 'array', localized: true,
      labels: { singular: 'Resurs', plural: 'Resursi' },
      admin: { description: 'Dodaj PDF vodič ili checklistu. Redosljed mijenjaš prevlačenjem; isključi „Prikaži” da privremeno sakriješ resurs.' },
      fields: [
        { name: 'enabled', label: 'Prikaži', type: 'checkbox', defaultValue: true },
        { name: 'title', label: 'Naslov', type: 'text', required: true },
        { name: 'description', label: 'Opis', type: 'textarea', admin: { description: emphasisDescription } },
        { name: 'file', label: 'PDF dokument', type: 'upload', relationTo: 'media', required: true, filterOptions: { mimeType: { equals: 'application/pdf' } }, admin: { description: 'Otpremi PDF ili izaberi već otpremljeni dokument iz Media biblioteke.' } },
        { name: 'buttonLabel', label: 'Tekst dugmeta', type: 'text' },
      ],
    },
  ],
}
