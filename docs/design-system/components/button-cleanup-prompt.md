# Prompt — rebuild the SAMAVESH Button to industry standard

Hand this to an agent (or a person) as the whole brief. It is written to be
self-contained: every number in it was measured, and the audit it is drawn from
is `docs/design-system/components/button-audit.md`.

---

## Role

You are a senior design-system architect. You own `Button` across **both**
surfaces — the Figma master `609:283111` in the SAMAVESH library
(`3FF5l0SMNIwdpZrKkeyPTm`, page *Buttons* `2141:296705`) and
`packages/design-system/components/actions/button.{tsx,css}`.

This component has **565 consumers** (494 `<Button>`, 63 `buttonClasses()`, 8 raw
`.ds-btn`). It is the most-used component in the estate. Every change you make is
multiplied by that, and every regression is too. Move in verifiable steps.

## Read before you touch anything

- `.claude/rules/component-authoring.md` — the authoring standard this must pass
- `.claude/rules/design-system-architecture.md` — the Atomic-Functional contract
- `.claude/rules/standards-precedence.md` — quality → DBIM → GIGW → UX4G, and the
  rule that a standard's list is a **floor, not a ceiling**
- `.claude/rules/figma-documentation-style.md` and `documentation-ds-linkage.md`
- `packages/design-system/design.md` and `packages/tokens/src/component-matrix.json`
- The audit. Do not re-derive it; do verify anything you intend to change.

## Benchmarks — compare, do not copy

| System | Take from it | Do NOT take |
|---|---|---|
| **Material 3** | State layers as *tokens* (hover/focus/pressed opacities), the tonal-button idea done with a real container colour | its shape scale, its palette |
| **IBM Carbon** | The `danger--ghost`/`danger--tertiary` model: intent and prominence as two independent axes; explicit `focus` tokens | its 4px grid, its type ramp |
| **Shopify Polaris** | `loading` as a first-class prop with `aria-busy`, `disabled` semantics on link-buttons | its "plain" naming |
| **Atlassian** | `appearance` × `spacing` split; `isDisabled` handled identically for button and anchor | its brand tokens |
| **GOV.UK Frontend** | The 2px "shadow" affordance and the rigorous focus state; `min-height` sizing that survives text scaling | its yellow focus colour (DBIM sets ours) |
| **Primer** | Size scale tied to control height tokens, not hardcoded px | — |
| **UX4G 3.0** | **44×44 minimum on mobile, 8px between adjacent targets** (§Spacing and touch targets); "Icon-only rendering is a Button prop, not a distinct component" (`tools/ux4g-conformance/component-map.json`) | its violet primary, its icon default — DBIM and SAMAVESH set our brand |

**Two standards traps, both already documented and both easy to repeat:**
1. **WCAG 2.5.8 (AA) is 24×24. 44×44 is 2.5.5 (AAA).** UX4G's own document
   miscites this, and so does our Button docs page. Adopt 44 as a *touch-context
   recommendation*, never call a 40px desktop button a WCAG failure.
2. The estate targets **WCAG 2.2**, not 2.1. Where a doc describes what GIGW
   *requires*, 2.1 is correct; where it states *our* target, it is 2.2.

---

## Work, in order. Do not reorder — later steps depend on earlier ones.

### Stage 1 — stop the bleeding (three defects that ship today)

1. **`disabled` on a link-button is inert.** `<Button href disabled>` renders
   `<a disabled>`: measured `pointer-events:auto`, `opacity:1`, `cursor:pointer`,
   `aria-disabled:null`, focusable. Fix by rendering a real `<button>` when
   disabled, or by emitting `aria-disabled="true"`, removing it from the tab
   order and swallowing activation. Never emit `<a disabled>`.
2. **Fixed `height` clips the label at 200% text (WCAG 1.4.4).** Measured: at
   32px text the box stays 40px and `scrollHeight 41 > clientHeight 38`. Replace
   `height: 32/40/48px` with `min-height` + vertical padding so the box grows.
3. **Five WCAG 1.4.11 boundary failures** (needs 3:1 vs the page): tonal
   primary 1.42, success 1.52, danger 1.21, neutral 1.35; neutral outlined 2.15.
   Give tonal a 3:1 edge or reconsider it — **tonal has 2 consumers in 494
   buttons**, and `inverseOutlined` has 1.

Each fix lands with a Playwright pin in `e2e/`. A defect this invisible must not
be able to come back quietly.

### Stage 2 — move the component onto Tier 3

`cmp/action/<intent>/<primary|secondary|tertiary|tonal>/<state>/<bg|text|border>`
already models every intent and state, in code **and** in Figma. `neutral` binds
it; the other three do not.

- Repoint `primary`, `success`, `danger` to the Tier-3 family.
- Delete the `filter: brightness()` hover/active on `filled` and `tonal` and use
  the explicit `hover/bg` and `active/bg` tokens. The matrix's own `$notes`
  says why: a computed colour cannot be contrast-tested and does not repaint
  per brand mode.
- Delete `--_dark` (3 declarations, 0 uses) and the two dead `--_ring`
  declarations on primary and neutral.
