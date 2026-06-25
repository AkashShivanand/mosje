# AGENTS.md — `@mosje/design-system`

Instructions for AI coding agents working in this package or building UI that
consumes it. (Human contributors: see `README.md` and `CHANGELOG.md`.)

## Read first

**[`design.md`](./design.md) is the design contract.** Read it before writing or
changing any UI — it defines the token vocabulary, theming axes, component
inventory, and the non-negotiable rules. Do not invent visual values.

**[`INFORMATION-ARCHITECTURE.md`](./INFORMATION-ARCHITECTURE.md) is the structural
contract.** It defines the taxonomy (where a new token/component/page belongs), the
**Universal Core vs Brand Layer** split that makes the system white-labellable, and
the rule that the docs nav + `llms.txt` are *generated* from one registry. Any brand
swap happens via a **brand pack** (`brands/<id>/`) — never by forking a component.

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
- **Components** → `packages/design-system/components/<category>/`. The full,
  authoritative inventory is the barrel `index.ts` — import from there, don't
  re-implement. Shared primitives now include (beyond the atoms): `DataTable`,
  `MetricCard` (data-display); the **data-visualisation layer**
  (`PieChart`, `DonutChart`, `BarChart`, `LineChart`, `AreaChart`, `Sparkline`,
  `Gauge`, `Progress`, `FunnelChart`, `ScatterChart`, `Heatmap`, `ComboChart`,
  `IndiaMap`) — dependency-free, token-driven, theme-aware, accessible SVG, with
  `ChartCard`/`DashboardGrid`/`KpiRow`/`FilterBar`/`SegmentedControl` for
  dashboard composition (`components/data-display/charts/` + `components/dashboard/`);
  `Modal`, `Stepper`,
  `ToastProvider`/`useToast`, `Alert`, `Badge`, `Loader`, `EmptyState`
  (feedback); `FormSection`, `FormCard`, `Wizard`/`ReviewSection`/`ReviewItem`, `FormField`,
  `MediaUpload` (file/image upload) and the input atoms (forms); `SiteHeader`, `SidebarNav`, `Footer`,
  `AppSwitcher`, `Tabs`/`TabPanel` (navigation); `PortalLoginShell` (auth). Tables, modals, toasts,
  tabs, charts and dashboards were previously hand-rolled per portal — always reuse these.
  Chart geometry for `IndiaMap` is generated — see
  `components/data-display/charts/geo/README.md`; never hand-edit `*.paths.ts`.
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
