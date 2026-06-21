# Jelena Rajković — website

Editorial, bilingual (Montenegrin / English) website for a career-change mentor.
Built as a single self-hosted app: **Next.js 15 + Payload CMS 3 + PostgreSQL**, in Docker.

Jelena edits everything herself at `/admin` — page text, blog posts, photos, contacts —
no developer needed.

## Stack

- **Next.js 15** (App Router) — fast static-style rendering, SEO, the public site
- **Payload CMS 3** — admin panel + content API, runs inside the same Next.js app
- **PostgreSQL 16** — content database
- **Sharp** — uploads auto-convert to responsive **WebP**

Public site and the CMS admin are one app / one Docker image. Content (DB + uploaded
images) lives in Docker **volumes**, so updating the image never wipes Jelena's work.

## Local development

```bash
# 1. Start a local Postgres (or use docker compose up db)
docker run -d --name karijera-db -e POSTGRES_USER=karijera \
  -e POSTGRES_PASSWORD=karijera -e POSTGRES_DB=karijera -p 5432:5432 postgres:16-alpine

# 2. Install deps + env
pnpm install
cp .env.example .env        # then edit values

# 3. Seed first admin user, categories, translations, demo posts
set -a && . ./.env && set +a && pnpm exec tsx src/seed/index.ts

# 4. Run
pnpm dev                    # http://localhost:3000  (admin at /admin)
```

> Note: in dev, Google Fonts are fetched at runtime (first paint can be slow on a
> constrained network). The production build self-hosts them, so production is fast.

## Content model

- **Globals** (one editable screen per page): Početna, O meni, Rad sa mnom,
  Bjeleške, Kontakt, plus **Podešavanja sajta** (Instagram, email, footer).
- **Posts** (Karijerne bjeleške): title, excerpt, cover, rich-text body, category,
  date — with a **source tag**. Set source = *Ljepota i zdravlje* and a link to show
  the magazine badge + “Pročitaj original”.
- **Media**: any upload → responsive WebP automatically.

### Headline emphasis
Headlines use a light markup instead of HTML:
`_riječ_` → italic accent, `**riječ**` → bold. Example: `Karijera _može_ da bude **usklađena**`.

### Bilingual
Every text field is per-language (MNE default, EN under the `/en` URL prefix).
Edit both via the locale switcher at the top of the admin.

## Production deploy (Jelena's server, behind nginx)

1. Copy the repo to the server and create `.env`:

   ```env
   POSTGRES_PASSWORD=<strong-password>
   PAYLOAD_SECRET=<openssl rand -hex 32>
   NEXT_PUBLIC_SERVER_URL=https://jelena.dgudovic.dev
   # contact form email (optional but recommended):
   SMTP_HOST=...
   SMTP_PORT=587
   SMTP_USER=...
   SMTP_PASS=...
   SMTP_FROM=no-reply@jelena.dgudovic.dev
   ```

2. Build & start:

   ```bash
   docker compose up -d --build
   ```

   The app listens on **127.0.0.1:3000** (localhost only). Postgres + uploads persist
   in the `db-data` and `media-data` volumes.

3. Seed once (first deploy) — admin user, photos, categories, EN translations, her 3 columns:

   ```bash
   docker compose --profile seed run --rm seed
   ```

   Run this ONCE, before editing content (it re-applies the English page text each run).
   Optionally set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env` first to choose the
   first admin login. Or skip seeding entirely and open `/admin` — Payload then prompts you
   to create the first admin user, and the site shows its Montenegrin default text.

4. **nginx reverse proxy** (add to the existing site config):

   ```nginx
   server {
     server_name jelena.dgudovic.dev;

     client_max_body_size 25m;   # allow photo uploads

     location / {
       proxy_pass         http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header   Host              $host;
       proxy_set_header   X-Real-IP         $remote_addr;
       proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
       proxy_set_header   X-Forwarded-Proto $scheme;
       proxy_set_header   Upgrade           $http_upgrade;
       proxy_set_header   Connection        "upgrade";
     }
     # TLS via your existing certbot setup
   }
   ```

## Updating the app later

```bash
git pull
docker compose up -d --build     # content in volumes is preserved
```

## Backups

```bash
# database
docker compose exec db pg_dump -U karijera karijera > backup.sql
# uploaded images
docker run --rm -v karijera_media-data:/m -v "$PWD:/out" alpine tar czf /out/media.tgz -C /m .
```
