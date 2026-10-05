"use client";

import Link from "next/link";
import { ActionTile, OrgLogo, PortalCard } from "@mosje/design-system";
import { PMAJAY_DASHBOARD_LINK, WEBSITE_PORTAL_DASHBOARDS } from "@/lib/website-shared/dashboard";
import { PMAJAY_ORG_PATH, PORTAL_DASHBOARD_CODES } from "@/lib/website-shared/dashboard-links";
import { useVisiblePortals, ViewerNotice } from "./DashboardViewer";
import "./kpi-dashboard.css";

/**
 * Dashboards by Portal — the list on the website's Dashboard page, New and Classic.
 * (DBIM draws the same list as its Our Performance tiles; DBIM 3.0 §A.5.1.4.)
 *
 * A client component because `PortalCard` and `ActionTile` are, and a router link is a
 * function that cannot cross the server boundary as a prop.
 *
 * Viewed as an officer role, the list holds that role's portals only, under the Officer
 * View notice; PM-AJAY (not in the KPI register) is listed for the public and the Ministry.
 *
 * DS Audit: PortalCard ✅ (New) · ActionTile + OrgLogo ✅ (Classic).
 */
export function PortalDashboardList({ design }: { design: "new" | "classic" }) {
  const { items: visible, role } = useVisiblePortals(WEBSITE_PORTAL_DASHBOARDS);
  const items = [
    ...visible.map((p) => ({
      key: p.slug,
      href: `/website${p.href}`,
      code: PORTAL_DASHBOARD_CODES[p.slug],
      name: p.name,
      path: p.logoPath,
      summary: p.summary,
      portal: p.portal,
    })),
    ...(role && role.level !== "ministry" ? [] : [{
      key: "pm-ajay",
      href: PMAJAY_ORG_PATH,
      code: "PM-AJAY",
      name: PMAJAY_DASHBOARD_LINK.name,
      path: PMAJAY_DASHBOARD_LINK.logoPath,
      summary: PMAJAY_DASHBOARD_LINK.summary,
      portal: PMAJAY_DASHBOARD_LINK.portal,
    }]),
  ];

  return (
    <>
    {role ? <ViewerNotice role={role} /> : null}
    <ul className="kd-portals">
      {items.map((p) => (
        <li key={p.key}>
          {design === "new" ? (
            <PortalCard
              linkAs={Link}
              href={p.href}
              code={p.code}
              name={p.name}
              path={p.path}
              description={p.summary}
              category={p.portal}
              variant="detailed"
              ctaLabel="View Dashboard"
            />
          ) : (
            <ActionTile
              linkAs={Link}
              href={p.href}
              title={p.name}
              description={p.summary}
              media={<OrgLogo path={p.path} size="md" />}
              trailing
            />
          )}
        </li>
      ))}
    </ul>
    </>
  );
}
