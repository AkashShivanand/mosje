"use client";

import * as React from "react";
import Link from "next/link";
import { ContentNav, type ContentNavGroup } from "@mosje/design-system";

export interface OrganisationIndexProps {
  ariaLabel: string;
  groups: ContentNavGroup[];
}

/**
 * The page index, with the section currently in view marked.
 *
 * THE SCROLL-SPY LIVES HERE, NOT IN THE DESIGN SYSTEM. `ContentNav` takes
 * `current` as a prop and works it out for nobody — deliberately, so that a page
 * rendering an index does not ship scroll listeners just by existing. This
 * wrapper is the one client component on an otherwise entirely server-rendered
 * page, and all it does is decide which `href` is active.
 *
 * WHY IntersectionObserver AND NOT A SCROLL HANDLER. A scroll handler runs on
 * every frame of every scroll and has to measure each section to answer the
 * question; the observer is told only when a boundary is crossed. On a page with
 * six sections that is the difference between work per frame and work per
 * section.
 *
 * THE ROOT MARGIN IS THE WHOLE TRICK. `-45% 0px -50% 0px` collapses the
 * viewport to a thin band just above the middle, so "the current section" means
 * "the one crossing the middle of the screen" — not "the one whose top edge is
 * nearest", which flickers between two sections whenever a short one is on
 * screen, and not "the topmost visible", which marks the previous section for
 * the whole time the next one is being read.
 */
export function OrganisationIndex({ ariaLabel, groups }: OrganisationIndexProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  // Only in-page anchors can ever be the active section; a PDF on another host
  // cannot be "in view". Derived from the same groups the nav renders, so the
  // two cannot fall out of step.
  const sectionIds = React.useMemo(
    () =>
      groups
        .flatMap((g) => g.items)
        .filter((i) => i.external !== true && i.href.startsWith("#"))
        .map((i) => i.href.slice(1)),
    [groups],
  );

  React.useEffect(() => {
    // Respect the reader who has asked for less motion by not moving the
    // highlight around under them as they scroll.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = sectionIds
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

    // The observer reports changes, not state, so the set of what is currently
    // crossing the band is kept here and the topmost of it wins. Asking the
    // callback's own entries alone marks nothing at the moment a section leaves
    // the band and its neighbour has not yet entered.
    const inBand = new Set<string>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target.id);
          else inBand.delete(e.target.id);
        }
        const first = sectionIds.find((id) => inBand.has(id));
        setActiveId(first ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [sectionIds]);

  const marked = React.useMemo<ContentNavGroup[]>(
    () =>
      groups.map((g) => ({
        ...g,
        items: g.items.map((i) => ({
          ...i,
          current: activeId !== null && i.href === `#${activeId}`,
        })),
      })),
    [groups, activeId],
  );

  return <ContentNav ariaLabel={ariaLabel} linkAs={Link} groups={marked} />;
}
