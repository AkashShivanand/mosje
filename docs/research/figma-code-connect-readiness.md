# Code Connect Readiness — UX4G DS ↔ @mosje/design-system

**Status:** Code Connect is **not available on the current Figma plan** — it requires a **Developer seat on an Organization/Enterprise plan** (probed 2026-06: `get_code_connect_map` → "You need a Developer seat… to access Code Connect"). The account has Full/expert seats but not a Dev seat with Code Connect entitlement on the UX4G org.

Everything else for the sync is already done: the **code design system is the single source of truth** (`@mosje/design-system`), tokens are UX4G-aligned, and the atoms map 1:1 to the Figma components. When a Dev seat is enabled, wiring Code Connect is a short, mechanical job using the map below.

## Atom ↔ Figma component map (file `T3bkN5gNKfaNeY6dpT6FwF` — MoSJE – UX4G DS)

| Code component (`@mosje/design-system`) | Figma page node | Notes |
|---|---|---|
| `Button` | `2141:296705` | variant × appearance × size × state |
| `Card` (+ sub-parts) | `2141:296707` | outlined/elevated, vertical/horizontal |
| `Badge` | `2141:296703` | primary/success/danger/warning/neutral |
| `Chip` | `2141:296709` | selected/disabled, leading icon, dismiss |
| `Checkbox` | `2141:296710` | checked/indeterminate/disabled |
| `Radio` | `2141:323876` | checked/disabled |
| `Toggle` | `2141:323883` | default/small |
| `Search` | `2141:323878` | md/lg, clearable |
| `Avatar` | `2141:296702` | 24/32/40/48, image/initials/icon |
| `Alert` | `2141:296701` | success/warning/info/error |
| `Loader` | `2141:323879` | sm/md/lg, primary/secondary |
| `EmptyState` | `2141:296719` | basic/simple/custom |
| `AccessibilityWidget` | `2382:295905` | UX4G accessibility bar & widget |

> Node ids above are the **page** containers; when wiring, call `get_context_for_code_connect` on each to get the concrete **component-set** node id + its variant property names, then map props.

## How to wire (when Dev seat is available)
1. Per component, `get_context_for_code_connect(fileKey, <componentSetNodeId>)` → property/variant names.
2. `get_code_connect_suggestions(...)` → review the suggested prop mapping.
3. Author a Code Connect file (`*.figma.tsx`) per atom mapping Figma variant props → our React props (e.g. Figma `Appearance=Outlined` → `appearance="outlined"`).
4. `send_code_connect_mappings(...)` (or `figma connect publish` via the Figma CLI) to publish.
5. Validate in Figma Dev Mode (the component shows our code snippet).

## Interim sync (no Code Connect)
- Tokens: `packages/design-system/tokens.css` is canonical; reconcile against Figma variables in `figma-code-reconciliation.md` when the DS changes.
- Components: keep `figma-ux4g-ds.md` (the extracted spec) updated; changes flow Figma → code manually via `/sync-figma`.
