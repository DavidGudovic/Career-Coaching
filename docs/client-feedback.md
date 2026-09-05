# Client feedback — editing guide

All page content is editable at `/admin`. Switch between **Crnogorski** and
**English** at the top of the editor for translated text.

- **Photos:** open the relevant page and use **Izaberi / zamijeni iz Media
  biblioteke**, even if a photo is already selected. The existing upload control
  still accepts a new photo. Photo fields filter out PDF files. The story photos
  display their full original framing. New uploads retain the original file and
  generate WebP variants at quality 90–92; existing compressed uploads cannot
  regain lost detail, so upload the original again if needed.
- **Besplatni resursi:** edit the page heading and add a resource with a title,
  description, and PDF. Choose an existing PDF from Media or upload a new one.
  Drag rows to reorder; uncheck **Prikaži** to hide an item. A resources link is
  included in the desktop/mobile menus and footer. No email is required to download.
- **Webinar:** in **Podešavanja sajta → Vebinar — iskačući poziv**, enter the title,
  description/date, button label, and Google Form HTTPS URL, then enable it. The
  invitation appears after six seconds, stays out of the contact page, and closes
  with **×** or Escape. Dismissal lasts for that browser tab's session, across pages
  and languages. A new registration URL identifies a new invitation. It is hidden
  when disabled or when the title/URL is missing.
- **Booking:** **Navigacija i zakazivanje → Link za zakazivanje razgovora** accepts
  the existing Google Form URL. All booking buttons use it; leave it empty to use
  the contact page. The contact page also exposes the booking link when configured.
- **Newsletter:** the MailerLite signup link and footer invitation are ready in
  **Newsletter (kada bude spreman)**. Leave the switch off until October or whenever
  the newsletter is ready. Use the public MailerLite signup-page URL; MailerLite
  handles subscription and consent. No newsletter is enabled by this update.
- **Text:** Enter inserts a line break; a blank line separates paragraphs in
  **Za koga je ovo?**. Use `**podebljano**` and `_kurziv_` to emphasize words. Headline
  inputs also accept line breaks. Existing text stays intact.
- **Steps:** add rows under **Rad sa mnom → Put (koraci)** and drag a new step
  between existing steps. The numbering follows the order. Four cards fit on a
  wide screen, two on a tablet, and one on a phone; further cards wrap.
- **Fonts:** **Podešavanja sajta → Izgled sajta → Font pairing** includes
  **Playfair Display + Montserrat (vizuali)**. The current font selection is preserved.
- **Bilješke:** the spelling is corrected and its menu/link labels can be edited
  under **Navigacija i zakazivanje**. Existing `/karijerne-bjeleske` URLs are preserved.

## Contact email

Brevo SMTP was connected on **5 September 2026** in the local and deployed
`.env` files. The hosted app was recreated with its existing image to load the
settings. Payload's contact recipient is **jelena.rajkovic.coach@gmail.com**;
the SMTP sender currently uses that same address. Keep the SMTP key out of Git.

A test submitted through the public contact form returned success after SMTP
accepted it. Receipt in Gmail still needs confirmation from the inbox owner;
SMTP acceptance alone does not confirm inbox delivery.

The implementation in this feedback update also shows an email fallback without
valid configuration and only reports success after SMTP accepts the message.
Messages are not written to application logs as a fallback.

The simplest free connection is **Brevo SMTP**. Its free plan currently includes
[300 email sends per day](https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans).

1. Create a free Brevo account, add a sender on a domain you control, and complete
   the domain/sender verification shown by Brevo.
2. In **Settings → SMTP & API**, copy the **SMTP login** and generate an **SMTP key**.
   Use the SMTP key, not the account password or an API key.
3. Put the following in the server's `.env` (never commit real credentials):

   ```dotenv
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER=<Brevo SMTP login>
   SMTP_PASS=<Brevo SMTP key>
   SMTP_FROM=<verified sender address>
   ```

4. Recreate just the app to apply those environment variables:
   `docker compose up -d --no-deps app`.
5. In Payload, set **Podešavanja sajta → contactRecipient** to Jelena's inbox.
   Submit one test through the contact form and confirm delivery there. Replying
   to that email goes to the visitor because the form sets `Reply-To`.

[Brevo's SMTP setup instructions](https://help.brevo.com/hc/en-us/articles/7924908994450-Send-transactional-emails-using-Brevo-SMTP)
cover the host, supported ports and credentials. SMTP authentication alone does
not prove inbox delivery; complete the final submission check after connecting it.
MailerLite can remain the separate newsletter provider.

## Deployment

The additive `20260905_200000_client_feedback` migration is registered for production
startup. It adds the resource page and localized defaults, invitation/booking fields,
and font option while retaining existing uploads and authored content. Webinar and
newsletter switches start disabled. No resource PDFs or real registration links were
provided with the feedback document, so those must be entered in Payload.

For an isolated preview, override `DATABASE_URI`, `MEDIA_DIR`, and
`NEXT_PUBLIC_SERVER_URL` on the command rather than editing a shared `.env`.
Use `PAYLOAD_SCHEMA_PUSH=false` when testing migrations against a copied database.


## Validation completed

- Production standalone build passed with no database available at build time.
- Migration applied to a pristine copy of the deployed database and was safe to reapply.
- Five regression tests passed for formatting, links, SMTP configuration, and image framing.
- Browser checks covered 320–1440px layouts, both languages, four/two/one step columns,
  selected fonts, media selection and saving, formatting from the editor, hidden resources,
  exact PDF download bytes, webinar dismissal, and the mobile menu.
- The built app delivered a message to a local mail catcher with the correct recipient
  and Reply-To, showed an error when SMTP was stopped, and preserved original JPEG bytes
  while generating WebP variants.
- After configuring Brevo on the server, one clearly labelled test was submitted
  through the hosted contact form to Jelena's Gmail. The form returned success;
  final Gmail receipt is awaiting confirmation.
