import * as React from "react";
import { cn } from "../../utils/cn";
import "./skeleton.css";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS width (any valid length/percentage). @default "100%" */
  width?: string;
  /** CSS height. @default "1rem" */
  height?: string;
  /** Pill/circle shape for avatar and chip placeholders. @default false */
  circle?: boolean;
}

/**
 * MoSJE / SAMAVESH Skeleton atom.
 *
 * A shimmering placeholder shown while data is fetching. `design.md` requires
 * every loading container to render either `<Loader />` or a skeleton — never
 * an empty box. Use Skeleton when the eventual shape is known (a table row, a
 * card, a line of text) so the layout does not jump when data lands.
 *
 * Always `aria-hidden`: the placeholder is decorative, and the surrounding
 * region should carry the `aria-busy`/live-region announcement instead.
 * The shimmer is disabled under `prefers-reduced-motion`.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    { width, height, circle = false, className, style, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn("ds-skeleton", circle && "ds-skeleton--circle", className)}
        style={{ width, height, ...style }}
        {...rest}
      />
    );
  },
);

export interface SkeletonTextProps {
  /** Number of placeholder lines. @default 3 */
  lines?: number;
  className?: string;
}

/**
 * A stack of Skeleton lines approximating a paragraph. The last line is
 * deliberately short so the block reads as prose rather than a solid slab.
 */
export function SkeletonText({
  lines = 3,
  className,
}: SkeletonTextProps): React.JSX.Element {
  return (
    <div className={cn("ds-skeleton-text", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.75rem"
          width={i === lines - 1 ? "66%" : "100%"}
        />
      ))}
    </div>
  );
}

export interface SkeletonRowProps {
  /** Number of `<td>` cells to emit. @default 5 */
  cols?: number;
}

/**
 * A placeholder `<tr>` for `<DataTable>` and hand-rolled tables. Renders real
 * `<td>`s so the column widths stay stable between the loading and loaded states.
 */
export function SkeletonRow({ cols = 5 }: SkeletonRowProps): React.JSX.Element {
  return (
    <tr className="ds-skeleton-row">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}>
          <Skeleton />
        </td>
      ))}
    </tr>
  );
}
