# 02 — Document SAMAVESH Typography

> **Read `00-MASTER-documentation-law.md` in full before anything else.** It carries the role, the
> voice rule, the four-phase spine, the quality bar, the tooling, the pressure test and the hard
> rules. This file carries only what is true of typography.
>
> Companion to `01-colour.md`. **The two pages must read as one document** — same section rhythm,
> same callout voice, same "In plain terms" discipline. A reader moving between them should not
> notice they were written in different sessions.

---

## WHY TYPOGRAPHY IS THE HARD ONE HERE

Colour's difficulty is that a wrong choice is measurable. Typography's difficulty is the opposite:
most of it *cannot* be reduced to a number, and the parts that can are the parts people ignore.

Three things make this estate's typography harder than a commercial system's:

1. **It is bilingual by law, not by preference.** Devanagari and Latin share every screen. They do
   not share a line-height, an x-height, or a comfortable minimum size. A scale tuned on English
   and shipped to Hindi produces clipped conjuncts and cramped matras — a rendering defect that
   looks like carelessness about the language.
2. **It is a legal accessibility surface.** GIGW 3.0 binds this estate to WCAG 2.1 AA. That makes
   1.4.4 (Resize text to 200%), 1.4.12 (Text Spacing) and 1.4.10 (Reflow) contractual, not
   aspirational. An 11px label that cannot survive a user stylesheet is a defect.
3. **The type system has two parallel scales that do not agree**, and nobody has written down
   which one wins. Resolving that is a primary objective of this work — see Phase 0.

---

## GROUND TRUTH — read these before writing anything

The master lists the shared sources. These are typography's own.

| # | File | What it gives you |
|---|------|-------------------|
| 1 | `packages/tokens/src/primitive.json` → `font.*` | **94 tokens**: `family` 4 · `weight` 4 · `size` 7 · `lineHeight` 6 · `role` 63 · `tracking` 10 |
| 2 | `packages/tokens/src/primitive.json` → `size.*` | The 22-rung shared sizing scale that `font.size.*` and `font.lineHeight.*` alias into |
| 3 | `packages/tokens/src/semantic.json` → `font.devanagari`, `leading.devanagari` | The two Indic tokens, and the only unitless line-height in the system |
| 4 | `packages/tokens/reference/figma-live.json` → `Type` | **109 variables** — what the published library actually holds |
| 5 | `packages/tokens/test/type-alias-parity.test.mjs` | The guardrail on the type alias contract |
| 6 | `packages/tokens/test/visual-contract.test.mjs` | Frozen type baselines. **Re-baseline deliberately, never to make a test pass** |
| 7 | `apps/hub/src/app/design-system/foundations/typography/page.tsx` (140) · `typography-data.ts` (108) · `type-lab.tsx` (310) | The current docs page. **`typography-data.ts` is the pattern colour was told to copy — it already exists here. Check whether it is generated or hand-maintained; if hand-maintained, generating it is in scope** |
| 8 | `packages/design-system/design.md` §D, §E, §F | Typography, the type scale reference, and the bilingual usage contract |
| 9 | `apps/hub/src/components/design-system/docs-kit/type-specimen.tsx` | The existing specimen component — extend it rather than writing a second one |
| 10 | `packages/tokens/reference/ux4g-3.0.tokens.json` | UX4G's own type contract. The parity target |

**Figma:** file `3FF5l0SMNIwdpZrKkeyPTm`, **Text Styles** page `2140:295912`
(`figmaUrl(FIGMA_NODES.typography)`). Collection `Type`, 109 variables.

---

## PHASE 0 — the five questions this foundation must answer before it documents anything

Run the master's standard reconciliation, and then answer these. Each is a real, currently-open
question surfaced by reading the source. **Each is a finding to report, not a thing to quietly fix.**

### 0.1 — Two scales, one system: which one wins?

`font.size.*` holds **7** rungs (11, 12, 14, 16, 20, 22, 48) and **aliases onto `size.*`**.
`font.role.*` holds **63** tokens across six role families and is **raw px literals**.

