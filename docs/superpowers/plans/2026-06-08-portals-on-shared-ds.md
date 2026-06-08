# Portals on the Shared @mosje Design System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `apps/portals/pm-ajay` and `apps/portals/smile-admin` onto the shared `@mosje/design-system` + `@mosje/tokens` pipeline, with the portals' navy brand modelled as a **portal theme layer** in the DTCG source — not a per-app fork.

**Architecture:** The Portal DS is the **same UX4G atom set** as the website DS (the Figma `get_metadata` page list — Buttons, Card, Badge, Checkbox, … — maps 1:1 to our 13 atoms). The portals differ only in **brand**: they use navy `#003366` as the primary action (the website uses gov-blue `#0373DF`). We add a `[data-brand="portal"]` theme to `@mosje/tokens` that overrides the `--sa-color-action-*` / `--sa-color-status-*` semantics to the portal values. Because `--ds-*` and the Tailwind v3 preset both alias `--sa-*` via `var()`, setting `data-brand="portal"` on `<html>` re-points every portal utility and atom to navy automatically — one source of truth, two brands. Each portal then installs `@mosje/design-system` as a `file:` dep (mirroring dosje: `transpilePackages` + `preserveSymlinks`), imports `@mosje/design-system/tokens.css`, and swaps bespoke UI for the shared atoms.

**Tech Stack:** DTCG JSON + Style Dictionary v4 (`@mosje/tokens`); React 19 + TS atoms (`@mosje/design-system`); Tailwind v3 preset (`@mosje/config`); Next.js 15 portals (smile-admin: Tailwind v3.4 + Radix + webpack build; pm-ajay: currently no Tailwind — added in Phase 3).

---

## Phase ordering & independence

- **Phase 0** (pre-flight) and **Phase 1** (portal theme tokens) are the **shared prerequisite** for both portals. Do them first.
- **Phase 2 (smile-admin)** and **Phase 3 (pm-ajay)** are **independent** of each other and each independently shippable. Either order; do not block one on the other.
- **Phase 4** commits.

This plan covers three subsystems (tokens, smile-admin, pm-ajay). Per `writing-plans` scope guidance they could be three separate plans; they are kept together here because they share the token foundation and the same reconciliation context. Each portal phase produces a working, buildable app on its own.

## File map (what gets created / modified)

**Phase 1 — `@mosje/tokens` (regenerates artifacts in design-system + config):**
- Modify: `packages/tokens/src/primitive.json` — add navy/accent/green/amber primitives.
- Modify: `packages/tokens/src/semantic.json` — add `portal` entries to `$extensions.mosje.themes` on action + status tokens.
- Modify: `packages/tokens/build/formats/legacy-ds-css.mjs` — emit a `[data-brand="portal"]` block from the `portal` theme key.
- Create: `packages/tokens/test/portal-theme.test.mjs` — asserts the portal block exists with navy values and that `:root` defaults are untouched.
- Generated (do NOT hand-edit): `packages/tokens/dist/*`, `packages/design-system/tokens.css`, `packages/config/tailwind-preset.cjs`.

**Phase 2 — `apps/portals/smile-admin`:**
- Modify: `package.json` (add `@mosje/design-system` file: dep), `next.config.ts` (transpilePackages + turbopack root), `tsconfig.json` (preserveSymlinks), `tailwind.config.ts` (consume preset), `src/app/globals.css` (import tokens.css), `src/app/layout.tsx` (`data-brand="portal"`).
- Modify (atom swap): files under `src/components/ui/` and their call sites.

**Phase 3 — `apps/portals/pm-ajay`:**
- Create: `tailwind.config.ts`, `postcss.config.mjs`.
- Modify: `package.json` (add tailwindcss/postcss/autoprefixer + `@mosje/design-system`), `next.config.ts`, `tsconfig.json`, `src/app/globals.css` (replace bespoke `:root` token block with shared contract), `src/app/layout.tsx` (`data-brand="portal"`).
- Modify (atom swap): the PM-AJAY dashboard component(s).

---

## Reconciliation decisions baked into this plan

The portal theme **overrides** (navy brand surface), everything else **converges** to the unified DS:

