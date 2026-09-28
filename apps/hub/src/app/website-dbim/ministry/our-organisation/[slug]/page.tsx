import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimOrganisationBody } from "@/components/website-dbim/ministry/OrganisationBody";
import { DBIM_MENU, dbimHref } from "@/lib/website-dbim/nav";
import {
  SCHEME_PORTALS_PATH,
  isOrganisationType,
  isSchemePortal,
  organisationDetail,
  organisationIds,
} from "@/lib/website-dbim/ministry";

type Props = { params: Promise<{ slug: string }> };

const CRUMBS = [
  { label: "Ministry", path: "/ministry" },
  { label: "Our Organisation", path: "/ministry/our-organisation" },
];

export function generateStaticParams() {
  return organisationIds().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const o = organisationDetail((await params).slug);
  return { title: `${o?.title ?? "Our Organisation"} | Department of Social Justice and Empowerment`, description: o?.summary };
}

/** One organisation's page. */
export default async function DbimOrganisationPage({ params }: Props) {
  const { slug } = await params;

  /* Addresses retired on 28 Sep 2026 keep working: the scheme portals moved to a tab
     of their own, and the per-type listings became the Category filter on the list. */
  if (slug === "schemes") permanentRedirect(dbimHref(SCHEME_PORTALS_PATH));
  if (isSchemePortal(slug)) permanentRedirect(dbimHref(`${SCHEME_PORTALS_PATH}/${slug}`));
  if (isOrganisationType(slug)) permanentRedirect(dbimHref("/ministry/our-organisation"));

  const o = organisationDetail(slug);
  if (!o) notFound();
  return (
    <DbimPage title={o.title} crumbs={CRUMBS} path="/ministry/our-organisation" activeTab="/ministry/our-organisation" tabs={DBIM_MENU[0]!.children}>
      <DbimOrganisationBody o={o} />
    </DbimPage>
  );
}