The role scale uses sizes that `font.size.*` does not contain — 24, 28, 32, 40, 56, 64, 72, 80 —
and `size.*` itself has no `72` rung, so `display.2 = 72px` *could not* alias even if someone tried.

Answer, with evidence:
- Which scale is a designer supposed to reach for, and which is internal?
- Is `font.size.*` a **subset that drifted**, or a deliberate "these are the only sizes you may type"
  list? If deliberate, why does the role scale exceed it?
- Should `font.role.*` alias into `size.*` (adding the missing rungs), or should `font.size.*` be
  retired in favour of roles? **Propose; do not execute without approval.**

### 0.2 — Duplicate roles under different names

- `display.6` = 40px / 48px lh. `headline.1` = 40px / 48px lh. **Identical.**
- `title.2` = 16/24. `body.1` = 16/24. **Identical.**
- `headline.6` = 16/20 and `title.3` = 14/20 overlap the label family.

For each collision: is it a deliberate semantic distinction (same metrics, different meaning and
therefore different weight/colour in use), or an accident? Document the answer *in the docs*, because
a designer looking at two identical specimens will otherwise pick at random. If it is deliberate,
the page must say **what makes them different** — and if the only difference is intent, say that
plainly rather than implying a metric difference that does not exist.

### 0.3 — Ten tracking tokens, all `0px`

Every `font.tracking.*` value is `"0px"`. Either:
- letter-spacing is deliberately never adjusted (a defensible position — Noto Sans is designed for
  it, and tracking hurts Devanagari), in which case **say so, with the reason**, and explain why the
  tokens exist at all; or
- they are placeholders never filled in, in which case that is a finding.

Ten tokens that all say nothing is worse than no tokens, because a designer assumes they mean
something. Resolve it.

### 0.4 — The Devanagari line-height is the only unitless value in the system

`font.lineHeight.devanagari = "1.7"`; every other line-height is a px alias. This is almost
certainly **correct** — a ratio scales with the font size, which is exactly what Indic scripts need
— but it is an undocumented inconsistency. Establish and document:
- Why unitless here and px elsewhere.
- What 1.7 was derived from — measured against which fonts, at which sizes, for which conjuncts?
  If the answer is "it was chosen by eye", say that; a documented judgement beats a fake derivation.
- What happens to the role scale's px line-heights when Devanagari is active. **Test this in the
  browser at every role size and screenshot the result** — this is the single highest-value piece of
  evidence the page can carry, and no commercial system has it.

### 0.5 — `Noto Sans Display` is a second typeface

`font.family.display` is `"Noto Sans Display"`. CLAUDE.md says **"Noto Sans is the typeface across
all gov properties (DBIM standard). Don't introduce other fonts."** The existing docs page has a
section titled *"Why two typefaces"*, so this is evidently deliberate.

Confirm and document: what DBIM actually mandates, why a Display cut is conformant rather than a
second font, where it is permitted (display roles only?), and — critically — **what happens when it
fails to load**, since the fallback chain drops straight to `"Noto Sans"`. Also confirm whether it
is actually loaded anywhere, or whether the token is aspirational.

### 0.6 — The standard checks

- Does every one of the 109 `Type` variables in Figma resolve to the value the source holds?
- Is `typography-data.ts` generated or hand-maintained? If hand-maintained, it is the sixth source
  of truth and the next drift incident. **Propose generating it from `@mosje/tokens`.**
- Do `npm run build -w @mosje/tokens` and `npm test -w @mosje/tokens` pass, run **sequentially**?

---

## COVERAGE CONTRACT — what "everything about typography" means

State explicitly, in your report, which of these you covered and where.

1. **The typeface decision** — Noto Sans, why DBIM requires it, the Display cut, the Devanagari cut,
   the mono fallback, and what loads when each fails.
2. **The scale** — every role, every size, every line-height, every paragraph spacing, rendered
   live. Where each came from and what it is *for*.
