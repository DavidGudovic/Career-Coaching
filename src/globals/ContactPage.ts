import type { GlobalConfig } from 'payload'
import { emphasisDescription } from '../fields/emphasis'

// Contact channels are Instagram + email + a contact form only.
// (WhatsApp / Calendly intentionally removed per Jelena's request.)
export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Kontakt',
  access: { read: () => true },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'Kontakt' },
    { name: 'headline', type: 'text', localized: true, defaultValue: 'Počnimo sa _jednim razgovorom_.', admin: { description: emphasisDescription } },
    { name: 'sub', type: 'textarea', localized: true, defaultValue: 'Izaberi način koji ti najviše odgovara — piši mi direktno na email, javi se na Instagram, ili popuni formu. Bez pritiska.' },
    {
      type: 'collapsible',
      label: 'Direktni kontakt',
      fields: [
        { name: 'directHeading', type: 'text', localized: true, defaultValue: 'Javi se direktno' },
        { name: 'directText', type: 'textarea', localized: true, defaultValue: 'Najbrže ćeš me dobiti na email ili Instagram. Piši mi gdje si sada — odgovaram lično.' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Forma',
      fields: [
        { name: 'formHeading', type: 'text', localized: true, defaultValue: 'Ili mi piši' },
        { name: 'formNote', type: 'textarea', localized: true, defaultValue: 'Popuni formu i javiću ti se u najkraćem roku.' },
      ],
    },
  ],
}
