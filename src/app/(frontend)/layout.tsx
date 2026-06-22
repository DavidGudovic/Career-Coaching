import type { Metadata } from 'next'
import {
  Fraunces,
  Hanken_Grotesk,
  Playfair_Display,
  Inter,
  Lora,
  Source_Sans_3,
  Cormorant,
  Work_Sans,
} from 'next/font/google'
import { headers } from 'next/headers'
import { htmlLang, isLocale } from '@/lib/i18n'
import { SITE_URL } from '@/lib/seo'
import { getSettings } from '@/lib/payload'
import './globals.css'

// Theme (colors + fonts) is read from the CMS per request, so this layout is dynamic.
export const dynamic = 'force-dynamic'

// Font pairings the editor can pick from in the CMS. next/font is build-time, so every
// candidate is declared statically; each serif maps onto --font-fraunces and each sans onto
// --font-hanken (the existing slots in globals.css), so only the chosen pair is applied and
// downstream CSS (--serif / --sans) needs no changes. All include latin-ext for č/ć/š/ž/đ.
const fraunces = Fraunces({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], axes: ['opsz'], variable: '--font-fraunces', display: 'swap' })
const hanken = Hanken_Grotesk({ subsets: ['latin', 'latin-ext'], variable: '--font-hanken', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], variable: '--font-fraunces', display: 'swap' })
const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-hanken', display: 'swap' })
const lora = Lora({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], variable: '--font-fraunces', display: 'swap' })
const sourceSans = Source_Sans_3({ subsets: ['latin', 'latin-ext'], variable: '--font-hanken', display: 'swap' })
const cormorant = Cormorant({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], variable: '--font-fraunces', display: 'swap' })
const workSans = Work_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-hanken', display: 'swap' })

const PAIRINGS: Record<string, { serif: { variable: string }; sans: { variable: string } }> = {
  'fraunces-hanken': { serif: fraunces, sans: hanken },
  'playfair-inter': { serif: playfair, sans: inter },
  'lora-sourcesans': { serif: lora, sans: sourceSans },
  'cormorant-worksans': { serif: cormorant, sans: workSans },
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Jelena Rajković — Mentor za karijernu promjenu',
    template: '%s · Jelena Rajković',
  },
  description:
    'Karijerno iskreno. Individualno mentorstvo za žene koje žele promjenu karijere — od jasnoće do tvog sljedećeg realnog koraka.',
  icons: { icon: '/favicon.svg' },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const xl = h.get('x-locale') || 'me'
  const locale = isLocale(xl) ? xl : 'me'

  // getSettings is React-cache()d, so this call dedupes with the locale layout's fetch.
  const s = await getSettings(locale)
  const v = (val: string | null | undefined, d: string) => (val ? val : d)

  const pair = PAIRINGS[v(s?.fontPairing, 'fraunces-hanken')] ?? PAIRINGS['fraunces-hanken']

  // Override the brand CSS variables from CMS values. html:root wins over globals.css.
  const themeCss = `html:root{--teal-deep:${v(s?.colorTealDeep, '#1c4e52')};--teal:${v(s?.colorTeal, '#2c636a')};--paper:${v(s?.colorPaper, '#f6f2ea')};--ink:${v(s?.colorInk, '#14292b')};--mint:${v(s?.colorMint, '#9dc3b6')};}`

  return (
    <html lang={htmlLang[locale]} className={`${pair.serif.variable} ${pair.sans.variable}`}>
      <head>
        {/* Add a `js` hook before paint so reveal animations only run with JS,
            and content is never hidden for no-JS / crawlers. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
