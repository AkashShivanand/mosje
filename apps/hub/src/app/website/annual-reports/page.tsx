import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Annual Reports | DoSJE",
  description:
    "Annual reports of the Department of Social Justice & Empowerment and the National Commission for Safai Karamcharis.",
};

export default function AnnualReportsPage() {
  const docs = getDocumentsByType("Annual Reports").map((d) => ({
    slug: d.slug,
    title: d.title,
    date: d.date,
    category: "Annual Report",
    sourceUrl: d.fileUrl ?? d.sourceUrl,
    fileSize: "PDF (Approx. 5-15 MB)",
  }));

  return (
    <DocumentCatalog
      title="Annual Reports"
      description="Access official Annual Reports of the Department of Social Justice & Empowerment and associated national statutory commissions."
      breadcrumb={[{ label: "Documents", href: "/website/annual-reports" }, { label: "Annual Reports" }]}
      lastUpdated={getContentSyncedDate()}
      documents={docs}
      categories={["Annual Report"]}
    />
  );
}
