import React from 'react'

const base = { width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }

export const MailIcon = () => (
  <svg viewBox="0 0 24 24" {...base} aria-hidden style={{ flexShrink: 0 }}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" strokeLinecap="round" />
  </svg>
)

export const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" {...base} aria-hidden style={{ flexShrink: 0 }}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const ChatIcon = () => (
  <svg viewBox="0 0 24 24" {...base} aria-hidden style={{ flexShrink: 0 }}>
    <path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.3-4.1A7.5 7.5 0 1 1 20 11.5Z" strokeLinejoin="round" />
  </svg>
)

export const ArrowRight = () => <span style={{ fontFamily: 'var(--serif)' }}>→</span>
