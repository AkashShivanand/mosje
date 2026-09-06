import type { Metadata } from "next";
import { Header } from "@/components/website/Header";
import { WebsiteSiteFooter } from "@/components/website/SiteFooter";
import { ImportantLinks } from "@/components/website/ImportantLinks";
import { PortalsExplorer } from "@/components/portals-explorer";
import { resolvePortals } from "@/lib/registry/resolve";
import { socialCard } from "@/lib/seo/social";
import { SITE_NAME } from "@/lib/seo/site";

const PORTALS_TITLE = "Integrated Portals Gateway — SAMAVESH · MoSJE";
const PORTALS_DESCRIPTION =
  "Browse every workflow portal across the Ministry of Social Justice & Empowerment — schemes, scholarships, finance corporations, and commissions.";

export const metadata: Metadata = {
  title: PORTALS_TITLE,
  description: PORTALS_DESCRIPTION,
  ...socialCard({
    title: PORTALS_TITLE,
    description: PORTALS_DESCRIPTION,
    url: "/portals",
    siteName: SITE_NAME,
  }),
};

export default async function PortalsPage() {
  const portals = await resolvePortals();

  return (
    <>
      <Header />
      <main id="content" className="flex-1">
        <PortalsExplorer portals={portals} />
      </main>
      <WebsiteSiteFooter />
      <ImportantLinks />
    </>
  );
}
