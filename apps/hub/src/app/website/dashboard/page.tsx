import type { Metadata } from "next";
import { SectionTitle } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { DepartmentOverview } from "@/components/kpi-dashboard/DepartmentOverview";
import { PortalDashboardList } from "@/components/kpi-dashboard/PortalDashboardList";
import { MinistryCollection } from "@/components/kpi-dashboard/DashboardViewer";
import { DASHBOARD_PAGE } from "@/lib/website-shared/dashboard";
import { socialCard } from "@/lib/seo/social";
import "@/components/website-next/templates/media.css";

// Literals, not read from DASHBOARD_PAGE: the site-search indexer reads the title and
// description from this file's text (`scripts/build-search-index.mjs`). They match it.
const TITLE = "Beneficiary Dashboard";
const DESCRIPTION =
  "Progress of the Department's schemes: the Beneficiary Dashboard, and the indicators reported by each scheme portal.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/dashboard" }),
};

/**
 * The website's Dashboard, in the 2026 design.
 *
 * DS Audit: SectionTitle ✅ · PortalDashboardList / DepartmentOverview (app,
 * shared with the Classic and DBIM designs) ✅. Content: `lib/website-shared/dashboard.ts`.
 *
 * WHAT CHANGED, 5 Oct 2026. This page drew the three PM-AJAY dashboards and nothing else.
 * It is now the live site's Beneficiary Dashboard, then one dashboard per scheme portal
 * that has submitted KPIs. PM-AJAY's dashboards are where the DBIM design already put
 * them on 29 Sep 2026 — on the scheme's own page — and its card here links there.
 */
export default function DashboardPage() {
  return (
    <PageLayout title={TITLE} breadcrumb={[{ label: DASHBOARD_PAGE.crumb }]}>
      <section className="wn-section" aria-label={TITLE}>
        <div className="sa-container">
          <DepartmentOverview sectionLevel={2} />
        </div>
      </section>

      <section className="wn-section" aria-labelledby="portal-dashboards-title">
        <div className="sa-container kd-block">
          <SectionTitle as={2} headingId="portal-dashboards-title" title={DASHBOARD_PAGE.portalsTitle} description={DASHBOARD_PAGE.portalsDescription} />
          <PortalDashboardList design="new" />
          <MinistryCollection />
        </div>
      </section>
    </PageLayout>
  );
}
