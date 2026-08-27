import * as React from "react";
import { cn } from "../../utils/cn";
import "./button-group.css";

export type ButtonGroupAlign = "start" | "end" | "between";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * REQUIRED. Names the group — "Record actions", "Pagination". A screen reader
   * announces it with the role, so four loose buttons become one labelled group.
   */
  "aria-label": string;
  /** Stack vertically instead of in a row. @default false */
  vertical?: boolean;
  /** Where the group sits in its container. @default "start" */
  align?: ButtonGroupAlign;
  /**
   * Join the buttons into one segmented control: no gap, collapsed seams, rounded only
   * at the two outer ends.
   *
   * Use it when the buttons are ALTERNATIVES to one another (a view switcher, a date
   * range). Do not use it for unrelated actions — attaching Save to Delete tells the
   * reader they are the same kind of thing, and puts the destructive one a pixel from
   * the safe one. @default false
   */
  attached?: boolean;
}

/**
 * Related actions, kept together and kept apart.
 *
 * The second half is the one that gets forgotten. UX4G 3.0 asks for 8px between
 * adjacent targets, and WCAG 2.2 §2.5.8 allows a target smaller than 24×24 to be met by
 * SPACING instead — so a row of adjacent `sm` buttons with no gap is exactly the case
 * that fails, and a group is exactly where adjacency happens. Reaching for a bare flex
 * div is what produces those rows.
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(
    { vertical = false, align = "start", attached = false, className, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "ds-btn-group",
          vertical && "ds-btn-group--vertical",
          attached && "ds-btn-group--attached",
          align === "end" && "ds-btn-group--end",
          align === "between" && "ds-btn-group--between",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
