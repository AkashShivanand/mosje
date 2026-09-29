import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimSchemeGrid } from "@/components/website-dbim/offerings/SchemeGrid";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { DBIM_SCHEME_GROUPS, dbimSchemeCards } from "@/lib/website-dbim/offerings";
import "@/components/website-dbim/offerings/offerings.css";

export const metadata: Metadata = {
  title: "Schemes and Services | Department of Social Justice and Empowerment",
};

/** Offerings › Schemes and Services — the live website's listing (lib/website-shared/scheme-listing.ts). */
export default function DbimSchemesPage() {
  return (
    <DbimPage title="Schemes and Services" crumbs={[{ label: "Offerings", path: "/offerings" }]} path="/offerings" tabs={DBIM_MENU[1]!.children}>
      <DbimSchemeGrid cards={dbimSchemeCards()} groups={DBIM_SCHEME_GROUPS} />
    </DbimPage>
  );
}
