import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { DescriptionItem } from "@mosje/design-system";
import { RecordDetail } from "@/components/website/templates/RecordDetail";
import { getAllDocuments, getContentSyncedDate, getDocument } from "@/lib/website/content";
import { documentFacts, documentFiles } from "@/lib/website/record-facts";
import { documentListingFor } from "@/lib/website/directories";
import { socialCard } from "@/lib/seo/social";

/**
 * A single document from the department's register.
 *
 * ── HOW MANY ARE PRERENDERED, AND WHY NOT ALL ────────────────────────────────
 * The register holds 8,631 records — 5,964 in the library and 2,667 entries of
 * the Central List of OBCs. Prerendering all of them would put 8,631 HTML files
 * through every build for a set where the overwhelming majority are reached by
 * search, not by a link. So the 400 most recently published are built ahead and
 * the rest render on first request and are then cached: `dynamicParams` stays
 * at its default of `true`, so every slug in the register resolves — the cap is
 * a build-time budget, never a limit on what exists.
 */
export const dynamicParams = true;

const PRERENDERED = 400;

export function generateStaticParams() {
  return [...getAllDocuments()]
    .sort((a, b) => (b.publishStart ?? b.date ?? "").localeCompare(a.publishStart ?? a.date ?? ""))
    .slice(0, PRERENDERED)
    .map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocument(slug);
  if (!doc) return { title: "Document Not Found | Department of Social Justice & Empowerment" };
  const description = `${doc.category ?? "Document"} published by ${doc.organisation ?? "the Department of Social Justice & Empowerment"}.`;
  return {
    title: `${doc.title} | Department of Social Justice & Empowerment`,
    description,
    ...socialCard({ title: doc.title, description, url: `/website/documents/${doc.slug}` }),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocument(slug);
  if (!doc) notFound();

  const facts: DescriptionItem[] = documentFacts(doc);
  /*
   * BACK TO THE PAGE THIS RECORD IS ACTUALLY LISTED ON.
   *
   * "Back to Documents" is not a place — the estate has eighteen document
   * listings and no page that is all of them. This one pointed at Resources,
   * which held none of the Advices it was reached from.
   */
  const listing = documentListingFor(doc.types);

  return (
    <RecordDetail
      title={doc.title}
      badge={doc.category ?? "Document"}
      breadcrumb={[
        { label: "Documents" },
        { label: listing.label, href: listing.href },
        { label: doc.title },
      ]}
      backHref={listing.href}
      backLabel={`Back to ${listing.label}`}
      lastUpdated={getContentSyncedDate()}
      facts={facts}
      files={documentFiles(doc)}
      sourceUrl={doc.sourceUrl}
    />
  );
}
