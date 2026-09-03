# Button — the pass that puts it ahead of the field

**Branch** `ds/button-world-class` · **Opened** 2026-09-03 · **Scope** `Button`, `IconButton`,
`ButtonGroup` — code, CSS, Figma, docs and gates.

This follows the 2026-09-03 sync audit (PR #262), which closed five parity defects, an
orphaned icon component and an unbound focus ring. That pass made the three surfaces
**agree**. This pass asks a different question: agreeing on *what*, and is it good enough
to be the reference the rest of the estate is measured against?

---

## 1. Where the component actually stands

Measured, not remembered.

| Surface | State |
|---|---|
| `Button` code | 8 props, 4 variants x 3 appearances x 2 tones x 3 sizes, `href` link form, `loading` |
| `Button` Figma | 360 variants, complete matrix, zero Tier-1 bindings, Code Connect mapped and gated |
| `IconButton` code | Wraps `Button`, `aria-label` required by the type system |
| `IconButton` Figma | **45 variants — Size x Sub-type x State only** |
| `ButtonGroup` code | `role="group"`, required label, `vertical`, `align`, `attached` |
| `ButtonGroup` Figma | **Does not exist** |
| Tests | `e2e/design-system/button.spec.ts`, 5 tests |
| Stories | Button, IconButton, ButtonGroup |

**The component is strong.** Its intent/prominence/tone model is better reasoned than most
of the systems below — `tone` crossing `appearance` is a genuinely better idea than
Material's tonal-button-as-a-variant. The gaps are not in the model. They are in the
edges: what happens on a 320px screen, in Windows High Contrast Mode, under a thumb, and
on the two sibling components nobody finished.

---

## 2. Benchmark — what the field actually ships

Compared against **GOV.UK Design System**, **Material 3**, **IBM Carbon**, **Shopify
Polaris**, **Adobe Spectrum**, **GitHub Primer**, **Microsoft Fluent 2**, plus the
standards this estate is bound by (**WCAG 2.2 AA**, **GIGW 3.0**, **DBIM 3.0**, **UX4G 3.0**).

| Capability | Field | Us, before this pass |
|---|---|---|
| Intent x prominence as independent axes | Rare — most conflate them | ✅ **ahead** |
| Tone crossing appearance for brand surfaces | Rare | ✅ **ahead** |
| Icon-only label required by the type system | Rare | ✅ **ahead** |
| Group spacing as a component, not a convention | Rare | ✅ **ahead** |
| Busy state that is visibly busy, not disabled-looking | Common | ✅ level |
| Inert link-button (drops `href`) | Uncommon | ✅ **ahead** |
| **Label wrapping on narrow screens** | Universal | ❌ `white-space: nowrap` |
| **Full-width form button** | Universal | ❌ "use a container" |
| **Windows High Contrast / `forced-colors`** | Fluent, Carbon, Primer, GOV.UK | ❌ absent |
| **Touch-target expansion under the minimum** | Material, Spectrum | ❌ absent |
| **Minimum width for rhythm** | Carbon, Polaris, GOV.UK | ❌ absent |
| **`rel` on `target="_blank"`** | Universal | ❌ absent |
| **Disabled controls remaining discoverable** | Primer, Spectrum, Carbon | ❌ not offered |
| Class helper covering every axis | n/a | ❌ `buttonClasses` has no `tone` |
| Icon-only with intent + brand-surface support | Universal | ❌ Figma has neither |
| Group represented in the library | Common | ❌ absent from Figma |

**Nine gaps. Seven are in the edges, two are unfinished siblings.** None is a redesign.

---

## 3. Success criteria — what "better than the best" has to mean

Not "we added features". Each criterion is **falsifiable and gated**, because a claim with
no gate is worth what the last one was: three weeks and a census.

| # | Criterion | How it is proved |
|---|---|---|
| S1 | A label too long for its container **wraps** instead of overflowing, at 320px, in English and Hindi | e2e assertion on `scrollWidth <= clientWidth` at 320px |
| S2 | Every appearance keeps a **visible boundary in `forced-colors`** mode, and the focus ring survives | Playwright `forcedColors: "active"` test per appearance |
| S3 | Every size presents a **>= 44x44 pointer target**, without changing its drawn box | e2e measuring the hit area, not the border box |
| S4 | A button never renders **narrower than its rhythm minimum** | e2e on a one-character label |
| S5 | `target="_blank"` always carries `rel="noopener noreferrer"` | unit-level e2e assertion |
| S6 | A disabled control can be made **discoverable to a screen reader** without becoming operable | e2e: focusable, `aria-disabled`, click does not fire |
| S7 | `buttonClasses` can express **every** axis the component has | typecheck + docs example |
| S8 | Figma `IconButton` carries **intent and tone**, matching the code it maps to | Figma read-back + Code Connect fixture |
| S9 | `ButtonGroup` **exists in Figma** and is Code Connected | Figma read-back |
| S10 | Every claim on the docs page is **true of the code today** | the page's own values grepped from source |
| S11 | No regression: all existing gates stay green | full gate run |
| S12 | Every new behaviour is **seen in a browser**, not just written | screenshots / computed styles |

**The bar:** a criterion is met when a test fails without the fix. Anything I cannot make
fail, I do not claim.

---

## 4. Tracker

### Phase A — Accessibility beyond AA
- [x] **A1** `forced-colors` block: boundary, filled/outlined distinction, GrayText disabled, spinner, focus ring
- [x] **A2** Touch-target expansion to 44x44 on a coarse pointer, no layout shift, disabled where buttons touch
- [x] **A3** `preserveFocus` — `aria-disabled` keeps the control findable; pointer blocked in CSS, keyboard in TS

### Phase B — Layout and responsiveness
- [x] **B1** Labels wrap by default; `.ds-btn--nowrap` is the opt-out
- [x] **B2** `fullWidth`
- [x] **B3** Rhythm `min-width: 64px`

### Phase C — API completeness
- [x] **C1** `buttonClasses` gains `tone`, resolving through the same branch as the component
- [x] **C2** `target="_blank"` implies `rel="noopener noreferrer"`; explicit `rel` wins
- [x] **C3** *(unplanned, found by the typechecker)* the link form now types `target`, `rel` and `download`

### Phase D — The unfinished siblings
- [ ] **D1** Figma `IconButton` gains `Type` and `Tone` — **NOT DONE**, see below
- [x] **D2** `IconButton` Code Connect fixture, so its gate stops being a note
- [ ] **D3** Figma `ButtonGroup` set — **NOT DONE**, see below

### Phase E — Proof
- [x] **E1** 8 new e2e tests; 13 in the file, all passing
- [x] **E2** Docs page carries wrapping/width, forced-colors, preserveFocus, the link form and the theming hooks
- [x] **E3** `lint:css`, `tsc --noEmit`, `check:ds-pages` 136/136, `check:props`, `check:code-connect` all green

### Unplanned, and worth naming
- [x] **Public theming hooks** — `--sa-btn-fill` / `-ink` / `-edge` / `-ring`, read by every state, so a
      portal can retheme without forking and without the silent half-override that
      setting `background-color` from outside produces. This is what "reusable" had been
      missing.
- [x] **Three pre-existing e2e tests were failing on `main`** and nobody knew, because CI's
      two jobs do not run Playwright. They asked for a tab called "Meta" that the page
      stopped having when it moved onto `ComponentDocPage`.
- [x] **A regression I shipped in PR #262** — replacing the inverse callout dropped the
      `inverse-strip` test hook, so a fourth pre-existing test lost its target. The tone
      stage now carries it, and shows all four intents rather than one.

---

## 4a. Where the success criteria actually landed

Honesty first: two criteria did not hold as first written, and the tests were wrong
before the code was.

| # | Status | Evidence |
|---|---|---|
| S1 wrapping | **met** | fails with `white-space: nowrap` restored |
| S2 forced-colors | **partly — outcome guarded, mechanism not proved** | removing the whole block and re-running COLD still passed: Chromium's own forced-colors UA styles already give a `<button>` a border. The tests guard the outcome (they fail on `forced-color-adjust: none`, an unoverridable background, or a removed border box); the block earns its place on other engines, on real Windows palettes, and for the filled/outlined distinction and GrayText disabled treatment the UA does not supply. Not claimed as more than that. |
| S3 touch target | **met** | fails with `pointer-events: none` restored on the pseudo-element — which is what the first draft shipped, a comment claiming a fix over a rule that did nothing |
| S4 rhythm | **met, after the test was fixed** | first version passed with `min-width` removed entirely: an `md` button carries 24px padding a side, so "OK" already renders at 72.86px. The specimen is `sm` now, where the floor genuinely binds |
| S5 `rel` | **met** | fails with the default removed |
| S6 `preserveFocus` | **met, after the test was fixed** | first version attached a native listener and force-clicked — measuring its own listener, since `stopPropagation` cannot unregister a listener on the same element and `force: true` bypasses the pointer blocking under test |
| S7 `buttonClasses` | **met** | typechecks; resolves `tone` through the same branch as the component rather than a second copy |
| S8 IconButton Figma | **not met** | fixture added (D2); the axes are not (D1) |
| S9 ButtonGroup Figma | **not met** | — |
| S10 docs true of code | **met** | token table grepped from the stylesheet in PR #262; every new claim added here is measured |
| S11 no regression | **met** | full gate run green; four previously-broken e2e tests now pass |
| S12 seen in a browser | **met** | every assertion runs in Chromium against this branch's own server, not the one on :3007 |

**D1 and D3 are deliberately not done.** D1 means taking a 45-variant set to 360 by
adding two axes — a Figma generation an order of magnitude larger than anything in this
pass, on a component whose code is already correct. D3 means authoring a set that has
never existed. Both are real, both are recorded on the Button component record in Figma
as open, and both deserve their own change rather than being bolted onto a pass that is
otherwise verified end to end. Shipping them half-done inside this branch would make the
whole thing harder to review, not easier.

## 5. Decisions taken up front, so they are not re-litigated mid-pass

- **Wrapping is the default, `nowrap` the exception.** A clipped label is a worse failure
  than a two-line button, and the ratio is not close on a 320px government page in Hindi.
- **`fullWidth` is added despite the existing "use a container" guidance.** That guidance
  is correct in principle and has been ignored in practice everywhere it mattered; a prop
  that is right 95% of the time beats a rule nobody follows.
- **Disabled stays `disabled` by default.** `aria-disabled` discoverability is offered, not
  imposed: silently making every disabled button focusable would change tab order across
  the estate.
- **Nothing is removed.** No prop is renamed, no class is dropped. Every existing call site
  keeps working.
