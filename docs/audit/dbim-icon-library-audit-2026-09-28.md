# DBIM icon audit — the DBIM design of the website, and the DBIM Visual Library itself

**Date:** 28 September 2026 · **Scope:** the DBIM design of the website only
(`apps/hub/src/components/website-dbim`, `app/website-dbim`, reached at `/website` with the
`sa-website-design=dbim` cookie) and its Figma handoff file (`xdv8nEd7PhnRhahASd9UPY`).
The New and Classic designs, the shared `Icon` component, the SAMAVESH tokens and the
SAMAVESH Figma library are **not** changed by this work.

**Standard:** DBIM 3.0 §3 (Icons and Styles) — `docs/guidelines/DBIM-3.0/DBIM_3.0.md`.
**Source bank:** the DBIM Toolkit Visual Library, as catalogued on 28 Sep 2026
(`Resources/dbimvisuallibrarycatalogue.html`, 2,546 assets, read live from
`dbimtoolkit.digifootprint.gov.in`).

---

## 1. What the DBIM Visual Library actually contains

| Bank | Count | What it is |
|---|---|---|
| Functional Icons | 549 | 504 are Google **Material Symbols Outlined**, exported as `<name>_FILL0_wght400_GRAD0_opsz24` — line, weight 400, 24px optical size. The other 45 carry DOS 8.3 file names as titles (`AL1F71~1`, `ACCOUN 2`), 8 are PNG and 3 WEBP. No fill variants. |
| Iconography (contextual) | 1,367 | 1,030 "Line and Fill" pairs and 337 "Same Icon" (line = fill). A mix of Material Symbols exports and drawings made for DBIM. |

A random sample of 238 files (100 contextual line, 78 contextual fill, 60 functional) measured:

| Measure | Functional | Contextual — line | Contextual — fill |
|---|---|---|---|
| Canvas sizes in use | 1 (64×64) | 4 | **15** |
| Colour | `#2D2D2D` | `#2D2D2D`, `#2B2B2B`, `#F8FAFB` | `#2D2D2D`, `#2B2B2B`, `#353535`, and **18 files with `2D2D2D` (no `#`) — an invalid colour** |
| Uses `currentColor` | 0 | 0 | 0 |
| See-through (opacity) layers | 0 | **50** | 28 |
| Auto-traced (> 400 points) | 2 | **39** | 10 |
| Full-canvas clip wrappers | 0 | 36 | 4 |
| Embedded `<style>` | 0 | 0 | 43 |

**Discrepancies in the library itself** — each is a reason not to import it wholesale:

1. **No file is in a DBIM colour.** §3.7 iii requires the key colour or inclusive white; every file is a near-black grey, so every icon must be recoloured before use.
2. **One style, two weights.** The contextual bank's Material-derived icons (Home, Mail, Print, Sort By, Open In New…) are exported lighter than the functional bank's weight-400 files. Two banks of the same library cannot be mixed on a page without breaking §3.3.
3. **Traced artwork.** Offerings (876 points), Social Media Marketing (711, 15 see-through layers) and Recent Documents (507) are raster traces, not drawn icons. Social Media Marketing cannot be read at 24px and should be used at 48 only.
4. **Broken files.** The fill variants of *Organisation* and *Recent Documents* do not render.
5. **Duplicates.** *Tenders* is published three times, as three different drawings.
6. **Inconsistent padding.** §3.4 Figure 8 builds a 2px pad into every size (5.33 units at 64). 20 of the 25 icons the DBIM design needs run into that pad; the canvases range from 59×68 to 67×61.

## 2. The DBIM design of the website, before this change

Measured in the browser on all 29 DBIM routes (`scratchpad iconscan`, 28 Sep 2026):

