# Demo tooling — DemoDock (demo-only, mounted once)

`AppSwitcher` no longer exists. It has been replaced by **`DemoDock`**, one
floating demo console mounted **once**, by the hub's root layout — not per
portal, and not something a new portal ever adds itself.

## What changed and why

The old rule mandated an `AppSwitcher` FAB on every portal page as real
navigation. That component carried a hand-rolled copy of the colour-mode
swatches (duplicating `ColorModeSwitcher`) and was mounted independently in
half a dozen root layouts, alongside a second FAB (`DemoFab`) for demo
credentials, gated on `NODE_ENV === "development"` — invisible on the exact
deployed review site where stakeholders needed it.

`DemoDock` replaces both: one FAB, bottom-left, opening a tabbed panel —
**Apps** (the searchable cross-zone destination list, `AppSwitcherPanel`),
**Colour** (the SAMAVESH brand-palette picker, `ColorModeSwitcher`), and
**Sign in** (demo credentials for whatever login surface the current path
resolves to, `DemoAccountsPanel`, present only when the path has one).

## Rule

1. **`DemoDock` is mounted exactly once**, in `apps/hub/src/app/layout.tsx`,
   via `ConditionalDemoDock` (`apps/hub/src/components/conditional-demo-dock.tsx`).
   No portal, page, or app adds its own `DemoDock` or `DemoFab` mount — the
   dock lives above every page in the hub's single-origin layout and reads
   `pathname` itself.
2. **It is demo tooling, not product.** Nothing in it is meant to reach a
   citizen or officer's real session with a live portal. The panel's footer
   says so on every render.
3. **Visibility is `NEXT_PUBLIC_DEMO_TOOLS`, defaulting ON.** Absent or any
   value other than the exact string `"false"` means visible. Set
   `NEXT_PUBLIC_DEMO_TOOLS=false` to remove it entirely on a genuinely public
   deployment — `ConditionalDemoDock` reads the flag in the hub; the design
   system itself stays environment-unaware. It is also hidden on the hub root
   (`/`, the portals index itself), `/gate`, and everything under `/admin`,
   where it offers nothing relevant.
4. **A genuinely public portal ships with no dock at all.** That is the
   correct, unremarkable state once `NEXT_PUBLIC_DEMO_TOOLS=false` — there is
   no per-portal opt-out to configure, because there is no per-portal mount
   to remove.
5. `DemoFab` (the older, per-page panel `DemoDock` superseded) still exists
   and is still exported, for the rare case of a standalone Storybook demo or
   a page genuinely outside the hub's layout tree. It is not to be mounted
   inside the hub alongside `DemoDock` — that reintroduces the duplicate-FAB
   problem this rule exists to prevent.

## Pattern (how the hub wires it — nothing for a portal to copy)

```tsx
// apps/hub/src/components/conditional-demo-dock.tsx
"use client";
import { usePathname } from "next/navigation";
import { DemoDock } from "@mosje/design-system";

export function ConditionalDemoDock() {
  const pathname = usePathname();
  if (process.env.NEXT_PUBLIC_DEMO_TOOLS === "false") return null;
  if (pathname === "/" || pathname === "/gate" || pathname.startsWith("/admin")) return null;
  return <DemoDock pathname={pathname} />;
}
```

```tsx
// apps/hub/src/app/layout.tsx
<ColorModeProvider>
  {/* all providers, page content */}
  {children}
  <ConditionalDemoDock />
</ColorModeProvider>
```

A new portal route added under `apps/hub/src/app/portals/<slug>/` needs **no
DemoDock wiring at all** — it inherits the one in the root layout. What it
still needs, unrelated to this rule: registration in `DEFAULT_APPS`
(`.claude/rules/hub-integration.md`) so the Apps tab can find it, and — if it
has a login page — an entry in the demo-accounts registry
(`.claude/rules/portal-login-demos.md`) so the Sign in tab has something to
show.

## Checklist when building a new portal

- [ ] Portal is registered in `DEFAULT_APPS` (`.claude/rules/hub-integration.md`)
- [ ] Portal's demo accounts, if any, added to `DEMO_ACCOUNTS`
      (`packages/design-system/demo/demo-accounts.ts`) — see
      `.claude/rules/portal-login-demos.md`
- [ ] No `DemoDock` or `DemoFab` mount added anywhere in the portal's own
      layout or pages — the hub's single mount already covers it
- [ ] After `npm run dev`, the dock's FAB appears bottom-left on the new
      portal's pages, its Apps tab lists the portal, and (if it has a login
      page) its Sign in tab shows the right accounts
