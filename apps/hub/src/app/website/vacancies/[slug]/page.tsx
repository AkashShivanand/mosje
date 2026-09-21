import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordDetail } from "@/components/website-next/templates/RecordDetail";
import { getContentSyncedDate, getVacancies, getVacancy } from "@/lib/website/content";
import { facts } from "@/lib/website/record-facts";
import { formatDate } from "@/components/website-next/ui/format";
import { socialCard } from "@/lib/seo/social";
import { isArchived } from "@/components/website-next/ui/records";

/** 163 vacancies — every one is prerendered. */
export function generateStaticParams() {
  return getVacancies().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const vacancy = getVacancy(slug);
  if (!vacancy) return { title: "Vacancy Not Found | Department of Social Justice & Empowerment" };
  const description =
    "A vacancy circulated by the Department of Social Justice & Empowerment or one of its associated organisations.";
  return {
    title: `${vacancy.title} | Department of Social Justice & Empowerment`,
    description,
    ...socialCard({ title: vacancy.title, description, url: `/website/vacancies/${vacancy.slug}` }),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vacancy = getVacancy(slug);
  if (!vacancy) notFound();
  /* Published more than 12 months ago: listed in the Archives, not on the Vacancies page (MAN-06). */
  const archived = isArchived(vacancy.date);

  return (
    <RecordDetail
      title={vacancy.title}
      badge="Vacancy"
      breadcrumb={[
        { label: "Tenders & Vacancies" },
        archived ? { label: "Archives", href: "/website/archives" } : { label: "Vacancies", href: "/website/vacancies" },
        { label: vacancy.title },
      ]}
      backHref={archived ? "/website/archives" : "/website/vacancies"}
      backLabel={archived ? "Back to Archives" : "Back to Vacancies"}
      lastUpdated={getContentSyncedDate()}
      facts={facts([
        { term: "Category", value: vacancy.category },
        { term: "Published", value: formatDate(vacancy.date) },
      ])}
      files={vacancy.fileUrl ? [{ label: "Open Vacancy Circular", url: vacancy.fileUrl }] : []}
    />
  );
}
