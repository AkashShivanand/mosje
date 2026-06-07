# @mosje/design-system

Shared design tokens + components for the MoSJE digital estate, aligned to the **UX4G Figma DS**. Consumed by the website (`dosje`, Tailwind v4) and the portals (`portals/*`, Tailwind v3 via `@mosje/config`).

## Token-sync system (no Code Connect required)

Code Connect needs a Figma **Developer seat** (Org/Enterprise) we don't have, so sync is done with a lightweight token pipeline instead:

```
        Figma UX4G DS                     packages/design-system
   ┌───────────────────┐   /sync-figma   ┌────────────────────────┐
   │ variables (colors, │ ──────────────► │ tokens.json  (SOURCE)  │
   │ type, radius)      │  MCP extract +  │        │ build:tokens   │
   └───────────────────┘  drift-check    │        ▼                │
                                          │ tokens.css + tokens.ts  │
                                          │        │               │
                                          │        ▼ consumed by    │
                                          │ dosje + portals + atoms │
                                          └────────────────────────┘
```

- **`tokens.json`** — the single source of truth. Edit this (or sync from Figma), never the generated files.
- **`build-tokens.mjs`** (`npm run build:tokens`) — generates `tokens.css` (CSS vars `--ds-*`) and `tokens.ts` (typed) from `tokens.json`. Eliminates css↔ts drift.
- **`check-drift.mjs`** (`npm run check:drift -- <snapshot.json> [--write] [--complete]`) — diffs a Figma snapshot against `tokens.json`; `--write` applies Figma values.
- **`figma-token-map.json`** — our token names ↔ Figma variable names (used to normalise a Figma pull).
- **`/sync-figma`** — the agent workflow: pull Figma variables via the MCP → normalise → `check-drift` → on approval `--write` + `build:tokens` → verify dosje builds.

### Common tasks
- **Add / change a token:** edit `tokens.json` → `npm run build:tokens` → rebuild apps.
- **Refresh from Figma:** run `/sync-figma` (or manually: produce a snapshot, `check-drift --write`, `build:tokens`).
- **CI guard (optional):** `node check-drift.mjs <figma-snapshot.json> --complete` exits non-zero on drift.

## Components
13 token-driven atoms (semantic CSS + `--ds-*`, portable across Tailwind majors): `Button`, `Card` (+ sub-parts), `Badge`, `Chip`, `Checkbox`, `Radio`, `Toggle`, `Search`, `Alert`, `Loader`, `EmptyState`, `Avatar`, `AccessibilityWidget`. Import from the root:

```tsx
import { Button, Card, Badge } from "@mosje/design-system";
```

Each atom ships its own CSS (auto-bundled). `components.css` is a barrel for non-bundled consumers. Component ↔ Figma node map for future Code Connect: `docs/research/figma-code-connect-readiness.md`.

## Consuming
- **Website (Tailwind v4):** `dosje/src/app/globals.css` imports `@mosje/design-system/tokens.css` and maps `--ds-*` → Tailwind theme; `next.config.ts` sets `transpilePackages` + `turbopack.root`; `tsconfig` sets `preserveSymlinks`.
- **Portals (Tailwind v3):** import `@mosje/config/tailwind-preset` + `@mosje/design-system/tokens.css`.
