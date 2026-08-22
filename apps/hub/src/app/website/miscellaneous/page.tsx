import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Miscellaneous Documents | DoSJE",
  description:
    "General notices, administrative orders, and miscellaneous archival documents from the Department of Social Justice & Empowerment.",
};

export default function MiscellaneousPage() {
  const docs = getDocumentsByType("Miscellaneous").map((d) => ({
    slug: d.slug,
    title: d.title,
    date: d.date,
    category: "General Document",
    sourceUrl: d.fileUrl ?? d.sourceUrl,
    fileSize: "PDF",
  }));

  return (
    <DocumentCatalog
      title="Miscellaneous Documents"
      description="General administrative archives, public notices, and institutional documentation."
      breadcrumb={[{ label: "Documents", href: "/website/miscellaneous" }, { label: "Miscellaneous" }]}
      lastUpdated={getContentSyncedDate()}
      documents={docs}
      categories={["General Document"]}
    />
  );
}
