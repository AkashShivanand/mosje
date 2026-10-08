# MoSJE Website DBIM DS (Figma) — DBIM 3.0 conformance audit

**File:** `xdv8nEd7PhnRhahASd9UPY` — MoSJE Website DBIM DS · **Read:** 5 Oct 2026 · **Mode:** audit only, nothing in the file was changed.
**Against:** `docs/guidelines/DBIM-3.0/DBIM_3.0.pdf` — §2 Colours, §3 Icons, §4 Typography, §4.5 CTA buttons, §5.3/5.6 logo and footer. Figure-only values (Fig 8/9 icon sizes, Fig 15 weights, Fig 16/17 text colour, Fig 19 button states) were read from the PDF pages, not the transcription.
**Method:** every variable, style and master component was read through the Plugin API. All 24 pages were scanned for colours outside the 42 DBIM hexes, fonts other than Noto Sans, sizes off the type scale, and text with no style.

Link pattern for node IDs below: `https://www.figma.com/design/xdv8nEd7PhnRhahASd9UPY/?node-id=<id with - for :>`

## Outcome — fixes applied in Figma, 5 Oct 2026

Before/after pictures: `docs/design-handoffs/before-after-dbim-ds-defects-2026-10-05.html`.

| # | Outcome |
|---|---|
| D1 | **Fixed.** The `date`/`type` labels use `Small/small-1-regular` (Noto Sans). Inter now appears **0** times in the file. |
| D2 | **Fixed.** Remapped the one remaining override (the back link, to P1 Regular), then deleted the three styles at zero consumers. 29 text styles remain. |
| D3 | **Fixed.** `Text Link` Size=Heading 3 → `heading-3-medium`, Size=Heading 2 → `heading-2-medium`. The underline tracks the wider text. The footer re-wraps nowhere. |
| D4 | **Fixed.** Persona Tile text is bound to `text/default`. |
| D5 | **Partly a false positive.** The header search shadow was already bound to `brand/1`; this audit had checked only for an effect *style*. The Switch focus variants now use `Focus/Ring`. |
| D6 | **Fixed.** `brand/3–5` no longer carry `TEXT_FILL`. |
| D7 / D7b | **Fixed.** All 80 icons are rescaled about the frame centre so the padding is 2px at every size: max glyph 20 / 28 / 44 / 60. Arrow Back is mirrored, so its glyph needed its position corrected separately. |
| D8 | **Fixed** for both styles named here: the PM Quote citation is now P1 Regular and the minister office bars P1 Bold, both sentence case. **Not changed:** the designations inside the Our Team photo cards ("UNION MINISTER OF SOCIAL JUSTICE AND EMPOWERMENT") use `small-1-semibold-uppercase` at 6–7 words. Whether that counts as a "long sentence" under §4.1.1 ii is the owner's call. |
| D9 | **Fixed.** Lightbox dialog → `overlay/scrim`. |
| D10 | **False positive, withdrawn.** Hover carries an underline and Visited does not, so the two states are distinct. |

### Second pass — missing scripts and extras (5 Oct 2026)

Before/after pictures: `docs/design-handoffs/before-after-dbim-ds-scripts-and-greys-2026-10-05.html`.

