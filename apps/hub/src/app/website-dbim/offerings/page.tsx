import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimSchemeGrid } from "@/components/website-dbim/offerings/SchemeGrid";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { DBIM_APPLICANT_TYPES, dbimApplicantType } from "@/lib/website-dbim/applicants";
import { DBIM_SCHEME_GROUPS, dbimSchemeCards } from "@/lib/website-dbim/offerings";
import "@/components/website-dbim/offerings/offerings.css";

export const metadata: Metadata = {
  title: "Schemes and Services | Department of Social Justice and Empowerment",
};

/**
 * Offerings › Schemes and Services — the live website's listing (lib/website-shared/scheme-listing.ts).
 * `?applicant=<id>` opens it with that Type of Applicant chosen: the home page's personas
 * link here. An id the list does not know is ignored, not shown as an empty result.
 */
export default async function DbimSchemesPage({ searchParams }: { searchParams: Promise<{ applicant?: string | string[] }> }) {
  const { applicant } = await searchParams;
  const chosen = dbimApplicantType(typeof applicant === "string" ? applicant : undefined);
  return (
    <DbimPage title="Schemes and Services" crumbs={[{ label: "Offerings", path: "/offerings" }]} path="/offerings" tabs={DBIM_MENU[1]!.children}>
      <DbimSchemeGrid
        cards={dbimSchemeCards()}
        groups={DBIM_SCHEME_GROUPS}
        applicants={DBIM_APPLICANT_TYPES.map((a) => ({ value: a.id, label: a.label }))}
        applicant={chosen?.id}
      />
    </DbimPage>
  );
}