| DBIM rule | Before | Evidence |
|---|---|---|
| §3.5 — use the library's icons | ⚠️ | 14 contextual glyphs were copied from the reference build's DOM, not the library. 9 are the library's designs redrawn; **5 are not**: Announcements (a Material "campaign" glyph), Our Team (Material "group" with one figure filled), Our Performance (square bars), What's New (**filled**), In Social Media (a globe-and-player drawing in no DBIM bank). Persona tiles and the four social marks were PNG files. |
| §3.3 — one style | ❌ | Material Symbols **Rounded** at weights **300, 400 and 700** on the same pages; the library and the reference build use **Outlined 400**. A filled quote mark and a filled What's New among line icons. |
| §3.4 — 24 / 32 / 48 / 64 | ❌ | Also 16, 18, 20, **25** (Announcements) and 31. PDF markers at 18 and 20. |
| §3.7 iii — key colour or white | ❌ | Filter-bar icons in shade 3 `#5279D7`; contact, link-row, news-group and Select chevrons in the body text colour `#150202`; sitemap chevrons in shade 2 `#214AAB`; persona tiles in **purple** PNGs. |
| §3.7 iv — never stretched | ✅ | — |
| Weight | — | 5.3 MB Rounded font downloaded for the icons. |

The code also named two icons wrongly: key `division` drew *Our Organisation* and key
`organisation` drew *Our Performance*.

## 3. What changed

### Functional icons — the DBIM font, not 549 imports

DBIM's functional icons *are* Material Symbols Outlined at `FILL0 wght400 GRAD0 opsz24`,
so the design now draws every `Icon` from exactly that instance:
`dbim.css` loads the 316 KB static Outlined instance and points `--sa-font-icon` at it for
the DBIM subtree and any page containing it (the chat launcher floats outside the subtree).
The instance has no axes, so no call site can produce a second weight or a filled glyph.

| | Before | After |
|---|---|---|
| Icon font on the DBIM home page | Rounded, 5,343,804 B | Outlined 400 static, 323,132 B |
| Weights on one page | 300 · 400 · 700 | 400 |

Thirteen Material names the design uses are not in the functional bank under that name.
Eleven are the same Material drawing published in the contextual bank — `apartment`,
`draft`, `menu`, `open_in_new`, `print` under their own names, and `call`, `mail`,
`list_alt`, `sort`, `filter_alt`, `file_copy` as *Phone*, *E-mail*, *List*, *Sort By*,
*Filter*, *Multiple Documents* — and are drawn from the font at the functional weight
(the contextual exports are lighter, see §1.2). `picture_as_pdf` and `home` differ from
their DBIM drawings and now use the library's *PDF* and *Home* SVGs.

### Contextual icons — 25 library icons, repaired

`apps/hub/public/website/dbim/icons/library/*.svg`, painted by `DbimIcon` as a CSS mask over
`currentColor`. Five repairs, applied to every file: fixed greys → `currentColor`; one
64×64 canvas, proportions kept; art inset to the §3.4 padding (only ever shrunk, never
enlarged, so Material keylines survive); see-through layers and clip wrappers removed;
one line weight (see *One line weight* below). The files are exported from the Figma
glyphs, so Figma is their source. The 25 files weigh 224 KB on disk (the vector offset
adds points).

