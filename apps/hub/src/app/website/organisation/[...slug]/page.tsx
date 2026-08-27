import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import { OrganisationSidebar } from "./OrganisationSidebar";
import { AdarshGramDashboard } from "@/components/website/AdarshGramDashboard";
import {
  getOrganisations,
  getOrganisation,
  withAssetBasePath,
  getContentSyncedDate,
} from "@/lib/website/content";


function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

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

  const rootSlug = slug[0];
  const allOrgs = getOrganisations();
  const relatedPages = allOrgs.filter((o) => o.slug === rootSlug || o.slug.startsWith(`${rootSlug}/`));
  const hasSidebar = relatedPages.length > 1 || org.sections.filter(s => s.heading).length > 1;


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
      description={(org as any).description /* eslint-disable-line @typescript-eslint/no-explicit-any */}
      actions={
        org.website && (
          <a
            href={org.website}
            target="_blank"
            rel="noreferrer"
            className={buttonClasses("primary", "filled", "sm", "text-xs px-4 py-2 flex items-center gap-1.5")}
          >
            Visit Official Portal <Icon name="open_in_new" size={16} />
          </a>
        )
      }
    >
      <section className="py-10 md:py-14 bg-surface-muted/30">
        <div className={`sa-container grid gap-10 ${hasSidebar ? "lg:grid-cols-[280px_minmax(0,1fr)] items-start" : "max-w-4xl mx-auto"}`}>
          
          {hasSidebar && (
            <OrganisationSidebar rootSlug={rootSlug || ""} relatedPages={relatedPages} orgSections={org.sections} />
          )}

          <article className="gov-prose min-w-0 bg-white p-8 md:p-12 rounded-2xl shadow-xs border border-gray-100">
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
                  View on dosje.gov.in <Icon name="open_in_new" size={16} />
                </a>
              </div>
            ) : (
              org.sections.map((s, i) => (
                <section key={s.heading ?? i} className="mb-8">
                  {s.heading && (
                    <h2 id={slugify(s.heading)} className="text-[26px] font-bold text-primary-dark border-b border-gray-200 pb-2 mb-6 scroll-mt-28">
                      {s.heading}
                    </h2>
                  )}
                  <div
                    dangerouslySetInnerHTML={{ __html: withAssetBasePath(s.html) }}
                    className="leading-relaxed text-ink text-[16px]"
                  />
                </section>
              ))
            )}

            
            {/* Custom Dashboard for Adarsh Gram */}
            {key === 'pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay/components/development-of-sc-dominated-villages-into-adarsh-gram' && (
              <AdarshGramDashboard />
            )}

            {/* Child Pages Grid / Components */}

            {relatedPages.length > 1 && key === rootSlug && (
              <section className="mt-16 pt-10 border-t border-gray-100">
                <h2 className="text-[26px] font-bold text-primary-dark pb-2 mb-8 text-center">
                  Components & Initiatives
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {relatedPages.filter(rp => rp.slug !== rootSlug && rp.slug.includes('components')).map(cp => (
                    <div key={cp.slug} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                      <div className="h-14 w-14 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <Icon name="home" size={28} />
                      </div>
                      <h3 className="font-bold text-ink mb-4 leading-snug">{cp.title}</h3>
                      <Link href={`/website/organisation/${cp.slug}`} className="mt-auto text-sm font-semibold text-primary border border-primary/20 rounded-full px-5 py-2 hover:bg-primary/5 hover:border-primary/50 transition-colors">
                        Read more
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </article>
        </div>
      </section>
    </PageLayout>
  );
}
