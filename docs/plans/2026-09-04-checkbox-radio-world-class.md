# Checkbox and Radio — the world-class brief

> A complete, pasteable brief. Open a fresh session, paste this file, and it runs on the branch
> `ds/checkbox-radio-parity`. The audit it answers is
> `docs/audit/checkbox-radio-audit-2026-09-04.md`. Written 2026-09-04.

## The brief — Bring Checkbox and Radio to the industry ceiling — code, tokens, Figma, docs

You are working in `/Users/akashk/Documents/Projects/MoSJE`. Read `CLAUDE.md`, then `.claude/rules/component-authoring.md`, `figma-documentation-style.md`, `ds-documentation-standard.md`, `figma-code-sync.md`, `figma-library-index.md`, `documentation-ds-linkage.md`, `standards-precedence.md` and `packages/design-system/design.md` before writing anything. Load the `figma:figma-use` and `figma:figma-generate-library` skills before any `use_figma` call. The Figma file is **`3FF5l0SMNIwdpZrKkeyPTm`** ("SAMAVESH Design System"); never touch `T3bkN5gNKfaNeY6dpT6FwF` or `qyzTEy8dlb3ssYctlkMX5o` — both are dead copies that still hold variables, so a sync against them appears to work.

**Branch:** `ds/checkbox-radio-parity`, created from `main` in a worktree (the checked-out tree belongs to another session). Merge, never rebase. Sync `origin/main` at start and before the PR. No AI co-author trailers. Stage explicit paths only.

**Scope:** `Checkbox`, `Radio`, `RadioGroup`, `CheckboxGroup`, the card variant, and their Figma sets, documentation frames, Code Connect templates and web docs. `DeclarationCheckbox` and `Toggle` are touched only where the shared CSS split forces it. Estate migrations are **not** in this branch — list them in the PR body as the follow-up (inventory at the end of this prompt).

**Decisions already made — do not reopen:** box scale sm 16 / md 20 / lg 24 with md default; one `Selection Card` set plus `Checkbox Group` and `Radio Group` sets in Figma; keys `15:664` and `18:791` mutated in place.

## A. Tokens — `packages/tokens/src/semantic.json`

Add under the existing `control` group so CSS emits `--sa-control-selection-*`. Every token: `$type: dimension`, a `$description` with no braces in prose, WEB code syntax, narrow Figma scope. Values alias existing primitives.

| Token | Aliases | Scope |
|---|---|---|
| `control/selection/size/sm` · `md` · `lg` | `{size.16}` · `{size.20}` · `{size.24}` | WIDTH_AND_HEIGHT |
| `control/selection/glyph/sm` · `md` · `lg` | `{size.12}` · `{size.16}` · `{size.20}` | WIDTH_AND_HEIGHT |
| `control/selection/dot/sm` · `md` · `lg` | `{size.8}` · **`10px`** literal with a description in the `badge/dotSize` shape (no `size/10` primitive exists — do not add one) · `{size.12}` | WIDTH_AND_HEIGHT |
| `control/selection/border/width` | `{border.width.md}` (2px) | STROKE_FLOAT |
| `control/selection/radius` | `{shape.4}` | CORNER_RADIUS |
| `control/selection/gap` | `{space.8}` | GAP |

Reuse, do not add: `target/min` (24) · `target/comfortable` (44) · `target/spacious` (48) · `target/spacing` · `focus/ring|width|offset` · `motion/press/*` for glyph/dot/knob · `motion/exit/*` for border/background colour · `border/neutral/base|subtle` · `border/brand/primary/base` · `border/status/error/bolder` · `bg/brand/primary/bolder|subtler` · `bg/status/error/subtler` · `bg/neutral/base|subtle|subtler` · `on/bg/brand/primary/bolder` · `text/neutral/base|subtle|disabled` · `cmp/card/radius` · `padding/16` · `stack/12` · `type/body-2/*` · `type/label-1/*`.

