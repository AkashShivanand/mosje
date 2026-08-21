import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Statutory Advices | DoSJE",
  description:
    "Statutory advices tendered by the National Commission for Backward Classes (NCBC) and advisory bodies.",
};

export default function AdvicesPage() {
  const docs = getDocumentsByType("Advices").map((d) => ({
    slug: d.slug,
    title: d.title,
    date: d.date,
    category: "Statutory Advice",
    sourceUrl: d.fileUrl ?? d.sourceUrl,
    fileSize: "PDF Document",
  }));

  return (
    <DocumentCatalog
      title="Statutory Advices"
      description="Statutory advices and recommendations tendered by advisory commissions and expert appraisal committees."
      breadcrumb={[{ label: "Documents", href: "/website/advices" }, { label: "Advices" }]}
      lastUpdated={getContentSyncedDate()}
      documents={docs}
      categories={["Statutory Advice"]}
    />
  );
}
