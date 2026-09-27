# The library-linkage sweep — 22 September 2026

A `/design-system audit` scored the estate 69/100. The code half was healthy and every
gate green; the Figma half was not. This records what the sweep changed, what it
deliberately did not, and the decisions a reader will otherwise have to re-derive.

## What the audit found, and what is left

| Finding | Audit | After the sweep | Note |
|---|---|---|---|
| Component bindings to ANOTHER library's variables | 320 | 12 | The 12 are `type/label/tracking` overrides on Page Header documentation frames, not masters |
| Instances of components from another file | 976 | 0 | The SAMAVESH seal stays remote by `ds-documentation-standard.md` §5 |
| Instances of GHOST components (master deleted) | not measured | 0 in masters | 199 in the date picker alone; `search`/`mic` became the library `Icon` |
| Live components using a DEPRECATED master | not measured | 0 | Pagination's dropdown was built from the retired `Dropdown / MenuItem` |
| Raw palette / `ref/*` bindings | 6,338 | ~680 | ~520 of those are palette rungs the CODE also consumes (below) |
| Unlinked colours | 1,025 | ~65 | The rest is artwork, icon bounding boxes and colour-picker swatches |
| Text with no style | 43 | ~48 measured differently | The sweep restyled ~250 text layers; what remains is listed below |
| Non-Noto fonts in masters | not measured | 0 in the pages swept | Roboto, Inter and Druk Wide Trial were all found — see below |

## The decisions

**Another library's look-alike names.** `Text/Dark #1F2428`, `Stroke/200 #E2E6EA`,
`Primary/Source #0373DF`, `Neutral/50`, `Neutral/0 - White`, `Text/Light`, `Text/Primary`
came from `MoSJE + UX4G DS`. Each was mapped to the SAMAVESH token for its ROLE — text,
border, icon or background — not to whatever had the same hex. That is why a few values
moved by a shade: `#1F2428 → #1E2124`, `#E2E6EA → #DCDEE1`. CLAUDE.md names this family
as the near-miss that "looks right and drifts from the estate by a shade nobody can name".

**Other-file parts were DETACHED, not swapped.** Accordion, Color Picker, the date
picker, Tooltip, Card, Comment, Empty State, Page Header, Chip, Input Field, Input Area,
Pagination and Avatar were built from another library's `input`, `button`,
`layout-blocks` and `text` components. No local component shares their names, so swapping
would have meant rebuilding each part. Detaching keeps the drawing identical and cuts the
dependency; the detached layers were then bound to SAMAVESH tokens and restyled.

**Detaching exposed the fonts.** The parts that came from outside were set in **Roboto**
(~220 layers), **Inter** (Pagination, Progress) and the India map's watermark in **Druk
Wide Trial** — a font that is not installed, so Figma refused to edit those text nodes at
all; they were replaced with identical Noto Sans Display layers, centred on the originals.
Every text layer was mapped to the library style with the same size and weight. Roboto
Medium 16 has no counterpart (the ramp has no Medium at 16) and took `Title/title-2`.

**Figma was aligned to CODE where the two disagreed:**

| Component | Figma had | Code has (now both) |
|---|---|---|
| Button / IconButton hover, pressed, focus grounds | transparent tints 8% / 16% | `cmp/action/*/{secondary,tertiary}/{hover,active}/bg` — the opaque 50 / 100 rungs |
| Input Area warning border | `warningScale/500` | `border/status/warning/base` (600) |
| Modal panel | a 1px `#CED4DA` border | no border; `elevation/toast` |
| Modal backdrop | black at 50% layer opacity | `overlay/neutral/boldest` |
| Card, elevated | a raw shadow | `elevation/modal` |
| Portal Card | raw shadows | `elevation/card` |
| Accordion, Pagination borders | `neutralScale/300` | `border/neutral/subtle` |
| Date picker field border | `neutralScale/400` | `border/neutral/bolder/default` |
| Table header ink | `primaryScale/900` | `text/brand/primary/base` |

