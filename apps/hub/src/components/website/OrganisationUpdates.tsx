"use client";

import * as React from "react";
import NextLink from "next/link";
import { Ticker, buttonClasses } from "@mosje/design-system";

export interface OrganisationUpdate {
  id: string;
  title: string;
  /** The kind of notice — the ingest's own category. */
  description?: string;
  /** Already formatted for display: "12 Aug 2026". */
  date?: string;
  /** ISO 8601, for `<time dateTime>`. */
  dateTime?: string;
  href: string;
}

/**
 * THE ORGANISATION'S NOTICE BOARD — the thin `Ticker`, wired to this app's router.
 *
 * WHY THIS WRAPPER EXISTS, AND IT IS NOT DECORATION. `Ticker` takes `linkAs` so
 * the design system can route without depending on Next, and
 * `.claude/rules/design-system-architecture.md` §2b requires every call site to
 * pass it — a component left on its `<a href>` default turns every click into a
 * full document load. But `Ticker` is a client component and `OrganisationDetail`
 * is a server one, and React refuses to send a function across that boundary:
 * calling it directly from the template threw "Functions cannot be passed
 * directly to Client Components" at render time.
 *
 * So the router link is bound on the client side of the boundary, here. The
 * server passes data — which crosses fine — and this file passes `next/link`.
 * The same reason `DocumentLibrary` takes its "view all" as an ELEMENT rather
 * than as a component prop.
 */
export function OrganisationUpdates({
  items,
  label,
  viewAllHref,
}: {
  items: OrganisationUpdate[];
  label: string;
  viewAllHref: string;
}): React.JSX.Element {
  return (
    <Ticker
      items={items}
      label={label}
      /* h2, because the strip is a top-level section of the page and the bands
         below it are h2s. Ticker defaults the label to a plain inline span. */
      labelAs="h2"
      linkAs={NextLink}
      action={
        <NextLink
          href={viewAllHref}
          className={buttonClasses("primary", "inverseOutlined", "sm")}
        >
          View All Updates
        </NextLink>
      }
    />
  );
}
