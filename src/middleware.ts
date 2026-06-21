import { NextRequest, NextResponse } from 'next/server'

// Montenegrin (me) is the default and lives at the root: /o-meni
// English (en) is prefixed: /en/o-meni
// The [locale] route segment is fed via internal rewrite so URLs stay clean.

const STRIP = ['/admin', '/api', '/_next', '/media', '/favicon', '/robots', '/sitemap']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (STRIP.some((p) => pathname.startsWith(p)) || pathname.includes('.')) {
    return NextResponse.next()
  }

  const first = pathname.split('/')[1]

  // English: already prefixed, pass through (matches [locale]=en)
  if (first === 'en') {
    const headers = new Headers(req.headers)
    headers.set('x-locale', 'en')
    return NextResponse.next({ request: { headers } })
  }

  // Avoid an exposed /me/* duplicate — redirect to the clean root form
  if (first === 'me') {
    const url = req.nextUrl.clone()
    url.pathname = pathname.replace(/^\/me/, '') || '/'
    return NextResponse.redirect(url)
  }

  // Montenegrin: rewrite clean root path to the /me segment internally
  const url = req.nextUrl.clone()
  url.pathname = `/me${pathname === '/' ? '' : pathname}`
  const headers = new Headers(req.headers)
  headers.set('x-locale', 'me')
  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
