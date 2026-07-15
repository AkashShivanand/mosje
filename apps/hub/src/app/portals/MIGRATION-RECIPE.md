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

## 3b. Prefix basePath-relative internal links (LEARNED — scw had 25+ across 3 forms)
The portal ran under `basePath: /portals/<slug>`, which auto-prefixed bare
absolute links. Native in the hub there is NO basePath, so a bare `/login` now
points at the hub root, not the portal. Internal route strings appear in THREE
forms — the naive `href="/…"` grep MISSES two of them (this exact gap 404'd the
scw sidebar + admin row-actions on the first pass), so use the broad candidate
grep below and inspect EVERY hit:
```bash
cd apps/hub
# Every quoted string that starts with "/" + a letter, not already under /portals/<slug>,
# excluding protocol-relative (//) — covers all three forms at once.
# Use find|xargs (a multi-dir `grep -r` was observed to silently skip src/app on nmba):
find src/app/portals/<slug> src/components/<slug> src/lib/<slug> \
  -type f \( -name '*.ts' -o -name '*.tsx' \) 2>/dev/null \
  | xargs grep -noE "[\`\"']/[a-zA-Z][^\`\"'()]*" 2>/dev/null \
  | grep -vE "[\`\"']/portals/<slug>" | sort -u
```
NOTE the exclusion is `[\`\"']/portals/<slug>` (quote-preceded), NOT a bare
`/portals/<slug>`: files that live UNDER `src/app/portals/<slug>/` carry that
substring in their own PATH in grep's `file:line:` prefix, so a bare exclusion
silently drops EVERY app-dir hit (this bit tg). Requiring the leading quote means
only already-prefixed matched URLs are excluded, never file paths.
Also catch a bare root nav entry `href: "/"` (the char-class `[a-zA-Z]` above skips it) —
if the portal's nav has a "home"/dashboard entry pointing at `/`, prefix it to `/portals/<slug>`.
The three forms to prefix (all found in scw):
1. **String attr:** `href="/login"` → `href="/portals/<slug>/login"`
2. **Object literal** (nav arrays, service tiles): `{ href: "/epledge" }` → `{ href: "/portals/<slug>/epledge" }`
3. **Template literal** (row actions): `` href={`/admin/x/${id}`} `` → `` href={`/portals/<slug>/admin/x/${id}`} ``
Also check `router.push(...)`, `.replace(...)`, `redirect(...)`, and `<Link to=...>`.
LEAVE alone: external URLs, anchors (`#…`), `/api/…` calls, and asset paths already
under `/portals/<slug>/…`. Active-nav highlighting compares `usePathname()` (which
returns `/portals/<slug>/…`) against these hrefs, so unprefixed hrefs also silently
break active states — another reason to catch all three forms.

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
**PRESERVE `<html>` attributes as a wrapper div (LEARNED — 3 portals silently lost this).**
Before deleting the old `<html …>` tag, check it for attributes carrying design
semantics — most portals set **`data-surface="portal"`**, which applies the DS portal
type scale (`[data-surface="portal"]` in `tokens.css`). A nested layout cannot set
`<html>` attributes, so move them onto a wrapper div. The selector is attribute-based
and CSS custom properties inherit, so the cascade is identical:
```tsx
export default function <Slug>Layout({ children }: { children: React.ReactNode }) {
  return <div data-surface="portal">{children}</div>;  // + any portal providers inside
}
```
Only add it if the ORIGINAL `<html>` had it — verify with
`git show main:apps/portals/<slug>/src/app/layout.tsx | grep data-surface`
(scw/nmba/nhapoa/smile-admin/pm-ajay had it; tg did NOT — do not add it where it wasn't).
Ignore `className={font.variable}` (hub root owns the font) and `lang`/`suppressHydrationWarning`
(hub root owns those).

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

## 6. Merge middleware (only if the portal had one) — into `proxy.ts`, NOT `middleware.ts`
Next 16 renamed the middleware convention to **`proxy.ts`**, and the hub already has
one at **`apps/hub/src/proxy.ts`** (it exports `async function proxy(req)` + `config.matcher`).
An app gets exactly ONE — so do NOT create `apps/hub/src/middleware.ts`. Fold the portal's
logic into `proxy()` as a branch guarded by `pathname.startsWith("/portals/<slug>")`,
placed BEFORE the ZONES lookup. The existing matcher already covers `/portals/:path*`,
so no matcher change is needed.

**CRITICAL — paths change from basePath-relative to FULL.** The portal's middleware ran
under `basePath: /portals/<slug>`, and Next **strips the basePath before middleware runs**
and re-adds it to redirects. So the original code used basePath-RELATIVE paths
(`pathname === "/login"`, redirect to `"/login"`). Natively in the hub there is NO basePath,
so `pathname` arrives FULL (`/portals/<slug>/login`) and redirects are NOT re-prefixed.
Every path in the ported logic must become full. Porting it verbatim silently breaks the
guard — every route reads as protected and redirects to the hub root's `/login`.

Correct shape for the cookie-presence guards used by smile-admin / pm-ajay:
```ts
const SLUG_PUBLIC = ["/portals/<slug>/login", "/portals/<slug>/forgot-password"];
const SLUG_SESSION_COOKIE = "<original_cookie_name>";   // keep the name EXACTLY — the
                                                        // client auth-context sets it

// inside proxy(), before the ZONES lookup:
if (pathname === "/portals/<slug>" || pathname.startsWith("/portals/<slug>/")) {
  const isPublic = SLUG_PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"));
  // let public pages and asset-like paths (they contain a ".") through
  if (isPublic || pathname.includes(".")) return NextResponse.next();
  if (!req.cookies.get(SLUG_SESSION_COOKIE)) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/portals/<slug>/login";
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
```
Keep the `pathname.includes(".")` escape — the portal's `public/` assets now live at
`/portals/<slug>/…` and DO match the hub matcher, so without it they'd be guarded.
Then delete the portal's `src/middleware.ts`. Verify BOTH: unauthenticated deep route →
redirects to `/portals/<slug>/login` (not `/login`), and the login page itself loads.

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

## 7b. Expect stricter typecheck (LEARNED — nmba surfaced 200 errors)
The hub's `tsconfig.json` is STRICTER than the portals' were (notably
`noUncheckedIndexedAccess: true`). Compiling a portal under the hub surfaces
pre-existing latent type errors (array/index access possibly-undefined). Fix them
with minimal null-safety guards / type-only widening — NO behavior change. This is
expected on every portal; budget for it. `npm --prefix apps/hub run typecheck` is
the gate and must reach exit 0. Also expect the `--max-warnings 0` pre-commit lint
gate to flag pre-existing unescaped JSX entities and `<img>` usages — fix properly
(escape entities; move static images to `next/image` or scope a justified disable
for dynamic `data:`/`blob:` srcs), never `--no-verify`.

## 8. Verify
`npm run dev`, open `http://localhost:3000/portals/<slug>`, confirm 200 +
first paint + no console errors + AppSwitcher FAB present (from hub, bottom-left).
