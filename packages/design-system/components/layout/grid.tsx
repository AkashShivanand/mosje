import * as React from "react";
import { cn } from "../../utils/cn";
import "./layout.css";

/**
 * How many of the grid's columns a child spans, per breakpoint. `base` applies
 * from the smallest width up; `md` and `lg` override it from the tablet and
 * desktop anchors. Omitted steps inherit the one below, so `{ base: 12, lg: 4 }`
 * is full width until desktop and then a third.
 */
export interface GridSpan {
  base?: number;
  md?: number;
  lg?: number;
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Track count. @default 12 — the estate grid; change it only for a genuinely different system. */
  columns?: number;
  /**
   * Row gap, when it should differ from the column gutter. Pass a token
   * reference such as `"var(--sa-stack-24)"`. Defaults to the gutter, which is
   * what keeps a wrapped card grid rhythmically square.
   */
  rowGap?: string;
  children: React.ReactNode;
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Columns to span, per breakpoint. @default 12 at every width */
  span?: GridSpan;
  children: React.ReactNode;
}

/**
 * Grid — the twelve-column layout grid, as a component.
 *
 * Twelve tracks at every breakpoint: a child spans more of them on a small
 * screen rather than the track count changing. That is UX4G's model (and
 * Bootstrap's), and it is why there is no "4-column mobile grid" here.
 *
 * Use it for page-level column layouts. For a row of equal cards that simply
 * wrap, a flex row is simpler and does not need column arithmetic.
 */
export function Grid({
  columns = 12,
  rowGap,
  className,
  style,
  children,
  ...rest
}: GridProps): React.JSX.Element {
  const vars = {
    ...(columns !== 12 ? { "--sa-grid-cols": String(columns) } : null),
    ...(rowGap ? { "--sa-grid-row-gap": rowGap } : null),
    ...style,
  } as React.CSSProperties;

  return (
    <div className={cn("sa-grid", className)} style={vars} {...rest}>
      {children}
    </div>
  );
}

/**
 * GridItem — one cell of a `Grid`.
 *
 * Only meaningful as a direct child of `Grid`; on its own it has no track to
 * span. Spans are clamped to 1…columns by the grid itself, so an over-wide
 * span wraps rather than overflowing.
 */
export function GridItem({
  span,
  className,
  style,
  children,
  ...rest
}: GridItemProps): React.JSX.Element {
  const vars = {
    ...(span?.base != null ? { "--sa-span-base": String(span.base) } : null),
    ...(span?.md != null ? { "--sa-span-md": String(span.md) } : null),
    ...(span?.lg != null ? { "--sa-span-lg": String(span.lg) } : null),
    ...style,
  } as React.CSSProperties;

  return (
    <div className={cn("sa-grid__item", className)} style={vars} {...rest}>
      {children}
    </div>
  );
}
