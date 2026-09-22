"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SamaveshBanner } from "@mosje/design-system";
import { useSamaveshBanner } from "@/lib/samavesh-banner/context";

/**
 * The SAMAVESH band — "Single Access Mechanism for All Verticals of Empowerment
 * & Social Harmony" — as the live site carries it under the masthead. The
 * design system's component, placed by the estate-wide admin setting
 * (All pages / All but organisation pages / Only home page).
 */
export function SamaveshBand() {
  const pathname = usePathname() ?? "";
  const { shouldShow } = useSamaveshBanner();
  const isHomepage = pathname === "/website" || pathname === "/website/";
  const isOrgDetails = pathname.startsWith("/website/organisation");
  if (!shouldShow({ pathname, isHomepage, isOrgDetails })) return null;
  /*
   * tone="tint": near-black on pale saffron, India Saffron kept as the top rule
   * and the badge ring. Creative-director review, 22 Sep 2026: the full saffron
   * band (tone="dark", 6.5:1) was the loudest surface on the page, competing
   * with the banner carousel directly beneath it; tint is the component's
   * strongest contrast (17.29:1, APCA Lc 99.1) and shares its ground with the
   * drawer it opens, so band and drawer read as one object. The default tone
   * (white on saffron, 2.91:1) fails WCAG 1.4.3.
   *
   * Titles are Title Case on this estate (ui-restraint-and-copy.md); the
   * component's defaults are sentence case and match the Figma master, so the
   * website passes its own until the master and the default move together.
   */
  return (
    <SamaveshBanner
      linkAs={Link}
      tone="tint"
      drawerTitle="Choose a Portal to Visit"
      viewAllLabel="Find Your Portal"
    />
  );
}
