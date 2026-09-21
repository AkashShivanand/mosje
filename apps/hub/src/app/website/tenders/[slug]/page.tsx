import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordDetail } from "@/components/website-next/templates/RecordDetail";
import { getContentSyncedDate, getTender, getTenders } from "@/lib/website/content";
import { facts } from "@/lib/website/record-facts";
import { formatDate } from "@/components/website-next/ui/format";
import { socialCard } from "@/lib/seo/social";
import { displayNoticeTitle, isArchived } from "@/components/website-next/ui/records";

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
  const title = displayNoticeTitle(tender.title);
  const description =
    "A tender notice issued by the Department of Social Justice & Empowerment or one of its associated organisations.";
  return {
    title: `${title} | Department of Social Justice & Empowerment`,
    description,
    ...socialCard({ title, description, url: `/website/tenders/${tender.slug}` }),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tender = getTender(slug);
  if (!tender) notFound();
  /* Published more than 12 months ago: listed in the Archives, not on the Tenders page (MAN-06). */
  const archived = isArchived(tender.date);
  /* A title the ingest cut short ends in an ellipsis, never reads as whole. */
  const title = displayNoticeTitle(tender.title);

  return (
    <RecordDetail
      title={title}
      badge="Tender"
      breadcrumb={[
        { label: "Tenders & Vacancies" },
        archived ? { label: "Archives", href: "/website/archives" } : { label: "Tenders", href: "/website/tenders" },
        { label: title },
      ]}
      backHref={archived ? "/website/archives" : "/website/tenders"}
      backLabel={archived ? "Back to Archives" : "Back to Tenders"}
      lastUpdated={getContentSyncedDate()}
      facts={facts([
        { term: "Category", value: tender.category },
        { term: "Published", value: formatDate(tender.date) },
      ])}
      files={tender.fileUrl ? [{ label: "Open Tender Document", url: tender.fileUrl }] : []}
    />
  );
}
