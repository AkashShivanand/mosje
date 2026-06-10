# Changelog

All notable changes to the SAMAVESH design system. Format: [Keep a Changelog](https://keepachangelog.com);
versioning is [semver](https://semver.org) per package.

## [Unreleased]

### Added
- **`ZoneSwitcher`** (`@mosje/design-system` 0.5.0) — a universal cross-zone launcher
  injected into every app (not the hub). Floating FAB → popover of all estate zones
  (Hub, Website, Portals, Storybook), accessible, token-only, hub-origin links that work
  from inside any basePath-ed zone.

### Fixed
- **Hub routing for Storybook** — `/storybook/` now loads through the hub (Storybook's
  relative assets proxy correctly); `/design-system` redirects there until the docs portal
  ships. Removed the self-redirect loop caused by Next path normalization.

### Changed
- **All component CSS is now strict-token-lint clean** — removed ~106 raw hex values (82 var()
  fallbacks dropped; 24 genuine values tokenized). New tokens: `status.successStrong`,
  `status.dangerStrong`, `status.dangerTonal`, and an `a11y.{hc,dark}` palette group for the
  accessibility widget. CI now lints **all** component CSS with the strict config; the relaxed
  `.stylelintrc.tier1.json` was removed.

### Added
- **`@mosje/docs`** — Storybook documentation portal (`apps/docs`) with a11y addon and
  light/dark/high-contrast + density toolbar toggles; foundations + component stories.
- **Governance** — `GOVERNANCE.md` (component lifecycle, semver, deprecation), `CONTRIBUTING.md`,
  and CI quality gates (`.github/workflows/ds-quality.yml`).

## [@mosje/design-system 0.4.0] — 2026-06-08

### Added
- Form layer: **`Input`, `Textarea`, `Select`, `FormField`** — accessible, token-driven,
  ≥44px targets, with focus/error/disabled states and compact-density support.
- Self-verifying **typecheck** for the package (`tsconfig.json` + `tsc`, strict +
  `noUncheckedIndexedAccess`).

### Fixed
- Latent `undefined` access in the accessibility widget's focus trap (caught by the new typecheck).

## [@mosje/tokens 0.1.0] — 2026-06-07

### Added
- DTCG token source (primitive / semantic / component tiers) compiled by **Style Dictionary v4**
  to CSS, TS, Tailwind v3 preset, Tailwind v4 `@theme`, and a Figma DTCG export.
- Themes: **light / dark / high-contrast**; density **comfortable / compact**; multi-script
  (Latin + Devanagari) font tokens.
- **Backward-compatible `--ds-*` contract**, verified by a snapshot contract test (50 tokens).
- **Token-lint** gate (`.stylelintrc.tokens.json`) — bans raw hex + Tier-1 primitive use.

## [Repository] — 2026-06-07/08

### Changed
- Consolidated the estate into a single `mosje` monorepo: `apps/` (dosje · portals · docs) +
  `packages/` (tokens · design-system · config). Former independent app repos absorbed;
  histories preserved in `_backups/`, the old `smile-admin-portal` GitHub repo archived.
