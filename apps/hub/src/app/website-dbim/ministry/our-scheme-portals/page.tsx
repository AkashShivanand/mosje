import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimCardGrid } from "@/components/website-dbim/ministry/CardGrid";
import "@/components/website-dbim/ministry/ministry.css";
import { DBIM_MENU } from "@/lib/website-dbim/nav";
import { SCHEME_PORTALS_PATH, schemePortalCards } from "@/lib/website-dbim/ministry";
import { SCHEME_PORTALS_SECTION } from "@/lib/website-shared/organisations";

export const metadata: Metadata = {
  title: "Our Scheme Portals | Department of Social Justice and Empowerment",
  description: SCHEME_PORTALS_SECTION.description,
};

/**
 * Ministry › Our Scheme Portals — the Department's scheme portals, taken out of Our
 * Organisation as every other design already has them (lib/website-shared/organisations.ts).
 * The same card grid as Our Organisation's second level: each card opens the portal's
 * page, which ends in a link to the portal itself.
 */
export default function DbimOurSchemePortalsPage() {
  return (
    <DbimPage title="Our Scheme Portals" crumbs={[{ label: "Ministry", path: "/ministry" }]} path={SCHEME_PORTALS_PATH} tabs={DBIM_MENU[0]!.children}>
      <DbimCardGrid items={schemePortalCards()} variant="organisation" label={SCHEME_PORTALS_SECTION.title} />
    </DbimPage>
  );
}
