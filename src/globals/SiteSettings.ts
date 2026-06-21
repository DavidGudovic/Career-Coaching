import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Podešavanja sajta',
  access: { read: () => true },
  admin: { description: 'Kontakt podaci, brend i footer — mijenja se bez programera.' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'brandName', type: 'text', defaultValue: 'Jelena Rajković', admin: { width: '50%' } },
        { name: 'brandRole', type: 'text', localized: true, defaultValue: 'Mentor za karijernu promjenu', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', defaultValue: 'jelena.rajkovic.coach@gmail.com', admin: { width: '50%' } },
        {
          name: 'contactRecipient',
          type: 'email',
          defaultValue: 'jelena.rajkovic.coach@gmail.com',
          admin: { width: '50%', description: 'Prima poruke sa kontakt forme.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'instagramHandle', type: 'text', defaultValue: 'jelena.rajkovic.coach', admin: { width: '50%' } },
        { name: 'instagramUrl', type: 'text', defaultValue: 'https://instagram.com/jelena.rajkovic.coach', admin: { width: '50%' } },
      ],
    },
    { name: 'footerBio', type: 'textarea', localized: true, defaultValue: 'Mentorka za karijernu promjenu. Iz biologije u IT — i sada uz tebe na tvom putu.' },
    {
      type: 'row',
      fields: [
        { name: 'footerCopyright', type: 'text', localized: true, defaultValue: '© 2026 Jelena Rajković · Sva prava zadržana', admin: { width: '50%' } },
        { name: 'footerTagline', type: 'text', localized: true, defaultValue: 'Karijerno iskreno · Crna Gora', admin: { width: '50%' } },
      ],
    },
  ],
}
