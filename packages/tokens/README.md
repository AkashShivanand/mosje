# @mosje/tokens

SAMAVESH design tokens. **DTCG JSON source → Style Dictionary v4 → CSS / TS / Tailwind / Figma.**
The single source of truth for the visual language across the MoSJE estate.

## Source of truth

Edit the DTCG JSON in `src/` — never the generated `dist/` (or generated `tokens.css` / `tailwind-preset.cjs` in sibling packages):

| File | Tier | Visibility |
|------|------|------------|
| `src/primitive.json` | 1 — primitive/reference (raw palette, scales) | **private** — never use in app code |
| `src/semantic.json` | 2 — semantic/alias (the public contract) | **public** — apps consume only this tier |
| `src/component.json` | 3 — component (resolve to semantic) | internal to components |

Themes & density live in `$extensions.mosje.themes` on a token: `dark`, `hc` (high-contrast), `compact`.

## Build & test

```bash
npm run build -w @mosje/tokens   # regenerate all outputs
npm test  -w @mosje/tokens       # assert the legacy --ds-* contract + figma export
```

## Outputs

| Export | File | Consumer |
|--------|------|----------|
| `@mosje/tokens/css` | `dist/tokens.css` | reference; also generated into `@mosje/design-system/tokens.css` |
| `@mosje/tokens/ts` | `dist/tokens.ts` | typed nested `tokens` object for JS/TS |
| `@mosje/tokens/tailwind-v4` | `dist/tokens-tailwind.css` | dosje (`@theme inline`) |
| `@mosje/tokens/tailwind-v3` | `dist/tailwind-v3.cjs` | reference; also generated into `@mosje/config/tailwind-preset.cjs` |
| `@mosje/tokens/figma` | `dist/figma.tokens.json` | Tokens Studio import (Figma round-trip) |

The CSS emits `:root` with `--sa-*` (new tiered names) **plus** the legacy `--ds-*` contract
(back-compat, so existing consumers like `dosje` never break), plus `[data-theme="dark"]`,
`[data-theme="hc"]`, and `[data-density="compact"]` override blocks.

## Naming

- New names: `--sa-<path-joined-by-hyphens>` (e.g. `--sa-color-action-primary-default`).
- Themes: `<html data-theme="dark">`, `data-theme="hc"`, `data-density="compact"`.
- Multi-script: `--sa-font-family-latin`, `--sa-font-family-devanagari` (Indic gets extra leading).

## Rules

App/component code consumes **semantic** tokens only. Raw hex and Tier-1 primitives
(`--sa-color-<palette>-<step>`) are blocked by `.stylelintrc.tokens.json` (CI gate).
The backward-compatible `--ds-*` contract is verified on every build by `test/build-output.test.mjs`
against the frozen `test/legacy-snapshot.json`.
