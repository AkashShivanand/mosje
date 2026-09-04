# Checkbox — component spec

Source: `packages/design-system/components/forms/checkbox.tsx` (shared markup in
`selection-control.tsx`, group in `control-group.tsx`). Figma: `Checkbox` set `15:664`,
`Checkbox Group` set on the `Checkbox` page. Web docs: `/design-system/components/forms/checkbox`.

## Anatomy

| Part | Element | Token |
|---|---|---|
| Root | `div.ds-selection.ds-checkbox[data-state][data-size][data-variant]` | `--sa-control-selection-gap` between control and body |
| Input | `input.ds-selection__input` — real, visually hidden, **the hit area** | `--sa-target-min` / `-comfortable` / `-spacious` per size |
| Box | `span.ds-checkbox__box` | size `--sa-control-selection-size-*`, edge `--sa-control-selection-border-width` in `--sa-border-neutral-base`, corner `--sa-control-selection-radius`, checked fill `--sa-bg-brand-primary-bolder`, mark `--sa-on-bg-brand-primary-bolder` |
| Mark | `svg.ds-checkbox__mark` (check, or dash when indeterminate) | `--sa-control-selection-glyph-*` |
| Label | `label.ds-selection__label` | `--sa-type-body-2-*`, `--sa-text-neutral-base`; marker `--sa-text-status-error-bolder` |
| Description | `span.ds-selection__description` (`aria-describedby`) | `--sa-type-body-3-*`, `--sa-text-neutral-subtle` |
| Error | `p.ds-selection__error[role=alert]` | `--sa-type-body-3-*`, `--sa-text-status-error-bolder` |
| Card | root `.ds-selection--card` | `--sa-cmp-card-radius`, `--sa-padding-16`, `--sa-inline-12`, `--sa-stroke-1` |

## Sizes

| `size` | Box | Glyph | Hit area | Use |
|---|---|---|---|---|
| `sm` | 16 | 12 | 24 (`target/min`) | dense tables, filter rails — spacing exception of SC 2.5.8 applies |
| `md` (default) | 20 | 16 | 44 (`target/comfortable`) | beside body text; UX4G's 44×44 touch recommendation |
| `lg` | 24 | 20 | 48 (`target/spacious`) | touch-first screens, the card variant; the box alone meets 24×24 |

## States

default · hover (brand edge) · active (brand edge, `bg/brand/primary/subtler` fill) · focus-visible
(`focus/*` outline) · checked · indeterminate · invalid (`border/status/error/bolder`; checked fill
`bg/status/error/bolder`) · read-only (`bg/neutral/subtler`, default cursor, tab stop kept) ·
disabled (`bg/neutral/subtle`, `border/neutral/subtle`, `text/neutral/disabled`, not-allowed).
Forced colours: checked fill `Highlight`, mark `HighlightText`, ring `Highlight`, disabled `GrayText`.
Reduced motion: every transition removed.

## Decisions recorded

- **20px default box (was 18).** Aliases `size/20`; 18 sat on no scale and had no glyph step. Moves
  every existing control by 2px and the row pitch to 44.
- **2px border (was 1.5).** 1.5 anti-aliases below its nominal contrast at 1× density (SC 1.4.11).
- **No `aria-checked`.** ARIA in HTML prohibits it on a native checkbox; the DOM property exposes `mixed`.
- **Checkbox group keeps role `group`.** `aria-required`/`aria-invalid` are not permitted there;
  the asterisk plus a visually hidden "(required)" in the legend, and `aria-invalid` per box.
- **Radio dot `md` is a `10px` literal.** No `size/10` primitive exists and one dot does not earn a step.
- **`aria-expanded` on a checkbox reveal, not on a radio's.** ARIA 1.2 permits it on `checkbox` only.
- **Never pre-checked.** UX4G §7; the Figma master defaults to `Checked=Off`.

## Standards

WCAG 2.2 AA 1.3.1 · 1.4.1 · 1.4.11 · 2.1.1 · 2.4.7 · 2.5.8 · 3.3.1 · 4.1.2 (evidence on the web page's
checklist, each row naming its test). GIGW 5.2.8 · 5.2.45. DBIM Annexure B.iv, B.v, B.ix, B.xii.
UX4G §3 (44 touch), §6 (describedby, aria-invalid, focus), §7 (no pre-checked consent, error
formula). GuDApps 4.3.2.2–4.3.2.3.

## Tests

`checkbox.spec.tsx`, `control-group.spec.tsx`, `control-group-logic.test.ts`, `selection-css.test.ts`;
`e2e/a11y/axe.spec.ts` visits the docs route with an error state rendered.
