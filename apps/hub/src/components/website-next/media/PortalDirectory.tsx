"use client";

import Link from "next/link";
import { PortalCard, SectionTitle, portalLabel, portalSummary } from "@mosje/design-system";
import type { AppEntry } from "@mosje/design-system/registry";

interface PortalDirectoryProps {
  portals: AppEntry[];
}

/**
 * The SAMAVESH portals, grouped by the registry's own category, drawn with the
 * DS `PortalCard` — the card `/portals` and the SAMAVESH banner drawer use, so a
 * portal looks the same wherever a reader meets it.
 *
 * Which portals, and in what order, is the CALLER's: it reads the resolved
 * estate registry (`resolvePortals` + `liveEntries`), so a portal switched off at
 * `/admin/portals` disappears here too, and a planned one never becomes a link.
 *
 * A client component only because `PortalCard` is one and takes `linkAs={Link}`
 * — a component reference cannot cross the server/client boundary as a prop.
 */
export function PortalDirectory({ portals }: PortalDirectoryProps) {
  const groups = new Map<string, AppEntry[]>();
  for (const p of portals) {
    const key = p.category ?? "Other Portals";
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }

  return (
    <>
      {[...groups].map(([category, list]) => {
        const id = `portals-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        return (
          <section key={category} className="wn-portals-group" aria-labelledby={id}>
            <SectionTitle as={2} headingId={id} title={titleCase(category)} />
            <ul className="wn-portals">
              {list.map((portal) => (
                <li key={portal.path}>
                  <PortalCard
                    linkAs={Link}
                    variant="detailed"
                    code={portalLabel(portal).short}
                    name={portalLabel(portal).full}
                    href={portal.path}
                    path={portal.path}
                    description={portalSummary(portal)}
                    ctaLabel="Open Portal"
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

const SMALL = new Set(["a", "an", "the", "and", "or", "of", "for", "to", "in", "on", "with"]);

/** Registry categories are sentence case ("Finance & development corporations"); headings are Title Case. */
function titleCase(s: string): string {
  return s
    .split(" ")
    .map((w, i) => (i > 0 && SMALL.has(w.toLowerCase()) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}
