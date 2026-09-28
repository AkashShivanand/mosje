import type { Metadata } from "next";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { RecordTable, type RecordColumn } from "@/components/website-next/ui/RecordTable";
import { getCentralListOfObcs, getContentSyncedDate, routeSlug } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";
import "@/components/website-next/templates/records.css";

const TITLE = "Central List of OBCs";
const DESCRIPTION =
  "Castes and communities notified in the Central List of Other Backward Classes, State by State, with the notification under which each entry was made.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/central-list-of-obcs" }),
};

const columns: RecordColumn[] = [
  { key: "title", label: "Caste / Community", type: "record", sortable: true },
  { key: "state", label: "State / UT", sortable: true },
  { key: "entry", label: "Entry No.", type: "number", sortable: true },
  { key: "document", label: "Notification", type: "link", hrefKey: "fileUrl" },
];

/**
 * The Central List of OBCs — 2,667 entries, one per caste or community per State.
 *
 * The register was ingested and published by the DBIM design only; this design
 * had no page for it. A reader comes to it with a State and a name, so those are
 * the filter and the search, and the rows stand in the list's own order: State,
 * then entry number.
 *
 * WEIGHT: the rows are trimmed to what the table prints before they reach the
 * client — about 67 KB gzipped for the whole list, measured on the DBIM page,
 * which ships the same rows. The whole list is what a name search needs.
 */
export default function Page() {
  const rows = getCentralListOfObcs()
    .map((r) => ({
      title: r.title,
      href: `/website/documents/${routeSlug(r.slug)}`,
      state: r.states?.join(", "),
      entry: r.serialNumber && /^\d+$/.test(r.serialNumber) ? Number(r.serialNumber) : r.serialNumber,
      fileUrl: r.fileUrl,
    }))
    .sort(
      (a, b) =>
        // An entry the register files under no State goes last, not first.
        Number(!a.state) - Number(!b.state) ||
        (a.state ?? "").localeCompare(b.state ?? "", "en-IN") ||
        String(a.entry ?? "").localeCompare(String(b.entry ?? ""), "en-IN", { numeric: true }),
    );

  return (
    <PageLayout
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
    >
      <div className="wn-section">
        <div className="sa-container">
          <RecordTable
            caption={TITLE}
            columns={columns}
            rows={rows}
            filters={[{ key: "state", label: "State / UT", allLabel: "All States and UTs" }]}
            searchKeys={["title"]}
            searchPlaceholder="Search by caste or community"
            noun="entries"
            nounSingular="entry"
            layout="stack"
            emptyMessage="The Department has not published the Central List of OBCs."
          />
        </div>
      </div>
    </PageLayout>
  );
}
