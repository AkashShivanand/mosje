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
  // Dark ink on the unchanged India Saffron: 6.5:1. The component's default
  // (white on saffron) measures 2.91:1 and fails WCAG 1.4.3 (axe, 22 Sep 2026).
  return <SamaveshBanner linkAs={Link} tone="dark" />;
}