**Border 1.5 → 2px is deliberate:** 1.5px anti-aliases to a lighter edge at 1× DPR, which is the surface WCAG 1.4.11 measures against; 2px matches GOV.UK, USWDS, Polaris, Material and equals `focus/width`. `control/border/width` (1px) stays the text-field edge. Record the change in the token description.

Gate: `npm run build -w @mosje/tokens && npm test -w @mosje/tokens` (naming grammar, tier discipline, Figma parity, exporter routing — `collectionFor` must route `control/selection/*`; if it throws, extend the route, never return null).

## B. React API — exact interfaces

New file `components/forms/selection-types.ts`:

```ts
export type SelectionSize = "sm" | "md" | "lg";          // box 16 / 20 / 24; row target 24 / 44 / 48
export type SelectionLabelPlacement = "end" | "start";
export type SelectionVariant = "default" | "card";
export type CheckboxState = "checked" | "unchecked" | "indeterminate";
```

New file `utils/use-controllable-state.ts` — `useControllableState(value, defaultValue, onChange)`; used by Checkbox and Radio (Toggle later).

### `Checkbox` (`checkbox.tsx`)

```ts
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "checked" | "defaultChecked" | "onChange"> {
  checked?: boolean;                 // controlled; omit for uncontrolled
  defaultChecked?: boolean;          // never true for consent — UX4G §7
  indeterminate?: boolean;           // orthogonal to checked; a click on a mixed box yields true
  label?: React.ReactNode;           // dev-mode console.warn if absent AND no aria-label/aria-labelledby
  hideLabel?: boolean;               // keeps the name, hides via sa-sr-only
  description?: React.ReactNode;     // aria-describedby, NEVER part of the name
  error?: React.ReactNode;           // role="alert" after the control, aria-invalid, aria-describedby
  invalid?: boolean;                 // styling only, for a group that owns the message
  readOnly?: boolean;                // aria-readonly, still focusable, click + Space prevented; NOT disabled
  required?: boolean;                // asterisk + aria-required + native required
  size?: SelectionSize;              // "md"
  labelPlacement?: SelectionLabelPlacement; // "end"
  variant?: SelectionVariant;        // "card" = selectable tile, whole card is the target
  icon?: React.ReactNode;            // card only; an <Icon> instance
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onCheckedChange?: (checked: boolean) => void;   // fires after onChange
}
```

- **Remove `aria-checked` from the native input.** Keep the effect that sets the DOM `indeterminate` property (that is what exposes `mixed`). Style off `data-state="checked|unchecked|indeterminate"` on the root — rendered server-side so the dash paints before hydration — with `:checked` sibling selectors as the no-JS path for on/off. Rewrite the docs claim accordingly.
- Root data attributes: `data-state`, `data-size`, `data-variant`, `data-label-placement`, `data-disabled`, `data-readonly`, `data-invalid`.
- Ids: `inputId`, `${inputId}-description`, `${inputId}-error`. `aria-describedby` concatenates own description + own error + any caller-supplied value; never overwrite.
- `forwardRef<HTMLInputElement>`, `displayName`.
- Export `CheckboxProps` from the barrel.

### `Radio` (`radio.tsx`)

Same shape minus `error` (an error belongs to the question, i.e. the group) and minus `indeterminate`. `name` and `value` stay required. `description` moves out of the `<label>` into `aria-describedby` in BOTH variants. Export `RadioProps`.

### Groups (`control-group.tsx`)

