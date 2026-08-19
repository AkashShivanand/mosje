# Code Connect Readiness — SAMAVESH library ↔ @mosje/design-system

> **SUPERSEDED 2026-08-18 — Code Connect is LIVE.** Everything below the line was
> written while the feature appeared to be blocked on entitlement. It is kept because
> the reasoning is still instructive, but **do not act on its status claims.**

## Current state (2026-08-18, verified)

| | |
|---|---|
| Entitlement | **Works.** `get_code_connect_map` returns real mappings, not a permission error. |
| Templates | **7** parserless `*.figma.ts`, colocated with their components |
| Config | `figma.config.json` at the repo root |
| Dependency | `@figma/code-connect` **v2.0.0**, devDependency of `packages/design-system` |
| AccessibilityBar | **Connected on all 9 variants** (`55065:33766`) |
| Drift gate | `npm run check:code-connect` — in `npm run check` and CI |

**The one thing still not automatic.** Mappings are *connected* — Dev Mode resolves the
component, its source and its import. The **rich templated snippet**, where props are
filled from the selected Figma instance, is only published by the CLI:

```bash
npm run figma:connect:check -w @mosje/design-system   # dry run, no token needed
npm run figma:connect       -w @mosje/design-system   # needs FIGMA_ACCESS_TOKEN
```

The MCP `send_code_connect_mappings` tool creates **simple** mappings only — it accepts a
`template` argument but the published record still comes back `hasTemplate: false`
(verified twice on 2026-08-18, once against the component set and once against a single
variant). So the CLI is the only path to a full template, and it needs the token.

**`FIGMA_ACCESS_TOKEN` is a secret.** No agent session creates, reads or commits it — a
human sets it locally or as a repository secret. Until it is set, the connection is real
but the snippet stays generic.

**Two config traps, both hit and fixed on 2026-08-18:**

1. `figma.config.json` carried `"parser": "react"`. That is the **v1 parser-based**
   setting; CLI v2 refuses to run with it (*"Framework-specific parsers are no longer
   supported"*) even though every template here is parserless. Removed.
2. `accessibility-bar.figma.ts` hardcoded its full Figma URL while the other six used the
   `<SAMAVESH>` substitution from the config. Normalised.

**`.figma.ts` is excluded from the design-system tsconfig** (`exclude: ["**/*.figma.ts"]`),
so TypeScript never sees these files. That is why `check:code-connect` exists: without it,
a renamed prop or a deleted Figma property leaves every gate green and Dev Mode serving a
snippet that does not compile.

---

## Original 2026-06 assessment (superseded — status claims are wrong)

**Status: BLOCKED ON PLAN, and nothing is mapped.** Code Connect requires a
**Developer seat on an Organization/Enterprise plan**. Probed 2026-06
(`get_code_connect_map` → *"You need a Developer seat… to access Code Connect"*) and
re-checked **2026-08-12**: `get_code_connect_map` on the Iconography page returns `{}`,
and the repo contains **zero** `*.figma.ts(x)` files, no `@figma/code-connect`
dependency, and no `figma.config.json`.

**Do not "get ahead" by authoring mapping files now.** They cannot be published without
the entitlement, and a tree full of unpublishable `*.figma.tsx` reads as a finished
integration to the next person. The gap is a licence, not a missing afternoon.

**What actually keeps code and Figma in sync today** is not Code Connect — see
*Interim sync* at the bottom. Tokens flow through `@mosje/tokens`; the Iconography
size scale and the 223-icon catalogue are **generated** from Figma rather than
hand-kept, which is why that page survives without Code Connect. Everything else is
manual and therefore drifts — the 2026-08-12 Iconography audit found a stale callout
and a mis-prefixed variable that a published mapping would not have caught anyway.

## Atom ↔ Figma component map (file `3FF5l0SMNIwdpZrKkeyPTm` — SAMAVESH Design System)

> **File key corrected 2026-08-12.** This table previously named
> `T3bkN5gNKfaNeY6dpT6FwF` ("MoSJE – UX4G DS") while listing node ids that belong to
> the **SAMAVESH** library — the ids match `FIGMA_NODES` in
> `apps/hub/src/lib/design-system/figma.ts`, whose file is `3FF5l0SMNIwdpZrKkeyPTm`.
> Left alone, the "short, mechanical job" below would have started against the wrong
> file. (A third key, `qyzTEy8dlb3ssYctlkMX5o`, resolves to the same SAMAVESH document
> and survives only in dated audit records.)

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
| `Icon` | **`55030:701`** (component set) · page `2316:246` | Added 2026-08-12. The set holds **7 size variants** (`Size=16 · 20 · 24 · 32 · 40 · 48 · 64`), matching `iconSize`. Unusually simple to map: Figma's `Size` variant → our `size` prop, and Figma's `icon` **text property** → our `name` prop, taking the same snake_case ligature verbatim. `weight`/`fill` have no Figma axis (Figma exposes cuts as named styles), so they map to defaults. |

> Node ids above are the **page** containers; when wiring, call `get_context_for_code_connect` on each to get the concrete **component-set** node id + its variant property names, then map props.

## How to wire (when Dev seat is available)
1. Per component, `get_context_for_code_connect(fileKey, <componentSetNodeId>)` → property/variant names.
2. `get_code_connect_suggestions(...)` → review the suggested prop mapping.
3. Author a Code Connect file (`*.figma.tsx`) per atom mapping Figma variant props → our React props (e.g. Figma `Appearance=Outlined` → `appearance="outlined"`).
4. `send_code_connect_mappings(...)` (or `figma connect publish` via the Figma CLI) to publish.
5. Validate in Figma Dev Mode (the component shows our code snippet).

## Interim sync (no Code Connect)
- **Tokens** are synced via `@mosje/tokens` (DTCG → Style Dictionary). Source of truth: `packages/tokens/src/*.json`; `npm run build -w @mosje/tokens` regenerates `tokens.css`/`tokens.ts`/Tailwind presets + the Figma DTCG export (`packages/tokens/dist/figma.tokens.json`). Run `/sync-figma` to pull Figma variable changes into the DTCG source, or import `figma.tokens.json` into Figma (Tokens Studio) to push code → Figma. `npm test -w @mosje/tokens` asserts the `--ds-*` contract.
- **Components**: keep `figma-ux4g-ds.md` (the extracted spec) updated; changes flow Figma → code manually until Code Connect is enabled (the node map above makes that wiring quick).
