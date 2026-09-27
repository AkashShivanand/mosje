# DBIM chrome — spec

Source: `../ref3` captures of master-socialjustice.digifootprint.gov.in (25 Sep 2026),
`inspect.py` computed values at 1440, `used.css` rules for the other breakpoints, and a
live probe of the reference on the same day for the states the captures do not hold
(menu dropdown, mobile off-canvas, cookie bar, scroll-to-top). Reference px are given;
the CSS converts them (reference rem ÷ 1.6).

## Header (`chrome/Header.tsx`, `chrome/HeaderTools.tsx`)

| Element | ≥1537 | 1280–1536 (1440 capture) | <992 (390 capture) |
|---|---|---|---|
| Section padding | 15 / 120 | 10 / 64 | 0 20 10 10 (≤440), 0 40 10 (≤767), 10 80 |
| Row | flex, centre, 100 tall; cols 44.4% logo · 22.2% search · 16.7% Digital India · 16.7% tools | same | column |
| Emblem | 57×100, black | same | same |
| "Government of India / Ministry…" | 20px/1.25, 400, ls −0.08 | same | 20px |
| Department name | 24px/1.25 bold | 20px | 15px |
| Search | 264×44, border 2px neutral-100, bottom 3px primary-800, radius 12 12 0 0, pad 0 10; button 47×39, left rule 1px neutral-100, `search` 24px primary-800; placeholder 16px ink .8 | same | full width, hamburger (`menu`, primary-800) at right |
| Digital India | 150×58, 15px in from its column | same | centred row under the name |
| Tools | skip · language · accessibility, 32px glyphs primary-800, 4px pad each side, 1px primary-800 rules between; 40 tall | same | top-right row, 24px glyphs |

Content mapping: all text is the reference's (it is the Department's own masthead).
Search submits `GET dbimHref("/search")?q=`. Skip → `#maincontent`. Language opens the
estate's `LanguageDialog`. Accessibility opens the UX4G panel via `openUx4gWidget()` and
claims the page's one door with `useAccessibilityEntryClaim` (DS, 2026-09-25).

## Menu (`chrome/MainNav.tsx`, `chrome/MobileMenu.tsx`)

- Row: sticky `top:-1`, white, border-top 1px neutral-100, border-bottom 2px primary-800,
  shadow 0 4 8 ink 8%, padding 0 38 (≥1537/<1280) · 0 14 (1280–1536). Hidden <992.
- Items: 240 wide (≥1537) · 160 (<1537), min-height 58. Label 20px/600 (≥1537) · 16px.
  Chevron `expand_more` 24px, 5px down.
- Active: bold primary-800, 8px bottom bar, label box 105% tall (text sits 4px higher).
  Home when active: 24px (≥1537) · 20px; a menu entry when active: 24px (≥1537) · 16px.
- Hover / open: primary-100 ground. Panel: top 58, full item width, ink at 70% +
  blur(5px), radius 0 0 6 6, centred; links 14px/21px white, pad 12; link hover primary-100
  ground, ink text.
- Keyboard: Enter/Space/ArrowDown open and focus the first link; Up/Down move; Escape
  closes and returns focus to the trigger; Tab out closes.
- Mobile (<992): hamburger → right off-canvas, full width at 390; no Home row (the
  reference has none); section rows 16px/600 with chevron, children 16px/400 indented 10px,
  40px rhythm; close ✕ top-right.

## Inner page (`layout/DbimPage.tsx`, `layout/DbimTabBar.tsx`)

- Banner: primary-800 ground, photo at its own aspect (1920×280 → 210 at 1440; the
  default 1440×245), min-height 60, gradient primary-800 20% → transparent 70%.
- Text block: absolute, bottom 25%, 85% wide, in the 1320 container. Breadcrumb 16px
  white, "/" separators with 5px either side, the last crumb underlined 1px; h1 24px (36
  ≥1537)/1.5 bold white. ≤767: crumb 10px, h1 15px; ≤474: bottom 8px.
- Tab bar: container, primary-800, radius 12, pad 16 (8 <992), `margin-top:-40` over
  the banner foot, bar hanging 30px below it; <768 below the banner, radius 0 <576, full
  width. Tabs 20px/normal, ls −0.1, pad 5 10, white; active bold, margin-left 16, the
  six-dot glyph at −8/4. Overflow: nowrap, horizontal scroll, scrollbar hidden, a 40×40
  primary-400 chevron button at the end (and start once scrolled).
- Content: `.container` (540/720/960/1140/1320 at 576/768/992/1200/1400, pad 7.5),
  `padding-top:32` + `margin-top:30`, bottom 32. ≤767 side pad 10.

## Kit

- Section heading: h2 flex gap 16, icon 48 (32 <992), 20px (24 ≥1537) bold primary-800;
  inverse: white, 500.
- View More: 36 tall, 1px primary-800, radius 4, pad 4 6 6 12, uppercase, chevron 24;
  md 16px/400 · sm 12px/600 pad-left 8. Hover primary-100.
- Filter bar: search (max 375) · sort (270) · category (270) · per page (180); each an
  icon cell 41 wide + field 42 tall, 1px primary-400, field pad 8 16, 16px text; gap 5,
  margin-bottom 24. <768: search + a 42px filter toggle (1px primary-800, radius 5) that
  reveals the selects stacked.
- Pager: centred, gap 2; pages 35 circles 14px/700 primary-800, current primary-200;
  chevrons `chevron_left/right` weight 700, disabled neutral-300. Ellipsis after 4 on
  page 1 (1 2 3 4 … 11).
- Empty: "No Data Available." centred, 600.

## Footer (`chrome/Footer.tsx`)

primary-800, pad 33 60 (16 <768). Left (58.3%): "Useful Links" 14px/600 uppercase
neutral-100 mb 30 (16 <1280, 20 ≥1537); 3-col grid gap 20 16, links 16px (20 at ≥1537 and
<1280) neutral-100 with a white chevron; the ownership line 16px, mb… Right (25%, text
right; centred <768): "Subscribe for Updates" 16px/600 ls .16 uppercase; social 24px gap
16; MyGov + india.gov.in white badges 116×44 radius 4 gap 5; "Last Updated On:
dd.mm.yyyy" 14px/18 ls .16 — the date is the content ingest's (`getContentSyncedDate`).

## Cookie bar (`chrome/CookieConsent.tsx`)

White bar at the page foot, STICKY (not fixed) so it never hides the footer; text 14/21
(first bold), link "Cookie Settings"; CUSTOMIZE COOKIES (link) · DECLINE OPTIONAL COOKIES
· ACCEPT ALL COOKIES, each primary-100 / primary-800 12px/600 ls .6 uppercase pad 8 12
radius 4; hover primary-200. Cookie `dbim-cookie-consent` = accepted | declined | custom,
one year. Marked `data-sa-rail-clear` so the transient corner occupant steps aside.

## Scroll to top

The DS `BackToTop` (corner-rail contract), restyled: primary-800 circle, white
`arrow_upward`, shadow 0 4 8 ink 10%.
