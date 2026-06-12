# MoSJE Digital Estate — Full-Stack Audit Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a production-readiness audit of the entire MoSJE digital estate across seven dimensions — TypeScript correctness, security, accessibility, design-system consistency, performance, code quality, and architecture — culminating in a unified findings report with severity-ranked remediations.

**Architecture:** Seven parallel specialist agents fan out simultaneously. Each writes a structured JSON findings file. A synthesis agent then merges, deduplicates, cross-references, and produces the final report. Implemented as a Workflow script so the fan-out runs concurrently and the synthesis stage waits for all seven to complete.

**Tech Stack:** Next.js 16 (hub), Next.js 16 (dosje), Next.js 15 (smile-admin, pm-ajay), React 19, TypeScript 5 strict, Tailwind v3/v4, `@mosje/design-system` (shared package), Storybook 8 (docs).

---

## Repo map (hand this to every agent)

```
mosje/
├── apps/
│   ├── hub/                     # Root gate + portals host; Next.js 16, port :3000
│   │   └── src/
│   │       ├── app/             # layout.tsx, page.tsx (gating page), /portals/**, /reports/**
│   │       ├── components/eutthan/eutthan-portal.tsx   # 1371-line monolith
│   │       ├── components/conditional-app-switcher.tsx
│   │       ├── data/portals.ts
│   │       └── lib/eutthan/portal-data.ts
│   ├── dosje/                   # Unified informational website; Next.js 16, port :3001
│   │   └── src/app/             # 60+ route pages (all public), layout.tsx
│   ├── portals/
│   │   ├── smile-admin/         # SMILE Beggary Rehabilitation admin; Next.js 15, port :4123
│   │   └── pm-ajay/             # PM-AJAY MIS dashboard; Next.js 15, port :4124
│   └── docs/                    # SAMAVESH Storybook; port :6006
└── packages/
    ├── design-system/            # @mosje/design-system — shared atoms + theming
    │   ├── components/           # 20 components: button, card, badge, form-field, AppSwitcher, …
    │   ├── index.ts              # all public exports
    │   ├── color-mode.ts         # SSR-safe theming (cookie + initScript pattern)
    │   └── tokens.css            # CSS custom properties (--ds-* namespace)
    └── tokens/                   # DTCG → Style Dictionary source
```

**Key constraints every agent must know:**
- Government of India digital estate — WCAG 2.1 AA + GIGW (Guidelines for Indian Government Websites) compliance is a legal requirement, not a nice-to-have.
- No hardcoded hex values; all colour must use `--ds-*` CSS tokens.
- TypeScript strict mode; `any` is a build failure.
- Auth in portals is prototype-level (hardcoded demo accounts, cookie presence flag, localStorage); no production credentials anywhere.
- `eutthan-portal.tsx` is 1371 lines — the primary code-quality risk.
- The `packages/design-system` components have co-located `.css` files imported via `components.css`; token drift between them is the primary DS risk.

---

## Task 1 — TypeScript & Build Health Agent

**Files to read:**
- Every `tsconfig.json` across all apps and packages
- `apps/hub/src/**/*.{ts,tsx}`
- `apps/portals/pm-ajay/src/**/*.{ts,tsx}`
- `apps/portals/smile-admin/src/**/*.{ts,tsx}`
- `packages/design-system/**/*.{ts,tsx}`

**Commands to run:**
```bash
# Run from each app directory
npm --prefix apps/hub run typecheck 2>&1
npm --prefix apps/dosje run typecheck 2>&1
npm --prefix apps/portals/smile-admin run typecheck 2>&1
npm --prefix apps/portals/pm-ajay run typecheck 2>&1
cd packages/design-system && npx tsc --noEmit 2>&1
```

**What to check:**
- [ ] All `tsconfig.json` files have `"strict": true` set
- [ ] No `@ts-ignore` / `@ts-expect-error` suppressions in source files
- [ ] No `as any` casts
- [ ] All public exports from `packages/design-system/index.ts` have explicit types (no leaked `any`)
- [ ] `eutthan-portal.tsx` — check every callback, event handler, and state setter for inferred vs. explicit types
- [ ] `pm-ajay/src/store/auth-context.tsx` — `DEMO_ACCOUNTS` hardcoded password strings should be `string` not `string` literals in a typed `const`; check for `Record<string, unknown>` leakage
- [ ] `conditional-app-switcher.tsx` — `process.env.NODE_ENV` is typed `string`, not `"development"|"production"|"test"` — check if this causes type narrowing issues downstream
- [ ] Design system: `zone-switcher.tsx` uses `React.useRef<Array<HTMLButtonElement | null>>` — confirm array index access is null-guarded everywhere
- [ ] Check for missing `return` type annotations on exported functions in `packages/design-system/color-mode.ts`

**Output format (write to `docs/audit/findings-ts.json`):**
```json
{
  "dimension": "typescript",
  "summary": "...",
  "pass": true|false,
  "findings": [
    {
      "id": "TS-001",
      "severity": "blocker|major|minor|nit",
      "file": "relative/path/to/file.tsx",
      "line": 42,
      "description": "...",
      "fix": "..."
    }
  ]
}
```

---

## Task 2 — Security & Auth Agent

**Files to read:**
- `apps/portals/pm-ajay/src/middleware.ts`
- `apps/portals/pm-ajay/src/store/auth-context.tsx`
- `apps/portals/smile-admin/src/store/app-context.tsx`
- `apps/hub/src/components/eutthan/eutthan-portal.tsx` (auth section)
- All `layout.tsx` files for security headers
- Root `package.json` and all app `package.json` for dependency versions

