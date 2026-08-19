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

## Placement — the right wall, not a corner

`DemoDock` sits **flush to the right edge of the viewport, vertically centred**,
as a folding tab. It does not choose its own position and neither should the
next floating widget: the right wall is empty on every surface in the estate,
which is exactly why it is the home.

**Do not put a floating widget in a corner.** Both corners are taken, and each
has already cost this estate a defect:

| Corner | Occupant | What it cost |
|---|---|---|
| bottom-left | `PortalLoginShell`'s "Signing Into" strip | a per-route opt-in boolean that a future portal could forget, and a FAB that visibly relocated between routes |
| bottom-right | the UX4G accessibility widget (must not be restyled) | a hardcoded 108px stack above a widget that is `display: none` on every page with an `AccessibilityBar`, so the FAB floated above an empty corner across most of the estate |

The rule those two share:

> **A placement that has to be computed is a placement that can be computed
> wrong.** The right wall needs no measurement, so it cannot be measured wrong.

A `useCornerRailOffset` hook existed briefly to stack widgets in the
bottom-right corner. It was **retired** when `DemoDock` left that corner —
nothing consumed it, and a shared primitive with no consumer reads as
governance while governing nothing. Do not re-add it speculatively; if a
chatbot genuinely wants that corner, recover it from git history then.

## The fold — and the two rules inside it

At rest the rail is a **tab** — 52x105, a 26px flask in a tinted cell plus a
vertical wordmark that says what it is without being touched. Engaged, the
wordmark collapses and the rail unfolds **downward** into three doors, 52x153.

1. **The flask is the anchor and must not move.** The container is anchored by
   its `top` (not centred, which would slide the flask up as the drawer grows)
   and its **width is constant**. A prototype grew 48 → 58px on unfold and slid
   the flask 5px *left*, because a right-anchored box that widens pushes its
   centred children inward. The shadow carries the "engaged" signal instead.
2. **Hover and focus are TWO INDEPENDENT HOLDS**, each with its own latch;
   the rail is open while either holds. A single flag breaks both ways round,
   and both were shipped and caught by pressure-testing: focus a door then
   move the mouse away, and `pointerleave` collapsed the rail out from under
   a keyboard user; blur while still hovering, and it collapsed with no fresh
   `pointerenter` coming to reopen it.
3. **The lead's click rule is about STATE, not device:** if the rail is not
   expanded, expand it; otherwise open the panel. A pointer user's hover has
   already expanded it, so their click falls straight through — one click, as
   before. A touch user's first tap expands, the second opens. Never branch on
   `pointerType` for this; a touchscreen laptop is both devices at once.
4. **Verify focus behaviour with TRUSTED events only.** A programmatic
   `element.focus()` moves `document.activeElement` but fires **no focus
   events at all** in a tab without OS focus — so an automated test reports
   the keyboard path green while it is broken. The hover/focus defect above
   passed every synthetic check and failed the first real click-then-move.
   Drive the real pointer and the real Tab key, and assert
   `document.hasFocus()` before believing a focus result.

**Three doors, fixed.** They map to the panel's Apps and Colour tabs plus the
flask (which opens the panel on its first tab). **Sign in does not get a
door** — it exists only on login routes, so a fourth door would appear and
vanish by route, which is the same "relocates between routes" defect the
bottom-left opt-in was removed for. It already leads inside the panel on those
routes, which is enough.

All three doors open the *same* panel, pre-selected. That is the win over the
old single FAB: Colour drops from two clicks to one, and re-toning the page
live is the most-used action in a demo — the ⌘⌥C shortcut exists to work
around exactly that cost.

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
- [ ] After `npm run dev`, the dock's rail appears on the right wall of the
      new portal's pages, its Apps tab lists the portal, and (if it has a
      login page) its Sign in tab shows the right accounts
- [ ] No floating widget added in either bottom corner — see Placement above
