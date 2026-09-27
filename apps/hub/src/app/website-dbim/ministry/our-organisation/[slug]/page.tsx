import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimCardGrid } from "@/components/website-dbim/ministry/CardGrid";
import { DbimDetailLayout } from "@/components/website-dbim/ministry/DetailLayout";
import { DbimLinkRow } from "@/components/website-dbim/ministry/DocRow";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import {
  isOrganisationType,
  organisationCards,
  organisationDetail,
  organisationIds,
  organisationTypeLabel,
} from "@/lib/website-dbim/ministry";
import { withAssetBasePath } from "@/lib/website/content";

type Props = { params: Promise<{ slug: string }> };

const TYPES = ["commissions", "foundations", "corporations", "schemes"];
const CRUMBS = [
  { label: "Ministry", path: "/ministry" },
  { label: "Our Organisation", path: "/ministry/our-organisation" },
];

/** One segment serves both levels: a type key lists its bodies, an organisation id is its page. */
export function generateStaticParams() {
  return [...TYPES, ...organisationIds()].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = isOrganisationType(slug) ? organisationTypeLabel(slug) : organisationDetail(slug)?.title;
  const summary = isOrganisationType(slug) ? undefined : organisationDetail(slug)?.summary;
  return { title: `${title ?? "Our Organisation"} | Department of Social Justice and Empowerment`, description: summary };
}

export default async function DbimOrganisationPage({ params }: Props) {
  const { slug } = await params;
  const tabs = DBIM_MENU[0]!.children;

  if (isOrganisationType(slug)) {
    const label = organisationTypeLabel(slug);
    return (
      <DbimPage title={label} crumbs={CRUMBS} path="/ministry/our-organisation" activeTab="/ministry/our-organisation" tabs={tabs}>
        <DbimCardGrid items={organisationCards(slug)} variant="organisation" label={label} />
      </DbimPage>
    );
  }

  const o = organisationDetail(slug);
  if (!o) notFound();
  return (
    <DbimPage
      title={o.title}
      crumbs={[...CRUMBS, { label: organisationTypeLabel(o.type), path: `/ministry/our-organisation/${o.type}` }]}
      path="/ministry/our-organisation"
      activeTab="/ministry/our-organisation"
      tabs={tabs}
    >
      <DbimDetailLayout summary={o.summary}>
        {o.sections.map((s, i) => (
          <section key={i} aria-label={s.heading ?? o.title}>
            {s.heading ? <h2>{s.heading}</h2> : null}
            {/* Ingested prose from dosje.gov.in, cleaned by cleanHtml() (asset paths, links, headings, tables). */}
            <div dangerouslySetInnerHTML={{ __html: withAssetBasePath(s.html) }} />
          </section>
        ))}
        {o.externalUrl ? (
          <section aria-labelledby="org-portal">
            <h2 id="org-portal">Portal</h2>
            <DbimLinkRow label={o.title} href={o.externalUrl} external />
          </section>
        ) : null}
      </DbimDetailLayout>
    </DbimPage>
  );
}
