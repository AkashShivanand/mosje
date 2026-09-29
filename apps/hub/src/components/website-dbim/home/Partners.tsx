import { getOrganisation } from "@/data/website";
import { PARTNER_LOGOS } from "@/lib/website-shared/partners";
import { dbimOrganisationPath, organisationIds, schemePortalIds } from "@/lib/website-dbim/ministry";
import { dbimHref } from "@/lib/website-dbim/nav";

import { DbimPartnerCarousel } from "./PartnerCarousel";
import "./home-bottom.css";

/**
 * The partner-logo carousel above the footer (`.greybg.homeLogoSlider`): white logo
 * cards on a track centred in eight of twelve columns, stepped one card at a time.
 *
 * The marks are the live site's carousel, shared with every design
 * (lib/website-shared/partners.ts) — until 28 Sep 2026 this design showed the
 * reference build's own 22. A mark for one of the Department's bodies opens its page
 * under Ministry › Our Organisation (or Our Scheme Portals), where one exists; any other
 * opens its own site.
 */
export function DbimPartners() {
  const withPage = new Set([...organisationIds(), ...schemePortalIds()]);
  const partners = PARTNER_LOGOS.map((p) => {
    const org = p.organisationId ? getOrganisation(p.organisationId) : undefined;
    const href = org
      ? withPage.has(org.id)
        ? dbimHref(dbimOrganisationPath(org.id))
        : (org.externalUrl ?? org.profileHref)
      : p.href;
    return { src: p.src, label: p.label, href };
  });
  return (
    <section className="db-hb-partners" aria-label="Partner Websites">
      <DbimPartnerCarousel partners={partners} />
    </section>
  );
}
