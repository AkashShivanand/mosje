"use client";

import { DbimDashboardTiles } from "@/components/website-dbim/ministry/DashboardTiles";
import { ViewerNotice, useVisiblePortals } from "@/components/kpi-dashboard/DashboardViewer";
import type { DbimDashboardTile } from "@/lib/website-dbim/ministry";
import type { PortalId } from "@/lib/kpi/types";

/**
 * The DBIM Dashboard page's portal tiles, held to the role the Dashboard is viewed as
 * (the demo rail's View As tab). The tiles are the Our Performance tiles' own markup.
 */
export function DbimPortalTiles({ tiles, title, headingId }: { tiles: DbimDashboardTile[]; title: string; headingId: string }) {
  const keyed = tiles.map((t) => ({ ...t, slug: t.href.split("/").pop() as PortalId }));
  const { items, role } = useVisiblePortals(keyed);
  return (
    <>
      {role ? <ViewerNotice role={role} /> : null}
      <DbimDashboardTiles tiles={items} title={title} headingId={headingId} />
    </>
  );
}
