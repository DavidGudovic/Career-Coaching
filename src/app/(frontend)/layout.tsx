import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk } from 'next/font/google'
import { headers } from 'next/headers'
import { htmlLang, isLocale } from '@/lib/i18n'
import { SITE_URL } from '@/lib/seo'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
})

const hanken = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-hanken',
  display: 'swap',
})

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

  return (
    <html lang={htmlLang[locale]} className={`${fraunces.variable} ${hanken.variable}`}>
      <head>
        {/* Add a `js` hook before paint so reveal animations only run with JS,
            and content is never hidden for no-JS / crawlers. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
