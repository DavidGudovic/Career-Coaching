'use server'

import { client, getSettings } from '@/lib/payload'
import { isMailConfigured } from '@/lib/mail'
import { isLocale, type Locale } from '@/lib/i18n'
import { EMAIL_PATTERN } from '@/lib/contact'

// The submitted values travel back on errors: React resets a form after its action runs,
// so the form restores them as default values instead of losing the visitor's message.
export type ContactValues = { name: string; email: string; message: string }
export type ContactState = { status: 'idle' | 'ok' | 'error'; message?: string; values?: ContactValues }

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot — bots fill hidden fields; humans don't. Its name must not look like anything a
  // browser autofills (e.g. "company"), or a real visitor's message is silently dropped.
  const field = (key: string) => { const value = formData.get(key); return typeof value === 'string' ? value.trim() : '' }
  if (field('leave_empty')) return { status: 'ok' }

  const localeRaw = field('locale') || 'me'
  const locale: Locale = isLocale(localeRaw) ? localeRaw : 'me'

  const name = field('name')
  const email = field('email')
  const message = field('message')
  const values = { name, email, message }

  if (!name || name.length > 120 || !email || email.length > 254 || !message || message.length > 10000 || /[\r\n]/.test(name + email) || !new RegExp(`^${EMAIL_PATTERN}$`).test(email)) {
    return { status: 'error', message: 'invalid', values }
  }

  if (!isMailConfigured()) return { status: 'error', message: 'unavailable', values }

  try {
    const payload = await client()
    const settings = await getSettings(locale)
    const to = settings?.contactRecipient || settings?.email || 'jelena.rajkovic.coach@gmail.com'

    await payload.sendEmail({
      to,
      replyTo: email,
      subject: `Nova poruka sa sajta — ${name}`,
      text: `Ime: ${name}\nEmail: ${email}\nJezik: ${locale}\n\n${message}`,
    })
    return { status: 'ok' }
  } catch (err) {
    console.error('[contact] send failed', err instanceof Error ? err.message : 'Unknown transport error')
    return { status: 'error', message: 'send', values }
  }
}
