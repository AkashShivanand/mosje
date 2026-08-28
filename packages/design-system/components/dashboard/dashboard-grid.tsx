import * as React from "react";
import { cn } from "../../utils/cn";
import "./dashboard.css";

export interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH DashboardGrid — responsive 12-column grid. Children set their
 * span via the `span` prop on `ChartCard`/`KpiRow` (or `--cmp-card-span`). On
 * mobile every child is full width.
 */
/* Forwards a ref because a section-scoped toolbar has to MEASURE its last row to
   know when to retire — see `useStickyRange`. The grid is the only element that
   knows which card that is. */
export const DashboardGrid = React.forwardRef<HTMLDivElement, DashboardGridProps>(
  function DashboardGrid({ children, className }, ref) {
    return (
      <div ref={ref} className={cn("ds-dash-grid", className)}>
        {children}
      </div>
    );
  },
);
