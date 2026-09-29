import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimOrganisationBody } from "@/components/website-dbim/ministry/OrganisationBody";
import "@/components/website-dbim/ministry/ministry.css";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { SCHEME_PORTALS_PATH, organisationDetail, schemePortalIds } from "@/lib/website-dbim/ministry";

type Props = { params: Promise<{ slug: string }> };

/** Every scheme portal with an ingested page is known at build time. */
export const dynamicParams = false;

export function generateStaticParams() {
  return schemePortalIds().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const o = organisationDetail((await params).slug);
  return { title: `${o?.title ?? "Our Scheme Portals"} | Department of Social Justice and Empowerment`, description: o?.summary };
}

/** A scheme portal's page, in the Our Organisation detail layout. */
export default async function DbimSchemePortalPage({ params }: Props) {
  const o = organisationDetail((await params).slug);
  if (!o || o.type !== "schemes") notFound();
  return (
    <DbimPage
      title={o.title}
      crumbs={[
        { label: "Ministry", path: "/ministry" },
        { label: "Our Scheme Portals", path: SCHEME_PORTALS_PATH },
      ]}
      path={SCHEME_PORTALS_PATH}
      activeTab={SCHEME_PORTALS_PATH}
      tabs={DBIM_MENU[0]!.children}
    >
      <DbimOrganisationBody o={o} />
    </DbimPage>
  );
}
