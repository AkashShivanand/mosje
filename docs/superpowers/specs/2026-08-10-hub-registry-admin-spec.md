# Hub admin: runtime control of the estate registry (status, order, labels)

> Spec authored 2026-08-10 via `/spec`. This is the build target and the review
> target — the loop builds from it, reviews the build against it, and fixes
> whatever fails until the review passes clean.

## Context

The estate registry is a compile-time constant. `DEFAULT_APPS` in
`packages/design-system/components/navigation/app-switcher-utils.ts` holds 23
entries (1 website, 20 portals, 2 resources) and four surfaces read it at build
time. Changing what a stakeholder sees means editing the array and redeploying.

Three costs, all currently paid:

1. **No demo curation.** You cannot show a specific audience a specific subset
   without a redeploy.
2. **Unfinished work is on the board.** A live portal that is not presentable
   keeps getting opened by reviewers.
3. **The registry drifts from reality.** `/portals/scw` is a fully built portal
   (login, admin, volunteer, SAGE, e-pledge, our-services — 8 route groups) but
   the registry lists it as `{ path: "/portals/senior-citizens", status:
   "planned" }`. Built, deployed, advertised nowhere.

## Current state (verified 2026-08-10)

Registry inventory — 23 entries, 9 live:

| Group | Category | Entries | Live | Planned |
|---|---|---|---|---|
| Website | — | 1 | 1 | 0 |
| Portals | Finance & development corporations | 3 | 0 | 3 |
| Portals | Schemes & scholarships | 7 | 2 | 5 |
| Portals | Social defence & welfare | 6 | 4 | 2 |
| Portals | Commissions & boards | 4 | 0 | 4 |
| Resources | — | 2 | 2 | 0 |
| **Total** | | **23** | **9** | **14** |

Who reads the registry:

| Surface | File | Reads |
|---|---|---|
| Hub home stat tiles | `apps/hub/src/app/page.tsx:7` | portal count + live count |
| Portals explorer | `apps/hub/src/components/portals-explorer.tsx:8` | full portal list |
| Gate "behind the door" | `apps/hub/src/app/gate/page.tsx:34` | portal count |
| AppSwitcher FAB | `packages/design-system/components/navigation/zone-switcher.tsx:46` | full list |
| Site header nav | `apps/hub/src/components/site-nav-items.ts:20` | hardcoded, does NOT read the registry |

Routes are independent of the registry. `proxy.ts` enforces only the site gate
and two portal session guards, so hiding a card stops nobody with the URL.

The admin cookie is set with `path: "/admin"`, so the browser never sends it on
`/portals/*` — the proxy currently cannot tell an admin from anyone else.

## Proposed change

```
DEFAULT_APPS (code, the seed)
        │
        ▼
applyRegistryOverrides(base, config)   ← pure, tested, in @mosje/design-system
        │
        ├── hub home / gate / portals explorer   (server-read, cache-tagged)
        ├── AppSwitcher (apps prop from root layout)
        └── proxy.ts → hidden path? → /unavailable (503) unless admin
```

### Data model

One `hub_settings` row, key `portal_registry`, JSON value:

```ts
export interface RegistryOverride {
  status?: "live" | "planned" | "hidden";
  /** Dense sort key within the entry's category, ascending. */
  order?: number;
  name?: string;
  desc?: string;
  org?: string;
  abbr?: string;
  category?: string;
}

export interface RegistryConfig {
  version: 1;
  /** Keyed by AppEntry.path — the registry's stable id. */
  entries: Record<string, RegistryOverride>;
}

export function applyRegistryOverrides(
  base: AppEntry[],
  config: RegistryConfig | null,
): AppEntry[];
```

Merge rules:

- **Code is the seed, the store is a sparse patch.** A path absent from
  `entries` renders exactly as code defines it. A new portal added to
  `DEFAULT_APPS` later appears with its code status and needs no store edit.
- **Unknown paths in the store are ignored** (one `console.warn`, never a
  throw).
- **`status: "hidden"` is the new third state.** `live` and `planned` keep
  their current meaning.
- **Hidden entries are dropped before every count.**
- **Ordering is dense and total per category.** A move writes explicit
  `order: 0..n-1` for every entry in that category. Cross-category order stays
  fixed by `PORTAL_CATEGORIES`.
