import * as React from "react";
import { cn } from "../../utils/cn";
import "./button.css";

/**
 * `neutral` is the variant for an action that carries no semantic charge — a
 * dismiss, a reset, a "start over". It exists because there was no way to
 * express "quiet" without borrowing a signal colour: the chatbot's end-chat
 * control reached for `danger`, which spent the estate's rejection red on
 * housekeeping and made the least-used control the loudest thing in its panel.
 * A portal that fills its screen with red for non-errors has no red left when
 * an application actually fails.
 */
export type ButtonVariant = "primary" | "success" | "danger" | "neutral";
/**
 * `inverse` and `inverseOutlined` are DEPRECATED as appearances — they are a tone,
 * not a style, and modelling them here is what made them ignore `variant`. Use
 * `tone="inverse"` with `appearance="filled" | "outlined"` instead. They keep working:
 * the Ticker's documented route-out, the login shell and two Code Connect templates all
 * name them, and breaking those to rename a prop would be a poor trade.
 *
 * `tonal` is GONE. Its fill and its border were the same pale wash, so the control had
 * no edge against the page — 1.21:1 to 1.52:1 against a 3:1 requirement — and it could
 * not be darkened without becoming `outlined`. It had two consumers in 494 buttons.
 */
export type ButtonAppearance =
  | "filled"
  | "outlined"
  | "text"
  /** @deprecated Use `tone="inverse"` with `appearance="filled"`. */
  | "inverse"
  /** @deprecated Use `tone="inverse"` with `appearance="outlined"`. */
  | "inverseOutlined";

/**
 * Which ground the button sits on. `inverse` is for a solid brand-colour surface — a
 * navy header, the ticker bar, a hero band.
 *
 * It is an AXIS THAT CROSSES `appearance`, which is the whole point: as two appearance
 * words, `inverseOutlined` could only have one look, so all four variants painted the
 * same white-alpha border and `danger` silently lost its signal. Crossed, each variant
 * keeps its own intent on either ground.
 */
export type ButtonTone = "default" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Semantic colour role. @default "primary" */
  variant?: ButtonVariant;
  /** Visual style. @default "filled" */
  appearance?: ButtonAppearance;
  /** The ground the button sits on. @default "default" */
  tone?: ButtonTone;
  /** Control size. @default "md" */
  size?: ButtonSize;
  /** Icon rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon rendered after the label. */
  iconRight?: React.ReactNode;
  /** When set, the button renders as an anchor (`<a href>`) for link CTAs. */
  href?: string;
  /**
   * Busy state. Sets `aria-busy` and disables the control, so a form cannot be
   * submitted twice while the first submission is in flight.
   *
   * KEEP THE LABEL MEANINGFUL — pass "Submitting…", not a bare spinner. A control that
   * loses its name mid-action is unusable with a screen reader, and this component
   * deliberately does not swap the label for you.
   */
  loading?: boolean;
}

/**
 * MoSJE / UX4G Button atom.
 *
 * Renders a real `<button>`, styled entirely via semantic CSS classes
 * (`.ds-btn`, `.ds-btn--<variant>`, `.ds-btn--<appearance>`, `.ds-btn--<size>`)
 * that reference design tokens as CSS variables. No Tailwind, no deps.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      appearance = "filled",
      tone = "default",
      size = "md",
      iconLeft,
      iconRight,
      className,
      type = "button",
      href,
      disabled,
      loading = false,
      children,
      ...rest
    },
    ref,
  ) {
    /**
     * `tone` and the two deprecated appearance words collapse onto the SAME two classes,
     * so there is one styling path rather than two that can drift. The alias is resolved
     * here, at the edge, and nothing downstream needs to know which spelling arrived.
     */
    const inverse = tone === "inverse" || appearance === "inverse" || appearance === "inverseOutlined";
    const outlined = appearance === "outlined" || appearance === "inverseOutlined";
    const resolvedAppearance = inverse
      ? outlined
        ? "inverseOutlined"
        : "inverse"
      : appearance;

    // Busy implies disabled. A button that says "Submitting…" and still submits is the
    // double-submission this prop exists to prevent.
    const isDisabled = disabled === true || loading;

    const classes = cn(
      "ds-btn",
      `ds-btn--${variant}`,
      `ds-btn--${resolvedAppearance}`,
      `ds-btn--${size}`,
      className,
    );
    const content = (
      <>
        {iconLeft != null && (
          <span className="ds-btn__icon" aria-hidden="true">
            {iconLeft}
          </span>
        )}
        {children}
        {iconRight != null && (
          <span className="ds-btn__icon" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </>
    );

    if (href != null) {
      /**
       * A DISABLED LINK-BUTTON DROPS `href`. IT DOES NOT SWALLOW EVENTS.
       *
       * `disabled` is not a valid attribute on an anchor, so `<a disabled href>` is
       * simply an ordinary link: measured on 2026-08-25 as pointer-events:auto,
       * opacity:1, cursor:pointer, aria-disabled:null and keyboard-focusable — while
       * looking, to the person who wrote it, exactly like a disabled button.
       *
       * Removing `href` is what makes it genuinely inert, and it is better than the
       * alternatives for a reason worth keeping: an anchor without `href` is not
       * focusable and not activatable by the browser's own rules. So there is no
       * click handler to get wrong, no keydown handler to forget, and no `tabIndex`
       * to keep in sync with the disabled state. The element stays an `<a>`, because
       * what it IS has not changed — only whether it currently leads anywhere.
       *
       * `aria-disabled` carries the state to assistive tech (there is no native
       * `disabled` to read), and `.ds-btn[aria-disabled="true"]` in button.css
       * already paints every appearance's disabled treatment.
       *
       * Pinned in `e2e/design-system/button.spec.ts`.
       */
      const anchorRest = rest as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <a
          className={classes}
          {...anchorRest}
          {...(loading ? { "aria-busy": "true" as const } : {})}
          {...(isDisabled
            ? { role: "link" as const, "aria-disabled": "true" as const }
            : { href })}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...rest}
      >
        {content}
      </button>
    );
  },
);

/**
 * Returns the CSS class string for a button variant without rendering the button.
 * Use when you need a `next/link` or other element styled as a DS button:
 *   <Link href="/path" className={buttonClasses("primary", "filled", "md")}>Label</Link>
 */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  appearance: ButtonAppearance = "filled",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn("ds-btn", `ds-btn--${variant}`, `ds-btn--${appearance}`, `ds-btn--${size}`, className);
}
