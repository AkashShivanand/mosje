import * as React from "react";
import { cn } from "../../utils/cn";
import { Button, type ButtonProps } from "./button";
import { Tooltip, type TooltipSide } from "../feedback/tooltip";
import "./icon-button.css";

export interface IconButtonProps
  extends Omit<
    ButtonProps,
    /*
     * `fullWidth` and `nowrap` are OMITTED, not merely discouraged. They leaked in
     * through `ButtonProps` and are meaningless here at best: this control is square
     * (`aspect-ratio: 1`), so `fullWidth` would stretch it into a rectangle and break
     * the one geometric promise it makes, and `nowrap` governs a label it does not
     * have. A prop that cannot do anything useful is a prop somebody will eventually
     * try, so the type removes them rather than the documentation asking nicely.
     */
    "children" | "iconLeft" | "iconRight" | "aria-label" | "fullWidth" | "nowrap"
  > {
  /** The glyph. Usually an `<Icon>`; it is decorative, because the label below names the control. */
  icon: React.ReactNode;
  /**
   * Corner treatment. @default "square"
   *
   * `circle` is for a control that floats free of a form's rhythm — a close button on a
   * dialog, a dismiss on a toast, a floating action. Square is the default because most
   * icon buttons sit in a toolbar or a table row beside square-cornered siblings, and a
   * round control in that line reads as a different kind of thing.
   */
  shape?: "square" | "circle";
  /**
   * Show a tooltip naming the action. `true` reuses `aria-label`; a string overrides it.
   *
   * AN ICON-ONLY CONTROL'S BIGGEST GAP IS FOR SIGHTED USERS. The `aria-label` already
   * names it for a screen reader, so the person who cannot see the glyph is served and
   * the person who can see it but does not recognise it is not. Primer, Fluent and
   * Carbon all pair their icon buttons with a tooltip for exactly this reason.
   *
   * When the tooltip text equals the accessible name it is marked
   * `duplicatesTriggerName`, so the label is not announced twice.
   */
  tooltip?: boolean | string;
  /** Which side the tooltip opens on. @default "top" */
  tooltipSide?: TooltipSide;
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
  function IconButton(
    { icon, className, shape = "square", tooltip, tooltipSide = "top", ...rest },
    ref,
  ) {
    const button = (
      <Button
        ref={ref}
        className={cn("ds-icon-btn", shape === "circle" && "ds-icon-btn--circle", className)}
        {...rest}
      >
        {/* While loading, the Button draws its spinner and this glyph would sit on top of
            it; the spinner IS the icon until the work is done. The name stays. */}
        {rest.loading ? null : (
          <span className="ds-btn__icon" aria-hidden="true">
            {icon}
          </span>
        )}
      </Button>
    );

    if (tooltip == null || tooltip === false) return button;

    const label = rest["aria-label"];
    const content = typeof tooltip === "string" ? tooltip : label;
    return (
      <Tooltip
        content={content}
        side={tooltipSide}
        // Only when the bubble repeats the accessible name — otherwise the tooltip is
        // adding information and SHOULD be announced.
        duplicatesTriggerName={content === label}
      >
        {button}
      </Tooltip>
    );
  },
);
