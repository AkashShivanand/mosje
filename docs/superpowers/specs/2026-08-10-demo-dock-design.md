# DemoDock — one floating demo console

**Date:** 2026-08-10
**Status:** Approved design, pending implementation

## Intent

One floating, collapsible widget that a presenter uses to drive a demo of the
estate: switch the brand colour mode, jump to any portal / the website / the
design system / Storybook / the QC reports, and sign in with demo credentials.

It is **demo tooling, not product**. Nothing in it should ever be part of the UI
a citizen or an officer sees.

## What exists today, and what is wrong with it

Three separate things do parts of this job, and they overlap badly:

| Today | Where | Problem |
|---|---|---|
| `AppSwitcher` | fixed bottom-left FAB, `navigation/` | Mandated as real navigation on every portal, but also carries a **hand-rolled copy** of the colour swatches — duplicating `ColorModeSwitcher` instead of using it. 454 lines doing four jobs. |
| `ColorModeSwitcher` | inline, `foundations/` | Exactly **one** production usage: SMILE Admin's access bar, i.e. real login chrome. |
| `DemoFab` | fixed bottom-right FAB, `demo/` | Mounted separately on **8 login pages**, each passing its own accounts. Gated on `NODE_ENV === "development"`, so it is **invisible on the deployed review site** — the one place stakeholders need it. |

Net effect: up to three floating things over the UI, one duplicated component,
and the demo credentials panel missing from the demo.

## Decisions

Settled in discussion, recorded here so the reasoning survives:

1. **Visibility — `NEXT_PUBLIC_DEMO_TOOLS`, defaulting ON.** Absent means
   visible; only the exact string `"false"` hides it. The deployed Vercel site
   *is* the demo, so a `NODE_ENV === "development"` guard would hide the dock
   precisely where it is needed. It must be `NEXT_PUBLIC_` to be readable in the
   browser; this is the hub's first such variable.
2. **One dock, not several FABs.** A single floating button expanding to a
   tabbed panel, rather than two or three FABs competing for a corner.
3. **The whole dock is demo-only.** With the flag off, the app switcher goes too.
   `.claude/rules/portal-appswitcher.md` is rewritten accordingly: a genuinely
   public portal ships without one.
4. **Colour modes: Gov Blue and Gov Navy only.** The two `COLOR_MODES` that ship.
   The `ux4g` / `ux4gdeep` modes stay out of scope (see Non-goals).
5. **Split the shell from the panels** rather than growing `zone-switcher.tsx`.
   The duplication being removed was caused by that file already doing too much.

## Architecture

Three units, each independently understandable:

| Unit | Location | Responsibility | Knows nothing about |
|---|---|---|---|
| `DemoDock` | `design-system/demo/demo-dock.tsx` | Floating position, collapse/expand, tab strip, focus trap-free focus return, Escape / outside-click | apps, colours, credentials |
| `AppSwitcherPanel` | `design-system/components/navigation/app-switcher-panel.tsx` | Search, grouped destination list, current-app indicator | where it is on screen |
| `DemoAccountsPanel` | `design-system/demo/demo-accounts-panel.tsx` | Role table, Use, copy-to-clipboard | where it is on screen |
| `ColorModeSwitcher` | unchanged | Brand swatches | — |

`DemoDock` lives in `demo/` beside `DemoFab`. The folder is the signal: this is
tooling, not chrome.

### Why the accounts come from a registry, not props

This is the one consequence that reshapes existing code, so it is stated plainly.

`DemoFab` is mounted **per login page**, each passing its own `accounts`. The
dock is mounted **once**, in the hub root layout — above every page in the tree.
A page therefore cannot pass its accounts up to it.

So demo accounts move into a **pathname-keyed registry** in the design system,
`DEMO_ACCOUNTS`, exactly mirroring the existing `DEFAULT_APPS` +
`matchActivePath` pattern:

```ts
export interface DemoAccountSet {
  /** Hub-origin path prefix this set applies to, e.g. "/portals/nmba". */
  path: string;
  /** Column header for the identifier column. @default "Mobile / ID" */
  idLabel?: string;
  accounts: DemoAccount[];
}
```

The dock matches the current pathname against the registry and shows that
portal's accounts. Where nothing matches — a dashboard, the website — the
**Sign in tab is not rendered at all**, rather than showing an empty table.

Consequences, accepted deliberately:

- The credentials table in `.claude/rules/portal-login-demos.md` becomes real,
  typed code with one source of truth, instead of prose duplicated across 8
  pages. The rule file then points at the registry.
- Those 8 pages stop mounting `DemoFab` and stop declaring `DEMO_ACCOUNTS`
  locally. `apps/hub/src/components/nmba/demo-fab.tsx` (a hub-local wrapper) goes.
- Filling still works unchanged: **Use** dispatches the existing global
  `demo:fill` CustomEvent, which every login page already listens for. The
  per-page `onFill` callback path is not available from a global dock and is not
  needed.
- These are fake, already-public review credentials. Nothing secret moves.

