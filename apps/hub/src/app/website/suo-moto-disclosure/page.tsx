import type { Metadata } from "next";
import { ListingPage, type ListingColumn } from "@/components/website-next/templates/ListingPage";
import { tidyTitle } from "@/components/website-next/ui/records";
import { getContentSyncedDate, getSuoMotoDisclosures } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Suo Moto Disclosure";
const DESCRIPTION =
  "Proactive disclosures under Section 4 of the Right to Information Act, 2005 by the Department of Social Justice & Empowerment and its associated organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/suo-moto-disclosure" }),
};

/*
 * The fourteen disclosures the register holds. This page previously listed nine
 * rows typed into the file — titles and dates with no source and every link "#".
 */
const columns: ListingColumn[] = [
  { key: "title", label: "Title", type: "record", sortable: true },
  { key: "organisation", label: "Organisation", sortable: true },
  { key: "date", label: "Published", type: "date", sortable: true },
  { key: "document", label: "Document", type: "link", hrefKey: "fileUrl" },
];

export default function Page() {
  const rows = getSuoMotoDisclosures().map((d) => ({
    title: tidyTitle(d.title),
    href: `/website/suo-moto-disclosure/${d.slug}`,
    organisation: d.organisation,
    date: d.publishStart ?? d.date,
    fileUrl: d.fileUrl ?? d.externalUrl,
    fileType: d.fileType,
    fileSize: d.fileSize,
  }));

  return (
    <ListingPage
      title={TITLE}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      columns={columns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search disclosures by title"
      filters={[{ key: "organisation", label: "Organisation", allLabel: "All Organisations" }]}
      noun="disclosures"
      nounSingular="disclosure"
    />
  );
}
