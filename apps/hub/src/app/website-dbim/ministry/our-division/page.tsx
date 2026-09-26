import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimCardGrid } from "@/components/website-dbim/ministry/CardGrid";
import "@/components/website-dbim/ministry/ministry.css";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { divisionCards } from "@/lib/website-dbim/ministry";

export const metadata: Metadata = {
  title: "Our Division | Department of Social Justice and Empowerment",
  description: "The divisions of the Department of Social Justice and Empowerment.",
};

/** Ministry › Our Division (spec §3). */
export default function DbimOurDivisionPage() {
  return (
    <DbimPage title="Our Division" crumbs={[{ label: "Ministry", path: "/ministry" }]} path="/ministry/our-division" tabs={DBIM_MENU[0]!.children}>
      <DbimCardGrid items={divisionCards()} variant="division" label="Divisions" />
    </DbimPage>
  );
}
