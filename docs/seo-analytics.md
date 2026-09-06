# SEO audit and analytics

Audit date: 6 September 2026. Site: https://jelena.rajkovic.coach.

## SEO findings and fixes

| Finding in production | Change |
| --- | --- |
| Every English canonical pointed to the Montenegrin page. | Each translated page now has its own canonical and reciprocal language alternates. |
| Sitemap contained only 12 Montenegrin URLs, with a fixed 500-post limit. | Includes both languages, pages through published posts, and excludes incomplete English articles. |
| Three articles had no English title or body; fallback made them appear translated. | English fallback pages remain usable but are `noindex, follow`, canonicalize to the original, and are omitted from English alternates and the sitemap. They become indexable when real English title/body content is saved. |
| `Disallow: /api` also blocked public CMS images. | Explicitly permits `/api/media/file/` while keeping application APIs excluded. |
| Many titles repeated “Jelena Rajković”. | Uses a complete title once, including CMS-authored SEO titles. |
| Public pages lacked Open Graph/Twitter images. | Uses the existing default image; articles prefer the SEO image, then their cover. Absolute image URLs remain valid. |
| `/me/*` duplicate URLs used temporary redirects. | Uses permanent 308 redirects to the clean URL. |
| HTTP response preloaded 28 font files from all CMS theme options. | Disables blanket font preloading; the selected CSS font pair still loads normally. |
| Structured data interpolated CMS text without escaping `<`. | Safe JSON-LD serialization, plus article modification dates and descriptions. |

The live site already returned a proper 404 for unknown pages, redirected HTTP to
HTTPS, and marked the admin login `noindex`. No CMS text, images, article bodies,
or database schema were changed by the SEO fixes.

English translations still needed for these published article slugs:

- `koliko-kao-roditelji-zaista-uticete-na-to-cime-ce-se-dijete-baviti`
- `sta-ti-godisnji-odmor-moze-otkriti-o-tvojoj-karijeri`
- `kako-postaviti-granice-na-poslu-a-ostati-profesionalna`

After deployment, the sitemap should contain 23 entries: 14 fixed pages across
both languages, six Montenegrin articles, and three translated English articles.
This count will change as content is published or translated.

Run the reproducible, read-only crawl with:

```bash
python3 scripts/audit-seo.py https://jelena.rajkovic.coach > /tmp/seo-audit.json
```

This is a technical crawl and source audit, not a claim about rankings or measured
Core Web Vitals. Search Console ownership/access is still needed to inspect Google
index coverage, search queries and clicks, submit the sitemap, and request fresh
indexing. No Search Console account was created or ownership claimed.

## Analytics recommendation

Use **self-hosted Umami 3.3.1** on the existing server. There is no software
subscription; it consumes existing server RAM, disk and backup capacity. The
server inspection showed roughly 2.4 GB available memory and 18 GB free disk.
The optional services use a separate database/volume and have memory limits.

| Option | Useful for this site | Tradeoff |
| --- | --- | --- |
| Self-hosted Umami — implemented | Popular pages, visits, devices, approximate countries, referral sites, browser languages, duration and custom events; private CMS dashboard | Maintain the container/database; no age or gender estimates |
| Google Analytics 4 | More advanced acquisition/advertising reporting and partial demographic estimates | Google account/property, consent configuration, external data processing and a separate API integration; small-audience demographic reports may be withheld |

