import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimTenderTable } from "@/components/website-dbim/offerings/TenderTable";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { dbimTenders } from "@/lib/website-dbim/offerings";
import "@/components/website-dbim/offerings/offerings.css";

export const metadata: Metadata = {
  title: "Tenders | Department of Social Justice and Empowerment",
};

/** Offerings › Tenders — notices published in the last twelve months; older ones are in the Archives. */
export default function DbimTendersPage() {
  return (
    <DbimPage title="Tenders" crumbs={[{ label: "Offerings", path: "/offerings" }]} path="/offerings/tenders" tabs={DBIM_MENU[1]!.children}>
      <DbimTenderTable tenders={dbimTenders()} />
    </DbimPage>
  );
}
