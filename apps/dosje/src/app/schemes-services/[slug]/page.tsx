import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/templates/ContentPage";
import { getSchemes, getScheme } from "@/lib/content";

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
  return { title: `${scheme.title} — DoSJE`, description: firstText };
}

export default async function SchemeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scheme = getScheme(slug);
  if (!scheme) notFound();

  const hasFacts = Boolean(scheme.category || (scheme.targetGroup && scheme.targetGroup.length) || scheme.website);
  return (
    <ContentPage
      title={scheme.title}
      breadcrumb={[{ label: "Offerings" }, { label: "Schemes & Services" }, { label: scheme.title }]}
      lastUpdated="Synced from dosje.gov.in"
      sidebar={
        hasFacts ? (
          <div className="rounded-xl border border-border bg-surface-muted p-5 text-sm">
            <dl className="space-y-3">
              {scheme.category && (
                <div>
                  <dt className="font-semibold text-ink">Category</dt>
                  <dd className="text-ink-muted">{scheme.category}</dd>
                </div>
              )}
              {scheme.targetGroup && scheme.targetGroup.length > 0 && (
                <div>
                  <dt className="font-semibold text-ink">Target Group</dt>
                  <dd className="text-ink-muted">{scheme.targetGroup.join(", ")}</dd>
                </div>
              )}
              {scheme.website && (
                <div>
                  <dt className="font-semibold text-ink">Official link</dt>
                  <dd>
                    <a href={scheme.website} target="_blank" rel="noreferrer" className="text-gov-blue hover:underline">
                      {scheme.website.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        ) : undefined
      }
    >
      {scheme.sections.map((s, i) => (
        <section key={s.heading ?? i}>
          {s.heading && <h2>{s.heading}</h2>}
          {/* content is allowlist-sanitized at ingest time, so this is safe */}
          <div dangerouslySetInnerHTML={{ __html: s.html }} />
        </section>
      ))}
    </ContentPage>
  );
}
