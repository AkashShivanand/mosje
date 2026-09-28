import type { Metadata } from "next";
import { RecordLibrary } from "@/components/website/templates/RecordLibrary";
import { getCentralListOfObcs, getContentSyncedDate } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Central List of OBCs";
const DESCRIPTION =
  "Castes and communities notified in the Central List of Other Backward Classes, State by State, with the notification under which each entry was made.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/central-list-of-obcs" }),
};

/**
 * The Central List of OBCs — 2,667 entries. The register was ingested but no
 * page of this design listed it. A reader comes with a State and a name, so the
 * State stands in the table's category column and filter.
 */
export default function Page() {
  // Trimmed to what the table prints: this is a client table, and the full records
  // would ship every entry's taxonomy and file metadata to the browser twice over.
  const records = getCentralListOfObcs().map((r) => ({
    slug: r.slug,
    title: r.title,
    sourceUrl: r.sourceUrl,
    date: r.date,
    category: r.states?.join(", "),
    fileUrl: r.fileUrl,
    fileType: r.fileType,
    fileSize: r.fileSize,
  }));
  return (
    <RecordLibrary
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
      records={records}
      detailBase="/website/documents"
      noun="entries"
      nounSingular="entry"
      showCategory
      categoryLabel="State"
      showOrganisation={false}
      showPublishWindow={false}
    />
  );
}
