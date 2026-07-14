# Single-Origin Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse the 10-server Multi-Zones estate into a single Next.js app (the hub) so the whole prototype — website, all 6 portals, docs, and audit reports — runs on one origin (`:3000`), navigated by the hub nav + AppSwitcher, with no cross-zone proxying.

**Architecture:** Every portal becomes a **native route group inside the hub** (`apps/hub/src/app/portals/<slug>/…`), exactly like `eutthan-admin` already is. Each portal's root `layout.tsx` (with `<html>/<body>` + providers) is demoted to a **nested layout** that only returns `children` and imports a scoped CSS file; the hub's root layout owns `<html>`, `<body>`, `ColorModeProvider`, `UX4GAccessibilityWidget`, and the AppSwitcher. Because all code compiles under the hub's single Next 16 + Tailwind v4 toolchain, the Next-15/16 and Tailwind version skew disappears automatically. Portal components/lib/store move to `apps/hub/src/{components,lib,store}/<slug>/`; per-portal `middleware.ts` files merge into the hub's single root middleware.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind v4 (CSS-first `@theme`), `@mosje/design-system` (file-linked workspace pkg), TypeScript strict.

## Global Constraints

- **One Next version:** everything compiles under `apps/hub` (Next `^16.2.9`). Do not keep portal-local `next.config.*`, `package.json`, or `node_modules` in the migrated path.
- **One middleware:** Next allows exactly one root `middleware.ts` per app. All portal middleware logic merges into `apps/hub/src/middleware.ts`, path-matched by `/portals/<slug>` prefix.
- **DS tokens, never hardcoded values.** Portals already rely on `@mosje/design-system/tokens.css` (none define their own `@theme`) — keep it that way. Scoped portal CSS may map local `--var`s onto `--ds-*` tokens (the eutthan pattern) but must not introduce a second `@theme` block.
- **AppSwitcher rule (`.claude/rules/portal-appswitcher.md`):** the FAB is rendered ONCE by the hub root layout. Migrated portals MUST NOT render their own `<AppSwitcher>` — remove it from every demoted layout.
- **No AI co-author trailer** on any commit (`.husky/commit-msg` strips it as backstop; don't write it).
- **Noto Sans only**, National Emblem logo/favicon, no tricolour stripe motif — unchanged.
- **Incremental & reversible:** migrate ONE portal per task. Until a portal's teardown step runs, its zone stays live so the estate never fully breaks. Never `rm -rf` — use `git mv` / `git rm` (the guard hook blocks `rm -rf`).
- **Verification is browser-observable:** every portal task ends by loading `http://localhost:3000/portals/<slug>` in the preview and confirming the page renders with no console/proxy errors.

---

## File Structure

**Hub app (destination) after migration:**

```
apps/hub/
├── next.config.ts            # rewrites() shrinks as each zone is removed
├── src/
│   ├── middleware.ts         # NEW/merged — single root middleware, path-matched
│   ├── app/
│   │   ├── layout.tsx        # unchanged — owns <html>/<body>/providers/AppSwitcher
│   │   ├── page.tsx          # hub home
│   │   ├── portals/
│   │   │   ├── eutthan-admin/…   # already native (reference implementation)
│   │   │   ├── scw/          # ← migrated (pilot)
│   │   │   │   ├── layout.tsx     # nested: returns children + imports scw.css
│   │   │   │   ├── scw.css        # scoped styles (was globals.css)
│   │   │   │   └── …routes moved from apps/portals/scw/src/app/*
│   │   │   ├── nmba/  nhapoa/  tg/  smile-admin/  pm-ajay/   # ← migrated
│   │   ├── reports/          # audit-report home (already native: eutthan-admin, scw)
│   │   └── website/          # ← optional final phase (dosje)
│   ├── components/<slug>/    # per-portal components
│   ├── lib/<slug>/           # per-portal lib
│   └── store/<slug>/         # per-portal zustand stores (smile-admin, pm-ajay)
```

**Removed on teardown (per portal):** `apps/portals/<slug>/` entirely, its entry in `.claude/launch.json`, its `dev:`/`check:`/`lint:` scripts + `concurrently` entry in root `package.json`, and its `ZONE_*` const + rewrite rules in `apps/hub/next.config.ts`.

**Migration order (least-coupled → most-coupled, so the recipe hardens on simple portals first):**
1. **scw** (pilot — 21 routes, app/components/lib only, no middleware/store)
2. **nmba** (route-group nesting `(protected)`, no middleware/store)
3. **tg** (route groups `(console)`/`(app)`, no middleware/store)
4. **nhapoa** (many routes, no middleware/store)
5. **smile-admin** (has `middleware.ts` + `store/` — first middleware merge)
6. **pm-ajay** (has `middleware.ts` + `store/`, **no Tailwind** — pure scoped-CSS, like eutthan)
7. **docs** (optional — fold `apps/docs` design-system routes)
8. **website / dosje** (optional final — largest; already Next 16 so version-skew-free)

Storybook (`:6006`) is the ONE irreducible separate process — it is not a Next app and cannot fold in. After phases 1–6 the estate is 10 → 4 processes (hub, dosje, docs, storybook); after 7–8, 10 → 2 (hub, storybook).

---

## Task 0: Baseline capture + branch

**Files:**
- Create: `docs/superpowers/plans/consolidation-baseline.md` (a checklist of working URLs)

**Interfaces:**
- Produces: a known-good baseline every later task diffs against.

- [ ] **Step 1: Create the working branch**

```bash
cd /Users/akashk/Documents/Projects/MoSJE
git checkout -b feat/single-origin-consolidation
```

- [ ] **Step 2: Boot the full estate and capture the baseline**

```bash
npm run dev   # boots all 10 zones behind :3000
```

Open each in the preview and record HTTP 200 + first-paint OK in `consolidation-baseline.md`:
`/`, `/website`, `/portals/eutthan-admin`, `/portals/smile-admin`, `/portals/pm-ajay`, `/portals/scw`, `/portals/nmba`, `/portals/nhapoa`, `/portals/tg`, `/design-system`, `/storybook/`.

- [ ] **Step 3: Commit the baseline doc**

```bash
git add docs/superpowers/plans/consolidation-baseline.md
git commit -m "docs(consolidation): capture pre-migration working baseline"
```

---

## Task 1: Establish the migration recipe (documented, from eutthan)

This task writes down the exact transform every portal task follows, so per-portal tasks stay concrete without repeating boilerplate prose. No portal moves yet.

**Files:**
- Create: `apps/hub/src/app/portals/MIGRATION-RECIPE.md`

**Interfaces:**
- Produces: the canonical "demote layout + scope CSS + move code + fix links + merge middleware + teardown" recipe referenced by Tasks 2–7.

- [ ] **Step 1: Write the recipe file**

Create `apps/hub/src/app/portals/MIGRATION-RECIPE.md` with this content verbatim:

````markdown
# Portal → Hub native-mount recipe

Reference implementation: `apps/hub/src/app/portals/eutthan-admin/`.
`<slug>` = portal folder name (scw, nmba, …). Source = `apps/portals/<slug>`.

## 1. Move routes
```bash
git mv apps/portals/<slug>/src/app apps/hub/src/app/portals/<slug>
```
The portal's `basePath` was `/portals/<slug>`, which is now the literal folder
path — absolute links like `href="/portals/<slug>/login"` keep working.

## 2. Move code dirs (only those that exist for the portal)
```bash
git mv apps/portals/<slug>/src/components apps/hub/src/components/<slug>
git mv apps/portals/<slug>/src/lib        apps/hub/src/lib/<slug>
git mv apps/portals/<slug>/src/store      apps/hub/src/store/<slug>   # if present
```

## 3. Rewrite internal import paths
The portal used `@/…` = `apps/portals/<slug>/src/…`. In the hub, `@/…` =
`apps/hub/src/…`. Re-point every alias into the namespaced subdir:
```bash
cd apps/hub
grep -rl "@/components\|@/lib\|@/store" src/app/portals/<slug> src/components/<slug> src/lib/<slug> src/store/<slug> 2>/dev/null \
  | xargs sed -i '' \
    -e 's#@/components/#@/components/<slug>/#g' \
    -e 's#@/lib/#@/lib/<slug>/#g' \
    -e 's#@/store/#@/store/<slug>/#g'
```
Then fix any now-doubled paths (`@/components/<slug>/<slug>/`) that arise if the
portal already namespaced — grep and correct:
```bash
grep -rn "/<slug>/<slug>/" src && echo "FIX DOUBLED PATHS" || echo OK
```

## 4. Demote the root layout → nested layout
The moved `apps/hub/src/app/portals/<slug>/layout.tsx` currently renders
`<html><body>` + `ColorModeProvider` + `UX4GAccessibilityWidget` + `AppSwitcher`
+ a `next/font` loader. Replace ALL of that — the hub root layout owns it.
Keep only `metadata`, and import the scoped CSS. Final form:

```tsx
import type { Metadata } from "next";
import "./<slug>.css";

export const metadata: Metadata = {
  // keep the portal's existing title/description/icons object verbatim
};

export default function <Slug>Layout({ children }: { children: React.ReactNode }) {
  return children;
}
```
Remove these imports from the file: `next/font/google`, `AppSwitcher`,
`ColorModeProvider`, `UX4GAccessibilityWidget`, and `@mosje/design-system/icons.css`
(the hub root already loads icons + providers once).

## 5. Scope the CSS
```bash
git mv apps/hub/src/app/portals/<slug>/globals.css apps/hub/src/app/portals/<slug>/<slug>.css
```
Then edit `<slug>.css`: DELETE the top three lines
`@import "tailwindcss";`, `@import "tw-animate-css";`,
`@import "@mosje/design-system/tokens.css";` — the hub's `globals.css` already
imports all three app-wide. Keep only the portal's own rules (component classes,
CSS-var maps). If the portal defined `@custom-variant`/`@theme`, DELETE it (hub
owns the theme). For Tailwind-less portals (pm-ajay), keep the full scoped CSS
as-is minus any tailwind import.

