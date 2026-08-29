"use client";

import * as React from "react";
import { AppSwitcherPanel } from "@mosje/design-system";

/**
 * `onNavigate` is a function, so this cannot be rendered from the docs page —
 * that page is a Server Component (it exports `metadata`) and a function prop
 * cannot cross the boundary.
 *
 * The handler is a no-op rather than a real navigation: this is a specimen
 * inside documentation, and a reader clicking an entry to see what it looks like
 * should not be thrown out of the page they are reading.
 */
export function AppSwitcherPanelSpecimen(): React.JSX.Element {
  return <AppSwitcherPanel pathname="/portals/pm-ajay" onNavigate={() => {}} />;
}
