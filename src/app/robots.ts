import type { MetadataRoute } from 'next'
import { abs } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: ['/', '/api/media/file/'], disallow: ['/admin', '/api/', '/telemetry/'] },
    sitemap: abs('/sitemap.xml'),
  }
}
