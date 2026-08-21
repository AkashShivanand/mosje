import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import {
  getOrganisations,
  getOrganisation,
  withAssetBasePath,
  getContentSyncedDate,
} from "@/lib/website/content";

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
    <PageLayout
      title={org.title}
      badge="Associated Organisation"
      breadcrumb={[
        { label: "Associated Organisations", href: "/website" },
        { label: org.title },
      ]}
      lastUpdated={getContentSyncedDate()}
      logoSrc={org.featuredImage}
      actions={
        org.website && (
          <a
            href={org.website}
            target="_blank"
            rel="noreferrer"
            className={buttonClasses("primary", "filled", "sm", "text-xs px-4 py-2 flex items-center gap-1.5")}
          >
            Visit Official Portal <Icon name="open_in_new" size={14} />
          </a>
        )
      }
    >
      <section className="py-10 md:py-14 bg-white">
        <div className="sa-container grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main Body Sections */}
          <article className="gov-prose min-w-0">
            {org.sections.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 p-8 bg-surface-muted">
                <p className="text-ink-muted leading-relaxed">
                  Full details, publications, and administrative circulars for this organisation are accessible through the official portal.
                </p>
                <a
                  href={org.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary underline"
                >
                  View on dosje.gov.in <Icon name="open_in_new" size={14} />
                </a>
              </div>
            ) : (
              org.sections.map((s, i) => (
                <section key={s.heading ?? i} className="mb-8">
                  {s.heading && (
                    <h2 className="text-[22px] font-bold text-primary-dark border-b border-gray-200 pb-2 mb-4">
                      {s.heading}
                    </h2>
                  )}
                  {/* Sanitized HTML content */}
                  <div
                    dangerouslySetInnerHTML={{ __html: withAssetBasePath(s.html) }}
                    className="leading-relaxed text-ink"
                  />
                </section>
              ))
            )}
          </article>

          {/* Sidebar Information Card */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-surface-muted p-6 shadow-xs">
              <h2 className="text-[17px] font-bold text-primary-dark border-b border-gray-200/80 pb-3">
                Organisation Overview
              </h2>

              {org.featuredImage && (
                <div className="mt-4 flex justify-center p-3 bg-white rounded-xl border border-gray-200">
                  <Image
                    src={org.featuredImage}
                    alt={`${org.title} logo`}
                    width={140}
                    height={80}
                    className="h-16 w-auto object-contain"
                  />
                </div>
              )}

              <dl className="mt-4 space-y-4 text-xs sm:text-sm">
                {org.website && (
                  <div>
                    <dt className="font-bold text-ink">Official Website</dt>
                    <dd className="mt-0.5">
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary font-semibold hover:underline flex items-center gap-1"
                      >
                        {org.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        <Icon name="open_in_new" size={13} />
                      </a>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="font-bold text-ink">Affiliation</dt>
                  <dd className="mt-0.5 text-ink-muted">
                    Ministry of Social Justice &amp; Empowerment
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-ink">Source Record</dt>
                  <dd className="mt-0.5">
                    <a
                      href={org.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      dosje.gov.in <Icon name="open_in_new" size={13} />
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Quick Link to All Organisations */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
                Explore More Bodies
              </h3>
              <Link
                href="/website"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                All Associated Organisations <Icon name="arrow_forward" size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </PageLayout>
  );
}
