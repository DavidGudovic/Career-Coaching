import React from 'react'

// Hand-crafted inline SVGs in the minimalistic line style of animatedicons.co, but
// dependency-free: no Lottie runtime, no external CDN. Each icon carries class hooks
// so globals.css can play a quiet hover micro-animation (see ".aicon-*" rules there).
// All motion is disabled under prefers-reduced-motion.
const base = { width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 } as const
const svg = {
  ...base,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  // overflow visible so a sweeping meridian / pinging dot never clips at the edge
  style: { flexShrink: 0, overflow: 'visible' as const },
}

export const MailIcon = () => (
  <svg {...svg} className="aicon aicon-mail">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path className="aicon-flap" d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const InstagramIcon = () => (
  <svg {...svg} className="aicon aicon-ig">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle className="aicon-ig-lens" cx="12" cy="12" r="4" />
    <circle className="aicon-ig-dot" cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const ChatIcon = () => (
  <svg {...svg} className="aicon aicon-chat">
    <path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.3-4.1A7.5 7.5 0 1 1 20 11.5Z" strokeLinejoin="round" />
    <g className="aicon-chat-dots" fill="currentColor" stroke="none">
      <circle cx="8.5" cy="11.6" r="1" />
      <circle cx="12" cy="11.6" r="1" />
      <circle cx="15.5" cy="11.6" r="1" />
    </g>
  </svg>
)

// Language / locale mark — a globe whose meridian sweeps across on hover, like a slow spin.
export const GlobeIcon = () => (
  <svg {...svg} className="aicon aicon-globe" width={16} height={16}>
    <circle cx="12" cy="12" r="9" />
    <ellipse className="aicon-globe-meridian" cx="12" cy="12" rx="4" ry="9" />
    <path d="M3 12h18" strokeLinecap="round" />
    <path d="M4.6 7.5h14.8M4.6 16.5h14.8" strokeLinecap="round" opacity=".5" />
  </svg>
)

export const ArrowRight = () => (
  <span
    className="arrow"
    style={{ fontFamily: 'var(--serif)', display: 'inline-block', transition: 'transform .35s cubic-bezier(.2,.7,.2,1)' }}
  >
    →
  </span>
)
