import type { GlobalConfig } from 'payload'
import { emphasisDescription } from '../fields/emphasis'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Početna',
  access: { read: () => true },
  fields: [
    {
      type: 'collapsible',
      label: 'Hero',
      fields: [
        { name: 'heroEyebrow', type: 'text', localized: true, defaultValue: 'Karijerno iskreno' },
        { name: 'heroHeadline', type: 'text', localized: true, defaultValue: 'Karijera _može_ da bude **usklađena** _sa tobom._', admin: { description: emphasisDescription } },
        { name: 'heroSub', type: 'textarea', localized: true, defaultValue: 'Za žene koje su prerasle svoj posao i osjećaju da može bolje — ali ne znaju odakle. Zajedno pronalazimo tvoj sljedeći realan korak.' },
        { name: 'heroBadge', type: 'text', localized: true, defaultValue: '„Vidim te.”' },
        { name: 'heroPortrait', type: 'upload', relationTo: 'media', admin: { description: 'Portret u hero sekciji.' } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Vidim te (empatija)',
      fields: [
        { name: 'empathyEyebrow', type: 'text', localized: true, defaultValue: 'Vidim te' },
        { name: 'empathyHeadline', type: 'text', localized: true, defaultValue: 'Možda se nešto od ovoga _tebi_ dešava.', admin: { description: emphasisDescription } },
        {
          name: 'empathyItems',
          type: 'array',
          localized: true,
          labels: { singular: 'Stavka', plural: 'Stavke' },
          defaultValue: [
            { text: 'Osjećaš da si prerasla svoj posao, ali ostaješ jer je sigurno.' },
            { text: 'Prijavljuješ se na poslove i — ništa se ne pomjera.' },
            { text: 'Ne znaš tačno čime želiš da se baviš, samo znaš da nije ovo.' },
            { text: 'Znaš da može bolje — ali ne znaš odakle da kreneš.' },
          ],
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Moja priča (teaser)',
      fields: [
        { name: 'storyEyebrow', type: 'text', localized: true, defaultValue: 'Moja priča' },
        { name: 'storyLine', type: 'textarea', localized: true, defaultValue: 'Iz _biologije_ u IT — sa 26 godina. Prošla sam tačno onu promjenu kroz koju te sada vodim.', admin: { description: emphasisDescription } },
        { name: 'storyLinkLabel', type: 'text', localized: true, defaultValue: 'Pročitaj moju priču' },
        { name: 'storyImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Rad sa mnom (teaser)',
      fields: [
        { name: 'workEyebrow', type: 'text', localized: true, defaultValue: 'Rad sa mnom' },
        { name: 'workHeadline', type: 'text', localized: true, defaultValue: 'Šta dobijaš kada _radimo zajedno?_', admin: { description: emphasisDescription } },
        {
          name: 'workCards',
          type: 'array',
          localized: true,
          labels: { singular: 'Kartica', plural: 'Kartice' },
          defaultValue: [
            { title: 'Jasnoća', text: 'Razumiješ šta zaista želiš — bez magle i tuđih očekivanja.' },
            { title: 'Smjer', text: 'Znaš kuda ideš i zašto baš tamo — usklađeno sa tobom.' },
            { title: 'Realan plan', text: 'Konkretni koraci za tvoju situaciju — ne generičke liste.' },
            { title: 'Podrška', text: 'Neko ko te vidi i drži ti leđa kroz cijelu promjenu.' },
          ],
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'text', type: 'textarea', required: true },
          ],
        },
        { name: 'workLinkLabel', type: 'text', localized: true, defaultValue: 'Kako izgleda rad sa mnom' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Bjeleške (teaser)',
      fields: [
        { name: 'blogEyebrow', type: 'text', localized: true, defaultValue: 'Karijerne bjeleške' },
        { name: 'blogHeadline', type: 'text', localized: true, defaultValue: 'Iskreno o karijeri — _bjeleške_.', admin: { description: emphasisDescription } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Završni poziv (CTA)',
      fields: [
        { name: 'ctaHeadline', type: 'text', localized: true, defaultValue: 'Ako osjećaš da _može bolje_ — počnimo razgovorom.', admin: { description: emphasisDescription } },
        { name: 'ctaSub', type: 'textarea', localized: true, defaultValue: 'Besplatan uvodni razgovor, bez obaveze. Pogledamo šta već imaš, šta želiš, i koji je tvoj sljedeći realan korak.' },
      ],
    },
  ],
}