| Library icon | Key | Defects in the library file | Scale applied |
|---|---|---|---|
| Accessibility | `accessibility` | fixed grey #2D2D2D | ×1 |
| Announcement | `announcement` | fixed grey; Google 960-unit export | ×0.0667 |
| Department | `department` | fixed grey; canvas 62×49; art in the padding | ×0.8743 |
| Facebook | `facebook` | fixed grey; canvas 65×65; clip wrapper; art in the padding | ×0.8366 |
| Groups (functional) | `groups` | fixed grey; clip wrapper; art to the edge | ×0.8333 |
| Home | `home` | fixed grey; canvas 61×66; art to the edge | ×0.8333 |
| Important Links | `important-links` | fixed grey; art in the padding | ×0.8715 |
| Instagram | `instagram` | fixed grey; canvas 64×65; clip wrapper; art in the padding | ×0.8382 |
| Job Opportunity | `job-opportunity` | fixed grey #2B2B2B; art in the padding | ×0.8815 |
| Language | `language` | fixed grey | ×1 |
| Offerings | `offerings` | fixed grey; canvas 60×56; clip wrapper; traced (876 points) | ×0.8743 |
| Organisation | `organisation` | fixed grey; fill variant broken | ×1 |
| PDF | `pdf` | fixed grey; art in the padding | ×0.8889 |
| Performance | `performance` | fixed grey | ×1 |
| Publications | `publications` | fixed grey; art in the padding | ×0.8889 |
| Recent Documents | `recent-documents` | fixed grey; traced (507 points); fill variant broken | ×0.8743 |
| Schemes | `schemes` | fixed grey; canvas 67×61; clip wrapper; art past the canvas | ×0.7915 |
| Skip to Content | `skip-to-content` | fixed grey; art in the padding | ×0.8889 |
| Social Media Marketing | `social-media-marketing` | no colour; 15 see-through layers; traced (711 points); illegible at 24 | ×0.8735 |
| Tenders | `tenders` | fixed grey #2B2B2B; one of three different *Tenders* | ×0.9697 |
| User Personas | `user-personas` | fixed grey; canvas 65×65 | ×0.889 |
| What's New | `whats-new` | fixed grey; art in the padding | ×0.8782 |
| WhatsApp | `whatsapp` | fixed grey; 2 see-through layers; clip wrapper; art to the edge | ×0.8205 |
| X | `x` | fixed grey; art in the padding | ×0.9091 |
| YouTube | `youtube` | fixed grey; canvas 65×65; clip wrapper | ×0.8382 |

### Where each one is used

| Surface | Before | After |
|---|---|---|
| Section headings (48) | reference glyphs, 5 not from DBIM, What's New filled | Department, Offerings, What's New, Recent Documents, User Personas, Important Links, Social Media Marketing — all line |
| Header controls (32) | reference glyphs | Skip to Content, Language, Accessibility |
| Announcements ticker | reference glyph at **25** | Announcement at **24** |
| About Us tiles (32) | keys `team` / `division` / `organisation` | `groups` / `organisation` / `performance` — named for what they draw |
| Persona tiles (48) | four purple PNGs | Schemes, Tenders, Publications, Job Opportunity in the key colour |
| Footer social (24, white) | four PNGs + a hand-drawn WhatsApp | Facebook, X, YouTube, Instagram, WhatsApp from the library |
| Document and tender rows | reference PDF at 18 / Material `picture_as_pdf` at 20 | library PDF at **24** |
| Sitemap | Material `home` | library Home |
| Filter bar, contact rows, link rows, news groups, Select chevron, sitemap chevrons | shade 3 / text colour / shade 2 | key colour |

Eight PNG files are deleted: `dbim/icons/{facebook,x,youtube,instagram}.png` and
`dbim/personas/icon-{schemes,tenders,publications,vacancies}.png`.

### Figma — the DBIM handoff file, page *Icons & Logos*

The 18 icon sets were updated **in place** (component keys and every template instance
kept) and 9 were added, so the file holds the same 25 library icons as the code plus
Chevron Down (the functional `expand_more`):

- every glyph rebuilt from the cleaned library SVG, strokes outlined, one flattened vector,
  **bound to `icon/key`** (or `icon/on-dark` for the three marks that sit on the key
  colour: Social Media, WhatsApp, and the new Facebook, X, YouTube, Instagram);
- sizes 24 / 32 / 48 / 64, the glyph inside the §3.4 padding at every size;
- defects found in the file and fixed: *Chevron Down* was **unbound black**; every icon
  frame carried a hidden `icon/on-dark` fill; *Social Media* and *WhatsApp* were white on
  a transparent set and **invisible on the page** (their sets now sit on `brand/key`);
  *Our Organisation*'s frame was named `Icon-Our-Division` and *Our Performance*'s
  `Icon-Our-Organisation`;
- *PDF Document Alt* is now identical to *PDF Document* and is marked **deprecated** in its
  description rather than deleted, because template instances use it;
