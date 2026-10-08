import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { PortalDashboardView } from "@/components/kpi-dashboard/DashboardViewer";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { PORTAL_DASHBOARDS, portalById } from "@/lib/kpi/register";
import { getPortalFeed } from "@/lib/kpi/feeds";
import { DASHBOARD_PAGE } from "@/lib/website-shared/dashboard";
import { PORTAL_DASHBOARD_CRUMBS } from "@/lib/website-shared/dashboard-links";
import { CURRENT_DASHBOARD_QUERY } from "@/lib/website-shared/dashboard-version";
import "@/components/website-dbim/dashboard/dashboard.css";

export function generateStaticParams() {
  return PORTAL_DASHBOARDS.map((p) => ({ portal: p.slug }));
}

export const dynamicParams = false;

/** Re-read the portal's live feed hourly, as the PM-AJAY dashboards do. */
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ portal: string }> }): Promise<Metadata> {
  const p = portalById((await params).portal);
  return p
    ? { title: `${PORTAL_DASHBOARD_CRUMBS[p.id]} Dashboard | Department of Social Justice and Empowerment`, description: p.summary }
    : {};
}

/**
 * One scheme portal's public dashboard, in the DBIM design: an Our Performance tile's
 * destination. Same body as the New and Classic designs (`PortalKpiDashboard`), in the
 * DBIM page shape with Our Performance the current Ministry tab.
 *
 * DS Audit: PortalDashboardView (app, shared; public or the officer role in View As) ✅.
 */
export default async function DbimPortalDashboardPage({ params }: { params: Promise<{ portal: string }> }) {
  const p = portalById((await params).portal);
  if (!p) notFound();
  const feed = await getPortalFeed(p.id);
  return (
    <DbimPage
      title={`${PORTAL_DASHBOARD_CRUMBS[p.id]} Dashboard`}
      crumbs={[
        { label: "Ministry", path: "/ministry" },
        { label: "Our Performance", path: "/ministry/our-performance" },
        { label: DASHBOARD_PAGE.crumb, path: `/dashboard${CURRENT_DASHBOARD_QUERY}` },
      ]}
      path="/ministry/our-performance"
      tabs={DBIM_MENU[0]!.children}
      activeTab="/ministry/our-performance"
    >
      <div className="db-dash">
        <div className="db-dash__section kd-block">
          <p className="db-dash__lead">{p.summary}</p>
        </div>
        <div className="db-dash__section">
          <PortalDashboardView portalId={p.id} feed={feed} />
        </div>
      </div>
    </DbimPage>
  );
}
