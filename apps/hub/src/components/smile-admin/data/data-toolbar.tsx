"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/smile-admin/utils";

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
  const accessibleLabel = label ?? placeholder;
  return (
    <div className={cn("relative w-full sm:w-80", className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-md top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-hint"
      />
      <input
        type="search"
        role="searchbox"
        aria-label={accessibleLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        enterKeyHint="search"
        autoComplete="off"
        className="h-10 w-full rounded-md border border-stroke-300 bg-white pl-9 pr-9 text-body-2 text-foreground shadow-xs placeholder:text-foreground-hint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-foreground-hint hover:bg-neutral-100 hover:text-foreground"
        >
          <X aria-hidden className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
