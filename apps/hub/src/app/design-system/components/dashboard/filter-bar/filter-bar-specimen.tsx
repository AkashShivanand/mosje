"use client";

import * as React from "react";
import { FilterBar, SegmentedControl, Select } from "@mosje/design-system";

type Period = "fy" | "quarter" | "month";

/**
 * The bar, running.
 *
 * `SegmentedControl` and `Select` are both controlled, so the specimen holds the
 * values — which is also the honest demonstration: `FilterBar` is layout only and
 * owns no state of its own.
 */
export function FilterBarSpecimen(): React.JSX.Element {
  const [period, setPeriod] = React.useState<Period>("fy");
  const [state, setState] = React.useState("all");

  return (
    <FilterBar title="Scheme Coverage">
      <Select
        appearance="filter"
        aria-label="State"
        value={state}
        onChange={(event) => setState(event.target.value)}
        options={[
          { value: "all", label: "All States" },
          { value: "br", label: "Bihar" },
          { value: "mh", label: "Maharashtra" },
        ]}
      />
      <SegmentedControl
        ariaLabel="Period"
        value={period}
        onChange={setPeriod}
        options={[
          { value: "fy", label: "Financial Year" },
          { value: "quarter", label: "Quarter" },
          { value: "month", label: "Month" },
        ]}
      />
    </FilterBar>
  );
}
