import { withPayload } from '@payloadcms/next/withPayload'

// Montenegrin (me) is the default language and lives at the root: /o-meni
// English (en) is prefixed: /en/o-meni
// The [locale] route segment is fed by a rewrite so public URLs stay clean. This is declared
// here rather than in middleware because the router resolves config rewrites before rendering,
// which keeps the rewritten pages eligible for the page cache; middleware rewrites do not.
//
// Paths that must not be rewritten: the English tree, the admin and API, Next internals,
// telemetry, any file (anything with a dot: favicon.svg, robots.txt, sitemap.xml ...), and
// the internal /me tree itself: beforeFiles rewrites are applied in sequence, so the result
// of the root rule below must not be rewritten a second time.
const PASS_THROUGH = 'me(?:/.*)?|en(?:/.*)?|admin(?:/.*)?|api(?:/.*)?|_next(?:/.*)?|media(?:/.*)?|telemetry(?:/.*)?|.*\\..*'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/me' },
        { source: `/:path((?!${PASS_THROUGH}$).*)`, destination: '/me/:path' },
      ],
    }
  },
  async redirects() {
    // Avoid an exposed /me/* duplicate of the root tree.
    return [
      { source: '/me', destination: '/', permanent: true },
      { source: '/me/:path*', destination: '/:path*', permanent: true },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
