import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/website/layout/PageLayout";
import { PortalDashboardView } from "@/components/kpi-dashboard/DashboardViewer";
import { PORTAL_DASHBOARDS, portalById } from "@/lib/kpi/register";
import { getPortalFeed } from "@/lib/kpi/feeds";
import { DASHBOARD_PAGE } from "@/lib/website-shared/dashboard";
import { PORTAL_DASHBOARD_CRUMBS } from "@/lib/website-shared/dashboard-links";
import { CURRENT_DASHBOARD_PATH } from "@/lib/website-shared/dashboard-version";

export function generateStaticParams() {
  return PORTAL_DASHBOARDS.map((p) => ({ portal: p.slug }));
}

export const dynamicParams = false;

/** Re-read the portal's live feed hourly, as the PM-AJAY dashboards do. */
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ portal: string }> }): Promise<Metadata> {
  const p = portalById((await params).portal);
  return p ? { title: `${PORTAL_DASHBOARD_CRUMBS[p.id]} Dashboard — DoSJE`, description: p.summary } : {};
}

/**
 * One scheme portal's public dashboard, in the Classic design. Same body as the New and
 * DBIM designs (`PortalKpiDashboard`); the Classic chrome around it.
 *
 * DS Audit: PortalDashboardView (app, shared; public or the officer role in View As) ✅.
 */
export default async function PortalDashboardPage({ params }: { params: Promise<{ portal: string }> }) {
  const p = portalById((await params).portal);
  if (!p) notFound();
  const feed = await getPortalFeed(p.id);
  return (
    <PageLayout
      title={`${PORTAL_DASHBOARD_CRUMBS[p.id]} Dashboard`}
      breadcrumb={[{ label: DASHBOARD_PAGE.crumb, href: CURRENT_DASHBOARD_PATH }, { label: PORTAL_DASHBOARD_CRUMBS[p.id] }]}
      description={p.summary}
    >
      <section aria-label={`${PORTAL_DASHBOARD_CRUMBS[p.id]} indicators`}>
        <div className="sa-container py-10 md:py-12">
          <PortalDashboardView portalId={p.id} feed={feed} />
        </div>
      </section>
    </PageLayout>
  );
}
