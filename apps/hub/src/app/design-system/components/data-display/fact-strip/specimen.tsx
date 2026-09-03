"use client";

import { FactStrip } from "@mosje/design-system";
import * as React from "react";

/** Facts, not metrics — none of these trend. */
export function Specimen(): React.JSX.Element {
  return (
    <FactStrip
      ariaLabel="About this scheme"
      items={[
        { icon: "calendar_month", value: "1998", label: "Year established" },
        { icon: "account_tree", value: "4", label: "Scheme components" },
        { icon: "location_on", value: "New Delhi", label: "Head office" },
      ]}
    />
  );
}
