# @mosje/design-system — Changelog

All notable changes are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Versions track `package.json`.

---

## [0.7.4] — 2026-09-05

### Fixed
- **Inverse outlined and text buttons painted their label navy-on-navy.** `.ds-btn--inverseOutlined` and `.ds-btn--inverseText` took `--_c-inv-on`, the brand blue that sits on the filled inverse button's white ground; they now take the secondary-inverse ink. `IconButton` inherits the fix.
- **`Link` `tone="inverse"` was unreadable on the brand ground** for the same reason; it now uses the secondary-inverse ink. Asserted in link-css.test.ts.
- **`Link` `size="sm"` and `size="lg"` rendered identically** (label-1 and body-2 are both 14px). The standalone ramp is body-2 / body-1 / title-1: 14 → 16 → 18-and-up.
- **`IconButton` `loading` drew the spinner over the glyph.** The glyph gives way to the spinner; the name and `aria-busy` stay. Asserted in icon-button.spec.tsx.

All four were found by drawing the arrangements sections for the Actions group.

## [0.7.3] — 2026-09-05

### Changed
- **`BotCheck` shows its help link where the check can defeat someone, not everywhere.** Always in `challenge` mode (distorted characters are a sensory barrier), and in every mode once the check has failed. An idle, verifying or verified checkbox no longer carries "Cannot complete this check?" beneath it. `helpHref` stays required. Asserted in bot-check.spec.tsx; the Figma master's nine variants match.

### Fixed
- **`BotCheck` checkbox mode in Figma:** the nested Checkbox kept a 36px empty body beside its hidden label, so the gesture label sat 56px from the box; it now sits 8px from it, as in code.

## [0.7.2] — 2026-09-05

### Fixed
- **A disabled `CheckboxGroup` or `RadioGroup` now paints every option disabled.** The native `<fieldset disabled>` disabled the inputs, but the drawn box and circle read `data-disabled` from their own root, so the options looked enabled while they were not. The group passes `disabled` down to each option; asserted in control-group.spec.tsx.

## [0.7.1] — 2026-09-04

### Added
- **`cardLayout="detailed"` and `meta` on the card variant** of Checkbox, Radio and both groups: the scheme tile — a 64px tinted icon tile, title, description, a meta fact to choose by, and the control trailing on the right. Follows the Figma `Selection Card` set's new `Layout` axis (40 variants). `SelectionCardLayout` exported.

## [0.7.0] — 2026-09-04

### Added
- **Checkbox / Radio — the industry-ceiling rebuild.** Three sizes (`sm` 16 · `md` 20 · `lg` 24, hit area 24 · 44 · 48 from the target ladder), `defaultChecked` (uncontrolled), `description` via `aria-describedby`, `error` (Checkbox) and `invalid`, `readOnly` that keeps its tab stop, `required` with marker and native attribute, `labelPlacement`, `hideLabel`, `variant="card"` with `icon` on both atoms, `onCheckedChange`. One shared `SelectionControl` markup, so the two cannot drift.
- **RadioGroup / CheckboxGroup** — `forwardRef`, `defaultValue`, `disabled` (native fieldset), `readOnly`, `size`, `labelPlacement`, `hideLegend`, per-option `description`, `icon`, `reveal` (conditional reveal) and `exclusive` ("none of the above" after an "or" divider). `CheckboxGroup` gains `name` (posted on every box) and `selectAll`; `variant="card"` now works on it. `RadioGroup` is `role="radiogroup"`.
- **Tokens** `control/selection/size|glyph|dot/{sm,md,lg}`, `control/selection/border/width` (2px), `control/selection/radius`, `control/selection/gap`.
- **Tests**: `checkbox.spec.tsx`, `radio.spec.tsx`, `control-group.spec.tsx` (vitest, `react-dom/server`), `control-group-logic.test.ts`, `selection-css.test.ts` (no raw px or duration in the selection stylesheets).
- `CheckboxProps`, `RadioProps`, `ToggleProps`, `ToggleSize` and the `Selection*` types are exported from the barrel.
- **Figma** (`3FF5l0SMNIwdpZrKkeyPTm`): Checkbox 15 → 45 variants and Radio 10 → 30, keys preserved; `Selection Card` (20), `Checkbox Group` and `Radio Group` (4 each) new; Documentation and Component record frames on both pages; Index cards Ready. Code Connect templates `checkbox`, `radio`, `selection-card`, `checkbox-group`, `radio-group` with fixtures; the parity checker matches a fixture by node id so one code component can be served by two sets.

### Changed
- The visible box is 20px at the default size (was a hardcoded 18px on no scale); the border is 2px (was 1.5px). Disabled is painted in tokens, not `opacity: .5`.
- `controls.css` is split into `selection-control.css`, `checkbox.css`, `radio.css` and `toggle.css`; every transition uses the motion tokens and is removed under `prefers-reduced-motion`; forced colours paints the checked fill and the dot in `Highlight`.
- `checked` and `onChange` are optional on Checkbox and Radio; `value` and `onChange` are optional on the groups.

### Fixed
- `aria-checked` is no longer set on the native checkbox (ARIA in HTML prohibits it); the DOM `indeterminate` property is what exposes the mixed state.
- `aria-invalid` / `aria-required` were set on a plain `<fieldset>` (role `group`), which does not permit them — axe `aria-allowed-attr`. The radio group now carries them on `role="radiogroup"`; the checkbox group puts `aria-invalid` on each box.
- `CheckboxGroup` accepted `variant` and ignored it, dropped `description`, and posted no `name`.
- The card variant's description was inside the `<label>`, so it was read as part of the option's NAME.
- `PortalLoginTemplate` passed `hint:` to a group option whose field is `description`; the per-method text was silently dropped.
- `.ds-control-group.is-invalid` had no stylesheet rule.

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