## 6. Merge middleware (only if the portal had one)
Next allows ONE root middleware. Fold the portal's matcher + logic into
`apps/hub/src/middleware.ts` guarded by a `pathname.startsWith("/portals/<slug>")`
branch. Add `/portals/<slug>/:path*` to the hub matcher config. Delete the
portal's `middleware.ts`.

## 7. Teardown the zone
```bash
git rm -r apps/portals/<slug>
```
- `apps/hub/next.config.ts`: delete the `ZONE_<SLUG>` const + its rewrite rules.
- Root `package.json`: delete `dev:<slug>`, `check:<slug>`, `lint:<slug>` scripts,
  remove the portal from the `dev` `concurrently` command (`-n` names + its `bash -c` entry),
  and from the `check`/`lint` chains.
- `.claude/launch.json`: delete the portal's configuration entry.

## 8. Verify
`npm run dev`, open `http://localhost:3000/portals/<slug>`, confirm 200 +
first paint + no console errors + AppSwitcher FAB present (from hub, bottom-left).
````

- [ ] **Step 2: Commit the recipe**

```bash
git add apps/hub/src/app/portals/MIGRATION-RECIPE.md
git commit -m "docs(consolidation): document portal→hub native-mount recipe"
```

---

## Task 2: Migrate `scw` (pilot — hardens the recipe)

