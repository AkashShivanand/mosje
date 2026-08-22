import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Public Notices | DoSJE",
  description:
    "Public notices, press advisories, and administrative announcements from the Department of Social Justice & Empowerment.",
};

export default function NoticesPage() {
  const docs = getDocumentsByType("Notices").map((d) => ({
    slug: d.slug,
    title: d.title,
    date: d.date,
    category: "Public Notice",
    sourceUrl: d.fileUrl ?? d.sourceUrl,
    fileSize: "PDF",
  }));

  return (
    <DocumentCatalog
      title="Public Notices"
      description="Important public advisories, announcements, and notices released by the Department of Social Justice & Empowerment."
      breadcrumb={[{ label: "Documents", href: "/website/notices" }, { label: "Notices" }]}
      lastUpdated={getContentSyncedDate()}
      documents={docs}
      categories={["Public Notice"]}
    />
  );
}
