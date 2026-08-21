import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { getTenders, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Tenders & RFPs | DoSJE",
  description:
    "Active tenders, e-procurement notices, and requests for proposals (RFPs) issued by the Department of Social Justice & Empowerment.",
};

export default function TendersPage() {
  const tenders = getTenders().map((t) => ({
    slug: t.slug,
    title: t.title,
    date: t.date,
    category: t.category ?? "Tender Notice",
    sourceUrl: t.fileUrl ?? t.sourceUrl,
    fileSize: "PDF (Tender Document)",
  }));

  return (
    <DocumentCatalog
      title="Tenders &amp; Procurements"
      description="Active tenders, expressions of interest (EOI), and requests for proposals (RFP) issued by the Department of Social Justice & Empowerment."
      breadcrumb={[{ label: "Offerings", href: "/website/tenders" }, { label: "Tenders" }]}
      lastUpdated={getContentSyncedDate()}
      documents={tenders}
      categories={["Tender Notice", "RFP", "EOI", "Corrigendum"]}
    />
  );
}
