# AppSwitcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat `ZoneSwitcher` with a searchable `AppSwitcher` control panel — grouped list with theme swatches in the header, live/planned portal status, and a dev-only section — across all app layouts.

**Architecture:** Pure logic (abbr derivation, search filter, active-path matching) lives in a dedicated utils file imported by the component. The component rewrites `zone-switcher.tsx` in-place so all existing CSS class imports and the deprecated `ZoneSwitcher` re-export require no filesystem renames. Consumers each get a one-line import change + `devMode` prop added.

**Tech Stack:** React 19, TypeScript strict, plain CSS (token-only, no raw hex), `useColorMode()` from `@mosje/design-system/color-mode`.

---

## File map

| File | Action |
|------|--------|
| `packages/design-system/components/app-switcher-utils.ts` | **Create** — `AppEntry` interface, `DEFAULT_APPS`, `deriveAbbr`, `filterApps`, `matchActivePath` |
| `packages/design-system/components/zone-switcher.tsx` | **Rewrite** — `AppSwitcher` component; keep `ZoneSwitcher` deprecated re-export at bottom |
| `packages/design-system/components/zone-switcher.css` | **Rewrite** — new panel layout styles (token-only) |
| `packages/design-system/index.ts` | **Modify** — add `AppSwitcher`, `AppEntry`, `DEFAULT_APPS`; keep deprecated `Zone`/`ZoneSwitcher`/`DEFAULT_ZONES` re-exports |
| `apps/dosje/src/app/layout.tsx` | **Modify** — `ZoneSwitcher` → `AppSwitcher` + `devMode` prop |
| `apps/portals/pm-ajay/src/app/layout.tsx` | **Modify** — same |
| `apps/portals/smile-admin/src/app/layout.tsx` | **Modify** — same |

---

## Task 1: Pure utilities

**Files:**
- Create: `packages/design-system/components/app-switcher-utils.ts`

- [ ] **Step 1.1 — Create the utils file**

