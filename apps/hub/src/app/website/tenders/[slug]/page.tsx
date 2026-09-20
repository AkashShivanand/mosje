import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordDetail } from "@/components/website/templates/RecordDetail";
import { getContentSyncedDate, getTender, getTenders } from "@/lib/website/content";
import { facts, humanDate } from "@/lib/website/record-facts";
import { socialCard } from "@/lib/seo/social";

/** 312 tenders — every one is prerendered. */
export function generateStaticParams() {
  return getTenders().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const tender = getTender(slug);
  if (!tender) return { title: "Tender Not Found | Department of Social Justice & Empowerment" };
  const description =
    "A tender notice issued by the Department of Social Justice & Empowerment or one of its associated organisations.";
  return {
    title: `${tender.title} | Department of Social Justice & Empowerment`,
    description,
    ...socialCard({ title: tender.title, description, url: `/website/tenders/${tender.slug}` }),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tender = getTender(slug);
  if (!tender) notFound();

  return (
    <RecordDetail
      title={tender.title}
      badge="Tender"
      breadcrumb={[
        { label: "Offerings" },
        { label: "Tenders", href: "/website/tenders" },
        { label: tender.title },
      ]}
      backHref="/website/tenders"
      backLabel="Back to Tenders"
      lastUpdated={getContentSyncedDate()}
      facts={facts([
        { term: "Category", value: tender.category },
        { term: "Published", value: humanDate(tender.date) },
      ])}
      files={tender.fileUrl ? [{ label: "Open Tender Document", url: tender.fileUrl }] : []}
      sourceUrl={tender.sourceUrl}
    />
  );
}
