import type { CollectionConfig } from 'payload'

// All uploads are converted to WebP and resized into responsive sizes.
// Jelena uploads any PNG/JPG; the site serves optimized WebP automatically.
export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  admin: { useAsTitle: 'alt' },
  upload: {
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*'],
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumbnail', width: 480, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 800, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'feature', width: 1400, formatOptions: { format: 'webp', options: { quality: 82 } } },
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
