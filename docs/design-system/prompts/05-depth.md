# 05 — Document SAMAVESH Depth (elevation, layers, stacking, opacity & blur)

> **Read `00-MASTER-documentation-law.md` in full before anything else.**
>
> ⚠ **This is mostly a NEW documentation surface.** The existing `foundations/elevation/` page is
> 128 lines covering "the three levels" — while the token source defines **six** elevation levels,
> **eight** stacking-order tokens, **fourteen** opacity steps, **eight** blur tokens and a
> **four-level** layer model. Roughly a third of this foundation is documented. You are widening
> the page to the whole of depth, not polishing what is there.

---

## WHAT THIS FOUNDATION OWNS

Everything that answers *"what is in front of what, and how do you tell?"*

| Group | Tokens | Values |
|---|---:|---|
| `shadow.*` (primitive) | 6 | `none` · `xs` · `sm` · `md` · `lg` · `xl` — tinted `rgba(30,33,36)` |
| `elevation.*` (semantic) | 6 | `flat`→none · `card`→xs · `raised`→sm · `dropdown`→md · `modal`→lg · `toast`→xl |
| `layer.*` + `layer.border.*` | 8 | Four surface levels and their matching borders |
| `z.*` (primitive) | 8 | `dropdown` 1000 · `sticky` 1020 · `fixed` 1030 · `offcanvas` 1040 · `modal.backdrop` 1050 · `modal.base` 1060 · `popover` 1070 · `toast` 1090 |
| `opacity.*` (primitive) | 14 | 0 · 5 · 10 · 20 · 25 · 30 · 40 · 50 · 60 · 70 · 75 · 80 · 90 · 100 |
| `blur.*` (primitive + semantic) | 8 | 2 · 4 · 8 · 16px → `subtle` · `soft` · `medium` · `strong` |
| `overlay.neutral.boldest` | 1 | `rgba(30,33,36,0.5)` — the only overlay token |

Figma: **`$effectStyles`** on the **Effects** page `2140:295914` (`figmaUrl(FIGMA_NODES.elevation)`).
Three families exist there — six `elevation/*` (generated, tinted), six `Focus States/*`
(variable-bound), six `Shadows/shadow-*` (flat `#212121`, **never matched the source, annotated
deliberately — do not "fix"**).

### Boundary with colour

`layer.*` and `overlay.*` resolve to **colours** and are owned by `01-colour.md`. This page owns
them as a **depth model** — when to raise a layer instead of drawing a border. Cross-link; do not
duplicate the colour values.

---

## THE HEADLINE FINDING — THE PAGE SAYS THREE, THE TOKENS SAY SIX

`foundations/elevation/page.tsx` has a section titled **"The three levels"**. The source has six
`elevation.*` tokens. One of the two is wrong, and until you establish which, nothing else on the
page can be trusted.

Establish: are `flat`, `card` and `raised` the only ones with consumers, with `dropdown`/`modal`/
`toast` being aspirational? Or does the page simply predate three of them? `grep` the estate for
every `--sa-elevation-*` consumer and settle it with evidence.

---

## PHASE 0 — the questions

Run the master's standard reconciliation, then:

### 0.1 — Two neutral inks that differ by one

- `shadow.*` and `overlay.neutral.boldest` are tinted **`rgba(30, 33, 36, …)`**.
- `--sa-color-transparent-neutral-*` and `--sa-color-text-disabled` are **`rgba(30, 32, 36, …)`**.

