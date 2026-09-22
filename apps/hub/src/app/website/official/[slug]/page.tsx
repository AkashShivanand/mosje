import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SectionTitle } from "@mosje/design-system";
import { RecordDetail } from "@/components/website-next/templates/RecordDetail";
import { getContentSyncedDate, getOfficial, getOfficials } from "@/lib/website/content";
import { facts } from "@/lib/website/record-facts";
import { directoryHrefFor } from "@/lib/website/directories";
import { socialCard } from "@/lib/seo/social";

/** 452 officers — every one is prerendered; the set is small and fully linked. */
export function generateStaticParams() {
  return getOfficials().map((o) => ({ slug: o.slug })).slice(0, 0); // rendered on first visit, not at build — free-tier budget, see documents/[slug]/page.tsx
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const official = getOfficial(slug);
  if (!official) return { title: "Officer Not Found | Department of Social Justice & Empowerment" };
  const description = [official.designation, official.organisationName]
    .filter(Boolean)
    .join(", ");
  return {
    title: `${official.title} | Department of Social Justice & Empowerment`,
    description,
    ...socialCard({ title: official.title, description, url: `/website/official/${official.slug}` }),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const official = getOfficial(slug);
  if (!official) notFound();

  const back = directoryHrefFor(official.organisation);
  /* Some records carry a placeholder ("1") in these fields; a value with no words is not published text. */
  const hasText = (html?: string) => (html ?? "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 3;

  return (
    <RecordDetail
      title={official.title}
      badge={official.organisationName ?? official.organisation ?? "Who's Who"}
      description={official.designation}
      breadcrumb={[
        { label: "About" },
        { label: back.label, href: back.href },
        { label: official.title },
      ]}
      backHref={back.href}
      backLabel={`Back to ${back.label}`}
      lastUpdated={getContentSyncedDate()}
      facts={facts([
        { term: "Designation", value: official.designation },
        { term: "Organisation", value: official.organisationName ?? official.organisation },
        { term: "Section", value: official.group },
        { term: "Tenure", value: official.tenure },
        { term: "Intercom", value: official.intercom },
        { term: "Office Telephone", value: official.phoneOffice },
        { term: "Residence Telephone", value: official.phoneResidence },
        { term: "Email", value: official.email },
        { term: "Address", value: official.address, wide: true },
      ])}
      sourceUrl={official.sourceUrl}
    >
      {official.imageUrl && (
        <Image
          className="wn-rec-portrait"
          src={official.imageUrl}
          alt={`Portrait of ${official.title}`}
          width={192}
          height={192}
        />
      )}

      {/*
        * WORK ALLOCATION IS THE ONE PIECE OF PROSE AN OFFICER'S RECORD CARRIES.
        * It is the department's own sanitised HTML — the subjects the post is
        * responsible for — and it is the single most useful thing on the page
        * for a citizen deciding whom to write to.
        */}
      {hasText(official.workAllocationHtml) && official.workAllocationHtml && (
        <div className="wn-rec-section">
          <SectionTitle title="Work Allocation" as={2} />
          <div
            className="wn-prose"
            dangerouslySetInnerHTML={{ __html: official.workAllocationHtml }}
          />
        </div>
      )}

      {hasText(official.additionalInfoHtml) && official.additionalInfoHtml && (
        <div className="wn-rec-section">
          <SectionTitle title="Additional Information" as={2} />
          <div
            className="wn-prose"
            dangerouslySetInnerHTML={{ __html: official.additionalInfoHtml }}
          />
        </div>
      )}
    </RecordDetail>
  );
}
