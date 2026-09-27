# Home — bottom sections and page assembly

Reference stem `home` (`../ref3/shots/home@1440.png`, `@390.png`; computed styles from
`../ref3/styles/home.json`, CSS from `../used.css`). Measured on 25 Sep 2026.

## Page order

`DbimBanner` · `DbimPmQuote` · `DbimAboutUs` · `DbimOfferingsAndNews` · `DbimDocumentsRow` ·
`DbimSocialMedia` · `DbimCampaigns` · `DbimPartners`. Nothing else. The home page has no
banner h1, so it carries a visually hidden `<h1>Department of Social Justice and Empowerment</h1>`
(the reference names the document "Home | Department of Social Justice and Empowerment").

## Shared geometry (the reference's `container-fluid px-120 py-80`)

`container-fluid.py-80` resolves to **40px** top and bottom at every width (the
`.container-fluid.py-80` rule outranks the `@media` steps). Side padding is `var(--db-gutter)`.
Both the social band and the campaign row sit on the **same four-column grid**: at 1440,
1312px wide, columns 316.75px, **15px** gap (Bootstrap gutter 7.5 + 7.5).

## 1 · In Social Media — `.layout4-social.socialMediaContainer`

| Element | 1440 | 390 |
|---|---|---|
| Band | bg `#162F6A` (primary-800), 519px tall, padding 40 / gutter | 512px, padding 40 / 16 |
| Heading | `DbimSectionHeading icon="social" tone="inverse"`: svg 48, gap 16, h2 20px/500 white | svg 32 |
| Heading → cards | 30px (`row-gap-5` = 3rem at 10px root) | 30px |
| Card header `h3.socialhead` | white, 16px padding, 16px/500, lh 19.2px (1.2), primary-800, radius 4 4 0 0 | same |
| Card body `.socialmediaheight` | white, 12px padding, **height 310px, overflow-y auto**, radius 0 0 4 4 | same (max-height 414) |
| Scrollbar | 6px; track white with 0.5px primary-200 edge, radius 15; thumb primary-600 | same |
| Columns | 4 × 316.75, gap 15 (`col-xl-3`); 2 per row 768–1279 (`col-lg-6 col-md-6`) | one card at a time (`socialmedia-slider`) |
| Carousel controls (<768 only) | — | `‹ • • • • ›` centred ~20px under the card; dots 12px white "•" at .25 / active .75; chevrons white 20px |

Card titles, verbatim: **X · Youtube · Facebook · Instagram**.

**Content** (reference's, the Department's own accounts; `lib/website-dbim/social.ts`):
five posts on X (IDs in the reference DOM), five from the uploads playlist
`UUDvIvFEeSJlo8dOihp2SUig` (iframes 150px tall in 200px slots), five Facebook post plugins
(`goimsje`, one reel; 500px tall), one Instagram post. Account links from `DBIM_BRAND.social`.

**States.**
- *Idle / far from the viewport*: no third-party request. The card body shows the account —
  "Department of Social Justice and Empowerment", its handle, and **View on <network>**.
- *Near the viewport* (IntersectionObserver, 400px margin): the embeds render.
  X and Instagram load `widgets.js` / `embed.js` once; until (or if never) they run, each
  post is a blockquote holding a "View this post on X/Instagram" link, never blank.
  YouTube (`youtube-nocookie.com`) and Facebook are `loading="lazy"` iframes with titles.
  Every feed ends with its **View on <network>** link, the way out if an iframe is blocked.
- *Offline* (`navigator.onLine === false`): the account fallback stays.

Deviation recorded: the reference scrolls the feed inside a 310px card; the estate rule is
never to scroll inside a card. Kept, because the feeds are the networks' own documents of
unknown length and the 310px card is the DBIM template; the region is focusable and named
so a keyboard reader can scroll it.

## 2 · Campaign row — `.centralimg-layout-2-3`

| Tile | 1440 | <992 |
|---|---|---|
| MyGov DPDP Rules 2025 | image, cols 1–2 (648.5 × 248.5), radius 4, link out | full width |
| Scholarship video | col 3 (316.75 × 248.5), bg ≈ `#ADBDEB` (nearest token primary-200), radius 12, object-fit contain | full width, poster aspect ≈ 1.29 |
| Social Audit MIS | col 4 (316.75 × 258.86, its own aspect), radius 10 (`rounded-4`), grey frame is in the artwork, link out | full width |

Section 339px tall at 1440 (40 + 259 + 40). The video: `controls preload="none"`, the
reference's poster, `title` and `aria-label` naming it. No captions exist at the source.
992–1279: the image and video share a row (8/12 · 4/12), the audit tile sits alone
centred at 4/12 (`col-lg-4`, `justify-content-center`).

## 3 · Partners — `.greybg.homeLogoSlider`

| Element | 1440 | 390 |
|---|---|---|
| Band | border-top 2px `#EBEAEA` (neutral-100), padding-top 30, 162px tall | same |
| Track | `col-lg-8`, centred: 960 wide, slides 189 × 130 | full width − 15, slides 187.5 |
| Card | 169 × 100, 10px padding, white, 1px neutral-100 border, radius 4, shadow `0 1px 2px rgba(35,35,47,.06), 0 4px 8px rgba(35,35,47,.08)`, 30px below | 167.5 × 100 |
| Logo | 125 × 85 box (ours: `object-fit: contain`, the reference stretches) | same |
| Arrows | `chevron_left/right` 32px primary-800, at −25px outside the track, vertically centred on the card (top 65 − 15) | hidden (< 992) |
| Visible | 5 | 2 (3 between 576 and 991, inferred) |

Behaviour (slick, stepped by one, infinite): stepped scroll-snap track, arrows step one card
and wrap at the ends. Autoplay every 3s at ≥992 only, where the arrows and a pause
control are shown; pauses on hover and focus, never runs under reduced motion.
Below 992 there is no autoplay: touch swipes natively, and a focused logo scrolls itself
into view, so the keyboard reaches every link. Each card with an `href` is an external
link named by its `label` + "(opens in a new tab)"; cards without one are plain images.

## Reference capture artefacts (not to be copied)

- The 1440 social cards are empty in the capture — the embeds had not rendered.
- At 390 the social carousel shows slide 4 (Instagram), and the Social Audit tile and
  partner logos are unloaded lazy images (blurred / zero height).