| # | Outcome |
|---|---|
| M1 | **Added** `type/script/{bengali, gujarati, gurmukhi, kannada, malayalam, oriya, tamil, telugu}` (FONT_FAMILY scope), giving all 9 scripts of Table 2. Typography §01 gains a **Table 2 specimen card**, each sample bound to its variable. Noto Sans Gurmukhi and Noto Sans Oriya are not in Figma's font library, so their cells name the family for code instead of drawing it. |
| M2, M3 | Left as is: both are optional in the manual ("may", "in addition"). |
| X1 | **Trimmed** 3 unused styles (`paragraph-1-bold-uppercase`, `paragraph-1-regular-uppercase`, `paragraph-2-bold-uppercase`) plus the duplicate `Label/button`, whose 15 uses moved to the identical `paragraph-2-semibold-uppercase`. That style was kept rather than `Label/button` because its uses include non-button labels ("Designation") and its name follows the DBIM scale. 29 → **25** text styles (after the recreation below). |
| X1 — caution | `small-1-regular-underline` was also deleted as "unused" and then **recreated**: `getStyleConsumersAsync` does not report instance overrides, and 8 Vacancy Card links on Templates Desktop used it that way. Before deleting a style, scan every page's text for its id; don't trust the consumer list. |
| X2 | **Kept and extended** on the Department's instruction. Grey 03 now also carries card descriptions, vacancy dates, event date/location lines, the minister designation and the search placeholder. Every one sits on `bg/page` (white), so all are 6.29:1 in every colour group. |
| X3–X6 | **Kept, recorded** in each variable's and effect style's description, and in `docs/guidelines/README.md` → divergence 13. |
| X7 | **Removed** the Nav Dropdown background blur. Its 70 % black fill becomes an opaque **Grey 03** surface (`bg/neutral/strong`, new); white text reads 6.29:1. |
| Specimens | Scaled documentation copies freeze their text properties. The PM Quote specimens on Home Sections were set back to sentence case by hand; the footer specimens already showed Medium. |

### Third pass — dates in Figma, and the code synced to the file (5 Oct 2026)

Before/after pictures: `docs/design-handoffs/before-after-dbim-mode-sync-2026-10-05.html`.

**Dates.** DBIM §A.5.6 viii fixes only that the day comes first; the Department chose **DD MMM YYYY** ("05 Oct 2026"). In Figma, every date on every page — about 800, in DD.MM.YYYY, DD/MM/YYYY and "9 September 2026" forms, plus the "DD.MM.YYYY" placeholders — was rewritten in place, preserving each run's styling. A date that sat in an all-caps style moved to its sentence-case sibling, so no date renders as "16 SEP 2026". In code, `lib/website-dbim/date.ts` is the one formatter, applied at render time so the shared content records stay as published; the three `dottedDate` helpers and the "/" vs "." separator plumbing are gone. Not changed: Figma's Document Row prints a full date under a "Published Year" label, where the code prints the year alone. That mismatch predates this pass.

**Tokens (`dbim-brand-modes.mjs`, all six DBIM modes).** Shade 1 at rest and shade 2 on hover for the filled button, links, brand icons, selected borders and the focus ring. The grey ladder snaps to published greys (25 → white, 50 → Linen, 700 → Grey 03, 800–950 → the ink). Secondary text is Grey 03. 184/184 token tests pass, and the visual-contract fixture was regenerated on purpose: every listed change is a DBIM-mode change, and none is in blue or navy. A token that gains DBIM values now also pins navy's own value: without that, `border.neutral.selected` handed navy the blue default.

**DBIM components.** Menu, PM Quote, office bars, minister role, card description, event and vacancy dates, placeholders, persona sentence, tabs, rich-text H2 and link resting colours now follow the Figma file. See the changelog entry `pending/dbim-mode-figma-sync.json` for the list.

**Fonts.** All nine §4.2 scripts load through next/font with `preload: false`. Measured in Chromium: an English page downloads the same 4 font files as before, and adding Bengali text loads Noto Sans Bengali. Before, it fell to the system font.

**Left as is, deliberately.** The modal scrim stays tinted with the ink, not pure black (a ΔE of about 4 at 48%, recorded in `brand-ramps.mjs`). Status text stays on the darker rungs the code picks for AA on tonal grounds. The 16/20px inline icons stay, already recorded as divergence 11.

Still open, outside the D list: rich-text bold lead-ins on the Offerings scheme pages (33 segments) and the search-suggestion highlights carry no text style. They are Noto Sans at sizes on the scale. M1–M3 and X1–X7 await decisions.

---

## Verdict

**The foundations match the manual exactly. Ten defects remain in the components and styles that use them, and three of those reach every screen.**