```ts
export interface ControlGroupOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;   // honoured by BOTH groups
  disabled?: boolean;
  icon?: React.ReactNode;          // card variant
  reveal?: React.ReactNode;        // GOV.UK conditional reveal: always in DOM, toggled with `hidden`, input carries aria-controls (+ aria-expanded on checkbox only — not allowed on radio in ARIA 1.2; note the GOV.UK divergence in the docs)
  exclusive?: boolean;             // CheckboxGroup only: "none of the above"; clears others / cleared by others; rendered after an "or" divider
}
interface ControlGroupBase {
  legend: React.ReactNode; hideLegend?: boolean;
  options: ControlGroupOption[];
  hint?: React.ReactNode; error?: React.ReactNode; invalid?: boolean; required?: boolean;
  disabled?: boolean;              // native <fieldset disabled>
  readOnly?: boolean;
  size?: SelectionSize; labelPlacement?: SelectionLabelPlacement;
  variant?: SelectionVariant; orientation?: "vertical" | "horizontal";
  className?: string; id?: string;
}
export interface RadioGroupProps extends ControlGroupBase {
  name: string; value?: string; defaultValue?: string; onChange?: (value: string) => void;
}
export interface CheckboxGroupProps extends ControlGroupBase {
  name?: string;                   // posted on every box so a plain form submit works
  value?: string[]; defaultValue?: string[]; onChange?: (value: string[]) => void;
  selectAll?: React.ReactNode;     // parent checkbox: checked when all enabled are, indeterminate when some
  exclusiveDivider?: React.ReactNode;  // default "or"
}
```

- Both groups `forwardRef<HTMLFieldSetElement>`.
- **RadioGroup fieldset gets `role="radiogroup"`** so `aria-invalid`, `aria-required`, `aria-describedby` are all permitted on it. **CheckboxGroup** keeps implicit `group`: `aria-describedby` stays on the fieldset, `aria-invalid` moves to each input, `required` renders the asterisk plus a `sa-sr-only` "(required)" in the legend — there is no ARIA host for "at least one of these".
- `RadioGroup.value` may be `undefined` — the component never invents a pre-selected option. DBIM B.xi's "pre-selected default" is a per-form decision the docs explain.
- Pure logic in `control-group-logic.ts`: `nextCheckboxValue(options, value, toggled)` (option-order emission + exclusive rule), `selectAllState(options, value): CheckboxState`, `nextSelectAllValue(options, checked)` — ignore disabled options.
- Error message stays after the options with `role="alert"`; docs examples use `[Problem] + [Solution]` wording.
- Fix `portal-login-template.tsx:440` (`hint:` → `description:`).

### Card

One shared markup (`<label class="ds-selection-card">` wrapping control + icon + body) used by `Checkbox variant="card"`, `Radio variant="card"`, and both groups. `DeclarationCheckbox` composes `Checkbox` unchanged.

## C. CSS

Split `controls.css` into `selection-control.css` (shared root, hidden input, target, label, description, error, size ladder, states, card, forced-colors, reduced-motion), `checkbox.css` (box + mark), `radio.css` (circle + dot), `toggle.css` (moved verbatim + motion tokens + reduced-motion). Each file opens with `@layer theme, base, components, utilities;` then `@layer components { … }`. Run `npm run build:components-css`.

- Size ladder via root custom properties: `.ds-selection[data-size="md"] { --_box: var(--sa-control-selection-size-md); --_glyph: …; --_dot: …; --_target: var(--sa-target-comfortable) }`; sm → `target-min`, lg → `target-spacious`. Root `min-block-size: var(--_target)`; `gap: var(--sa-control-selection-gap)`.
- **Touch target:** the visually hidden `<input>` IS the target — absolutely centred on the box at `var(--_target)` square, `opacity: 0`. No pseudo-element hit test; label clicks keep working. `labelPlacement="start"` = `flex-direction: row-reverse`.
- State matrix, every cell written:

| | border | fill | glyph/dot | cursor |
|---|---|---|---|---|
| default | `border/neutral/base` | `bg/neutral/base` | hidden | pointer |
| hover | `border/brand/primary/base` | — | — | |
| active | `border/brand/primary/base` | `bg/brand/primary/subtler` | — | |
| focus-visible | + `outline: var(--sa-focus-width) solid var(--sa-focus-ring)` at `--sa-focus-offset` | | | |
| checked / indeterminate | `border/brand/primary/base` | `bg/brand/primary/bolder` | `on/bg/brand/primary/bolder` (dash for indeterminate) | |
| invalid | `border/status/error/bolder` | (`bg/status/error/subtler` when checked) | | |
| readonly | `border/neutral/base` | `bg/neutral/subtler` | as checked | default |
| disabled | `border/neutral/subtle` | `bg/neutral/subtle` | `text/neutral/disabled` | not-allowed |

  Hover/active guarded with `:not(:disabled):not([aria-readonly="true"])`. Group `.is-invalid` draws a `stroke/2` `border/status/error/bolder` inline-start bar on the options list (GOV.UK) and passes `invalid` down.
