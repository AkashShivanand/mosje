"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { StatusScreen, type StatusKind } from "@mosje/design-system";

const KINDS: StatusKind[] = ["404", "403", "500", "maintenance", "offline"];

function isKind(v: string | null): v is StatusKind {
  return v !== null && (KINDS as string[]).includes(v);
}

/**
 * The portal's status page — `StatusScreen`, per
 * docs/design-system/screen-templates.md §2: "no record, because something
 * failed".
 *
 * It reads `?kind=` so one route serves all five outcomes, which is how the
 * shell can send a reader here without a second page per code. An unrecognised
 * or absent value falls back to `500` rather than guessing: "something went
 * wrong here" is true of every failure, and telling a reader their page was not
 * found when it was in fact a server fault sends them looking for a typo that
 * does not exist.
 *
 * The template writes the sentence for each kind. It never prints the bare
 * status code, which `data-state-completeness.md` §4 bans from a citizen's page.
 */
function PortalStatus() {
  const params = useSearchParams();
  const kind: StatusKind = isKind(params.get("kind")) ? (params.get("kind") as StatusKind) : "500";

  return (
    <StatusScreen
      kind={kind}
      primaryAction={{ label: "Go to the dashboard", href: "/portals/smile-admin/dashboard", icon: "dashboard" }}
      secondaryAction={{ label: "Report this", href: "/portals/smile-admin/immediate-review", icon: "report" }}
      // The four places an officer who lands here was most likely heading.
      wayfindingLinks={[
        {
          title: "Beneficiary List",
          description: "Everyone surveyed, with their current stage.",
          href: "/portals/smile-admin/persons",
          icon: "account_box",
        },
        {
          title: "Swashraya (Shelter Homes)",
          description: "Shelters, their capacity and occupancy.",
          href: "/portals/smile-admin/shelter-homes",
          icon: "apartment",
        },
        {
          title: "Fund Monitoring",
          description: "Sanctions, releases and utilisation.",
          href: "/portals/smile-admin/fund-monitoring",
          icon: "account_balance_wallet",
        },
        {
          title: "MIS Reports",
          description: "The eight statements, exportable and printable.",
          href: "/portals/smile-admin/mis-reports/mobilised",
          icon: "description",
        },
      ]}
    />
  );
}

export default function Page() {
  // `useSearchParams` needs a Suspense boundary, or the whole route opts out of
  // static rendering.
  return (
    <Suspense fallback={null}>
      <PortalStatus />
    </Suspense>
  );
}
