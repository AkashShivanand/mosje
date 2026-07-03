# design-qc — audit ruleset (read at the START of every run; evolve it after every run)

This file is the system's memory. Every correction a reviewer makes becomes a permanent rule here so
the same mistake never ships twice. Pair it with `failures.md` (auto-generated assertion misses),
`geometry-and-pins.md` (the pin/crop engine) and `figma-report.md` (the Figma build recipe).

## 0. The two root causes of repeated rework (fix these first)
1. **Hand-authored Figma specs are unreliable.** If you type element coordinates / font-sizes / colours
   into the Figma spec by hand, they WILL be wrong (observed: a heading logged as 20px was really 14px;
   "Need Immediate Help?" logged at y278 was really at y1196 — so its design pin landed at the top of
   the page instead of the bottom). **Always re-extract real geometry from the Figma frames via the
   API** (`get_design_context` / a `use_figma` traversal reading `absoluteBoundingBox`, `fontSize`,
   `fontWeight`, `fontName`, `fills`). Never invent a coordinate or a font value.
2. **Text-matching picks the wrong element.** A sidebar/nav link shares text with a page title. Always
   disambiguate by font-size (largest-font wins for a title) or DOM/ancestor path. A pin on the sidebar
   is this bug, not a rendering bug.

## 1. What to flag — and what NOT to
- **Flag token-level style**: font-size, font-weight, **font-family**, colour, **background**, **border**
  (width/style/colour/radius), **input/action states** (default/hover/focus/disabled), icon style,
  **radio/checkbox control styling**. Catch these — not just size/weight. (Reviewers repeatedly flagged
  missing background/border/input-state findings.)
- **When the design system is NOT wired to the live build, you cannot emit tokens from it — audit these
  VISUALLY** from the screenshots and raise them as findings anyway. "The DS isn't linked" is not a
  reason to skip bg/border/state findings.
- **font-family is a trap via computed CSS.** Both design and live usually report the same requested
  family (e.g. "Noto Sans") because `getComputedStyle` returns the *requested* stack, not what actually
  rendered. If the webfont fails to load, the build silently falls back to a system face. So a
  font-family problem is a **font-LOADING** finding ("Noto Sans requested but not loading, falls back"),
  not a CSS-diff. Phrase it that way.
- **Only VISIBLE Figma layers.** Skip hidden layers, opacity-0 nodes, anything outside the frame, and
  anything whose `absoluteRenderBounds === null`. Do not report a hidden design layer as "missing in
  build."
- **Never diff width/height as a defect.** Layout is responsive; a size delta is a consequence of
  font-size / container / breakpoint, not a fixable fixed-px defect.
- **UI/UX only — NO copy/content suggestions.** Do not propose label/wording/column-name/button-text
  changes; those are data- or content-driven. When you notice a text difference, comment on the
  element's **style** (e.g. text-transform/case, weight, colour), not its words. Examples:
  - "Organization Name is missing" → it's PRESENT but uppercased → flag the **text-case / text-transform
    styling**, not a missing element.
  - "Rename column X to Y" → drop it (copy).
- **Respect the live state before asserting a missing action.** An *approved* (read-only) card should NOT
  have a "Withdraw" button — don't flag it as missing; flag the card's **colour/border/badge styling**
  instead. Check what state the captured screen is in.
- **De-duplicate.** One cross-cutting issue (e.g. tables/filters wrapped in a card, recurring on every
  list view) is ONE finding tagged "recurs across …", not one per screen. Two findings about the same
  masthead line are one.

## 2. Geometry (pins & crops) — never guess a coordinate
- Findings bind to element identity; pins/crops are DERIVED from real element boxes against REAL capture
  dimensions, then ASSERTED inside the crop inside the image. See `geometry-and-pins.md`.
- No hardcoded image heights; read the real PNG dimensions. Crops adapt to content (never uniform bands).
- The design crop and build crop DIFFER (elements sit at different positions) — keep `figmaBox` and
  `liveBox` separate per section; never crop the design image with the live crop box.
- Structural findings anchor to a real labelled element by text (largest-font match), `%` only as fallback.
- Ship only when `failures.md` is empty.

## 3. How to phrase
- **Fixes must be responsive-safe.** Never prescribe a fixed px width/height. Use relative/logical mapping
  (padding, margin, gap, ratios, fractions, min/max, flow-to-container).
- **Humanised, developer-readable language.** State the target AND the current build value plainly:
  "Set X to font-size 28px, weight 500 — the build currently uses 32px / 600."
- **Meaningful titles & sequential pins.** Section/board titles describe the context (not "Global —");
  pins read 1,2,3… top-to-bottom, never grouped out of order.

## 4. Lessons logged from corrections (newest first)
- 2026-06-18 (SCW): re-extract REAL Figma geometry — hand-authored coords/sizes are wrong and produce
  misplaced design pins + wrong values (20px logged for a 14px heading).
- 2026-06-18 (SCW): font-family issues are font-LOADING findings, not computed-CSS diffs (both sides
  report the requested family).
- 2026-06-18 (SCW): audit bg/border/input-state/radio VISUALLY when the DS isn't linked to the build.
- 2026-06-18 (SCW): "missing element" that is actually present with a different text-case → flag the
  text-transform styling, not a missing element.
- 2026-06-18 (SCW): don't flag a Withdraw action missing on an APPROVED (read-only) card — flag its
  styling; check the live state first.
- 2026-06-18 (SCW): skip hidden Figma layers (e.g. an off-state "Continue with DigiLocker") — not gaps.
- 2026-06-18 (SCW): logo container SHAPE is a finding (design rounded-square vs build circle).
- 2026-06-18 (SCW): keep the design crop and build crop separate (`figmaBox` vs `liveBox`).
- 2026-06-18 (SCW): pins kept landing on the sidebar because crops used a guessed height + fixed band and
  text-matching hit the wrong duplicate. Fixed by element-driven crops + assertion gate + largest-font
  disambiguation.
- 2026-06-18 (SCW): stop reporting `text-block width` — responsive, not a defect.
- 2026-06-18 (SCW): drop copy/label-rename findings (column names, button labels) — UI/UX only.
- 2026-06-18 (SCW): 'Forgot Password' sits right-aligned ABOVE the password field (verify in Figma; don't
  assume "under").
- 2026-06-18 (SCW): PIN-code entry should auto-populate State & District (volunteer address row).
