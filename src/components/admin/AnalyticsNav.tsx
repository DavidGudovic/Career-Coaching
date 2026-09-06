'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AnalyticsNav() {
  const active = usePathname() === '/admin/analytics'
  return <Link href="/admin/analytics" className={`nav__link${active ? ' nav__link--active' : ''}`} aria-current={active ? 'page' : undefined}><span className="nav__link-label">Analitika</span></Link>
}
