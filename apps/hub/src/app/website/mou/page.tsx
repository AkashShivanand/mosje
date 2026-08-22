import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Memorandums of Understanding (MOU) | DoSJE",
  description:
    "MOUs and bilateral agreements signed between the Department of Social Justice & Empowerment and partner organizations.",
};

export default function MouPage() {
  const docs = getDocumentsByType("MOU").map((d) => ({
    slug: d.slug,
    title: d.title,
    date: d.date,
    category: "MOU / Agreement",
    sourceUrl: d.fileUrl ?? d.sourceUrl,
    fileSize: "PDF Document",
  }));

  return (
    <DocumentCatalog
      title="Memorandums of Understanding (MoU)"
      description="Official MoUs, bilateral agreements, and institutional partnerships signed by the Department."
      breadcrumb={[{ label: "Documents", href: "/website/mou" }, { label: "MOU" }]}
      lastUpdated={getContentSyncedDate()}
      documents={docs}
      categories={["MOU / Agreement"]}
    />
  );
}
