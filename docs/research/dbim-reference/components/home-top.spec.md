# Home — top sections (Banner, PM Quote, About Us)

Reference: `home` (`ref3/shots/home@1440.png`, `@390.png`; computed styles in
`ref3/styles/home.json`, rules in `used.css` §430–507, §718–732, §805–808, §848).
Values are computed at 1440 (the reference's 1280–1536 bucket) unless marked.

Components: `DbimBanner` (`home/Banner.tsx` + client leaves `home/BannerCarousel.tsx`,
`home/AnnouncementsMarquee.tsx`), `DbimPmQuote` (`home/PmQuote.tsx`), `DbimAboutUs`
(`home/AboutUs.tsx`); CSS `home/home-top.css`; data `lib/website-dbim/home-top.ts`.

## 1. Banner (`.banner-img-box`, y 181–710 at 1440)

| Element | Reference value | Ours |
|---|---|---|
| Carousel | 1440×480 (3:1), full-bleed; slides stacked, active `opacity:1`, `transition: opacity 1s ease-in-out` | `aspect-ratio: 3/1`, same fade; no transition under reduced motion |
| Prev / next | 35×35, `#000` fill, radius 2px, `left/right: 30px` (24px ≤991), vertically centred; chevron 48px white (32px ≤991) | DS `IconButton` restyled `.db-banner__arrow`; `--sa-color-neutralScale-1000`, `--sa-shape-2` |
| Dot tray | 160×20, `#D2DFFF` (primary-100), padding 4, radius 8, `bottom:18px; right:160px` (centred ≤768) | same; dots are DS `Button`s |
| Dots | 12×12 round, gap 16, `#5279D7` (primary-400); active `#162F6A` (primary-800) | same; active carries `aria-current="true"` |
| Pause/play | 40×40 round, `#150202` (text-default), white 24px glyph, `bottom:10px; right:45px` (1280–1500), 105px ≥1501, `right:20px + translateX(50%)` ≤768 | DS `IconButton shape="circle"` |
| Autoplay | measured on the live reference 25 Sep 2026: **5.0 s** between slides | 5 s; stops on hover and focus-within; stops for good on Pause; off under `prefers-reduced-motion` (starts paused, shows Play) |
| Link | the reference makes every slide clickable | a slide with `href` is an `<a>` around the image (external: new tab, name says so) |

Announcements bar (`.banner-img-footer-box`): 49px tall, `#C6C6C6` (neutral-200),
padding `11px var(--db-gutter)`. Heading `<h2 class="h3"><strong>` 16px (20px ≥1537),
weight 900 (strong inside a 600 h2), primary-800, line-height normal; the speaker icon
25px beside it, gap 8; `margin-right: 30px` (8px ≤767). Marquee: fills the row,
`white-space:nowrap`, `@keyframes marquee { 0% translateX(35%) → 100% translateX(-100%) }`,
reference duration 40s. Pause button 24×24, glyph 24px primary-800, `margin-left: 30px`.

Content (ours): the Department's latest updates — `whatsNew()` from
`@/lib/website-next/whats-new` (updates, circulars, notices, results, announcements,
last twelve months, de-duplicated, newest first), first 10, each a link. The duration
scales with the text so reading speed stays near the reference's (≥40s). When the feed is
empty the bar still renders with its heading (DBIM makes it mandatory) and the marquee
reads "No Data Available." (the reference's own empty wording).
Marquee accessibility: pauses on hover and focus-within; when a link inside it has focus
the animation is removed and the strip scrolls natively so the focused link is never
off-screen; under reduced motion it does not move at all and scrolls natively.

## 2. PM Quote (`.pm-quote-container`, y 710–1050)

| Element | Reference | Ours |
|---|---|---|
| Band | `#EBEAEA` (neutral-100), padding 40px 0 (45px ≥1537, 24px ≤767) | same |
| Container | bootstrap `.container` 1320 max, padding 7.5px; card row = 4/12 + 8/12 (435 + 870 at 1440) | grid `1fr 2fr` |
| Portrait | 260×260, round, white ground, shadow `0 2px 4px rgba(35,35,47,.06), 0 6px 12px rgba(35,35,47,.08)`, cover; 170px ≤565 | same; `DBIM_PEOPLE.primeMinister` |
| Quote mark | “ 44px, primary-800, box 40px high | same |
| Quotation | 24px / 29px, weight 500, ls −0.12px, primary-800 (20px ≤991; measured ≈14px at 390) | same |
| Rule | 1px primary-800, 15px below the quote | same |
| Event + date | 14px/21px (16px ≥1537), 500, uppercase, primary-800, two lines | event, then date `15.08.2025` in the reference's dd.mm.yyyy |
| View Event | outlined, 12px/18px 600 uppercase, ls .12px, padding 8×12, gap 8, 1px primary-800, radius 4, white; hover primary-100; `open_in_new` 24px | same, an external `<a>` (new tab) |
| ≤991 | stacked; the portrait sits in a 260px frame (so the spacing below it matches) | same frame, portrait centred (see deviations) |

Content (ours): the redesign's quotation, verbatim — PIB PRID 2156749, Address to the
Nation on the 79th Independence Day, Red Fort, 15 August 2025. Not the reference's
"TEST / UNDEFINED.UNDEFINED" placeholder.

## 3. About Us (`.layoutshift-about`, y 1050–1446)

| Element | Reference | Ours |
|---|---|---|
| Band | white, padding 40px `var(--db-gutter)` (80px ≥1537, 32px 16px ≤767) | same |
| Heading | `DbimSectionHeading icon="about"` — 48px icon, 20px/700 primary-800, gap 12 | the kit component |
| Columns | 50/50 at ≥1200, 30px gutter; left column 10px below the heading, right 30px | grid |
| Sub-line | `<strong>` 16px/30px, ls −0.1px (20px ≥1537; 14/21 ≤991) | "Sector overview at a glance" (the reference's) + the Department's introduction |
| Tiles | 3 across, 199×88 at 1440, gap 15; padding 12 8, min-height 60, 1px primary-800 border, radius 2, shadow `0 1px 2px rgba(35,35,47,.06), 0 4px 8px rgba(35,35,47,.08)`; icon 32 above label (8px gap); 16px/22px 600 text-default (20px ≥1537); hover fills primary-800, white ink | same; ≤767 one per row, icon left of label |
| Ministers | one row, centred, gap 20 (12 ≤1400, 8 ≤1200); portrait 172×172 at 1280–1536 (≤215×200 otherwise), contain, border 2px neutral-100 + 6px primary-800 bottom; name 16px/600 (20px ≥1537), ls −0.12px, margin 10px 0; role 14px/21px | same; `DBIM_PEOPLE.ministers` in order |

### Deviation — the three tiles (DBIM review team, 25 Sep 2026)

The reference build shows **Our Team / Our Division / Our Organisation**. The DBIM
review team ruled on 25 Sep 2026 that the tiles are **Our Team, Our Organisation, Our
Performance** (Our Performance goes to the dashboard). Ours follow the ruling, keep the
reference's icons in the reference's order (team → people, second → grid, third → bar
chart) and link to `/ministry/our-team`, `/ministry/our-organisation`,
`/ministry/our-performance`.

### Other deviations

- The reference's About Us heading is a link to `/ministry`; `DbimSectionHeading` takes no
  link, so ours is a plain heading (the tiles are the section's links).
- At ≤565px the reference draws the 170px PM portrait at the top-LEFT of a 260px frame
  (the lazy-load wrapper keeps its 260px inline size), so it sits off-centre. Ours keeps
  the frame and its spacing and centres the portrait.
- The announcements heading is an `h2` styled as h3, as the reference's DOM has it — an
  h3 there would skip a level on a page whose next heading is an h2.
- The reference's banner dots are `role="tab"` without panels; ours are buttons with
  `aria-current`, per the WAI-ARIA carousel pattern.
