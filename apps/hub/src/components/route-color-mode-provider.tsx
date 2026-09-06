"use client";

import { usePathname } from "next/navigation";
import { ColorModeProvider, defaultColorModeForPath } from "@mosje/design-system";
import type * as React from "react";

/**
 * `ColorModeProvider`, told which brand this route opens in.
 *
 * A portal opens navy and everything else opens blue, unless a brand has been
 * chosen — see `defaultColorModeForPath`, which is the single expression the
 * inline `<head>` script also reads, so first paint and hydration cannot
 * disagree.
 *
 * The path is read HERE, on the client, and never during a server render. The
 * root layout sits above every route in the estate, so a server-side read of the
 * request would make all of them dynamic for the sake of one attribute — the
 * same trade the data-mode provider records, where reading a cookie on the
 * server made 178 organisation pages dynamic so that three could carry a toggle.
 *
 * It is a client component for a second reason: the `<head>` script runs once
 * per document load, so a client-side navigation from `/website` into
 * `/portals/scw` would otherwise keep the website's blue.
 */
export function RouteColorModeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ColorModeProvider routeDefault={defaultColorModeForPath(pathname)}>
      {children}
    </ColorModeProvider>
  );
}
