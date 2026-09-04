# Typography — register of deviations from DBIM 3.0, GIGW 3.0 and UX4G 3.0

> Kept under `.claude/rules/standards-precedence.md` §4: *"If it genuinely conflicts,
> quality wins — and you write down why."* Every row is a decision, recorded on the day it
> was taken, with the clause it departs from and the reason. A row that stops being true is
> deleted, not left to rot. Opened 2026-09-04 with the typography re-cut; before that the
> estate departed from all four clauses below and recorded none of them.

| # | Clause | The standard says | SAMAVESH does | Why quality wins | Decided |
|---|---|---|---|---|---|
| T1 | DBIM 3.0 §4, desktop heading sizes | H1 36 · H2 24 · H3 20 px | headline-1 40 · headline-2 32 · headline-3 28 (website); 32 · 28 · 24 (portal) | DBIM's three sizes are a *minimum hierarchy* for a content page, published as an illustration ("the most common font sizes used"), not an exclusive list. A 36 → 24 jump leaves no room for the two intermediate heading levels a long government page needs (an h2 and an h3 that are visibly different from each other and from the page title), and 20px for an h3 sits below the estate's 22px card title. The estate keeps DBIM's three sizes on the ramp — 36 is display-2's phone bound and the DBIM H1 is one step from headline-1 — and adds the steps a six-level outline needs. The portal ramp's 32 · 28 · 24 is one step from DBIM's ladder at every level. | 2026-09-04 |
| T2 | DBIM 3.0 §4, mobile heading sizes | H1 24 · H2 20 · H3 16 px | headline-1 28 · headline-2 24 · headline-3 22 (website, at 360px); 24 · 20 · 18 (portal) | The portal ramp *is* DBIM's mobile ladder at H1 and H2 and one step above it at H3, because 16px is the body size and an h3 the same size as its paragraph is a heading in weight only. The website keeps one step more at each level for the same reason DBIM's own §7 gives — "text should remain legible on smaller screens by adjusting font sizes" — and reaches DBIM's 24 at display-6. | 2026-09-04 |
| T3 | DBIM 3.0 §4 iii, line height | 1.2 to 1.5 × the type size | Display roles 1.10–1.20 (website) and 1.14–1.33 (portal); everything else 1.20–1.50 | Followed for every reading and structural role — headline, title, body and label are all inside the band, asserted by `packages/tokens/test/type-scale.test.mjs`. Display is the recorded exception: at 40–80px on the Display cut, 1.2 leading opens a two-line hero into a stack of separate lines, and every mature scale sets large display type tighter (Material 3 display-large 57/64 = 1.12; Apple Large Title 34/41 = 1.21; GOV.UK 48/50 = 1.04). The display ramp still rises monotonically from 1.10 at 80px to 1.20 at 40px, so the smallest display size meets the band exactly. | 2026-09-04 |
| T4 | UX4G 3.0 §2, minimum size | Body/XS at 12px is "the minimum usable size" | Adopted: nothing renders below 12px; label-3 moved from 11 to 12 | Not a deviation — recorded because the estate's own contract said 11px until this date and shipped 9 and 10. `type-scale.test.mjs` asserts the floor on every role; the type gate reports any literal below it. | 2026-09-04 |
| T5 | UX4G 3.0 §2, Body/L at 18px | An 18px reading size for long-form instructions | No 18px body role; long-form reading is body-1 at 16/24 with the measure capped at 36rem (≈68 characters) | 18px body inside a 16px system creates a second reading size that pages mix freely (the audit found `text-lg` on 40 lead paragraphs beside 16px bodies). Reading comfort comes from the measure and the 1.5 leading, both of which body-1 has; 18 stays on the ramp for title-1's phone bound and headline-5's portal size. | 2026-09-04 |
| T6 | UX4G 3.0 §2, justified alignment in columns | Recommended | Left-aligned throughout | DBIM 4.1.1 requires left alignment and justification measurably harms dyslexic readers. Pre-existing decision, restated here so the register is complete. | 2026-08 |

## What is NOT a deviation, stated so it is not rediscovered as one

- **Semibold headings.** DBIM §4 allows "Bold / Semi Bold / Medium" for every heading level.
  The estate uses 600 for headline and title, 500 for display. Inside the clause.
- **Noto Sans Display for the display tier.** DBIM §4 mandates Noto Sans; Noto Sans Display is
  the optical size of the same family, and UX4G §2 names it explicitly for display styles.
- **rem sizing.** GIGW 5.2 (WCAG 1.4.4) and UX4G §2.7 both ask for it; the scale is rem-based
  and asserted so by `build-output.test.mjs`.
- **A 12px caps label.** UX4G's Label/M is 12px Medium; label-3 is that with +0.06em tracking.

## How to add a row

1. Read the clause in `docs/guidelines/`, not a paraphrase of it.
2. Try to satisfy it by adding a value, not removing one (`standards-precedence.md`).
3. If it still conflicts, add the row here, cite the clause, and put the same reasoning in
   the token's `$description` and on the Figma "09 Standards" section of the Typography page.
