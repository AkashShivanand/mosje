import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, Icon, Link } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import { getSchemes, getScheme, withAssetBasePath, getContentSyncedDate } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

export function generateStaticParams() {
  return getSchemes().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scheme = getScheme(slug);
  if (!scheme) return { title: "Scheme — DoSJE" };
  const firstText = scheme.sections.find((s) => s.html)?.html.replace(/<[^>]+>/g, "").slice(0, 160);
  const title = `${scheme.title} — DoSJE`;
  return {
    title,
    description: firstText,
    ...socialCard({ title, description: firstText, url: `/website/schemes-services/${slug}` }),
  };
}

export default async function SchemeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scheme = getScheme(slug);
  if (!scheme) notFound();

  return (
    <PageLayout
      title={scheme.title}
      badge={scheme.category ?? "National Welfare Scheme"}
      breadcrumb={[
        { label: "Offerings", href: "/website/schemes-services" },
        { label: "Schemes & Services", href: "/website/schemes-services" },
        { label: scheme.title },
      ]}
      lastUpdated={getContentSyncedDate()}
      actions={
        <div className="flex items-center gap-2">
          {scheme.website && (
            <Button
              href={scheme.website}
              external
              variant="primary"
              appearance="filled"
              size="sm"
              className="text-label-2 px-4 py-2"
            >
              Apply Online
            </Button>
          )}
          {scheme.sourceUrl && (
            <Button
              href={scheme.sourceUrl}
              external
              variant="primary"
              appearance="outlined"
              size="sm"
              className="text-label-2 px-3.5 py-2"
              iconRight={<Icon name="arrow_outward" size={16} />}
            >
              Portal
            </Button>
          )}
        </div>
      }
    >
      <section className="py-10 md:py-14 bg-white">
        <div className="sa-container grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main Content Sections */}
          <article className="gov-prose min-w-0">
            {scheme.sections.length === 0 ? (
              <div className="rounded-xl border border-gray-200 p-8 bg-surface-muted">
                <p className="text-ink-muted">
                  Full details and application procedures for this scheme are available on the official Ministry portal.
                </p>
                <Link
                  href={scheme.sourceUrl}
                  external
                  variant="standalone"
                  size="sm"
                  className="mt-4 font-semibold"
                >
                  View on dosje.gov.in
                </Link>
              </div>
            ) : (
              scheme.sections.map((s, i) => (
                <section key={s.heading ?? i} className="mb-8">
                  {s.heading && (
                    <h2 className="text-headline-2 text-primary-dark border-b border-gray-200 pb-2 mb-4">
                      {s.heading}
                    </h2>
                  )}
                  {/* Sanitized HTML content */}
                  <div
                    dangerouslySetInnerHTML={{ __html: withAssetBasePath(s.html) }}
                    className="text-body-1 text-ink"
                  />
                </section>
              ))
            )}
          </article>

          {/* Sidebar Info Card */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-surface-muted p-6 shadow-xs">
              <h2 className="text-title-1 text-primary-dark border-b border-gray-200/80 pb-3">
                Key Details
              </h2>
              <dl className="mt-4 space-y-4 text-body-2">
                {scheme.category && (
                  <div>
                    <dt className="font-bold text-ink">Category</dt>
                    <dd className="mt-0.5 text-ink-muted">{scheme.category}</dd>
                  </div>
                )}
                {scheme.targetGroup && scheme.targetGroup.length > 0 && (
                  <div>
                    <dt className="font-bold text-ink">Target Beneficiaries</dt>
                    <dd className="mt-0.5 text-ink-muted">
                      {scheme.targetGroup.join(", ")}
                    </dd>
                  </div>
                )}
                {scheme.website && (
                  <div>
                    <dt className="font-bold text-ink">Application Portal</dt>
                    <dd className="mt-0.5">
                      <Link
                        href={scheme.website}
                        external
                        variant="standalone"
                        className="font-semibold"
                      >
                        {scheme.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </Link>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="font-bold text-ink">Official Source</dt>
                  <dd className="mt-0.5">
                    <Link href={scheme.sourceUrl} external variant="standalone">
                      dosje.gov.in
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Helpline / Quick Assistance Box */}
            <div className="rounded-2xl bg-gradient-to-br from-primary-dark to-primary p-6 text-white shadow-xs">
              <h3 className="text-title-1 text-white">Need Assistance?</h3>
              <p className="mt-1.5 text-body-3 text-white/90">
                Reach out to the scheme helpline for queries related to application status and eligibility.
              </p>
              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-label-2">
                <span>National Helpline</span>
                <span className="text-white font-bold">14446 / 14566</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageLayout>
  );
}