**Files:**
- Move: `apps/portals/scw/src/app` → `apps/hub/src/app/portals/scw`
- Move: `apps/portals/scw/src/{components,lib}` → `apps/hub/src/{components,lib}/scw`
- Modify: `apps/hub/src/app/portals/scw/layout.tsx` (demote), rename `globals.css`→`scw.css`
- Modify: `apps/hub/next.config.ts`, root `package.json`, `.claude/launch.json` (teardown)
- Delete: `apps/portals/scw`

**Interfaces:**
- Consumes: the recipe from Task 1.
- Produces: `/portals/scw` served natively by the hub; the pilot that confirms the recipe's link/CSS/import steps before scaling to 5 more portals.

- [ ] **Step 1: Move routes and code (recipe §1–2)**

```bash
cd /Users/akashk/Documents/Projects/MoSJE
git mv apps/portals/scw/src/app apps/hub/src/app/portals/scw
git mv apps/portals/scw/src/components apps/hub/src/components/scw
git mv apps/portals/scw/src/lib apps/hub/src/lib/scw
```

- [ ] **Step 2: Rewrite import aliases (recipe §3)**

```bash
cd apps/hub
grep -rl "@/components\|@/lib" src/app/portals/scw src/components/scw src/lib/scw 2>/dev/null \
  | xargs sed -i '' \
    -e 's#@/components/#@/components/scw/#g' \
    -e 's#@/lib/#@/lib/scw/#g'
grep -rn "/scw/scw/" src && echo "FIX DOUBLED PATHS" || echo OK
```

- [ ] **Step 3: Demote the layout (recipe §4)**

Replace `apps/hub/src/app/portals/scw/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./scw.css";

export const metadata: Metadata = {
  title: "SCW · Senior Citizens Welfare | SAMAVESH · MoSJE",
  description:
    "Senior Citizens Welfare portal — SAMAVESH (Single Access Mechanism for All Verticals of Empowerment & Social Harmony), Ministry of Social Justice & Empowerment, Government of India.",
  applicationName: "SCW · Samavesh",
  icons: [
    {
      url:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%2313366b'/><text x='16' y='21' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='800' fill='%23ffffff'>स</text></svg>`
        ),
    },
  ],
};

