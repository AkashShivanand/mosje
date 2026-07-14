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

## 2b. Move public/ assets (LEARNED — scw pilot)
If the portal has a `public/` dir, its files were served under the old basePath
(`/portals/<slug>/…`). Re-home them so the SAME URLs resolve from the hub:
```bash
mkdir -p apps/hub/public/portals/<slug>
git mv apps/portals/<slug>/public/* apps/hub/public/portals/<slug>/
```
No code path changes needed — `/portals/<slug>/brand/x.svg` still points at the
same file. Verify with `ls apps/hub/public/portals/<slug>`.

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

## 3b. Prefix basePath-relative internal links (LEARNED — scw had 21)
The portal ran under `basePath: /portals/<slug>`, which auto-prefixed bare
absolute links. Native in the hub there is NO basePath, so a bare `href="/login"`
now points at the hub root, not the portal. Find and fix every internal link /
redirect that starts with `/` but NOT with `/portals/<slug>`:
```bash
cd apps/hub
grep -rnE '(href|push|replace|redirect)\(?["'"'"']/(?!portals/<slug>)' \
  src/app/portals/<slug> src/components/<slug> src/lib/<slug> 2>/dev/null
```
Prefix each hit with `/portals/<slug>` (e.g. `href="/login"` → `href="/portals/<slug>/login"`).
Leave external URLs, anchors (`#…`), and asset paths already under `/portals/<slug>/…` alone.
The controller's browser verify is the backstop, but fix what this grep finds first.

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
`ColorModeProvider`, `UX4GAccessibilityWidget`, and `@mosje/design-system/icons.css`.
The hub root layout (`apps/hub/src/app/layout.tsx`) already loads the Noto Sans font,
the providers, the AppSwitcher, AND `@mosje/design-system/icons.css` (Material Symbols)
once for every native portal — verified present as of the scw pilot. Do NOT re-import
icons.css per portal; if icons render as literal ligature text, the hub root import is
missing, not the portal's.

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
**`git rm -r` is BLOCKED by `.claude/hooks/guard.sh`** (recursive-delete guard). After
the `git mv`s above, remove the remaining tracked config files individually, then clean
empty dirs (`rmdir` refuses non-empty dirs — safe):
```bash
git rm apps/portals/<slug>/.gitignore apps/portals/<slug>/README.md apps/portals/<slug>/eslint.config.* \
  apps/portals/<slug>/next.config.* apps/portals/<slug>/package*.json apps/portals/<slug>/postcss.config.* \
  apps/portals/<slug>/tailwind.config.* apps/portals/<slug>/tsconfig.json 2>/dev/null
rmdir apps/portals/<slug>/src apps/portals/<slug> 2>/dev/null || echo "leftover gitignored artifacts (.next/node_modules) remain — harmless"
```
Then remove ALL FOUR registrations (missing any one breaks the mount or leaves dead config):
- **`apps/hub/src/proxy.ts`** ← **CRITICAL, LEARNED**: delete the portal's entry from the
  `ZONES` array. This file is the hub's Next-16 middleware; if the entry stays, it probes
  the dead zone and rewrites the route to `/zone-unavailable` with a **503 before the native
  route can render**. (This is the #1 thing the first recipe draft missed.)
- `apps/hub/next.config.ts`: delete the `ZONE_<SLUG>` const + its rewrite rules.
- Root `package.json`: delete `dev:<slug>`, `check:<slug>`, `lint:<slug>` scripts,
  remove the portal from the `dev` `concurrently` command (`-n` names + its `bash -c` entry),
  and from the `check`/`lint` chains.
- `.claude/launch.json`: delete the portal's configuration entry.

The `DEFAULT_APPS` registry (`packages/design-system/.../app-switcher-utils.ts`) needs NO
change — native mounts keep the same `/portals/<slug>` path, so the AppSwitcher/explorer entry stays valid.

## 8. Verify
`npm run dev`, open `http://localhost:3000/portals/<slug>`, confirm 200 +
first paint + no console errors + AppSwitcher FAB present (from hub, bottom-left).
