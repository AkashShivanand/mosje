import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ContentPage } from "@/components/templates/ContentPage";
import { getOrganisations, getOrganisation } from "@/lib/content";

export function generateStaticParams() {
  return getOrganisations().map((o) => ({ slug: o.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = slug.join("/");
  const org = getOrganisation(key);
  if (!org) return { title: "Organisation — DoSJE" };
  const firstText = org.sections.find((s) => s.html)?.html.replace(/<[^>]+>/g, "").slice(0, 160);
  return { title: `${org.title} — DoSJE`, description: firstText };
}

export default async function OrganisationDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const key = slug.join("/");
  const org = getOrganisation(key);
  if (!org) notFound();

  return (
    <ContentPage
      title={org.title}
      breadcrumb={[{ label: "Associated Organisations" }, { label: org.title }]}
      lastUpdated="Synced from dosje.gov.in"
      sidebar={
        org.website || org.featuredImage ? (
          <div className="rounded-xl border border-gray-200 bg-surface-muted p-5 text-[14px]">
            {org.featuredImage && (
              <Image src={org.featuredImage} alt={`${org.title} logo`} width={160} height={80} className="mb-4 h-auto w-auto" />
            )}
            {org.website && (
              <a href={org.website} target="_blank" rel="noreferrer" className="text-gov-blue hover:underline">
                {org.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        ) : undefined
      }
    >
      {org.sections.map((s, i) => (
        <section key={i}>
          {s.heading && <h2>{s.heading}</h2>}
          {/* content is allowlist-sanitized at ingest time, so this is safe */}
          <div dangerouslySetInnerHTML={{ __html: s.html }} />
        </section>
      ))}
    </ContentPage>
  );
}
