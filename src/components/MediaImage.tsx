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
  natural = false,
}: {
  media: MaybeMedia
  ratio: string
  className?: string
  style?: React.CSSProperties
  sizes?: string
  priority?: boolean
  placeholderLabel?: string
  rounded?: number
  natural?: boolean
}) {
  const box: React.CSSProperties = {
    position: 'relative',
    aspectRatio: natural && media && typeof media === 'object' && media.width && media.height ? `${media.width} / ${media.height}` : ratio,
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
  const candidates = ['thumbnail', 'card', 'feature'].map((key) => sizeMap[key])
  // Include the original for large / high-DPI screens instead of capping at 1400px.
  candidates.push({ url: media.url, width: media.width })
  const widths = new Map<number, string>()
  for (const size of candidates) if (size?.url && size.width) widths.set(size.width, size.url)
  const srcset = [...widths].sort(([a], [b]) => a - b).map(([width, url]) => `${url} ${width}w`).join(', ')
  const src = media.url

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
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${media.focalX ?? 50}% ${media.focalY ?? 50}%` }}
      />
    </div>
  )
}
