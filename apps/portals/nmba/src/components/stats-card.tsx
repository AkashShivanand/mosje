import * as React from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({ label, value, icon, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white p-5 shadow-card",
        className
      )}
      aria-label={`${label}: ${value}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-muted">{label}</p>
          <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
        </div>
        {icon && (
          <div className="shrink-0 rounded-xl bg-brandwash p-2.5 text-navy">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