- **Label overrides are string-replace only** — `name`, `desc`, `org`, `abbr`,
  `category`. `path`, `group`, `newTab` are code-only.
- **Store failure = code defaults.** `readSetting` returns null on every
  failure; null means no overrides. This is also the rollback.

### Propagation

The read is wrapped in `unstable_cache(..., { tags: ["portal-registry"] })` and
every admin save calls `revalidateTag("portal-registry")`. Changes land
immediately; between edits the hub keeps static rendering. NOT `force-dynamic`
on shared surfaces: the root layout is shared by the AppSwitcher, ~79 website
routes and every portal page.

### Enforcement

`proxy.ts` gains a hidden-path check after the gate redirect and before the
portal session guards:

- Longest-prefix match of `pathname` against every hidden entry's `path`.
- Match → `NextResponse.rewrite("/unavailable?entry=<name>", { status: 503 })`.
- Admin bypass: a valid `mosje-admin` cookie passes through. Requires widening
  the admin cookie path from `/admin` to `/` in `signInAdmin` /
  `signOutAdmin`. Cookie stays `httpOnly`, `secure` in production,
  `sameSite: lax`, carries only an HMAC digest.
- `/unavailable` is a new gate-styled route: "This portal is not currently
  available", `robots: noindex`, plus an admin-only line noting the bypass.

### Admin UI — `/admin/portals`

DS Audit: `Select` ✅ existing · `Button` ✅ existing · `Input` ✅ existing ·
`FormField` ✅ existing · `Alert` ✅ existing · `Badge` ✅ existing ·
`Icon` ✅ existing · page layout ➕ app-local. **No new DS components.**

One row per entry, grouped by group then category, in effective order. Each
row: name + path, status `Select`, move up / move down `Button`s, and a
disclosure holding the five label-override `Input`s with the code value as
placeholder. "Reset to code defaults" per row and for the whole registry.
Saves through a server action that validates the schema, rejects a payload
over 32 KB, writes the row, and calls `revalidateTag`.

Up/down over drag-and-drop is deliberate: keyboard-operable and
screen-reader-announceable without a dnd library, which matters for WCAG 2.1 AA.

### SCW correction

The Senior Citizens entry becomes `path: "/portals/scw"`, `status: "live"`,
with name and description matching the built portal. A test asserts every live
entry's path resolves to a directory under `apps/hub/src/app`.

## Files

| File | Change |
|---|---|
| `packages/design-system/components/navigation/registry-overrides.ts` | **New.** `RegistryOverride`, `RegistryConfig`, `applyRegistryOverrides`, `parseRegistryConfig` |
| `packages/design-system/components/navigation/registry-overrides.test.ts` | **New.** Merge, order, unknown-path, malformed-input tests |
| `packages/design-system/components/navigation/app-switcher-utils.ts` | Fix the SCW entry (path, status, name, desc) |
| `packages/design-system/index.ts` | Export the new types + functions |
| `packages/design-system/package.json` | Widen test glob to include `components/**/*.test.ts` |
| `apps/hub/src/lib/settings/store.ts` | Add `SETTING_PORTAL_REGISTRY = "portal_registry"` |
| `apps/hub/src/lib/registry/resolve.ts` | **New.** Cached read + merge; `REGISTRY_TAG` |
| `apps/hub/src/lib/registry/resolve.test.ts` | **New.** Fallback-to-code-on-store-failure |
| `apps/hub/src/lib/admin/auth.ts` | Cookie path `/admin` → `/` (set and delete) |
| `apps/hub/src/proxy.ts` | Hidden-path block + admin bypass, after `gateRedirect` |
| `apps/hub/src/app/unavailable/page.tsx` | **New.** Branded 503 page |
| `apps/hub/src/app/admin/portals/page.tsx` | **New.** Server page, `requireAdmin`, `force-dynamic` |
| `apps/hub/src/app/admin/portals/registry-form.tsx` | **New.** Client editor |
| `apps/hub/src/app/admin/portals/actions.ts` | **New.** Validate, write, `revalidateTag` |
| `apps/hub/src/app/admin/page.tsx` | Link to the new section |
| `apps/hub/src/app/layout.tsx` | Resolve registry, pass `apps` to `ConditionalAppSwitcher` |
| `apps/hub/src/components/conditional-app-switcher.tsx` | Accept and forward `apps` |
| `apps/hub/src/app/page.tsx` | Read resolved registry instead of `DEFAULT_APPS` |
| `apps/hub/src/app/portals/page.tsx` | Resolve server-side, pass to `PortalsExplorer` |
| `apps/hub/src/components/portals-explorer.tsx` | Take `portals` as a prop |
| `apps/hub/src/app/gate/page.tsx` | Count from the resolved registry |
| `apps/hub/src/lib/registry/routes.test.ts` | **New.** Every live path has a route directory |
| `.claude/rules/hub-integration.md` | Document the runtime layer; code stays the seed |