| Semantic token | Website default | Portal theme override | Primitive added |
|---|---|---|---|
| `action.primary.default` | `#0373df` | **`#003366`** (navy) | `color.navy.700` (exists) |
| `action.primary.hover` | `#014b92` | **`#002b55`** | `color.navy.800` |
| `action.primary.tonal` | `#c6dcf9` | **`#e5eff9`** | `color.navy.50` |
| `focus.ring` | `rgba(3,115,223,.48)` | **`rgba(0,51,102,.30)`** | — (literal) |
| `status.info` | `#0373df` | **`#1558b0`** (portal interactive accent) | `color.accent.500` |
| `status.success` | `#2e7d32` | **`#198754`** (portal green source) | `color.green.600` |
| `status.warning` | `#ffd323` | **`#bb772b`** (portal amber, legible pill text) | `color.amber.500` |
| `status.danger` | `#ec5042` | _(converges — already identical)_ | — |
| neutrals / type / radius / shadow / spacing | unified DS | _(converges)_ | — |

> **Visual-review flag:** portal-local success `#198754` and warning amber `#bb772b` are preserved as portal theme overrides (so existing accessible pills stay legible). Portal neutral ramps (Tailwind-gray in pm-ajay, slate in smile-admin) **converge** to the UX4G neutrals; confirm contrast on the dashboards after wiring. These hexes are the code-mirror values (pm-ajay `globals.css` is the labelled "faithful port" of the Portal DS). If a Figma Dev seat / live desktop selection becomes available, re-confirm via Phase 0.

---

## Phase 0 — Pre-flight (do once, ~5 min)

**Files:** none (diagnostic only).

- [ ] **Step 1: Confirm the tokens pipeline is green before any edit**

Run: `npm run build -w @mosje/tokens && npm test -w @mosje/tokens`
Expected: `✓ @mosje/tokens built` then both tests pass (build-output, figma-export). If this is red before you start, stop and fix the baseline first.

- [ ] **Step 2: Confirm the portals build today (baseline)**

Run: `npm --prefix apps/portals/smile-admin run build` and `npm --prefix apps/portals/pm-ajay run build`
Expected: both succeed. Record any pre-existing warnings so you don't misattribute them later.

- [ ] **Step 3 (optional, only if a Figma Dev seat / live desktop selection is available): confirm Portal DS hexes**

The Figma MCP node tools (`get_variable_defs`, `get_design_context`) require a **live selection in Figma desktop** on this plan tier — they return "nothing selected" otherwise. `get_metadata` works via the file API and already confirmed the Portal DS page inventory matches our atoms (file `u5eMCdX3a3mMZgnsHNn8XX`). If you can open the Portal DS in desktop and select the **Buttons** or **Color-Styles** frame, run `get_variable_defs` and reconcile any hex that differs from the table above. Otherwise proceed code-first (authorised fallback) — the table values come from the faithful code mirror.

---

## Phase 1 — Portal brand theme in `@mosje/tokens`

**Files:**
- Modify: `packages/tokens/src/primitive.json`
- Modify: `packages/tokens/src/semantic.json`
- Modify: `packages/tokens/build/formats/legacy-ds-css.mjs:74` and `:86-92`
- Test: `packages/tokens/test/portal-theme.test.mjs`

### Task 1.1 — Add portal primitives

- [ ] **Step 1: Add navy/accent/green/amber primitives to `primitive.json`**

In `packages/tokens/src/primitive.json`, replace the `navy` and `green` lines and add `accent` + `amber`. The `color` block becomes:

```json
    "blue":   { "50": {"$value":"#c6dcf9"}, "500": {"$value":"#0373df"}, "700": {"$value":"#014b92"} },
    "accent": { "50": {"$value":"#e8f0fe"}, "500": {"$value":"#1558b0"} },
    "green":  { "50": {"$value":"#c8e6c9"}, "500": {"$value":"#2e7d32"}, "600": {"$value":"#198754"} },
    "amber":  { "500": {"$value":"#bb772b"}, "700": {"$value":"#8c571f"} },
    "red":    { "500": {"$value":"#ec5042"} },
    "yellow": { "500": {"$value":"#ffd323"} },
    "saffron":{ "50": {"$value":"#ffedd5"}, "500": {"$value":"#f97316"}, "700": {"$value":"#7c3503"} },
    "navy":   { "50": {"$value":"#e5eff9"}, "700": {"$value":"#003366"}, "800": {"$value":"#002b55"} },
```

Leave `neutral`, `space`, `radius`, `font`, `shadow` unchanged.

- [ ] **Step 2: Rebuild and confirm the existing contract still passes**

