import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { getVacancies, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Vacancies & Recruitments | DoSJE",
  description:
    "Current recruitment notifications, deputation circulars, and job openings under the Department of Social Justice & Empowerment.",
};

export default function VacanciesPage() {
  const vacancies = getVacancies().map((v) => ({
    slug: v.slug,
    title: v.title,
    date: v.date,
    category: v.category ?? "Recruitment Circular",
    sourceUrl: v.fileUrl ?? v.sourceUrl,
    fileSize: "PDF (Application Proforma Included)",
  }));

  return (
    <DocumentCatalog
      title="Vacancies &amp; Career Opportunities"
      description="Latest recruitment notifications, deputation circulars, and consultant openings across the Department and its autonomous organizations."
      breadcrumb={[{ label: "Offerings", href: "/website/vacancies" }, { label: "Vacancies" }]}
      lastUpdated={getContentSyncedDate()}
      documents={vacancies}
      categories={["Recruitment Circular", "Deputation", "Consultant"]}
    />
  );
}
