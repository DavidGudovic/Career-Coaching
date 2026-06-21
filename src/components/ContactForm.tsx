'use client'
import { useActionState } from 'react'
import { sendContact, type ContactState } from '@/app/(frontend)/actions'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import { ArrowRight } from './icons'

const initial: ContactState = { status: 'idle' }

export default function ContactForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(sendContact, initial)

  const label = { fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' as const, color: 'var(--teal)' }
  const input = {
    padding: '14px 16px',
    border: '1px solid rgba(20,41,43,.18)',
    borderRadius: 4,
    background: '#fff',
    fontFamily: 'var(--sans)',
    fontSize: 16,
    color: 'var(--ink)',
    outline: 'none',
    width: '100%',
  }

  if (state.status === 'ok') {
    return (
      <p
        role="status"
        style={{
          background: 'var(--sage)',
          borderRadius: 5,
          padding: '24px 28px',
          fontSize: 17,
          color: 'var(--teal-deep)',
          margin: 0,
        }}
      >
        {t(locale, 'form_ok')}
      </p>
    )
  }

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <input type="hidden" name="locale" value={locale} />
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden />

      <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={label}>{t(locale, 'form_name')}</span>
        <input type="text" name="name" required placeholder={t(locale, 'form_name_ph')} style={input} />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={label}>{t(locale, 'form_email')}</span>
        <input type="email" name="email" required placeholder={t(locale, 'form_email_ph')} style={input} />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={label}>{t(locale, 'form_msg')}</span>
        <textarea name="message" required rows={5} placeholder={t(locale, 'form_msg_ph')} style={{ ...input, resize: 'vertical' }} />
      </label>

      {state.status === 'error' && (
        <p role="alert" style={{ color: '#9c3b2e', fontSize: 14.5, margin: 0 }}>
          {t(locale, 'form_err')}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-solid" style={{ alignSelf: 'flex-start', opacity: pending ? 0.7 : 1 }}>
        {pending ? t(locale, 'form_sending') : t(locale, 'form_send')}
        <ArrowRight />
      </button>
    </form>
  )
}
