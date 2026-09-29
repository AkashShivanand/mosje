import { getHomeBanners } from "@/lib/website-shared/home-banners";
import { whatsNew } from "@/lib/website-next/whats-new";
import { whatsNewTarget } from "@/lib/website-dbim/documents";
import { dbimFeedTitle } from "@/lib/website-dbim/home-mid";
import { DbimIcon } from "@/components/website-dbim/ui/icons";

import { BannerCarousel } from "./BannerCarousel";
import { AnnouncementsMarquee, type AnnouncementItem } from "./AnnouncementsMarquee";
import "./home-top.css";

/** How many of the Department's latest updates the announcements bar carries. */
const ANNOUNCEMENT_COUNT = 10;

/**
 * The home banner: the reference's full-width carousel, then its grey Announcements
 * bar. The slides are shared with every design (lib/website-shared/home.ts) — the
 * CCPS banner first, then the live site's own — not the reference build's six. DBIM makes
 * Announcements mandatory, so the bar renders even with nothing in it.
 *
 * DATA STILL NEEDED FROM THE DEPARTMENT: dosje.gov.in publishes no announcements list of
 * its own, so this bar carries the live What's New items (lib/website-shared/whats-new.ts)
 * as a stand-in. The production website takes the Department's announcements instead.
 */
export async function DbimBanner() {
  const slides = await getHomeBanners();
  // Each item opens where the What's New page sends it (`whatsNewTarget`), never at the feed's own href.
  const items: AnnouncementItem[] = whatsNew()
    .flatMap((n): AnnouncementItem[] => {
      const t = whatsNewTarget(n);
      return t ? [{ key: n.key, title: dbimFeedTitle(n.title), ...t }] : [];
    })
    .slice(0, ANNOUNCEMENT_COUNT);

  return (
    <div className="db-banner">
      <BannerCarousel slides={slides} />
      <div className="db-announce">
        <div className="db-announce__head">
          <h2 className="db-announce__title">Announcements</h2>
          <DbimIcon name="announcement" size={24} className="db-announce__icon" />
        </div>
        <AnnouncementsMarquee items={items} />
      </div>
    </div>
  );
}
