import React from 'react'
import type { Media } from '@/payload-types'

type MaybeMedia = Media | number | null | undefined

type SizeEntry = { url?: string | null; width?: number | null }

const ORIGINAL_MAX_BYTES = 1_500_000

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
  const variants = ['thumbnail', 'card', 'feature'].map((key) => sizeMap[key]).filter((size) => size?.url && size.width)
  // The original is only offered when it is light enough to be worth it: camera JPEGs are
  // ~10 MB and a browser picks them whenever the needed width passes the largest variant
  // (tablets, landscape phones). Without variants (e.g. an SVG) it is the only source.
  const candidates = [...variants]
  if (!variants.length || (media.filesize && media.filesize <= ORIGINAL_MAX_BYTES)) candidates.push({ url: media.url, width: media.width })
  const widths = new Map<number, string>()
  for (const size of candidates) if (size?.url && size.width) widths.set(size.width, size.url)
  const sorted = [...widths].sort(([a], [b]) => a - b)
  const srcset = sorted.map(([width, url]) => `${url} ${width}w`).join(', ')
  // Browsers without srcset support (and crawlers) get the largest offered file.
  const src = sorted.length ? sorted[sorted.length - 1][1] : media.url

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
