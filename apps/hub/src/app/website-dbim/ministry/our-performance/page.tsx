import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimDashboardTiles } from "@/components/website-dbim/ministry/DashboardTiles";
import "@/components/website-dbim/ministry/ministry.css";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { DBIM_DASHBOARDS } from "@/lib/website-dbim/ministry";

export const metadata: Metadata = {
  title: "Our Performance | Department of Social Justice and Empowerment",
  description: "Performance dashboards of the Department of Social Justice and Empowerment.",
};

/** Ministry › Our Performance (spec §5). */
export default function DbimOurPerformancePage() {
  return (
    <DbimPage title="Our Performance" crumbs={[{ label: "Ministry", path: "/ministry" }]} path="/ministry/our-performance" tabs={DBIM_MENU[0]!.children}>
      <DbimDashboardTiles tiles={DBIM_DASHBOARDS} />
    </DbimPage>
  );
}
