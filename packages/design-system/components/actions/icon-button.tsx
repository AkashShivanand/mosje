import * as React from "react";
import { cn } from "../../utils/cn";
import { Button, type ButtonProps } from "./button";
import "./icon-button.css";

export interface IconButtonProps
  extends Omit<ButtonProps, "children" | "iconLeft" | "iconRight" | "aria-label"> {
  /** The glyph. Usually an `<Icon>`; it is decorative, because the label below names the control. */
  icon: React.ReactNode;
  /**
   * REQUIRED. What the control DOES, not what the glyph depicts — "Close dialog", not
   * "Cross". This is the only name the control has.
   */
  "aria-label": string;
}

/**
 * A Button whose whole label is its icon.
 *
 * It renders a real `Button`, so variant, appearance, tone, size, disabled, loading and
 * the link form all behave identically — there is one button in this system and this is
 * a shape of it, not a second implementation.
 *
 * WHY THIS IS A COMPONENT AND NOT AN `iconOnly` PROP.
 * UX4G models icon-only as a property of the button, which is a fair reading. The reason
 * it is a component here is that `aria-label` can then be REQUIRED by the type system.
 * On an ordinary Button the accessible name arrives as `children`; a boolean prop cannot
 * make a *different* prop mandatory, so an unlabelled icon-only button would compile.
 * This estate has already learned that lesson expensively — 533 of 718 icon call sites
 * were missing their label before `Icon` started hiding itself by default. A contract
 * this easy to forget belongs in the type, not in a review checklist.
 *
 * The glyph is marked `aria-hidden` for the same reason: `Icon` renders a font ligature,
 * which is real text, so an unhidden glyph would have a screen reader announce
 * "arrow_back Close dialog".
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon, className, ...rest }, ref) {
    return (
      <Button ref={ref} className={cn("ds-icon-btn", className)} {...rest}>
        <span className="ds-btn__icon" aria-hidden="true">
          {icon}
        </span>
      </Button>
    );
  },
);
