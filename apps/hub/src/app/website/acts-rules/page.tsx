import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Acts & Rules | DoSJE",
  description:
    "Acts, rules and statutory regulations administered by the Department of Social Justice & Empowerment.",
};

export default function ActsRulesPage() {
  const docs = getDocumentsByType("Acts & Rules").map((d) => ({
    slug: d.slug,
    title: d.title,
    date: d.date,
    category: "Statutory Acts & Rules",
    sourceUrl: d.fileUrl ?? d.sourceUrl,
    fileSize: "PDF (Official Gazette)",
  }));

  return (
    <DocumentCatalog
      title="Acts & Rules"
      description="Official Acts, Rules, and statutory regulations administered by the Department of Social Justice & Empowerment."
      breadcrumb={[{ label: "Documents", href: "/website/acts-rules" }, { label: "Acts & Rules" }]}
      lastUpdated={getContentSyncedDate()}
      documents={docs}
      categories={["Statutory Acts & Rules"]}
    />
  );
}
