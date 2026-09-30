import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimOrganisationBody } from "@/components/website-dbim/ministry/OrganisationBody";
import { DbimOrganisationProfile } from "@/components/website-dbim/ministry/OrganisationProfile";
import { DBIM_MENU, dbimHref } from "@/lib/website-dbim/nav";
import {
  SCHEME_PORTALS_PATH,
  isOrganisationType,
  isSchemePortal,
  organisationDetail,
  organisationIds,
} from "@/lib/website-dbim/ministry";
import { organisationProfile } from "@/lib/website-dbim/organisation";

type Props = { params: Promise<{ slug: string }> };

const CRUMBS = [
  { label: "Ministry", path: "/ministry" },
  { label: "Our Organisation", path: "/ministry/our-organisation" },
];

export function generateStaticParams() {
  return organisationIds().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const o = organisationDetail(slug);
  return {
    title: `${o?.title ?? "Our Organisation"} | Department of Social Justice and Empowerment`,
    description: organisationProfile(slug)?.lead ?? o?.summary,
  };
}

/**
 * One organisation's page: the body's own page on the live website, where it has one
 * (every body but the Babu Jagjivan Ram National Foundation); otherwise the summary and
 * the ingested prose.
 */
export default async function DbimOrganisationPage({ params }: Props) {
  const { slug } = await params;

  /* Addresses retired on 28 Sep 2026 keep working: the scheme portals moved to a tab
     of their own, and the per-type listings became the Category filter on the list. */
  if (slug === "schemes") permanentRedirect(dbimHref(SCHEME_PORTALS_PATH));
  if (isSchemePortal(slug)) permanentRedirect(dbimHref(`${SCHEME_PORTALS_PATH}/${slug}`));
  if (isOrganisationType(slug)) permanentRedirect(dbimHref("/ministry/our-organisation"));

  const o = organisationDetail(slug);
  if (!o) notFound();
  const profile = organisationProfile(slug);
  return (
    /* The body's own banner photograph goes where DBIM draws every inner page's
       photograph — behind the title in the page banner — not above the first section. */
    <DbimPage
      title={o.title}
      crumbs={CRUMBS}
      path="/ministry/our-organisation"
      activeTab="/ministry/our-organisation"
      tabs={DBIM_MENU[0]!.children}
      hero={profile?.banner}
      heroCrop={Boolean(profile?.banner)}
    >
      {/* Where the live banner carries no lead (NCSC), the list card's summary stands in. */}
      {profile ? <DbimOrganisationProfile o={{ ...profile, lead: profile.lead ?? o.summary }} /> : <DbimOrganisationBody o={o} />}
    </DbimPage>
  );
}