3. **Role vs size** — the resolution of Phase 0.1, stated as a rule a designer can follow.
4. **Weights** — four (400/500/600/700), what each is for, and the hard rule that weight is not a
   substitute for hierarchy. Why there is no 300 and no 800.
5. **Line height** — the px ladder, the Devanagari ratio, and how to choose when mixing scripts.
6. **Paragraph spacing** (`para`) — the third dimension most systems omit. What it is, why it is
   tokenised per role, and how it relates to the space scale.
7. **Tracking** — the resolution of Phase 0.3.
8. **Bilingual typesetting** — Devanagari + Latin in one block: matra clipping, conjunct height,
   why 1.7, mixed-script line boxes, `lang` attributes, and font-feature settings. **With live
   specimens in both scripts at every role.**
9. **Hierarchy** — how to build a page's type hierarchy from the roles without inventing sizes; the
   heading-level-vs-visual-size distinction (an `<h2>` styled as `headline.4` is correct and common).
10. **Measure and rhythm** — line length targets, why `container.content` is 1280px, and the
    relationship between measure, size and line-height.
11. **Responsive type** — what changes between 360 / 768 / 1280, whether the scale is fluid or
    stepped, and where the breakpoints bite.
12. **Accessibility** — 1.4.4 (200% zoom), 1.4.12 (Text Spacing: line-height ×1.5, paragraph ×2,
    letter ×0.12em, word ×0.16em applied by the user and nothing may break), 1.4.10 (Reflow at
    320 CSS px), 1.4.8 (AAA, where relevant), the 11px `label.3` question, and the UX4G widget's
    own font-size controls.
13. **Text styles in Figma** — what exists, what each maps to in code, and why text styles exist
    here while colour has no paint styles.
14. **UX4G 3.0 parity** — the crosswalk between UX4G's type contract and ours, what we took, what
    we did not, and the measured conformance figure.
15. **Do / Don't** — at least six pairs on real MoSJE UI, every one a mistake actually made here.
16. **Handoff** — role → CSS variable → React prop → Tailwind utility, with a copyable snippet per
    role.
17. **Provenance** — which values are DBIM's, which are UX4G's, which are SAMAVESH decisions, which
    are generated.
18. **Deprecated & legacy** — see the master's ⚠ IN-FLIGHT note on `--ds-*`. Mark, do not restate.

---

## PHASE 1 — Figma (`Text Styles`, node `2140:295912`)

Standard variables hygiene from the master, plus:

- **Text styles are a Styles-panel convenience over the `Type` variables.** Verify with
  `getLocalTextStylesAsync` that every style's properties are **variable-bound**, not typed. A text
  style holding a typed 16px is a value that cannot follow the token.
- Confirm the `Type` collection's 109 variables match the source, including the `role` families.
- Every text style carries a description naming its role token, its code variable, and what it is
  for. Dev Mode surfaces descriptions; an undescribed style is an undocumented one.
- **Devanagari:** confirm whether the library has Devanagari text styles at all. If it does not,
  that is a gap to report — a bilingual estate whose library only specimens Latin is a library that
  will produce Latin-only designs.

### Frames, in this order (the website must match)

1. **At a glance** — the whole type system in one frame.
2. **Anatomy of a type token** — `font.role.headline.3.size` → `--sa-type-headline-3-size` → the
   role it belongs to → the weight and colour normally paired with it.
3. **The three tiers.**
4. **The scale** — all six role families, every step, rendered at true size, annotated with size /
   line-height / paragraph spacing.
5. **Latin and Devanagari side by side** — every role, both scripts, same frame. The most useful
   frame on the page if you do it well.
6. **Weights** — four weights across the roles that actually use them.
7. **Hierarchy in practice** — three real MoSJE screens with their type roles labelled in place.
8. **Measure & rhythm** — line length, paragraph spacing, and the container widths.
9. **Responsive** — the scale at 360 / 768 / 1280.
10. **Accessibility** — 200% zoom, the Text Spacing overrides applied, and the reflow case.
11. **Do / Don't** — six pairs minimum.
12. **Handoff.**
13. **Provenance.**