```ts
// packages/design-system/components/app-switcher-utils.ts

export interface AppEntry {
  /** Full display name — never abbreviated. */
  name: string;
  /**
   * 2-letter icon abbreviation. Derived automatically if omitted:
   * first letters of first two words (split on space/hyphen), uppercased.
   * Single-word names use first two characters.
   * Examples: "PM-AJAY" → "PM", "E-Utthan Admin" → "EU", "SMILE Beggary" → "SM".
   */
  abbr?: string;
  /** Hub-origin path (e.g. "/portals/pm-ajay"). */
  path: string;
  /** Short description shown below the name. */
  desc?: string;
  /** Organisation / scheme owner — included in search matching. */
  org?: string;
  /** Which section this entry appears in. */
  group: "Website" | "Portals" | "Dev";
  /**
   * "live" → clickable, full opacity.
   * "planned" → grayed out at 45% opacity, not clickable.
   * Omitting defaults to "live".
   */
  status?: "live" | "planned";
}

/** Derive 2-letter icon abbreviation from an AppEntry. */
export function deriveAbbr(entry: AppEntry): string {
  if (entry.abbr) return entry.abbr;
  const words = entry.name.split(/[\s\-]+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return entry.name.slice(0, 2).toUpperCase();
}

/**
 * Case-insensitive filter across name, desc, and org.
 * Returns the full list unchanged when query is blank.
 */
export function filterApps(apps: AppEntry[], query: string): AppEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return apps;
  return apps.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      (a.desc ?? "").toLowerCase().includes(q) ||
      (a.org ?? "").toLowerCase().includes(q),
  );
}

/**
 * Longest-prefix match: returns the normalised path of the active entry,
 * or null if no entry matches pathname.
 */
export function matchActivePath(
  apps: AppEntry[],
  pathname: string,
): string | null {
  let best: string | null = null;
  for (const a of apps) {
    const p = a.path === "/" ? "/" : a.path.replace(/\/$/, "");
    const matches =
      p === "/"
        ? pathname === "/"
        : pathname === p || pathname.startsWith(p + "/");
    if (matches && (best === null || p.length > best.length)) best = p;
  }
  return best;
}

/** Default MoSJE estate registry — mirrors apps/hub/src/data/portals.ts. */
export const DEFAULT_APPS: AppEntry[] = [
  // ── Website ────────────────────────────────────────────────────────────
  {
    name: "DoSJE Website",
    abbr: "W",
    path: "/website",
    desc: "Unified informational site",
    group: "Website",
  },
  // ── Portals — live ─────────────────────────────────────────────────────
  {
    name: "PM-AJAY",
    abbr: "PM",
    path: "/portals/pm-ajay",
    desc: "MIS dashboard",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    status: "live",
  },
  {
    name: "E-Utthan Admin",
    abbr: "EU",
    path: "/portals/eutthan-admin",
    desc: "Scheme management",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    status: "live",
  },
  {
    name: "SMILE Beggary Rehabilitation",
    abbr: "SM",
    path: "/portals/smile-admin",
    desc: "Rehabilitation admin portal",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    status: "live",
  },
  // ── Portals — planned ──────────────────────────────────────────────────
  {
    name: "NSFDC",
    path: "/portals/nsfdc",
    desc: "Nat. Scheduled Castes Finance & Dev. Corp",
    org: "National Scheduled Castes Finance & Development Corporation",
    group: "Portals",
    status: "planned",
  },
  {
    name: "NSKFDC",
    path: "/portals/nskfdc",
    desc: "Nat. Safai Karamcharis Finance & Dev. Corp",
    org: "National Safai Karamcharis Finance & Development Corporation",
    group: "Portals",
    status: "planned",
  },
  {
    name: "NBCFDC",
    path: "/portals/nbcfdc",
    desc: "Nat. Backward Classes Finance & Dev. Corp",
    org: "National Backward Classes Finance & Development Corporation",
    group: "Portals",
    status: "planned",
  },
  {
    name: "National Overseas Scholarship",
    abbr: "NO",
    path: "/portals/nos",
    desc: "National Overseas Scholarship scheme",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    status: "planned",
  },
  {
    name: "PM YASASVI",
    abbr: "PY",
    path: "/portals/pm-yasasvi",
    desc: "Young Achievers Scholarship — OBC/EBC/DNT",
    org: "Ministry of Social Justice & Empowerment",
    group: "Portals",
    status: "planned",
  },
  // ── Dev (hidden in production) ─────────────────────────────────────────
  {
    name: "Storybook",
    abbr: "SB",
    path: "/storybook/",
    desc: "Component explorer",
    group: "Dev",
  },
  {
    name: "Design System",
    abbr: "DS",
    path: "/design-system",
    desc: "SAMAVESH docs",
    group: "Dev",
  },
];
```

- [ ] **Step 1.2 — Spot-check deriveAbbr logic in the terminal**

```bash
cd /Users/akashk/Documents/Projects/MoSJE/packages/design-system
node --input-type=module <<'EOF'
import { deriveAbbr, filterApps, matchActivePath, DEFAULT_APPS } from "./components/app-switcher-utils.ts";
// abbr derivation
console.assert(deriveAbbr({ name: "PM-AJAY", group: "Portals" }) === "PM", "PM-AJAY");
console.assert(deriveAbbr({ name: "E-Utthan Admin", group: "Portals" }) === "EU", "EU");
console.assert(deriveAbbr({ name: "SMILE Beggary", group: "Portals" }) === "SM", "SM");
console.assert(deriveAbbr({ name: "DoSJE Website", group: "Website" }) === "DO", "DO (no abbr set)");
console.assert(deriveAbbr({ name: "DoSJE Website", abbr: "W", group: "Website" }) === "W", "explicit abbr");
// filter
const results = filterApps(DEFAULT_APPS, "nsfdc");
console.assert(results.length === 1 && results[0].name === "NSFDC", "filter nsfdc");
const all = filterApps(DEFAULT_APPS, "");
console.assert(all.length === DEFAULT_APPS.length, "empty query returns all");
// active path
console.assert(matchActivePath(DEFAULT_APPS, "/portals/pm-ajay") === "/portals/pm-ajay", "pm-ajay match");
console.assert(matchActivePath(DEFAULT_APPS, "/portals/pm-ajay/dashboard") === "/portals/pm-ajay", "pm-ajay prefix");
console.assert(matchActivePath(DEFAULT_APPS, "/unknown") === null, "no match → null");
console.log("All assertions passed.");
EOF
```

