import { DBIM_PARTNERS } from "@/lib/website-dbim/assets";

import { DbimPartnerCarousel } from "./PartnerCarousel";
import "./home-bottom.css";

/**
 * The partner-logo carousel above the footer (`.greybg.homeLogoSlider`): white logo
 * cards on a track centred in eight of twelve columns, stepped one card at a time.
 */
export function DbimPartners() {
  return (
    <section className="db-hb-partners" aria-label="Partner Websites">
      <DbimPartnerCarousel partners={DBIM_PARTNERS} />
    </section>
  );
}
