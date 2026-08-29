"use client";

import * as React from "react";
import Link from "next/link";
import { Icon, deriveAbbr, type AppEntry, buttonClasses } from "@mosje/design-system";
import "./portals-gateway.css";

type StatusFilter = "all" | "live" | "planned";

const CATEGORIES = [
  { id: "all", label: "All Portals" },
  { id: "Schemes & scholarships", label: "Schemes & Scholarships" },
  { id: "Finance & development corporations", label: "Finance & Credit" },
  { id: "Social defence & welfare", label: "Social Defence & Welfare" },
  { id: "Commissions & boards", label: "Commissions & Boards" },
] as const;

export interface PortalsExplorerProps {
  portals: AppEntry[];
}

export function PortalsExplorer({ portals }: PortalsExplorerProps) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");
  const [status, setStatus] = React.useState<StatusFilter>("all");

  // Filter & Sort Portals (Live portals always appear first)
  const filteredPortals = React.useMemo(() => {
    const list = portals.filter((portal) => {
      // Exclude Website, Reports, and Resources from the portal grid
      if (portal.group !== "Portals") return false;

      // Status filter
      if (status !== "all") {
        const isLive = (portal.status ?? "live") === "live";
        if (status === "live" && !isLive) return false;
        if (status === "planned" && isLive) return false;
      }

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
        const matchAbbr = deriveAbbr(portal).toLowerCase().includes(q);
        return matchName || matchDesc || matchOrg || matchCategory || matchAbbr;
      }

      return true;
    });

    // In all statuses and views, live portals must come first
    return list.sort((a, b) => {
      const aLive = (a.status ?? "live") === "live" ? 0 : 1;
      const bLive = (b.status ?? "live") === "live" ? 0 : 1;
      return aLive - bLive;
    });
  }, [portals, query, category, status]);

  // Counts for tabs
  const categoryCounts = React.useMemo(() => {
    const portalOnly = portals.filter((p) => p.group === "Portals");
    const counts: Record<string, number> = {
      all: portalOnly.length,
    };
    for (const p of portalOnly) {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    }
    return counts;
  }, [portals]);

  const liveCount = portals.filter((p) => p.group === "Portals" && (p.status ?? "live") === "live").length;
  const totalCount = portals.filter((p) => p.group === "Portals").length;
  const onboardingCount = totalCount - liveCount;

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

            {/* Quick Summary KPIs */}
            <div className="portals-gw__kpis" role="region" aria-label="Portals summary statistics">
              <div className="portals-gw__kpi-card">
                <span className="portals-gw__kpi-value">{totalCount}</span>
                <span className="portals-gw__kpi-label">Total Portals</span>
              </div>
              <div className="portals-gw__kpi-card">
                <span className="portals-gw__kpi-value">{liveCount}</span>
                <span className="portals-gw__kpi-label">Active Live</span>
              </div>
              <div className="portals-gw__kpi-card">
                <span className="portals-gw__kpi-value">{onboardingCount}</span>
                <span className="portals-gw__kpi-label">Onboarding</span>
              </div>
              <div className="portals-gw__kpi-card">
                <span className="portals-gw__kpi-value">4</span>
                <span className="portals-gw__kpi-label">Key Sectors</span>
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
                className="text-neutral-subtle hover:text-ink text-xs p-1 flex items-center justify-center rounded-full"
                aria-label="Clear search"
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </div>

          <div className="portals-gw__status-filter" role="group" aria-label="Filter by deployment status">
            <button
              type="button"
              onClick={() => setStatus("all")}
              className={`portals-gw__status-btn ${status === "all" ? "portals-gw__status-btn--active" : ""}`}
              aria-pressed={status === "all"}
            >
              All Statuses
            </button>
            <button
              type="button"
              onClick={() => setStatus("live")}
              className={`portals-gw__status-btn ${status === "live" ? "portals-gw__status-btn--active" : ""}`}
              aria-pressed={status === "live"}
            >
              Live Only ({liveCount})
            </button>
            <button
              type="button"
              onClick={() => setStatus("planned")}
              className={`portals-gw__status-btn ${status === "planned" ? "portals-gw__status-btn--active" : ""}`}
              aria-pressed={status === "planned"}
            >
              Under Onboarding
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="portals-gw__category-tabs" role="tablist" aria-label="Portal categories">
          {CATEGORIES.map((cat) => {
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
      </section>

      {/* 3. Portals Grid Content */}
      <section className="portals-gw__content" aria-label="Portals directory listing">
        {filteredPortals.length > 0 ? (
          <ul className="portals-gw__grid">
            {filteredPortals.map((portal) => {
              const isLive = (portal.status ?? "live") === "live";
              const abbr = deriveAbbr(portal);

              if (isLive) {
                return (
                  <li key={portal.path}>
                    <Link
                      href={portal.path}
                      className="group portals-gw__card portals-gw__card--live focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <div className="portals-gw__card-header">
                        <div className="portals-gw__icon-box" aria-hidden="true">{abbr}</div>
                        <span className="portals-gw__status-badge portals-gw__status-badge--live">
                          <span className="portals-gw__status-dot animate-pulse" aria-hidden="true" />
                          Live Portal
                        </span>
                      </div>

                      <h3 className="portals-gw__card-title">{portal.name}</h3>
                      {portal.org && <p className="portals-gw__card-org">{portal.org}</p>}
                      <p className="portals-gw__card-desc">{portal.desc}</p>

                      <div className="portals-gw__card-footer">
                        <span className="portals-gw__card-category">
                          {portal.category?.replace("& development corporations", "& Credit") ?? "Service"}
                        </span>
                        <span className="portals-gw__card-cta">
                          Open Portal
                          <Icon name="arrow_forward" size={16} className="transition-transform duration-150 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              }

              return (
                <li key={portal.path}>
                  <div
                    className="portals-gw__card portals-gw__card--planned"
                    aria-label={`${portal.name} — planned, not yet available`}
                  >
                    <div className="portals-gw__card-header">
                      <div className="portals-gw__icon-box opacity-60" aria-hidden="true">{abbr}</div>
                      <span className="portals-gw__status-badge portals-gw__status-badge--planned">
                        Under Onboarding
                      </span>
                    </div>

                    <h3 className="portals-gw__card-title">{portal.name}</h3>
                    {portal.org && <p className="portals-gw__card-org">{portal.org}</p>}
                    <p className="portals-gw__card-desc">{portal.desc}</p>

                    <div className="portals-gw__card-footer">
                      <span className="portals-gw__card-category">
                        {portal.category?.replace("& development corporations", "& Credit") ?? "Service"}
                      </span>
                      <span className="text-neutral-subtle text-xs font-semibold">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-12 text-center bg-surface rounded-2xl border border-neutral-subtle mb-10 shadow-sm">
            <Icon name="search_off" size={48} className="text-neutral-subtle mx-auto mb-3" />
            <h3 className="text-lg font-bold text-ink">No Portals Match Your Filters</h3>
            <p className="text-sm text-neutral-subtle mt-1 max-w-md mx-auto">
              We could not find any portals matching &ldquo;{query}&rdquo; in this category. Try resetting your search or selecting &ldquo;All Portals&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setStatus("all");
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
