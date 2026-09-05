import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/sections'
import { plain } from '@/lib/emphasis'
import { isLocale, t } from '@/lib/i18n'
import { getPageGlobal } from '@/lib/payload'
import { ROUTES } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'
import ResourceLibrary from '@/components/ResourceLibrary'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = isLocale(locale) ? locale : 'me'
  const page = await getPageGlobal('resources-page', l)
  return buildMetadata({ locale: l, path: ROUTES.resources, title: t(l, 'nav_resources'), description: plain(page?.sub) })
}

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const page = await getPageGlobal('resources-page', locale)
  return (
    <>
      <PageHero eyebrow={page?.eyebrow} headline={page?.headline} sub={page?.sub} />
      <ResourceLibrary page={page} locale={locale} />
    </>
  )
}
