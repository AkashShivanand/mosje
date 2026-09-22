"use client";

import { useState } from "react";
import { Button, Chip, Icon } from "@mosje/design-system";

const RANGES = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Current FY",
  "Last FY",
] as const;
type Range = (typeof RANGES)[number] | "Custom";

export function DateRangeChips({ initial = "Current FY" }: { initial?: Range }) {
  const [active, setActive] = useState<Range>(initial);
  return (
    <div className="flex flex-wrap items-center justify-between gap-sm md:gap-md">
      {/* Chips, not a segmented control: seven ranges do not fit one row on a
          phone, and a chip row wraps where a segmented control squeezes. */}
      <div role="group" aria-label="Date range" className="flex flex-wrap items-center gap-xs">
        {[...RANGES, "Custom" as const].map((r) => (
          <Chip
            key={r}
            emphasis="solid"
            selected={active === r}
            onSelectedChange={() => setActive(r)}
            leadingIcon={r === "Custom" ? <Icon name="calendar_today" size={16} /> : undefined}
          >
            {r}
          </Chip>
        ))}
      </div>
      <Button appearance="outlined" size="sm" iconLeft={<Icon name="tune" size={16} />}>
        Filters
      </Button>
    </div>
  );
}
