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
        <div className="rounded-xl border border-border bg-surface-muted p-5 text-sm">
          <h2 className="mb-3 text-base font-semibold text-ink">Key Information</h2>
          {org.featuredImage && (
            <Image src={org.featuredImage} alt={`${org.title} logo`} width={160} height={80} className="mb-4 h-auto w-auto" />
          )}
          <dl className="space-y-3">
            {org.website && (
              <div>
                <dt className="font-semibold text-ink">Website</dt>
                <dd>
                  <a href={org.website} target="_blank" rel="noreferrer" className="text-gov-blue hover:underline">
                    {org.website.replace(/^https?:\/\//, "")}
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt className="font-semibold text-ink">Source</dt>
              <dd>
                <a href={org.sourceUrl} target="_blank" rel="noreferrer" className="text-gov-blue hover:underline">
                  View on dosje.gov.in
                </a>
              </dd>
            </div>
          </dl>
        </div>
      }
    >
      {org.sections.length === 0 ? (
        <p className="text-ink-muted">
          Full details for this organisation are available on the official website.{" "}
          <a href={org.sourceUrl} target="_blank" rel="noreferrer" className="text-gov-blue underline">
            View on dosje.gov.in
          </a>
        </p>
      ) : (
        org.sections.map((s, i) => (
          <section key={i}>
            {s.heading && <h2>{s.heading}</h2>}
            {/* content is allowlist-sanitized at ingest time, so this is safe */}
            <div dangerouslySetInnerHTML={{ __html: s.html }} />
          </section>
        ))
      )}
    </ContentPage>
  );
}
