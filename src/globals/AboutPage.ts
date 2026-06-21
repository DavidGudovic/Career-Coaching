import type { GlobalConfig } from 'payload'
import { emphasisDescription } from '../fields/emphasis'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'O meni',
  access: { read: () => true },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, defaultValue: 'O meni' },
    { name: 'headline', type: 'text', localized: true, defaultValue: 'Mijenjala sam karijeru _i preživjela_ to.', admin: { description: emphasisDescription } },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    {
      name: 'body',
      type: 'array',
      localized: true,
      labels: { singular: 'Pasus', plural: 'Pasusi' },
      defaultValue: [
        { text: 'Sa 26 godina sam radila u struci za koju sam se školovala — biologija. Na papiru, sve je bilo u redu. Iznutra, znala sam da to nije moje mjesto.' },
        { text: 'Prelazak u IT nije bio lagan ni romantičan. Bilo je straha, sumnje, noći učenja poslije posla i pitanja „a šta ako ne uspijem”. Ali korak po korak, napravila sam promjenu koja mi je vratila osjećaj da sam na svom putu.' },
        { text: 'Danas mentorišem žene koje osjećaju isto ono što sam ja osjećala: da su prerasle svoje mjesto, da žele nešto što je njihovo, ali ne znaju odakle da krenu. Ne dajem ti gotove odgovore — pomažem ti da pronađeš svoje.' },
        { text: 'Moj pristup je iskren i bez pritiska. Krećemo od onoga što već imaš, gledamo šta zaista želiš, i zajedno definišemo tvoj sljedeći realan korak. Bez magičnih formula — sa jasnoćom, smjerom i podrškom.' },
      ],
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    { name: 'quote', type: 'textarea', localized: true, defaultValue: '„Karijera može da bude usklađena sa tobom — ne ti sa njom.”' },
    { name: 'ctaHeadline', type: 'text', localized: true, defaultValue: 'Spremna da pogledamo _tvoj_ sljedeći korak?', admin: { description: emphasisDescription } },
  ],
}
