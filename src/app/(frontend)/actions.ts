'use server'

import { client, getSettings } from '@/lib/payload'
import { isMailConfigured } from '@/lib/mail'
import { isLocale, type Locale } from '@/lib/i18n'

export type ContactState = { status: 'idle' | 'ok' | 'error'; message?: string }

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot — bots fill hidden fields; humans don't.
  const field = (key: string) => { const value = formData.get(key); return typeof value === 'string' ? value.trim() : '' }
  if (field('company')) return { status: 'ok' }

  const localeRaw = field('locale') || 'me'
  const locale: Locale = isLocale(localeRaw) ? localeRaw : 'me'

  const name = field('name')
  const email = field('email')
  const message = field('message')

  if (!name || name.length > 120 || !email || email.length > 254 || !message || message.length > 10000 || /[\r\n]/.test(name + email) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: 'error', message: 'invalid' }
  }

  if (!isMailConfigured()) return { status: 'error', message: 'unavailable' }

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
    return { status: 'error', message: 'send' }
  }
}
