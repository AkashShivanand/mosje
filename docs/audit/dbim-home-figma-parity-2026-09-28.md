# DBIM home — Figma parity and DBIM 3.0 compliance audit (28 Sep 2026)

**Surfaces:** `/website-dbim` (build, `origin/main` at 905ccb5e) against the DBIM handoff file
`xdv8nEd7PhnRhahASd9UPY`: *Home — Desktop 1920* (`74:1150`) and *Home — Mobile 390* (`99:544`).
**Method:** text specs, boxes and bindings were read from Figma through the Plugin API. The build's
computed CSS and boxes were read with Playwright at 1920, 1440 and 390, then compared numerically.
Before and after, the two sides were shown side by side at 3× on icons and small controls.
Separately, the page was checked against `docs/guidelines/DBIM-3.0/DBIM_3.0.md` and axe-core 4.10.2
(WCAG 2.2 AA).

## Result

| | Before | After |
|---|---|---|
| Page size, 1920 (Figma / build) | 4477 / 4445 | **4472 / 4472** |
| Page size, 390 (Figma / build) | 7277 / 7199 | **7333 / 7333** |
| Section tops, 1920 | 5 of 8 differ | all equal |
| Section tops, 390 | 6 of 8 differ | all equal |
| axe WCAG 2.2 AA, 1920 and 390 | target-size ×7 | **0** |

The remaining visible difference is **icon artwork**. Figma already carries the DBIM Visual
Library icons; the build gets them from **PR #610** (`fix/dbim-icon-library`, open and conflicting
with `main`). That PR's running build was checked against this Figma file, and its icons match:
section icons, the Our Team glyph, the filled quote mark, key-colour chevrons, the social-media icon
and the boxed X.

## Parity findings and where each was fixed

Where the Figma recorded a design decision, the build changed. Where the Figma held a
capture artefact, or contradicted a decision already recorded in `BUILD_CONTRACT.md`, the Figma
changed.

| # | Finding | Fixed in | How |
|---|---|---|---|
| P1 | Minister cards were sized by their words (256/264/264), and the last portrait stopped 34px short of the content edge. The handoff draws three 240 cards, flush right, in a 206px frame (muted ground, grey rule, 4px key bar). | Build | `home-top.css`: fixed 240 cards that shrink together; 183 on a phone |
| P2 | Important Links rule was #EBEAEA; the handoff binds `border/grey` #C6C6C6 | Build | `home-mid.css` |
| P3 | Recent Documents' View More was semibold with 8px inset; the handoff draws it like every other View More | Build | `ui.css` |
| P4 | Social-media heading was weight 500; the handoff sets every section heading in one Heading 2 Bold style | Build (+ Figma mobile override) | `ui.css`; §4.3.1 allows either, and one page should use one |
| P5 | Scheme names clamped at 3 lines on a phone ("…and the…"); the handoff shows them whole | Build | `home-mid.css` |
| P6 | Phone rows and tabs: rows had 16px above and below the title, tabs 8px padding. The handoff and the reference's 390 capture have 7px and 12px/21px | Build | `home-mid.css` |
| P7 | About Us copy had an empty 31px (desktop) / 21px (mobile) spacer above it, left where the reference's removed sub-line was | Figma | spacer deleted in both variants |
| P8 | Mobile About band sat on a 31px edge and Recent Documents on 8.5px. Every other band is 16 (Figure 50, one content edge) | Figma | both bands moved to 16 |
| P9 | Search field lost the reference's 3px key-colour bottom rule. A Figma stroke has one colour, and the stroke was also counted twice (49 vs 44px) | Figma | grey 2px sides/top, inner shadow bound to `brand/key` for the bottom, 44px |
| P10 | Row and news-item frames carried a 1px bottom padding *and* a 1px bottom stroke (58 vs 57, 54 vs 53) | Figma | padding removed in the components |
| P11 | Mobile Minister component was fixed at 266px, so each role overlapped the next photograph | Figma | auto-layout, 281 |
| P12 | Mobile PM Quote inner frame was 520 while holding 530 of content | Figma | 532, body 16 under the portrait |
| P13 | Desktop footer links started 5px right of the mobile variant and of the build | Figma | list at −5, as mobile |
| P14 | View More positions and the What's New panel differed by 1px in absolutely positioned panels | Figma | aligned to list + 12 (8 on a phone) |

