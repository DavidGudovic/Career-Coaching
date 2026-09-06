import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { analyticsConfigured, getAnalyticsReport } from '@/lib/analytics'
import { AnalyticsDashboard } from './AnalyticsDashboard'

export async function AnalyticsView(props: AdminViewServerProps) {
  const { initPageResult } = props
  const { req, visibleEntities } = initPageResult
  // Explicit gate before any analytics request, including direct view navigation.
  if (!req.user) redirect('/admin/login?redirect=%2Fadmin%2Fanalytics')
  let report = null
  let failed = false
  if (analyticsConfigured()) {
    try { report = await getAnalyticsReport(req.query.days, req.query.path) }
    catch { failed = true }
  }
  return <DefaultTemplate {...props} req={req} visibleEntities={visibleEntities}>
    <Gutter className="analytics-view"><h1>Analitika sajta</h1><p className="analytics-intro">Šta se čita, odakle dolaze posjetioci i koliko se zadržavaju.</p>
      {process.env.ANALYTICS_ENABLED !== 'true' && <div className="analytics-notice">Prikupljanje novih posjeta je trenutno isključeno.</div>}
      {report ? <AnalyticsDashboard report={report} /> : <div className="analytics-notice" role="status"><h2>{failed ? 'Analitika trenutno nije dostupna' : 'Analitika još nije povezana'}</h2><p>{failed ? 'Podaci nijesu izgubljeni. Pokušaj ponovo za nekoliko minuta.' : 'Kada se poveže servis za analitiku, ovdje će se prikazivati stvarne posjete. Istorijski podaci se ne popunjavaju unazad.'}</p></div>}
    </Gutter>
  </DefaultTemplate>
}