Run: `npm run build -w @mosje/tokens && npm test -w @mosje/tokens`
Expected: build succeeds; both existing tests pass (new primitives are additive — `--ds-*` defaults and `figma.tokens.json` checked values are unchanged). The new `--sa-color-accent-*`, `--sa-color-navy-50/800`, `--sa-color-green-600`, `--sa-color-amber-*` vars now appear in `packages/design-system/tokens.css` `:root`.

### Task 1.2 — Declare the portal theme on semantic tokens

- [ ] **Step 1: Add `portal` theme entries in `semantic.json`**

In `packages/tokens/src/semantic.json`, add a `portal` key inside `$extensions.mosje.themes` for the action + focus + status tokens. The `action`, `focus`, and `status` blocks become:

```json
    "action": {
      "primary": {
        "default": {"$value":"{color.blue.500}", "$extensions":{"mosje":{"themes":{"portal":"{color.navy.700}"}}}},
        "hover":   {"$value":"{color.blue.700}", "$extensions":{"mosje":{"themes":{"portal":"{color.navy.800}"}}}},
        "tonal":   {"$value":"{color.blue.50}",  "$extensions":{"mosje":{"themes":{"portal":"{color.navy.50}"}}}}
      }
    },
```

```json
    "focus": { "ring": {"$value":"rgba(3, 115, 223, 0.48)", "$extensions":{"mosje":{"themes":{"portal":"rgba(0, 51, 102, 0.30)"}}}} },
    "status": {
      "success": {"$value":"{color.green.500}", "$extensions":{"mosje":{"themes":{"portal":"{color.green.600}"}}}},
      "warning": {"$value":"{color.yellow.500}", "$extensions":{"mosje":{"themes":{"portal":"{color.amber.500}"}}}},
      "danger":  {"$value":"{color.red.500}"},
      "info":    {"$value":"{color.blue.500}", "$extensions":{"mosje":{"themes":{"portal":"{color.accent.500}"}}}}
    },
```

Leave `text`, `bg`, `border`, `brand`, `type`, `density` unchanged (note `text.default`/`bg.*`/`border.*` already carry `dark`/`hc` themes — do not disturb those).

> Note: this only declares the data. It will not appear in CSS output until Task 1.3 teaches the format to emit a `portal` block.

### Task 1.3 — Emit a `[data-brand="portal"]` block from the format

- [ ] **Step 1: Write the failing test**

Create `packages/tokens/test/portal-theme.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const root = new URL("..", import.meta.url).pathname;

test("portal brand block overrides primary to navy without touching :root default", () => {
  execSync("npm run build", { cwd: root });
  const css = readFileSync(root + "dist/tokens.css", "utf8");

  // :root default stays gov-blue
  assert.match(css, /:root[\s\S]*--sa-color-action-primary-default:\s*#0373df;/);

  // a [data-brand="portal"] block exists and repoints the primary to navy
  const block = css.match(/\[data-brand="portal"\]\s*\{([\s\S]*?)\}/);
  assert.ok(block, "missing [data-brand=\"portal\"] block");
  assert.match(block[1], /--sa-color-action-primary-default:\s*#003366;/);
  assert.match(block[1], /--sa-color-action-primary-hover:\s*#002b55;/);
  assert.match(block[1], /--sa-color-status-info:\s*#1558b0;/);
  assert.match(block[1], /--sa-color-focus-ring:\s*rgba\(0, 51, 102, 0\.30\);/);
});

test("design-system tokens.css mirror also contains the portal block", () => {
  const css = readFileSync(root + "../design-system/tokens.css", "utf8");
  assert.match(css, /\[data-brand="portal"\]/);
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `node --test packages/tokens/test/portal-theme.test.mjs` (from repo root, or `npm test -w @mosje/tokens`)
Expected: FAIL — no `[data-brand="portal"]` block yet (the format only emits dark/hc/compact).

- [ ] **Step 3: Teach `legacy-ds-css.mjs` to handle the `portal` theme**

In `packages/tokens/build/formats/legacy-ds-css.mjs`, change the `themeMap` initializer (line 74) to include `portal`:

```js
    const themeMap = { dark: [], hc: [], compact: [], portal: [] };