Green channel 33 vs 32. Commit `f56a8c7` ("derive the shadow ink, and fix the DBIM disabled-text bug
it surfaced") recently changed how the shadow ink is produced, so this may be a deliberate
consequence of deriving one and not the other — or it may be drift.

Establish which, from the build code, not by eye. If two "neutral inks" are meant to be the same
colour and differ by one channel step, that is a finding. If they are meant to be different, the
page must say what each is and why.

### 0.2 — `z.*` is Bootstrap's scale, with a hole at 1080

The eight values are Bootstrap's z-index ladder exactly — except Bootstrap's **tooltip: 1080** is
absent, and `@mosje/design-system` ships a **Tooltip** component.

Establish: what z-index does `Tooltip` actually use? If it is unset or hardcoded, that is a defect —
a tooltip that renders behind a popover is the classic symptom. Propose `z.tooltip`.

Also confirm the ordering is *coherent*: `elevation` and `z` must agree about what is on top.
Anything that sits above a modal in `z` but below it in `elevation` will look wrong.

### 0.3 — Fourteen opacity steps

`0 · 5 · 10 · 20 · 25 · 30 · 40 · 50 · 60 · 70 · 75 · 80 · 90 · 100` — note it carries **both** the
10s ladder and the quarters (25/75), which is two systems in one scale.

`grep` every consumer. How many of the 14 are used? An opacity scale with three live rungs and
eleven dead ones is eleven ways to be inconsistent. Report the census; propose a reduction if the
evidence supports one.

**And state the trap plainly:** a translucent element's contrast depends on what is behind it, so an
opacity token can silently break WCAG 1.4.3 or 1.4.11 in one context while passing in another.
This is the single most important sentence on the opacity section.

### 0.4 — Blur has a semantic layer; opacity and z do not

`blur.subtle/soft/medium/strong` alias `blur.1–4`. `opacity.*` and `z.*` have no semantic layer at
all — `z.dropdown` *is* the semantic name, sitting in the primitive file. Is that a tier violation?
Check against `tier-discipline.test.mjs` and document the answer.

### 0.5 — Backdrop blur and performance

Where is `blur.*` actually applied — `filter` or `backdrop-filter`? `backdrop-filter` has real
performance and Safari-support consequences, and interacts with `prefers-reduced-transparency`.
Document what is used, where, and what the fallback is.

### 0.6 — The three shadow families in Figma

Reconcile all three. The six legacy `Shadows/shadow-*` on flat `#212121` have **never** matched the
token source and are annotated rather than corrected, because a published library cannot enumerate
its consumers. **Do not "fix" them.** Document why they are there and which family to use.

### 0.7 — The standard checks

Figma parity via `elevation-parity.test.mjs`; no hardcoded shadows in the docs page; build + tests
green, run sequentially.

---

## COVERAGE CONTRACT

1. **The depth model** — why an interface needs a front-to-back order at all, in plain terms.
2. **The four ways to signal depth** — shadow, layer (surface colour), border, and stacking order —
   and the rule for choosing. **When to raise a layer instead of drawing a border** is the single
   most-asked question here.
3. **The six elevation levels** — every one, rendered live, with what it is for and what uses it.
4. **The shadow ink** — why shadows are tinted rather than black, how the tint is derived, and what
   happens on a dark surface.
5. **The layer model** — `layer.0–3` with their matching borders, stacked and rendered.
6. **Stacking order** — all eight `z.*` values as a ladder, what each governs, the missing tooltip
   rung, and the rule that you never type a z-index that is not a token.
7. **Opacity** — all 14 steps, the census from Phase 0.3, and the contrast trap.
8. **Blur** — all four steps, `filter` vs `backdrop-filter`, and `prefers-reduced-transparency`.
9. **Overlays and scrims** — the single overlay token, what a scrim is for, and its contrast duty.
10. **Depth in components** — every DS component's elevation and z, in one generated table.
11. **Accessibility** — 1.4.11 (a shadow is *not* a sufficient boundary on its own), 1.4.3 through
    translucency, `forced-colors: active` (where **shadows disappear entirely** — say what carries
    the meaning then), and `prefers-reduced-transparency`.
12. **Do / Don't** — six pairs minimum on real MoSJE UI.
13. **Handoff** — token → CSS variable → React prop.
14. **Provenance** — Bootstrap's z ladder, the derived shadow ink, the legacy Figma shadows.

---

## PHASE 1 — Figma (`Effects`, node `2140:295914`)

Standard hygiene, plus the three-family reconciliation from Phase 0.6. Every effect style carries a
description naming its token, its consumers, and — for the legacy family — **why it is deliberately
not corrected**.

### Frames

1. At a glance · 2. Anatomy of an elevation token · 3. The three tiers · 4. The six levels rendered
· 5. The layer model stacked · 6. Shadow vs border vs layer: choosing · 7. The stacking-order ladder
· 8. Opacity steps and the contrast trap · 9. Blur · 10. Depth across every component ·
11. `forced-colors` behaviour · 12. Do / Don't · 13. Handoff · 14. Provenance.

---

## PHASE 2 — Website (`apps/hub/src/app/design-system/foundations/elevation/`)

Widen the existing route to cover the whole of depth. **Keep the URL** — it is a contract — and say
in the page's intro that it covers elevation, layers, stacking, opacity and blur.

### What only the web can do

- **A live stack** — drag components on top of each other and watch the z ladder and elevation
  resolve, with the winning token named.
- **An elevation comparator** — all six levels on the same card, on every layer, in both brands.
- **The contrast trap, made live** — an opacity slider over three different backgrounds with the
  computed contrast ratio updating in real time. This is the most persuasive thing on the page.
- **A `forced-colors` preview** showing what survives when shadows are removed.
- **A `prefers-reduced-transparency` toggle.**
- **Copy-to-clipboard** on every token; **deep link** via `figmaUrl(FIGMA_NODES.elevation)`.

---

## PHASE 3 — pressure test

The master's six passes, plus:

- Can a designer, cold, decide between raising a layer and drawing a border — and name the token?
- Does the page state the translucency contrast trap where someone will actually hit it?
- Under `forced-colors: active`, does every depth cue on the page still communicate?
- Does the page still claim "three levels" anywhere?
- Does any example hardcode a `box-shadow` or a `z-index`?

**Score 1–5** on the master's eight dimensions.

---

## DEFINITION OF DONE

- [ ] Phase 0's seven questions answered with evidence; the three/six contradiction resolved
- [ ] Consumer census pasted for `elevation.*`, `z.*`, `opacity.*`, `blur.*`
- [ ] `z.tooltip` proposed with evidence of what `Tooltip` uses today
- [ ] Token build + tests pass (sequentially); `elevation-parity.test.mjs` green; output pasted
- [ ] Figma: three shadow families reconciled and described, 14 frames built, published **and
      verified from a consumer file**
- [ ] `figma-live.json` refreshed and `$note` appended
- [ ] Website: page widened to all of depth, URL kept, data module generated, DS audit inline,
      reusables in `docs-kit`
- [ ] The live contrast-through-opacity demo works in the browser
- [ ] All 14 coverage-contract items addressed, and stated where
- [ ] `design.md` "Elevation (Shadow) Tokens" updated and widened; `AGENTS.md`, `llms.txt`,
      changelog, nav updated
- [ ] `accessibility-auditor` and `gov-compliance` run; output pasted; issues fixed
- [ ] `npm run lint` + `npm run typecheck` pass in `apps/hub`
- [ ] Verified in browser at 360 / 768 / 1280, both brands, under `forced-colors: active` and
      `prefers-reduced-transparency`
- [ ] Six pressure-test passes run; findings, fixes and the eight scores written up