export default function ScwLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 4: Scope the CSS (recipe §5)**

```bash
cd /Users/akashk/Documents/Projects/MoSJE
git mv apps/hub/src/app/portals/scw/globals.css apps/hub/src/app/portals/scw/scw.css
```

Edit `apps/hub/src/app/portals/scw/scw.css`: delete the `@import "tailwindcss";`,
`@import "tw-animate-css";`, and `@import "@mosje/design-system/tokens.css";`
lines and any `@custom-variant`/`@theme` block. Keep the portal's own rules.

- [ ] **Step 5: Typecheck the hub**

```bash
npm --prefix apps/hub run typecheck
```
Expected: PASS (no unresolved `@/` imports, no missing modules).

- [ ] **Step 6: Boot and verify in the preview**

```bash
npm run dev
```
Open `http://localhost:3000/portals/scw`, `/portals/scw/login`,
`/portals/scw/admin/dashboard`. Confirm each: HTTP 200, correct styling
(Noto Sans + DS tokens), AppSwitcher FAB bottom-left, no console errors,
and (via read_network_requests) requests hit `:3000` directly — NOT proxied to `:4125`.

- [ ] **Step 7: Teardown the scw zone (recipe §7)**

```bash
git rm -r apps/portals/scw
```
Edit `apps/hub/next.config.ts`: remove the `ZONE_SCW` const and both
`/portals/scw` rewrite rules. Edit root `package.json`: remove `dev:scw`,
`check:scw`, `lint:scw`, the `scw` entry from `dev` `concurrently` (name + `bash -c`),
and from the `check`/`lint` chains. Edit `.claude/launch.json`: remove the `scw` config.

- [ ] **Step 8: Re-verify after teardown**

```bash
npm run dev
```
Confirm `http://localhost:3000/portals/scw` still 200 (now purely native) and
the `:4125` server no longer starts (check the concurrently process list / logs).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor(consolidation): mount scw natively in hub, retire its zone"
```

---

## Task 3: Migrate `nmba`

**Files:**
- Move: `apps/portals/nmba/src/app` → `apps/hub/src/app/portals/nmba`; `src/{components,lib}` → `apps/hub/src/{components,lib}/nmba`
- Modify: demote `nmba/layout.tsx`, rename `globals.css`→`nmba.css`; hub `next.config.ts`, root `package.json`, `.claude/launch.json`
- Delete: `apps/portals/nmba`

**Interfaces:**
- Consumes: recipe (Task 1), proven by pilot (Task 2).
- Produces: `/portals/nmba` native. Note: nmba nests `(protected)` route groups under `admin/` and `treatment-centre/` — route groups move as-is with the `git mv` of `src/app`; no special handling.

- [ ] **Step 1: Move + rewrite aliases (recipe §1–3, slug=nmba)**

```bash
cd /Users/akashk/Documents/Projects/MoSJE
git mv apps/portals/nmba/src/app apps/hub/src/app/portals/nmba
git mv apps/portals/nmba/src/components apps/hub/src/components/nmba
git mv apps/portals/nmba/src/lib apps/hub/src/lib/nmba
cd apps/hub
grep -rl "@/components\|@/lib" src/app/portals/nmba src/components/nmba src/lib/nmba 2>/dev/null \
  | xargs sed -i '' -e 's#@/components/#@/components/nmba/#g' -e 's#@/lib/#@/lib/nmba/#g'
