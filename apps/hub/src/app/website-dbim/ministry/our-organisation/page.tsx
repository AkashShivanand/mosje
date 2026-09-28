import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimCardGrid } from "@/components/website-dbim/ministry/CardGrid";
import "@/components/website-dbim/ministry/ministry.css";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { organisationCards } from "@/lib/website-dbim/ministry";

export const metadata: Metadata = {
  title: "Our Organisation | Department of Social Justice and Empowerment",
  description: "The commissions, corporations, foundations and autonomous bodies of the Department of Social Justice and Empowerment.",
};

/**
 * Ministry › Our Organisation — every body on one list, with a Category filter and each
 * body's mark, as MeitY's Our Organisations draws it (spec §4). The scheme portals have
 * a tab of their own.
 */
export default function DbimOurOrganisationPage() {
  return (
    <DbimPage title="Our Organisation" crumbs={[{ label: "Ministry", path: "/ministry" }]} path="/ministry/our-organisation" tabs={DBIM_MENU[0]!.children}>
      <DbimCardGrid items={organisationCards()} variant="organisation" label="Organisations" categoryFilter />
    </DbimPage>
  );
}
