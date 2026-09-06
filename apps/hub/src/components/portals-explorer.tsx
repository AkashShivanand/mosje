"use client";

import * as React from "react";
import Link from "next/link";
import {
  Icon,
  isLiveEntry,
  PortalCard,
  portalLabel,
  portalSummary,
  portalCategoriesIn,
  type AppEntry,
  buttonClasses,
} from "@mosje/design-system";
import "./portals-gateway.css";

/*
 * THE DIRECTORY LISTS LIVE PORTALS ONLY, and the status filter went with that
 * decision rather than surviving it as a control with one outcome.
 *
 * It used to render unbuilt portals as non-interactive cards badged "Under
 * Onboarding", beside live ones badged "Live Portal". Two badges on a page where
 * one state is now the only state is two pieces of furniture that say nothing —
 * and a citizen arriving at a government directory to find half of it is not
 * usable yet learns something about the department that is not true. What ships
 * is what is listed.
 */
/*
 * THE TAB LIST IS DERIVED, never restated — see `categories` below.
 *
 * It used to be a hand-typed array: "Schemes & scholarships", "Finance &
 * development corporations". The registry's vocabulary had since moved to the
 * design's five (Commission · Scheme Portals · Corporations · Training &
 * Capacity Building · Foundation & Autonomous Bodies) and nothing matched, so
 * every tab read 0 and selecting one emptied the grid. A second copy of a
 * vocabulary is a copy that goes stale, and this one had.
 *
 * "All Portals" is the only tab that is not a category, so it is the only one
 * written here.
 */
const ALL_TAB = { id: "all", label: "All Portals" };

export interface PortalsExplorerProps {
  portals: AppEntry[];
}

