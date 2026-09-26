import { redirect } from "next/navigation";

/**
 * RETIRED — this page is now `/portals`.
 *
 * It listed eight portals with a hand-written description each. `/portals`
 * (`PortalsExplorer`) lists all 21 from the registry WITH free-text search, a
 * category filter, a live/planned filter and live-first ordering — a strict
 * superset, already built, already maintained. Keeping both meant two
 * directories of the same objects drifting apart, which is the failure this
 * estate has already had four times over.
 *
 * A redirect rather than a delete: the path is in the website search index and
 * may be linked externally, and a 404 is a worse answer than the better page.
 */
export default function CitizenPortalsPage() {
  redirect("/portals");
}
