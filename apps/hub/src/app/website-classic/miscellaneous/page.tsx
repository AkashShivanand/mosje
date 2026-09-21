import type { Metadata } from "next";
import { RecordLibrary } from "@/components/website/templates/RecordLibrary";
import { getContentSyncedDate, getMiscellaneousDocuments } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Miscellaneous";
const DESCRIPTION =
  "Documents published by the Department of Social Justice & Empowerment and its associated organisations that do not fall under any of the headings above — hearings and proceedings, tour reports, results, announcements and committee records.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/miscellaneous" }),
};

/**
 * The catch-all, defined as the department defines it: every document that is
 * not on a listing page of its own. It carries the Type column the live page
 * carries, because "Miscellaneous" tells a reader nothing and the type does.
 */
export default function Page() {
  return (
    <RecordLibrary
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
      records={getMiscellaneousDocuments()}
      detailBase="/website/documents"
      noun="documents"
      nounSingular="document"
      showCategory
    />
  );
}
