import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Forms & Templates | DoSJE",
  description:
    "Official application forms, proformas, and reporting templates published by the Department of Social Justice & Empowerment.",
};

export default function FormsTemplatesPage() {
  const docs = getDocumentsByType("Forms & Templates").map((d) => ({
    slug: d.slug,
    title: d.title,
    date: d.date,
    category: "Proforma / Application Form",
    sourceUrl: d.fileUrl ?? d.sourceUrl,
    fileSize: "PDF / Word Format",
  }));

  return (
    <DocumentCatalog
      title="Forms & Templates"
      description="Download application forms, verification proformas, and reporting templates for schemes and grant-in-aid assistance."
      breadcrumb={[{ label: "Documents", href: "/website/forms-templates" }, { label: "Forms & Templates" }]}
      lastUpdated={getContentSyncedDate()}
      documents={docs}
      categories={["Proforma / Application Form"]}
    />
  );
}
