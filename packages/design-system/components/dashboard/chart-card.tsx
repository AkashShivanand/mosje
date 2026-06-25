import * as React from "react";
import { cn } from "../../utils/cn";
import "./dashboard.css";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  /** Header actions slot (filters, menu, export button). */
  actions?: React.ReactNode;
  /** Column span (1–12) inside a `DashboardGrid` at ≥768px. Full width on mobile. */
  span?: number;
  /** Show a loading shimmer instead of the body. */
  loading?: boolean;
  /** Show the empty state instead of the body. */
  empty?: boolean;
  emptyLabel?: string;
  footer?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/**
 * MoSJE / SAMAVESH ChartCard — titled container for a chart or any dashboard
 * widget. Standardises header (title + actions), body, loading/empty states and
 * grid span so every portal dashboard composes the same way.
 */
export function ChartCard({
  title,
  subtitle,
  actions,
  span,
  loading = false,
  empty = false,
  emptyLabel = "No data to display.",
  footer,
  className,
  children,
}: ChartCardProps) {
  const style = span ? ({ ["--ds-card-span" as string]: String(span) } as React.CSSProperties) : undefined;
  return (
    <section className={cn("ds-chart-card", className)} style={style}>
      <header className="ds-chart-card__head">
        <div className="ds-chart-card__titles">
          <h3 className="ds-chart-card__title">{title}</h3>
          {subtitle && <p className="ds-chart-card__subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="ds-chart-card__actions">{actions}</div>}
      </header>
      <div className="ds-chart-card__body">
        {loading ? (
          <div className="ds-chart-card__skeleton" aria-hidden="true" />
        ) : empty ? (
          <p className="ds-chart__empty">{emptyLabel}</p>
        ) : (
          children
        )}
      </div>
      {footer && <footer className="ds-chart-card__footer">{footer}</footer>}
    </section>
  );
}