```

Then in the `themeBlocks` array (lines 86-92), add a portal entry (a brand selector, not a `data-theme`):

```js
    const themeBlocks = [
      themeMap.dark.length ? `[data-theme="dark"] {\n${themeMap.dark.join("\n")}\n}` : "",
      themeMap.hc.length ? `[data-theme="hc"] {\n${themeMap.hc.join("\n")}\n}` : "",
      themeMap.compact.length ? `[data-density="compact"] {\n${themeMap.compact.join("\n")}\n}` : "",
      themeMap.portal.length ? `[data-brand="portal"] {\n${themeMap.portal.join("\n")}\n}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
```

(The existing loop at lines 75-85 already resolves `{color.x.y}` refs to `var(--sa-color-x-y)` — but for the test we asserted **literal hexes**. See Step 4.)

- [ ] **Step 4: Decide ref-resolution — emit literal hexes in theme blocks**

The existing theme loop emits `var(--sa-...)` for `{...}` refs. For the portal block we want **literal hexes** so the override is self-contained and the test passes. Change the resolver inside the loop (lines 78-83) to resolve primitive refs to their final value using the dictionary. Replace the loop body with:

```js
    const byPath = new Map(dictionary.allTokens.map((t) => [t.path.join("."), val(t)]));
    for (const t of dictionary.allTokens) {
      const themes = t.original?.$extensions?.mosje?.themes;
      if (!themes) continue;
      for (const [theme, v] of Object.entries(themes)) {
        const resolved =
          typeof v === "string" && v.startsWith("{")
            ? (byPath.get(v.slice(1, -1)) ?? `var(--sa-${v.slice(1, -1).split(".").join("-")})`)
            : v;
        if (themeMap[theme]) themeMap[theme].push(`  --sa-${t.path.join("-")}: ${resolved};`);
      }
    }
```

This makes `dark`/`hc` blocks emit literal hexes too (e.g. `--sa-color-text-default: #ffffff;` instead of `var(--sa-color-neutral-0)`) — equivalent values, self-contained. Confirm the existing `build-output` test still passes (it only resolves `--ds-*` in `:root`, unaffected).

- [ ] **Step 5: Rebuild and run the full token test suite**

Run: `npm run build -w @mosje/tokens && npm test -w @mosje/tokens`
Expected: PASS — `portal-theme.test.mjs` (2 tests) + `build-output.test.mjs` (2) + `figma-export.test.mjs` (1) all green. `packages/design-system/tokens.css` and `packages/config/tailwind-preset.cjs` are regenerated; the `[data-brand="portal"]` block is present in `tokens.css`.

- [ ] **Step 6: Confirm dosje (website) is unaffected**

Run: `npm --prefix apps/dosje run build`
Expected: succeeds and renders gov-blue (no `data-brand` set → `:root` defaults apply). This proves the portal theme is opt-in and non-breaking.

- [ ] **Step 7: Commit Phase 1**

```bash
git add packages/tokens/src/primitive.json packages/tokens/src/semantic.json \
  packages/tokens/build/formats/legacy-ds-css.mjs packages/tokens/test/portal-theme.test.mjs \
  packages/tokens/dist packages/design-system/tokens.css packages/config/tailwind-preset.cjs
git commit -m "feat(tokens): add portal brand theme (navy) via [data-brand=\"portal\"] layer"
```

---

## Phase 2 — smile-admin onto the unified DS

smile-admin is the real Tailwind v3 consumer (v3.4.1, Radix, ~40 routes, `src/components/ui/*`). Wire the shared tokens + preset, flip on the portal brand, then converge its `ui` atoms onto `@mosje/design-system`.

**Files (wiring):** `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`.

### Task 2.1 — Install the shared package + mirror dosje's resolution

- [ ] **Step 1: Add the file: dependency**

In `apps/portals/smile-admin/package.json`, add to `dependencies`:

```json
    "@mosje/design-system": "file:../../packages/design-system",
```

Run: `npm --prefix apps/portals/smile-admin install`
Expected: a symlink at `apps/portals/smile-admin/node_modules/@mosje/design-system → ../../../packages/design-system`.

- [ ] **Step 2: transpilePackages + turbopack root in `next.config.ts`**

Replace `apps/portals/smile-admin/next.config.ts` with:

```ts
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@mosje/design-system"],
  turbopack: {
    // Monorepo root is two levels up (apps/portals/smile-admin → repo root is 3 up).
    root: path.resolve(process.cwd(), "..", "..", ".."),
  },
};

export default nextConfig;
```

> Note: smile-admin `dev` uses `--turbopack`; `build` uses webpack. `transpilePackages` covers both. The `turbopack.root` only affects dev.

- [ ] **Step 3: preserveSymlinks in `tsconfig.json`**

In `apps/portals/smile-admin/tsconfig.json` `compilerOptions`, add:

```json
    "preserveSymlinks": true,
```

(Place it next to `"moduleResolution": "bundler"`, matching dosje.)

- [ ] **Step 4: Verify the import resolves (typecheck)**

Temporarily add to the top of `src/app/page.tsx`: `import { Badge } from "@mosje/design-system";` then run `npm --prefix apps/portals/smile-admin run typecheck`.
Expected: no "cannot find module @mosje/design-system" error. Remove the temporary import afterward.

### Task 2.2 — Consume the token preset + flip on the portal brand

- [ ] **Step 1: Import the shared token contract in `globals.css`**

At the very top of `apps/portals/smile-admin/src/app/globals.css` (before `@tailwind base;`), add:

```css
/* Shared MoSJE token contract (--sa-*/--ds-*). Portal brand via data-brand="portal". */
@import "@mosje/design-system/tokens.css";
```

- [ ] **Step 2: Re-point smile-admin's local CSS vars at the shared contract**

In the same `globals.css` `:root` block, replace the hardcoded brand/surface hexes with shared vars so the app renders from the unified tokens (keep the local var **names** — call sites already use them):

```css
:root {
  /* Surface tokens — now sourced from the shared contract */
  --surface: var(--ds-surface);
  --surface-muted: var(--ds-surface-muted);
  --surface-elevated: var(--ds-surface);
  --surface-sunken: var(--ds-surface-alt);
  --border: var(--ds-border);
  --border-strong: var(--ds-border-strong);
  --ring: var(--ds-primary);

  /* Text */
  --foreground: var(--ds-ink);
  --foreground-muted: var(--ds-ink-muted);
  --foreground-hint: var(--ds-ink-muted);

  /* Brand — resolves to navy under [data-brand="portal"] */
  --primary: var(--ds-primary);
  --primary-hover: var(--ds-primary-dark);
  --primary-active: var(--ds-primary-dark);

  /* GIGW accessibility — font scaling (unchanged) */
  --font-scale: 1;
}
```

Leave the `[data-fontscale=…]`, `[data-highcontrast="true"]`, `html`, `body` rules as-is for now (the high-contrast block is a local override and can stay; it does not conflict with the shared `[data-theme="hc"]`).

- [ ] **Step 2b: Consume the Tailwind preset**

In `apps/portals/smile-admin/tailwind.config.ts`, add the preset and keep the existing rich theme (the preset only adds token-backed aliases; the local `extend` wins where names overlap, which is fine). Change the top of the export:

```ts
import type { Config } from "tailwindcss";
import preset from "@mosje/config/tailwind-preset";

export default {
  presets: [preset],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // pick up classes used inside the design-system atoms
    "../../packages/design-system/components/**/*.{ts,tsx}",
  ],
  // … existing theme/extend unchanged …
```

> The preset is plain CJS exporting `{ theme: { extend: {...} } }`; `presets: [preset]` is the correct Tailwind v3 consumption. Adding the design-system `components` glob to `content` ensures atom utility classes aren't purged.

- [ ] **Step 3: Set `data-brand="portal"` on `<html>`**

In `apps/portals/smile-admin/src/app/layout.tsx`, add the attribute to the root `<html>`:

```tsx
    <html lang="en" data-brand="portal" className={noto.variable}>
```

- [ ] **Step 4: Build and verify navy renders**

Run: `npm --prefix apps/portals/smile-admin run build`
Expected: succeeds. Then `preview_start` the smile-admin dev server (port 4123) and confirm primary buttons/links render **navy `#003366`** (use `preview_inspect` on a primary button's `background-color`). This proves the portal brand layer is live end-to-end.

- [ ] **Step 5: Commit the wiring**

```bash
git add apps/portals/smile-admin/package.json apps/portals/smile-admin/package-lock.json \
  apps/portals/smile-admin/next.config.ts apps/portals/smile-admin/tsconfig.json \
  apps/portals/smile-admin/tailwind.config.ts apps/portals/smile-admin/src/app/globals.css \
  apps/portals/smile-admin/src/app/layout.tsx
git commit -m "feat(smile-admin): consume @mosje shared tokens + preset, flip on portal brand"
```

### Task 2.3 — Converge `ui` atoms onto `@mosje/design-system`

smile-admin's `src/components/ui/` overlaps the shared atoms. Converge by **re-exporting** the shared atom from each local file (keeps every call site's `@/components/ui/...` import path working — zero churn at call sites). Do them **one at a time**, building after each.

**Overlap map (local ↔ shared):**

| `src/components/ui/*` | `@mosje/design-system` atom | Action |
|---|---|---|
| `badge.tsx` | `Badge` | re-export (start here — simplest) |
| `alert.tsx` | `Alert` | re-export |
| `empty-state.tsx` | `EmptyState` | re-export |
| `avatar.tsx` | `Avatar` | re-export |
| `checkbox.tsx` | `Checkbox` | re-export (verify Radix vs DS API parity first) |
| `switch.tsx` | `Toggle` | re-export + alias `Switch = Toggle` if names differ |
| `button.tsx` | `Button` | re-export **only if** variant/prop API matches; else defer |
| `card.tsx` | `Card`/`CardHeader`/… | re-export the matching parts |
| `input.tsx`, `label.tsx`, `select.tsx`, `sheet.tsx`, `table.tsx`, `tabs.tsx`, `tooltip.tsx`, `skeleton.tsx`, `live-region.tsx`, `section.tsx` | _(no shared atom)_ | **leave as-is** |

- [ ] **Step 1: Read the local component and the shared atom, compare the public API**

For the first target (`badge.tsx`): Read `apps/portals/smile-admin/src/components/ui/badge.tsx` and `packages/design-system/components/badge/` (the index/types). Confirm prop names (e.g. `variant`/`status`) and that the shared atom covers every variant the local one exposes. If a prop is missing on the shared atom, **stop and flag** — extending the shared atom is a design-system change (review with `design-system-guardian`), not a portal change.

- [ ] **Step 2: Re-export the shared atom from the local file**

If APIs match, replace the body of `apps/portals/smile-admin/src/components/ui/badge.tsx` with a re-export:

```tsx
// Converged onto the shared design system. Local call sites keep importing
// from "@/components/ui/badge"; the implementation now lives in @mosje/design-system.
export { Badge } from "@mosje/design-system";
export type { BadgeProps } from "@mosje/design-system"; // only if exported
```

- [ ] **Step 3: Typecheck + build after this single swap**

Run: `npm --prefix apps/portals/smile-admin run typecheck && npm --prefix apps/portals/smile-admin run build`
Expected: passes. If a call site used a prop the shared atom lacks, the typecheck will name it — fix that call site or revert this atom and flag for a DS extension.

- [ ] **Step 4: Visual spot-check**

`preview_start` (or reuse running server) and load a route that uses the swapped atom (e.g. a list page with badges). `preview_snapshot` / `preview_screenshot` to confirm no visual regression.

- [ ] **Step 5: Commit this atom, then repeat Steps 1-4 for the next row in the overlap map**

```bash
git add apps/portals/smile-admin/src/components/ui/badge.tsx
git commit -m "refactor(smile-admin): converge Badge onto @mosje/design-system"
```

Repeat for `alert`, `empty-state`, `avatar`, `checkbox`, `switch`, then the higher-risk `button`/`card`. **One atom per commit, build green between each.** Stop the convergence at any atom whose API doesn't match and record it as a DS-extension follow-up rather than forcing it.

---

## Phase 3 — pm-ajay onto the unified DS

pm-ajay has **no Tailwind today** — a single hand-authored `src/app/globals.css` (~560 lines of bespoke `.pm-*`/`.ud-*` classes) and a dashboard component. The user chose the **full Tailwind + atoms** path. This phase: (a) add Tailwind v3 + the preset + the shared package, (b) re-point pm-ajay's token block at the shared contract, (c) migrate bespoke surfaces to atoms + token-backed Tailwind utilities. Steps a-b are deterministic; step c is iterative and gated by builds.

**Files (setup):** `package.json`, `next.config.ts`, `tsconfig.json`, new `tailwind.config.ts`, new `postcss.config.mjs`, `src/app/globals.css`, `src/app/layout.tsx`.

### Task 3.1 — Add Tailwind v3 + shared package

- [ ] **Step 1: Add dependencies**

In `apps/portals/pm-ajay/package.json`, add to `dependencies`:

```json
    "@mosje/design-system": "file:../../packages/design-system",
```

and to `devDependencies`:

```json
    "tailwindcss": "^3.4.1",
    "postcss": "^8",
    "autoprefixer": "^10.4.20"
```

Run: `npm --prefix apps/portals/pm-ajay install`
Expected: symlink created; tailwind/postcss installed.

- [ ] **Step 2: Create `postcss.config.mjs`**

Create `apps/portals/pm-ajay/postcss.config.mjs`:

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

- [ ] **Step 3: Create `tailwind.config.ts` consuming the preset**

Create `apps/portals/pm-ajay/tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";
import preset from "@mosje/config/tailwind-preset";

export default {
  presets: [preset],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/design-system/components/**/*.{ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 4: transpilePackages + turbopack root in `next.config.ts`**

Replace `apps/portals/pm-ajay/next.config.ts` with:

```ts
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@mosje/design-system"],
  turbopack: {
    root: path.resolve(process.cwd(), "..", "..", ".."),
  },
};

