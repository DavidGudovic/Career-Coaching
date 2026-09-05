// Payload installs a development email adapter even without SMTP settings.
// Check explicit configuration before accepting a contact message.
export function isMailConfigured(): boolean {
  const values = [process.env.SMTP_HOST, process.env.SMTP_USER, process.env.SMTP_PASS, process.env.SMTP_FROM]
  return values.every((value) => Boolean(value?.trim() && value.trim() !== '...'))
}