grep -rn "/nmba/nmba/" src && echo "FIX DOUBLED PATHS" || echo OK
```

- [ ] **Step 2: Demote layout + scope CSS (recipe §4–5)**

Rewrite `apps/hub/src/app/portals/nmba/layout.tsx` to the nested form (keep nmba's
existing `metadata` object verbatim; body = `return children`; import `./nmba.css`).
Then:
```bash
cd /Users/akashk/Documents/Projects/MoSJE
git mv apps/hub/src/app/portals/nmba/globals.css apps/hub/src/app/portals/nmba/nmba.css
```
Delete the three shared `@import`s + any `@theme`/`@custom-variant` from `nmba.css`.

- [ ] **Step 3: Typecheck**

```bash
npm --prefix apps/hub run typecheck
```
Expected: PASS.

- [ ] **Step 4: Verify in preview**

```bash
npm run dev
```
Open `/portals/nmba`, `/portals/nmba/epledge`, `/portals/nmba/admin/login`,
`/portals/nmba/admin/dashboard`. Confirm 200 + styling + AppSwitcher + no console errors.

- [ ] **Step 5: Teardown + commit (recipe §7)**

```bash
git rm -r apps/portals/nmba
```
Remove `ZONE_NMBA` + rewrites from `apps/hub/next.config.ts`; remove nmba scripts +
concurrently entry from root `package.json`; remove nmba from `.claude/launch.json`.
```bash
git add -A
git commit -m "refactor(consolidation): mount nmba natively in hub, retire its zone"
```

---

## Task 4: Migrate `tg`

Identical to Task 3 with slug=`tg`. Route groups `(console)` (under `admin/`) and
`(app)` (under `citizen/`) move as-is.

- [ ] **Step 1: Move + rewrite aliases**

```bash
cd /Users/akashk/Documents/Projects/MoSJE
git mv apps/portals/tg/src/app apps/hub/src/app/portals/tg
git mv apps/portals/tg/src/components apps/hub/src/components/tg
git mv apps/portals/tg/src/lib apps/hub/src/lib/tg
cd apps/hub
grep -rl "@/components\|@/lib" src/app/portals/tg src/components/tg src/lib/tg 2>/dev/null \
  | xargs sed -i '' -e 's#@/components/#@/components/tg/#g' -e 's#@/lib/#@/lib/tg/#g'
grep -rn "/tg/tg/" src && echo "FIX DOUBLED PATHS" || echo OK
```

- [ ] **Step 2: Demote layout + scope CSS**

Rewrite `apps/hub/src/app/portals/tg/layout.tsx` to nested form (keep tg's `metadata`
verbatim; `return children`; import `./tg.css`). Then:
```bash
git mv apps/hub/src/app/portals/tg/globals.css apps/hub/src/app/portals/tg/tg.css
```
Delete the three shared `@import`s + any `@theme`/`@custom-variant` from `tg.css`.

- [ ] **Step 3: Typecheck**

```bash
npm --prefix apps/hub run typecheck
```
Expected: PASS.

- [ ] **Step 4: Verify in preview**

```bash
npm run dev
```
Open `/portals/tg`, `/portals/tg/citizen/sign-in`, `/portals/tg/citizen/dashboard`,
`/portals/tg/admin/login`, `/portals/tg/admin/dashboard`. Confirm 200 + styling + AppSwitcher + no errors.

- [ ] **Step 5: Teardown + commit**

```bash
git rm -r apps/portals/tg
```
Remove `ZONE_TG` + rewrites, tg scripts + concurrently entry, `.claude/launch.json` tg entry.
```bash
git add -A
git commit -m "refactor(consolidation): mount tg natively in hub, retire its zone"
```

---

## Task 5: Migrate `nhapoa`

Identical to Task 3 with slug=`nhapoa` (many flat role routes: admin, call-center,
central-authority, district-officer, finance-officer, …).

- [ ] **Step 1: Move + rewrite aliases**

```bash
cd /Users/akashk/Documents/Projects/MoSJE
git mv apps/portals/nhapoa/src/app apps/hub/src/app/portals/nhapoa
git mv apps/portals/nhapoa/src/components apps/hub/src/components/nhapoa
git mv apps/portals/nhapoa/src/lib apps/hub/src/lib/nhapoa
cd apps/hub
grep -rl "@/components\|@/lib" src/app/portals/nhapoa src/components/nhapoa src/lib/nhapoa 2>/dev/null \
  | xargs sed -i '' -e 's#@/components/#@/components/nhapoa/#g' -e 's#@/lib/#@/lib/nhapoa/#g'
