import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'

// Minimal Lexical rich-text with paragraphs.
const richText = (...paras: string[]) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: paras.map((text) => ({
      type: 'paragraph',
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
    })),
  },
})

const run = async () => {
  const payload = await getPayload({ config })
  const log = (m: string) => payload.logger.info(`[seed] ${m}`)

  /* ---------- admin user ---------- */
  const email = process.env.SEED_ADMIN_EMAIL || 'jelena.rajkovic.coach@gmail.com'
  const password = process.env.SEED_ADMIN_PASSWORD || 'KarijernoIskreno2026'
  const users = await payload.find({ collection: 'users', limit: 1 })
  if (users.totalDocs === 0) {
    await payload.create({ collection: 'users', data: { email, password, name: 'Jelena Rajković' } })
    log(`admin user created → ${email} (password: ${password})`)
  } else {
    log('admin user already exists, skipping')
  }

  /* ---------- media (her two provided photos) ---------- */
  const assets = path.resolve(process.cwd(), 'assets')
  const ensureMedia = async (file: string, altMe: string, altEn: string) => {
    const found = await payload.find({ collection: 'media', where: { alt: { equals: altMe } }, limit: 1 })
    if (found.docs[0]) return found.docs[0]
    const doc = await payload.create({ collection: 'media', data: { alt: altMe }, filePath: file })
    await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt: altEn } })
    log(`media uploaded → ${path.basename(file)}`)
    return doc
  }
  const portrait = await ensureMedia(path.join(assets, 'jelena.webp'), 'Jelena Rajković — portret', 'Jelena Rajković — portrait')
  const story = await ensureMedia(path.join(assets, 'jelena 2.webp'), 'Jelena Rajković', 'Jelena Rajković')

  /* ---------- categories ---------- */
  const cats = [
    { slug: 'promjena', me: 'Promjena', en: 'Change' },
    { slug: 'it-prelazak', me: 'IT prelazak', en: 'Into tech' },
    { slug: 'jasnoca', me: 'Jasnoća', en: 'Clarity' },
  ]
  const catId: Record<string, number> = {}
  for (const c of cats) {
    let doc = (await payload.find({ collection: 'categories', where: { slug: { equals: c.slug } }, limit: 1 })).docs[0]
    if (!doc) doc = await payload.create({ collection: 'categories', data: { title: c.me, slug: c.slug } })
    await payload.update({ collection: 'categories', id: doc.id, locale: 'en', data: { title: c.en } })
    catId[c.slug] = doc.id as number
  }
  log('categories ready')

  /* ---------- images onto globals + English translations ---------- */
  await payload.updateGlobal({ slug: 'home-page', data: { heroPortrait: portrait.id, storyImage: story.id } })
  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'en',
    data: {
      heroEyebrow: 'Career, honestly',
      heroHeadline: 'Your career can be **aligned** _with you._',
      heroSub:
        'For women who have outgrown their job and feel things could be better — but don’t know where to start. Together we find your next realistic step.',
      heroBadge: '“I see you.”',
      empathyEyebrow: 'I see you',
      empathyHeadline: 'Maybe some of this is happening to _you._',
      empathyItems: [
        { text: 'You feel you’ve outgrown your job, but you stay because it’s safe.' },
        { text: 'You apply for jobs and — nothing moves.' },
        { text: 'You don’t know exactly what you want — only that it isn’t this.' },
        { text: 'You know it could be better — but not where to begin.' },
      ],
      storyEyebrow: 'My story',
      storyLine: 'From _biology_ to IT — at 26. I lived the exact change I now guide you through.',
      storyLinkLabel: 'Read my story',
      workEyebrow: 'Work with me',
      workHeadline: 'What do you get when _we work together?_',
      workCards: [
        { title: 'Clarity', text: 'You understand what you truly want — free of fog and others’ expectations.' },
        { title: 'Direction', text: 'You know where you’re going and why — aligned with who you are.' },
        { title: 'A real plan', text: 'Concrete steps for your situation — not generic lists.' },
        { title: 'Support', text: 'Someone who sees you and has your back through the whole change.' },
      ],
      workLinkLabel: 'How working together looks',
      blogEyebrow: 'Career notes',
      blogHeadline: 'Honest about career — _notes_.',
      ctaHeadline: 'If you sense it _could be better_ — let’s start with a talk.',
      ctaSub:
        'A free intro call, no obligation. We look at what you already have, what you want, and your next realistic step.',
    },
  })

  await payload.updateGlobal({ slug: 'about-page', data: { portrait: portrait.id } })
  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'en',
    data: {
      eyebrow: 'About',
      headline: 'I changed careers _and survived_ it.',
      body: [
        { text: 'At 26 I worked in the field I trained for — biology. On paper, everything was fine. Inside, I knew it wasn’t my place.' },
        { text: 'Moving into IT wasn’t easy or romantic. There was fear, doubt, nights of studying after work, and the question “what if I fail?” But step by step, I made a change that gave me back the feeling of being on my own path.' },
        { text: 'Today I mentor women who feel what I felt: that they’ve outgrown their place, that they want something of their own, but don’t know where to start. I don’t hand you ready answers — I help you find your own.' },
        { text: 'My approach is honest and free of pressure. We start from what you already have, look at what you really want, and together define your next realistic step. No magic formulas — just clarity, direction, and support.' },
      ],
      quote: '“Your career can be aligned with you — not you with it.”',
      ctaHeadline: 'Ready to look at _your_ next step?',
    },
  })

  await payload.updateGlobal({
    slug: 'work-page',
    locale: 'en',
    data: {
      eyebrow: 'Work with me · 1:1 mentoring',
      headline: 'Together to your _next realistic_ step.',
      sub: 'One-to-one mentoring for mid-career women who want change — with clarity instead of pressure.',
      forWhomHeading: 'Who is this for?',
      forWhomText:
        'For you who feel you’ve outgrown your job, want something of your own, or sense it’s time for change — whether or not you already know what you want. You don’t need a plan. Sensing it could be better is enough.',
      journeyHeading: 'What the _path_ with me looks like.',
      journeySteps: [
        { title: 'Free intro call', text: 'We meet, you tell me where you are now. No obligation — we see if we’re a good fit to work together.' },
        { title: 'We work together', text: 'Through a series of 1:1 sessions we build clarity, direction and a real plan — tailored to your situation.' },
        { title: 'Your next realistic step', text: 'You leave with concrete steps and the feeling of direction again — and support to begin.' },
      ],
      journeyQuote: '“Together we can look at what you already have, what you want, and what your next realistic step is.”',
      priceHeading: 'Pricing _by inquiry_.',
      priceText:
        'Every engagement is individual, so we agree on terms personally. Reach out and tell me where you are — I’ll suggest the format that suits you best.',
      faqHeading: 'Frequently asked',
      faq: [
        { question: 'Do I need to know what I want already?', answer: 'No. Most women come precisely because they don’t. We reach clarity together.' },
        { question: 'Is everything online?', answer: 'Yes, sessions are online, so we can work wherever you are.' },
        { question: 'What if I just want to try?', answer: 'That’s exactly why the free intro call exists — with no obligation afterwards.' },
      ],
      ctaHeadline: 'Let’s start with a _conversation_.',
    },
  })

  await payload.updateGlobal({
    slug: 'blog-page',
    locale: 'en',
    data: {
      eyebrow: 'Career notes',
      headline: 'Career, _honestly_.',
      sub: 'Notes on career change, moving into tech and finding direction — including columns from the magazine Ljepota i zdravlje Montenegro.',
    },
  })

  await payload.updateGlobal({
    slug: 'contact-page',
    locale: 'en',
    data: {
      eyebrow: 'Contact',
      headline: 'Let’s start with _one conversation_.',
      sub: 'Choose the way that suits you best — email me directly, reach out on Instagram, or fill in the form. No pressure.',
      directHeading: 'Reach out directly',
      directText: 'The fastest way to reach me is email or Instagram. Tell me where you are now — I reply personally.',
      formHeading: 'Or write to me',
      formNote: 'Fill in the form and I’ll get back to you as soon as I can.',
    },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      brandRole: 'Career-change mentor',
      footerBio: 'Career-change mentor. From biology into IT — and now beside you on your path.',
      footerCopyright: '© 2026 Jelena Rajković · All rights reserved',
      footerTagline: 'Career, honestly · Montenegro',
    },
  })
  log('globals translated (EN) + images assigned')

  /* ---------- her columns (Ljepota i zdravlje) ----------
     Only factual title/date + source tag + original link + my own short summary.
     Full article text is left for Jelena to paste in (she holds the rights). */
  const columns = [
    {
      slug: 'kada-nisi-zadovoljna-poslom',
      cat: 'jasnoca',
      date: '2026-06-21',
      url: 'https://ljepotaizdravlje.me/motivacija/karijerno-iskreno-s-jelenom-kada-nisi-zadovoljna-poslom/',
      me: {
        title: 'Kada nisi zadovoljna poslom',
        excerpt: 'Nekoliko iskrenih pitanja koja vrijedi sebi postaviti prije nego što napraviš sljedeći korak.',
        lead: 'Ovaj tekst izvorno je objavljen u mojoj kolumni „Karijerno iskreno” u magazinu Ljepota i zdravlje Montenegro. Cijeli tekst možeš pročitati na originalnom linku ispod.',
      },
      en: {
        title: 'When you’re not happy at work',
        excerpt: 'A few honest questions worth asking yourself before you make your next move.',
        lead: 'This piece was originally published in my column “Karijerno iskreno” in Ljepota i zdravlje Montenegro. You can read the full article via the original link below.',
      },
    },
    {
      slug: 'pitanja-koja-sebi-rijetko-postavljamo',
      cat: 'jasnoca',
      date: '2026-05-31',
      url: 'https://ljepotaizdravlje.me/motivacija/karijerno-iskreno-s-jelenom-pitanja-koja-sebi-rijetko-postavljamo/',
      me: {
        title: 'Pitanja koja sebi rijetko postavljamo',
        excerpt: 'Zašto izbjegavamo prava pitanja o svom poslu — i kako da im se vratimo.',
        lead: 'Ovaj tekst izvorno je objavljen u mojoj kolumni „Karijerno iskreno” u magazinu Ljepota i zdravlje Montenegro. Cijeli tekst možeš pročitati na originalnom linku ispod.',
      },
      en: {
        title: 'Questions we rarely ask ourselves',
        excerpt: 'Why we avoid the real questions about our work — and how to return to them.',
        lead: 'This piece was originally published in my column “Karijerno iskreno” in Ljepota i zdravlje Montenegro. You can read the full article via the original link below.',
      },
    },
    {
      slug: 'koliko-dugo-ostajemo-u-poslu-koji-nas-vise-ne-ispunjava',
      cat: 'promjena',
      date: '2026-05-16',
      url: 'https://ljepotaizdravlje.me/motivacija/karijerno-iskreno-s-jelenom-koliko-dugo-ostajemo-u-poslu-koji-nas-vise-ne-ispunjava/',
      me: {
        title: 'Koliko dugo ostajemo u poslu koji nas više ne ispunjava?',
        excerpt: 'O tihoj cijeni ostajanja u poslu koji nas više ne ispunjava.',
        lead: 'Ovaj tekst izvorno je objavljen u mojoj kolumni „Karijerno iskreno” u magazinu Ljepota i zdravlje Montenegro. Cijeli tekst možeš pročitati na originalnom linku ispod.',
      },
      en: {
        title: 'How long do we stay in a job that no longer fulfills us?',
        excerpt: 'On the quiet cost of staying in a job that no longer fulfills us.',
        lead: 'This piece was originally published in my column “Karijerno iskreno” in Ljepota i zdravlje Montenegro. You can read the full article via the original link below.',
      },
    },
  ]

  for (const col of columns) {
    const existing = await payload.find({ collection: 'posts', where: { slug: { equals: col.slug } }, limit: 1 })
    if (existing.docs[0]) {
      log(`post exists, skipping → ${col.slug}`)
      continue
    }
    const doc = await payload.create({
      collection: 'posts',
      data: {
        title: col.me.title,
        slug: col.slug,
        excerpt: col.me.excerpt,
        content: richText(col.me.lead) as never,
        category: catId[col.cat],
        publishedAt: new Date(col.date).toISOString(),
        readingMinutes: 4,
        source: 'ljepota-i-zdravlje',
        sourceUrl: col.url,
        _status: 'published',
      },
    })
    await payload.update({
      collection: 'posts',
      id: doc.id,
      locale: 'en',
      data: { title: col.en.title, excerpt: col.en.excerpt, content: richText(col.en.lead) as never },
    })
    log(`post created → ${col.slug}`)
  }

  log('done ✓')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