export default nextConfig;
```

- [ ] **Step 5: preserveSymlinks in `tsconfig.json`**

In `apps/portals/pm-ajay/tsconfig.json` `compilerOptions`, add `"preserveSymlinks": true` next to `"moduleResolution": "bundler"`.

### Task 3.2 — Add Tailwind layers + re-point the token block

- [ ] **Step 1: Prepend Tailwind directives + the shared contract to `globals.css`**

At the **very top** of `apps/portals/pm-ajay/src/app/globals.css` (above the existing Google Fonts `@import`s — note `@import` must precede other statements, so put the font `@import`s first, then these), restructure the head so order is: font `@import`s → `@import "@mosje/design-system/tokens.css";` → `@tailwind` directives → existing rules. Concretely, insert after the two `@import url(...font...)` lines:

```css
@import "@mosje/design-system/tokens.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 2: Re-point pm-ajay's brand/semantic vars at the shared contract**

In the first `:root` block (the "UX4G Design System — Colors & Type" block, lines ~12-75), replace the **brand/semantic** source values with shared vars, keeping the local var names so the ~560 lines of `.pm-*`/`.ud-*` rules keep working:

```css
  /* ─── Brand — Primary (navy via [data-brand="portal"]) ─── */
  --primary-500: var(--ds-primary);        /* #003366 under portal brand */
  --primary-600: var(--ds-primary-dark);   /* #002b55 */
  --primary-50:  var(--ds-primary-tonal);  /* #e5eff9 */
  --primary: var(--ds-primary);

  /* ─── Secondary (success) — converged ─── */
  --secondary-500: var(--ds-success);      /* portal #198754 */
  --secondary-600: var(--ds-success);
  --secondary: var(--ds-success);

  /* ─── Danger / Warning — converged ─── */
  --danger-500: var(--ds-danger);          /* #ec5042 */
  --danger: var(--ds-danger);
  --warning-500: var(--ds-warning);        /* portal amber #bb772b */
  --warning: var(--ds-warning);
```

