import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Publications | DoSJE",
  description:
    "Official books, statistical handbooks, research reports, and newsletters published by the Department of Social Justice & Empowerment.",
};

export default function PublicationsPage() {
  const docs = getDocumentsByType("Publications").map((d) => ({
    slug: d.slug,
    title: d.title,
    date: d.date,
    category: "Publication / Research Report",
    sourceUrl: d.fileUrl ?? d.sourceUrl,
    fileSize: "PDF Document",
  }));

  return (
    <DocumentCatalog
      title="Publications &amp; Reports"
      description="Books, research monographs, statistical handbooks, and journals published by the Department."
      breadcrumb={[{ label: "Documents", href: "/website/publications" }, { label: "Publications" }]}
      lastUpdated={getContentSyncedDate()}
      documents={docs}
      categories={["Publication / Research Report"]}
    />
  );
}
