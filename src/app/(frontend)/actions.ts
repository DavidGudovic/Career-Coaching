'use server'

import { client, getSettings } from '@/lib/payload'
import { isLocale, type Locale } from '@/lib/i18n'

export type ContactState = { status: 'idle' | 'ok' | 'error'; message?: string }

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot — bots fill hidden fields; humans don't.
  if ((formData.get('company') as string)?.length) return { status: 'ok' }

  const localeRaw = (formData.get('locale') as string) || 'me'
  const locale: Locale = isLocale(localeRaw) ? localeRaw : 'me'

  const name = ((formData.get('name') as string) || '').trim()
  const email = ((formData.get('email') as string) || '').trim()
  const message = ((formData.get('message') as string) || '').trim()

  if (!name || !email || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: 'error', message: 'invalid' }
  }

  try {
    const payload = await client()
    const settings = await getSettings(locale)
    const to = settings?.contactRecipient || settings?.email || 'jelena.rajkovic.coach@gmail.com'

    if (payload.email) {
      await payload.sendEmail({
        to,
        replyTo: email,
        subject: `Nova poruka sa sajta — ${name}`,
        text: `Ime: ${name}\nEmail: ${email}\nJezik: ${locale}\n\n${message}`,
      })
    } else {
      // No SMTP configured yet — log so nothing is silently lost in dev.
      payload.logger.info(`[contact] (email not configured) from ${name} <${email}>: ${message}`)
    }
    return { status: 'ok' }
  } catch (err) {
    console.error('[contact] send failed', err)
    return { status: 'error', message: 'send' }
  }
}
