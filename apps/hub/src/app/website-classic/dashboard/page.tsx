import * as React from "react";
import type { Metadata } from "next";
import { SectionTitle, formatAsOf } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import { DepartmentOverview } from "@/components/kpi-dashboard/DepartmentOverview";
import { PortalDashboardList } from "@/components/kpi-dashboard/PortalDashboardList";
import { MinistryCollection } from "@/components/kpi-dashboard/DashboardViewer";
import { DASHBOARD_PAGE, DEPARTMENT_DASHBOARD_AS_ON } from "@/lib/website-shared/dashboard";
import { isoDate } from "@/lib/kpi/format";
import { ProposedDashboardSection } from "@/components/kpi-dashboard/proposed/ProposedDashboardSection";
import { OfficerAccess } from "@/components/kpi-dashboard/proposed/OfficerAccess";
import { dashboardVersion } from "@/lib/website-shared/dashboard-version";
import "@/components/kpi-dashboard/kpi-dashboard.css";

export const metadata: Metadata = {
  title: "Beneficiary Dashboard — DoSJE",
  description: DASHBOARD_PAGE.description,
};

/**
 * The website's Dashboard, in the Classic design.
 *
 * DS Audit: SectionTitle ✅ · DepartmentOverview / PortalDashboardList (app,
 * shared with the New and DBIM designs) ✅. Content: `lib/website-shared/dashboard.ts`.
 *
 * WHAT THIS REPLACED, 5 Oct 2026: four headline figures and two bar panels typed into
 * this file, footnoted "illustrative" — "19.82 Cr beneficiaries", "12 associated
 * organisations", beneficiaries by category — none traceable to a published source.
 * (The one that was, ₹67,977 Cr, is the live Beneficiary Dashboard's fund-release total,
 * and is now drawn from that dashboard's own figures.) The page now carries the same
 * content as the other two designs.
 *
 * The proposed dashboard is the default; `?version=current` draws this page (`dashboard-version.ts`).
 */
type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export default async function DashboardPage({ searchParams }: PageProps) {
  if (dashboardVersion(await searchParams) === "proposed") {
    return (
      <PageLayout title={DASHBOARD_PAGE.title} breadcrumb={[{ label: DASHBOARD_PAGE.crumb }]} actions={<React.Suspense fallback={null}><OfficerAccess tone="inverse" /></React.Suspense>}>
        <section aria-label={DASHBOARD_PAGE.title}>
          <div className="sa-container py-10 md:py-12">
            <ProposedDashboardSection sectionLevel={2} />
          </div>
        </section>
      </PageLayout>
    );
  }
  return (
    <PageLayout title={DASHBOARD_PAGE.title} breadcrumb={[{ label: DASHBOARD_PAGE.crumb }]} lastUpdated={formatAsOf(isoDate(DEPARTMENT_DASHBOARD_AS_ON))}>
      <section aria-label={DASHBOARD_PAGE.title}>
        <div className="sa-container py-10 md:py-12">
          <DepartmentOverview sectionLevel={2} />
        </div>
      </section>

      <section aria-labelledby="portal-dashboards-title" className="bg-surface-muted">
        <div className="sa-container kd-block py-10 md:py-12">
          <SectionTitle as={2} headingId="portal-dashboards-title" title={DASHBOARD_PAGE.portalsTitle} description={DASHBOARD_PAGE.portalsDescription} />
          <PortalDashboardList design="classic" />
          <MinistryCollection />
        </div>
      </section>
    </PageLayout>
  );
}
