# 07 — Document SAMAVESH Sizing & Density

> **Read `00-MASTER-documentation-law.md` in full before anything else.**
>
> ⚠ **Half of this is a new surface.** The existing `foundations/density/` page (155 lines) covers
> the density axis. The **22-rung `size.*` scale**, the **touch-target tokens** and the **icon
> sizing ladder** — which together decide how big everything in the estate is — are documented
> nowhere.

---

## WHAT THIS FOUNDATION OWNS

| Group | Tokens | Values |
|---|---:|---|
| `size.*` (primitive) | 22 | 8 · 10 · 11 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 28 · 32 · 36 · 40 · 44 · 48 · 52 · 56 · 60 · 64 · 80 · 120 (rem-valued) |
| `target.*` (semantic) | 4 | `min` 24 · `comfortable` 44 · `spacious` 48 · `spacing` 8 |
| `icon.size.*` (semantic) | 5 | `xs` 16 · `sm` 20 · `md` 24 · `lg` 32 · `xl` 40 |
| `control.*` (semantic) | 2 | `radius` → `radius.md` · `border.width` → `border.width.sm` |
| `density.*` (semantic) | 8 | Control height/padding/gap, row height/padding, section gap |

Figma collection **`Density`, 8 variables**. Page: **Density** `4170:695`
(`figmaUrl(FIGMA_NODES.density)`). Docs page: 155 lines, density only.

**`size.*` is the shared substrate.** `font.size.*`, `font.lineHeight.*`, `icon.size.*` and
`target.*` all alias into it. That makes it the most load-bearing undocumented scale in the system —
and the reason this prompt exists.

---

## HOW DENSITY ACTUALLY WORKS — get this right before writing

Density is **not** a second set of tokens. The eight `density.*` tokens carry a DTCG extension:

```json
"$extensions": { "mosje": { "themes": { "compact": "32px" } } }
```

The build emits the default under `:root` and the compact value under `[data-density="compact"]`,
so **one token name resolves to two values depending on an attribute on an ancestor**. That is a
genuinely good piece of design and it is currently explained nowhere. Explaining it well —
*"you never write a compact token; you write the token and set the attribute"* — is a primary
objective.

Verify the mechanism in `packages/tokens/build/formats/` before describing it. Do not describe it
from this paragraph.

---

## PHASE 0 — the questions

Run the master's standard reconciliation, then:

### 0.1 — `target.min = 24px`: which criterion is that, exactly?

WCAG **2.2** SC 2.5.8 *Target Size (Minimum)* is 24×24 CSS px at **AA**. WCAG **2.1** SC 2.5.5
*Target Size* is 44×44 at **AAA**. This estate is bound to **WCAG 2.1 AA + GIGW 3.0**, which means
24px satisfies no normative requirement it is actually held to, while 44px satisfies a AAA one.

The token names imply a ladder where `min` is the acceptable floor. Establish and state precisely:

- Which criterion each of the three sizes satisfies, named by number.
- What GIGW 3.0 requires, if it says anything (check `.claude/rules/`, `docs/source-brd/` and the
  `gov-compliance` skill).
- What the estate's **own** rule is — and make `comfortable` (44) the documented default for
  anything a citizen taps on a phone, with `min` reserved for the 2.5.8 exceptions (inline links in
  text, targets whose spacing compensates).

This is the highest-stakes paragraph in the whole prompt. A portal used on a ₹6,000 Android phone by
someone filling a scholarship form is exactly the case 44px exists for.

### 0.2 — `target.spacing = 8px` is the escape hatch, and it needs its condition stated

2.5.8's spacing exception only applies when the *undersized* target's 24px-diameter circle does not
intersect another target's. Document the exception with the geometry, not as "leave 8px".

### 0.3 — Are density values aliases or literals?

`density.control.height = "40px"` is a literal; `icon.size.md = "{size.24}"` is an alias. Two
neighbouring semantic groups, two different disciplines. Establish whether the density literals
*could* alias onto `size.*` (40 → `size.40` exists; 32 → `size.32` exists; 12 → `size.12` exists) —
and if they could, **propose** it. A literal that duplicates a scale rung is a future drift.

### 0.4 — Scale holes

`size.*` has no `4`, no `6`, no `72`. `font.role.display.2` is 72px and therefore cannot alias.
`space.xxs` is 2px and `space.xs` is 4px — so the space scale has a 4 that the size scale lacks.
Establish whether `size.*` and `space.*` are meant to be the same ladder or deliberately different
ones, and say so. Two nearly-identical scales with different holes is how a system rots.

### 0.5 — Density coverage

Eight density tokens govern controls, rows and section gaps. What about inputs, buttons, tabs,
cards, modals? `grep` for `--sa-density-*` consumers and report which components actually respond
to the attribute. **A density switch that visibly changes only tables is a half-implemented
feature, and the docs must say which components it reaches.**

### 0.6 — When is compact allowed?

The existing page has "when to use compact" and "when NOT to". Verify both against the touch-target
rule: compact drops control height to 32px, which is **below `target.min`**, let alone
`comfortable`. So compact must be prohibited on touch-primary surfaces. Confirm the page says that,
and that the code enforces it or at least warns.

