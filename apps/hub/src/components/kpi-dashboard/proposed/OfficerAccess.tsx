"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Icon } from "@mosje/design-system";
import { useDashboardViewer } from "@/lib/kpi/viewer";

/**
 * OFFICER LOGIN, IN THE PAGE BANNER (approved 8 Oct 2026). Filters change which figures the
 * page shows; this changes who is looking. Beside the filters it read as one more filter, so it
 * stands on the page title's line instead, where a page's own actions belong — visible on every
 * dashboard page, apart from the controls that narrow the figures.
 *
 * Drawn only while nobody is signed in and the sign-in page is not already open; signed in, the
 * Officer View notice above the dashboard carries the Sign Out.
 *
 * DS Audit: Button ✅ · Icon ✅.
 */
export function OfficerAccess({ tone = "inverse" }: { tone?: "inverse" | "default" }) {
  const params = useSearchParams();
  const role = useDashboardViewer();
  if (role || params.get("view") === "login") return null;
  const next = new URLSearchParams(params.toString());
  next.set("view", "login");
  return (
    <Button
      appearance="outlined"
      tone={tone === "inverse" ? "inverse" : undefined}
      size="md"
      href={`?${next.toString()}`}
      linkAs={Link}
      iconLeft={<Icon name="login" size={20} />}
    >
      Officer Login
    </Button>
  );
}
