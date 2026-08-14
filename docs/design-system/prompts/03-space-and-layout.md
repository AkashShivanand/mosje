# 03 — Document SAMAVESH Space & Layout

> **Read `00-MASTER-documentation-law.md` in full before anything else.** This file carries only
> what is true of space and layout.

---

## WHAT THIS FOUNDATION OWNS

Everything that positions things relative to each other: the raw space scale, the four **intent
ladders** built on it, container widths, the grid, and the breakpoints.

| Group | Tokens | Notes |
|---|---:|---|
| `space.*` (primitive) | 17 | `none · xxs · xs · sm · md · lg · xl · 2xl … 11xl` → 0–360px |
| `inline.*` | 7 | Horizontal gap between siblings |
| `stack.*` | 7 | Vertical gap between siblings |
| `padding.*` | 11 | Inside a container |
| `section.*` | 7 | Between page sections |
| `container.*` | 5 | 540 / 720 / 960 / 1140 / **1280 content** |
| `grid.*` | 5 | 12 columns, gutter, three margins |
| `breakpoint.*` | 3 | 360 / 768 / 1280 |

Figma collection **`Space`, 85 variables**. Page: **Layout Grid** `2140:295915`
(`figmaUrl(FIGMA_NODES.spacing)`). Current docs page: 146 lines, four sections.

---

## THE HEADLINE FINDING — THE SUFFIX TRAP

The four intent ladders reuse the same t-shirt suffixes for **different values**:

| Suffix | `inline` | `stack` | `padding` | `section` |
|---|---|---|---|---|
| `s` | 8px | 12px | 12px | 32px |
| `m` | 12px | 16px | 16px | 48px |
| `l` | 16px | **24px** | **20px** | **56px** |
| `xl` | 32px | 32px | 24px | 64px |

**`.l` means four different numbers depending on which ladder you are in.** A designer who learns
"l is 24" from the stack ladder and applies it to padding gets 20. This is not a bug — an intent
ladder is *supposed* to be calibrated per axis, and vertical rhythm legitimately needs more room
than horizontal. But it is a trap, it is currently undocumented, and **making it impossible to fall
into is the single most valuable thing this documentation can do.**

Handle it the way colour handled the rung-name warning: a **first-class section**, not a footnote,
with the cross-ladder table above rendered live.

---

## PHASE 0 — the questions this foundation must answer

Run the master's standard reconciliation, then answer these with evidence. Each is a real open
question surfaced from the source; each is a **finding to report, not to quietly fix**.

### 0.1 — `padding.4xl` is 360px

`padding.3xl = {space.10xl}` = **120px**. `padding.4xl = {space.11xl}` = **360px**.

The padding ladder otherwise runs 0 · 2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 — an orderly 4px-based
progression — and then jumps to 120 and 360. A 360px padding is not padding; it is layout.

Establish: what consumes `padding.3xl` and `padding.4xl`? (`grep` the estate.) If nothing does,
they are dead tokens. If something does, is it using them as padding or as a layout offset that
belongs in a different group? **Propose; do not delete.**

### 0.2 — `space.11xl` (360px) equals `breakpoint.mobile` (360px)

Coincidence or coupling? If a padding token and the mobile breakpoint are the same number by
accident, one of them will move and the other will not. Say which it is.

### 0.3 — Is the scale a 4px grid or not?

`space.xxs = 2px` breaks a strict 4px grid; everything from `xs` up is a multiple of 4 (4, 8, 12,
16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 120, 360). The docs page currently claims a rhythm — verify
what it claims and whether the claim is true.

Decide and document the rule: *"a 4px grid, with one deliberate 2px rung for hairline separation"*
is a good answer. *"Mostly 4px"* is not.

### 0.4 — The `inline` ladder skips two rungs

`inline.l = {space.lg}` = 16px, then `inline.xl = {space.3xl}` = **32px** — skipping `space.xl`
(20) and `space.2xl` (24). Every other ladder steps contiguously. Deliberate (horizontal gaps
rarely need 20 or 24) or an omission? Document the answer.

### 0.5 — `container.*` are raw literals, not scale members

540 / 720 / 960 / 1140 are Bootstrap's container widths, typed as literals rather than aliased onto
anything. `container.content = 1280px` matches CLAUDE.md's max-width rule and `breakpoint.desktop`.

Establish: are all five actually used, or is `content` the only live one? Where did 540/720/960/1140
come from and are they still the right numbers for this estate? **This is provenance, and the page
must state it rather than presenting inherited Bootstrap values as SAMAVESH decisions.**

### 0.6 — `grid.columns = 12` is a unitless number in a dimension collection

Check how `figma-variables.mjs` projects it — a `FLOAT` variable in a collection of dimensions is
fine, but confirm it round-trips and that `figma-roundtrip.test.mjs` covers it.

### 0.7 — Three breakpoints, and the reflow requirement

`360 · 768 · 1280`. WCAG 1.4.10 (Reflow) requires content to work at **320 CSS px** — below the
smallest breakpoint. Establish what actually happens between 320 and 360 and document it. If the
estate does not support 320, that is a conformance finding, not a design preference.

### 0.8 — The standard checks

- Do all 85 `Space` variables in Figma match the source, and are the four ladders present as
  aliases onto the raw scale (not literals)?
- Does the docs page hardcode any spacing value the build could generate?
- Do `npm run build -w @mosje/tokens` and `npm test -w @mosje/tokens` pass, run sequentially?

