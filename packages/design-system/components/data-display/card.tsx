import * as React from "react";
import { cn } from "../../utils/cn";
import "./card.css";

export type CardVariant = "outlined" | "elevated";
export type CardOrientation = "vertical" | "horizontal";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Surface style. Outlined = 1px border; Elevated = shadow, no border. @default "outlined" */
  variant?: CardVariant;
  /** Layout direction. Horizontal places media beside content. @default "vertical" */
  orientation?: CardOrientation;
}

/**
 * MoSJE / UX4G Card atom.
 *
 * A styled surface container. Compose with `CardHeader`, `CardBody`,
 * `CardFooter`, `CardTitle`, `CardSubtitle`. Styled entirely via semantic
 * CSS classes that reference design tokens (--sa-*). No Tailwind, no deps.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "outlined", orientation = "vertical", className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "ds-card",
        `ds-card--${variant}`,
        `ds-card--${orientation}`,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

export type CardSectionProps = React.HTMLAttributes<HTMLDivElement>;

/** Top section of a card — typically holds a title/subtitle or header icon. */
export const CardHeader = React.forwardRef<HTMLDivElement, CardSectionProps>(
  function CardHeader({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn("ds-card__header", className)} {...rest}>
        {children}
      </div>
    );
  },
);

/** Main content region of a card. */
export const CardBody = React.forwardRef<HTMLDivElement, CardSectionProps>(
  function CardBody({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn("ds-card__body", className)} {...rest}>
        {children}
      </div>
    );
  },
);

/** Bottom section of a card — typically holds actions/buttons. */
export const CardFooter = React.forwardRef<HTMLDivElement, CardSectionProps>(
  function CardFooter({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn("ds-card__footer", className)} {...rest}>
        {children}
      </div>
    );
  },
);

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

/** Card title — Headline-5 (20/24/600). */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className, children, ...rest }, ref) {
    return (
      <h3 ref={ref} className={cn("ds-card__title", className)} {...rest}>
        {children}
      </h3>
    );
  },
);

export type CardSubtitleProps = React.HTMLAttributes<HTMLParagraphElement>;

/** Card subtitle — Body-2, muted ink. */
export const CardSubtitle = React.forwardRef<
  HTMLParagraphElement,
  CardSubtitleProps
>(function CardSubtitle({ className, children, ...rest }, ref) {
  return (
    <p ref={ref} className={cn("ds-card__subtitle", className)} {...rest}>
      {children}
    </p>
  );
});
