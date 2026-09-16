"use client";

import { useRouter } from "next/navigation";
import type * as React from "react";
import { StatusScreen } from "@mosje/design-system";

/**
 * The one "not found" an applicant sees for an application page — a reference that does not
 * exist AND a reference that belongs to another organisation. They must read identically, or a
 * guessed reference would confirm that someone else's file exists (security audit S05).
 */
export function applicationNotFoundProps(
  router: ReturnType<typeof useRouter>,
): React.ComponentProps<typeof StatusScreen> {
  return {
    kind: "404",
    title: "Application Not Found",
    description:
      "No application with this reference is on your account. It may have been withdrawn, or the link may be incomplete.",
    primaryAction: { label: "Back to My Applications", onClick: () => router.push("/portals/e-anudaan/ngo/my-applications") },
    // Inside a signed-in portal: no website search box and no website "Popular Destinations".
    searchUrl: null,
    wayfindingLinks: [],
  };
}

export function NgoApplicationNotFound() {
  const router = useRouter();
  return <StatusScreen {...applicationNotFoundProps(router)} />;
}
