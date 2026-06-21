import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RevealManager from '@/components/RevealManager'
import { isLocale, t, locales } from '@/lib/i18n'
import { NAV, ROUTES, href } from '@/lib/routes'
import { getSettings } from '@/lib/payload'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Render from the CMS on each request so Jelena's edits appear immediately.
export const dynamic = 'force-dynamic'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const settings = await getSettings(locale)
  const nav = NAV.map((n) => ({ label: t(locale, n.uiKey), href: href(locale, ROUTES[n.key]) }))

  return (
    <>
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
        ctaHref={href(locale, ROUTES.contact)}
        langAria={t(locale, 'lang_switch')}
        menuOpenLabel={t(locale, 'menu_open')}
        menuCloseLabel={t(locale, 'menu_close')}
      />
      <main id="main">{children}</main>
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
      <RevealManager />
    </>
  )
}