- each set's description is an agent briefing: library title, code key, and four rules
  (sizes, colour, no stretching, no glyph from outside the library).

The page is organised the way the file's other component pages are — a `Label ·` heading
and a `Description ·` line over each group, groups in reading order, layers in the same
order: **Section Heading Icons · Header Control Icons · Content Icons · Persona Tile
Icons · File and Navigation Icons · Social Media Icons**, then **Logos** on their own.
The four logos had been sitting in the icon grid.

### One line weight

The library draws its icons at five-fold different weights. Measured as the median line
thickness on the 64-unit canvas (distance transform over a 512px render):

| | Thinnest | Thickest | Spread |
|---|---|---|---|
| Library, as cleaned | Job Opportunity 1.5 | Performance 5.33 (its axis line; the bars are solid) | 1.5 – 5.33 |
| After | Social Media Marketing 2.5 | — | **3.0 ± 0.25** for 23 of 25 |

The target is **3.0 units** — 1.1px at 24, 1.5px at 32, 2.25px at 48. Three weights were
previewed on all 25 (3.0, 3.25, 3.5); above 3.0 the traced drawings (Offerings, Recent
Documents, Schemes) close their counters. DBIM's Functional Icons measure 5.3 (2px at 24);
matching them would fill in most contextual drawings, so the two banks stay different
weights, as they are in the library.

Each glyph was offset as a **vector**, in Figma: an outline stroke of half the difference,
unioned to thicken or subtracted to thin, then re-fitted to the §3.4 live area. Thickening
is capped at +1.0 (+0.75 for the four most detailed drawings), which is why Social Media
Marketing stays at 2.5. The site's 25 SVGs are **exported from those Figma glyphs** by the
REST API (`format=svg`, fill → `currentColor`), so the file and the code cannot drift.
Chevron Down is not offset: it is a Functional Icon, drawn on the site by the Outlined font,
and must match every other arrow there.

### Used across the whole DBIM version

**Website — 126 pages, desktop 1440 and mobile 375, the mobile menu opened on each.**
Every page reachable from the DBIM home was crawled and every rendered icon classified
(8,250 on the first pass). After this pass: every font glyph is the DBIM Outlined instance
and its name is in a DBIM bank; every contextual icon is a library file; every icon is the
key colour or white. The things the page-by-page crawl found that the 29-route scan had
not, all fixed in the DBIM stylesheets only:

| Where | Was | Now |
|---|---|---|
| Desktop menu arrows (Ministry ▾ …) — every page | menu text colour `#150202` | key colour |
| Mobile menu section toggles | `#150202` | key colour |
| Scheme-detail link arrows (`open_in_new`) | shade 2 `#214AAB` | key colour |
| Disabled carousel / pager arrows | grey `#AAAAAA` | key colour; the button's `--sa-alpha-disabled` fade marks it disabled |
| Every Select's chevron | the design system's own 18px SVG | DBIM *Expand More* at 24px, as a mask, from `library/expand-more.svg` (exported from the Figma Chevron Down) |
| Mobile menu close (✕) | the design system's own stroke SVG in body text colour | DBIM *Close* at 24px, key colour, from `library/close.svg` |
| Photo viewer (Lightbox) close, previous, next, video badge | the design system's own SVGs at 22 / 26 / 14px | DBIM *Close*, *Chevron Left*, *Chevron Right*, *Play Arrow* at 24px (badge 16px), white. The viewer is portalled to `<body>`, so it is reached through `body:has([data-design="dbim"])` |
| PM quote mark | a “ character, which the reference sets in Material Symbols but no Material build carries — so it fell back to Noto Sans Bold | Material *format_quote*, **filled**, turned 180° so it opens, 32px key colour, from `library/format-quote.svg` |

Out of scope, and why: the UX4G accessibility widget's own buttons (third-party markup,
statutory, drawn on every design) and the demo rail (prototype scaffolding, not part of the
DBIM design).

