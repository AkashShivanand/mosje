---
paths:
  - "packages/design-system/**"
  - "packages/config/**"
---

# Design-system rules (`packages/design-system/` — the Figma-synced source of truth)

This package is the **single source of truth** for the visual language across all 13 sites + 20 portals, kept **100% in sync with the Figma library** via Code Connect. It is intentionally empty until phase 2 (see `/sync-figma`).

## Principles
- **Tokens first.** Define color/spacing/typography/radius as tokens (CSS variables + a TS export), named to match the Figma variables 1:1. Apps consume tokens; they never hardcode.
- **One component, one definition.** Each shared component (Button, Card, Header pieces, nav, etc.) lives here once and is imported as `@mosje/design-system`. No per-app forks.
- **Framework-agnostic where possible.** Tokens as plain CSS vars + a Tailwind preset (`packages/config`) so both Tailwind v4 (website) and v3 (portals) can consume the same values.
- **Code Connect.** Every exported component maps to its Figma component; keep mappings validated.

## When extracting (phase 2)
1. Reconcile code tokens ↔ Figma variables (`/sync-figma <url>`); agree one canonical set.
2. Move tokens here first, then components, refactoring `dosje` to import them; then portals.
3. Don't break apps mid-extraction — verify each app still builds after each move.
4. Version the package; changes here ripple to every property, so review with `design-system-guardian`.
