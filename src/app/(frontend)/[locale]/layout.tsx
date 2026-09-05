import WebinarInvitation from '@/components/WebinarInvitation'
import { bookingHref, externalUrl } from '@/lib/links'
import { Emphasis } from '@/lib/emphasis'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RevealManager from '@/components/RevealManager'
import MobileCta from '@/components/MobileCta'
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
  const nav = NAV.map((n) => ({ label: (n.key === 'blog' ? settings?.navBlogLabel : n.key === 'resources' ? settings?.navResourcesLabel : null) || t(locale, n.uiKey), href: href(locale, ROUTES[n.key]) }))
  const bookUrl = bookingHref(locale, settings?.bookingUrl)
  const newsletterUrl = externalUrl(settings?.newsletterUrl)
  const webinarUrl = externalUrl(settings?.webinarUrl)

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
    </>
  )
}
