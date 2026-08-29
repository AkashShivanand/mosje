"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  SamaveshBanner as DSSamaveshBanner,
  type SamaveshBannerProps,
} from "@mosje/design-system";
import { useSamaveshBanner } from "@/lib/samavesh-banner/context";

export interface WebsiteSamaveshBannerProps extends SamaveshBannerProps {
  /** Explicit force show/hide flag. */
  forceShow?: boolean;
}

/**
 * Website SAMAVESH Banner consumer component.
 *
 * Integrates the canonical @mosje/design-system SamaveshBanner with estate-wide
 * admin placement settings (All pages, All pages except organisation details, Only homepage).
 */
export function SamaveshBanner({
  forceShow,
  ...props
}: WebsiteSamaveshBannerProps) {
  const pathname = usePathname();
  const { shouldShow } = useSamaveshBanner();

  const isHomepage =
    pathname === "/website" ||
    pathname === "/website/" ||
    pathname === "/" ||
    pathname === "";
  const isOrgDetails = Boolean(pathname && pathname.startsWith("/website/organisation"));

  const visible = forceShow ?? shouldShow({ pathname, isHomepage, isOrgDetails });

  if (!visible) {
    return null;
  }

  return <DSSamaveshBanner {...props} />;
}
