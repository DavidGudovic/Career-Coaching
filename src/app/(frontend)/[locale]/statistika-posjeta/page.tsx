import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import AnalyticsPreference from '@/components/AnalyticsPreference'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return buildMetadata({ locale, path: '/statistika-posjeta', title: locale === 'en' ? 'Visitor statistics and privacy' : 'Statistika posjeta i privatnost' })
}

export default async function StatisticsPrivacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const english = locale === 'en'
  return <section className="bg-paper section px" style={{ paddingTop: 150 }}><div className="wrap-read">
    <h1 className="display-2">{english ? 'Visitor statistics' : 'Statistika posjeta'}</h1>
    {english ? <>
      <p>Anonymous statistics help us understand which pages are useful, where visits come from and whether the website works well on phones and computers. We use Umami on our own server.</p>
      <p>When enabled, statistics include public page paths, referral websites, browser language, device and browser type, approximate location, and anonymous reading-time milestones and clicks on downloads or contact links. An IP address is processed temporarily to estimate location and distinguish anonymous visits; it is not stored in the analytics database. Age, gender, form contents, URL query parameters and referral-page paths are not collected.</p>
      <p>The analytics integration uses no tracking cookies or cross-site advertising identifiers. A short-lived session token stays in memory. Browser Do Not Track and Global Privacy Control signals are respected. You can also opt out below; this stores only your choice in this browser.</p>
    </> : <>
      <p>Anonimna statistika pomaže da razumijemo koje su stranice korisne, odakle dolaze posjete i kako sajt radi na telefonima i računarima. Koristimo Umami na sopstvenom serveru.</p>
      <p>Kada je uključena, statistika obuhvata putanje javnih stranica, sajtove sa kojih dolaze posjete, jezik pregledača, tip uređaja i pregledača, približnu lokaciju, anonimne pragove vremena čitanja i klikove na preuzimanja ili kontakt. IP adresa se privremeno obrađuje radi procjene lokacije i razlikovanja anonimnih posjeta; ne čuva se u bazi analitike. Ne prikupljamo godine, pol, sadržaj formulara, parametre upita u URL-u ili putanje prethodno posjećenih stranica.</p>
      <p>Analitika ne koristi kolačiće za praćenje niti identifikatore za oglašavanje na drugim sajtovima. Kratkotrajni token posjete ostaje u memoriji. Poštujemo signale Do Not Track i Global Privacy Control iz pregledača. Statistiku možeš isključiti i ispod; u ovom pregledaču se čuva samo tvoj izbor.</p>
    </>}
    <AnalyticsPreference english={english} />
  </div></section>
}
