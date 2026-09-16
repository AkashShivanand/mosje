"use client";

import { FactStrip } from "@mosje/design-system";
import * as React from "react";

/**
 * BOTH SHAPES, because `variant` resolves from the item count and a reader
 * browsing the library would otherwise only ever meet whichever one the
 * specimen happened to pass. Neither of these sets a `variant`: three facts
 * resolve to `compact`, eight to `extended`.
 */
export function Specimen(): React.JSX.Element {
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-32)" }}>
      {/* Facts, not metrics — none of these trend. */}
      <FactStrip
        ariaLabel="About this scheme"
        items={[
          { icon: "calendar_month", value: "1998", label: "Year established" },
          { icon: "account_tree", value: "4", label: "Scheme components" },
          { icon: "location_on", value: "New Delhi", label: "Head office" },
        ]}
      />
      {/* Eight items, so this one resolves to `extended` on its own. */}
      <FactStrip
        ariaLabel="This campaign in numbers"
        items={[
          { icon: "groups", value: "345,703,321", label: "People reached" },
          { icon: "school", value: "137,209,589", label: "Youth reached" },
          { icon: "woman", value: "106,563,417", label: "Women reached" },
          { icon: "menu_book", value: "3,726,319", label: "Activities in educational institutes" },
          { icon: "healing", value: "28,29,661+", label: "Persons treated and rehabilitated" },
          { icon: "local_hospital", value: "755+", label: "Supported de-addiction centres" },
          { icon: "front_hand", value: "3,361,211", label: "Total pledges" },
          { icon: "volunteer_activism", value: "164,943", label: "Volunteers registered" },
        ]}
      />
    </div>
  );
}