`DemoFab` itself is **retained and unchanged** for any page that still wants a
local, self-contained panel; the dock does not delete it. It simply stops being
mounted by the estate's login pages.

## The panel, redesigned

The current panel is a navigation menu: header, search, scrolling list. The dock
is a small console with three unrelated jobs, so the layout changes.

```
┌─────────────────────────────────────┐
│  Demo tools                     ✕   │  ← title + close
│  Currently in · NMBA Admin          │  ← context line
├─────────────────────────────────────┤
│  [ Apps ]  [ Colour ]  [ Sign in ]  │  ← tab strip (roving tabindex)
├─────────────────────────────────────┤
│                                     │
│   …active tab body, scrolls…        │  ← fixed max-height
│                                     │
├─────────────────────────────────────┤
│  Demo tooling — not part of the     │  ← standing disclaimer
│  product                            │
└─────────────────────────────────────┘
```

- **Width** grows from the current list-sized panel to ~400px, so a credentials
  table fits without horizontal scrolling.
- **Only the tab body scrolls.** Header, tabs and footer stay put, so the
  presenter never loses the tab strip mid-demo.
- **Apps** — search (keeps the `/` shortcut) over the grouped list.
- **Colour** — `ColorModeSwitcher` at full size with labels, plus one line
  stating this is the brand palette, not light/dark, which the accessibility
  widget owns.
- **Sign in** — the role table, with Use and copy. Hidden when the path matches
  no account set.
- **Footer disclaimer** is not decoration: it is what stops a screenshot of the
  dock being mistaken for product UI.

Tabs follow the WAI-ARIA tabs pattern already implemented in the DS `Tabs`
component; reuse it rather than hand-rolling a third radiogroup.

Opening always starts on **Apps**. No remembered tab — a demo starts fresh.

### Position

Unchanged: fixed bottom-left, 20px. Three login pages hand-code an offset to
clear the current FAB, so holding the position keeps them correct.
`.ds-appsw-safe-bottom` exists but is used nowhere; it is renamed with the
component and left available.

## Registry: Reports

`AppEntry.group` gains `"Reports"`, and the two QC report pages are added:

| Name | Path |
|---|---|
| SCW Design QC | `/reports/scw` |
| E-Utthan Admin QC | `/reports/eutthan-admin` |

Not the `/reports` index — the group heading already says Reports, so an
"All reports" row repeats it. Per `.claude/rules/hub-integration.md`, live
entries sort before planned ones within a group.

## Gating, and where it is evaluated

The flag is read in the **hub**, never in the design system, which stays
presentation-only and environment-unaware.

`ConditionalAppSwitcher` becomes `ConditionalDemoDock`:

```
render nothing when:
  process.env.NEXT_PUBLIC_DEMO_TOOLS === "false"   // explicit opt-out
  || pathname is "/" or "/gate" or starts with "/admin"   // unchanged
```

`.env.example` documents the variable.

## Removals

- The swatch block in `zone-switcher.tsx` (~35 lines, plus `swatchRefs`,
  `onSwatchKeyDown`, and the `useColorMode` import).
- `<ColorModeSwitcher />` from `apps/hub/src/components/smile-admin/shell/access-bar.tsx`
  — the only place the colour switch reaches real UI.
- `DemoFab` mounts from the 8 login pages, and `apps/hub/src/components/nmba/demo-fab.tsx`.
- The `AppSwitcher` barrel export, replaced by `DemoDock` + `AppSwitcherPanel`.

## Testing

- **Unit** — `app-switcher-utils.test.ts` (32 cases today) gains coverage for the
  Reports group in grouping and search, plus new cases for the registry lookup:
  exact match, prefix match, no match (tab hidden), and longest-prefix wins when
  two sets could match.
- **Storybook** — `DemoDock.stories.tsx` (collapsed, each tab, and the no-accounts
  case where Sign in is absent); `AppSwitcherPanel.stories.tsx`;
  `DemoAccountsPanel.stories.tsx`. `AppSwitcher.stories.tsx` is removed.
- **Gates** — coverage must stay at 69/69 with an empty baseline. The parity gate
  is **expected to fail mid-change**, on stories still naming the removed
  `AppSwitcher` export; that failure is the gate working and should be seen
  before it is fixed.
- **Manual** — the flag set to `"false"` hides the dock; Escape and outside-click
  close it; focus returns to the FAB; Use fills a real login form via `demo:fill`.

## Non-goals

Explicitly out of scope, so they do not read as oversights:

- **Draggable / repositionable dock.** Fixed bottom-left is enough.
- **The `ux4g` / `ux4gdeep` colour modes.** Separately, `design.md:158` and
  `color-mode.ts:57` both document `<ColorModeSwitcher modes={[...]} />` — a prop
  that exists on neither the switcher nor the provider, so there is currently no
  supported way to opt into those modes at all. Recorded as a known gap; not
  fixed here.
- **Merging `DemoFab` away.** It stays exported for local use.
