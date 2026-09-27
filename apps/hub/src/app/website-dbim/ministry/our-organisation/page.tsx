import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimCardGrid } from "@/components/website-dbim/ministry/CardGrid";
import "@/components/website-dbim/ministry/ministry.css";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { organisationTypeCards } from "@/lib/website-dbim/ministry";

export const metadata: Metadata = {
  title: "Our Organisation | Department of Social Justice and Empowerment",
  description: "The commissions, corporations, foundations and scheme portals of the Department of Social Justice and Empowerment.",
};

/** Ministry › Our Organisation — one card per type of body (spec §4). */
export default function DbimOurOrganisationPage() {
  return (
    <DbimPage title="Our Organisation" crumbs={[{ label: "Ministry", path: "/ministry" }]} path="/ministry/our-organisation" tabs={DBIM_MENU[0]!.children}>
      <DbimCardGrid items={organisationTypeCards()} variant="organisation" label="Organisation Types" />
    </DbimPage>
  );
}
