# AGENTS.md — `@mosje/design-system`

Instructions for AI coding agents working in this package or building UI that
consumes it. (Human contributors: see `README.md` and `CHANGELOG.md`.)

## Read first

**[`design.md`](./design.md) is the design contract.** Read it before writing or
changing any UI — it defines the token vocabulary, theming axes, component
inventory, and the non-negotiable rules. Do not invent visual values.

Also in force:
- `.claude/rules/design-system.md` — path-scoped rules for this package.
- Root `CLAUDE.md` — estate-wide conventions and standing instructions.

## The two hard rules

1. **Tokens, not values.** Style only with the `--ds-*` CSS custom properties
   (or `@mosje/design-system`'s exports). No raw hex / px / rgba / shadows. A
   missing value is a token gap — add it in `packages/tokens/src/`, never inline.
2. **One component, one definition.** Import components from
   `@mosje/design-system`; never re-implement a Button/Card/etc. per app.

## Edit map

- **Tokens** → `packages/tokens/src/{primitive,semantic,component}.json`
  then `npm run build -w @mosje/tokens` && `npm test -w @mosje/tokens`.
  **Never** edit generated files (`tokens.css`, `tokens.ts`, `dist/*`,
  `packages/config/tailwind-preset.cjs`).
- **Components** → `packages/design-system/components/<category>/`.
- **Figma sync** → `/sync-figma`.

## Before you finish

- `npm test -w @mosje/tokens` passes (token contract intact).
- Consuming apps still build.
- Review with the `design-system-guardian` agent; audit pages with
  `accessibility-auditor`.
- **If you changed a token, a component, or synced Figma:** update `design.md`
  (bump its "Last reviewed" date), this file if the inventory changed, and the
  portal docs — and verify `/design-system/llms.txt` still lists everything.
  This sync is required by `.claude/rules/design-system.md`.
