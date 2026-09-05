import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/sections'
import { FormattedText, plain } from '@/lib/emphasis'
import { isLocale, t } from '@/lib/i18n'
import { getPageGlobal } from '@/lib/payload'
import { ROUTES } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'
import { formatFileSize } from '@/lib/format'

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
  const resources = (page?.resources || []).filter((item) => item.enabled !== false && typeof item.file === 'object' && item.file?.url && item.file.mimeType === 'application/pdf')
  return (
    <>
      <PageHero eyebrow={page?.eyebrow} headline={page?.headline} sub={page?.sub} />
      <section className="bg-paper section-sm">
        <div className="wrap-narrow">
          {resources.length ? (
            <div className="resources-grid">
              {resources.map((resource) => {
                const file = typeof resource.file === 'object' ? resource.file : null
                if (!file?.url) return null
                return (
                  <article className="resource-card" key={resource.id} data-reveal>
                    <span className="eyebrow">PDF{file.filesize ? ` · ${formatFileSize(file.filesize, locale)}` : ''}</span>
                    <h2>{resource.title}</h2>
                    <FormattedText text={resource.description} />
                    <a href={file.url} download={file.filename || true} className="btn btn-solid">{resource.buttonLabel || t(locale, 'resource_download')} ↓</a>
                  </article>
                )
              })}
            </div>
          ) : <FormattedText text={page?.emptyText} />}
        </div>
      </section>
    </>
  )
}
