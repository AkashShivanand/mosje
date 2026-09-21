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
    />
  );
}
