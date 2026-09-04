# Radio — component spec

Source: `packages/design-system/components/forms/radio.tsx` (shared markup in
`selection-control.tsx`, group in `control-group.tsx`). Figma: `Radio` set `18:791`,
`Radio Group` and `Selection Card` sets on the `Radio` page. Web docs:
`/design-system/components/forms/radio`.

## Anatomy

| Part | Element | Token |
|---|---|---|
| Root | `div.ds-selection.ds-radio[data-state][data-size][data-variant]` | `--sa-control-selection-gap` |
| Input | `input.ds-selection__input` — real, visually hidden, **the hit area** | `--sa-target-*` per size |
| Circle | `span.ds-radio__circle` | `--sa-control-selection-size-*`, edge `--sa-control-selection-border-width` in `--sa-border-neutral-base`, `--sa-shape-full` |
| Dot | `span.ds-radio__dot` (scale 0 → 1 on `:checked`) | `--sa-control-selection-dot-*`, `--sa-bg-brand-primary-bolder` |
| Label / Description | as Checkbox | as Checkbox |
| Group | `fieldset.ds-control-group[role=radiogroup]` + `legend` + hint + options + error | `control-group.css` |
| Reveal | `div.ds-control-group__reveal[hidden]` | `--sa-stack-8`, `--sa-inline-16` inset, `--sa-stroke-2` rail |

## Sizes

Same ladder as Checkbox: circle 16 / 20 / 24, dot 8 / 10 / 12, hit area 24 / 44 / 48.

## States

default · hover · active · focus-visible · checked · invalid (edge and dot in the error colours) ·
read-only · disabled. Forced colours: selected edge and dot `Highlight`. Reduced motion: no transition.
A single Radio has **no `error`** — the group owns the message and paints every circle via `invalid`.

## Group semantics

- `role="radiogroup"` on the fieldset: `aria-required`, `aria-invalid`, `aria-describedby` all permitted.
- `value` may be `undefined`; the component never invents a selection (DBIM B.xi's pre-selected default
  is the form's decision, via `defaultValue`).
- Vertical by default (DBIM B.xi, GuDApps 4.3.2.2); `orientation="horizontal"` wraps.
- `reveal` is always in the DOM, hidden with `hidden`; the option carries `aria-controls`. No
  `aria-expanded` on a radio (ARIA 1.2) — a recorded divergence from GOV.UK.

## Decisions recorded

Shared with Checkbox: 20px default, 2px border, no `aria-checked`, never pre-selected by the
component. Radio-specific: dot is half the circle (Material/Carbon ratio); `Selection Card` in Figma
is one set with a `Control = Radio | Checkbox` axis, replacing the kebab-case `radio-card` that
depended on an external asset.

## Standards

WCAG 2.2 AA 1.3.1 · 1.4.11 · 2.1.1 · 2.4.7 · 2.5.8 · 3.3.1 · 4.1.2. GIGW 5.2.8 · 5.2.45. DBIM B.iv, B.v,
B.ix, B.xi. UX4G §3, §6, §7. GuDApps 4.3.2.2 (vertical, clickable label, "None", no nesting), 4.3.2.3.

## Tests

`radio.spec.tsx`, `control-group.spec.tsx`, `control-group-logic.test.ts`, `selection-css.test.ts`;
`e2e/a11y/axe.spec.ts` visits the docs route with an error state rendered.