**Commands to run:**
```bash
# Check for secrets accidentally committed
grep -rn "password\|secret\|apikey\|api_key\|token\|private_key" \
  apps/ packages/ --include="*.ts" --include="*.tsx" \
  | grep -v "node_modules\|\.next\|test\|mock\|demo\|DEMO\|placeholder\|Password@123" \
  | grep -v "//.*password" | head -40

# Check for hardcoded URLs / env vars that should be in .env
grep -rn "http://\|https://" apps/ packages/ \
  --include="*.ts" --include="*.tsx" \
  | grep -v "node_modules\|\.next\|fonts.googleapis\|fonts.gstatic\|react.dev" \
  | head -30

# Audit npm packages for known vulnerabilities
npm audit --prefix apps/hub 2>&1 | tail -10
npm audit --prefix apps/portals/pm-ajay 2>&1 | tail -10
npm audit --prefix apps/portals/smile-admin 2>&1 | tail -10
```

**What to check:**

*Auth architecture:*
- [ ] pm-ajay: `pmajay_session` cookie is `HttpOnly: false` (set client-side in auth-context) — flag this as a session-fixation risk even in prototype; document production requirement for `HttpOnly + Secure + SameSite=Strict`
- [ ] pm-ajay: `localStorage` used for account data — flag: XSS can exfiltrate this; document that production must use server sessions
- [ ] smile-admin: check whether auth state is purely client-side and what happens on direct URL navigation
- [ ] eutthan-portal: `role` state is in-memory only — assess blast radius if a user can manipulate it
- [ ] Hardcoded demo passwords (`Password@123` in `DEMO_ACCOUNTS`) — confirm these ONLY exist in client-side mock code, never sent to any API or logged
- [ ] Check that no `.env` files are present in the repo (only `.env.example` or `.env.local` which should be gitignored)

*HTTP security headers:*
- [ ] Are `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy` set in any `next.config.*`?
- [ ] Is `referrerPolicy` set on any layout?
- [ ] `dangerouslySetInnerHTML` usage in layouts (`colorModeInitScript`) — confirm the script output contains no user-controlled input (safe because it reads only cookie values, but verify)

*Supply chain:*
- [ ] Run `npm audit` per app — flag any high/critical CVEs
- [ ] Note `lucide-react@1.6.0` — this is unusually high; verify it's not a phantom version (npm shows latest as ~0.460 as of early 2025). If it's a major version, check for breaking changes that affect icon usage.
- [ ] Check `next@16.2.1` and `react@19.2.4` — confirm these are the actual published versions, not phantom semver bumps

**Output format (write to `docs/audit/findings-security.json`):** same schema as Task 1, dimension `"security"`.

---

## Task 3 — Accessibility (WCAG 2.1 AA + GIGW) Agent

**Files to read:**
- `apps/hub/src/app/page.tsx` (gating page)
- `apps/hub/src/app/portals/page.tsx`
- `apps/hub/src/components/eutthan/eutthan-portal.tsx`
- `apps/hub/src/app/reports/eutthan-admin/page.tsx`
- `apps/dosje/src/app/page.tsx`, `layout.tsx`, and a representative 5 page routes
- `packages/design-system/components/zone-switcher.tsx` + `.css`
- `packages/design-system/components/accessibility-widget.tsx`
- `packages/design-system/components/color-mode-switcher.tsx`
- All form components: `input.tsx`, `form-field.tsx`, `select.tsx`, `checkbox.tsx`, `radio.tsx`

**What to check — WCAG 2.1 AA:**

*1.1 Text alternatives:*
- [ ] Every `<img>` and `next/image` has `alt` — check dosje 60+ pages for `alt=""` (decorative) vs meaningful alt text
- [ ] Lucide icon usage: confirm `aria-hidden="true"` on decorative icons; confirm `aria-label` on icon-only buttons
- [ ] eutthan-portal.tsx: every status indicator, chart, and table image must have a text alternative

*1.3 Adaptable:*
- [ ] All tables (`<table>`) use `<thead>`, `<th scope="col/row">` — check reports page data tables
- [ ] Form fields: every `<input>` is associated with `<label>` via `htmlFor` or `aria-labelledby`
- [ ] Landmark regions: `<header>`, `<main id="main-content">`, `<footer>`, `<nav aria-label="...">` on every page
- [ ] eutthan-portal: sidebar nav uses `<nav aria-label="Main navigation">` — verify
- [ ] Skip-to-content link present at top of every app (government requirement)

*1.4 Distinguishable:*
- [ ] Check contrast ratios of all custom text/background pairs in `tokens.css` — specifically `--ds-ink-muted` on `--ds-surface-muted`, `--ds-gov-blue` on white, status badges
- [ ] Text never communicates purely by colour (status pills, severity badges in reports)
- [ ] Focus indicators visible: check `focus-visible:outline` is not overridden in any `globals.css`

*2.1 Keyboard:*
- [ ] AppSwitcher panel: confirm `focusTrap` or `focusout`-based close exists — previous review flagged it as missing
- [ ] Modal/overlay components trap focus when open
- [ ] eutthan-portal: all interactive table actions (edit, delete) are keyboard-reachable
- [ ] Tab order is logical (no `tabindex > 0`)

