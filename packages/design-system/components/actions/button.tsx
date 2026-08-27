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
 * `inverse`/`inverseOutlined` are for placing a button directly on a solid
 * brand-colour surface (e.g. a navy page header) — the only two patterns
 * every portal was otherwise hand-rolling via a `className` override.
 */
export type ButtonAppearance = "filled" | "outlined" | "text" | "tonal" | "inverse" | "inverseOutlined";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Semantic colour role. @default "primary" */
  variant?: ButtonVariant;
  /** Visual style. @default "filled" */
  appearance?: ButtonAppearance;
  /** Control size. @default "md" */
  size?: ButtonSize;
  /** Icon rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon rendered after the label. */
  iconRight?: React.ReactNode;
  /** When set, the button renders as an anchor (`<a href>`) for link CTAs. */
  href?: string;
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
      size = "md",
      iconLeft,
      iconRight,
      className,
      type = "button",
      href,
      disabled,
      children,
      ...rest
    },
    ref,
  ) {
    const classes = cn(
      "ds-btn",
      `ds-btn--${variant}`,
      `ds-btn--${appearance}`,
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
          {...(disabled
            ? { role: "link" as const, "aria-disabled": "true" as const }
            : { href })}
        >
          {content}
        </a>
      );
    }

    return (
      <button ref={ref} type={type} className={classes} disabled={disabled} {...rest}>
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
