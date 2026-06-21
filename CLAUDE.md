# CLAUDE.md

Guidance for working in this repo. Read once before editing.

## What this is

Website for **Jelena Rajković**, a Montenegrin career-change mentor. Calm, editorial,
bilingual (Montenegrin default / English). Single self-hosted app:
**Next.js 15 (App Router) + Payload CMS 3 + PostgreSQL**, deployed as one Docker image
behind the user's nginx. Originated from a Claude Design doc; the design is fully
implemented — match its quiet, premium feel for any new UI.

The whole point: **Jelena edits everything herself at `/admin`** (text, posts, photos,
contacts). Keep content in the CMS, not hardcoded.

## Commands

```bash
pnpm dev                 # dev server :3000 (admin at /admin)
pnpm build && pnpm start # production-style run (build self-hosts fonts)
pnpm generate:types      # after ANY collection/global field change -> src/payload-types.ts
pnpm generate:importmap  # after adding admin UI components / plugins
set -a && . ./.env && set +a && pnpm exec tsx src/seed/index.ts   # seed
docker compose up -d --build                                       # full prod stack
```

A local Postgres must be running (see README). Env in `.env` (copy from `.env.example`).

## Architecture

- **Routing / i18n** — `src/middleware.ts` maps Montenegrin to the root and English to
  `/en` (internal rewrite to a `[locale]` segment; `/me/*` redirects to clean root). It
  sets an `x-locale` request header that `src/app/(frontend)/layout.tsx` reads to set
  `<html lang>`. Locales + all UI strings: `src/lib/i18n.ts`. Locale-aware links:
  `src/lib/routes.ts` (`href(locale, path)`, `postHref`).
- **Two route groups** — `src/app/(frontend)/` (public site) and `src/app/(payload)/`
  (admin + API). Each has its own root layout with `<html>`. **Payload owns `/api/*`** —
  do NOT add custom `/api/...` routes (they collide). Use Server Actions instead
  (see `src/app/(frontend)/actions.ts` for the contact form).
- **Data** — `src/lib/payload.ts` wraps `getPayload` with cached fetchers
  (`getSettings`, `getPageGlobal`, `getPosts`, `getPostBySlug`, ...). Pages are
  `force-dynamic` (set in `[locale]/layout.tsx`) so CMS edits show immediately.
- **CMS schema** — `src/collections/` (Users, Media, Categories, Posts) and
  `src/globals/` (SiteSettings + one content global per page: Home/About/Work/Blog/Contact).
  Page content lives in typed globals (not a page-builder) to match the fixed editorial design.
- **SEO** — `src/lib/seo.ts` (`buildMetadata`, `alternates`, `SITE_URL` from
  `NEXT_PUBLIC_SERVER_URL`). `src/app/sitemap.ts` + `robots.ts`. JSON-LD is inline per page.

## Conventions

- **Headline emphasis**: editors write `_italic_` and `**bold**`, never HTML. Render with
  `<Emphasis text=... tone="light|dark" />` (`src/lib/emphasis.tsx`); `plain()` strips it
  for meta/titles. `tone="dark"` = mint italic on teal; `light` = teal italic on paper.
- **Colors/type**: CSS variables + classes in `src/app/(frontend)/globals.css`
  (`--teal-deep`, `--paper`, `--ink`, `--mint`, etc.; `.btn`, `.card`, `.display-*`,
  `.eyebrow`, `.wrap*`, `.section*`). Fonts: Fraunces (serif display) + Hanken Grotesk
  (sans) via `next/font`. Reuse these; avoid new ad-hoc colors.
- **Motion**: add `data-reveal` (+ optional `data-reveal-delay="90"`) to any element;
  `RevealManager` animates it in. `Parallax` for decorative bg layers. All motion has a
  `prefers-reduced-motion` fallback — keep it that way.
- **Images**: use `<MediaImage media=... ratio=... placeholderLabel=... />`. It serves
  Payload's pre-generated WebP `srcset`; falls back to an editorial placeholder tile.
  Don't add `next/image` (Payload already optimizes).
- **New fields** are localized text by default (`localized: true`) so both languages work.
  After editing schema, run `generate:types` or TS will be stale/wrong.

## Content / legal

Her *Ljepota i zdravlje* columns are republished as Posts with `source = 'ljepota-i-zdravlje'`
which shows a badge + "Pročitaj original" link. **Do not paste the magazine's full article
text** into the repo or seed — only titles/dates/links and original summaries. Jelena adds
the full bodies via the CMS (she holds the rights).

## Gotchas

- `pnpm dev` overwrites `.next`, so run `pnpm build` again before `pnpm start`.
- In dev, `next/font/google` fetches fonts at runtime — first paint is slow on a poor
  network. Production self-hosts them; not a real issue.
- pnpm build-script approval lives in `pnpm-workspace.yaml` (`allowBuilds: esbuild, sharp`),
  NOT in package.json. The Dockerfile must COPY it before `pnpm install`.
- `sitemap.ts` is `force-dynamic` so the image can build without a DB.
- The official `create-payload-app` CLI needs a TTY; this project was scaffolded by hand.

## Decisions already made

Contacts = Instagram + email only (no WhatsApp/Calendly). Temp domain `jelena.dgudovic.dev`.
Blog covers are placeholders until real photos arrive. See README.md for deploy + nginx.