*2.4 Navigable:*
- [ ] All pages have a unique `<title>` (check 60+ dosje pages — many may use the layout default)
- [ ] Heading hierarchy: `h1` → `h2` → `h3` — no skipped levels; check eutthan-portal monolith carefully
- [ ] Link text is descriptive (no "click here" or "read more" without `aria-label`)

*3.1 Readable:*
- [ ] `<html lang="en-IN">` or `lang="en-US"` present on every app's root layout
- [ ] Language changes (Hindi, regional content) use `lang` attribute on containing elements

*4.1 Robust:*
- [ ] All ARIA roles are valid (`role="list"` with `role="listitem"` children) — zone-switcher.tsx had this fixed, verify it held
- [ ] `aria-expanded`, `aria-controls`, `aria-haspopup` on all disclosure widgets
- [ ] No duplicate IDs — especially in dynamically-generated lists (reports page, eutthan tables)

*GIGW-specific:*
- [ ] National emblem and branding on every page
- [ ] Accessibility statement page exists (`/accessibility`) — dosje has it; verify hub and portals
- [ ] Screen reader announcement for dynamic content updates (MIS dashboard filter changes)

**Output format (write to `docs/audit/findings-a11y.json`):** same schema, dimension `"accessibility"`.

---

## Task 4 — Design System Consistency Agent

**Files to read:**
- `packages/design-system/tokens.css` (full — source of truth for all `--ds-*` tokens)
- `packages/design-system/index.ts`
- All `*.css` files in `packages/design-system/components/`
- `apps/hub/src/app/globals.css`
- `apps/dosje/src/app/globals.css`
- `apps/portals/smile-admin/src/app/globals.css`
- `apps/portals/pm-ajay/src/app/globals.css`
- `apps/portals/smile-admin/tailwind.config.ts`
- Spot-check 5 components per app for hardcoded values

**Commands to run:**
```bash
# Find all hardcoded hex colors in source files
grep -rn "#[0-9a-fA-F]\{3,6\}" apps/ packages/ \
  --include="*.tsx" --include="*.ts" --include="*.css" \
  | grep -v "node_modules\|\.next\|\.git\|tokens.css\|tailwind.config\|globals.css\|// \|pinBg\|fill=" \
  | sort

# Find hardcoded pixel values that should use spacing tokens
grep -rn "style={{" apps/ --include="*.tsx" --include="*.ts" \
  | grep -v "node_modules\|\.next" | head -30

# Check for non-Noto Sans font imports
grep -rn "font-family\|fontFamily\|next/font" apps/ packages/ \
  --include="*.tsx" --include="*.ts" --include="*.css" \
  | grep -v "node_modules\|\.next\|Noto" | head -20
```

**What to check:**

*Token compliance:*
- [ ] Every CSS file in `packages/design-system/components/` uses ONLY `--ds-*` variables or Tailwind utilities — no raw hex, no `rgb()`, no hardcoded `px` for colour
- [ ] `eutthan.css` in hub: scan for all colour values — this was written as a large monolith and is high-risk for token drift
- [ ] `apps/portals/smile-admin/tailwind.config.ts`: uses Tailwind v3; check if it references `--ds-*` tokens or defines its own colour palette
- [ ] Reports page (`reports/eutthan-admin/page.tsx`) uses inline Tailwind colour utilities like `bg-red-100`, `text-red-700` — flag all uses not mapped to DS tokens

*Component usage:*
- [ ] Apps importing DS components should use `@mosje/design-system`, not re-implementing the same primitive locally. Check smile-admin `src/components/ui/` — it has its own `button.tsx`, `badge.tsx`, `card.tsx`, `input.tsx` etc. These are duplicates of DS atoms. Flag for consolidation.
- [ ] `pm-ajay` has its own UI components too — same duplication risk
- [ ] Verify `AppSwitcher` is imported from `@mosje/design-system` in all consumer layouts (not inlined)

*Noto Sans:*
- [ ] Every app loads Noto Sans — check `devanagari` subset is included in apps that may display Hindi content
- [ ] No other font families introduced

*Color modes:*
- [ ] `data-color-mode` attribute on `<html>` with `colorModeInitScript()` in every root layout — confirm smile-admin uses `blue-dark` default and that it's stable

*Design token contract:*
- [ ] Run `npm test -w @mosje/tokens` — the DTCG contract test must pass
- [ ] Check that `--ds-warning-tonal` and `--ds-success-tonal` referenced in `zone-switcher.css` are actually defined in `tokens.css` (they use fallback values currently — this should be fixed)

**Output format (write to `docs/audit/findings-ds.json`):** same schema, dimension `"design-system"`.

---

## Task 5 — Performance & Bundle Agent

**Files to read:**
- `apps/hub/next.config.*`
- `apps/dosje/next.config.*`
- `apps/portals/smile-admin/next.config.*`
- `apps/portals/pm-ajay/next.config.*`
- All `layout.tsx` files for font loading strategy
- All pages that use `next/image` — check `priority`, `sizes`, `fill` usage
- `apps/portals/smile-admin/src/components/dashboard/india-map.tsx` (SVG maps are heavy)
- `apps/portals/pm-ajay/src/components/dashboard/charts.tsx`

**Commands to run:**
```bash
# Build each app and capture bundle analysis
npm --prefix apps/hub run build 2>&1 | tail -40
npm --prefix apps/dosje run build 2>&1 | tail -40

# Check image sizes in public directories
find apps/dosje/public apps/hub/public -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \
  | xargs ls -lh 2>/dev/null | sort -k5 -hr | head -20

# Check for large imports from design-system (tree-shaking)
grep -rn "from '@mosje/design-system'" apps/ --include="*.tsx" --include="*.ts" \
  | grep -v node_modules | head -20

# Font loading — check for render-blocking preconnects
grep -rn "preconnect\|preload" apps/ --include="*.tsx" --include="*.ts" \
  | grep -v node_modules
```