| Area | Manual defines | In the file | Result |
|---|---|---|---|
| Primary palette §2.1 | 6 groups × 5 variants = 30 hexes | 30 hexes, all exact (`DBIM Primitives` › `ref/<group>/1–5`) | ✅ exact |
| Select one group §2.1 i | one group per platform | `DBIM Colour` collection, one mode per group (Blue, Burgundy, Purple, Green, Chrome Yellow, Cinnamon Red) | ✅ |
| Functional palette §2.2 | 12 hexes | 12 hexes, all exact, including Deep Blue `#1D0A69` | ✅ exact |
| Typeface §4.1 | Noto Sans | `type/family` = Noto Sans | ✅ (one component breaks it, D1) |
| Weights Fig 15 | Regular, Medium, Semi Bold, Bold | `type/weight/regular` 400 · medium 500 · semibold 600 · bold 700 | ✅ exact |
| Desktop scale Table 3 | 36 / 24 / 20 / 16 / 14 / 12 | `DBIM Viewport` › Desktop | ✅ exact |
| Mobile scale Table 4 | 24 / 20 / 16 / 14 / 12 / 10 | `DBIM Viewport` › Mobile | ✅ exact |
| Size × weight pairs, Tables 3–4 | 16 allowed pairs | all 16 present as styles | ✅ all present (plus 3 that are not allowed, D2) |
| Line height §4.5 iii | 1.2–1.5 × size | 1.22–1.50 at every step, both viewports | ✅ |
| Icon sizes §3.4 | 24 / 32 / 48 / 64 incl. 2px padding | 80 icon sets × exactly those 4 sizes | ✅ sizes (padding: D7) |
| Icon colour §3.7 iii | key colour (v1) or white | every icon bound to `icon/brand` (v1) or `icon/ondark` (white) | ✅ |
| Footer §5.6 | darkest shade of the group | `bg/footer` → v1 | ✅ |
| Emblem §2.2 / §5.3 | black on light, white on dark | `logo/onlight` → Black, `logo/ondark` → White | ✅ |
| Status colours §2.2 | success / warning / error / info | `status/*` → the four functional hexes; warning has no text scope (1.6:1 on white) | ✅ |
| CTA buttons §4.5 i, Fig 18/19 | uniform padding, one size, enabled / hover / focus / disabled | `Button`: 3 types × Default / Hover / Focus / Disabled (+ Pressed), all 184×40, padding 16/8 | ✅ |
| Hyperlink §2.2 | key colour, and Blue `#0D6EFD` allowed in addition | `text/link/default` → v1 | ✅ |

---

## D — Defects: the file contradicts the manual (fix these)

