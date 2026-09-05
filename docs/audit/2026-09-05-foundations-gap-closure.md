# Foundations gap closure — 2026-09-05

> Follows `2026-09-04-foundations-audit-and-rebuild.md`. A minute audit of the live Figma
> library against the token source, the shipped CSS and the documentation found the gaps
> below; this document records what was measured, what was changed, and what was decided.
> The report the work started from is the SAMAVESH Foundations Gap Audit artifact of the
> same date; its "253 escaped descriptions" heading is corrected in §1.

## 1. Figma ↔ code parity — five fields, not one

The value checksum in `reference/figma-live.json` hashed `name|mode|value` and was equal in
every collection while four other fields had drifted. Measured live, before the push:

| Field | Drift | Cause |
|---|---|---|
| description | 479 differed after decoding; 248 carried `&#39;`/`&amp;`; 6 double-escaped | **The Plugin API HTML-encodes on write and reads back encoded** — probed: `"a designer's"` reads back `a designer&#39;s` in the same script. Figma's panels render the entity, so a designer sees an apostrophe. The 248 were therefore not a defect; the 6 double-escaped were (an earlier push of already-encoded text), and the 479 were guidance the library predated (Palette's 90 rungs shared one sentence; the Type roles, alpha ladder, chart and layout groups had none or older). |
| codeSyntax.WEB | 5 | two `minHeight` lines kebab-cased (`min-height`) by an older projection; three empty |
| scopes | 138 + 6 | Palette carried `ALL_FILLS`; the six `font/weight/*` rows said FLOAT/`FONT_WEIGHT` over STRING values |
| hiddenFromPublishing | 164 | the exporter hid by SOURCE tier (all 80 `type/*` roles, Tier-1 in the source), the library hid the Palette ramps by hand |

Fixed: `isHiddenName()` hides by library-name tier (`ref/*` and all of Palette); Palette carries
the five explicit colour scopes; weights are STRING/`FONT_STYLE`; a Tier-2 colour referencing a
Tier-2 colour with alpha aliases that variable (`cmp/accessibilityBar/{hoverBg,pillBg}` →
`overlay/brand/*` — the one Color value the library held right and the payload wrong);
`paletteStepGuidance()` gives every rung its own sentence. Pushed: 347 variables corrected in
place, 479 descriptions rewritten, `ref/viewport/desktop-xl` → `desktopXl`. **Gate:**
`collectionFieldChecksums()` + `$fieldChecksums` in the record; the reader decodes entities.