**Not a defect, deliberately left:** paragraph line breaks differ where the build uses the
estate's `text-wrap: pretty` (`globals.css`). Figma cannot express that. Glyph rasterisation also
differs between Figma and Chrome.

## DBIM 3.0 compliance

The manual's rules for the home page were checked one by one. Items marked **fixed** changed in this
branch, on both sides.

### Fixed here

| Item | Manual | Change |
|---|---|---|
| Footer had no Feedback link | §5.6: the footer "must contain" Feedback (Table 12) | Added to `DBIM_FOOTER_LINKS` and to both Figma footer variants |
| Footer lineage read "This Website belong to Department of Social Justice and Empowerment" | §5.6 ii, a Department: "The website belongs to Department of …, Ministry of …, Government of India" | Wording now follows §5.6 ii, in the build and in Figma |
| Persona dots were 8×8 targets 16px apart | WCAG 2.2 2.5.8, which outranks DBIM | 8px discs inside 24px buttons (discs 16 apart); Figma spacing matched |
| Banner slide dots were 12×12 targets over the banner link (axe: fails; the spacing exception does not apply to overlapping targets) | WCAG 2.2 2.5.8 | 24px hit areas with −6px margins; the drawn tray and 28px pitch are unchanged |

### Open — need a decision or other work

| Sev | Item | Manual | Build now |
|---|---|---|---|
| Blocker | The first 17 Tab stops land in the closed UX4G accessibility panel, off-canvas and before "Skip to main content" | §8.2; WCAG 2.4.3 | Hub root, not the DBIM tree. Make the closed panel `inert` |
| Major | At 1280–1536 (desktop) the mobile type scale is used: H2 20, body 14 | §4.3.1 desktop: H2 24, P1 16 | Transcribed from the reference; the handoff does not draw 1440 |
| Major | PM portrait is a JPEG, not a transparent cut-out | A.4.1.2 iv | `PmQuote.tsx` |
| Major | First banner slide is a committed image, not the CCPS feed, and is past its date | A.4.1.2 ii, §7.4 | needs the CCPS API |
| Major | Campaign video has no captions | A.5.4.2; WCAG 1.2.2 | `Campaigns.tsx` |
| Major | `emblem.svg` 196 KB and `samavesh-logo.svg` 761 KB | §5.5 iv: logos under 100 KB | unoptimised SVGs |
| Major | Sticky cookie bar hides focused controls (1 at 1440, 20+ at 390) | WCAG 2.4.11 | needs `scroll-padding-bottom` or focus handling |
| Major | Colours outside Group 5 + functional palette: #AAAAAA inactive dot (2.3:1), #454545 handle, #000 banner arrows, #150202 used as a fill | §2.1–2.2; 1.4.11 | the grey dot also fails non-text contrast |
| Minor | Icon colour, size and set (key colour, 24/32/48/64, Toolkit glyphs) | §3.4, §3.5, §3.7 | **PR #610** |
| Minor | "Announcements" at weight 900 | §4.1.1 iii | reference value |
| Minor | Footer and tile line heights 1.0–1.1; phone PM quote 2.07 | §4.5 iii: 1.2–1.5 | reference values |
| Minor | No hover change on banner arrows, inactive tabs, partner cards, campaign tiles, footer icons | §4.5 iv | |
| Minor | No infographic section; central posts are static | A.4.1.2 xii–xiii | |
| Minor | Only an opening quote mark; the quote is 13 months old | Figure 54; A.4.1.2 iv | the opening-mark-only rendering was a recorded 28 Sep decision |
| Minor | Feed titles in capitals, and "lnviting … lnterest" spelled with a lowercase L | §4.1.1 ii, §7.1.3 | source data |
| Minor | At 390 the lock-up's Department line (15 bold) is smaller than the Ministry line (20) | §5.2 | |
| Minor | Header is not pinned on a phone | A.4.1.2 i | |
| Nit | Footer and PM band are not on the 120 gutter at 1920 | Figure 50 | |
| Nit | "Explore our Social Media Platforms" (Figure 61: "In Social Media"; "our" not Title Case) | Figure 61 | copy is the Department's |

