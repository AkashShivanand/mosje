import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimCardGrid } from "@/components/website-dbim/ministry/CardGrid";
import { DbimOrganisationBody } from "@/components/website-dbim/ministry/OrganisationBody";
import { DBIM_MENU, dbimHref } from "@/lib/website-dbim/nav";
import {
  SCHEME_PORTALS_PATH,
  isOrganisationType,
  isSchemePortal,
  organisationCards,
  organisationDetail,
  organisationIds,
  organisationTypeLabel,
} from "@/lib/website-dbim/ministry";

type Props = { params: Promise<{ slug: string }> };

const TYPES = ["commissions", "foundations", "corporations"];
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

  /* The scheme portals moved to a tab of their own on 28 Sep 2026; their old
     addresses here keep working. */
  if (slug === "schemes") permanentRedirect(dbimHref(SCHEME_PORTALS_PATH));
  if (isSchemePortal(slug)) permanentRedirect(dbimHref(`${SCHEME_PORTALS_PATH}/${slug}`));

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
      <DbimOrganisationBody o={o} />
    </DbimPage>
  );
}
