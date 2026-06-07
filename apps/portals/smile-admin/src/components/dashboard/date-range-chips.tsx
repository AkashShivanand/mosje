"use client";

import { useState } from "react";
import { Calendar, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
                : "text-foreground-muted hover:bg-neutral-100 hover:text-foreground",
            )}
          >
            {r}
          </button>
        ))}
        <span aria-hidden className="mx-0.5 h-4 w-px bg-stroke-200" />
        <button
          role="tab"
          aria-selected={active === "Custom"}
          onClick={() => setActive("Custom")}
          className={cn(
            "inline-flex items-center gap-xs rounded-sm px-sm py-1 text-body-3 font-semibold transition-colors duration-150",
            active === "Custom"
              ? "bg-primary text-white shadow-xs"
              : "text-foreground-muted hover:bg-neutral-100 hover:text-foreground",
          )}
        >
          <Calendar className="h-3.5 w-3.5" /> Custom
        </button>
      </div>
      <Button variant="outline" size="sm">
        <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
      </Button>
    </div>
  );
}
