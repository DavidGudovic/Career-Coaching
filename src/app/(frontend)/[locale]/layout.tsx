import type { Metadata } from 'next'
import {
  Fraunces,
  Hanken_Grotesk,
  Playfair_Display,
  Inter,
  Montserrat,
  Lora,
  Source_Sans_3,
  Cormorant,
  Work_Sans,
} from 'next/font/google'
import { Suspense } from 'react'
import WebinarInvitation from '@/components/WebinarInvitation'
import { bookingHref, externalUrl } from '@/lib/links'
import { Emphasis } from '@/lib/emphasis'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RevealManager from '@/components/RevealManager'
import MobileCta from '@/components/MobileCta'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { htmlLang, isLocale, t, type Locale } from '@/lib/i18n'
import { NAV, ROUTES, href } from '@/lib/routes'
import { getSettings } from '@/lib/payload'
import { SITE_URL } from '@/lib/seo'
import '../globals.css'
import '../artistry.css'
import '../explorations.css'

// ---------------------------------------------------------------------------------------
// Rendering and caching
//
// Every public page is rendered once, cached by Next.js, and served from that cache until
// the CMS changes it: the Payload hooks in src/hooks/revalidate.ts purge the affected pages
// on publish, so edits are live on the next request. `revalidate` is only a safety net.
//
// Pages are generated on first request rather than at build time because content lives in
// the CMS database, which is not available (and would be stale anyway) when the image is
// built. Returning no params here is the documented way to ask for that ("all paths at
// runtime"); it still marks the route as cacheable.
// ---------------------------------------------------------------------------------------
export const revalidate = 3600

export function generateStaticParams(): { locale: Locale }[] {
  return []
}

// Font pairings the editor can pick from in the CMS. next/font is build-time, so every
// candidate is declared statically; each serif maps onto --font-fraunces and each sans onto
// --font-hanken (the existing slots in globals.css), so only the chosen pair is applied and
// downstream CSS (--serif / --sans) needs no changes. All include latin-ext for č/ć/š/ž/đ.
const fraunces = Fraunces({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], axes: ['opsz'], variable: '--font-fraunces', display: 'swap', preload: false })
const hanken = Hanken_Grotesk({ subsets: ['latin', 'latin-ext'], variable: '--font-hanken', display: 'swap', preload: false })
const playfair = Playfair_Display({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], variable: '--font-fraunces', display: 'swap', preload: false })
const montserrat = Montserrat({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], variable: '--font-hanken', display: 'swap', preload: false })
const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-hanken', display: 'swap', preload: false })
const lora = Lora({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], variable: '--font-fraunces', display: 'swap', preload: false })
const sourceSans = Source_Sans_3({ subsets: ['latin', 'latin-ext'], variable: '--font-hanken', display: 'swap', preload: false })
const cormorant = Cormorant({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], variable: '--font-fraunces', display: 'swap', preload: false })
const workSans = Work_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-hanken', display: 'swap', preload: false })