**Figma — every page of the handoff file.** The templates and component masters drew
their functional icons as **Material Symbols Rounded text** (over 1,100 glyphs across the
two template pages) because Figma offers no Outlined font. They are now **instances of 29
Functional Icon sets** built from DBIM's own functional files (Material Outlined 400
where DBIM publishes the name only as a contextual icon — the glyph the site's font
draws), sizes 16 · 20 · 24 · 32 · 48 · 64, bound to `icon/key`, each carrying the colour
of the text it replaced:

| Where | Replaced |
|---|---|
| Component masters (Chrome, Home Sections, Inner Page, Lists & Data, Cards, Forms & Utility) | 174 glyphs, 8 footer social image fills, 4 persona tile image fills |
| Loose on the templates (Desktop 132, Mobile 141) | 273 glyphs |
| Persona tiles | each tile's icon follows its link, as on the site: Schemes, Tenders, Publications, Job Opportunity |
| PM quote mark | the Rounded `format_quote` glyph → an instance of the new **Icon/Format Quote** set (filled, turned to open, 32px) — the same drawing as the site file |

Verified afterwards on every template, component and style-guide page: **zero** icon-font
text nodes and **zero** image icons remain.

## 4. Still open

| Item | Why it stays | Owner |
|---|---|---|
| 16px and 20px inline arrows (news links, footer links, carousel pause) | The estate's recorded decision: 16 beside 14px text, 20 in dense controls (`standards-precedence.md`). DBIM §3.4 governs the asset bank; its 24 frame contains a 20px glyph. | — (documented divergence) |
| Filled `format_quote` on the PM quote | Removed on `main` by `fix/dbim-home-manual-alignment` (DBIM Figure 54). | Done on `main` |
| Social Media Marketing at 2.5, below the 3.0 line weight | Thickening it further fills in its detail; the drawing needs simplifying at source. | DBIM Toolkit |
| Social Media Marketing at 24px | DBIM's drawing is illegible below 48; used only at 48. | DBIM Toolkit (report upstream) |
| Library defects in §1 | Not ours to fix; worth reporting to the DBIM Toolkit team. | DBIM Toolkit |
| UX4G accessibility widget icons (`#212121`, 20px) | Third-party, statutory, the same on every design. | — |
| Figma *Iconography* style-guide page | Holds no icon-font text or image icons; its prose was not re-read in this pass. | Next Figma pass |

## 5. How it was checked

- All 29 DBIM routes scanned in Chromium at 1440px, before and after: family, size and
  computed colour of every icon. After: every icon is DBIM Outlined 400 or a library SVG,
  in `#162F6A` or white, at 24 / 32 / 48 — except the items in §4.
- Cleaned SVGs rendered beside the library originals at 56 and 24px, in key colour and white.
- Figma sets rendered through the REST API after the update (27 sets).
- `tsc`, ESLint, Stylelint, `check:icon-scale`, `check:ds-linkage`, `check:type-linkage`,
  `check:raw-button`, `check:link-as`, `check:org-logos`, `check:dangling-vars` — all pass.
- The New design, loaded with `sa-website-design=new`, still downloads Rounded only.

## 29 Sep 2026 — two section glyphs follow the manual's figures

The DBIM 3.0 manual draws the home page's Social Media section and Ministry tiles with
specific glyphs. The bank swap above replaced two of them, so the page no longer matched
the manual. On instruction to follow DBIM strictly, the manual's drawings are restored:

| Where | Bank glyph (28 Sep) | Now | Source |
|---|---|---|---|
| In Social Media heading | Social Media Marketing (megaphone) | globe with a video player | Figure 61 |
| Our Team tile | Groups (three figures) | two figures, "Who's who" | Figure 55 |

Both are the reference template's original paths, set into the 64 × 64 frame with the
§3.4 inset in Figma (Icons & Logos: `Icon/Social Media`, `Icon/Our Team`, all four sizes)
and exported from there as `social-media.svg` and `our-team.svg`. Announcements, Our
Organisation (Divisions) and Our Performance already match Figures 53 and 55.