---

## PHASE 2 — Website (`apps/hub/src/app/design-system/foundations/typography/`)

You are **upgrading** the existing page, not replacing it. Read all of `page.tsx`,
`typography-data.ts` and `type-lab.tsx` first and keep what works — `type-lab.tsx` is already the
kind of live control the master asks for.

### What only the web can do — build these

- **A script switcher** — Latin / Devanagari / mixed, repainting every specimen in place. Nothing
  in Figma can show a Hindi paragraph reflowing at 320px.
- **The Text Spacing simulator** — a control that applies WCAG 1.4.12's user overrides
  (line-height ×1.5, paragraph ×2, letter ×0.12em, word ×0.16em) to the whole page. If anything on
  the page breaks under it, that is a defect the page just found for you.
- **A zoom simulator** to 200%, per 1.4.4.
- **Live computed readouts** — the resolved `font-size`, `line-height` and computed `x-height` read
  from the DOM, not printed from a table.
- **A measure ruler** — characters-per-line counted live as the viewport changes.
- **Copy-to-clipboard on every role**, giving the CSS variable and the React usage.
- **A "which role do I use?" decision path** — what are you setting (page title / section heading /
  body / caption / control label) → how prominent → here is your role, its weight and its pairing.
- **Deep link** via `figmaUrl(FIGMA_NODES.typography)`.

### Keep small

If `page.tsx` grows past ~400 lines, extract. `typography-data.ts` should be **generated from
`@mosje/tokens`**; anything reusable (specimen row, scale strip, script toggle) goes to `docs-kit`.

---

## PHASE 3 — pressure test

Run the master's six passes. Typography's specific adversarial questions:

- Set a Hindi page title at `display.3` and a Hindi body at `body.2`. Do the matras clip? Do the
  conjuncts collide with the line above? **Screenshot it.**
- Apply WCAG 1.4.12's Text Spacing overrides to the documentation page itself. What breaks?
- At 200% zoom on a 360px viewport, is `label.3` (11px → 22px) still the smallest thing on screen,
  and is anything now unreadable or clipped?
- Does the page ever imply a size where it means a role, or a role where it means a heading level?
- Pick the two duplicate role pairs from Phase 0.2. Does the page tell a designer which to use?
- Does any specimen use a hardcoded px value in the page's own markup?

**Score 1–5** on the master's eight dimensions. Anything below 4 gets fixed, not explained.

---

## DEFINITION OF DONE

- [ ] Phase 0's six questions answered with evidence; drift table produced
- [ ] `npm run build -w @mosje/tokens` and `npm test -w @mosje/tokens` pass (sequentially); output pasted
- [ ] Figma: `Type`'s 109 variables verified, text styles confirmed variable-bound, Devanagari gap
      resolved or reported, 13-frame page built, library published **and verified from a consumer file**
- [ ] `figma-live.json` refreshed and its `$note` appended
- [ ] Website: page upgraded, `typography-data.ts` generated from tokens, DS audit documented
      inline, anything reusable pushed into `docs-kit`
- [ ] Script switcher, Text Spacing simulator and live readouts all working in the browser
- [ ] All 18 coverage-contract items addressed, and stated where
- [ ] `design.md` §D/§E/§F updated and `Last reviewed` bumped; `AGENTS.md`, `llms.txt`, changelog, nav updated
- [ ] `accessibility-auditor` and `gov-compliance` run; output pasted; issues fixed
- [ ] `npm run lint` + `npm run typecheck` pass in `apps/hub`
- [ ] Page verified in the browser at 360 / 768 / 1280, in both brands, in both scripts, at 200%
      zoom, and under the UX4G widget's dark + high-contrast modes
- [ ] Six pressure-test passes run; findings, fixes and the eight scores written up
