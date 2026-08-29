import type { Metadata } from "next";
import { Header } from "@/components/website/Header";
import { SiteFooter } from "@/components/website/SiteFooter";
import { ImportantLinks } from "@/components/website/ImportantLinks";
import { PortalsExplorer } from "@/components/portals-explorer";
import { resolvePortals } from "@/lib/registry/resolve";

export const metadata: Metadata = {
  title: "Integrated Portals Gateway — SAMAVESH · MoSJE",
  description:
    "Browse every workflow portal across the Ministry of Social Justice & Empowerment — schemes, scholarships, finance corporations, and commissions.",
};

export default async function PortalsPage() {
  const portals = await resolvePortals();

  return (
    <>
      <Header />
      <main id="content" className="flex-1">
        <PortalsExplorer portals={portals} />
      </main>
      <SiteFooter />
      <ImportantLinks />
    </>
  );
}