| # | Where | What is wrong | Manual | Fix |
|---|---|---|---|---|
| **D1** | `Document Row (Ministry)` — the `date` and `type` text, both variants (`422:1021`, `422:1026`) | Set in **Inter** Regular 12, no text style, auto line height. Reaches **216 text nodes** across the screen and template pages through instances. | §4.1 Noto Sans only; §4.5 iii line height | Apply `Small/small-1-regular`. One master edit fixes all 216. |
| **D2** | Text styles `Heading/heading-3-regular`, `Heading/heading-3-regular-underline`, `Paragraph/paragraph-1-semibold` | Weight pairs the manual does not allow: H3 is Bold / Semi Bold / Medium only; P1 is Bold / Regular only. Their weight is not bound to a variable (3 of 4 bindings), and their descriptions are wrong — the two H3 styles say "Medium", the P1 style says "Regular". | Table 3, Table 4 | Delete the three styles; repoint uses (D3) to `heading-3-medium` and `paragraph-1-regular` / `-bold`. |
| **D3** | `Text Link` set, `Size=Heading 3` and `Size=Heading 2` | H3 links use `heading-3-regular` (D2). H2 links are **unstyled Regular 24/32** (20 on mobile). Text Link is nested in the **Footer**, so **546 footer and menu labels** on the templates and screens render H3 Regular, plus every H2-size link. | Table 3: H2 and H3 are Bold / Semi Bold / Medium | `Size=Heading 3` → `heading-3-medium`; `Size=Heading 2` → `heading-2-medium` (or semibold). |
| **D4** | `Persona Tile` — the "Learn more about the Scholarships…" text, all 6 variants (e.g. `74:41`) | Raw **`#000000`**, not bound | §2.2: Black is the emblem colour; text on light backgrounds is Deep Earthy Brown | Bind to `text/default`. |
| **D5** | `Header` search field `db-search` (`46:272`, `60:219`); `Switch` focus variants (`302:46846`, `302:46854`) | Focus and inner shadows typed as literal **`#162F6A`** instead of the `Focus/Ring` style or `border/focus/default`. In every mode except Blue they stay blue. | §2.1 i: one colour group used consistently | Apply `Focus/Ring`, or bind the shadow colour to `border/focus/default`. |
| **D6** | Variables `brand/3`, `brand/4`, `brand/5` | Carry the `TEXT_FILL` scope, so the colour picker offers v3–v5 as **text** colours. | Fig 17: text is shade 1 or 2 (or white on v1/v2); no text of any colour on v3 | Remove `TEXT_FILL` from `brand/3–5`. Nothing in the file currently uses them as text, so this only closes the door. |
| **D7** | 6 icons: `Icon/File Copy`, `Visibility`, `Warning`, `Hide Image`, `School`, `Temple Buddhist` | At 24 and 32px the glyph runs into the 2px padding: 22.0px glyph in a 20px live area at 24. | §3.4 Fig 8/9: live area = size − 4 | Shrink these six to fit 20 / 28 / 44 / 60. |
| **D7b** | All 80 icons at 32 / 48 / 64 | Glyphs are scaled up from the 24 grid, so the padding grows (2.65 / 3.98 / 5.30px) instead of staying 2px. Largest glyph at 64 is 58.7px; the manual's live area is 60. | Fig 9: padding is 2px at every size | Low impact. Note it as a deviation, or redraw on 28 / 44 / 60 live areas. |
| **D8** | `Paragraph/paragraph-1-regular-uppercase` used on the **PM Quote** citation (60 characters); `paragraph-1-bold-uppercase` on minister designations (54 characters) | All-caps set on sentence-length text | §4.1.1 ii: no all-caps for long sentences | Use sentence case. Keep uppercase for labels of 1–3 words only. |
| **D9** | `Lightbox` dialog (`Breakpoint × Type`, 4 variants) | Background bound **directly to the primitive** `ref/functional/black`, bypassing the semantic layer | §2.2: Black is for the emblem only | Bind to `overlay/scrim`. Changes nothing visually; puts the colour in a role the manual allows (§3.7 v overlay). |
| **D10** | `Text Link` states; `bg/interactive/*` | `text/link/visited` = `text/link/hover` (both v2). `bg/interactive/pressed` = `bg/interactive/hover` (both v4). Two states the reader cannot tell apart. | §4.5 i: distinct styles per state; §4.5 iv: noticeable hover change | Give visited its own treatment (e.g. v2 without the hover underline). Pressed can stay as is: the stroke distinguishes it. |

## M — Missing: the manual defines it, the file does not have it

| # | Manual | Gap | Recommendation |
|---|---|---|---|
| **M1** | §4.2: Noto Sans for **all 9 scripts** | Only Devanagari exists (`type/script/devanagari` + one style). Bengali, Gujarati, Gurmukhi, Kannada, Malayalam, Odia, Tamil and Telugu have no family token. | Add the 8 `type/script/*` STRING variables. Add styles only when a screen needs one. |
| **M2** | §2.1 vi: gradients of any two variants of the selected group | No gradient style. The only gradient in the file, on `Social Feed Card › db-hb-feed__cta`, runs white to white — fully opaque at both ends, so it draws nothing. | Optional ("may"). If one is wanted, add a single style between two `brand/*` variants. Fix or remove the CTA's gradient. |
| **M3** | §2.2: Blue `#0D6EFD` as hyperlink colour "in addition to" the key colour | Present as `status/info` only, with no link role | Optional. Add nothing unless a design calls for it. |

## X — Extras: in the file, not defined by the manual

