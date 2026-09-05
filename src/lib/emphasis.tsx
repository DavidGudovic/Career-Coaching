import React from 'react'

// Renders the editorial headline markup:  _word_ → italic accent,  **word** → bold.
// Keeps the signature mixed roman/italic/bold serif look without exposing HTML to editors.
export function Emphasis({
  text,
  tone = 'light',
}: {
  text: string | null | undefined
  tone?: 'light' | 'dark'
}): React.ReactElement {
  if (!text) return <></>
  const italicColor = tone === 'dark' ? 'var(--mint-light)' : 'var(--teal)'
  const nodes: React.ReactNode[] = []
  const regex = /(\*\*([^*\r\n]+)\*\*|_([^_\r\n]+)_|\r?\n)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[2] != null) {
      nodes.push(
        <strong key={i++} style={{ fontWeight: 600 }}>
          {m[2]}
        </strong>,
      )
    } else if (m[3] != null) {
      nodes.push(
        <em key={i++} style={{ fontStyle: 'italic', color: italicColor }}>
          {m[3]}
        </em>,
      )
    }
    if (m[0] === "\n" || m[0] === "\r\n") nodes.push(<br key={i++} />)
    last = regex.lastIndex
  }
  if (last < text.length) nodes.push(text.slice(last))
  return <>{nodes}</>
}

// Strip markup to plain text (for <title>, meta descriptions, alt text).
export const plain = (text: string | null | undefined): string =>
  (text || '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/_([^_]+)_/g, '$1').replace(/\s+/g, ' ').trim()


export function FormattedText({ text, className = 'formatted-text' }: { text?: string | null; className?: string }) {
  if (!text) return null
  return <div className={className}>{text.split(/\r?\n\s*\r?\n/).filter(Boolean).map((paragraph, i) => (
    <p key={i}><Emphasis text={paragraph} /></p>
  ))}</div>
}