grep -rn "/nhapoa/nhapoa/" src && echo "FIX DOUBLED PATHS" || echo OK
```

- [ ] **Step 2: Demote layout + scope CSS**

Rewrite `apps/hub/src/app/portals/nhapoa/layout.tsx` to nested form (keep metadata
verbatim; `return children`; import `./nhapoa.css`). Then:
```bash
git mv apps/hub/src/app/portals/nhapoa/globals.css apps/hub/src/app/portals/nhapoa/nhapoa.css
```
Delete the three shared `@import`s + any `@theme`/`@custom-variant`.

- [ ] **Step 3: Typecheck**

```bash
npm --prefix apps/hub run typecheck
```
Expected: PASS.

- [ ] **Step 4: Verify in preview**

```bash
npm run dev
```
Open `/portals/nhapoa`, `/portals/nhapoa/admin/dashboard`,
`/portals/nhapoa/call-center/dashboard`, `/portals/nhapoa/district-officer/dashboard`.
Confirm 200 + styling + AppSwitcher + no errors.

- [ ] **Step 5: Teardown + commit**

```bash
git rm -r apps/portals/nhapoa
```
Remove `ZONE_NHAPOA` + rewrites, nhapoa scripts + concurrently entry, launch.json nhapoa entry.
```bash
git add -A
git commit -m "refactor(consolidation): mount nhapoa natively in hub, retire its zone"
```

---

## Task 6: Migrate `smile-admin` (first middleware + store merge)

**Files:**
- Move: `src/app`→`apps/hub/src/app/portals/smile-admin`; `src/{components,lib,store}`→`apps/hub/src/{components,lib,store}/smile-admin`
- Create/Modify: `apps/hub/src/middleware.ts` (merge smile-admin's middleware)
- Modify: demote layout, rename CSS; hub `next.config.ts`, root `package.json`, launch.json
- Delete: `apps/portals/smile-admin` (incl. its `middleware.ts`)

**Interfaces:**
- Consumes: recipe (Task 1), incl. §6 middleware merge.
- Produces: `/portals/smile-admin` native + the hub's first path-matched middleware branch (the pattern Task 7 reuses).

- [ ] **Step 1: Move routes/components/lib/store + rewrite aliases**

```bash
cd /Users/akashk/Documents/Projects/MoSJE
git mv apps/portals/smile-admin/src/app apps/hub/src/app/portals/smile-admin
git mv apps/portals/smile-admin/src/components apps/hub/src/components/smile-admin
git mv apps/portals/smile-admin/src/lib apps/hub/src/lib/smile-admin
git mv apps/portals/smile-admin/src/store apps/hub/src/store/smile-admin
cd apps/hub
grep -rl "@/components\|@/lib\|@/store" src/app/portals/smile-admin src/components/smile-admin src/lib/smile-admin src/store/smile-admin 2>/dev/null \
  | xargs sed -i '' -e 's#@/components/#@/components/smile-admin/#g' -e 's#@/lib/#@/lib/smile-admin/#g' -e 's#@/store/#@/store/smile-admin/#g'
grep -rn "/smile-admin/smile-admin/" src && echo "FIX DOUBLED PATHS" || echo OK
```

- [ ] **Step 2: Read the portal's middleware before deleting it**

```bash
cat apps/portals/smile-admin/src/middleware.ts
```
Note its `config.matcher` and its logic (auth redirects, header rewrites, etc.).

- [ ] **Step 3: Merge into the hub root middleware (recipe §6)**

Create or edit `apps/hub/src/middleware.ts`. If the hub has none yet, create it with a
dispatcher that guards smile-admin's logic behind its path prefix:

```tsx
import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/portals/smile-admin")) {
    // ── smile-admin logic (ported from apps/portals/smile-admin/src/middleware.ts) ──
    // Reproduce the original checks here, returning NextResponse.redirect/rewrite/next
    // as the original did. Keep behavior identical.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portals/smile-admin/:path*"],
};
```
Port the original body into the guarded branch verbatim (adjust any hardcoded
redirect paths to include the `/portals/smile-admin` prefix). Then delete the source:
```bash
git rm apps/portals/smile-admin/src/middleware.ts
```

- [ ] **Step 4: Demote layout + scope CSS**

Rewrite `apps/hub/src/app/portals/smile-admin/layout.tsx` to nested form (keep metadata
verbatim; `return children`; import `./smile-admin.css`). Then:
```bash
git mv apps/hub/src/app/portals/smile-admin/globals.css apps/hub/src/app/portals/smile-admin/smile-admin.css
```
Delete the three shared `@import`s + any `@theme`/`@custom-variant`.

- [ ] **Step 5: Typecheck**

```bash
npm --prefix apps/hub run typecheck
```
Expected: PASS.

- [ ] **Step 6: Verify in preview (incl. auth redirect behavior)**

```bash
npm run dev
```
Open `/portals/smile-admin`, `/portals/smile-admin/dashboard`. Confirm the middleware
still gates protected routes (e.g. unauthenticated hits redirect to the login route as
before), styling intact, AppSwitcher present, no console errors.

- [ ] **Step 7: Teardown + commit**

```bash
git rm -r apps/portals/smile-admin
```
Remove `ZONE_SMILE_ADMIN` + rewrites, smile scripts + concurrently entry, launch.json smile entry.
```bash
git add -A
git commit -m "refactor(consolidation): mount smile-admin natively in hub with merged middleware"
```

---

## Task 7: Migrate `pm-ajay` (no Tailwind — pure scoped CSS + middleware)

**Files:**
- Move: `src/app`→`apps/hub/src/app/portals/pm-ajay`; `src/{components,lib,store}`→`apps/hub/src/{components,lib,store}/pm-ajay`
- Modify: `apps/hub/src/middleware.ts` (add pm-ajay branch), demote layout, rename CSS; hub `next.config.ts`, root `package.json`, launch.json
- Delete: `apps/portals/pm-ajay`

**Interfaces:**
- Consumes: recipe (Task 1); middleware pattern from Task 6.
- Produces: `/portals/pm-ajay` native. Special: pm-ajay uses NO Tailwind — its styling is hand-rolled CSS + `--ds-*` vars, so its scoped CSS keeps ALL rules (only drop any tailwind import, which it doesn't have). This is the closest analog to the eutthan pattern.

- [ ] **Step 1: Move + rewrite aliases**

```bash
cd /Users/akashk/Documents/Projects/MoSJE
git mv apps/portals/pm-ajay/src/app apps/hub/src/app/portals/pm-ajay
git mv apps/portals/pm-ajay/src/components apps/hub/src/components/pm-ajay
git mv apps/portals/pm-ajay/src/lib apps/hub/src/lib/pm-ajay
git mv apps/portals/pm-ajay/src/store apps/hub/src/store/pm-ajay
cd apps/hub
grep -rl "@/components\|@/lib\|@/store" src/app/portals/pm-ajay src/components/pm-ajay src/lib/pm-ajay src/store/pm-ajay 2>/dev/null \
  | xargs sed -i '' -e 's#@/components/#@/components/pm-ajay/#g' -e 's#@/lib/#@/lib/pm-ajay/#g' -e 's#@/store/#@/store/pm-ajay/#g'