**What to check:**

*Image optimization:*
- [ ] Every `<img>` tag in dosje's 60+ pages should be `next/image` — plain `<img>` blocks LCP
- [ ] `next/image` with `fill` prop must have a parent with defined height — dosje has a warning about `Banner-6.png` with fill+height:0
- [ ] Hero images on homepage and eutthan-portal login should have `priority` prop
- [ ] All images in `apps/hub/public/images/` — are Indian-Flag.svg and National-Emblem-logo.svg served with correct dimensions? (currently causing width/height mismatch warnings)
- [ ] `apps/dosje/public/images/` — check file sizes; PNG screenshots from events/gallery could be multi-MB

*Fonts:*
- [ ] Google Fonts loaded via `next/font/google` (correct — no render-blocking link tags)
- [ ] `display: "swap"` set on all font configs
- [ ] `pm-ajay` loads Google Fonts via `<link>` tags in `<head>` — this is render-blocking; migrate to `next/font`
- [ ] Material Symbols icon font in `pm-ajay` is also a render-blocking link — assess if icons can be replaced with Lucide

*Bundle:*
- [ ] `eutthan-portal.tsx` at 1371 lines is a single chunk — check if Next.js code-splits it; if it's `"use client"`, the entire module ships to the browser on first paint
- [ ] `apps/portals/smile-admin/src/lib/mock-data.ts` (518 lines) — is this ever imported in non-development paths? If bundled in production, it adds dead weight
- [ ] Check that `@mosje/design-system` is properly tree-shaken (named exports only, no barrel re-exports of CSS)

*Next.js config:*
- [ ] Is `output: "standalone"` set for production deployments?
- [ ] Are security headers configured in `next.config.*` (`X-Frame-Options`, `CSP`)?
- [ ] Is `images.domains` / `images.remotePatterns` configured, or is it left open?

**Output format (write to `docs/audit/findings-perf.json`):** same schema, dimension `"performance"`.

---

## Task 6 — Code Quality & Architecture Agent

**Files to read:**
- `apps/hub/src/components/eutthan/eutthan-portal.tsx` (full — 1371 lines)
- `apps/portals/smile-admin/src/lib/mock-data.ts`
- `apps/portals/pm-ajay/src/components/dashboard/dashboard-app.tsx`
- `apps/portals/pm-ajay/src/components/dashboard/views.tsx`
- `packages/design-system/components/zone-switcher.tsx`
- `apps/hub/src/lib/eutthan/portal-data.ts`
- Root `package.json` + all app `package.json` files

**Commands to run:**
```bash
# Find large files (risk of god-class components)
find apps/ packages/ -name "*.tsx" -o -name "*.ts" \
  | grep -v node_modules | xargs wc -l 2>/dev/null \
  | sort -nr | head -20

# Identify duplicate component implementations
find apps/ -path "*/components/ui/button*" -o -path "*/components/ui/card*" \
  -o -path "*/components/ui/badge*" -o -path "*/components/ui/input*" \
  | grep -v node_modules

# Check for circular imports
npm --prefix apps/hub run build 2>&1 | grep -i "circular"

# Lint each app
npm --prefix apps/hub run lint 2>&1 | tail -20
npm --prefix apps/portals/smile-admin run lint 2>&1 | tail -20
npm --prefix apps/portals/pm-ajay run lint 2>&1 | tail -20
```

**What to check:**

*God components:*
- [ ] `eutthan-portal.tsx` (1371 lines): identify distinct responsibilities. Recommended split:
  - `EutthanShell.tsx` — layout, sidebar, topbar
  - `EutthanLoginPage.tsx` — auth form
  - `EutthanDashboard.tsx` — dashboard view
  - `EutthanDataTable.tsx` — reusable table shell
  - Per-screen view components (`FinancialYearView`, `MinistryView`, etc.)
  - `useEutthanNav.ts` — path helpers `np()` and `lk()`
  - Measure: target max 250 lines per component
- [ ] `zone-switcher.tsx` in design-system — check if it's also over 300 lines and needs splitting
- [ ] `pm-ajay/dashboard-app.tsx` + `views.tsx` — assess if dashboard logic is properly separated from rendering

*Data / state architecture:*
- [ ] `mock-data.ts` in smile-admin: 518 lines of hardcoded data. Is this imported by production routes? If so, it must be guarded by `process.env.NODE_ENV === "development"` or moved to a separate mock layer
- [ ] eutthan-portal: `formRoutes` and `loginCards` exports in `portal-data.ts` — verify they're actually used or remove them (dead exports)
- [ ] `portals.ts` data file: portal list is duplicated between `hub/src/data/portals.ts` and `DEFAULT_APPS` in the design system's `app-switcher-utils.ts`. These can drift. Assess whether they should share a single source of truth.

*Route architecture:*
- [ ] Hub uses `[[...slug]]` catch-all for eutthan — assess whether this is intentional (full SPA routing inside hub) or a hack
- [ ] `apps/portals/pm-ajay/src/middleware.ts` has a debug header `x-mw-pathname` sent to ALL responses — must be removed before production
- [ ] Smile-admin uses route groups `(app)` and `(auth)` properly — confirm this pattern is intentional and consistent

