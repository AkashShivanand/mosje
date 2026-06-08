# Contributing to SAMAVESH

Thanks for improving the MoSJE design system. This guide covers the common changes. See
`GOVERNANCE.md` for the lifecycle, versioning, and review model.

## Setup

```bash
npm install                      # workspace install (packages/*)
npm run build -w @mosje/tokens   # generate the token artifacts
```

## Golden rules

- **Never hardcode values.** Use semantic tokens (`--ds-*` / `--sa-color-*` semantic names).
  Raw hex and Tier-1 primitives (`--sa-color-<palette>-<step>`) are blocked by token-lint.
- **Edit tokens at the source.** Change `packages/tokens/src/*.json`, then
  `npm run build -w @mosje/tokens`. Never hand-edit generated `dist/`, `design-system/tokens.css`,
  or `config/tailwind-preset.cjs`.
- **Accessibility is non-negotiable** — WCAG 2.2 AA + GIGW: semantic HTML, labels, keyboard
  support, visible focus, AA contrast, ≥44px targets.

## Changing a token

1. Edit the right tier in `packages/tokens/src/`: `primitive.json` (raw, private),
   `semantic.json` (the public contract), `component.json`.
2. `npm run build -w @mosje/tokens && npm test -w @mosje/tokens` (contract must stay green).
3. Commit the regenerated artifacts.

## Adding / changing a component

1. Follow the existing pattern: `"use client"`, `forwardRef`, `cn()`, a dependency-free
   `.ds-*` CSS file referencing tokens (no hex).
2. Export it from `packages/design-system/index.ts`; add its CSS to `components.css`.
3. Add a **doc page + stories** in `apps/docs` following the 13-section template
   (purpose · anatomy · when to use/not · variants · states · behavior/keyboard ·
   **accessibility** · **content/voice (EN+HI)** · code/props · responsive · evidence ·
   related · changelog).
4. Run the gates locally:
   ```bash
   npm run typecheck -w @mosje/design-system
   npx stylelint --config .stylelintrc.tokens.json packages/design-system/components/<file>.css
   npm --prefix apps/dosje run build   # estate still builds
   ```
5. Update `CHANGELOG.md`. New components land as **Alpha** (see lifecycle).

## Commit style

Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`). Keep changes focused; a token or
component change should not bundle unrelated edits.
