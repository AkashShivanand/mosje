import type { Metadata } from "next";
import { notFound } from "next/navigation";

/* The catch-all renders not-found.tsx, but the tab title comes from the route. */
export const metadata: Metadata = {
  title: "Page Not Found | Department of Social Justice & Empowerment",
  robots: { index: false },
};

/**
 * Any /website/* address no route matches (issues NAV-09, X-IA-10).
 *
 * Without this, an unmatched path under /website fell through to the HUB's
 * root not-found — a page with no website masthead, no footer and the estate's
 * own links rather than the Department's. A catch-all has the lowest priority
 * of any route, so every real page still wins; this only calls `notFound()`,
 * which renders `app/website/not-found.tsx` inside the website layout with a
 * real 404 status.
 */
export default function MissingWebsitePage(): never {
  notFound();
}