*Naming / conventions:*
- [ ] Helper functions `np(p)` and `lk(p)` in eutthan-portal.tsx are cryptic — should be `normalizePath` and `portalLink`
- [ ] `DEMO_ACCOUNTS` object with plaintext `password` field in `auth-context.tsx` — even though it's client-only demo code, the field name is a red flag in code review
- [ ] `portal-data.ts` has `adminNavItems` + `ministryNavItems` — are ministry-role-specific items actually used after the rewrite? Audit for dead code.

*Error handling:*
- [ ] No `error.tsx` boundary files found in hub routes — Next.js App Router needs `error.tsx` per route segment for graceful degradation
- [ ] No `loading.tsx` files found — means no skeleton UI while server components stream; add at minimum for hub portals and reports
- [ ] `not-found.tsx` presence — check all apps

*Testing:*
- [ ] Zero test files found in the entire codebase. This is the single highest-priority gap. Minimum viable coverage:
  - `packages/design-system`: unit tests for `colorModeInitScript`, `deriveAbbr`, `filterApps`, `matchActivePath`
  - `pm-ajay/auth-context`: test signIn/signOut/redirect flows
  - `hub/conditional-app-switcher`: test pathname suppression
  - `smile-admin/lib/roles`: test role permission logic
  - E2E: one happy-path test per portal (login → dashboard → data table)

**Output format (write to `docs/audit/findings-quality.json`):** same schema, dimension `"code-quality"`.

---

## Task 7 — Infrastructure & DevEx Agent

**Files to read:**
- Root `package.json`
- `.claude/launch.json`
- `.claude/settings.json`
- All `next.config.*` files
- All `tsconfig.json` files
- `.gitignore`
- `CLAUDE.md` and `MOSJE-ARCHITECTURE.md` (if exists)

**Commands to run:**
```bash
# Check Node engine version alignment
node --version
cat package.json | grep '"node"'

# Check for duplicate dependencies across apps
for app in apps/hub apps/dosje apps/portals/smile-admin apps/portals/pm-ajay; do
  echo "=== $app ==="
  cat $app/package.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(list(d.get('dependencies',{}).keys()))" 2>/dev/null
done

# Verify workspace linkage for design-system
ls -la apps/hub/node_modules/@mosje/design-system
ls -la apps/dosje/node_modules/@mosje/design-system

# Check git history health
git log --oneline | wc -l
git branch -a | head -10
git stash list

# Confirm no .next build artifacts tracked in git
git ls-files | grep "\.next" | head -5
```

**What to check:**