- **forced-colors:** focus `Highlight` (kept) PLUS checked fill `background: Highlight; border-color: Highlight`, glyph `HighlightText`, disabled `GrayText`, selected card border `Highlight`.
- **reduced-motion:** `@media (prefers-reduced-motion: reduce) { .ds-selection *, .ds-toggle * { transition: none } }`.
- Transitions use `--sa-motion-press-*` (glyph/dot/knob) and `--sa-motion-exit-*` (colour). Zero raw `px` and zero raw durations remain — a unit test enforces it.
- Logical properties throughout (RTL). Fix `declaration-checkbox.css:64` `padding-left` → `padding-inline-start` while there.

## D. Tests — `node --test`, `react-dom/server`

`checkbox.test.ts`: no `aria-checked` emitted; `data-state` for each combination; `indeterminate` does not force checked; description/error ids in `aria-describedby` and caller value preserved; `error` → `role="alert"` + `aria-invalid`; `invalid` alone → no alert; `readOnly` → `aria-readonly`, not disabled; `required` → `aria-required` + asterisk; `hideLabel` keeps `for` linkage; `labelPlacement`/`size`/`variant` data attributes; card description outside the `<label>` text.
`radio.test.ts`: same minus error/indeterminate; `name`/`value` pass through.
`control-group-logic.test.ts`: option-order emission, toggle, exclusive both directions, `selectAllState` three outcomes ignoring disabled, `nextSelectAllValue` enabled-only.
`control-group.test.ts`: RadioGroup `role="radiogroup"` with `aria-invalid|required|describedby`; CheckboxGroup has neither of the first two on the fieldset and every input carries `aria-invalid` under `error`; `name` on every checkbox; `disabled` → `<fieldset disabled>`; reveal `hidden` unless selected and `aria-controls` set; divider before exclusive; `hideLegend` keeps a `<legend>`.
`selection-css.test.ts`: reads the four CSS files; asserts no raw px/duration outside comments, a `prefers-reduced-motion` block, and a `forced-colors` block naming the checked fill.

## E. Stories, web docs, AI context

- `Controls.stories.tsx` / `ControlGroup.stories.tsx`: sizes, label placement, description, error, readOnly, required, card (both atoms), select-all, exclusive, reveal, horizontal, group disabled. Real MoSJE content. `check:storybook`, `:parity`, `:types`, `:smoke`.
- `forms/checkbox/page.tsx`, `forms/radio/page.tsx`: new specimens for every state; A11yChecklist rows set `status: "verified"` **only with `evidence`** naming the unit test or axe route (2.5.8 evidence = the 44px hit-area test); `FIGMA_NODES.checkbox` → `15:664`, `radio` → `18:791`; add radio route to `e2e/a11y/axe.spec.ts` `ROUTES`; docs page specimens must render an error state so axe sees it.
- `docs/design-system/components/checkbox.md` and `radio.md` (anatomy, token map, flagged decisions) — new.
- `design.md`: replace the 3-line entry with the full prop/token/rule entry, bump `Last reviewed`; `AGENTS.md`; `llms.txt` self-syncs via `nav.ts`; `packages/design-system/CHANGELOG.md` + changelog page entry (`0.7.0`).
- `npm run build:props` → `check:props`; `check:ds-pages` (+`:baseline` if scores improve); `check:docs-coverage`; `check:a11y-evidence`; `check:design-context`; `check:ds-linkage`; `check:type-linkage`; `lint:css`; `check:focus-ring`; `check:components-css`; `check:changelog`; `npm run test:a11y`.
- **Visual audit is mandatory:** screenshots at 1× and 2× DPR, Windows High Contrast (`forced-colors` emulation), reduced-motion, mobile (375) and desktop, all three sizes, card and group, invalid and disabled. Attach to the PR.

