import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { DescriptionItem } from "@mosje/design-system";
import { RecordDetail } from "@/components/website-next/templates/RecordDetail";
import { getAllDocuments, getContentSyncedDate, getDocument, routeSlug } from "@/lib/website/content";
import { documentFacts, documentFiles } from "@/lib/website/record-facts";
import type { DocumentRecord, LabelledFile } from "@/types/website/content";
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
    .map((d) => ({ slug: routeSlug(d.slug) }));
}

/*
 * THE OTHER-LANGUAGE EDITION, WHERE THE REGISTER FILES IT AS ITS OWN RECORD.
 *
 * 179 records carry a Hindi file on the record itself (`fileUrlHi`), which
 * `documentFiles` already offers. Fourteen more are filed as two records whose
 * titles differ only by "(English)" / "(Hindi)" — the Department's Annual
 * Report 2025-26 among them. Each is offered the other's file, matched on the
 * same organisation and the same title before the language suffix; a record
 * with no such twin gets nothing.
 */
const LANG_SUFFIX = /\s*\((English|Hindi)\)\s*$/i;

function editionTwin(doc: DocumentRecord): LabelledFile | undefined {
  const m = LANG_SUFFIX.exec(doc.title);
  if (!m) return undefined;
  const base = doc.title.replace(LANG_SUFFIX, "").trim().toLowerCase();
  const want = m[1]?.toLowerCase() === "english" ? "hindi" : "english";
  const twin = getAllDocuments().find((d) => {
    const t = LANG_SUFFIX.exec(d.title);
    return (
      d !== doc &&
      t?.[1]?.toLowerCase() === want &&
      d.organisation === doc.organisation &&
      d.title.replace(LANG_SUFFIX, "").trim().toLowerCase() === base
    );
  });
  const url = twin?.fileUrl ?? twin?.externalUrl;
  if (!twin || !url) return undefined;
  // English label on an English page; the linked document is the Hindi one.
  const name = want === "hindi" ? "Hindi Edition" : "English Edition";
  return { label: twin.fileSize ? `${name} (${twin.fileSize})` : name, url, fileType: twin.fileType };
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
      files={[...documentFiles(doc), ...[editionTwin(doc)].filter((f): f is LabelledFile => !!f)]}
    />
  );
}