*Monorepo structure:*
- [ ] `packages/*` are npm workspaces — confirm `apps/` are NOT workspaces (they're independent). This means `@mosje/design-system` is installed via `file:` symlink; verify symlinks are healthy in all app `node_modules`
- [ ] Node version: `package.json` requires `>=22`; confirm all apps work on the same Node. Inconsistent `engines` fields across apps is a risk.
- [ ] Apps have divergent Next.js versions (hub/dosje: 16.2.1, portals: 15.x) — document this as intentional (migration path) or flag as drift
- [ ] `tailwindcss` v4 in hub/dosje vs v3 in smile-admin — note that v4 has no `tailwind.config.js`, while v3 requires one. Confirm both work with shared design tokens.

*CI/CD gaps:*
- [ ] No `ci` script, no `check` script across apps — recommend adding `"check": "npm run typecheck && npm run lint && npm run build"` to each app
- [ ] No `.github/workflows/` found — CI pipeline is missing entirely. Minimum: type-check + lint on PR, build on push to main
- [ ] No Vercel / Netlify config found — deployment pipeline is undocumented

*Developer experience:*
- [ ] `concurrently` dev script removed `eutthan` entry correctly — verify it still works with `npm run dev`
- [ ] No `husky` / `lint-staged` pre-commit hooks — raw commits bypass type and lint checks
- [ ] `CLAUDE.md` has the guard hook (`guard.sh`) blocking `rm -rf` — confirm `.claude/hooks/guard.sh` exists
- [ ] `.gitignore` excludes all of: `node_modules`, `.next`, `_backups`, `Incoming`, `Designs`, `.env*` — verify
- [ ] `packages/design-system` has no build step for consumers — it's consumed directly from source. This means app builds compile it. Assess if a pre-built dist step is needed at scale.

*Documentation health:*
- [ ] `MOSJE-ARCHITECTURE.md` reference in `CLAUDE.md` — check if this file exists or is a dead reference
- [ ] No `CHANGELOG.md` or semantic versioning for `@mosje/design-system` — consumers don't know what changed
- [ ] `apps/dosje/AGENTS.md` says "run `bash scripts/sync-agent-rules.sh` after editing AGENTS.md" — verify this script exists

**Output format (write to `docs/audit/findings-infra.json`):** same schema, dimension `"infrastructure"`.

---

## Task 8 — Synthesis & Report Agent

**Prerequisite:** All 7 findings files written to `docs/audit/findings-*.json`

**Files to read:**
- `docs/audit/findings-ts.json`
- `docs/audit/findings-security.json`
- `docs/audit/findings-a11y.json`
- `docs/audit/findings-ds.json`
- `docs/audit/findings-perf.json`
- `docs/audit/findings-quality.json`
- `docs/audit/findings-infra.json`

**Steps:**

- [ ] **Step 1: Triage by severity**

Load all 7 JSON files. Produce a severity matrix:

| Severity | Count | Dimensions |
|----------|-------|------------|
| Blocker  | N     | …          |
| Major    | N     | …          |
| Minor    | N     | …          |
| Nit      | N     | …          |

- [ ] **Step 2: Cross-dimension correlation**

Identify findings that span multiple dimensions, e.g.:
- "pm-ajay loads fonts via render-blocking `<link>` tags" → affects both Performance AND Accessibility (AT users need content rendered quickly)
- "eutthan-portal.tsx is a 1371-line monolith" → affects Code Quality, Performance (single large client chunk), and potentially Accessibility (hard to audit heading hierarchy)
- "No test coverage" → affects Security (no regression gate for auth), Code Quality, and Infrastructure (no CI)

- [ ] **Step 3: Write final report**

Write `docs/audit/AUDIT-REPORT-2026-06-12.md` with:

```markdown
# MoSJE Digital Estate — Production Readiness Audit
**Date:** 2026-06-12  
**Auditors:** TypeScript Agent · Security Agent · Accessibility Agent · Design System Agent · Performance Agent · Code Quality Agent · Infrastructure Agent  
**Overall Status:** [RED / AMBER / GREEN]

## Executive Summary
[3-5 sentences for a non-technical stakeholder]

## Critical Blockers (must fix before public launch)
[Numbered list, each with: finding ID · dimension · file · description · recommended fix]

## Major Issues (fix within current sprint)
…

## Minor Issues (fix within next sprint)
…

## Nit / Recommendations (backlog)
…

## Cross-Cutting Concerns
…

## Test Coverage Gap (top priority)
…

## What's Working Well
[Genuine positives — token system, AppSwitcher a11y pattern, ColorModeProvider hydration, auth-context structure, etc.]

## Remediation Roadmap
| Week | Priority items |
|------|---------------|
| W1   | …             |
| W2   | …             |
| W3   | …             |
```

- [ ] **Step 4: Commit the report**

```bash
mkdir -p docs/audit
git add docs/audit/
git commit -m "audit(estate): full-stack production readiness audit 2026-06-12"
```

---

## Workflow Script

Save this as `.claude/workflows/estate-audit.js` and run via the Workflow tool:

```javascript
export const meta = {
  name: 'mosje-estate-audit',
  description: 'Full production-readiness audit across 7 dimensions with synthesis report',
  phases: [
    { title: 'Fan-out', detail: 'Seven specialist agents audit in parallel' },
    { title: 'Synthesis', detail: 'Merge findings, cross-correlate, write final report' },
  ],
};

const REPO = '/Users/akashk/Documents/Projects/MoSJE';

const SHARED_CONTEXT = `
You are auditing the MoSJE (Ministry of Social Justice & Empowerment) digital estate.
Working directory: ${REPO}

Repo structure:
- apps/hub/           — root gate + portals host, Next.js 16, port :3000
- apps/dosje/         — unified gov website, Next.js 16, port :3001
- apps/portals/smile-admin/  — SMILE admin portal, Next.js 15
- apps/portals/pm-ajay/      — PM-AJAY MIS dashboard, Next.js 15
- packages/design-system/    — shared @mosje/design-system package

Key facts:
- Government of India estate — WCAG 2.1 AA + GIGW compliance is MANDATORY
- TypeScript strict mode; no any, no @ts-ignore
- Design tokens: --ds-* CSS custom properties; no hardcoded hex
- Auth is prototype-level (demo accounts); no production secrets should exist
- eutthan-portal.tsx is 1371 lines — primary quality risk

Return findings ONLY as the JSON schema specified. Your final text IS the return value.
`;

const FINDINGS_SCHEMA = {
  type: 'object',
  required: ['dimension', 'summary', 'pass', 'findings'],
  properties: {
    dimension: { type: 'string' },
    summary: { type: 'string' },
    pass: { type: 'boolean' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'severity', 'file', 'description', 'fix'],
        properties: {
          id: { type: 'string' },
          severity: { enum: ['blocker', 'major', 'minor', 'nit'] },
          file: { type: 'string' },
          line: { type: 'number' },
          description: { type: 'string' },
          fix: { type: 'string' },
        }
      }
    }
  }
};

phase('Fan-out');

const DIMENSIONS = [
  {
    key: 'typescript',
    label: 'TypeScript & Build Health',
    prompt: `${SHARED_CONTEXT}

DIMENSION: TypeScript & Build Health

Run these commands and read the specified files, then report all type errors,
missing strict settings, unsafe casts, and missing return types.

Commands:
  npm --prefix apps/hub run typecheck 2>&1
  npm --prefix apps/dosje run typecheck 2>&1
  npm --prefix apps/portals/smile-admin run typecheck 2>&1
  npm --prefix apps/portals/pm-ajay run typecheck 2>&1

Files to read:
  apps/hub/src/components/eutthan/eutthan-portal.tsx (check event types, state types)
  apps/portals/pm-ajay/src/store/auth-context.tsx
  packages/design-system/components/zone-switcher.tsx
  packages/design-system/color-mode.ts
  packages/design-system/index.ts

Check: strict mode in all tsconfig.json, no @ts-ignore, no as any, null guards on refs,
explicit return types on exported functions.

Use finding IDs: TS-001, TS-002, …`
  },
  {
    key: 'security',
    label: 'Security & Auth',
    prompt: `${SHARED_CONTEXT}

DIMENSION: Security & Auth

Read and assess:
  apps/portals/pm-ajay/src/middleware.ts
  apps/portals/pm-ajay/src/store/auth-context.tsx
  apps/portals/smile-admin/src/store/app-context.tsx
  apps/hub/src/components/eutthan/eutthan-portal.tsx (auth section only)

Run:
  grep -rn "password\\|secret\\|apikey\\|token" apps/ packages/ --include="*.ts" --include="*.tsx" | grep -v "node_modules\\|\\.next\\|test\\|mock\\|DEMO\\|Password@123"
  npm audit --prefix apps/hub 2>&1 | tail -5
  npm audit --prefix apps/portals/pm-ajay 2>&1 | tail -5

Check: HttpOnly cookie gap, localStorage session storage, debug headers in middleware (x-mw-pathname),
dangerouslySetInnerHTML safety, missing HTTP security headers, npm audit CVEs.

Use finding IDs: SEC-001, SEC-002, …`
  },
  {
    key: 'accessibility',
    label: 'WCAG 2.1 AA + GIGW',
    prompt: `${SHARED_CONTEXT}

DIMENSION: Accessibility — WCAG 2.1 AA + GIGW

Read:
  apps/hub/src/app/page.tsx
  apps/hub/src/components/eutthan/eutthan-portal.tsx
  apps/hub/src/app/reports/eutthan-admin/page.tsx
  apps/dosje/src/app/page.tsx
  apps/dosje/src/app/layout.tsx
  packages/design-system/components/zone-switcher.tsx
  packages/design-system/components/accessibility-widget.tsx
  packages/design-system/components/form-field.tsx

Check ALL of: alt text on images, table header scope, form label associations,
landmark regions, skip-to-content link, focus traps on modals/panels,
heading hierarchy (no skips), unique page titles, lang attribute,
ARIA role validity, ARIA state attributes, colour contrast (assess tokens),
keyboard reachability of all interactive elements, no tabindex > 0,
skip navigation link at top of every app.

GIGW-specific: national emblem presence, accessibility statement page.

Use finding IDs: A11Y-001, A11Y-002, …`
  },
  {
    key: 'design-system',
    label: 'Design System Consistency',
    prompt: `${SHARED_CONTEXT}

DIMENSION: Design System Consistency

Read:
  packages/design-system/tokens.css (source of truth)
  packages/design-system/components/zone-switcher.css
  apps/hub/src/app/portals/eutthan-admin/eutthan.css
  apps/dosje/src/app/globals.css
  apps/portals/smile-admin/src/app/globals.css
  apps/portals/pm-ajay/src/app/globals.css
  apps/portals/smile-admin/tailwind.config.ts

Run:
  grep -rn "#[0-9a-fA-F]\\{3,6\\}" apps/ packages/ --include="*.css" --include="*.tsx" | grep -v "node_modules\\|\\.next\\|tokens.css\\|tailwind.config\\|pinBg"

Check: all CSS uses --ds-* tokens (no raw hex), all apps import Noto Sans,
--ds-warning-tonal and --ds-success-tonal must exist in tokens.css (zone-switcher uses them with fallbacks),
smile-admin has local copies of button/card/badge/input that duplicate DS atoms (flag for consolidation),
portals.ts and DEFAULT_APPS in app-switcher-utils.ts may have drifted (compare portal lists),
design-system token contract test passes.

Use finding IDs: DS-001, DS-002, …`
  },
  {
    key: 'performance',
    label: 'Performance & Bundle',
    prompt: `${SHARED_CONTEXT}

DIMENSION: Performance & Bundle

Read:
  apps/hub/next.config.* (if exists)
  apps/dosje/next.config.* (if exists)
  apps/portals/pm-ajay/src/app/layout.tsx (check font loading)
  apps/portals/smile-admin/src/components/dashboard/india-map.tsx

Run:
  find apps/dosje/public apps/hub/public -name "*.png" -o -name "*.jpg" | xargs ls -lh 2>/dev/null | sort -k5 -hr | head -15
  grep -rn "<img " apps/ --include="*.tsx" | grep -v "node_modules\\|\\.next" | head -20
  grep -rn "priority" apps/ --include="*.tsx" | grep "Image\\|next/image" | head -10

Check: pm-ajay uses render-blocking Google Fonts link tags (should migrate to next/font),
eutthan-portal.tsx is a massive "use client" chunk with no dynamic imports,
mock-data.ts (518 lines) imported in production paths,
next/image used everywhere (no plain <img> for content images),
Banner-6.png with fill+height:0 warning must be fixed (parent needs explicit height),
no next.config security headers set,
no output: standalone configured.

Use finding IDs: PERF-001, PERF-002, …`
  },
  {
    key: 'code-quality',
    label: 'Code Quality & Architecture',
    prompt: `${SHARED_CONTEXT}

DIMENSION: Code Quality & Architecture

Read:
  apps/hub/src/components/eutthan/eutthan-portal.tsx (FULL — analyse structure)
  apps/portals/pm-ajay/src/middleware.ts
  apps/portals/smile-admin/src/lib/mock-data.ts
  apps/hub/src/lib/eutthan/portal-data.ts
  apps/hub/src/data/portals.ts
  packages/design-system/components/app-switcher-utils.ts

Run:
  find apps/ packages/ \\( -name "*.tsx" -o -name "*.ts" \\) | grep -v node_modules | xargs wc -l | sort -nr | head -15
  find apps/ -path "*/components/ui/*.tsx" | grep -v node_modules
  npm --prefix apps/hub run lint 2>&1 | tail -15

Check:
- eutthan-portal.tsx responsibilities: identify the split (shell/login/dashboard/data-table/per-screen-views/nav-hook)
- helper functions np() and lk() should be renamed to normalizePath/portalLink
- x-mw-pathname debug header in pm-ajay middleware must be removed
- formRoutes/loginCards exports in portal-data.ts — check if used; if not, dead code
- Duplicate portal list between portals.ts and DEFAULT_APPS in design-system
- No error.tsx, loading.tsx, not-found.tsx in hub routes
- Zero test files in entire codebase — enumerate minimum test targets
- mock-data.ts production risk
- DEMO_ACCOUNTS password field naming risk

Use finding IDs: QA-001, QA-002, …`
  },
  {
    key: 'infrastructure',
    label: 'Infrastructure & DevEx',
    prompt: `${SHARED_CONTEXT}

DIMENSION: Infrastructure & DevEx

Read:
  package.json (root)
  .claude/settings.json
  .gitignore
  CLAUDE.md
  apps/hub/package.json
  apps/dosje/package.json
  apps/portals/smile-admin/package.json
  apps/portals/pm-ajay/package.json

Run:
  node --version
  ls apps/dosje/scripts/ 2>/dev/null || echo "no scripts dir"
  ls .github/ 2>/dev/null || echo "no .github dir"
  ls .claude/hooks/ 2>/dev/null || echo "no hooks dir"
  cat MOSJE-ARCHITECTURE.md 2>/dev/null | head -20 || echo "MOSJE-ARCHITECTURE.md missing"
  git log --oneline | wc -l

Check:
- MOSJE-ARCHITECTURE.md referenced in CLAUDE.md — does it exist?
- scripts/sync-agent-rules.sh referenced in dosje/AGENTS.md — does it exist?
- No CI pipeline (.github/workflows/) — this is a blocker for team development
- No pre-commit hooks (husky/lint-staged)
- Node version consistency across all apps (engines field)
- Next.js version divergence (16 vs 15) — is this intentional migration path?
- Tailwind v4 (hub/dosje) vs v3 (smile-admin) — document implications
- @mosje/design-system is file: symlink — confirm healthy in each app's node_modules
- design-system has no CHANGELOG.md or semantic versioning

Use finding IDs: INFRA-001, INFRA-002, …`
  },
];

const results = await parallel(
  DIMENSIONS.map((d) => () =>
    agent(d.prompt, {
      label: `audit:${d.key}`,
      phase: 'Fan-out',
      schema: FINDINGS_SCHEMA,
    })
  )
);

phase('Synthesis');

const allFindings = results
  .filter(Boolean)
  .flatMap((r) => r.findings.map((f) => ({ ...f, dimension: r.dimension })));

const blockers = allFindings.filter((f) => f.severity === 'blocker');
const majors   = allFindings.filter((f) => f.severity === 'major');
const minors   = allFindings.filter((f) => f.severity === 'minor');
const nits     = allFindings.filter((f) => f.severity === 'nit');

log(`Fan-out complete: ${blockers.length} blockers · ${majors.length} major · ${minors.length} minor · ${nits.length} nit`);

const dimensionSummaries = results
  .filter(Boolean)
  .map((r) => `- **${r.dimension}**: ${r.summary} (pass: ${r.pass})`)
  .join('\n');

const findingsList = allFindings
  .sort((a, b) => {
    const order = { blocker: 0, major: 1, minor: 2, nit: 3 };
    return order[a.severity] - order[b.severity];
  })
  .map((f) => `### ${f.id} [${f.severity.toUpperCase()}] — ${f.dimension}\n**File:** \`${f.file}\`${f.line ? ` line ${f.line}` : ''}\n**Issue:** ${f.description}\n**Fix:** ${f.fix}`)
  .join('\n\n');

const report = await agent(
  `You are a senior technical architect writing the final production-readiness report for the MoSJE Digital Estate.

Here are the 7 dimension summaries:
${dimensionSummaries}

Here are ALL ${allFindings.length} findings sorted by severity:
${findingsList}

Write a complete audit report in Markdown with these sections:
1. Executive Summary (3-5 sentences, non-technical language, suitable for a government ministry stakeholder)
2. Overall Status: RED (blockers present) / AMBER (majors only) / GREEN
3. Critical Blockers (all blocker-severity findings, each with file + recommended fix)
4. Major Issues (all major-severity findings)
5. Minor Issues (all minor-severity findings, grouped by dimension)
6. Cross-Cutting Concerns (findings that span multiple dimensions)
7. Test Coverage Gap (enumerate exactly which files/functions need tests first)
8. What's Working Well (genuine positives — don't omit this section)
9. Remediation Roadmap (3-week sprint plan: W1 blockers, W2 majors, W3 minors)

Be precise, actionable, and professional. This will be used by the development team.`,
  { label: 'synthesis:report', phase: 'Synthesis' }
);

return { blockerCount: blockers.length, majorCount: majors.length, report };
```

---

## Execution Instructions

1. **Save the workflow:** The script above is embedded in this plan. To run it:
   ```
   Use the Workflow tool with the script body above, or save to .claude/workflows/estate-audit.js first.
   ```

2. **Prerequisite:** Hub dev server should be stopped during build-step agents (build commands conflict with running dev server on the same port).

3. **Expected runtime:** ~15–20 minutes for the full 7-agent fan-out + synthesis.

4. **Output location:** `docs/audit/AUDIT-REPORT-2026-06-12.md`

5. **To run a single dimension:** Copy just that agent's prompt from the Workflow script and dispatch it as a single `agent()` call.