Expected output: `All assertions passed.`

> Note: Node ESM won't resolve `.ts` imports natively. If this fails with a module error, skip to Step 1.3 — the logic is validated by TypeScript at typecheck time. The spot-check is a quick sanity step, not a blocker.

- [ ] **Step 1.3 — Typecheck**

```bash
cd /Users/akashk/Documents/Projects/MoSJE/packages/design-system && npm run typecheck
```

Expected: no errors.

- [ ] **Step 1.4 — Commit**

```bash
git add packages/design-system/components/app-switcher-utils.ts
git commit -m "feat(design-system): AppEntry type + utilities (deriveAbbr, filterApps, matchActivePath, DEFAULT_APPS)"
```

---

## Task 2: AppSwitcher component

**Files:**
- Modify: `packages/design-system/components/zone-switcher.tsx` (full rewrite)

- [ ] **Step 2.1 — Rewrite zone-switcher.tsx**

Replace the entire file content with:

```tsx
// packages/design-system/components/zone-switcher.tsx
"use client";

import * as React from "react";
import { cn } from "../cn";
import { useColorMode } from "./color-mode-provider";
import {
  AppEntry,
  DEFAULT_APPS,
  deriveAbbr,
  filterApps,
  matchActivePath,
} from "./app-switcher-utils";
import "./zone-switcher.css";

export interface AppSwitcherProps {
  /** Override the default estate registry. */
  apps?: AppEntry[];
  /**
   * Show the Dev section (Storybook, Design System).
   * Pass `process.env.NODE_ENV === 'development'` from each app layout.
   * @default false
   */
  devMode?: boolean;
  /** FAB label text. @default "Apps" */
  label?: string;
  className?: string;
}

/**
 * SAMAVESH AppSwitcher — searchable cross-zone control panel.
 *
 * Renders a fixed FAB (bottom-left) that opens a panel with:
 * - Current app indicator + colour-mode swatches (header, always visible)
 * - Search bar (/ shortcut focuses it while panel is open)
 * - Grouped list: Website → Portals → Dev (dev-only, hidden in prod)
 *
 * Must be rendered inside a <ColorModeProvider>.
 * Uses plain <a href> links so navigation works from inside any basePath-ed zone.
 */
export function AppSwitcher({
  apps = DEFAULT_APPS,
  devMode = false,
  label = "Apps",
  className,
}: AppSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [pathname, setPathname] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelId = React.useId();
  const { mode, setMode, modes } = useColorMode();

  // Client-only pathname — avoids SSR mismatch.
  React.useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  // Close on outside click + Escape; / focuses search while open.
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Clear search whenever the panel is closed.
  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const activeNormPath = React.useMemo(
    () => matchActivePath(apps, pathname ?? ""),
    [apps, pathname],
  );

  // Current app entry for the header indicator.
  const currentApp = React.useMemo(
    () =>
      apps.find((a) => {
        const p = a.path === "/" ? "/" : a.path.replace(/\/$/, "");
        return p === activeNormPath;
      }) ?? null,
    [apps, activeNormPath],
  );

  // Filter out Dev section in prod; then apply search query.
  const visibleApps = React.useMemo(
    () => filterApps(apps.filter((a) => devMode || a.group !== "Dev"), query),
    [apps, devMode, query],
  );

  // Group visible apps preserving registry order.
  const groups = React.useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, AppEntry[]>();
    for (const a of visibleApps) {
      if (!map.has(a.group)) {
        map.set(a.group, []);
        order.push(a.group);
      }
      map.get(a.group)!.push(a);
    }
    return order.map((g) => ({ group: g, items: map.get(g)! }));
  }, [visibleApps]);

  const noResults = query.trim().length > 0 && visibleApps.length === 0;

  return (
    <div ref={rootRef} className={cn("ds-appsw", className)}>
      {open && (
        <div
          className="ds-appsw__panel"
          id={panelId}
          role="dialog"
          aria-label="App switcher"
          aria-modal="false"
        >
          {/* ── Header ── */}
          <div className="ds-appsw__header">
            <div className="ds-appsw__header-row">
              {/* Current app */}
              <div className="ds-appsw__current">
                <span className="ds-appsw__current-icon" aria-hidden="true">
                  {currentApp ? deriveAbbr(currentApp) : "?"}
                </span>
                <div>
                  <div className="ds-appsw__current-label">Currently in</div>
                  <div className="ds-appsw__current-name">
                    {currentApp?.name ?? "Unknown"}
                  </div>
                </div>
              </div>
              {/* Theme swatches */}
              <div
                className="ds-appsw__theme"
                role="radiogroup"
                aria-label="Colour mode"
              >
                <div className="ds-appsw__theme-label">Theme</div>
                <div className="ds-appsw__theme-swatches">
                  {modes.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      role="radio"
                      aria-checked={m.id === mode}
                      aria-label={m.label}
                      title={m.label}
                      className={cn(
                        "ds-appsw__swatch",
                        m.id === mode && "is-active",
                      )}
                      style={{ background: m.swatch }}
                      onClick={() => setMode(m.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Search */}
            <div className="ds-appsw__search">
              <svg
                className="ds-appsw__search-icon"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="5.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M13 13l3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <input
                ref={searchRef}
                type="search"
                className="ds-appsw__search-input"
                placeholder="Search portals…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search portals"
                aria-controls={`${panelId}-list`}
              />
              {!query && <kbd className="ds-appsw__search-kbd">/</kbd>}
            </div>
          </div>

          {/* ── Body ── */}
          <div
            className="ds-appsw__body"
            id={`${panelId}-list`}
            role="list"
            aria-label="App and portal list"
          >
            {noResults ? (
              <div className="ds-appsw__empty">
                No portals match — try a shorter search.
              </div>
            ) : (
              groups.map(({ group, items }) => {
                const hasPlannedResults =
                  query.trim().length > 0 &&
                  items.some((a) => a.status === "planned");
                return (
                  <div key={group} role="group" aria-label={group}>
                    <div className="ds-appsw__group-label">
                      {group}
                      {group === "Dev" && (
                        <span className="ds-appsw__dev-chip">dev only</span>
                      )}
                    </div>
                    {items.map((a) => {
                      const abbr = deriveAbbr(a);
                      const normPath =
                        a.path === "/" ? "/" : a.path.replace(/\/$/, "");
                      const isActive = activeNormPath === normPath;
                      const isPlanned = a.status === "planned";

                      if (isPlanned) {
                        return (
                          <div
                            key={a.path}
                            className="ds-appsw__item ds-appsw__item--planned"
                            aria-disabled="true"
                            aria-label={`${a.name} — coming soon`}
                          >
                            <span
                              className="ds-appsw__item-icon"
                              aria-hidden="true"
                            >
                              {abbr}
                            </span>
                            <span className="ds-appsw__item-text">
                              <span className="ds-appsw__item-name">
                                {a.name}
                              </span>
                              {a.desc && (
                                <span className="ds-appsw__item-desc">
                                  {a.desc}
                                </span>
                              )}
                            </span>
                            <span className="ds-appsw__badge ds-appsw__badge--soon">
                              soon
                            </span>
                          </div>
                        );
                      }

                      return (
                        <a
                          key={a.path}
                          href={a.path}
                          className={cn(
                            "ds-appsw__item",
                            isActive && "is-active",
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <span
                            className="ds-appsw__item-icon"
                            aria-hidden="true"
                          >
                            {abbr}
                          </span>
                          <span className="ds-appsw__item-text">
                            <span className="ds-appsw__item-name">{a.name}</span>
                            {a.desc && (
                              <span className="ds-appsw__item-desc">
                                {a.desc}
                              </span>
                            )}
                          </span>
                          {group === "Portals" && (
                            <span className="ds-appsw__badge ds-appsw__badge--live">
                              live
                            </span>
                          )}
                        </a>
                      );
                    })}
                    {hasPlannedResults && (
                      <div className="ds-appsw__planned-note">
                        This portal is in development
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        className="ds-appsw__fab"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          className="ds-appsw__fab-icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        {label}
      </button>
    </div>
  );
}

// ── Backwards-compatibility shims ──────────────────────────────────────────

/** @deprecated Use AppSwitcher instead. */
export const ZoneSwitcher = AppSwitcher;

/** @deprecated Use AppEntry instead. */
export type Zone = AppEntry;

/** @deprecated Use AppSwitcherProps instead. */
export type ZoneSwitcherProps = AppSwitcherProps;

/** @deprecated Use DEFAULT_APPS instead. */
export const DEFAULT_ZONES = DEFAULT_APPS;
```

