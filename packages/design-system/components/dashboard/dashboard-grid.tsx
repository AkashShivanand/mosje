import * as React from "react";
import { cn } from "../../utils/cn";
import "./dashboard.css";

export interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH DashboardGrid — responsive 12-column grid. Children set their
 * span via the `span` prop on `ChartCard`/`KpiRow` (or `--ds-card-span`). On
 * mobile every child is full width.
 */
export function DashboardGrid({ children, className }: DashboardGridProps) {
  return <div className={cn("ds-dash-grid", className)}>{children}</div>;
}