- Replace `color-mix(…, white)` and `--sa-color-neutralScale-0` in the inverse
  appearances with the `inverse` branch the matrix already carries.

**This is an estate-wide visual change.** Prove value preservation first:
declare it in `visual-contract.test.mjs`, run the suite against the
*un-regenerated* fixture, and only rebaseline once the intended diffs are the
only diffs. Then push to Figma, read the library back, and re-record
`figma-live.json` — the gate refuses a record updated without a verified read.

### Stage 3 — add the missing variants and states

- **`inverse` and `inverseOutlined` do not exist in Figma at all**, though code
  has them and portals use them on navy headers. Add them as a **Sub-type**
  extension, bound to the `cmp/action/*/…/inverse/*` tokens that already exist.
- **`inverseOutlined` currently renders identically for all four variants** —
  white text, white border — so `variant="danger"` silently loses its signal.
  Bind it to the variant's own inverse tokens.
- **Add a `loading` state.** Three of the six benchmark systems ship one, and our
  own docs already claim we do (`aria-busy` is documented as set by the
  component; it is not). It must set `aria-busy`, keep the label's width so the
  row does not reflow, and be announced (WCAG 4.1.3).
- **Decide `IconButton`.** Figma has a 60-variant `IconButton` set; code exports
  none, and UX4G says icon-only is a Button prop, not a component. Either export
  one or fold it in — but do not leave the two surfaces disagreeing.
- `neutral` is **already complete** (180 variants, added 2026-08-25). Do not
  re-add it.

### Stage 4 — the restructure (the reason the set is 720)

`3 Size × 4 Type × 4 Sub-type × 5 State × 3 Icon = 720`.

- **`State` is not a prop in code** — CSS drives it. It is a 5× multiplier for
  something no consumer picks.
- **`Icon` is one 3-value variant** where code has two independent slots, and it
  cannot express *both* icons at once, which code can.

Push both to properties (a boolean/instance-swap pair for icons, an interactive
component or a documented state sheet for states) and the set becomes **48
masters**. `component-authoring.md` §4 caps explosion at ~30 and says exactly
this.

**§11 is binding: edit the existing set in place. Never fork the key.** A new
component gets a new key and silently breaks 565 consumers and every Code
Connect mapping. Duplicate first as an archive if you want a backup, then edit
the original.

### Stage 5 — fix the padding family

**1,440 padding bindings, 100% to the Type collection** (`Font Size/6` ×640,
`Font Size/3` ×640, `Font Size/1` ×160), **0 to Space**. A designer changing the
type scale silently re-paddings every button in the estate. Rebind to
`padding/*` rungs of equal value — the ladder is value-named, so the mapping is
exact and provable. Assert the authorable property count is unchanged before
accepting the result.

### Stage 6 — documentation, all four surfaces

1. **Figma `Button — Documentation`** — currently a 1400px template with 16 text
   nodes, **0 on a published style**, describing a component that does not exist
   ("Primary · Secondary · Outlined · Ghost"). Rebuild to
   `figma-documentation-style.md`: 1680 frame, hero + "at a glance", numbered
   sections, every text on a published style, every fill/space/radius bound.
2. **Add a `Button — Component record`** sibling frame — no page in the library
   has one, and this is the component that most needs it.
3. **The web docs page contradicts itself** — lines 309/318/507 claim `sm` meets
   44px; 385/550 correctly say it is 32px and only `lg` reaches 44. Line 507 is
   inside the accessibility checklist. Fix, and correct the 2.5.8/2.5.5 misquote
   and the single "WCAG 2.1".
4. **Remove the loading-state claims** until Stage 3 makes them true.
5. **Write `docs/design-system/components/button.md`** — it does not exist.
6. **Storybook**: add stories for loading, inverse-per-variant, text-scaling and
   the link-button disabled case. Every prop must be *mentioned* or
   `check:storybook:parity` fails.
7. Update `design.md`, the changelog, and pin every new numeric claim in
   `tools/figma-doc-parity/claims.json`.

---

## Definition of done

- [ ] `npm run verify` green, run by hand (CI is billing-blocked)
- [ ] `npm test -w @mosje/tokens` green, fixtures rebaselined **only** after the
      intended diff was proven to be the only diff
- [ ] Every 1.4.11 boundary ≥ 3:1; every text pair ≥ 4.5:1 — measured, tabulated
- [ ] A 200% text-scale screenshot showing no clipped label
- [ ] Figma: 0 unbound fills/strokes/padding/radius on the master and the docs page
- [ ] Padding bound to the **Space** collection, 0 bindings to Type
- [ ] `figma-live.json` re-recorded from a **verified read**, not edited to match
- [ ] Every new claim pinned in `claims.json`, and each new assertion watched to
      FAIL before being trusted
- [ ] The variant count and its justification stated in the Component record
- [ ] `accessibility-auditor` run on the docs page before shipping

## Flag, do not decide alone

- Whether `tonal` survives (2 consumers) and whether `inverseOutlined` survives (1).
- Whether `State` leaves the variant axes — it changes how every designer picks a
  button and needs a human's agreement.
- Any case where UX4G's 44px and a dense desktop table genuinely conflict.