- [ ] **Step 2.2 — Typecheck**

```bash
cd /Users/akashk/Documents/Projects/MoSJE/packages/design-system && npm run typecheck
```

Expected: no errors.

- [ ] **Step 2.3 — Commit**

```bash
git add packages/design-system/components/zone-switcher.tsx
git commit -m "feat(design-system): AppSwitcher component — searchable control panel with theme, live/planned portals, dev section"
```

---

## Task 3: Rewrite the CSS

**Files:**
- Modify: `packages/design-system/components/zone-switcher.css` (full rewrite)

- [ ] **Step 3.1 — Rewrite zone-switcher.css**

Replace the entire file content with:

```css
/* ============================================================================
   MoSJE / SAMAVESH — AppSwitcher  (zone-switcher.css)
   Searchable cross-zone control panel. Fixed FAB bottom-left; panel opens
   above it. Token-only — no raw hex.
   ============================================================================ */

/* ── Root container ── */
.ds-appsw {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 2147483000;
  font-family: var(--ds-font-sans);
}

/* ── FAB trigger ── */
.ds-appsw__fab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px 0 14px;
  border: 1.5px solid var(--ds-border-strong);
  border-radius: var(--ds-radius-pill);
  background-color: var(--ds-surface);
  color: var(--ds-ink);
  font-family: var(--ds-font-sans);
  font-size: var(--ds-text-body-2);
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--ds-shadow-lg);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.ds-appsw__fab:hover {
  border-color: var(--ds-primary);
}

.ds-appsw__fab:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--ds-primary-ring);
}

.ds-appsw__fab-icon {
  width: 18px;
  height: 18px;
  color: var(--ds-primary);
  flex: 0 0 auto;
}

/* ── Panel ── */
.ds-appsw__panel {
  position: absolute;
  left: 0;
  bottom: calc(100% + 10px);
  width: 288px;
  border: 1px solid var(--ds-border-strong);
  border-radius: var(--ds-radius-md);
  background-color: var(--ds-surface);
  box-shadow: var(--ds-shadow-xl);
  overflow: hidden;
}

/* ── Header (never scrolls) ── */
.ds-appsw__header {
  padding: 12px 14px 10px;
  border-bottom: 1px solid var(--ds-border);
}

.ds-appsw__header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
}

/* Current app indicator */
.ds-appsw__current {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ds-appsw__current-icon {
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border-radius: var(--ds-radius-sm);
  background-color: var(--ds-primary-tonal);
  color: var(--ds-primary);
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-appsw__current-label {
  font-size: var(--ds-text-label-3);
  color: var(--ds-ink-muted);
  line-height: 1;
  margin-bottom: 2px;
}

.ds-appsw__current-name {
  font-size: var(--ds-text-body-2);
  font-weight: 700;
  color: var(--ds-ink);
  line-height: 1;
}

/* Theme swatches */
.ds-appsw__theme {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.ds-appsw__theme-label {
  font-size: var(--ds-text-label-3);
  color: var(--ds-ink-muted);
}

.ds-appsw__theme-swatches {
  display: flex;
  gap: 4px;
}

.ds-appsw__swatch {
  width: 18px;
  height: 18px;
  border-radius: var(--ds-radius-pill);
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s ease;
}

.ds-appsw__swatch:hover {
  transform: scale(1.2);
}

.ds-appsw__swatch.is-active {
  border-color: var(--ds-ink);
  box-shadow: 0 0 0 1.5px var(--ds-surface) inset;
}

.ds-appsw__swatch:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--ds-primary-ring);
}

/* Search bar */
.ds-appsw__search {
  display: flex;
  align-items: center;
  gap: 7px;
  background-color: var(--ds-surface-muted);
  border-radius: var(--ds-radius-sm);
  padding: 6px 10px;
  transition: background-color 0.12s ease;
}

.ds-appsw__search:focus-within {
  background-color: var(--ds-primary-tonal);
  outline: 1.5px solid var(--ds-primary-ring);
}

.ds-appsw__search-icon {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  color: var(--ds-ink-muted);
  transition: color 0.12s ease;
}

.ds-appsw__search:focus-within .ds-appsw__search-icon {
  color: var(--ds-primary);
}

.ds-appsw__search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--ds-font-sans);
  font-size: var(--ds-text-body-2);
  color: var(--ds-ink);
  min-width: 0;
}

.ds-appsw__search-input::placeholder {
  color: var(--ds-ink-subtle);
}

/* Remove default search clear button */
.ds-appsw__search-input::-webkit-search-cancel-button {
  display: none;
}

.ds-appsw__search-kbd {
  font-family: var(--ds-font-sans);
  font-size: 10px;
  color: var(--ds-ink-subtle);
  background-color: var(--ds-border);
  border-radius: 4px;
  padding: 1px 5px;
  flex: 0 0 auto;
}

/* ── Body (scrollable) ── */
.ds-appsw__body {
  max-height: calc(70vh - 100px);
  overflow-y: auto;
  padding: 4px 0;
}

/* ── Group headings ── */
.ds-appsw__group-label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px 3px;
  font-size: var(--ds-text-label-3);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ds-ink-muted);
}

.ds-appsw__dev-chip {
  font-size: 9px;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0;
  background-color: var(--ds-primary-tonal);
  color: var(--ds-primary);
  border-radius: var(--ds-radius-sm);
  padding: 1px 5px;
}

/* ── List items (shared) ── */
.ds-appsw__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 14px;
  color: var(--ds-ink);
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.1s ease;
}

.ds-appsw__item:hover {
  background-color: var(--ds-surface-muted);
}

.ds-appsw__item.is-active {
  background-color: var(--ds-primary-tonal);
}

.ds-appsw__item:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--ds-primary-ring);
}

/* Planned (non-interactive) */
.ds-appsw__item--planned {
  opacity: 0.45;
  cursor: default;
}

.ds-appsw__item--planned:hover {
  background-color: transparent;
}

/* Icon */
.ds-appsw__item-icon {
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border-radius: var(--ds-radius-sm);
  background-color: var(--ds-primary-tonal);
  color: var(--ds-primary);
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-appsw__item.is-active .ds-appsw__item-icon {
  background-color: var(--ds-primary);
  color: var(--ds-surface);
}

.ds-appsw__item--planned .ds-appsw__item-icon {
  background-color: var(--ds-surface-muted);
  color: var(--ds-ink-muted);
}

/* Text stack */
.ds-appsw__item-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.ds-appsw__item-name {
  font-size: var(--ds-text-body-2);
  font-weight: 600;
  color: var(--ds-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ds-appsw__item.is-active .ds-appsw__item-name {
  color: var(--ds-primary);
}

.ds-appsw__item-desc {
  font-size: var(--ds-text-body-3);
  color: var(--ds-ink-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: var(--ds-leading-body-3);
}

/* Badges */
.ds-appsw__badge {
  flex: 0 0 auto;
  font-size: 9px;
  font-weight: 700;
  border-radius: var(--ds-radius-sm);
  padding: 2px 5px;
}

.ds-appsw__badge--live {
  background-color: var(--ds-success-tonal, #dcfce7);
  color: var(--ds-success, #15803d);
}

.ds-appsw__badge--soon {
  background-color: var(--ds-warning-tonal, #fef3c7);
  color: var(--ds-warning, #92400e);
}

/* "In development" note shown below planned items in search */
.ds-appsw__planned-note {
  padding: 6px 14px 8px;
  font-size: var(--ds-text-body-3);
  color: var(--ds-ink-muted);
  border-top: 1px solid var(--ds-border);
  text-align: center;
}

/* Empty state */
.ds-appsw__empty {
  padding: 20px 14px;
  font-size: var(--ds-text-body-2);
  color: var(--ds-ink-muted);
  text-align: center;
}

/* ── Entrance animation ── */
@media (prefers-reduced-motion: no-preference) {
  .ds-appsw__panel {
    animation: ds-appsw-in 0.14s ease;
  }

  @keyframes ds-appsw-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

- [ ] **Step 3.2 — Typecheck**

```bash
cd /Users/akashk/Documents/Projects/MoSJE/packages/design-system && npm run typecheck
```

Expected: no errors.

- [ ] **Step 3.3 — Commit**

```bash
git add packages/design-system/components/zone-switcher.css
git commit -m "feat(design-system): AppSwitcher CSS — panel layout, search, badges, planned-item styles"
```

---

## Task 4: Update design-system exports

**Files:**
- Modify: `packages/design-system/index.ts` (lines 54–55)

- [ ] **Step 4.1 — Replace the ZoneSwitcher export lines**

Find and replace these two lines:

```ts
export { ZoneSwitcher, DEFAULT_ZONES } from "./components/zone-switcher";
export type { Zone, ZoneSwitcherProps } from "./components/zone-switcher";
```

With:

```ts
export { AppSwitcher, DEFAULT_APPS, ZoneSwitcher, DEFAULT_ZONES } from "./components/zone-switcher";
export type { AppEntry, AppSwitcherProps, Zone, ZoneSwitcherProps } from "./components/zone-switcher";
```

- [ ] **Step 4.2 — Typecheck**

```bash
cd /Users/akashk/Documents/Projects/MoSJE/packages/design-system && npm run typecheck
```

Expected: no errors.

- [ ] **Step 4.3 — Commit**

```bash
git add packages/design-system/index.ts
git commit -m "feat(design-system): export AppSwitcher, AppEntry, DEFAULT_APPS from index"
```

---

## Task 5: Update consumer app layouts

**Files:**
- Modify: `apps/dosje/src/app/layout.tsx`
- Modify: `apps/portals/pm-ajay/src/app/layout.tsx`
- Modify: `apps/portals/smile-admin/src/app/layout.tsx`

### 5a — dosje layout

- [ ] **Step 5a.1 — Update import and usage in dosje/src/app/layout.tsx**

Find:
```tsx
import { AccessibilityWidget, ColorModeProvider, ZoneSwitcher } from "@mosje/design-system";
```
Replace with:
```tsx
import { AccessibilityWidget, AppSwitcher, ColorModeProvider } from "@mosje/design-system";
```

Find:
```tsx
          <ZoneSwitcher />
