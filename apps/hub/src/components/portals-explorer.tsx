"use client";

import * as React from "react";
import { Icon, PORTAL_CATEGORIES, deriveAbbr, filterApps, type AppEntry } from "@mosje/design-system";

type StatusFilter = "all" | "live" | "planned";

function PortalCard({ portal }: { portal: AppEntry }) {
  const abbr = deriveAbbr(portal);
  const isLive = (portal.status ?? "live") === "live";

  const tile = (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gov-blue-tonal text-sm font-bold text-gov-blue"
      aria-hidden="true"
    >
      {abbr}
    </span>
  );

  const body = (
    <>
      <div className="flex items-start gap-3">
        {tile}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[15px] font-semibold text-ink">
              {portal.name}
            </h3>
            {isLive ? (
              <span className="shrink-0 rounded-full bg-success-tonal px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-success">
                Live
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                Planned
              </span>
            )}
          </div>
          {portal.org && (
            <p className="mt-0.5 text-xs leading-snug text-ink-muted">{portal.org}</p>
          )}
        </div>
      </div>
      {portal.desc && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">
          {portal.desc}
        </p>
      )}
    </>
  );

  if (isLive) {
    return (
      <a
        href={portal.path}
        className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gov-blue/40 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gov-blue"
      >
        {body}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gov-blue transition-all group-hover:gap-2.5">
          Open portal
          <Icon name="arrow_forward" size={16} aria-hidden="true" />
        </span>
      </a>
    );
  }

  return (
    <div
      className="flex flex-col rounded-2xl border border-dashed border-border bg-surface/60 p-5 opacity-75"
      aria-label={`${portal.name} — planned, not yet available`}
    >
      {body}
    </div>
  );
}

export interface PortalsExplorerProps {
  /**
   * The portals to show, already resolved against the admin's registry
   * overrides. Passed in rather than read from `DEFAULT_APPS` here, because
   * this is a client component and the override store is server-only.
   */
  portals: AppEntry[];
}

export function PortalsExplorer({ portals }: PortalsExplorerProps) {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("all");

  const filtered = React.useMemo(() => {
    let list = portals;
    if (status !== "all") {
      list = list.filter((a) => (a.status ?? "live") === status);
    }
    return filterApps(list, query);
  }, [portals, query, status]);

  const grouped = React.useMemo(
    () =>
      PORTAL_CATEGORIES.map((category) => ({
        category,
        items: filtered.filter((a) => a.category === category),
      })).filter((g) => g.items.length > 0),
    [filtered],
  );

  const liveCount = portals.filter((a) => (a.status ?? "live") === "live").length;

  const filters: { id: StatusFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: portals.length },
    { id: "live", label: "Live", count: liveCount },
    { id: "planned", label: "Planned", count: portals.length - liveCount },
  ];

  return (
    <>
      {/* Toolbar */}
      <div className="sticky top-[64px] z-30 -mx-6 mb-10 border-b border-border bg-surface/85 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-surface/72">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search portals, schemes or organisations…"
              aria-label="Search portals"
              className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-9 text-sm text-ink placeholder:text-ink-muted focus:border-gov-blue focus:outline-none focus:ring-2 focus:ring-gov-blue/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-muted hover:text-ink"
              >
                <Icon name="close" size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <div
            role="group"
            aria-label="Filter by availability"
            className="flex items-center gap-1 rounded-lg border border-border bg-surface-muted p-1"
          >
            <Icon name="tune" size={14} className="mx-1.5 text-ink-muted" aria-hidden="true" />
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatus(f.id)}
                aria-pressed={status === f.id}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  status === f.id
                    ? "bg-surface text-gov-blue shadow-xs"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {f.label}
                <span className="ml-1.5 opacity-60">{f.count}</span>
              </button>
            ))}
          </div>

          {/* Stays in the DOM so the live region keeps announcing result counts,
              but is only shown once a filter/query is active — unfiltered it just
              restated the "All 20" chip beside it. */}
          <p
            className={
              query || status !== "all"
                ? "text-xs text-ink-muted sm:ml-auto"
                : "sr-only"
            }
            role="status"
            aria-live="polite"
          >
            {filtered.length} portal{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Grouped grid */}
      {grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <Icon name="search" size={40} className="mb-3 text-ink-muted/40" aria-hidden="true" />
          <p className="text-sm font-semibold text-ink">No portals match your search</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("all");
            }}
            className="mt-3 text-xs font-semibold text-gov-blue hover:underline"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {grouped.map(({ category, items }) => (
            <section key={category} aria-labelledby={`cat-${category}`}>
              <div className="mb-4 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-4 w-1 rounded-full bg-gov-blue"
                />
                <h2
                  id={`cat-${category}`}
                  className="text-sm font-bold uppercase tracking-[0.12em] text-ink"
                >
                  {category}
                </h2>
                <span className="text-xs font-semibold text-ink-muted">
                  {items.length}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((portal) => (
                  <PortalCard key={portal.path} portal={portal} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
