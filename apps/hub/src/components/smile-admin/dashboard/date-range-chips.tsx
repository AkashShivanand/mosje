"use client";

import { useState } from "react";
import { cn } from "@/lib/smile-admin/utils";
import { Divider, Button, Icon } from "@mosje/design-system";

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
      <div
        role="tablist"
        aria-label="Date range"
        className="inline-flex flex-wrap items-center gap-0.5 rounded-md border border-stroke-200 bg-white p-1 shadow-xs"
      >
        {RANGES.map((r) => (
          <button
            key={r}
            role="tab"
            aria-selected={active === r}
            onClick={() => setActive(r)}
            className={cn(
              "rounded-sm px-sm py-1 text-body-3 font-semibold transition-colors duration-150",
              active === r
                ? "bg-primary text-white shadow-xs"
                : "text-ink-muted hover:bg-neutral-100 hover:text-ink",
            )}
          >
            {r}
          </button>
        ))}
        <Divider orientation="vertical" length={16} className="mx-0.5" />
        <button
          role="tab"
          aria-selected={active === "Custom"}
          onClick={() => setActive("Custom")}
          className={cn(
            "inline-flex items-center gap-xs rounded-sm px-sm py-1 text-body-3 font-semibold transition-colors duration-150",
            active === "Custom"
              ? "bg-primary text-white shadow-xs"
              : "text-ink-muted hover:bg-neutral-100 hover:text-ink",
          )}
        >
          <Icon name="calendar_today" size={14} /> Custom
        </button>
      </div>
      <Button appearance="outlined" size="sm">
        <Icon name="tune" size={14} /> Filters
      </Button>
    </div>
  );
}
