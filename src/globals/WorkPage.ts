import type { GlobalConfig } from 'payload'
import { emphasisDescription } from '../fields/emphasis'

export const WorkPage: GlobalConfig = {
  slug: 'work-page',
  label: 'Rad sa mnom',
  access: { read: () => true },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'Rad sa mnom · 1:1 mentorstvo' },
    { name: 'headline', type: 'text', localized: true, defaultValue: 'Zajedno do tvog _sljedećeg realnog_ koraka.', admin: { description: emphasisDescription } },
    { name: 'sub', type: 'textarea', localized: true, defaultValue: 'Individualno mentorstvo za žene u sredini karijere koje žele promjenu — sa jasnoćom umjesto pritiska.' },
    {
      type: 'collapsible',
      label: 'Za koga je',
      fields: [
        { name: 'forWhomHeading', type: 'text', localized: true, defaultValue: 'Za koga je ovo?' },
        { name: 'forWhomText', type: 'textarea', localized: true, defaultValue: 'Za tebe koja osjećaš da si prerasla svoj posao, da želiš nešto svoje, ili da je vrijeme za promjenu — bez obzira na to da li već znaš šta tačno želiš. Ne moraš imati plan. Dovoljno je da osjećaš da može bolje.' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Put (koraci)',
      fields: [
        { name: 'journeyHeading', type: 'text', localized: true, defaultValue: 'Kako izgleda _put_ sa mnom.', admin: { description: emphasisDescription } },
        {
          name: 'journeySteps',
          type: 'array',
          localized: true,
          labels: { singular: 'Korak', plural: 'Koraci' },
          defaultValue: [
            { title: 'Besplatan uvodni razgovor', text: 'Upoznamo se, ispričaš mi gdje si sada. Bez obaveze — vidimo da li smo pravi par za rad.' },
            { title: 'Radimo zajedno', text: 'Kroz niz 1:1 susreta gradimo jasnoću, smjer i realan plan — prilagođen tvojoj situaciji.' },
            { title: 'Tvoj sljedeći realan korak', text: 'Izlaziš sa konkretnim koracima i osjećajem da ponovo imaš smjer — i podršku da kreneš.' },
          ],
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'text', type: 'textarea', required: true },
          ],
        },
        { name: 'journeyQuote', type: 'textarea', localized: true, defaultValue: '„Zajedno možemo da pogledamo šta već imaš, šta želiš, i koji je tvoj sljedeći realan korak.”' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Cijena',
      fields: [
        { name: 'priceHeading', type: 'text', localized: true, defaultValue: 'Cijena _na upit_.', admin: { description: emphasisDescription } },
        { name: 'priceText', type: 'textarea', localized: true, defaultValue: 'Svaki rad je individualan, pa i uslove dogovaramo lično. Javi se i ispričaj mi gdje si — predložiću ti format koji ti najviše odgovara.' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Često pitate (FAQ)',
      fields: [
        { name: 'faqHeading', type: 'text', localized: true, defaultValue: 'Često pitate' },
        {
          name: 'faq',
          type: 'array',
          localized: true,
          labels: { singular: 'Pitanje', plural: 'Pitanja' },
          defaultValue: [
            { question: 'Moram li već znati šta želim?', answer: 'Ne. Većina žena dođe upravo zato što ne zna. Zajedno dolazimo do jasnoće.' },
            { question: 'Da li je sve online?', answer: 'Da, susreti su online, pa možemo raditi bez obzira na to gdje se nalaziš.' },
            { question: 'Šta ako želim samo da probam?', answer: 'Zato i postoji besplatan uvodni razgovor — bez ikakve obaveze nakon njega.' },
          ],
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'showTestimonials',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Uključi sekciju sa preporukama (kasnije, bez redizajna).' },
    },
    { name: 'ctaHeadline', type: 'text', localized: true, defaultValue: 'Počnimo _razgovorom_.', admin: { description: emphasisDescription } },
  ],
}
