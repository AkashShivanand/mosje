import * as React from "react";
import { cn } from "../cn";
import "./button.css";

export type ButtonVariant = "primary" | "success" | "danger";
export type ButtonAppearance = "filled" | "outlined" | "text" | "tonal";
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
      return (
        <a
          href={href}
          className={classes}
          {...(rest as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button ref={ref} type={type} className={classes} {...rest}>
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
