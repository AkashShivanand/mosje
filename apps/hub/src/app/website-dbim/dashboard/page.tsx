import * as React from "react";
import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimPortalTiles } from "@/components/website-dbim/dashboard/PortalTiles";
import { MinistryCollection } from "@/components/kpi-dashboard/DashboardViewer";
import { DepartmentOverview } from "@/components/kpi-dashboard/DepartmentOverview";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { DBIM_PORTAL_DASHBOARDS } from "@/lib/website-dbim/ministry";
import { ProposedDashboardSection } from "@/components/kpi-dashboard/proposed/ProposedDashboardSection";
import { OfficerAccess } from "@/components/kpi-dashboard/proposed/OfficerAccess";
import { DASHBOARD_PAGE } from "@/lib/website-shared/dashboard";
import { dashboardVersion } from "@/lib/website-shared/dashboard-version";
import "@/components/website-dbim/ministry/ministry.css";
import "@/components/website-dbim/dashboard/dashboard.css";
import "@/components/kpi-dashboard/kpi-dashboard.css";

export const metadata: Metadata = {
  title: "Beneficiary Dashboard | Department of Social Justice and Empowerment",
  description: DASHBOARD_PAGE.description,
};

/**
 * `/dashboard` in the DBIM design — the page Ministry › Our Performance's Beneficiary
 * Dashboard tile opens.
 *
 * Until 5 Oct 2026 this address redirected to Our Performance, whose tile left for
 * dosje.gov.in. It now carries the Beneficiary Dashboard itself and the scheme portals'
 * dashboards, the same content as the New and Classic designs
 * (`lib/website-shared/dashboard.ts`), in the DBIM page shape: the Ministry banner and
 * tabs with Our Performance current, and the portal dashboards as Our Performance tiles
 * (DBIM 3.0 §A.5.1.4, Figure 69).
 *
 * ONE DEPARTURE FROM THE OTHER TWO DESIGNS: no PM-AJAY entry. The Department asked on
 * 29 Sep 2026 that the PM-AJAY dashboard sit on the scheme's own page under Our Scheme
 * Portals, not among the Department's dashboards (`DBIM_DASHBOARDS`).
 *
 * DS Audit: DepartmentOverview / MinistryCollection (app, shared) ✅ · DbimDashboardTiles (DBIM) ✅.
 *
 * The proposed dashboard is the default; `?version=current` draws this page (`dashboard-version.ts`).
 */
type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default async function DbimDashboardPage({ searchParams }: PageProps) {
  const proposed = dashboardVersion(await searchParams) === "proposed";
  return (
    <DbimPage
      title={DASHBOARD_PAGE.title}
      crumbs={[{ label: "Ministry", path: "/ministry" }, { label: "Our Performance", path: "/ministry/our-performance" }]}
      path="/ministry/our-performance"
      tabs={DBIM_MENU[0]!.children}
      activeTab="/ministry/our-performance"
      action={proposed ? <React.Suspense fallback={null}><OfficerAccess tone="inverse" /></React.Suspense> : undefined}
    >
      {proposed ? (
        <div className="db-dash">
          <ProposedDashboardSection sectionLevel={2} />
        </div>
      ) : (
      <div className="db-dash">
        <section className="db-dash__section" aria-label={DASHBOARD_PAGE.title}>
          <DepartmentOverview sectionLevel={2} />
        </section>
        <div className="db-dash__section kd-block">
          <DbimPortalTiles tiles={DBIM_PORTAL_DASHBOARDS} title={DASHBOARD_PAGE.portalsTitle} headingId="portal-dashboards-title" />
          <MinistryCollection />
        </div>
      </div>
      )}
    </DbimPage>
  );
}
