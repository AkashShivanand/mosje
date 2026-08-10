"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import {
  AppEntry,
  DEFAULT_APPS,
  deriveAbbr,
  filterApps,
  matchActivePath,
} from "./app-switcher-utils";

export interface AppSwitcherPanelProps {
  /** Override the default estate registry. */
  apps?: AppEntry[];
  /** Current hub-origin path, for the active/"Currently in" treatment. */
  pathname: string | null;
  /** Called when a destination is chosen, so the shell can close itself. */
  onNavigate?: () => void;
  className?: string;
}

/**
 * AppSwitcherPanel — the searchable content of the SAMAVESH AppSwitcher.
 *
 * Renders the current-app indicator, the search box (`/` shortcut focuses it
 * while the panel is mounted), and the grouped destination list. Pure
 * content: no fixed positioning, no open/close state, and no colour-mode
 * handling — a shell (e.g. `AppSwitcher`) owns the floating chrome, and a
 * real `ColorModeSwitcher` supplies colour-mode controls alongside this
 * panel where needed.
 *
 * Uses plain <a href> links so navigation works from inside any basePath-ed
 * zone.
 */
export function AppSwitcherPanel({
  apps = DEFAULT_APPS,
  pathname,
  onNavigate,
  className,
}: AppSwitcherPanelProps): React.JSX.Element {
  const [query, setQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);
  const panelId = React.useId();

  // `/` focuses search while the panel is mounted.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Move focus into the search input on mount.
  React.useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      searchRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

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

  const visibleApps = React.useMemo(() => filterApps(apps, query), [apps, query]);

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
    <div className={cn(className)}>
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
      <div className="ds-appsw__body" id={`${panelId}-list`}>
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
                <div className="ds-appsw__group-label">{group}</div>
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
                      {...(a.newTab
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={cn(
                        "ds-appsw__item",
                        isActive && "is-active",
                      )}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => onNavigate?.()}
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
                          {a.newTab && (
                            <>
                              {/* A link that opens a new tab has to say so
                                  (WCAG 3.2.5) — the glyph for sighted
                                  users, the text for everyone else. */}
                              <span
                                className="ds-appsw__item-external"
                                aria-hidden="true"
                              >
                                ↗
                              </span>
                              <span className="ds-sr-only">
                                {" "}
                                (opens in a new tab)
                              </span>
                            </>
                          )}
                        </span>
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
  );
}