Two variables authored in the library during the audit — `layout/sidebar/collapsedWidth` (88)
and `layout/sidebar/flyoutWidth` (240) — were brought into source; `sidebar.css` binds the
first. Name arrays refreshed for all nine collections (Space, Palette and Color were three
weeks stale, which made the payload's `status` call 104 existing variables new).

## 2. Library styles

- **Effect styles 17 → 7.** Six `Shadows/*` (zero consumers in 83 pages) and five per-tone
  `Focus States/*` removed; `Focus States/Primary` renamed `focus/ring` in place (139 bindings
  kept) and retuned to the code's ring — 2px spread in `focus/ringInner` under 4px in
  `focus/ring`, colours and inner spread bound; 37 Success/Danger/Neutral/Secondary/Warning
  consumers repointed first. `elevation/inset` added as the one INNER_SHADOW. **Downstream
  reasoning:** consuming files keep effect values when a library style is removed (Figma
  detaches, it does not strip); only the style link is lost, on shadows that already disagreed
  with the tokens. The 2026-09-03 note asked for consumer-file evidence the API cannot give.
- **Grid styles 16 → 8.** Bootstrap containers 540/720/960/1140, seven fluid variants and a
  `_deprecated` style removed (one consumer: four Footer frames on 1140, repointed to 1200);
  `Grid/Desktop` (120) and `Grid/Desktop XL` (224) corrected to the 24 rung; `Grid/Desktop Wide`
  (32) and `Container Fixed/1440px` added; all eight bind `grid/columns`, `grid/gutter` and
  the margin rungs.
- Text styles: 38/38 bound. `Body/*-semibold` (≈800 consumers) kept and recorded as role +
  `font/weight/semibold` compositions. `Code/code-1` and `Code/code-2` created (mono, body-2 /
  body-3 metrics, bound).

## 3. Documentation frames

- Four `— Component record` frames built (Typography, Color, Layout Grid, Iconography) to the
  house shape, bound throughout, with SOURCES panels. Three frames renamed to match their
  pages; Brand page reordered Documentation → record → sections.
- Binding audit: Typography 61 unstyled prose texts → styles (Code/label-2); Colour 111 of
  111 literals bound (the six 3px chip radii on the categorical bars snapped to shape/4 — 3 is
  not a rung); Brand 29 of 29 bound (28→24, 10→12 and the hero's 88→80 snaps; the seven
  fractional values were a rescale artefact on the NMBA variant of the org-logo master —
  7.142857 padding and 17.857 gap — bound to padding/8 and inline/16, with no artwork exceeding
  its tile afterwards); Iconography 7 code texts styled. All ten frames now read zero literals.
- Stale facts corrected: Typography `11px` → `12px`; Color tier counts 164/176/296 →
  138/197/296; Motion frame rewritten to the twelve intents (rows added for hover, focus,
  instant, expand, collapse, page, loading); Effects frame to one ring and no retired styles.
- `check:figma-docs` now carries 14 claims on nine foundation frames (66 claims, 167 assertions).
- Web links: `FIGMA_NODES.shape` pointed at a frame id that no longer resolved — now the Radius
  page; Spacing has its own key; Layout Grid, Breakpoints, Sizing and Opacity re-linked.

## 4. Code

- 594 literal `font-weight`s bind `--sa-font-weight-*` (531 CSS, 63 inline TSX). The
  architecture rule and `header.css` said no weight token existed; both corrected. No weight
  changed.
- 32 tokens added (§ commit `tokens(foundations)`), each with a consumer: neutral state fills
  and layers, selected border, two-tone ring, control heights, aspect ratios, icon fill,
  avatar sizes, chip/dialog/tooltip radii, inset elevation. Grammar: states drag/readonly/
  loading, group aspect, components avatar/chip/dialog/tooltip.
- Gates: `check:breakpoints` (off-ladder `@media` literals may only fall; 43 today),
  `check:token-consumers` (zero-consumer Tier-2 tokens per family may only fall; 448 today).

## 5. Decisions recorded

| Decision | Choice | Why |
|---|---|---|
| Palette visibility | hidden whole | Tier 1 by role; consumers see the semantic layer |
| `type/*` visibility | published | a text style binds them and a designer may too; library-name tier decides |
| Empty scopes | allowed on hidden `ref/*` | a primitive that exists to be aliased should sit in no picker; rule §4 updated |
| Focus ring per tone | one ring | code draws one ring colour; a ring is for visibility, not matching |
| `ref/viewport/*` | kept, renamed to grammar | canvas widths bound on 14 documentation frames; recorded as library-only |
| 640px media queries | ratcheted, not changed | changing them is a responsive-behaviour change needing its own visual pass |

## 6. Left open

- `Container Fixed/1200/1320/1440` centred grids bind count and gutter but their column width
  is arithmetic Figma cannot bind.
- Media queries off the ladder (43); `pm-ajay.css`, the `demo/*` folder and the hub's border,
  motion, shadow and opacity literals — counted in the gap audit, ratcheted, not yet migrated.
- Devanagari text styles in Figma (21 would be needed) — recorded on the Typography record.
- Icon FILL/optical axes as Figma-bindable — recorded on the Iconography record.
- The library must be **published** from Figma for consuming files to receive today's changes;
  the Plugin API cannot publish.
