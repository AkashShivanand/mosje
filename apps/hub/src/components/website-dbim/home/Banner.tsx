import { DBIM_BANNERS } from "@/lib/website-dbim/assets";
import { whatsNew } from "@/lib/website-next/whats-new";
import { whatsNewTarget } from "@/lib/website-dbim/documents";
import { DbimIcon } from "@/components/website-dbim/ui/icons";

import { BannerCarousel } from "./BannerCarousel";
import { AnnouncementsMarquee, type AnnouncementItem } from "./AnnouncementsMarquee";
import "./home-top.css";

/** How many of the Department's latest updates the announcements bar carries. */
const ANNOUNCEMENT_COUNT = 10;

/**
 * The home banner: the reference's full-width carousel, then its grey Announcements
 * bar. DBIM makes Announcements mandatory, so the bar renders even with nothing in it.
 */
export function DbimBanner() {
  // Each item opens where the What's New page sends it (`whatsNewTarget`), never at the feed's own href.
  const items: AnnouncementItem[] = whatsNew()
    .flatMap((n): AnnouncementItem[] => {
      const t = whatsNewTarget(n);
      return t ? [{ key: n.key, title: n.title, ...t }] : [];
    })
    .slice(0, ANNOUNCEMENT_COUNT);

  return (
    <div className="db-banner">
      <BannerCarousel slides={DBIM_BANNERS} />
      <div className="db-announce">
        <div className="db-announce__head">
          <h2 className="db-announce__title">Announcements</h2>
          <DbimIcon name="announcements" size={25} className="db-announce__icon" />
        </div>
        <AnnouncementsMarquee items={items} />
      </div>
    </div>
  );
}
