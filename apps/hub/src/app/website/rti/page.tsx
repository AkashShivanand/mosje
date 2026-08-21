import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Right to Information (RTI) | DoSJE",
  description:
    "Proactive disclosures under Section 4(1)(b) of the RTI Act, 2005, CPIO directory, and appellate authority details.",
};

export default function RtiPage() {
  const docs = getDocumentsByType("RTI").map((d) => ({
    slug: d.slug,
    title: d.title,
    date: d.date,
    category: "RTI Disclosure",
    sourceUrl: d.fileUrl ?? d.sourceUrl,
    fileSize: "PDF Document",
  }));

  return (
    <DocumentCatalog
      title="Right to Information (RTI)"
      description="Proactive disclosures, CPIO details, and statutory reporting under Section 4(1)(b) of the Right to Information Act, 2005."
      breadcrumb={[{ label: "Documents", href: "/website/rti" }, { label: "RTI" }]}
      lastUpdated={getContentSyncedDate()}
      documents={docs}
      categories={["RTI Disclosure"]}
    />
  );
}
