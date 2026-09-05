import type { GlobalConfig } from 'payload'
import { validateExternalUrl } from '../lib/links'

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
      type: 'collapsible', label: 'Navigacija i zakazivanje',
      fields: [
        { name: 'navBlogLabel', label: 'Naziv bilješki u meniju', type: 'text', localized: true, admin: { placeholder: 'Karijerne bilješke' } },
        { name: 'blogAllLabel', label: 'Link ka svim bilješkama', type: 'text', localized: true, admin: { placeholder: 'Sve bilješke' } },
        { name: 'navResourcesLabel', label: 'Naziv resursa u meniju', type: 'text', localized: true, admin: { placeholder: 'Besplatni resursi' } },
        { name: 'bookingUrl', label: 'Link za zakazivanje razgovora', type: 'text', validate: validateExternalUrl, admin: { description: 'Opcioni HTTPS link ka Google formi. Kada je unesen, sva dugmad „Zakaži razgovor” vode tamo. Prazno = kontakt stranica.' } },
      ],
    },
    {
      type: 'collapsible', label: 'Vebinar — iskačući poziv',
      fields: [
        { name: 'webinarEnabled', label: 'Prikaži poziv za vebinar', type: 'checkbox', defaultValue: false },
        { name: 'webinarTitle', label: 'Naslov', type: 'textarea', localized: true },
        { name: 'webinarText', label: 'Opis / datum i vrijeme', type: 'textarea', localized: true },
        { name: 'webinarButtonLabel', label: 'Tekst dugmeta', type: 'text', localized: true, admin: { placeholder: 'Prijavi se za vebinar' } },
        { name: 'webinarUrl', label: 'Link za prijavu', type: 'text', validate: validateExternalUrl, admin: { description: 'HTTPS link ka Google formi za prijavu. Poziv se prikazuje samo kada su uneseni i naslov i link; posjetilac ga može zatvoriti.' } },
      ],
    },
    {
      type: 'collapsible', label: 'Newsletter (kada bude spreman)', admin: { initCollapsed: true },
      fields: [
        { name: 'newsletterEnabled', label: 'Prikaži prijavu u footeru', type: 'checkbox', defaultValue: false },
        { name: 'newsletterTitle', label: 'Naslov', type: 'text', localized: true },
        { name: 'newsletterText', label: 'Opis', type: 'textarea', localized: true },
        { name: 'newsletterButtonLabel', label: 'Tekst dugmeta', type: 'text', localized: true },
        { name: 'newsletterUrl', label: 'MailerLite link za prijavu', type: 'text', validate: validateExternalUrl, admin: { description: 'Link ka MailerLite stranici za prijavu. Uključi tek kada newsletter bude spreman; MailerLite vodi prijavu i potvrdu saglasnosti.' } },
      ],
    },
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
            { label: 'Playfair Display + Montserrat (vizuali)', value: 'playfair-montserrat' },
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
