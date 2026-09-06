import React from 'react'
import Link from 'next/link'
import { ANALYTICS_EVENTS } from '@/lib/analytics-shared'
import type { AnalyticsReport, Metric } from '@/lib/analytics'

const number = (value: number) => new Intl.NumberFormat('sr-Latn-ME').format(Math.round(value || 0))
const duration = (seconds: number) => `${Math.floor(seconds / 60)} min ${Math.round(seconds % 60)} s`
const deviceNames: Record<string, string> = { mobile: 'Telefon', desktop: 'Računar', tablet: 'Tablet', laptop: 'Laptop' }
const eventNames: Record<typeof ANALYTICS_EVENTS[number], string> = {
  'reading-30s': 'Najmanje 30 sekundi', 'reading-60s': 'Najmanje 1 minut', 'reading-120s': 'Najmanje 2 minuta', 'reading-300s': 'Najmanje 5 minuta',
  'resource-download': 'Klik na preuzimanje', 'contact-click': 'Klik na email / telefon', 'booking-click': 'Klik na zakazivanje',
}

function Breakdown({ title, rows, label = (v) => v || 'Nepoznato' }: { title: string; rows: Metric[]; label?: (value: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.y))
  return <section className="analytics-panel"><h2>{title}</h2><p className="analytics-muted">Posjetioci</p>
    {rows.length ? <ul className="analytics-breakdown">{rows.map((row) => <li key={row.x}><div><span>{label(row.x)}</span><strong>{number(row.y)}</strong></div><div className="analytics-track" aria-hidden="true"><span style={{ width: `${row.y / max * 100}%` }} /></div></li>)}</ul> : <p>Još nema podataka.</p>}
  </section>
}

export function AnalyticsDashboard({ report }: { report: AnalyticsReport }) {
  const { stats, days, path } = report
  const countryNames = new Intl.DisplayNames(['sr-Latn'], { type: 'region' })
  const points = report.series.pageviews
  const max = Math.max(1, ...points.map((p) => p.y))
  const query = (newDays: number, newPath = path) => `/admin/analytics?${new URLSearchParams({ days: String(newDays), ...(newPath ? { path: newPath } : {}) })}`
  return <>
    <div className="analytics-toolbar"><nav aria-label="Period analitike">{[7, 30, 90].map((n) => <Link key={n} href={query(n)} aria-current={days === n ? 'page' : undefined}>{n} dana</Link>)}</nav><span className="analytics-muted">Do {new Date(report.endAt).toLocaleString('sr-Latn-ME', { timeZone: 'Europe/Podgorica', dateStyle: 'medium', timeStyle: 'short' })}</span></div>
    {path && <p className="analytics-filter">Stranica: <strong>{path}</strong> · <Link href={query(days, null)}>Prikaži cijeli sajt</Link></p>}
    {stats.pageviews === 0 && <div className="analytics-notice"><strong>Još nema posjeta u ovom periodu.</strong><p>Podaci se prikazuju od uključivanja analitike. Posjete prije toga nije moguće rekonstruisati.</p></div>}
    <div className="analytics-cards">
      {[['Posjetioci', number(stats.visitors)], ['Posjete', number(stats.visits)], ['Pregledi stranica', number(stats.pageviews)], ['Prosječna posjeta', stats.visits ? duration(stats.totaltime / stats.visits) : '—']].map(([label, value]) => <section key={label}><h2>{label}</h2><strong>{value}</strong></section>)}
    </div>
    <section className="analytics-panel"><h2>Pregledi po danima</h2><p className="analytics-muted">Vremenska zona: Europe/Podgorica</p>
      {points.length ? <><div className="analytics-chart" role="img" aria-label={`Dnevni pregledi stranica za posljednjih ${days} dana. Tačne vrijednosti su u tabeli ispod.`}>{points.map((p) => <div key={p.x} title={`${p.x.slice(0, 10)}: ${number(p.y)}`}><span style={{ height: `${Math.max(1, p.y / max * 100)}%` }} /></div>)}</div>
      <details><summary>Prikaži dnevne vrijednosti</summary><div className="analytics-table-wrap"><table><thead><tr><th>Dan</th><th>Pregledi</th></tr></thead><tbody>{points.map((p) => <tr key={p.x}><td>{p.x.slice(0, 10)}</td><td>{number(p.y)}</td></tr>)}</tbody></table></div></details></> : <p>Grafikon će se pojaviti kada stignu prve posjete.</p>}
    </section>
    <section className="analytics-panel"><h2>Šta ljudi čitaju</h2><p className="analytics-muted">Do 20 stranica sa najviše posjetilaca. Izaberi stranicu za njene uređaje, izvore posjeta i vrijeme čitanja.</p>
      <div className="analytics-table-wrap"><table><thead><tr><th>Stranica</th><th>Pregledi</th><th>Posjetioci</th></tr></thead><tbody>{report.pages.map((p) => <tr key={p.name}><td><Link href={query(days, p.name)}>{p.name}</Link></td><td>{number(p.pageviews)}</td><td>{number(p.visitors)}</td></tr>)}</tbody></table></div>
    </section>
    <section className="analytics-panel"><h2>Koliko se zadržavaju</h2><p className="analytics-muted">Broj otvaranja stranice koja su dostigla prag aktivnog vremena. Vrijeme se broji dok je kartica vidljiva i u fokusu, uz aktivnost u posljednjem minutu. Pragovi se preklapaju; ovo je procjena pažnje, ne dokaz da je tekst pročitan.</p>
      <div className="analytics-reading">{ANALYTICS_EVENTS.filter((event) => event.startsWith('reading-')).map((event) => <div key={event}><strong>{number(report.events.find((r) => r.x === event)?.y || 0)}</strong><span>{eventNames[event]}</span></div>)}</div>
    </section>
    <div className="analytics-grid">
      <Breakdown title="Uređaji" rows={report.devices} label={(v) => deviceNames[v.toLowerCase()] || v || 'Nepoznato'} />
      <Breakdown title="Države" rows={report.countries} label={(v) => { try { return v ? countryNames.of(v.toUpperCase()) || v : 'Nepoznato' } catch { return v || 'Nepoznato' } }} />
      <Breakdown title="Odakle dolaze" rows={report.referrers} label={(v) => v || 'Direktno / izvor nije dostupan'} />
      <Breakdown title="Jezici pregledača" rows={report.languages} />
    </div>
    <section className="analytics-panel"><h2>Preuzimanja i kontakt</h2><ul className="analytics-breakdown">{ANALYTICS_EVENTS.filter((event) => !event.startsWith('reading-')).map((event) => <li key={event}><div><span>{eventNames[event]}</span><strong>{number(report.events.find((r) => r.x === event)?.y || 0)}</strong></div></li>)}</ul><p className="analytics-muted">Klikovi ne potvrđuju završeno preuzimanje, poslatu poruku ili zakazan razgovor.</p></section>
    <section className="analytics-notice"><h2>Kako čitati ove brojeve</h2><p>Posjetioci su anonimna procjena i mogu se ponavljati između uređaja i perioda. Država je približna i može biti netačna zbog VPN-a. „Računar” uključuje laptop i desktop. Godine, pol i identitet se ne prikupljaju.</p><p>Prosječna posjeta je vrijeme između prvog i posljednjeg zabilježenog pregleda stranice, podijeljeno brojem posjeta. Kratke posjete mogu imati trajanje 0; za pažnju na pojedinačnom tekstu koristi pragove iznad. Blokatori, privatnost pregledača i posjete prijavljenih urednika mogu smanjiti broj zabilježenih posjeta.</p></section>
  </>
}
