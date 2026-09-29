import { permanentRedirect } from "next/navigation";
import { dbimHref } from "@/lib/website-dbim/nav";

/**
 * `/dashboard` is the Department's Beneficiary Dashboard on dosje.gov.in, so in this
 * design the address opens Ministry › Our Performance, where that dashboard's tile is.
 *
 * Until 29 Sep 2026 this route drew the PM-AJAY dashboard. That dashboard is the
 * scheme's, not the Department's, and now sits on the PM-AJAY page under Our Scheme
 * Portals (`components/website-dbim/dashboard/PmajayDashboard.tsx`).
 */
export default function DbimDashboardRedirect() {
  permanentRedirect(dbimHref("/ministry/our-performance"));
}
