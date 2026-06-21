import React from 'react'
import type { Media } from '@/payload-types'

type MaybeMedia = Media | number | null | undefined

type SizeEntry = { url?: string | null; width?: number | null }

// Renders a responsive <img> straight from Payload's pre-generated WebP sizes.
// (No next/image optimizer needed — Payload already produced optimized WebP.)
// Falls back to an editorial placeholder tile when no image is set yet.
export function MediaImage({
  media,
  ratio,
  className,
  style,
  sizes = '100vw',
  priority = false,
  placeholderLabel,
  rounded = 3,
}: {
  media: MaybeMedia
  ratio: string
  className?: string
  style?: React.CSSProperties
  sizes?: string
  priority?: boolean
  placeholderLabel?: string
  rounded?: number
}) {
  const box: React.CSSProperties = {
    position: 'relative',
    aspectRatio: ratio,
    borderRadius: rounded,
    overflow: 'hidden',
    ...style,
  }

  if (!media || typeof media !== 'object' || !media.url) {
    return (
      <div className={`ph ${className || ''}`} style={box}>
        {placeholderLabel ? <span className="ph-label">{placeholderLabel}</span> : null}
      </div>
    )
  }

  const sizeMap = (media.sizes || {}) as Record<string, SizeEntry>
  const srcset = ['thumbnail', 'card', 'feature']
    .map((k) => sizeMap[k])
    .filter((s): s is SizeEntry => Boolean(s?.url && s?.width))
    .map((s) => `${s.url} ${s.width}w`)
    .join(', ')

  const src = sizeMap.feature?.url || media.url

  return (
    <div className={className} style={box}>
      <img
        src={src || undefined}
        srcSet={srcset || undefined}
        sizes={sizes}
        alt={media.alt || ''}
        width={media.width || undefined}
        height={media.height || undefined}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  )
}
