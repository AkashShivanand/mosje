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

## UX4G 3.0 is the foundation — and it is a SPEC, not a dependency

SAMAVESH is built against UX4G Design System 3.0 (MeitY/NeGD), the mandated standard.

- **Never `npm install ux4g-web-components`, and never apply `ux4g-*` CSS classes to
  markup.** That package is a 7.6 MB stylesheet plus a 286 KB runtime that scans and
  rewrites the DOM (11 MutationObservers, 42 `innerHTML` writes). React 19 owns the nodes
  it renders; the two models cannot both be right, and it breaks hydration in Next 16.
  Rationale and figures: `docs/ux4g/UX4G-Code-Readiness-Audit.md`.
- **Write React components against `--ds-*`.** That is how conformance is achieved here.
- `--ux4g-*` names exist for interop only, via the **opt-in**
  `@mosje/design-system/ux4g.css`. Import it when rendering UX4G-authored markup or
  demonstrating conformance — not by default.
- **Prefer the semantic spacing roles** `--ds-inline-*` / `--ds-stack-*` /
  `--ds-padding-*` / `--ds-section-*` (adopted verbatim from UX4G) over the raw
  `--ds-spacing-*` t-shirt scale. They state intent; the t-shirt scale states a number.
- Conformance is measured, not asserted: `node tools/ux4g-conformance/measure.mjs`.
  If you add or remove a component, update `tools/ux4g-conformance/component-map.json`
  in the same change or the coverage figure silently lies.

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
  `Modal`, `SideSheet` (right-anchored drawer), `Lightbox` (mixed image/video gallery viewer), `Stepper`,
  `SlaProgressIndicator` (Right to Service Act time-remaining; linear/circular/badge, with a
  neutral PAUSED state for time the applicant owns — never hand-roll a days-left badge),
  `ToastProvider`/`useToast`, `Alert`, `Badge`, `Loader`, `EmptyState`,
  `Skeleton`/`SkeletonText`/`SkeletonRow` (shaped loading placeholders — use these, not
  `Loader`, whenever the eventual shape is known), `Tooltip` (hover **and** focus hint;
  WCAG 1.4.13 dismissible/hoverable/persistent, portalled so Card and DataTable overflow
  cannot clip it — never hand-roll one from `title=`) (feedback); `FormSection`, `FormCard`, `Wizard`/`ReviewSection`/`ReviewItem`, `FormField`,
  `MediaUpload` (single file/image upload), `MediaGalleryInput` (multi image/video upload),
  `GeoPhotoInput` (geo-tagged evidence photos with EXIF/device location + auto-downscaling),
  `DeclarationCheckbox` (statutory certification panel), the **identity controls**
  `AadhaarInput` / `OtpInput` / `PanInput` (UX4G 3.0 parity — Verhoeff-checked and
  masked-by-default Aadhaar, six-box OTP with paste + SMS autofill, holder-type-validating
  PAN; **never** hand-roll these as an `<Input>` + regex), `PasswordInput` (reveal toggle —
  use for **every** password field; never `<Input type="password">` plus a hand-rolled eye,
  which is how the submit-on-toggle bug and the missing accessible name get reintroduced)
  `Label` (standalone label for controls **outside** `FormField`) and the input atoms
  (forms); `SectionTitle` (the shared eyebrow/heading/count/actions row — never hand-roll a
  `flex justify-between` with its own heading classes) (layout);
  `ApprovalTimeline` (multi-tier approval audit trail, data-display); `SiteHeader`, `SidebarNav`, `Footer`,
  `AppSwitcher`, `Tabs`/`TabPanel` (navigation — note `SidebarNavItem.icon` is a Material
  Symbols NAME STRING, not a component, so nav configs stay serialisable data);
  `PortalLoginShell` (auth); `LiveRegion`/`useLiveRegion` (announce async results that move
  no focus — mount one per page);
  `UX4GAccessibilityWidget` (a11y — **CANONICAL**: the official Government of
  India MeitY/UX4G accessibility widget, the single mechanism for text size,
  spacing, contrast and dark mode across the estate; render it once near the
  end of every root layout, like `AppSwitcher`). The bespoke `AccessibilityWidget`
  reimplementation it replaced has been deleted — Figma's "AccessibilityWidget /
  FAB" component still documents the widget's visual spec.
  Tables, modals, toasts, tabs, charts and dashboards were previously
  hand-rolled per portal — always reuse these.
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
