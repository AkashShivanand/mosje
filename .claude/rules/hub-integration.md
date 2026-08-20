---
paths:
  - "packages/design-system/components/navigation/app-switcher-utils.ts"
  - "apps/hub/**"
---

# Hub integration rules — adding a new portal or app

**Every new portal or site added to the MoSJE estate MUST be registered in all three places in the same commit as the portal build:**

## 0. Code is the seed; `/admin/portals` is the runtime layer

`DEFAULT_APPS` is the **only place registry entries are born**, and it stays that way.
On top of it, `/admin/portals` writes a **sparse override patch** to the `portal_registry`
row in `hub_settings`, merged at render time by `applyRegistryOverrides`
(`packages/design-system/components/navigation/registry-overrides.ts`).

What that means when you add a portal:

- **Nothing changes for you.** A path absent from the stored patch renders exactly as
  code defines it, so a new entry appears with its code status and needs no admin edit.
- **Do not "fix" the registry from `/admin`.** Renaming or reordering there pins that
  field to the stored patch, and a later code change to the same field stops taking
  effect. Edit `DEFAULT_APPS` for anything permanent; use `/admin` for demo curation.
- **`status: "hidden"` exists only at runtime.** It is not a value you write in code —
  code has `live` and `planned` only.
- **Hidden means blocked.** `apps/hub/src/proxy.ts` rewrites hidden paths to
  `/unavailable` with a 503 for everyone except a signed-in admin, so a hidden portal's
  login page is unreachable too.
- **`path`, `group` and `newTab` are code-only** and cannot be overridden.

Every live entry's path must resolve to a real route — `src/lib/registry/routes.test.ts`
fails CI otherwise. That guard exists because SCW shipped at `/portals/scw` while the
registry still pointed at `/portals/senior-citizens` and said `planned`, so a finished
portal was invisible and nothing caught it.

## 1. `DEFAULT_APPS` in `packages/design-system/components/navigation/app-switcher-utils.ts`

This is the **single source of truth in code** for the hub portals explorer page and the
DemoDock's Apps tab (both read it through the resolver above, never directly).

- Add an `AppEntry` with the correct `group`, `category`, `path`, `desc`, `org`, and `status`.
- Set `status: "live"` immediately when the portal is built and running. Never leave a built portal as `"planned"`.
- Set `status: "planned"` only for portals that are not yet built — grayed-out cards in the portals explorer are the correct treatment for upcoming work.

## 2. Ordering rule — **live entries before planned entries within every category**

Within each `category` bucket, all `status: "live"` entries must appear **before** any `status: "planned"` entries. This applies to `DEFAULT_APPS` array order, since both the portals explorer and the AppSwitcher preserve registry order without sorting.

When adding a new live portal to an existing category, insert it after the last live entry in that category, not at the end of the category block.

## 3. Hub routing — `apps/hub/next.config.ts`

Add a `rewrites()` entry so the hub proxies the portal:

```ts
{
  source: "/portals/<slug>/:path*",
  destination: "http://localhost:<port>/portals/<slug>/:path*",
}
```

Also add the portal to `apps/hub/package.json` dev scripts so `npm run dev` brings it up alongside the hub.

## 4. The assistant — nothing to do, and that is deliberate

The assistant's switch lives ON THE REGISTRY ROW at `/admin/portals`, beside the entry's
status — one row per surface, so everything about a portal is in one place. It therefore
appears for a new portal on its own. Two consequences worth knowing:

- **A new portal arrives with the assistant OFF.** `CHATBOT_DEFAULT_ON`
  (`apps/hub/src/lib/chatbot/config.ts`) is `["/website"]` and nothing else. Turning it
  on for a portal is a deliberate admin act, not something a portal inherits.
- **The stored config is a SPARSE PATCH**, and only values that differ from the code
  default are written. That is what stops a blob saved today from dictating the answer
  for a path that did not exist when it was saved.

Do not add the portal to a second list, and do not give the assistant a settings page of
its own. It had one briefly and it was wrong: two tables listing the same 22 surfaces,
each with one control. The UI is merged; the STORAGE is deliberately not — `proxy.ts`
reads the registry row on every request to enforce the hidden-entry block, so a malformed
assistant config must never be able to reach that path.

## 5. Portals explorer page

The portals explorer (`apps/hub/src/components/portals-explorer.tsx`) reads `DEFAULT_APPS` automatically — no manual edits needed there as long as `DEFAULT_APPS` is correct.

## Checklist when shipping a new portal

- [ ] `DEFAULT_APPS` entry added with correct `group: "Portals"`, `category`, and `status: "live"`
- [ ] Entry is positioned after all other live entries in the same category (before planned entries)
- [ ] Hub `next.config.ts` rewrite added
- [ ] Hub `package.json` dev script added (`dev:<slug>`)
- [ ] `npm run dev` from repo root starts the new portal
- [ ] Portal appears as a live (clickable "Open portal →") card in the portals explorer at `http://localhost:3007/portals`
- [ ] Portal appears in the AppSwitcher FAB with a "live" badge
- [ ] Portal's registry row at `/admin/portals` carries an assistant switch, **off** — no code change needed
