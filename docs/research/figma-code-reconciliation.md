# Figma (UX4G DS) ↔ Code Reconciliation — Website

Read-only mapping of the **MoSJE – UX4G Design System** (Figma `T3bkN5gNKfaNeY6dpT6FwF`) against the current `dosje/` code tokens & components. Source inventory: `figma-ux4g-ds.md`. **No code changed yet — pending approval.**

## 1. Color tokens

| Concept | Figma UX4G DS | Current code token | Status |
|---|---|---|---|
| Primary | `primary/source` **#0373DF** | `gov-blue` #0373DF | ✅ **exact match** |
| Primary tonal | `primary/100` #C6DCF9 | — | ➕ add `primary-tonal` |
| Primary hover/pressed | opacity-90 + shadow (no separate token) | `gov-blue-dark` #014B92 | ⚠ DS uses opacity; we have a darker shade → keep `gov-blue-dark` for hover, add focus ring `rgba(3,115,223,.48)` |
| Success | `success/source` **#2E7D32** | (SAMAVESH "Explore" used #198754) | ⚠ **adopt #2E7D32** (replace #198754) |
| Success tonal | `success/100` #C8E6C9 | — | ➕ add |
| Danger/Error | `danger/source` **#EC5042** | shadcn `destructive` | ⚠ align `destructive` → #EC5042 |
| Ink (headings) | `text/dark` #1F2428 · `text/ink` #212121 | `ink` #1F2124 | ≈ align `ink` → #212121 |
| Body/hint text | `text/hint` #343A40 | `ink-muted` #1F2937 | ≈ keep; add `text-hint` #343A40 |
| Surface base | white · `neutral/50` **#F8F9FA** | `surface-muted` #F8F9FA | ✅ **exact match** |
| Doc panel | #F4F3F9 | — | ➕ add `surface-alt` |
| Border | `stroke/100` #F1F3F5 · `stroke/200` #E2E6EA | ad-hoc gray-200 | ➕ add `border`/`border-strong` |
| Saffron (SAMAVESH) | brand, not in atom DS | `saffron` #F97316, `saffron-light` #FFEDD5 | keep — MoSJE brand layer |
| Yellow / Warning | DS Warning unresolved (SVG mask; likely amber) | `gov-yellow` #FFD323 | confirm via live selection; tentatively map Warning→amber |
| Info | DS Info unresolved (SVG mask; likely blue) | — | confirm |

**Net:** primary + surface + font already correct. Changes: success green, danger, ink hex, + new tokens (tonal, strokes, neutral scale, semantic warning/info).

## 2. Typography
DS = **Noto Sans** (matches), roles Headings + Label&Body, weights 400/500/600.
Named scale to adopt as tokens: Display-5 48/56 · Title-1 22/28 · Title-2 16/24/.15 · Title-3 14/20/.1 · Headline-5 20/24/600 · Body-1 16/24/.5 · Body-2 14/20/.25 · Body-3 12/16/.4 · Label-1 14/20/.1 · Label-2 12/16/.5 · Label-3 11/16/.5.
Code today: Noto Sans wired, but sizes are ad-hoc per component → **adopt the named type scale**.

## 3. Radius / sizing
DS radius scale: none 0 / xxs 2 / xs 4 / sm 6 / **md 8 (default control)** / pill 100. Buttons px-24 py-10, h-40 (default)/48 (large). Search h-56. Checkbox 18, radius 4. Avatars 24/32/40/48.
Code today: ad-hoc `rounded-lg`(8)/`rounded-xl` → **adopt the radius scale** (md=8 default already aligns).

## 4. Components — Figma DS ↔ code

| Figma DS atom | Code today | Action |
|---|---|---|
| **Button** (Primary/Success/Danger × Filled/Outlined/Text/Tonal × 5 states × 3 sizes × icon) | shadcn `button.tsx` (basic) | **rebuild to DS variant matrix** |
| **Card** (Vertical/Horizontal × Outlined/Elevated, slots) | inline card markup in pages | **extract `Card` to DS** |
| **Badge**, **Chip**, **Checkbox**, **Radio**, **Toggle**, **Avatar**, **Alert/Toast**, **Loader**, **Empty State** | not built | ➕ **build into DS** |
| **Search** (states + AI/voice slots) | inline in Header | extract → DS `Search` |
| **Accessibility Bar & Widget** (text size, line-height, spacing, contrast, color, language, skip-link, TTS, dark) | referenced in compliance checklist only | ➕ **build UX4G a11y widget** |
| Header / Mega-nav / DataTable / Breadcrumb / PageHero / Footer | built (app components) | keep as **app compositions** of DS atoms (not atomic DS) |

## 5. Proposed canonical token set → `packages/design-system`
- `tokens.css` (CSS variables) + `tokens.ts` (typed export) + Tailwind preset in `packages/config` (consumable by Tailwind v4 *and* v3).
- Color: `--color-primary #0373DF` (+tonal, hover via shade, focus ring), `--color-success #2E7D32` (+tonal), `--color-danger #EC5042`, `--color-ink #212121`, `--color-ink-muted #343A40`, `--color-surface #fff`, `--color-surface-muted #F8F9FA`, `--color-surface-alt #F4F3F9`, `--color-border #F1F3F5`, `--color-border-strong #E2E6EA`, neutral scale, + MoSJE brand layer (`--color-saffron #F97316`, `--color-gov-yellow #FFD323`).
- Type scale tokens (Display/Title/Headline/Body/Label) + radius scale (2/4/6/8/100).

## 6. Open items to confirm
- **Warning/Info** semantic hexes (DS uses SVG-mask icons; resolve via live selection or icon fills).
- Portal DS (`u5eMCdX3a3mMZgnsHNn8XX`) — separate reconciliation when we do the portals.

## 7. Proposed next steps (need approval)
1. Adopt the UX4G DS token values as canonical (incl. success #2E7D32, danger #EC5042, ink #212121, new tonal/stroke/type/radius tokens).
2. Extract `packages/design-system` (tokens + Tailwind preset) and refactor `dosje` to consume it.
3. Build the missing DS atoms (Button matrix, Card, Badge, Chip, Checkbox, Radio, Toggle, Avatar, Alert/Toast, Loader, Empty State, Search, A11y widget).
4. Wire **Code Connect** mapping each DS atom ↔ its Figma component.