### 0.7 — The standard checks

`Density`'s 8 Figma variables and their two modes; no hardcoded sizes in the docs page; build +
tests green, run sequentially.

---

## COVERAGE CONTRACT

1. **The size substrate** — all 22 rungs, why rem and not px, and what aliases into it.
2. **rem vs px** — why the scale is rem-valued, what that means when the user changes their browser
   font size, and why that is a WCAG 1.4.4 feature rather than a bug.
3. **Touch targets** — the three sizes, the criteria each satisfies by number, the spacing
   exception's geometry, and the estate's own rule.
4. **Icon sizing** — the five steps, their relationship to the 24px Material Symbols grid, and
   optical alignment with adjacent text.
5. **Control geometry** — height, padding, gap; how a button, input and select stay aligned.
6. **The density axis** — the attribute mechanism, both modes rendered side by side, which
   components respond, and the hard prohibition on touch-primary surfaces.
7. **Row and table density** — the case density was built for.
8. **Choosing a size** — a decision path from "what am I sizing" to a token.
9. **Sizing and typography** — how control height relates to line-height, and why a 40px control
   holding 16px/24px text has 8px of optical breathing room.
10. **Responsive sizing** — what changes at 360 / 768 / 1280, and what deliberately does not.
11. **Accessibility** — 2.5.8, 2.5.5, 1.4.4 (200% zoom), 1.4.10 (reflow at 320px), and the
    interaction with the UX4G widget's own font-size controls.
12. **Do / Don't** — six pairs minimum on real MoSJE UI.
13. **Handoff** — token → CSS variable → React prop; how to set the density attribute.
14. **Provenance** — UX4G alignment, SAMAVESH decisions, generated values.

---

## PHASE 1 — Figma (`Density`, node `4170:695`)

Standard hygiene, plus:

- Verify the `Density` collection carries **both modes** and that they resolve correctly.
- Establish where `size.*`, `target.*` and `icon.size.*` live in Figma — they may be in `Space` or
  absent. **If the touch-target tokens are not in the library at all, that is a significant finding**:
  designers cannot check a target size against a token that does not exist for them.

### Frames

1. At a glance · 2. Anatomy of a size token · 3. The three tiers · 4. The size scale at true size ·
5. Touch targets, drawn at real dimensions with the 24px circles and the spacing exception ·
6. Icon sizes on the 24px grid · 7. Control geometry dissected · 8. Default vs compact, side by side
· 9. Which components respond to density · 10. Do / Don't · 11. Handoff · 12. Provenance.

---

## PHASE 2 — Website (`apps/hub/src/app/design-system/foundations/density/`)

Widen to sizing + density. **Keep the URL** and say in the intro what the page now covers. If you
add a `foundations/sizing` route instead, redirect the old one.

### What only the web can do

- **A real-dimension target ruler** — draw the 24 / 44 / 48px targets at true physical size on the
  actual device, with a live pass/fail against the criterion.
- **A tap-test** — real buttons at each size the reviewer can actually try on a phone. Nothing
  else makes the 44px case as well.
- **A density toggle** driving the whole page, with a live census of which components changed.
- **A browser-font-size simulator** showing what rem sizing does at 200%.
- **Copy-to-clipboard** on every token; **deep link** via `figmaUrl(FIGMA_NODES.density)`.

---

## PHASE 3 — pressure test

The master's six passes, plus:

- On a real 360px phone viewport, are every interactive element on the documentation page itself at
  least `target.comfortable`? (A sizing page with 32px tap targets is self-refuting.)
- Does the page state which WCAG criterion each target size satisfies, **by number**?
- Does the page make it impossible to use compact on a touch surface by accident?
- At 200% browser font size, does the layout hold?
- Any hardcoded px in the page's own markup?

**Score 1–5** on the master's eight dimensions.

---

## DEFINITION OF DONE

- [ ] Phase 0's seven questions answered with evidence; density-consumer census pasted
- [ ] The target-size rule stated with criteria named by number, and GIGW checked
- [ ] Density literal-vs-alias proposal written up
- [ ] Token build + tests pass (sequentially); output pasted
- [ ] Figma: `Density`'s two modes verified; the presence or absence of `size`/`target`/`icon.size`
      in the library established and reported; 12 frames built, published **and verified from a
      consumer file**
- [ ] `figma-live.json` refreshed and `$note` appended
- [ ] Website: page widened to sizing + density, URL kept (or redirected), data module generated,
      DS audit inline, reusables in `docs-kit`
- [ ] Target ruler and tap-test working on a real mobile viewport
- [ ] All 14 coverage-contract items addressed, and stated where
- [ ] `design.md` updated; `AGENTS.md`, `llms.txt`, changelog, nav updated
- [ ] `accessibility-auditor` and `gov-compliance` run; output pasted; issues fixed
- [ ] `npm run lint` + `npm run typecheck` pass in `apps/hub`
- [ ] Verified in browser at 320 / 360 / 768 / 1280, both densities, at 200% browser font size
- [ ] Six pressure-test passes run; findings, fixes and the eight scores written up
