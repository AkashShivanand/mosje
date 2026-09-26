import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { localiseDocumentUrl } from "@/lib/website/sample-documents";

export const metadata: Metadata = {
  title: "Citizen Charter | DoSJE",
  description: "The Citizen Charter of the Ministry of Social Justice & Empowerment.",
};

/*
 * The one document dosje.gov.in/documents/citizen-charter/ lists (read
 * 2026-09-17): Organisation MoSJE, Year 2024, published 26/01/2024. The link
 * resolves to a local sample, like every document link on this website — see
 * `lib/website/sample-documents.ts`.
 */
const SOURCE =
  "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/09/Citizen-Charter-2016-17-new1.pdf";

export default function CitizenCharterPage() {
  return (
    <DocumentCatalog
      title="Citizen Charter"
      description="The Citizen Charter of the Ministry of Social Justice & Empowerment."
      breadcrumb={[{ label: "Department" }, { label: "Citizen Charter" }]}
      lastUpdated="17 Sep 2026"
      documents={[
        {
          slug: "citizen-charter",
          title: "Citizen Charter",
          category: "Citizen Charter",
          date: "2024-01-26",
          sourceUrl: localiseDocumentUrl(SOURCE, "Citizen Charter"),
          fileSize: "PDF (738 KB)",
        },
      ]}
      categories={["Citizen Charter"]}
    />
  );
}