grep -rn "/pm-ajay/pm-ajay/" src && echo "FIX DOUBLED PATHS" || echo OK
```

- [ ] **Step 2: Merge pm-ajay middleware into the hub (recipe §6)**

```bash
cat apps/portals/pm-ajay/src/middleware.ts
```
Add a `pathname.startsWith("/portals/pm-ajay")` branch to `apps/hub/src/middleware.ts`
(same shape as Task 6), port the logic verbatim, and add `/portals/pm-ajay/:path*` to
the `config.matcher` array. Then:
```bash
git rm apps/portals/pm-ajay/src/middleware.ts
```

- [ ] **Step 3: Demote layout + scope CSS (no tailwind imports to remove)**

Rewrite `apps/hub/src/app/portals/pm-ajay/layout.tsx` to nested form (keep metadata
verbatim; `return children`; import `./pm-ajay.css`). Then:
```bash
git mv apps/hub/src/app/portals/pm-ajay/globals.css apps/hub/src/app/portals/pm-ajay/pm-ajay.css
```
Keep all rules in `pm-ajay.css` EXCEPT any `@import "@mosje/design-system/tokens.css";`
(hub loads it). pm-ajay has no `@import "tailwindcss"` to remove.

- [ ] **Step 4: Typecheck**

```bash
npm --prefix apps/hub run typecheck
```
Expected: PASS.

- [ ] **Step 5: Verify in preview**

```bash
npm run dev
```
Open `/portals/pm-ajay`, `/portals/pm-ajay/login`, `/portals/pm-ajay/unified`. Confirm
the MIS dashboard's hand-rolled SVG charts render with correct `--ds-*` colors, styling
intact (no Tailwind regressions since it never used Tailwind), AppSwitcher present, no errors.

- [ ] **Step 6: Teardown + commit**

```bash
git rm -r apps/portals/pm-ajay
```
Remove `ZONE_PM_AJAY` + rewrites, pm-ajay scripts + concurrently entry, launch.json entry.
At this point `apps/portals/` contains only already-native eutthan components (none) —
confirm `ls apps/portals` is empty and remove the now-empty dir if so:
```bash
rmdir apps/portals 2>/dev/null && echo "portals dir removed" || echo "portals not empty — inspect"
```
```bash
git add -A
git commit -m "refactor(consolidation): mount pm-ajay natively in hub, retire portals zone tier"
```

---

## Task 8: Prune dead root tooling + smoke-test the consolidated estate

**Files:**
- Modify: root `package.json` (`dev`, `check`, `lint`, `kill-ports` scope), `.claude/launch.json`
- Modify: `scripts/kill-dev-ports.sh` (drop retired ports)

**Interfaces:**
- Consumes: all portals now native (Tasks 2–7).
- Produces: a root `dev` that boots only the surviving processes (hub, website, docs, storybook).

- [ ] **Step 1: Slim the root `dev` command**

Edit root `package.json`: the `dev` `concurrently` invocation should now name only
`hub,dosje,docs,storybook` (portals removed in their teardown steps). Verify no stale
`dev:<portal>` / `check:<portal>` / `lint:<portal>` scripts remain for scw, nmba, tg,
nhapoa, smile, pm-ajay.

- [ ] **Step 2: Prune kill-ports**

Edit `scripts/kill-dev-ports.sh` to drop the retired ports (4123–4128), keeping
3000/3001/3002/6006.

- [ ] **Step 3: Full smoke test**

```bash
npm run dev
```
Walk every route in `consolidation-baseline.md`: `/`, `/portals/eutthan-admin`,
`/portals/scw`, `/portals/nmba`, `/portals/tg`, `/portals/nhapoa`,
`/portals/smile-admin`, `/portals/pm-ajay`, `/website`, `/design-system`, `/storybook/`.
Confirm each 200 + first paint. Confirm (process list) only 4 servers run, not 10.

- [ ] **Step 4: Typecheck + lint the hub**

```bash
npm --prefix apps/hub run typecheck && npm --prefix apps/hub run lint
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(consolidation): prune retired portal zones from root dev/check/lint tooling"
```

---

## Task 9 (OPTIONAL): Fold `docs` and `website` for a 2-process floor

Only do this if you want the absolute-minimum topology (hub + storybook). Both are
already Next 16, so there's no version-skew payoff — this is purely single-origin
tidiness and is higher-effort (website/dosje is the largest app). Recommended: defer
until after Tasks 0–8 are validated and demoed.

- [ ] **Step 1: Fold `apps/docs` design-system routes**

Apply the recipe (slug=`design-system`, source `apps/docs`) to move its routes under
`apps/hub/src/app/design-system`, demote its layout, scope its CSS, remove `ZONE_DOCS`
+ the `/design-system` rewrites, and retire the `docs` zone from tooling + launch.json.
Verify `/design-system` 200 natively.

- [ ] **Step 2: Fold `apps/dosje` website**

Apply the recipe (slug=`website`, source `apps/dosje`, dest `apps/hub/src/app/website`).
The website is large and content-heavy — move its `public/` assets into the hub's
`public/website/` and fix asset paths, demote the layout, scope CSS, remove `ZONE_WEBSITE`
+ `/website` rewrites, retire the dosje zone. Verify `/website` and key sub-pages 200 natively.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "refactor(consolidation): fold docs + website into hub — single-origin estate (hub + storybook only)"
```

