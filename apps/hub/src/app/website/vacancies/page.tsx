import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website-next/templates/DocumentCatalog";
import { isArchived } from "@/components/website-next/ui/records";
import { getVacancies, getContentSyncedDate } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Vacancies";
const DESCRIPTION =
  "Recruitment notices and deputation circulars issued by the Department of Social Justice & Empowerment and its associated organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/vacancies" }),
};

/*
 * Current vacancies only: a circular published more than twelve months ago
 * moves to the Archives (issue MAN-06). The register publishes no closing date.
 * The classic page's invented size label ("PDF (Application Proforma
 * Included)") and category filter are gone.
 */
export default function VacanciesPage() {
  const vacancies = getVacancies()
    .filter((v) => !isArchived(v.date))
    .map((v) => ({ slug: v.slug, title: v.title, date: v.date, sourceUrl: v.fileUrl }));

  return (
    <DocumentCatalog
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Tenders & Vacancies" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
      documents={vacancies}
      detailBase="/website/vacancies"
      noun="vacancies"
      nounSingular="vacancy"
      archive={{ href: "/website/archives", text: "Vacancies published more than 12 months ago are kept in the Archives." }}
      emptyMessage="No vacancy has been published in the last 12 months. Earlier vacancies are in the Archives."
    />
  );
}
