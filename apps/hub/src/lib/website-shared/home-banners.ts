import "server-only";

import { getCcpsBanners } from "@/lib/website-next/ccps";
import { HOME_BANNERS, type HomeBanner } from "./home";

/**
 * The slides every design's home carousel shows, in order: the CCPS banner
 * ALWAYS first — live from the feed, or its mirrored copy (DBIM 3.0 §7.4.1 i) —
 * then the live site's own banners. One call, so the three designs cannot
 * disagree about what leads.
 */
export async function getHomeBanners(): Promise<HomeBanner[]> {
  const ccps = await getCcpsBanners();
  return [
    ...ccps,
    ...HOME_BANNERS,
  ];
}
