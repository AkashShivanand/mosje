---
paths:
  - "packages/design-system/components/navigation/app-switcher-utils.ts"
  - "apps/hub/**"
---

# Hub integration rules — adding a new portal or app

**Every new portal or site added to the MoSJE estate MUST be registered in all three places in the same commit as the portal build:**

## 1. `DEFAULT_APPS` in `packages/design-system/components/navigation/app-switcher-utils.ts`

This is the **single source of truth** for both the hub portals explorer page and the compact AppSwitcher FAB.

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

## 4. Portals explorer page

The portals explorer (`apps/hub/src/components/portals-explorer.tsx`) reads `DEFAULT_APPS` automatically — no manual edits needed there as long as `DEFAULT_APPS` is correct.

## Checklist when shipping a new portal

- [ ] `DEFAULT_APPS` entry added with correct `group: "Portals"`, `category`, and `status: "live"`
- [ ] Entry is positioned after all other live entries in the same category (before planned entries)
- [ ] Hub `next.config.ts` rewrite added
- [ ] Hub `package.json` dev script added (`dev:<slug>`)
- [ ] `npm run dev` from repo root starts the new portal
- [ ] Portal appears as a live (clickable "Open portal →") card in the portals explorer at `http://localhost:3000/portals`
- [ ] Portal appears in the AppSwitcher FAB with a "live" badge
