import * as React from "react";
import { cn } from "@/lib/smile-admin/utils";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn("w-full border-separate border-spacing-0 text-body-2", className)}
        {...props}
      />
    </div>
  );
}

export function THead({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "[&_th]:sticky [&_th]:top-0 [&_th]:z-10",
        "bg-neutral-50/90 backdrop-blur",
        "text-label-3 uppercase text-ink-muted",
        className,
      )}
      {...props}
    />
  );
}

export function TR({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-primary-50/40",
        className,
      )}
      {...props}
    />
  );
}

export function TH({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) {
  return (
    <th
      className={cn(
        "whitespace-nowrap border-b border-stroke-200 bg-neutral-50/90 px-lg py-sm text-left font-semibold",
        className,
      )}
      {...props}
    />
  );
}

export function TD({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableDataCellElement>) {
  return (
    <td
      className={cn(
        "border-b border-stroke-100 px-lg py-md align-middle text-ink",
        className,
      )}
      {...props}
    />
  );
}
