import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website-next/templates/DocumentCatalog";
import { isArchived } from "@/components/website-next/ui/records";
import { getTenders, getContentSyncedDate } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Tenders";
const DESCRIPTION =
  "Tender notices, expressions of interest and requests for proposal issued by the Department of Social Justice & Empowerment and its associated organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/tenders" }),
};

/*
 * Current tenders only: a notice published more than twelve months ago moves to
 * the Archives (issue MAN-06). The register publishes no closing date, so the
 * publish date is the only date the rule can read.
 *
 * The classic page gave every row an invented size ("PDF (Tender Document)")
 * and a filter of four categories no record carries; both are gone. The file
 * type is read from the file itself, and a filter appears only where the rows
 * give it more than one option.
 */
export default function TendersPage() {
  const tenders = getTenders()
    .filter((t) => !isArchived(t.date))
    .map((t) => ({ slug: t.slug, title: t.title, date: t.date, sourceUrl: t.fileUrl }));

  return (
    <DocumentCatalog
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Tenders & Vacancies" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
      documents={tenders}
      detailBase="/website/tenders"
      noun="tenders"
      nounSingular="tender"
      archive={{ href: "/website/archives", text: "Tenders published more than 12 months ago are kept in the Archives." }}
      emptyMessage="No tender has been published in the last 12 months. Earlier tenders are in the Archives."
    />
  );
}