**Palette rungs that were LEFT, because the code consumes the same rung.** Changing only
Figma would have created the drift this sweep exists to remove:
`color/secondaryScale/{400,500,600}` (Portal Card's saffron rule, code, and the login
hero disc), `color/transparent/secondary/8` (the portal list's ground),
`color/transparent/white/48` (Ticker's marker dot), `color/transparent/primary/48` (the
map outline). A semantic saffron family (`text|border/brand/secondary/*`) would need
colour-mode and theme variants and new contrast pairs — a token-design decision, recorded
here rather than improvised.

**`ref/opacity/*` was left** on 16 chart and map layers: there is no semantic opacity
tier in either the tokens or the library, so those bindings are already on the only token
that exists.

## The archive

`Archive — Deprecated` (new page, last in the file) holds the 24 retired masters that were
sitting on live component pages — TimePicker, RangeSlider, the old Dropdown and MenuItem,
the legacy Tabs trio, the Feedback Widget set, the old popover, List and List/Item, and
nine Carousel slide/control masters. They are sectioned by the page they came from and
keep the ⛔ marker; the `[Deprecated]` prefix on the Tabs sets was renamed to match.
The page is recorded as scaffolding in `tools/figma-index-parity/index.json`
(`pageExclusionRules.special`) because it holds nothing a designer may place.

## Second pass — the whole file, not just the masters (same day)

The first pass looked inside component masters. The second looked at every node on every
page, documentation frames and specimens included:

- **The Get Started and New in 2.0 "UX4G Theme Craft" illustration** still bound UX4G's
  violet primary (`#613AF5`, `Primary/50–900`) and lavender secondary from the old library
  — the palette CLAUDE.md says this estate does not adopt. Its swatches now bind SAMAVESH's
  `color/primaryScale/*` and `color/secondaryScale/*` and its hex labels read `#0373DF` and
  `#E1560F`. It is a picture of a palette, so the palette tier is the right binding.
- **Iconography's "Bespoke marks" documentation** spacing, hairlines and hint text moved from
  the old library's `spacing-*`, `Stroke/100`, `Text/Hint` to SAMAVESH tokens.
- **Cursor page** — its 42 cursors were instances from another file; detached, same pixels.
- **Thumbnail** — a ghost `horizontal-nav-item` and 347 nested other-file parts detached.
- **Archive — Deprecated** — 982 other-file and ghost instances inside the retired masters
  detached, so the archive depends on nothing outside the file; a `watch_later` glyph now
  uses the library `Icon`.
- **Feedback Widget** — the two 1440px usage mock-ups of the retired widget moved into the
  archive beside the masters they showed.
- **Date picker** — the "Today" footer, the Ok / Month / Year / Button Title actions and the
  year/month triggers were hand-drawn copies exposed by detaching; all are library `Button`s.

**Left, by decision:** the SAMAVESH seal (remote by rule), the AI-icon artwork in Search and
Thumbnail (a deleted master with no library equivalent), one ghost image slot deep inside
the retired List item, and the `New in 2.0` change log's picture of the retired Feedback
Widget modal, which records what was added at the time and is history rather than use.

## Page names

Eight pages were renamed to the singular, and their Index cards with them: Avatars →
Avatar, Badges → Badge, Chips → Chip, Breadcrumbs → Breadcrumb, Tables → Table,
Charts & Graphs → Chart, Alerts/Toasts → Alert & Toast, Progress Indicators →
Progress Indicator. The Index stat line was recounted from the file: **97 pages · 209
components**, 24 of which now sit in the archive.

## Still open

- **Publish the library.** Everything here is in the file; consumers see it only after a
  Figma publish, which is a human step. `tools/design-parity/figma-components.json` is
  regenerated from the PUBLISHED listing, so the parity ledger is stale until then.
- **The AI icon** (Search, 8 instances) is a ghost master with no library equivalent, kept
  as artwork.
- **Progress's numerals** (30/36/48) and the map's watermark (93) have no text style at
  those sizes; the Display tier starts at 40.
- **Toggle's handle ring**, the date picker's inner shadows and two Table row shadows have
  no matching effect style.
- **41 designed-but-unbuilt and 124 built-but-undesigned components** remain the real
  parity backlog (`docs/design-system/parity-ledger.md`).