You asked for nothing beyond the manual. Each extra below gets a recommendation: delete it, or keep it and record it as a divergence in `docs/guidelines/README.md`. The manual is silent on spacing, radius, elevation and grid, and 600+ components depend on those values, so deleting them would break the library rather than make it compliant.

| # | Extra | Count | Recommendation |
|---|---|---|---|
| X1 | Decorated text styles: 9 uppercase (`*-uppercase`, plus `Label/button`) and 4 underline. `Label/button` is an **exact duplicate** of `paragraph-2-semibold-uppercase`. | 13 | **Trim.** Keep `Label/button` (Fig 18/19 draws button labels in capitals), `small-1-semibold-uppercase` (eyebrows) and the underline link styles. Delete `paragraph-2-semibold-uppercase` (duplicate), `paragraph-1-regular-uppercase` (D8), and any other uppercase style with no use. Usage counts are in the scan. |
| X2 | Grey roles for text: `text/secondary` and `text/placeholder` → Grey 03 `#606060` (6.29:1 on white, 5.24:1 on Linen) | ~250 uses | **Decide.** The manual names the greys but gives them no use, and §4.4 / Fig 16 show only Deep Earthy Brown or the key colour as text on light grounds. Strict reading: move secondary text to `text/default`. Pragmatic reading: keep it and record the divergence. It passes AA either way. |
| X3 | Grey borders: `border/default` → Grey 01 (1.71:1), `border/strong` → Grey 02 (3.28:1); `bg/inactive` → Grey 02 | — | **Keep, record.** The manual lists Linen for outlines. Grey 02 is what lets form controls meet WCAG 1.4.11's 3:1, which quality requires. Grey 01 should not be the only boundary of a control. |
| X4 | Disabled roles: `text/disabled`, `icon/disabled` (Grey 02), `bg/disabled` (Linen) | — | **Keep.** Fig 19 draws the disabled button in grey, so §3.7's "key colour or white" does not reach disabled icons. Cite Fig 19 in the variable descriptions. |
| X5 | `DBIM Foundations`: space (17), radius (12), stroke (4); `DBIM Viewport` › `layout/gutter` 120 / 16 | 34 | **Keep, record** as house values where DBIM is silent. |
| X6 | Effect styles `Elevation/1–3`, black at 6–15% alpha | 3 | **Keep, record.** The manual defines no shadows. |
| X7 | `Nav Dropdown` background blur (r5) | 1 | Remove. The manual gives no basis for it, and it is unbound. |

## Not defects (checked and excluded)

- **Fractional font sizes** on the component pages (6.6–22.2px): every one sits inside a documentation specimen, i.e. an instance scaled 0.47–0.97× to fit its frame. No master carries an off-scale size.
- **Off-palette hexes in logos**: Digital India, india.gov.in and SAMAVESH artwork keep their own colours, as third-party marks must.
- **`#E3E3E3`** is the background of the canvas sections on the template pages, not part of any design.
- **The 28px text** is a note inside `Old Screens — Do Not Use`.
- **Grey disabled icons**: sanctioned by Fig 19 (X4).

## Caveat the manual creates for itself

In the **Green** mode, white text on v2 `#2D8686` measures **4.32:1**, below AA for 14px text. Fig 17 marks that pair as correct, but `Button / Filled / Hover` would fail. Blue, the Department's group, passes at 7.98:1. If Green is ever selected, Filled-hover text must move to v1.

## Fix order

1. **D1, D3** — one master edit each, and together they correct 760+ text nodes on the screens.
2. **D2** — delete the three illegal styles once D3 no longer uses them.
3. **D4, D5, D9** — bindings only, with no visual change in Blue.
4. **D6** — scope change.
5. **D7, D8, D10** — design decisions for the owner.
6. **X1–X7, M1** — trim, or record each in `docs/guidelines/README.md` → "Known, deliberate divergences".

Per the standing instruction that Figma is the source of truth for screens, these fixes are made in the Figma file first. The code's `dbim` brand mode then follows.
