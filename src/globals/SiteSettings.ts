import type { GlobalConfig } from 'payload'

// Validacija hex boje (#rrggbb) — sprječava da pogrešan unos pokvari stil sajta.
const hexColor = (val: unknown): true | string =>
  !val || /^#([0-9a-fA-F]{6})$/.test(String(val))
    ? true
    : 'Unesi boju u formatu #rrggbb (npr. #1c4e52).'

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
    {
      type: 'collapsible',
      label: 'Izgled sajta (boje i fontovi)',
      admin: {
        initCollapsed: true,
        description: 'Vizuelni stil sajta — boje i fontovi. Isti je za oba jezika. Mijenja se bez programera.',
      },
      fields: [
        {
          name: 'fontPairing',
          type: 'select',
          defaultValue: 'fraunces-hanken',
          admin: { description: 'Kombinacija fontova (naslovi + tekst).' },
          options: [
            { label: 'Fraunces + Hanken (trenutni)', value: 'fraunces-hanken' },
            { label: 'Playfair + Inter (klasično)', value: 'playfair-inter' },
            { label: 'Lora + Source Sans (toplo)', value: 'lora-sourcesans' },
            { label: 'Cormorant + Work Sans (elegantno)', value: 'cormorant-worksans' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'colorTealDeep', type: 'text', defaultValue: '#1c4e52', validate: hexColor, admin: { width: '50%', description: 'Glavna tamna teal boja (dugmad, naslovi na svijetloj pozadini).' } },
            { name: 'colorTeal', type: 'text', defaultValue: '#2c636a', validate: hexColor, admin: { width: '50%', description: 'Sekundarna teal boja (sekcije, akcenti).' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'colorPaper', type: 'text', defaultValue: '#f6f2ea', validate: hexColor, admin: { width: '50%', description: 'Pozadina (topli papir).' } },
            { name: 'colorInk', type: 'text', defaultValue: '#14292b', validate: hexColor, admin: { width: '50%', description: 'Boja teksta.' } },
          ],
        },
        { name: 'colorMint', type: 'text', defaultValue: '#9dc3b6', validate: hexColor, admin: { description: 'Akcent na tamnoj pozadini (npr. linkovi u footeru).' } },
      ],
    },
  ],
}