Keep the remaining shade stops (`--primary-100…900`, neutral ramp, radii, shadows, type families) for now — they are referenced widely and converging them is the iterative work in Task 3.3. Map radii/shadows to shared where 1:1 (`--radius-md: var(--ds-radius-md);` etc.) opportunistically.

- [ ] **Step 3: Set `data-brand="portal"` on `<html>`**

In `apps/portals/pm-ajay/src/app/layout.tsx`, change `<html lang="en">` to:

```tsx
    <html lang="en" data-brand="portal">
```

- [ ] **Step 4: Build + visual baseline**

Run: `npm --prefix apps/portals/pm-ajay run build`
Expected: succeeds (Tailwind now active; no utility classes used yet so output is near-identical). `preview_start` pm-ajay (port 4124), `preview_screenshot` the dashboard — it should look **unchanged** except brand blues now resolve through the shared navy token. This is the safe checkpoint before any atom migration.

- [ ] **Step 5: Commit the pm-ajay wiring**

```bash
git add apps/portals/pm-ajay/package.json apps/portals/pm-ajay/package-lock.json \
  apps/portals/pm-ajay/postcss.config.mjs apps/portals/pm-ajay/tailwind.config.ts \
  apps/portals/pm-ajay/next.config.ts apps/portals/pm-ajay/tsconfig.json \
  apps/portals/pm-ajay/src/app/globals.css apps/portals/pm-ajay/src/app/layout.tsx
git commit -m "feat(pm-ajay): add Tailwind v3 + @mosje preset/tokens, flip on portal brand"
```