## Acceptance criteria

1. `/admin/portals` lists all 23 registry entries grouped by group and
   category, each with its current effective status.
2. Setting an entry to `hidden` and saving removes it from `/portals`, the home
   stat counts, the gate count, and the AppSwitcher panel — on the next page
   load, no waiting period.
3. Requesting a hidden entry's path (and any path beneath it) as a non-admin
   returns the `/unavailable` page with HTTP 503 and `noindex`.
4. Requesting the same path while signed in at `/admin` in the same browser
   renders the real portal.
5. Setting an entry to `live` or `planned` reproduces today's behaviour exactly.
6. Moving an entry up or down changes its position in `/portals` and the
   AppSwitcher, and the new order survives a reload and a redeploy.
7. Overriding `name`, `desc`, `org`, `abbr` or `category` changes that text
   everywhere the registry renders; clearing the field restores the code value.
8. Deleting the `portal_registry` row restores exactly the code-default estate.
9. With `SUPABASE_URL` unset (local dev), every surface renders code defaults
   and `/admin/portals` reports the store is unconfigured rather than erroring.
10. A store read timeout or HTTP error renders code defaults, matching the
    gate's existing degradation contract.
11. A malformed or oversized stored value is rejected on read, logs a warning,
    and falls back to code defaults without a 500.
12. The registry entry for Senior Citizens points at `/portals/scw`, is `live`,
    and appears as a clickable card in the explorer.
13. Every `live` entry's path resolves to a real route; the new test fails CI
    otherwise.
14. `/` and `/portals` remain statically rendered (no `force-dynamic`);
    confirmed in `next build` output.
15. `npm run check` passes in `apps/hub`; `npm test` passes in `apps/hub` and
    `packages/design-system`.
16. The editor is fully keyboard-operable: status, move, edit and save reachable
    by Tab, order changes announced via a live region.

## Testing plan

| Layer | What | Count |
|---|---|---|
| Unit | `applyRegistryOverrides`: hidden filter, dense ordering, label merge, unknown path, null config, malformed JSON, oversized payload | +8 |
| Unit | `parseRegistryConfig` schema rejection (bad status, non-numeric order, wrong version) | +4 |
| Unit | `resolveRegistry` falls back to `DEFAULT_APPS` on store null / throw / timeout | +3 |
| Unit | Every live path has a route directory (the drift guard) | +1 |
| Integration | Proxy: hidden path → 503; hidden subpath → 503; admin cookie → pass; live path → pass | +4 |
| Manual | Hide a portal in `hub-gated`, confirm it vanishes from all four surfaces and the URL 503s, then restore | 1 pass |

## Rollback

Delete the `portal_registry` row from `hub_settings`. Every surface reverts to
`DEFAULT_APPS`, because a missing key and a failed read are the same thing to
the store. No migration to unwind. If the proxy check misbehaves, revert the
`proxy.ts` hunk alone — the admin page and the stored row become inert.

## Out of scope

- Per-viewer or per-audience visibility.
- Named admin accounts or an audit log of who changed what.
- Editing `path`, `group` or `newTab` from the admin page.
- Adding or deleting registry entries at runtime.
- Scheduling visibility changes.
- Any change to portal-level authentication.
- Making `SITE_NAV` (the site header) registry-driven.

## Standing assumptions

1. Hiding `/website` or `/design-system` is allowed but does not touch the site
   header, which is hardcoded and does not read the registry.
2. `newTab` and `path` stay code-only.
3. One shared configuration, no preview mode — each save is live immediately.
