import Link from 'next/link'
import { headers } from 'next/headers'
import { href } from '@/lib/routes'
import { ArrowRight } from './icons'
import '@/app/(frontend)/not-found.css'

export default async function NotFoundPage() {
  const locale = (await headers()).get('x-locale') === 'en' ? 'en' : 'me'
  const english = locale === 'en'

  return (
    <section className="lost-page bg-teal">
      <div className="wrap lost-layout">
        <div className="lost-copy">
          <span className="eyebrow on-dark">{english ? '404 · A little detour' : '404 · Malo skretanje'}</span>
          <h1>{english ? <>Even pages sometimes <em>change direction.</em></> : <>I stranice ponekad <em>promijene pravac.</em></>}</h1>
          <p>{english ? 'This one seems to have wandered off. Let’s go back to the beginning — your next step is waiting there.' : 'Izgleda da je ova skrenula sa puta. Vratimo se na početak — tamo te čeka tvoj sljedeći korak.'}</p>
          <Link className="btn btn-paper" href={href(locale, '/')}>
            <span className="lost-back-arrow"><ArrowRight /></span>
            {english ? 'Back to the beginning' : 'Nazad na početnu'}
          </Link>
        </div>
        <div className="lost-art">
          <svg viewBox="0 0 600 400" fill="none" aria-hidden="true" focusable="false">
            <text x="42" y="275" className="lost-four">4</text>
            <text x="416" y="275" className="lost-four">4</text>
            <g className="lost-compass">
              <ellipse cx="300" cy="200" rx="85" ry="110" />
              <ellipse cx="300" cy="200" rx="96" ry="120" transform="rotate(12 300 200)" opacity=".35" />
              <path d="M300 75V98M300 302V325M202 200H226M374 200H398" />
              <circle cx="300" cy="200" r="60" strokeDasharray="1 8" />
            </g>
            <path className="lost-detour" d="M6 331C68 290 102 390 172 345S223 258 171 283S225 376 269 305S267 233 300 200" />
            <g className="lost-needle">
              <path d="M277 254L323 146L310 195Z" fill="currentColor" opacity=".15" />
              <path d="M277 254L323 146L310 195Z" />
              <path d="M300 200L323 146" strokeWidth="2" />
              <circle cx="300" cy="200" r="4" fill="currentColor" />
            </g>
          </svg>
          <p>{english ? 'A detour isn’t the end of the road.' : 'Skretanje nije kraj puta.'}</p>
        </div>
      </div>
    </section>
  )
}
