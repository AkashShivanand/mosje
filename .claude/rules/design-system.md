---
paths:
  - "packages/design-system/**"
  - "packages/config/**"
  - "packages/tokens/**"
---

# Design-system rules (`packages/design-system/` — the Figma-synced source of truth)

This package is the **single source of truth** for the visual language across all 13 sites + 20 portals, kept **100% in sync with the Figma library** via Code Connect.

**Phase 2 is underway.** Tokens are authored as DTCG JSON in `@mosje/tokens` (`packages/tokens/src/*.json`) and compiled by Style Dictionary v4 into the `--ds-*`/`--sa-*` CSS contract, a TS module, the Tailwind v3 preset (`@mosje/config`) and v4 `@theme`, and a Figma DTCG export. **Edit tokens in `packages/tokens/src/`, never in generated artifacts** (`packages/tokens/dist/`, `packages/design-system/tokens.css`, `packages/config/tailwind-preset.cjs`). Run `npm run build -w @mosje/tokens` to regenerate and `npm test -w @mosje/tokens` to assert the backward-compatible contract.

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

## AI design context — keep these THREE in sync (mandatory)

The system is built to be consumed by AI agents. Three artifacts make that work
and **must stay in lockstep with the tokens, the components, and the Figma
library** — they are the design system's contract for machines:

- **`packages/design-system/design.md`** — the authoritative AI design context
  (token vocabulary, theming axes, component inventory, non-negotiable rules).
  Never hand-copy token *values* into it; it points to the generated SoT.
- **`packages/design-system/AGENTS.md`** — the agent entrypoint (read-first +
  edit map + finish checklist).
- **`apps/docs/src/app/llms.txt/route.ts`** → served at `/design-system/llms.txt`
  — generated from `apps/docs/src/lib/nav.ts`, so it self-syncs with the portal.

**The rule:** any change to a token, a component, or a Figma sync MUST also:
1. Update `design.md` (and `AGENTS.md` if the component inventory changed) and
   bump the `Last reviewed` date in `design.md`.
2. Update the SAMAVESH portal (`apps/docs`) — the relevant foundation/component
   page **and** `apps/docs/src/lib/nav.ts` if pages were added/removed (this
   keeps `llms.txt` correct automatically).
3. Re-run `npm run build -w @mosje/tokens` && `npm test -w @mosje/tokens`.

This is enforced as a step in `/sync-figma` and in the `design-system-guardian`
review. Treat docs/tokens/Figma drift as a defect, not a follow-up.

## Changelog freshness (enforced in CI)

The changelog at `apps/hub/src/app/design-system/resources/changelog/page.tsx`
is hand-maintained and therefore rots quietly — it once sat two months and 40
commits behind while still badged "Current". `scripts/check-changelog-freshness.mjs`
fails **Design System Quality** when a notable commit (feat / fix / perf, or
anything BREAKING) has touched `packages/design-system` or `packages/tokens`
since the newest entry and has gone unlogged past a 14-day grace window.
Commits typed `docs` / `chore` / `test` / `style` / `ci` / `build` are ignored.

- Run it locally with `npm run check:changelog`.
- `CHANGELOG_GRACE_DAYS=<n>` widens the window for a deliberate exception.
- `CHANGELOG_PATH=<file>` points it at a fixture — that is how the gate itself
  is exercised, because a check nobody has watched fail cannot be trusted.
- The CI checkout uses `fetch-depth: 0`; on a shallow clone the gate skips
  rather than reporting a false red.
