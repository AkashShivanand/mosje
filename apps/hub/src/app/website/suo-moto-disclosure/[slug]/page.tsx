import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordDetail } from "@/components/website-next/templates/RecordDetail";
import { getContentSyncedDate, getSuoMotoDisclosures, getSuoMotoDisclosure } from "@/lib/website/content";
import { documentFacts, documentFiles } from "@/lib/website/record-facts";
import { socialCard } from "@/lib/seo/social";

/** 14 records — every one is prerendered. */
export function generateStaticParams() {
  return getSuoMotoDisclosures().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const record = getSuoMotoDisclosure(slug);
  if (!record) return { title: "Record Not Found | Department of Social Justice & Empowerment" };
  const description = "A proactive disclosure under Section 4(1)(b) of the Right to Information Act, 2005.";
  return {
    title: `${record.title} | Department of Social Justice & Empowerment`,
    description,
    ...socialCard({ title: record.title, description, url: `/website/suo-moto-disclosure/${record.slug}` }),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = getSuoMotoDisclosure(slug);
  if (!record) notFound();

  return (
    <RecordDetail
      title={record.title}
      badge="Suo-Moto Disclosure"
      breadcrumb={[{ label: "Documents" }, { label: "Suo Moto Disclosure", href: "/website/suo-moto-disclosure" }, { label: record.title }]}
      backHref="/website/suo-moto-disclosure"
      backLabel="Back to Suo Moto Disclosure"
      lastUpdated={getContentSyncedDate()}
      facts={documentFacts(record)}
      files={documentFiles(record)}
      sourceUrl={record.sourceUrl}
    />
  );
}
