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
2. **It is demo tooling, and on THIS estate the demo is the product.** Nothing in
   it is meant to reach a citizen or officer's real session with a live portal,
   and the panel's footer says so on every render. But this deployment exists in
   order to be shown to people, so the dock is not scaffolding awaiting removal
   — it is how the estate gets demonstrated. Superseded 2026-08-20: this bullet
   previously implied the end state was a deployment without it.
3. **Visibility is an ADMIN SETTING, not a deploy flag.** `/admin/portals`
   carries the master switch, stored in the `demo_tools` row and resolved by
   `apps/hub/src/lib/demo-tools/`. Default is ON: a prototype whose purpose is
   being demonstrated must not need an admin visit before it can be
   demonstrated. Turn it off for a ministry walkthrough, a screenshot or a
   recording, and put it back — no redeploy.
4. **`NEXT_PUBLIC_DEMO_TOOLS=false` survives above it as a build-time HARD off.**
   Precedence is deliberate and one-way: a deployment built without demo tooling
   must not be able to acquire it from a database row. Only the exact string
   `"false"` counts. Everything else defers to the setting.

   The failure direction is also deliberate: an unreadable or paused store
   degrades to **visible**, not hidden. A database outage must not silently
   strip the thing the prototype exists to show.
5. **There is no per-surface variant, and that is a decision.** The dock is one
   cross-zone navigator whose whole job is getting between zones; switching it
   off on some of them makes it worse rather than more precise. It is still
   hidden on the hub root (`/`, the portals index itself), `/gate`, and
   everything under `/admin`, whatever the setting says.
6. `DemoFab` (the older, per-page panel `DemoDock` superseded) still exists
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

**The right wall is not empty either, and that was found the hard way.** The dock was moved
there on the reasoning that it was; on the **website** it landed directly on top of
`ImportantLinks` (`fixed right-0 top-[42%]`, z 1002) and the dock's z-index won, so demo
scaffolding covered a citizen-facing nav control. The walls are inverted between zones —
website: left free / right taken; docs and portals: left taken / right free — so no fixed
choice works anywhere.

**Any fixed widget on the right wall MUST carry `data-sa-wall-occupant`.** One attribute is
the entire contract; `useWallRailOffset` then places the dock in the largest free band. Add
it when you add the widget, not after someone reports an overlap.

The rule those two share:

> **A placement that has to be computed is a placement that can be computed
> wrong.** The right wall needs no measurement, so it cannot be measured wrong.

A `useCornerRailOffset` hook existed briefly to stack widgets in the
bottom-right corner. It was **retired** when `DemoDock` left that corner —
nothing consumed it, and a shared primitive with no consumer reads as
governance while governing nothing. Do not re-add it speculatively; if a
chatbot genuinely wants that corner, recover it from git history then.

## The fold — and the two rules inside it

At rest the rail is a **tab** — 52x56, a 26px flask in a tinted cell and
nothing else. Engaged, it unfolds **downward** into three doors, 52x153.

**There is no wordmark.** One existed and was removed: it solved a
first-encounter problem with a permanent solution, and a vertical "DEMO" on
every screen of a government portal draws attention to scaffolding. The label
is a tooltip on hover and focus instead — quiet at rest, self-describing on
approach.

**The lead is the entry for the tab that has no door** — Sign in, and only
where it exists. It opens the panel on its first tab, which IS Sign in on a
login route, and it lights when that tab is showing. Elsewhere it never
lights, because the Apps door already stands for the tab the panel opens on
and two indicators for one tab is worse than none.

**The lead does NOT close the panel, and it is not a cross.** It was both,
briefly, on the reasoning that a toggle should show its current affordance —
which stopped holding the moment the doors began indicating tabs. A close
button sitting in a list of tabs is a category error, and it left the rail
claiming to be a complete set of destinations with a member missing. Closing
is the panel's own header button, Escape, and outside-click; three ways to
dismiss is enough, and a coherent rail is worth more than a fourth.

**The two doors indicate the active tab** — `aria-current`, not
`aria-selected`, because they are buttons that open a dialog rather than tabs
in a tablist. **They are ordered to match the tab strip (Apps, then Colour),
and the rail stays unfolded for as long as the panel is open.** Both follow
from the indicator existing: an indicator that vanishes when the pointer
enters the panel it describes is worse than none, and an order that disagrees
with the tabs makes the second door light when the third tab is active.
`component-authoring.md` §10 — two lists of the same things use the same
order. That is what stops the rail and the tab strip being two
navigations competing for one set of destinations. Sign in has no door and
lights nothing, correctly.

**The panel is a FIXED height** — `min(72vh, 680px)` — and every tab lives
inside it. Sizing to content meant a tab switch resized the panel (Sign in
635, Apps 648, Colour 386) and read as a lurch, and the `transition: height`
meant to smooth it was dead code: a transition cannot interpolate to or from
`auto`. Do not reintroduce content sizing to "save space"; the space was
never the problem.

**The liquid in the flask moves permanently**; the bubbles and the wobble are
the state signals. A still flask reads as a picture of a flask rather than a
thing that is running. The wobble answers a hover of the WHOLE RAIL, not of
the flask alone, because the rail is one object and the flask is its face.

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