### Task 3.3 — Migrate bespoke surfaces to atoms (iterative)

Most of pm-ajay's surface (KPI ribbons, bento grid, rank rows, gauges, nav chrome) has **no atom equivalent** and stays as token-backed CSS/Tailwind. Only these bespoke patterns map to shared atoms — migrate them one at a time, building + screenshotting after each:

| Bespoke pattern | Shared atom | Notes |
|---|---|---|
| `.pm-status` / `.ud-count` pills | `Badge` | map green/amber/red/blue → Badge status variants |
| `.pm-panel` / `.ud-tile` containers | `Card` (+ `CardHeader`/`CardBody`) | wrap, keep dashboard-specific inner markup |
| `.ud-empty` / `.pm-nodata` | `EmptyState` | |
| `.ud-search` input | `Search` | |
| `.pm-side-foot .av` initials circle | `Avatar` | |
| `.pm-info` info banner | `Alert` (info) | |

**Per-surface recipe (repeat for each row):**

- [ ] Read the dashboard component file(s) under `apps/portals/pm-ajay/src/` that render the pattern (start from `src/app/page.tsx`, which is 5 lines and imports the dashboard component — follow the import to the real file).
- [ ] Read the matching atom under `packages/design-system/components/<atom>/` to learn its props.
- [ ] Replace the bespoke markup for **one** pattern with the atom, mapping classes to props. Keep surrounding dashboard layout untouched.
- [ ] Run `npm --prefix apps/portals/pm-ajay run build`; expect success.
- [ ] `preview_screenshot` the affected section; confirm visual parity (the atoms are token-driven so colors match the portal brand).
- [ ] Commit: `git commit -m "refactor(pm-ajay): use @mosje <Atom> for <pattern>"`.

