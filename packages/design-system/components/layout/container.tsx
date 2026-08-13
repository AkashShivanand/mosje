import * as React from "react";
import { cn } from "../../utils/cn";
import "./layout.css";

/** Which cap the content column takes. */
export type ContainerSize = "page" | "narrow" | "prose" | "full";

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * `page` (default) — the estate content cap: UX4G's 1200, widening to 1320
   * above the desktop-XL anchor. `narrow` — 960, for a single-column form or
   * article. `prose` — 75ch, for long-form reading. `full` — no cap, for a
   * band that genuinely spans the viewport.
   */
  size?: ContainerSize;
  /** Element to render. Use `"section"` or `"main"` where that is the real role. @default "div" */
  as?: "div" | "section" | "main" | "article" | "header" | "footer";
  children: React.ReactNode;
}

/**
 * Container — the centred content column.
 *
 * Applies the cap AND the responsive side margin together, because they are
 * one rule: the effective width is `min(cap, viewport − 2 × margin)`. That is
 * why it must not be given its own horizontal padding — the margin is already
 * here, and adding more silently narrows the column below the grid.
 *
 * Use it for every page-level content column. Do NOT reach for it to centre a
 * small element inside a card; that is a flex/grid job, and a Container there
 * would apply a page margin in a place that has none.
 */
export function Container({
  size = "page",
  as: Tag = "div",
  className,
  children,
  ...rest
}: ContainerProps): React.JSX.Element {
  return (
    <Tag
      className={cn("sa-container", size !== "page" && `sa-container--${size}`, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
