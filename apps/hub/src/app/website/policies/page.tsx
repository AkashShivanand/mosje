import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Policies | DoSJE",
  description:
    "National policies, draft policy frameworks, and guidelines formulated by the Department of Social Justice & Empowerment.",
};

export default function PoliciesPage() {
  const docs = getDocumentsByType("Policies").map((d) => ({
    slug: d.slug,
    title: d.title,
    date: d.date,
    category: "National Policy",
    sourceUrl: d.fileUrl ?? d.sourceUrl,
    fileSize: "PDF Document",
  }));

  return (
    <DocumentCatalog
      title="National Policies & Frameworks"
      description="National policies, draft guidelines, and action plans formulated for the empowerment of targeted citizen groups."
      breadcrumb={[{ label: "Documents", href: "/website/policies" }, { label: "Policies" }]}
      lastUpdated={getContentSyncedDate()}
      documents={docs}
      categories={["National Policy"]}
    />
  );
}