const PAIRINGS: Record<string, { serif: { variable: string }; sans: { variable: string } }> = {
  'fraunces-hanken': { serif: fraunces, sans: hanken },
  'playfair-montserrat': { serif: playfair, sans: montserrat },
  'playfair-inter': { serif: playfair, sans: inter },
  'lora-sourcesans': { serif: lora, sans: sourceSans },
  'cormorant-worksans': { serif: cormorant, sans: workSans },
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mentor za promjenu karijere · Jelena Rajković',
    template: '%s · Jelena Rajković',
  },
  description:
    'Karijerno iskreno. Individualno mentorstvo za žene koje žele promjenu karijere — od jasnoće do tvog sljedećeg realnog koraka.',
  // favicon.ico on the default path is what Google's favicon crawler and older clients
  // request; the SVG serves modern browsers, the PNGs and Apple touch icon cover phones.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: requested } = await params
  // The root layout must always render <html>; an unknown locale falls back to the default
  // shell and the page itself answers with the 404 page.
  const locale: Locale = isLocale(requested) ? requested : 'me'

  const settings = await getSettings(locale)
  const v = (val: string | null | undefined, d: string) => (val ? val : d)

  const pair = PAIRINGS[v(settings?.fontPairing, 'fraunces-hanken')] ?? PAIRINGS['fraunces-hanken']

  // Override the brand CSS variables from CMS values. html:root wins over globals.css.
  const themeCss = `html:root{--teal-deep:${v(settings?.colorTealDeep, '#1c4e52')};--teal:${v(settings?.colorTeal, '#2c636a')};--paper:${v(settings?.colorPaper, '#f6f2ea')};--ink:${v(settings?.colorInk, '#14292b')};--mint:${v(settings?.colorMint, '#9dc3b6')};}`

  const nav = NAV.map((n) => ({ label: (n.key === 'blog' ? settings?.navBlogLabel : n.key === 'resources' ? settings?.navResourcesLabel : null) || t(locale, n.uiKey), href: href(locale, ROUTES[n.key]) }))
  const bookUrl = bookingHref(locale, settings?.bookingUrl)
  const newsletterUrl = externalUrl(settings?.newsletterUrl)
  const webinarUrl = externalUrl(settings?.webinarUrl)

  // The pre-paint reveal script intentionally adds the `js` class before hydration.
  return (
    <html suppressHydrationWarning lang={htmlLang[locale]} className={`${pair.serif.variable} ${pair.sans.variable}`}>
      <head>
        {/* Add a `js` hook before paint so reveal animations only run with JS,
            and content is never hidden for no-JS / crawlers. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body>
        <div className="site-shell">
          <a href="#main" className="skip-link">
            {t(locale, 'skip')}
          </a>
          <Header
            locale={locale}
            brandName={settings?.brandName || 'Jelena Rajković'}
            brandRole={settings?.brandRole || 'Mentor za karijernu promjenu'}
            nav={nav}
            ctaLabel={t(locale, 'cta_short')}
            ctaBookLabel={t(locale, 'cta_book')}
            ctaHref={bookUrl}
            langAria={t(locale, 'lang_switch')}
            menuOpenLabel={t(locale, 'menu_open')}
            menuCloseLabel={t(locale, 'menu_close')}
          />
          <main id="main">{children}</main>
          {settings?.newsletterEnabled && newsletterUrl && (
            <section className="bg-sage section-sm">
              <div className="wrap-read" style={{ textAlign: 'center' }}>
                <h2 className="display-3"><Emphasis text={settings.newsletterTitle || t(locale, 'newsletter_title')} /></h2>
                {settings.newsletterText && <p className="lead"><Emphasis text={settings.newsletterText} /></p>}
                <a className="btn btn-solid" style={{ marginTop: 24 }} href={newsletterUrl} target="_blank" rel="noopener noreferrer">{settings.newsletterButtonLabel || t(locale, 'newsletter_cta')} ↗</a>
              </div>
            </section>
          )}
          {settings?.webinarEnabled && settings.webinarTitle && webinarUrl && (
            <WebinarInvitation title={settings.webinarTitle} text={settings.webinarText} url={webinarUrl} buttonLabel={settings.webinarButtonLabel || t(locale, 'webinar_cta')} closeLabel={t(locale, 'webinar_close')} laterLabel={t(locale, 'webinar_later')} openLabel={t(locale, 'webinar_open')} eyebrow={locale === 'en' ? 'Webinar' : 'Vebinar'} />
          )}
          <Footer
            locale={locale}
            brandName={settings?.brandName || 'Jelena Rajković'}
            bio={settings?.footerBio || ''}
            nav={nav}
            email={settings?.email || 'jelena.rajkovic.coach@gmail.com'}
            instagramUrl={settings?.instagramUrl || 'https://instagram.com/jelena.rajkovic.coach'}
            instagramHandle={settings?.instagramHandle || 'jelena.rajkovic.coach'}
            copyright={settings?.footerCopyright || '© 2026 Jelena Rajković'}
            tagline={settings?.footerTagline || 'Karijerno iskreno · Crna Gora'}
          />
          <MobileCta href={bookUrl} label={t(locale, 'cta_short')} />
          <Suspense fallback={null}>
            <RevealManager />
          </Suspense>
        </div>
        {process.env.ANALYTICS_ENABLED === 'true' && process.env.UMAMI_WEBSITE_ID && <AnalyticsTracker />}
      </body>
    </html>
  )
}