---

## COVERAGE CONTRACT

1. **Why a scale at all** — the case against ad-hoc margins, in plain terms.
2. **The raw scale** — all 17 rungs, rendered at true size, each with what it is for.
3. **The four intent ladders** — `inline` / `stack` / `padding` / `section`: what each axis means,
   why the same number has four names, and how to pick a ladder before picking a rung.
4. **The suffix trap** — the cross-ladder table, as a first-class section.
5. **How to choose** — a decision path: what are you spacing (between siblings / inside a box /
   between sections) → which axis → how much → here is your token.
6. **Containers** — all five widths, the 1280px content rule, and when to break out of a container.
7. **The grid** — 12 columns, gutters, the three responsive margins, and how the grid interacts
   with the container.
8. **Breakpoints** — three values, mobile-first, what changes at each, and the 320px reflow question.
9. **Density interaction** — spacing is the thing density compresses. Cross-link `07-sizing-and-density.md`
   and show the same layout at both densities.
10. **Optical vs geometric spacing** — where the scale is deliberately overridden (icon-to-label
    gaps, punctuation, mixed-script blocks) and why.
11. **Bilingual layout** — Devanagari's taller line boxes change vertical rhythm. Show it.
12. **Accessibility** — 1.4.10 Reflow, 1.4.12 Text Spacing (which changes vertical rhythm under the
    user's control), 2.5.8 target spacing, and why generous spacing is an accessibility feature
    rather than a stylistic one.
13. **Do / Don't** — six pairs minimum on real MoSJE UI.
14. **UX4G 3.0 parity** — the spacing crosswalk and the measured conformance figure.
15. **Handoff** — token → CSS variable → Tailwind utility → React prop.
16. **Provenance** — Bootstrap inheritance, UX4G alignment, SAMAVESH decisions, generated values.

---

## PHASE 1 — Figma (`Layout Grid`, node `2140:295915`)

Standard hygiene from the master, plus:

- Confirm the four ladders exist in `Space` as **aliases onto the raw scale**, not literals.
- Confirm the Figma **layout grids** themselves (12-col, gutters, margins) are defined as grid
  styles and match `grid.*`. A library whose grid style disagrees with its grid tokens teaches the
  wrong layout to every designer who applies it.
- Every variable's description says which ladder it belongs to and what it is for — **including the
  cross-ladder warning on every `.l` and `.xl` variable**, because that is where the trap bites.

### Frames

1. At a glance · 2. Anatomy of a space token · 3. The three tiers · 4. The raw scale at true size ·
5. **The four ladders side by side, with the suffix trap called out** · 6. Containers ·
7. The 12-column grid at all three breakpoints · 8. Spacing in real components ·
9. Density comparison · 10. Bilingual vertical rhythm · 11. Do / Don't · 12. Handoff · 13. Provenance.

---

## PHASE 2 — Website (`apps/hub/src/app/design-system/foundations/spacing/`)

The current page is 146 lines with four sections (`how-it-works`, `scale`, `tokens`, `guidance`).
That is a stub against the colour page's standard. **Rename the route to `space-and-layout` only if
you also add a redirect** — an existing linkable URL is a contract.

### What only the web can do

- **A viewport simulator** — drag a width handle and watch the grid, margins and container respond
  live, with the active breakpoint named.
- **A live ladder comparator** — pick a suffix, see all four ladders' values for it simultaneously.
  This is the suffix trap, made unfallable.
- **A spacing inspector** — hover any element in an embedded example and see the token that produced
  its gap, read from computed CSS.
- **A density toggle** wired to the same examples.
- **A Text Spacing simulator** (WCAG 1.4.12) — vertical rhythm is what it changes.
- **Copy-to-clipboard** on every token, with CSS variable and Tailwind utility.
- **Deep link** via `figmaUrl(FIGMA_NODES.spacing)`.

---

## PHASE 3 — pressure test

The master's six passes, plus:

- Can a designer, cold, correctly space a card's internal padding, its content stack, and its
  distance from the next section — naming three different tokens — in under two minutes?
- Does the page ever show a spacing value without naming its ladder?
- At 320px, does the documentation page itself reflow without horizontal scroll?
- Under Text Spacing overrides, does the vertical rhythm on the page survive?
- Does any example hardcode a px gap?

**Score 1–5** on the master's eight dimensions.

---

## DEFINITION OF DONE

- [ ] Phase 0's eight questions answered with evidence; drift table produced
- [ ] Token build + tests pass (sequentially); output pasted
- [ ] Figma: 85 `Space` variables verified, grid styles reconciled against `grid.*`, 13-frame page
      built, published **and verified from a consumer file**
- [ ] `figma-live.json` refreshed and `$note` appended
- [ ] Website: page upgraded, data module generated from tokens, DS audit inline, reusables in `docs-kit`
- [ ] The suffix trap is a first-class section on **both** surfaces
- [ ] Viewport simulator and ladder comparator working in the browser
- [ ] All 16 coverage-contract items addressed, and stated where
- [ ] `design.md` §G updated; `AGENTS.md`, `llms.txt`, changelog, nav updated
- [ ] `accessibility-auditor` and `gov-compliance` run; output pasted; issues fixed
- [ ] `npm run lint` + `npm run typecheck` pass in `apps/hub`
- [ ] Verified in browser at 320 / 360 / 768 / 1280, both densities, both scripts
- [ ] Six pressure-test passes run; findings, fixes and the eight scores written up
