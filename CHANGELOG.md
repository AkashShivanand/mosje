# Changelog

All notable changes to the SAMAVESH design system. Format: [Keep a Changelog](https://keepachangelog.com);
versioning is [semver](https://semver.org) per package.

## [Unreleased]

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