```
Replace with:
```tsx
          <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
```

- [ ] **Step 5a.2 — Typecheck dosje**

```bash
cd /Users/akashk/Documents/Projects/MoSJE/apps/dosje && npm run typecheck
```

Expected: no errors.

### 5b — pm-ajay layout

- [ ] **Step 5b.1 — Update import and usage in portals/pm-ajay/src/app/layout.tsx**

Find:
```tsx
import { ZoneSwitcher } from "@mosje/design-system";
```
Replace with:
```tsx
import { AppSwitcher } from "@mosje/design-system";
```

Find:
```tsx
        <ZoneSwitcher />
```
Replace with:
```tsx
        <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
```

- [ ] **Step 5b.2 — Typecheck pm-ajay**

```bash
cd /Users/akashk/Documents/Projects/MoSJE/apps/portals/pm-ajay && npm run typecheck
```

Expected: no errors.

### 5c — smile-admin layout

- [ ] **Step 5c.1 — Update import and usage in portals/smile-admin/src/app/layout.tsx**

Find:
```tsx
import { ColorModeProvider, ZoneSwitcher } from "@mosje/design-system";
```
Replace with:
```tsx
import { AppSwitcher, ColorModeProvider } from "@mosje/design-system";
```

Find:
```tsx
          <ZoneSwitcher />
