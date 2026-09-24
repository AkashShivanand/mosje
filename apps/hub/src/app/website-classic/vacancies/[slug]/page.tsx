import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordDetail } from "@/components/website/templates/RecordDetail";
import { getContentSyncedDate, getVacancies, getVacancy } from "@/lib/website/content";
import { facts, humanDate } from "@/lib/website/record-facts";
import { socialCard } from "@/lib/seo/social";

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

  return (
    <RecordDetail
      title={vacancy.title}
      badge="Vacancy"
      breadcrumb={[
        { label: "Offerings" },
        { label: "Vacancies", href: "/website/vacancies" },
        { label: vacancy.title },
      ]}
      backHref="/website/vacancies"
      backLabel="Back to Vacancies"
      lastUpdated={getContentSyncedDate()}
      facts={facts([
        { term: "Category", value: vacancy.category },
        { term: "Published", value: humanDate(vacancy.date) },
      ])}
      files={vacancy.fileUrl ? [{ label: "Open Vacancy Circular", url: vacancy.fileUrl }] : []}
      sourceUrl={vacancy.sourceUrl}
    />
  );
}
