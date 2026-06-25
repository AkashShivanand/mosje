"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./dashboard.css";

export interface FilterBarProps {
  /** Optional leading label/heading for the bar. */
  title?: string;
  /** Filter controls (Select, Search, SegmentedControl, buttons…). */
  children: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH FilterBar — a styled row that hosts dashboard filter
 * controls (date range, segmented period, search). Layout-only; drop DS form
 * controls or a `SegmentedControl` inside.
 */
export function FilterBar({ title, children, className }: FilterBarProps) {
  return (
    <div className={cn("ds-filter-bar", className)}>
      {title && <span className="ds-filter-bar__title">{title}</span>}
      <div className="ds-filter-bar__controls">{children}</div>
    </div>
  );
}

export interface SegmentedOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible group label (e.g. "Period"). */
  ariaLabel: string;
  className?: string;
}

/**
 * Accessible segmented control (single-select). Common for dashboard period
 * toggles (FY / Quarter / Month). Renders an ARIA radiogroup.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn("ds-segmented", className)} role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={cn("ds-segmented__option", selected && "ds-segmented__option--active")}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