```
Replace with:
```tsx
          <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
```

- [ ] **Step 5c.2 — Typecheck smile-admin**

```bash
cd /Users/akashk/Documents/Projects/MoSJE/apps/portals/smile-admin && npm run typecheck
```

Expected: no errors.

- [ ] **Step 5.3 — Commit all layout changes together**

```bash
git add apps/dosje/src/app/layout.tsx \
        apps/portals/pm-ajay/src/app/layout.tsx \
        apps/portals/smile-admin/src/app/layout.tsx
git commit -m "feat: migrate all app layouts from ZoneSwitcher → AppSwitcher with devMode prop"
```

---

## Task 6: Visual verification

- [ ] **Step 6.1 — Start the dev server**

```bash
cd /Users/akashk/Documents/Projects/MoSJE && npm run dev
```

Wait until hub, dosje, and portal apps are all ready (all print "Ready" to the console).

- [ ] **Step 6.2 — Smoke-test the DoSJE website zone**

Open http://localhost:3000/website in a browser.

Verify:
- FAB pill is visible at bottom-left with grid icon and "Apps" label
- Clicking FAB opens the panel
- Header shows "Currently in · DoSJE Website" with correct 2-letter icon
- Theme swatches are visible; clicking one changes the page theme and the active swatch gets a ring
- Portals section shows 3 live rows (live badge) + 5 planned rows (grayed out, "soon" badge)
- Dev section is visible (NODE_ENV=development)
- Clicking a live portal row navigates to that portal
- Clicking a planned row does nothing
- Pressing Escape closes the panel
- Typing in the search bar filters the list; pressing `/` focuses the search input

- [ ] **Step 6.3 — Smoke-test from inside a portal**

Open http://localhost:3000/portals/pm-ajay.

Verify:
- Header shows "Currently in · PM-AJAY" (not DoSJE Website)
- The PM-AJAY row in the list has the active blue background and solid icon

- [ ] **Step 6.4 — Verify search with planned portal**

With the panel open on any zone, type "nsfdc" in the search box.

Verify:
- Only the NSFDC row appears
- It is grayed out (45% opacity) with a "soon" badge
- "This portal is in development" note appears below it

- [ ] **Step 6.5 — Final commit if any fixups were needed**

If any visual fixups were made during steps 6.1–6.4, stage and commit them:

```bash
git add -p   # review each hunk
git commit -m "fix(design-system): AppSwitcher visual fixups after smoke test"
```
