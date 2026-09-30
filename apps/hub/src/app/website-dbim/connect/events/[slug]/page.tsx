import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimEventDetailView } from "@/components/website-dbim/ministry/OrganisationPages";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { eventDetail, organisationName } from "@/lib/website-dbim/organisation-pages";

type Params = { params: Promise<{ slug: string }> };

/* Rendered on first visit: the register holds 635 events. */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const e = eventDetail((await params).slug);
  return { title: `${e?.title ?? "Event Not Found"} | Department of Social Justice and Empowerment` };
}

/** Connect › Events › one event — where an organisation's page links to it. */
export default async function DbimEventPage({ params }: Params) {
  const e = eventDetail((await params).slug);
  if (!e) notFound();
  return (
    <DbimPage title={e.title} crumbs={[{ label: "Connect", path: "/connect" }, { label: "Events", path: "/connect/events" }]} path="/connect/events" activeTab="/connect/events" tabs={DBIM_MENU[4]!.children}>
      <DbimEventDetailView e={e} organisation={e.organisationId ? organisationName(e.organisationId) : undefined} />
    </DbimPage>
  );
}
