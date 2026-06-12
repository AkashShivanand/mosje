# @mosje/design-system — Changelog

All notable changes are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Versions track `package.json`.

---

## [0.5.0] — 2026-06-12

### Added
- **AppSwitcher** (`zone-switcher.tsx`) — searchable cross-zone control panel replacing ZoneSwitcher.
  Full keyboard nav: `/` focuses search, Escape closes, Tab/Shift+Tab trapped in dialog, roving tabindex on theme swatches. (`A11Y-006/007`)
- **`app-switcher-utils.ts`** — `deriveAbbr()`, `filterApps()`, `matchActivePath()`, `DEFAULT_APPS` registry; 32 Vitest unit tests. (`QA-015`)
- **`--ds-warning-tonal`** and **`--ds-success-tonal`** tokens added to `tokens.css`.
- **Explicit `React.JSX.Element` return types** on all exported function components. (`TS-006`)
- **`@security` JSDoc** on `colorModeInitScript` explaining XSS safety. (`SEC-009`)

### Changed
- DEFAULT_APPS ordering now matches `apps/hub/src/data/portals.ts` (SMILE before E-Utthan). (`DS-008`)
- `ColorModeProvider`, `ColorModeSwitcher`, `FormField` return types made explicit.
- `ZoneSwitcher`, `Zone`, `ZoneSwitcherProps`, `DEFAULT_ZONES` kept as deprecated shims.

### Fixed
- `role="list"` / `role="group"` ARIA nesting corrected in AppSwitcher body. (`A11Y-007`)
- Focus trap + focus-return in AppSwitcher dialog. (`A11Y-006`)
- `Map.get()` non-null assertions replaced with null guards. (`TS-005`)

---

## [0.4.0] — 2026-06-08

### Added
- `ColorModeProvider` + `ColorModeSwitcher` — `data-color-mode` brand-axis theming with SSR-safe `colorModeInitScript()`.
- `--ds-gov-navy`, `--ds-saffron`, `--ds-gov-yellow` brand tokens.
- 17 atom components: Button, Card, Badge, Alert, Chip, Avatar, Loader, Search, FormField, Radio, EmptyState, and more.
- Vitest config for design-system package.

### Changed
- Token contract frozen via `npm test -w @mosje/tokens` — breaking changes require a version bump.

---

## [0.3.0] — 2026-05-01

### Added
- `@mosje/tokens` DTCG source → Style Dictionary pipeline generating `--ds-*` / `--sa-*` CSS custom properties, TS module, Tailwind v3 preset, Tailwind v4 `@theme`.

---

## [0.1.0] — 2026-04-01

### Added
- Initial package scaffold; `cn()` utility; stub exports.
