import type { Metadata } from "next";
import { RecordLibrary } from "@/components/website-next/templates/RecordLibrary";
import { getContentSyncedDate, getDocumentsOfType } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Annual Reports";
const DESCRIPTION =
  "Annual reports of the Department of Social Justice & Empowerment and of the commissions, corporations and autonomous bodies under it.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/annual-reports" }),
};

/*
 * The register files five NBCFDC "MGT-7" company returns under Annual Reports.
 * An MGT-7 is the annual return a company files under the Companies Act, not
 * an annual report; it stays listed, marked as what it is and separable by the
 * Type filter.
 */
const kindOf = (r: { title: string }) => (/\bMGT-?7\b/i.test(r.title) ? "Annual Return (MGT-7)" : undefined);

export default function Page() {
  return (
    <RecordLibrary
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
      records={getDocumentsOfType("Annual Reports")}
      detailBase="/website/documents"
      noun="reports"
      nounSingular="report"
      /* The register's `year` is the upload year; the year a report covers is in its title. */
      yearFromTitle
      leadOrganisation="MoSJE"
      kindOf={kindOf}
      defaultKind="Annual Report"
    />
  );
}
