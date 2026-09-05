import React from 'react'
import Link from 'next/link'
import { Emphasis, FormattedText, plain } from '@/lib/emphasis'
import { formatFileSize } from '@/lib/format'
import { t, type Locale } from '@/lib/i18n'
import { href, ROUTES } from '@/lib/routes'
import type { ResourcesPage } from '@/payload-types'

function ResourceFolio({ label, index = 0 }: { label: string; index?: number }) {
  return (
    <div className={`resource-visual resource-visual-${index % 3}`} aria-hidden="true">
      <div className="resource-folio">
        <div className="resource-folio-cover">
          <span className="resource-folio-label">{label}</span>
          <svg className="resource-routes" viewBox="0 0 280 230" fill="none" focusable="false">
            {Array.from({ length: 7 }, (_, i) => (
              <path key={i} pathLength="1" d={`M${-40 + i * 12} 248C${120 + i * 12} 192 ${22 + i * 12} 48 ${170 + i * 12} -22`} />
            ))}
            <circle cx="155" cy="116" r="4" fill="currentColor" stroke="none" />
          </svg>
          <div className="resource-folio-bottom">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span>PDF</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResourceLibrary({ page, locale }: { page: ResourcesPage; locale: Locale }) {
  const resources = (page.resources || []).filter((item) => item.enabled !== false && typeof item.file === 'object' && item.file?.url && item.file.mimeType === 'application/pdf')

  return (
    <section className="bg-paper section-sm resource-library">
      <div className="wrap-narrow">
        {resources.length ? (
          <div className="resources-grid">
            {resources.map((resource, index) => {
              const file = typeof resource.file === 'object' ? resource.file : null
              if (!file?.url) return null
              return (
                <article className="resource-card" key={resource.id || index} data-reveal>
                  <ResourceFolio label={page.eyebrow || t(locale, 'nav_resources')} index={index} />
                  <div className="resource-copy">
                    <span className="eyebrow resource-meta">PDF{file.filesize ? ` · ${formatFileSize(file.filesize, locale)}` : ''}</span>
                    <h2><Emphasis text={resource.title} /></h2>
                    <FormattedText text={resource.description} />
                    <div className="resource-actions">
                      <a href={file.url} download={file.filename || true} className="btn btn-solid">
                        {resource.buttonLabel || t(locale, 'resource_download')}
                        <svg className="resource-download-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                          <path d="M12 3v12m-4-4 4 4 4-4M5 17v4h14v-4" />
                        </svg>
                      </a>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="resource-preview" aria-label={`${t(locale, 'resource_preview')}: ${plain(resource.title)} (${t(locale, 'new_tab')})`}>
                        {t(locale, 'resource_preview')} <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="resources-empty" data-reveal>
            <ResourceFolio label={page.eyebrow || t(locale, 'nav_resources')} />
            <div className="resource-copy">
              <FormattedText text={page.emptyText} />
              <Link href={href(locale, ROUTES.blog)} className="resource-preview">{t(locale, 'nav_blog')} <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
