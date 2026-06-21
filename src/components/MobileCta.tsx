import Link from 'next/link'
import { ChatIcon } from './icons'

// Floating "book a call" button, mobile only (the header CTA is hidden < 1000px).
// Fixed bottom-right; visibility is controlled by `.mobile-cta` in globals.css.
export default function MobileCta({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mobile-cta" aria-label={label}>
      <ChatIcon />
      <span>{label}</span>
    </Link>
  )
}
