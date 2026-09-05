'use client'

import { useCallback } from 'react'
import { Button, UploadField, useField, useListDrawer, type ListDrawerProps } from '@payloadcms/ui'
import type { UploadFieldClientProps } from 'payload'

// Stable filters keep Payload's drawer from remounting during field updates.
const photoFilter = { media: { mimeType: { contains: 'image/' } } }

// Keep Payload's upload/preview controls, with a visible replacement action.
export function MediaPicker(props: UploadFieldClientProps) {
  const { setValue, disabled } = useField<number>({ path: props.path })
  const [ListDrawer, , { openDrawer, closeDrawer }] = useListDrawer({
    collectionSlugs: ['media'],
    selectedCollection: 'media',
    filterOptions: photoFilter,
  })
  const onSelect = useCallback<NonNullable<ListDrawerProps['onSelect']>>(({ doc }) => {
    setValue(doc.id)
    closeDrawer()
  }, [setValue, closeDrawer])

  return (
    <div className="media-picker">
      <UploadField {...props} />
      {!props.readOnly && !disabled && (
        <>
          <Button buttonStyle="secondary" size="small" onClick={openDrawer}>
            Izaberi / zamijeni iz Media biblioteke
          </Button>
          <ListDrawer onSelect={onSelect} />
        </>
      )}
    </div>
  )
}
