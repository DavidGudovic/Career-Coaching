# SEO optimization — 12 September 2026

Primary audience: Montenegrin/Serbian speakers looking for career-change mentoring,
career advice, or help changing jobs. Visible page copy, article text, CMS content,
URLs and the design are unchanged. New pagination controls appear only when the
blog has more than 12 posts.

## Search intent and title tags

The homepage targets the mentoring service. The mentoring page explains the 1:1
offer, the blog answers advice searches, and the resources page serves people
looking for exercises and guides. This gives each page a distinct purpose rather
than repeating the whole keyword list on every page.

| Page | New Montenegrin title tag |
| --- | --- |
| `/` | Mentor za promjenu karijere · Jelena Rajković |
| `/rad-sa-mnom` | Karijerno mentorstvo 1:1 za promjenu karijere · Jelena Rajković |
| `/karijerne-bjeleske` | Savjeti za karijeru i promjenu posla — Jelena Rajković |
| `/besplatni-resursi` | Besplatni resursi za promjenu karijere · Jelena Rajković |
| `/o-meni` | O meni — Jelena Rajković, karijerna mentorka |
| `/kontakt` | Kontakt za karijerno mentorstvo · Jelena Rajković |

These titles also feed Open Graph and Twitter metadata. Existing main-page
descriptions still come from CMS copy; the statistics/privacy page now gets a
description about its own content. English main-page titles remain unchanged.

Google recommends concise, descriptive, distinct titles and can choose a different
search-result title using visible headings or other signals. There is no fixed
character limit that guarantees the full title will display.
[Google's title guidance](https://developers.google.com/search/docs/appearance/title-link).

“Karijera” is a broad term with several possible intents. The more specific service
and advice searches are better aligned with this site's offer. No search-volume or
position claims were inferred from the audit. Keep natural ijekavian wording;
do not add duplicate pages or keyword lists just to repeat “promena”, “saveti” and
other spelling variants. Google does not use the `meta keywords` tag for ranking.
[Supported metadata](https://developers.google.com/search/docs/crawling-indexing/special-tags).

## Technical changes

- **Correct-language article metadata.** The public API confirmed all six current
  articles have English titles and bodies. Three lack English SEO overrides:
  `koliko-dugo-ostajemo-u-poslu-koji-nas-vise-ne-ispunjava`,
  `pitanja-koja-sebi-rijetko-postavljamo`, and `kada-nisi-zadovoljna-poslom`.
  Payload fallback made their English pages inherit Montenegrin SEO text. Reading
  SEO overrides without locale fallback lets those pages use their English article
  title and excerpt. Deliberately authored English SEO overrides still win.
- **Safe structured data.** FAQ and blog-list JSON-LD now use the same script-safe
  serializer as articles and the homepage. Editorial emphasis is stripped from FAQ
  text to match its visible wording.
- **Accurate entities.** The homepage describes the website, Jelena as its publisher,
  and her mentoring service. It no longer declares a local business without a
  published business address. Article markup identifies her author page, uses the
  actual fallback content language, and uses a real cover image—including an original
  without an OG crop—when available. A generic brand card remains the social-sharing
  fallback, but is not claimed to illustrate every article.
- **Crawlable archive.** The blog previously stopped after 50 posts. It now provides
  12-post pages with ordinary previous/next links and a distinct canonical URL for
  each page. Category filters retain their category while paging and are `noindex,
  follow`; invalid and out-of-range pages return 404. The sitemap continues to include
  all published article URLs and real language variants.
- **Repeatable audit.** The existing crawler now records parsed JSON-LD, JSON parsing
  errors and previous/next links alongside titles, descriptions, canonicals, language
  alternates, robots rules and image-alt checks.

References: [pagination](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading),
[article markup](https://developers.google.com/search/docs/appearance/structured-data/article),
[structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

## Optional copy recommendations — not applied

No wholesale rewrite is needed. The existing text already discusses career change
and changing jobs. If you choose to strengthen the visible search context later:

1. **Homepage:** keep the headline “Karijera može da bude usklađena sa tobom.”
   Consider one supporting sentence: “Kao mentor za promjenu karijere, pomažem ti da
   pronađeš pravac i napraviš sljedeći korak.” This makes the service explicit near
   the top while preserving the site's voice.
2. **Mentoring page:** consider changing only the small eyebrow from “Rad sa mnom ·
   1:1 mentorstvo” to “Karijerno mentorstvo · promjena karijere i posla”. The main
   headline can remain as it is. The existing online-session and job-search FAQs
   already provide useful specific information.
3. **Future articles:** prioritize substantial, original answers to “Kako promijeniti
   karijeru kada ne znaš odakle da počneš?”, “Promjena posla ili promjena karijere:
   kako prepoznati šta ti treba?” and “Kako prepoznati da je vrijeme za promjenu
   posla?”. Link naturally to the mentoring page when relevant. These are editorial
   suggestions, not researched search-volume estimates.

Google evaluates useful page content as well as technical signals; title changes
alone cannot establish high rankings for every target phrase.
[Helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## Branch cleanup and deployment boundary

Pulled `develop` before editing, then fast-forwarded it to the already released
`main` commit `5fe68e8`. Production SSH inspection confirmed that same revision.
Every pre-existing local and remote feature branch was contained in `main`.

Deleted local branches: `codex/responsive-path-art`, `codex/seo-analytics`,
`experimental/frontend`, `fix/mobile-webinar`, `refinement/inner-heroes-resources`.
Deleted remote branches: `codex/seo-analytics`, `experimental/frontend`,
`perf/static-rendering`. Pruned the stale remote reference for
`feature/white-label-cms`, which had already been deleted on GitHub.
Remote deletions used exact-commit leases to protect work added concurrently.
`main`, `develop`, and existing checkpoint tags remain.

These SEO changes require the normal release to `main` to reach production. No
production CMS content or database schema was changed during this work.

## Verification

- 25 tests across five files, including five new SEO/pagination regression tests.
- TypeScript check and production build.
- Read-only live crawl before changes: 26 sitemap URLs; the existing public routes,
  permanent `/me` redirect, admin `noindex`, default social image and 404 response work.
- Local production crawl: all 26 sitemap pages passed status, title/description,
  self-canonical, language-alternate, one-H1, image-alt and JSON-LD parsing checks.
  The three affected English titles now match their English article fields.
- Thirteen disposable local articles exercised second-page and category navigation
  in both languages, self-canonicals, filter `noindex`, and malformed/out-of-range
  404 responses. Browser navigation and a 390px phone layout were also checked.

Run the audit with `python3 scripts/audit-seo.py https://jelena.rajkovic.coach`.
After release, use Search Console to submit/refresh `sitemap.xml`, inspect the main
landing pages, and compare impressions, clicks and positions for the target queries
by country and page. Search Console access is needed to measure those outcomes;
this task does not claim an observed ranking increase.
