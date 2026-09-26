import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordDetail } from "@/components/website-next/templates/RecordDetail";
import { getContentSyncedDate, getSchemeDocuments, getSchemeDocument } from "@/lib/website/content";
import { documentFacts, documentFiles } from "@/lib/website/record-facts";
import { socialCard } from "@/lib/seo/social";

/** 100 records — every one is prerendered. */
export function generateStaticParams() {
  return getSchemeDocuments().map((d) => ({ slug: d.slug })).slice(0, 0); // rendered on first visit, not at build — free-tier budget, see documents/[slug]/page.tsx
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const record = getSchemeDocument(slug);
  if (!record) return { title: "Record Not Found | Department of Social Justice & Empowerment" };
  const description = "A document attached to a scheme of the Department of Social Justice & Empowerment.";
  return {
    title: `${record.title} | Department of Social Justice & Empowerment`,
    description,
    ...socialCard({ title: record.title, description, url: `/website/scheme-documents/${record.slug}` }),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = getSchemeDocument(slug);
  if (!record) notFound();

  return (
    <RecordDetail
      title={record.title}
      badge="Scheme Document"
      breadcrumb={[{ label: "Documents" }, { label: "Scheme Documents", href: "/website/scheme-documents" }, { label: record.title }]}
      backHref="/website/scheme-documents"
      backLabel="Back to Scheme Documents"
      lastUpdated={getContentSyncedDate()}
      facts={documentFacts(record)}
      files={documentFiles(record)}
      sourceUrl={record.sourceUrl}
    />
  );
}