## F. Figma — after the code PR merges (templates emit props that must exist)

Load `figma:figma-use` + `figma:figma-generate-library`. Sync the new tokens first (`/sync-figma`) — verify by resolved value, never by name. Work on the `Checkbox` and `Radio Buttons` pages of `3FF5l0SMNIwdpZrKkeyPTm`. **Mutate `15:664` and `18:791` in place** (duplicate as an archive first, edit the original). Every fill, stroke, stroke weight, gap, padding, radius, width and height binds to a semantic variable; glyphs are `Icon` instances (`check`, `remove`, Material Symbols Rounded 300) bound to `control/selection/glyph/*`; check Button `609:283111` for how its `Focused` variant draws the ring before assuming a Focus Ring component.

**Checkbox set — 45 variants.** Axes in this order: `Size = Small | Medium | Large` · `Checked = Off | On | Indeterminate` (rename from `Type`, re-value in place) · `State = Enabled | Hover | Focused | Pressed | Disabled`. Booleans: `Show Label` (on), `Show Description` (off), `Invalid` (off, overlay stroke `border/status/error/bolder`), `Required` (off, asterisk `text/status/error/base`). Text: `Label` ("Label"), `Description` ("Description"). **Default `Size=Medium, Checked=Off, State=Enabled`.** Grid: rows Size × Checked, columns State, every variant centred in its cell, set bounds hugging content. Not modelled (state it in the description and template): `readOnly`, `labelPlacement`, `hideLabel`.

**Radio set — 30 variants.** `Size` × `Checked = Off | On` (rename from `Selected`) × `State`, same booleans/texts minus Indeterminate. Default `Medium, Off, Enabled`.

**`Selection Card` — 20 variants.** Rename `radio-card` `55530:2932` in place; replace the external `radio-buttons` dependency with nested local `Radio`/`Checkbox` instances; placeholder copy. Axes: `Control = Radio | Checkbox` · `Checked = Off | On` · `State` (5). Booleans: `Show Icon`, `Show Description`, `Invalid`. Instance swap: `Icon` (library Icon set). Text: `Title`, `Description`. Remove `Caption`/`Show Caption`; `Subtitle` → `Description`. Radius `cmp/card/radius`, padding `padding/16`, gap `stack/12`.

**`Checkbox Group` and `Radio Group` — 4 variants each.** `Orientation = Vertical | Horizontal` × `Layout = Default | Card`. Text: `Legend`, `Hint`, `Error`. Booleans: `Show Hint`, `Show Error` (also paints the error bar), `Required`, `Show Item 3…6`; Checkbox Group adds `Show Select All` and `Show Exclusive Option` (a `Divider` instance with "or" + last item). Items are nested `Checkbox`/`Radio`/`Selection Card` instances with **nested properties exposed**.

**Pages.** `Checkbox` page: `Checkbox — Documentation`, `Checkbox — Component record`, `1 · Checkbox`, `2 · Checkbox Group`. Rename `Radio Buttons` page → `Radio`: `Radio — Documentation`, `Radio — Component record`, `1 · Radio`, `2 · Radio Group`, `3 · Selection Card`. Nothing loose at page root. Documentation frames per `figma-documentation-style.md`: 1680 wide, hero with six COUNTED stats, sections `01 Anatomy · 02 Properties · 03 Variants · 04 Behaviour · 05 Accessibility · 06 Do & Don't`; titles are claims; no history on the page. Do & Don't carries: never pre-check consent [UX4G §7]; description is not the name; readOnly is not disabled; vertical lists, ≤6 options as radios not a dropdown [DBIM B.xi, GuDApps 4.3.2.2]; active wording for checkbox labels, Yes/No as a single checkbox only when the cleared meaning is clear [GuDApps 4.3.2.3]; no nested radios; a "None of the above" is an exclusive option, not an empty selection. Component record: open items only + SOURCES panel.

**Descriptions** written fresh (never round-tripped) in the RULES / TOKENS shape: import path, "Code Connect is mapped — use the generated snippet", numbered prohibitions with consequences, token sources.

