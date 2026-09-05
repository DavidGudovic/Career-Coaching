import type { CollectionConfig } from 'payload'

// Preserve originals and create high-quality responsive variants. PDFs pass through unchanged.
export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  admin: { useAsTitle: 'filename', defaultColumns: ['filename', 'alt', 'mimeType'], description: 'Fotografije i PDF resursi. Već otpremljene fajlove možeš ponovo koristiti na stranicama.' },
  upload: {
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 480, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 90 } } },
      { name: 'card', width: 800, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 90 } } },
      { name: 'feature', width: 1600, withoutEnlargement: true, formatOptions: { format: 'webp', options: { quality: 92 } } },
      // Social share image — JPEG for max platform compatibility
      { name: 'og', width: 1200, height: 630, formatOptions: { format: 'jpeg', options: { quality: 85 } } },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      admin: { description: 'Opis slike za pristupačnost i SEO (na oba jezika).' },
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Opcioni izvor / autor fotografije.' },
    },
  ],
}
