import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Posts } from './collections/Posts'
import { migrations } from './migrations'
import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { WorkPage } from './globals/WorkPage'
import { BlogPage } from './globals/BlogPage'
import { ContactPage } from './globals/ContactPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    theme: 'dark',
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
    },
    meta: {
      title: 'Jelena Rajković — Admin',
      titleSuffix: ' · Karijerno iskreno',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
      openGraph: { title: 'Karijerno iskreno — Admin', siteName: 'Jelena Rajković' },
    },
  },
  localization: {
    locales: [
      { label: 'Crnogorski', code: 'me' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'me',
    fallback: true,
  },
  collections: [Users, Media, Categories, Posts],
  globals: [SiteSettings, HomePage, AboutPage, WorkPage, BlogPage, ContactPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    // Dev: auto-sync the schema on boot (push). Push is DISABLED in production by
    // Payload (the standalone runner has no drizzle-kit), so production instead runs
    // `prodMigrations` on boot — that's how schema changes reach prod. After ANY
    // schema change: run `pnpm payload migrate:create <name>` and commit the file.
    push: true,
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['posts'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }: { doc?: { title?: string } }) =>
        doc?.title ? `${doc.title} · Jelena Rajković` : 'Karijerne bjeleške · Jelena Rajković',
      generateDescription: ({ doc }: { doc?: { excerpt?: string } }) => doc?.excerpt || '',
    }),
  ],
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM || 'no-reply@jelenarajkovic.me',
        defaultFromName: 'Jelena Rajković',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
})