**Verified compliant:** Colour Group 5 key and shades; footer background is the key colour;
every text/background pair passes AA; Noto Sans throughout; H2 24 / H3 20 / P1 16 at 1920 and
20 / 16 / 14 at 390. Header 1 follows the lock-up order, with one co-brand and the three
controls. Home section order follows Figure 49. The Minister headshots are 1:1, ordered by
seniority and carry alt text. The cookie bar gives accept, decline and customise equal weight. There
is one h1, heading order is correct, `lang="en"` is set, the skip link works, and focus rings are
visible.

## Compliance pass (branch `fix/dbim-home-compliance`)

| Item | Status | Change |
|---|---|---|
| Closed UX4G panel in the Tab order | **Fixed** (estate-wide) | The panel is inert from the moment it exists. An `IntersectionObserver` tracks whether it is on screen, replacing a 6-second poll that gave up on slow loads. `/website` had never recovered. |
| Mobile type scale at 1280–1536 | **Fixed** | Desktop scale (Table 3) from 992px up; Table 4 below it. The nav and View More overrides are removed. |
| Illegal size/weight pairs | **Fixed** | Selected tab, social name → P1 Bold. "View on" link, PM caption → P1 Regular. "Show Latest Posts" → P2 Semi Bold. Footer links → H3 Medium. Announcements → Bold. About copy and footer lineage → P1 Regular. |
| Leading outside 1.2–1.5 | **Fixed** | Footer heading, links and subscribe line; tiles; PM quote on a phone. All now take the role leadings of the Figma styles. |
| Off-palette colours | **Fixed** | Inactive dot → Grey 02, handle → Grey 03, banner arrows and play → key colour. Footer text → Inclusive White. Links → key colour. |
| No hover change | **Fixed** | Banner arrows and play, inactive tabs, partner cards, campaign tiles, footer icons. |
| Phone lock-up hierarchy | **Fixed** | Government and Ministry lines P1 (14); Department H3 Bold (16). |
| Header not pinned on a phone | **Fixed** | The search and menu row stays pinned; the offset is measured. |
| Footer and PM Quote off the page edge | **Fixed** | Both on `--db-gutter` (120 at 1920). |
| Cookie bar hides focus (2.4.11) | **Fixed** | The page reserves the bar's height as `scroll-padding-bottom` while the bar is shown. |
| PM portrait not transparent | **Kept, by decision** | The original photograph stays (instruction of 28 Sep 2026); the only transparent cut-out on file is a different photograph. |
| "Explore our Social Media Platforms" | **Fixed** | "In Social Media" (Figure 61), on the DBIM design only. |
| All-caps feed titles, "lnviting / lnterest" | **Fixed on display** | `dbimFeedTitle`: Title Case for titles ≥80% capitals, acronyms kept, the ln→In typo repaired. The Department's data is unchanged. |
| Logo files over 100 KB | **Fixed** | Emblem: path data rewritten as relative coordinates on a 0.01-unit grid, 196 → 89.5 KB; at 10× it differs from the original on 53 edge pixels of 176,641. SAMAVESH: the header takes a 174px PNG (8 KB), 3× its 58px display. The 761 KB vector is traced artwork that no grid gets under 100 KB, and the other surfaces keep it. |
| Stale first banner slide | **Kept, by decision** | The prototype's CCPS slide is a mock (below). |
| Campaign video captions | **Open, by decision** | Player kept; no transcript exists. |
| CCPS banner and posts feed | **Mocked, by decision** (28 Sep 2026) | The prototype mocks CCPS; the real API belongs to the live production website only. |
| Newer PM quote | **Open** | Needs the Department's material. |
| Infographic section | **Fixed upstream** | PR #613 put the SETU infographic in the posts row. |
