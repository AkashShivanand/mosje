# Divider — component specification

> SAMAVESH Design System · Figma `3FF5l0SMNIwdpZrKkeyPTm` → page **Divider** (`55061:695`) →
> set **Divider** (`55061:700`, 6 variants) · documentation frame `Divider — Documentation` (`55687:695`).
> Built 2026-08-18 following `.claude/rules/component-authoring.md`.

The estate's thin rule — a 1px hairline between sections, or between controls in a row.

## Why it exists

The master had been in the library since the AccessibilityBar was built and the design system
had **no code counterpart at all**, so every consumer drew its own rule. A census on
2026-08-18 found **23 hand-rolled 1px rules in five different colours**:

| Colour | Sites | What it is |
|---|---:|---|
| `#e2e8f0` | 9 | Tailwind slate-200 — not a token, not a decision |
| `#dcdee1` | 3 | `border/neutral/subtle` — the one that was right |
| `#e5e7eb` | 1 | Tailwind gray-200 — a second default, different habit |
| white @ 20/25/30/40 % | 8 | Four opacities on brand surfaces where one tone was meant |

**If you are about to write `border-top: 1px solid …`, use this component.**

## Code component

`packages/design-system/components/layout/divider.tsx` + `.css`, exported from the barrel.
Story: `apps/storybook/stories/Divider.stories.tsx`. Docs: `/design-system/components/divider`.
Code Connect: `divider.figma.ts`, mapped and live on all 6 variants.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `orientation` | `horizontal \| vertical` | `horizontal` | Figma `Orientation` |
| `tone` | `default \| inverse \| inverse-subtle` | `default` | Figma `Tone` |
| `length` | `string \| number` | — | Omit to stretch. Usually wrong to set. |
| `decorative` | `boolean` | `true` | `false` renders a real `<hr>` |
| `className` | `string` | — | Layout only — not for re-colouring |

## Rules

1. **Tone follows the surface, not the taste.** `default` on light. `inverse` (white) for a rule
   separating **sections** on a dark surface. `inverse-subtle` (white @ 40 %) between **controls**
   inside a brand surface — at full strength a rule reads as loudly as the buttons it divides and
   the controls stop being the subject. That is why the AccessibilityBar uses the subtle one.
2. **`length` stretches by default.** The master's 20px is a *specimen* — the glyph height beside
   it in the bar — not a default. Vertical stretch is `align-self: stretch`, **not** `height: 100%`,
   which resolves against a parent with no height and collapses to nothing.
3. **`decorative` defaults to `true`.** A rule between toolbar controls is presentation;
   announcing "separator" between every pair of buttons is noise. A genuine thematic break passes
   `false` and renders an `<hr>`, which already carries `role="separator"`.
4. **Only the thickness is component-scoped** (`cmp/divider/width` → `ref/border-width/hairline`).
   Tones bind straight to `border/neutral/*` — a rule's colour is a shared semantic.
5. **Never the only signal** (WCAG 1.4.1). Contrast (1.4.11) does not apply to a decorative rule,
   which is why `inverse-subtle` at 40 % is legitimate rather than a failure.

## Tokens

| Spec | Token |
|---|---|
| Thickness | `cmp/divider/width` → `ref/border-width/hairline` (1) |
| Tone default | `border/neutral/subtle` (#dcdee1) |
| Tone inverse | `border/neutral/inverse/default` (#ffffff) |
| Tone inverse-subtle | `border/neutral/inverse/subtle` (#ffffff66) |

> **Two of these were library-only until this component existed.** `border/neutral/inverse` and
> `border/neutral/inverse-subtle` lived in Figma with no name in code — precisely why the bar
> hand-rolled a white `rgba()`. Both were authored in code and **renamed in place in Figma** to
> the nested form (`inverse/default`, `inverse/subtle`): a hyphen inside a segment breaks grammar
> RULE 1, and the library already nested `bolder/default` / `bolder/hover`. VariableIDs were
> preserved, so every existing binding followed. The recorded Colour gap fell from 6 to 4.

## Master board

Organised to the same pattern as the Navbar and AccessibilityBar boards: a grey
`1 · Divider` section → a white card at radius 12 → a `head` frame carrying the name in
`Title/title-2` and a one-line purpose in `Label/label-3` → the component set. The
standalone "Master header" frame was absorbed into `head` and removed.

Variants are laid out as an ordered grid — **columns are Orientation, rows are Tone**
(Default → Inverse → Inverse subtle). **The set carries a brand fill**, which is
deliberate: four of the six variants are white, and on the default light board they were
invisible. A component board that cannot show four of its six variants is not a board.
The Default grey (#dcdee1) reads on the brand fill too, so all six are legible at once.

## Migration status (2026-08-18)

| | Sites | |
|---|---:|---|
| Converted → `tone="default"` | 13 | Normalises `#e2e8f0` / `#e5e7eb` onto `#dcdee1` |
| Converted → `tone="inverse-subtle"` | 1 | Exact match; nothing moved |
| **Open** | 8 | White @ 20/25/30 % on brand surfaces — needs a decision |
| Not a divider | 1 | A 56px saffron accent under a login heading |

The eight open sites are `portal-login-shell` (4), smile-admin auth layout (2), scw `gov-chrome`
(1), nhapoa `citizen-shell` (1). Forcing them to 40 % would visibly change their prominence, so
they need either a standardisation decision or additional tones — flagged rather than moved.

## Adoption note that cost a near-miss

The AccessibilityBar's Device=Mobile collapse selects `.sa-abar__sep`. Swapping its spans for
`<Divider>` **would have left three white rules visible on mobile**, where the whole right-hand
cluster is meant to disappear. The class survives as a paint-free **hook**. Re-verified at 375px:
dividers hidden, font size hidden, skip link still visible.
