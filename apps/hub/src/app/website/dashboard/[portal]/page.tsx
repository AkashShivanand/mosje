import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { PortalDashboardView } from "@/components/kpi-dashboard/DashboardViewer";
import { PORTAL_DASHBOARDS, portalById } from "@/lib/kpi/register";
import { getPortalFeed } from "@/lib/kpi/feeds";
import { DASHBOARD_PAGE } from "@/lib/website-shared/dashboard";
import { PORTAL_DASHBOARD_CRUMBS } from "@/lib/website-shared/dashboard-links";
import { CURRENT_DASHBOARD_PATH } from "@/lib/website-shared/dashboard-version";
import { socialCard } from "@/lib/seo/social";
import "@/components/website-next/templates/media.css";

export function generateStaticParams() {
  return PORTAL_DASHBOARDS.map((p) => ({ portal: p.slug }));
}

export const dynamicParams = false;

/** Re-read the portal's live feed hourly, as the PM-AJAY dashboards do. */
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ portal: string }> }): Promise<Metadata> {
  const p = portalById((await params).portal);
  if (!p) return {};
  const title = `${PORTAL_DASHBOARD_CRUMBS[p.id]} Dashboard`;
  return {
    title: `${title} | Department of Social Justice & Empowerment`,
    description: p.summary,
    ...socialCard({ title, description: p.summary, url: `/website/dashboard/${p.slug}` }),
  };
}

/**
 * One scheme portal's public dashboard, in the 2026 design. The body is
 * `PortalKpiDashboard` via `PortalDashboardView`, shared with the Classic and DBIM designs and the officer view.
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
      <section className="wn-section" aria-label={`${PORTAL_DASHBOARD_CRUMBS[p.id]} indicators`}>
        <div className="sa-container">
          <PortalDashboardView portalId={p.id} feed={feed} />
        </div>
      </section>
    </PageLayout>
  );
}