---

## Rollout & rollback

- **Per-task rollback:** each portal is one commit. `git revert <sha>` restores that portal's zone (its `apps/portals/<slug>` dir + config entries) without touching the others.
- **Full rollback:** the whole effort lives on `feat/single-origin-consolidation`; abandon the branch to return to the 10-zone `main`.
- **Reviewer gate:** each Task 2–7 is independently shippable — a reviewer can approve scw while nmba is still a zone. Do NOT batch multiple portal migrations into one commit.

## Self-review notes (author)

- **Spec coverage:** "single portal via hub + AppSwitcher" → Tasks 2–8 make every portal a native hub route with the hub-owned AppSwitcher; "DS documentation" → unaffected (apps/docs + storybook survive; optional fold in Task 9); "audit-report mechanism" → unaffected (`tools/design-audit` targets live URLs; `/reports` already native in hub).
- **Version skew** (Next 15 vs 16, Tailwind v3/v4/none): resolved implicitly — all migrated code compiles under the hub's single Next 16 + Tailwind v4 toolchain; no per-portal upgrade task needed.
- **Middleware single-root constraint:** handled explicitly in Tasks 6–7 (merge, path-matched).
- **CSS collision:** portals define no `@theme` of their own (verified: 0 `@theme` lines across all six), so scoping = dropping shared `@import`s; no theme reconciliation required.
- **Known risk to watch during execution:** internal links written to rely on Next's `basePath` auto-prefixing (rather than absolute `/portals/<slug>/…`). Since the folder path now equals the old basePath, absolute links are safe; audit each portal's nav/`<Link>` usage during its verify step and fix any relative ones.
