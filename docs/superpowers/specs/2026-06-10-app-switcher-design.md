# AppSwitcher — Design Spec

**Date:** 2026-06-10  
**Replaces:** `ZoneSwitcher` in `packages/design-system/components/zone-switcher.tsx`  
**Audience:** Both production users (theme + portal navigation) and internal dev team (+ Storybook, Design System)

---

## What we're building

A redesigned cross-zone control panel that replaces the current `ZoneSwitcher`. The current component is a simple flat list of links with no theme integration and no search — it won't scale past 7 zones. The new `AppSwitcher` is a searchable, grouped list panel with the colour-mode switcher embedded in the header, proper live/planned portal status, and a gated dev-tools section.

---

## Shape

**Trigger:** Fixed FAB pill, bottom-left corner (`position: fixed; left: 20px; bottom: 20px`). Label: "Apps". Grid icon (2×2 squares, gov-blue).

**Panel:** Popover anchored above the FAB (`bottom: calc(100% + 10px)`), 288px wide, `max-height: 70vh` with internal scroll on the body section. Opens/closes on FAB click. Closes on outside click and `Escape`.

---

## Panel anatomy (top to bottom)

### 1. Header (fixed, never scrolls)

Two columns in one row:
- **Left:** Current-app indicator — icon (30×30 rounded square, 2-letter abbr on blue tint background), "Currently in" microlabel, app name in bold.
- **Right:** "Theme" microlabel above a row of colour-mode swatches (18px circles). Active swatch has a dark border ring. Clicking a swatch calls `setMode()` and persists to cookie — no extra step.

Below the two-column row: a **search bar** (`background: #f3f4f6`, rounded-8, `⌕` icon, placeholder "Search portals…", `/ ` keyboard shortcut badge). When the panel is open, pressing `/` focuses this input.

### 2. Body (scrollable)

Three sections separated by 1px dividers and uppercase section labels:

**Website**
- Single row: DoSJE Website. Always live, always clickable.

**Portals**
- One row per portal entry from the registry.
- **Live portals:** Full opacity, clickable, green "live" badge.
- **Planned portals:** 45% opacity, `cursor: default` (not clickable), amber "soon" badge. Still appear in search results with a "This portal is in development" note when matched.
- Row anatomy: 30×30 icon (abbr letters, blue-tint bg) | name (600 weight) + description (muted, truncated) | badge.
- Active/current portal: icon inverts to solid gov-blue, name turns gov-blue, row has `#eff6ff` background.

**Dev** *(hidden in production — see gating below)*
- Storybook row → `/storybook/`
- Design System row → `/design-system`
- Section label has a small "dev only" chip next to it.

### 3. Search behaviour

Filtering is client-side, instant, case-insensitive. Matches against: `name`, `description`, `org`. All three sections filter simultaneously. Empty-state copy: "No portals match — try a shorter search." The search input is cleared when the panel closes.

---

## Data model

Replace the current `Zone` interface with `AppEntry`:

```ts
export interface AppEntry {
  /** Display name (full, no abbreviations). */
  name: string;
  /**
   * 2-letter abbreviation for the icon tile.
   * Derived from name if omitted: first letters of the first two words, uppercased
   * (e.g. "PM-AJAY" → "PM", "E-Utthan Admin" → "EU", "SMILE Beggary" → "SM").
   * Single-word names use the first two characters.
   */
  abbr?: string;
  /** Hub-origin path. */
  path: string;
  /** Short description shown below the name. */
  desc?: string;
  /** Organisation / scheme owner — used in search matching. */
  org?: string;
  /** Section group heading. */
  group: 'Website' | 'Portals' | 'Dev';
  /** Whether this portal is live (clickable) or planned (grayed out). @default 'live' */
  status?: 'live' | 'planned';
}
```

The `DEFAULT_APPS` constant replaces `DEFAULT_ZONES` and is populated from the same portal data currently in `apps/hub/src/data/portals.ts` (slug, name, org, description, status, path).

---

## Component API

```tsx
<AppSwitcher
  apps={AppEntry[]}          // override DEFAULT_APPS
  devMode={boolean}          // show Dev section; default false
  label={string}             // FAB label; default "Apps"
  className={string}
/>
```

`devMode` defaults to `false`. Callers in dev layouts pass `devMode={process.env.NODE_ENV === 'development'}`.

The component uses `useColorMode()` internally — it must be rendered inside a `<ColorModeProvider>`. No separate `ColorModeSwitcher` import needed.

---

## Backwards compatibility

`ZoneSwitcher` is exported as a deprecated re-export of `AppSwitcher` for one release cycle so existing imports don't break before apps are updated:

```ts
/** @deprecated Use AppSwitcher instead. */
export const ZoneSwitcher = AppSwitcher;
```

---

## Accessibility

- FAB: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`.
- Panel: `role="dialog"`, `aria-label="App switcher"`.
- Live portal rows: rendered as `<a href>` elements — `role="link"` is implicit, do not add explicitly.
- Planned portal rows: rendered as `<div>` (not `<a>`) — no `href`, `aria-disabled="true"`, `aria-label="{name} — coming soon"`.
- Theme swatches: `role="radiogroup"` + `role="radio"` with `aria-checked`, roving tabindex (arrow keys), same as existing `ColorModeSwitcher`.
- Search: `role="searchbox"`, `aria-controls` pointing to the results list.
- Focus trap: Tab cycles within the panel while open; `Escape` closes and returns focus to the FAB.
- Contrast: All text meets WCAG 2.1 AA. Planned rows at 45% opacity — the "soon" badge retains full opacity so status is always readable.

---

## Files touched

| File | Change |
|------|--------|
| `packages/design-system/components/zone-switcher.tsx` | Replace implementation; rename export to `AppSwitcher`; keep `ZoneSwitcher` re-export |
| `packages/design-system/components/zone-switcher.css` | Full rewrite for new layout |
| `packages/design-system/index.ts` | Export `AppSwitcher`, `AppEntry`; keep `ZoneSwitcher` deprecated re-export |
| `apps/dosje/src/app/layout.tsx` | Change `ZoneSwitcher` → `AppSwitcher`, pass `devMode` |
| `apps/hub/src/app/layout.tsx` | Same |
| All other portal app layouts | Same |

`DEFAULT_APPS` is defined in the design-system package, mirroring the `portals.ts` registry. The hub's `portals.ts` remains the authoritative source; `DEFAULT_APPS` is a copy until a shared package can import it directly.

---

## Out of scope

- Server-side current-zone detection (stays client-side via `window.location.pathname` set in `useEffect`, same pattern as the current `ZoneSwitcher`).
- Animations beyond the existing slide-in entrance on the panel.
- A keyboard shortcut to open the panel from anywhere (can be added later via a `document` keydown listener).
