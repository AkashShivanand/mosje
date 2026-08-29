"use client";

import * as React from "react";
import { Tabs } from "@mosje/design-system";

/**
 * Tabs are controlled — `active` and `onChange` together — so a static specimen
 * renders a tab strip that cannot be switched, which documents the wrong thing.
 * Real state here means the overflow behaviour can actually be tried.
 *
 * Client component because `onChange` is a function and the docs page is a
 * Server Component (it exports `metadata`).
 */
export function TabsOverflowSpecimen(): React.JSX.Element {
  const [active, setActive] = React.useState(0);

  return (
    <Tabs
      idBase="tabs-demo"
      tabs={[
        { id: "1", label: "Overview" },
        { id: "2", label: "Eligibility" },
        { id: "3", label: "Guidelines" },
        { id: "4", label: "Grievances" },
      ]}
      active={active}
      onChange={setActive}
      overflow
    />
  );
}