export function PortalsExplorer({ portals }: PortalsExplorerProps) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");

  // Filter & Sort Portals (Live portals always appear first)
  const filteredPortals = React.useMemo(() => {
    const list = portals.filter((portal) => {
      // Exclude Website, Reports, and Resources from the portal grid
      if (portal.group !== "Portals") return false;

      // LIVE ONLY. The registry is the single source of what exists, exactly as
      // it is for the banner drawer and the app switcher — so a portal cannot be
      // listed here and be unreachable, which is the failure that shipped a 404
      // on every page. All three now ask `isLiveEntry` rather than each writing
      // its own version of the test.
      if (!isLiveEntry(portal)) return false;

      // Category filter
      if (category !== "all" && portal.category !== category) {
        return false;
      }

      // Query filter
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const matchName = portal.name.toLowerCase().includes(q);
        const matchDesc = (portal.desc ?? "").toLowerCase().includes(q);
        const matchOrg = (portal.org ?? "").toLowerCase().includes(q);
        const matchCategory = (portal.category ?? "").toLowerCase().includes(q);
        // Search the CITIZEN-FACING pair too, or a reader typing the name they
        // can see ("SAMBAL", "e-Utthaan") finds nothing — the registry calls
        // those "National Action Plan for Older Persons" and "E-Utthan Admin".
        const label = portalLabel(portal);
        const matchLabel =
          label.short.toLowerCase().includes(q) || label.full.toLowerCase().includes(q);
        return matchName || matchDesc || matchOrg || matchCategory || matchLabel;
      }

      return true;
    });

    // No sort. Every entry is live, so registry order is the order — and that
    // order is itself governed (live before planned within a category), so
    // re-sorting here would silently compete with the registry's own rule.
    return list;
  }, [portals, query, category]);

  // Counts for tabs
  /*
   * ONLY CATEGORIES THAT HAVE SOMETHING IN THEM.
   *
   * The tab strip listed all five of the registry's vocabulary and four of them
   * read 0 — four controls that empty the grid, on a directory whose whole job is
   * getting a citizen to a service. It is the same rule the SAMAVESH banner's
   * chip row already follows: a filter exists only when it would DO something.
   * The tabs come back on their own as the first commission or corporation ships.
   */
  const categories = React.useMemo(() => {
    const live = portals.filter(
      (p) => p.group === "Portals" && (p.status ?? "live") === "live",
    );
    const present = portalCategoriesIn(live);
    return present.length > 1
      ? [ALL_TAB, ...present.map((c) => ({ id: c as string, label: c as string }))]
      : [];
  }, [portals]);

  const categoryCounts = React.useMemo(() => {
    // LIVE only, matching the grid. Counting every registry entry made a tab
    // promise 14 portals and render 3 — a count that disagrees with what it
    // filters is worse than no count.
    const portalOnly = portals.filter(
      (p) => p.group === "Portals" && (p.status ?? "live") === "live",
    );
    const counts: Record<string, number> = { all: portalOnly.length };
    for (const p of portalOnly) {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    }
    return counts;
  }, [portals]);

  const liveCount = portals.filter(
    (p) => p.group === "Portals" && isLiveEntry(p),
  ).length;


  return (
    <div className="portals-gw">
      {/* 1. Hero Gateway Banner */}
      <section className="portals-gw__hero" aria-labelledby="portals-gateway-title">
        <div className="portals-gw__hero-container">
          <nav aria-label="Breadcrumb" className="portals-gw__breadcrumb">
            <Link href="/website">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="font-semibold text-ink">
              Workflow Portals
            </span>
          </nav>

          <div className="portals-gw__hero-header">
            <div className="portals-gw__title-lockup">
              <h1 id="portals-gateway-title" className="portals-gw__title">
                Integrated Digital Portals &amp; Services Gateway
              </h1>
              <p className="portals-gw__desc">
                Direct access gateway for citizens, students, institutions, and departmental
                officers across specialized welfare, scholarship, credit, and statutory workflow systems.
              </p>
            </div>

            {/*
              TWO FIGURES, NOT FOUR. "Total 21 / Live 8 / Onboarding 13" was a
              headline saying most of the department's estate does not work yet —
              on the page a citizen lands on to find a service. Onboarding went
              with the planned cards; Total became the live count, because with
              nothing else listed the two were the same number reported twice.
            */}
            <div className="portals-gw__kpis" role="region" aria-label="Portals summary">
              <div className="portals-gw__kpi-card">
                <span className="portals-gw__kpi-value">{liveCount}</span>
                <span className="portals-gw__kpi-label">
                  {liveCount === 1 ? "Portal available" : "Portals available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Toolbar (Search & Filters) */}
      <section className="portals-gw__toolbar" aria-label="Portals filtering and search">
        <div className="portals-gw__search-row">
          <div className="portals-gw__search-box">
            <Icon name="search" size={20} className="text-neutral-subtle shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search portals by scheme name, acronym (e.g. SMILE, PM-AJAY), or department..."
              className="portals-gw__search-input"
              aria-label="Search workflow portals"
              autoComplete="off"
              spellCheck="false"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-neutral-subtle hover:text-ink p-1 flex items-center justify-center rounded-full"
                aria-label="Clear search"
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </div>

        </div>

        {/* Category Tabs — absent while every portal shares one category. */}
        {categories.length > 0 && (
        <div className="portals-gw__category-tabs" role="tablist" aria-label="Portal categories">
          {categories.map((cat) => {
            const isActive = category === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setCategory(cat.id)}
                className={`portals-gw__category-tab ${isActive ? "portals-gw__category-tab--active" : ""}`}
              >
                <span>{cat.label}</span>
                <span className="portals-gw__category-count">{count}</span>
              </button>
            );
          })}
        </div>
        )}
      </section>

      {/* 3. Portals Grid Content */}
      <section className="portals-gw__content" aria-label="Portals directory listing">
        {filteredPortals.length > 0 ? (
          <ul className="portals-gw__grid">
            {filteredPortals.map((portal) => {
              /*
                ONE CARD, SHARED. This grid drew its own `portals-gw__card` while
                the SAMAVESH banner drawer drew a `PortalCard` — two components
                for one object, which is what `PortalCard` was extracted to end
                and did not, until now. It renders the `detailed` variant: same
                rule, ground, tile and saffron code as the banner's `compact`
                one, plus the description, category and action this surface has
                room for.

                The mark comes from the OrgLogo registry via the route. The old
                card drew a TEXT ABBREVIATION in a coloured box — a derived
                two-letter code where the department has an actual crest.
              */
              return (
                <li key={portal.path}>
                  <PortalCard
                    variant="detailed"
                    code={portalLabel(portal).short}
                    name={portalLabel(portal).full}
                    href={portal.path}
                    path={portal.path}
                    description={portalSummary(portal)}
                    category={portal.category?.replace(
                      "& development corporations",
                      "& Credit",
                    )}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-12 text-center bg-surface rounded-2xl border border-neutral-subtle mb-10 shadow-sm">
            <Icon name="search_off" size={48} className="text-neutral-subtle mx-auto mb-3" />
            <h3 className="text-title-1 text-ink">No Portals Match Your Filters</h3>
            <p className="text-body-2 text-neutral-subtle mt-1 max-w-md mx-auto">
              We could not find any portals matching &ldquo;{query}&rdquo; in this category. Try resetting your search or selecting &ldquo;All Portals&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className={buttonClasses("primary", "outlined", "sm", "mt-4")}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
