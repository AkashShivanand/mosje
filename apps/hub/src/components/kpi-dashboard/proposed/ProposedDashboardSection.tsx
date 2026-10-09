import * as React from "react";
import { getPortalFeeds } from "@/lib/kpi/feeds";
import { ProposedDashboard } from "./ProposedDashboard";

/**
 * The proposed dashboard as a page section: reads the live feeds on the server (NMBA
 * today, revalidated hourly in its fetcher) and hands them to the client dashboard. The
 * Suspense boundary is the one `useSearchParams` needs.
 */
export async function ProposedDashboardSection({ sectionLevel = 2 }: { sectionLevel?: 2 | 3 }) {
  const feeds = await getPortalFeeds(["nmba"]);
  return (
    <React.Suspense fallback={null}>
      <ProposedDashboard feeds={feeds} sectionLevel={sectionLevel} />
    </React.Suspense>
  );
}
