# design-qc — audit ruleset (read at the start of every run; evolve it after every run)

This file is the system's memory. Every correction the team makes becomes a permanent rule here so
the same mistake never ships twice. Pair it with `failures.md` (auto-generated assertion misses).

## Geometry (pins & crops) — never guess a coordinate
- **Findings bind to identity, not pixels.** Each finding carries the real element box (Figma node /
  live DOM rect). Pins and crops are *derived* from those boxes, never hand-placed.
- **No hardcoded image heights or fixed bands.** Read the real capture dimensions; clamp to them.
- **Crops adapt to content.** A crop is the full-width band around the union of its section's element
  boxes + padding — it always contains every pin it carries. Crops are NOT uniform-sized.
- **Assert before shipping.** Every pin must fall inside its element box, inside the crop, inside the
  capture. Misses are logged to `failures.md` — a wrong match or a too-short capture, fix it, don't ship.
- **Structural findings anchor to a real labelled element by text** (largest-font match wins, so a page
  title beats a same-text sidebar link). Hand `%` is a last-resort fallback only.
- **Wide (container) boxes bias the pin toward the text start**, not the geometric centre.

## What to flag
- Token-level properties only where they are fixed: font-size, font-weight, **font-family**, colour,
  background, border (width/style/colour/radius), input/action **states** (default/hover/focus/disabled),
  icon style. Catch these — not just size/weight.
- **Only VISIBLE Figma layers.** Ignore hidden layers, opacity-0 nodes, and anything outside the frame.
- **Never diff width/height as a defect.** Layout is responsive; a size delta is a consequence, not a fix.

## How to phrase
- **Fixes must be responsive-safe.** Never prescribe a fixed px width/height. Use relative/logical mapping
  (padding, margin, gap, ratios, fractions, min/max, flow-to-container).
- **Humanised, developer-readable language.** State the target and the current build value plainly.
- **UI/UX only — no copy suggestions.** Don't propose label/wording/column-name changes; those are data-
  or content-driven. Comment on the *style* of an element, not its text.
- **Meaningful titles & sequential pins.** Section/board titles describe the context; pins read 1,2,3…
  top-to-bottom, never grouped out of order.

## Lessons logged from corrections (newest first)
- 2026-06-18 (SCW): pins kept landing on the sidebar / blank areas because crops used a guessed height
  and a fixed band. Root cause was geometry, compounded by text-match collisions (sidebar link vs page
  title). Fixed by element-driven crops + assertion gate + largest-font anchor disambiguation.
- 2026-06-18 (SCW): stop reporting `text-block width` — responsive, not a defect.
- 2026-06-18 (SCW): drop copy/label-rename findings (column names, button labels) — UI/UX only.
- 2026-06-18 (SCW): table + filter "card wrapper" is one cross-cutting finding, not per-screen noise.
- 2026-06-18 (SCW): 'Forgot Password' sits right-aligned ABOVE the password field (verify in Figma,
  don't assume "under").
- 2026-06-18 (SCW): PIN-code entry should auto-populate State & District (volunteer address row).
