import Link from 'next/link'
import { MediaImage } from './MediaImage'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import { postHref } from '@/lib/routes'
import { formatDate } from '@/lib/format'
import type { Post, Category } from '@/payload-types'

export default function PostCard({
  post,
  locale,
  delay,
  compact = false,
}: {
  post: Post
  locale: Locale
  delay?: number
  compact?: boolean
}) {
  const category = typeof post.category === 'object' ? (post.category as Category) : null
  const dateStr = formatDate(post.publishedAt, locale)
  const fromLZ = post.source === 'ljepota-i-zdravlje'

  return (
    <Link
      href={postHref(locale, post.slug || '')}
      data-reveal
      data-reveal-delay={delay}
      style={{ textDecoration: 'none', display: 'block', transition: 'transform .4s cubic-bezier(.2,.7,.2,1)' }}
      className="post-card"
    >
      <MediaImage
        media={post.coverImage}
        ratio="3 / 2"
        sizes="(max-width: 700px) 100vw, 380px"
        placeholderLabel="Naslovna — placeholder"
        style={{ marginBottom: 18 }}
      />
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
        <span style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', fontWeight: 600 }}>
          {dateStr}
          {category ? ` · ${category.title}` : ''}
        </span>
        {fromLZ && <span className="badge">{t(locale, 'source_lz')}</span>}
      </div>
      <h3
        style={{
          fontFamily: 'var(--serif)',
          fontWeight: 500,
          fontSize: compact ? 20 : 23,
          lineHeight: 1.2,
          margin: '0 0 8px',
          color: 'var(--ink)',
        }}
      >
        {post.title}
      </h3>
      {!compact && post.excerpt && (
        <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(20,41,43,.7)', margin: 0 }}>{post.excerpt}</p>
      )}
    </Link>
  )
}