**Code Connect.** `checkbox.figma.ts`, `radio.figma.ts`, `selection-card.figma.ts`, `checkbox-group.figma.ts`, `radio-group.figma.ts` — parserless, header `// url=<SAMAVESH>?node-id=…`, every property mapped or explicitly omitted in a comment, every variant value mapped (`State` → only `Disabled: true`, per the Button precedent), nested instances resolved via `getInstanceSwap`/`executeTemplate()`. Capture real properties into `tools/code-connect-parity/figma-properties.json`; push with `add_code_connect_map`. Pin every numeric or behavioural doc claim in `tools/figma-doc-parity/claims.json`.

**Gates:** `check:code-connect`, `figma:connect:check`, `check:figma-docs` (+`:live`), `check:figma-index` → run `check:figma-index:sync` and commit `tools/figma-index-parity/index.json` (both cards move Published → Ready; `Radio Buttons` card renamed), `check:space-linkage` / `check:radius-linkage` (re-baseline only if the page improved), zero-unbound audit per `component-authoring.md` §9, `get_screenshot` of every variant.

## G. Definition of done

- Every gate above green; `npm run ci` green.
- Zero raw px, hex or duration in the four CSS files (test-enforced).
- A11yChecklist rows verified **with evidence**; none flipped without it.
- Figma: both pages "Ready" on the Index; 0 unbound fills/strokes/spacing/radii/sizes; default variants pass; descriptions in house shape; Code Connect mapped and fixtured.
- PR body lists what changed, what did not (Toggle, DeclarationCheckbox, no migrations), every flagged decision (`aria-checked` removal, border 2px, radiogroup role, CheckboxGroup required semantics, dot md literal, Radio page rename, Caption dropped from the card), and the follow-up inventory below.

## H. Follow-up PR inventory (not this branch)

| Site | Action |
|---|---|
| `nmba/.../irca/register/page.tsx:795,807,984,994`, `odic-form.tsx:602,611`, `outreach-patient-form.tsx:450,459` | 8 bare Yes/No `Radio` pairs → `RadioGroup` (or a single `Checkbox` where GuDApps 4.3.2.3 applies) |
| `smile-admin/(app)/permissions/page.tsx:51` | add `label` or `aria-label` |
| `scw/volunteer/page.tsx:37,116,128`, `scw/sage-registration/page.tsx:66` | raw inputs → `RadioGroup` / `CheckboxGroup` / `Checkbox` |
| `scw/admin/events/add/page.tsx:78` | → `DeclarationCheckbox` |
| `e-anudaan/(ngo)/ngo/attendance/page.tsx:241`, `nmba/.../photos/page.tsx:354,421` | → `Checkbox hideLabel` / `size="sm"` in table cells |
| `components/website/DataModePanel.tsx:82,104` | → `RadioGroup` + `Toggle` |
| `components/nhapoa/ui.tsx:337–382`, `components/tg/ui.tsx:375–420` + consumers | delete private kits, re-baseline `check:shadow-ui` in the same change |
| 27 `design-system/**/*-playground.tsx` + `playground-controls.tsx` | 58 raw checkboxes → `Checkbox size="sm"` |
| `aadhaar-playground.tsx` | delete (orphaned) |
| `Toggle` | `ToggleSize` → `sm \| md`, adopt `useControllableState` |

---

## I. Verification


1. Code branch: `npm run ci` green; `npm test -w @mosje/design-system` shows the five new test files passing; `npm run test:a11y` covers both docs routes with an error state rendered.
2. Browser: open `/design-system/components/forms/checkbox` and `/radio` at 3007 (hub `npm run dev`), screenshot every specimen at 1×/2×, forced-colors, reduced-motion, 375px; confirm the 44px hit area by clicking 12px outside the box at md.
3. Figma: `get_screenshot` every variant of all five sets; run the tokenisation audit (empty hardcoded list); `check:figma-index:live` and `check:figma-docs:live` green with the token.
4. PR body carries the before/after table, the flagged decisions, and the follow-up inventory.