Sources: [Umami features](https://docs.umami.is/docs),
[Umami installation](https://docs.umami.is/docs/install),
[Umami statistics API](https://docs.umami.is/docs/api/website-stats),
[Google Analytics reporting thresholds](https://developers.google.com/analytics/devguides/reporting/data/v1/reporting-data-expectations),
[Google localized-page guidance](https://developers.google.com/search/docs/specialty/international/localized-versions).

## What the admin sees

Open **Analitika** in the existing admin navigation, at `/admin/analytics`.
Existing CMS authentication protects it; anonymous requests redirect to login.
The server reads Umami with a dedicated view-only account in an admin-owned
private team. Team-level viewer permissions are necessary because personal website
ownership bypasses Umami’s global view-only role; a write-denial check verifies this. Credentials and
Umami authentication tokens are never sent to the browser, and no public share
dashboard is enabled.

- Last 7, 30 or 90 days, with a daily chart in `Europe/Podgorica` and accessible
  table values.
- Visitors, visits, pageviews, and average visit duration.
- Up to 20 pages with the most visitors. Selecting a page filters its other reports.
- Device, country, referral site and browser-language breakdowns.
- Active-time milestones: 30 seconds, 1 minute, 2 minutes, 5 minutes.
- Download, email/phone and booking-link click counts.
- Distinct states for not configured, temporarily unavailable, and no visits yet.

Average visit duration follows Umami's `totaltime / visits`: the interval between
the first and last recorded pageview. One-page visits can show zero, and the final
page's dwell time is not captured by that metric. The separate active-time events
provide a more useful indication of attention: time advances only while the tab is
visible, focused and has had activity within the last minute. Timers pause in the
background and cap long gaps after suspension. Each threshold fires once per page
opening, and thresholds overlap. These are estimates, not proof someone read a text.

“Desktop” includes laptops; screen/browser information cannot reliably separate
them. Location can be wrong for VPN users. Age, gender, identity and exact individual
visitor histories are not shown. Visitor estimates are not person-level identity,
and blocking/privacy settings reduce measured traffic. Clicks do not confirm a
completed download, successful form submission or booked appointment.

## Collection and privacy

The small first-party tracker sends only an allowlist of public paths and event
names. It omits queries, fragments, referrer paths, form data and arbitrary event
properties. The receiver enforces same-origin JSON requests, an 8 KB streaming body
limit, an in-memory per-IP request limit, and fixed upstream/website configuration.
The IP rate-limit map is bounded and never persisted or logged by the collector.

Umami processes IP/User-Agent information to estimate location and distinguish
anonymous visits. Raw IPs are not stored in its analytics database. The short-lived
session cache stays in JavaScript memory. No analytics cookies, advertising IDs,
replay, fingerprinting add-ons or cross-site identity features are enabled.
Existing nginx access logs are separate from the analytics database.

The tracker respects Do Not Track and Global Privacy Control. Visitors can opt out
at `/statistika-posjeta` or `/en/statistika-posjeta` via the footer. This stores only
`umami.disabled=1` in their own browser. Requests with the CMS login cookie are
excluded. The privacy explanation describes this implementation; it does not make
a blanket legal claim about consent requirements in every jurisdiction.

## Deployment and activation

Normal code releases still use the existing GitHub Actions deployment. No extra
CMS migration is required. Analytics is off unless `ANALYTICS_ENABLED=true` and a
website ID are configured. The dashboard can be released in that disabled state.

The owner explicitly approved account initialization and activation on 6 September
2026. **Collection is now enabled**, with the real reporting API and live tracker
verified. Credentials are stored privately on the server, and the default Umami
password has been replaced. The setup is reproducible in `scripts/setup-analytics.py`.

For a fresh installation, as the existing deployment owner:

1. Ensure `.env` contains independent random `UMAMI_DB_PASSWORD`, `UMAMI_APP_SECRET`
   and a 64-character hex `UMAMI_TWO_FACTOR_KEY`. These were prepared on this server;
   do not replace existing values on an initialized installation.
2. `docker compose --profile analytics up -d --no-build umami umami-db`
3. Wait for `curl -fsS http://127.0.0.1:3002/api/heartbeat` to return healthy.
4. `python3 scripts/setup-analytics.py`. It replaces the default admin password,
   creates the private team, website and `cms-analytics` viewer account, verifies
   write denial, and writes runtime configuration. It keeps generated credentials in the ignored, mode-600 file
   `.local/analytics/setup.json`. Do not commit or share that file.
5. Verify the actual API with a separate temporary test website before enabling
   real visitors. The production integration passed this check; temporary test
   websites and their events were deleted afterward.
6. Set `ANALYTICS_ENABLED=true` in `.env`, then
   `docker compose up -d --no-build app`. No rebuild is needed for this runtime flag.
7. Verify a real anonymous visit appears in `/admin/analytics`, and confirm that a
   logged-in editor is excluded. Counts begin at activation; there is no backfill.

`ANALYTICS_TRUST_PROXY=true` is safe only because nginx overwrites `X-Real-IP` and
the application port is bound to localhost. Revisit this if the proxy/network changes.
Umami's full UI is bound to **127.0.0.1:3002**, accessible through an SSH tunnel for
maintenance, not a public subdomain. The collector proxies only `/api/send`; reporting
uses authenticated server-side requests over the Docker network.

To pause collection, set `ANALYTICS_ENABLED=false` and recreate only `app`. Historical
reports remain available while Umami is running. Keep `COMPOSE_PROFILES=analytics`
once active so normal CI/CD restarts preserve the analytics services.

## Maintenance

The Umami image is pinned, rather than following `latest`. Back up its database
before upgrading, check the release's schema/API changes, and rerun reporting and
collector checks. The CMS database and media volumes are separate and unchanged.

```bash
docker compose exec -T umami-db pg_dump -U umami umami > umami-backup.sql
```

Protect backups as site data. There is no automatic history deletion configured:
monitor disk use and decide a retention period before accumulating large datasets.
The report's 90-day selector is a viewing range, not a retention limit.

## Verification

- Existing and new tests: `node --import tsx --test tests/*.test.tsx`.
- Type check: `node node_modules/typescript/bin/tsc --noEmit --incremental false`.
- Production build: `node node_modules/next/dist/bin/next build`.
- Authenticated desktop/mobile dashboard checks with synthetic API data: login
  protection, period and page filters, no horizontal overflow and no browser exceptions.
- Public tracker checks cover client navigation, stripped URL data, opt-out and DNT.
- The local preview database contains copied content whose English fallback had
  already been materialized. The three missing production translations were therefore
  verified separately against the live read-only API with `fallback-locale=none`.

Real Umami verification passed all eight report endpoints, session grouping,
pageviews, a 60-second visit duration, the daily series, expanded page metrics,
device/referral/language data, reading-event counts, and a page filter. PostgreSQL
expanded pageview counts arrive as strings and are normalized by the adapter.
The reporting account can read its website but cannot modify it.

A live anonymous browser visit to `/o-meni` and its 30-second reading milestone
were acknowledged by the collector and verified in the private report. This one
verification visit remains in the live totals. Opt-out and DNT prevented browser
requests; DNT, GPC and the CMS-cookie exclusion also returned 204 at the live
collector. Admin layout/authentication tests used the isolated local CMS preview;
no production CMS account was created or changed for testing.
