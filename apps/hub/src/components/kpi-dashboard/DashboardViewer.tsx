"use client";

import * as React from "react";
import { Badge, Button, CardState, DataTable, KpiRow, SectionTitle } from "@mosje/design-system";
import { canSeePortal, KPI_COLLECTION, KPI_COLLECTION_AS_ON, type CollectionRow, type OfficerRole } from "@/lib/kpi/access";
import type { PortalFeed } from "@/lib/kpi/live";
import type { PortalId } from "@/lib/kpi/types";
import { setViewer, useDashboardViewer } from "@/lib/kpi/viewer";
import { PORTAL_DASHBOARD_CRUMBS } from "@/lib/website-shared/dashboard-links";
import { PortalKpiDashboard } from "./PortalKpiDashboard";
import "./kpi-dashboard.css";

/**
 * The website's Dashboard, drawn for whoever it is being viewed as (`lib/kpi/viewer.ts`):
 * the public by default, or an officer role picked in the demo rail's View As tab.
 *
 * DS Audit: Badge ✅ · Button ✅ · CardState ✅ · DataTable ✅ · KpiRow ✅ · SectionTitle ✅ ·
 * PortalKpiDashboard (app) ✅.
 *
 * AN OFFICER VIEW ALWAYS SAYS SO, on the page and not only in the rail. A screenshot of a
 * State Nodal Officer's figures must not pass for the public page.
 */

function areaOf(role: OfficerRole): string {
  return role.area.district ? `${role.area.district}, ${role.area.state}` : (role.area.state ?? "All India");
}

/** "Officer View · State Nodal Officer · Maharashtra", with the way back to the public view. */
export function ViewerNotice({ role }: { role: OfficerRole }) {
  return (
    <div className="kd-viewer" role="note">
      <Badge status="info" size="sm">
        Officer View
      </Badge>
      <span className="kd-viewer__who">
        {/* A State or District role already names its area; the others are All India. */}
        {role.label} · {role.office}
        {role.area.state ? "" : ` · ${areaOf(role)}`}
      </span>
      <Button appearance="outlined" size="sm" onClick={() => setViewer(null)}>
        Show Public View
      </Button>
    </div>
  );
}

/** One portal's dashboard page body: public, the role's officer view, or "not in this view". */
export function PortalDashboardView({ portalId, feed }: { portalId: PortalId; feed?: PortalFeed | null }) {
  const role = useDashboardViewer();
  if (!role) return <PortalKpiDashboard portalId={portalId} audience="public" sectionLevel={2} feed={feed} />;
  if (!canSeePortal(role, portalId)) {
    return (
      <div className="kd">
        <ViewerNotice role={role} />
        <CardState
          kind="restricted"
          title={`Not Part of the ${role.label} View`}
          description={`The ${PORTAL_DASHBOARD_CRUMBS[portalId]} dashboard is not assigned to this role. The public view shows its public indicators.`}
          action={
            <Button appearance="outlined" size="sm" onClick={() => setViewer(null)}>
              Show Public View
            </Button>
          }
        />
      </div>
    );
  }
  return (
    <div className="kd">
      <ViewerNotice role={role} />
      <PortalKpiDashboard key={role.id} portalId={portalId} audience="officer" ceiling={role.area} allowDistrict sectionLevel={2} feed={feed} />
    </div>
  );
}

/** Which portals the list on the Dashboard page shows: all for the public, the role's for an officer. */
export function useVisiblePortals<T extends { slug: PortalId }>(items: T[]): { items: T[]; role: OfficerRole | undefined } {
  const role = useDashboardViewer();
  return { items: role ? items.filter((i) => canSeePortal(role, i.slug)) : items, role };
}

/**
 * The Ministry's KPI Collection Status — the proforma tracker tab, real — on the Dashboard
 * page while it is viewed as the Ministry, and nowhere else.
 */
export function MinistryCollection({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const role = useDashboardViewer();
  if (role?.level !== "ministry") return null;
  const received = KPI_COLLECTION.filter((c) => c.received).length;
  return (
    <section className="kd-block" aria-labelledby="kd-collection-title">
      <SectionTitle
        as={headingLevel}
        headingId="kd-collection-title"
        title="KPI Collection Status"
        description={`From the KPI collection tracker, as on ${KPI_COLLECTION_AS_ON}.`}
      />
      <KpiRow
        items={[
          { key: "all", label: "Portals and Bodies", value: String(KPI_COLLECTION.length) },
          { key: "received", label: "KPIs Received", value: String(received), tone: "success" },
          { key: "awaited", label: "KPIs Awaited", value: String(KPI_COLLECTION.length - received), tone: "warning" },
        ]}
      />
      <DataTable<CollectionRow & { _key: string } & Record<string, unknown>>
        caption="KPI Collection Status"
        total={KPI_COLLECTION.length}
        pageSizes={[10, 25]}
        columns={[
          { key: "phase", header: "Phase", render: (r) => `Phase ${r.phase}`, sortable: true, sortValue: (r) => r.phase },
          { key: "name", header: "Department / Portal", render: (r) => r.name, sortable: true, sortValue: (r) => r.name },
          {
            key: "received",
            header: "KPIs Received",
            render: (r) => (
              <Badge status={r.received ? "success" : "warning"} size="sm">
                {r.received ? "Received" : "Awaited"}
              </Badge>
            ),
            sortable: true,
            sortValue: (r) => (r.received ? 0 : 1),
          },
          { key: "date", header: "Date Received", render: (r) => r.date ?? "—" },
          { key: "remarks", header: "Remarks", render: (r) => r.remarks ?? "" },
        ]}
        data={KPI_COLLECTION.map((c) => ({ ...c, _key: c.name }))}
      />
    </section>
  );
}
