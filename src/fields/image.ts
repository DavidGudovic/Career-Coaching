import type { UploadField } from 'payload'

export const imageField = (name: string, description?: string): UploadField => ({
  name,
  type: 'upload',
  relationTo: 'media',
  filterOptions: { mimeType: { contains: 'image/' } },
  admin: {
    description: description || 'Izaberi postojeću sliku iz Media biblioteke ili otpremi novu.',
    components: { Field: '/components/admin/MediaPicker#MediaPicker' },
  },
})
