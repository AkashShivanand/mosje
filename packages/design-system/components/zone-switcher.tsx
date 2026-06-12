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

// Re-export for convenience
export type { AppEntry };
export { DEFAULT_APPS };
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
}: AppSwitcherProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [pathname, setPathname] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const swatchRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = React.useId();
  const { mode, setMode, modes } = useColorMode();

  const focusAndSelectSwatch = (index: number) => {
    const next = (index + modes.length) % modes.length;
    const target = modes[next];
    if (!target) return;
    setMode(target.id);
    swatchRefs.current[next]?.focus();
  };

  const onSwatchKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusAndSelectSwatch(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusAndSelectSwatch(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusAndSelectSwatch(0);
        break;
      case "End":
        event.preventDefault();
        focusAndSelectSwatch(modes.length - 1);
        break;
      default:
        break;
    }
  };

  // Client-only pathname — avoids SSR mismatch.
  React.useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const closePanel = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Close on outside click + Escape; / focuses search while open.
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        closePanel();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePanel();
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
  }, [open, closePanel]);

  // Clear search whenever the panel is closed.
  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  // Move focus into the search input when the panel opens.
  React.useEffect(() => {
    if (open) {
      const id = window.requestAnimationFrame(() => {
        searchRef.current?.focus();
      });
      return () => window.cancelAnimationFrame(id);
    }
    return undefined;
  }, [open]);

  // Tab focus trap inside the dialog panel.
  const onPanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      closePanel();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      "button:not([disabled]), [href], input, [tabindex='0']",
    );
    if (!focusables || focusables.length === 0) return;
    const list = Array.from(focusables);
    const first = list[0];
    const last = list[list.length - 1];
    if (!first || !last) return;
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

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
      map.get(a.group)?.push(a);
    }
    return order.flatMap((g) => {
      const items = map.get(g);
      if (!items) return [];
      return [{ group: g, items }];
    });
  }, [visibleApps]);

  const noResults = query.trim().length > 0 && visibleApps.length === 0;

  return (
    <div ref={rootRef} className={cn("ds-appsw", className)}>
      {open && (
        <div
          ref={panelRef}
          className="ds-appsw__panel"
          id={panelId}
          role="dialog"
          aria-label="App switcher"
          aria-modal="false"
          onKeyDown={onPanelKeyDown}
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
                  {modes.map((m, i) => (
                    <button
                      key={m.id}
                      ref={(el) => {
                        swatchRefs.current[i] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={m.id === mode}
                      aria-label={m.label}
                      title={m.label}
                      tabIndex={m.id === mode ? 0 : -1}
                      className={cn(
                        "ds-appsw__swatch",
                        m.id === mode && "is-active",
                      )}
                      style={{ background: m.swatch }}
                      onClick={() => setMode(m.id)}
                      onKeyDown={(e) => onSwatchKeyDown(e, i)}
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
                  <div key={group} role="list" aria-label={group}>
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
                            role="listitem"
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
                          role="listitem"
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
        ref={triggerRef}
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
