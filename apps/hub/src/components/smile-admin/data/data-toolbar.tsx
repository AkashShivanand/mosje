"use client";

import { cn } from "@/lib/smile-admin/utils";
import { Search } from "@mosje/design-system";

export function DataToolbar({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="toolbar"
      aria-label="List controls"
      className={cn(
        "flex flex-wrap items-center gap-sm rounded-lg border border-stroke-200 bg-white p-sm shadow-xs",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SearchField({
  placeholder = "Search…",
  value,
  onChange,
  className,
  label,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  /** Accessible name for the input. Falls back to placeholder. */
  label?: string;
}) {
  return (
    <div className={cn("w-full sm:w-80", className)}>
      <Search
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClear={() => onChange("")}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
      />
    </div>
  );
}