Stop after the mapped patterns are migrated. The remaining bespoke layout legitimately stays as token-backed CSS (it is a custom data-dashboard, not an atom composition) — do **not** force non-atom surfaces into atoms.

- [ ] **Final build gate for Phase 3:** `npm --prefix apps/portals/pm-ajay run build && npm --prefix apps/portals/pm-ajay run lint` both green; dashboard screenshot matches the Task 3.2 Step 4 baseline (modulo intended atom swaps).

---

## Phase 4 — Verify & wrap

- [ ] **Step 1: Full estate build sweep**

Run, expecting all green:
```bash
npm test -w @mosje/tokens
npm --prefix apps/dosje run build
npm --prefix apps/portals/smile-admin run build
npm --prefix apps/portals/pm-ajay run build
```

- [ ] **Step 2: Design-system guardian review**

Per the design-system rule, changes to `packages/` ripple to every property. Dispatch the `design-system-guardian` agent over the diff (the portal theme tokens + both portals' wiring) to confirm: tokens-not-hardcoded, no per-app forks introduced, Noto Sans preserved, atoms imported (not reimplemented).

- [ ] **Step 3: Accessibility check on the portal brand**

The navy `#003366` on white and the converged neutrals change contrast vs the old portal palettes. Run the `accessibility-auditor` (or `/a11y`) on a representative smile-admin route and the pm-ajay dashboard to confirm WCAG 2.1 AA contrast still holds (especially amber warning pills and muted text on the converged neutral ramp).

- [ ] **Step 4: Update docs**

Append a short "Portal brand theme" note to `docs/research/figma-code-reconciliation.md` (or a new `figma-portal-ds-reconciliation.md`) recording the override table and the code-first provenance, and tick the Portal DS open item (`§6`) in the website reconciliation doc.

- [ ] **Step 5: Final commit / branch wrap**

Use `superpowers:finishing-a-development-branch` to decide merge/PR. Suggested squash message theme: `feat: bring pm-ajay + smile-admin onto shared @mosje design system (portal brand theme)`.

---

## Self-review notes (author)

- **Spec coverage:** (1) Portal DS reconcile → Phase 0/1 (code-first, Figma-confirmed inventory); (2) wire pm-ajay + smile-admin via the v3 preset + tokens.css + file: dep + transpilePackages/preserveSymlinks → Phases 2.1-2.2, 3.1-3.2; (3) swap bespoke UI for atoms → Phases 2.3, 3.3. ✔
- **Gotchas honored:** macOS case-insensitivity (no case-variant dirs created); guard.sh (no `rm -rf`/force-push in plan); webpack vs turbopack (smile-admin builds on webpack, dev on turbopack — `transpilePackages` covers both, `turbopack.root` set for dev); dosje resolution pattern mirrored exactly. ✔
- **Type consistency:** local var names in both portals are preserved across re-points (no rename churn); atom convergence uses re-exports to keep call-site import paths stable. ✔
- **Known risk surfaced:** pm-ajay "full atoms" is bounded by reality — only ~6 patterns map to atoms; the rest stays token-backed CSS. Flagged, not hidden.
