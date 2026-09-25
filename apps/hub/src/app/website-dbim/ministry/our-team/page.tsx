import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { DbimTeamChart } from "@/components/website-dbim/ministry/TeamChart";
import { DbimTeamOffice } from "@/components/website-dbim/ministry/TeamOffice";
import "@/components/website-dbim/ministry/ministry.css";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { teamOffices } from "@/lib/website-dbim/ministry";

export const metadata: Metadata = {
  title: "Our Team | Department of Social Justice and Empowerment",
  description: "The Ministers and officers of the Department of Social Justice and Empowerment, office by office, with their contact details.",
};

/** Ministry › Our Team — the Ministers' chart, then every office's officers (spec §2). */
export default function DbimOurTeamPage() {
  const offices = teamOffices();
  return (
    <DbimPage title="Our Team" crumbs={[{ label: "Ministry", path: "/ministry" }]} path="/ministry/our-team" tabs={DBIM_MENU[0]!.children}>
      <div className="db-min-team">
        <DbimTeamChart />
        {offices.length === 0 ? <DbimEmptyState /> : offices.map((o) => <DbimTeamOffice key={o.id} office={o} />)}
      </div>
    </DbimPage>
  );
}
