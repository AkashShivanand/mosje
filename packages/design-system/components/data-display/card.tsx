import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./card.css";

export type CardVariant = "outlined" | "elevated";
export type CardOrientation = "vertical" | "horizontal";
/**
 * The colour family a toned card draws its accent, tint, icon and figures in. Every stop is a
 * Tier-2 scale rung chosen so white header text clears 4.5:1 on the band.
 */
export type CardTone = "primary" | "secondary" | "info" | "success" | "warning" | "danger";
/**
 * `band` fills the header with the tone; `edge` rules the top of the card in it; `fill`
 * paints the whole card in it, with inverse ink — a hero panel inside a page column.
 */
export type CardAccent = "band" | "edge" | "fill";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Surface style. Outlined = 1px border; Elevated = shadow, no border. @default "outlined" */
  variant?: CardVariant;
  /** Layout direction. Horizontal places media beside content. @default "vertical" */
  orientation?: CardOrientation;
  /**
   * The card's colour family. It tints a `CardIcon`, colours `figure`-size `DescriptionList`
   * values, and is what `accent` and `tinted` draw in. A tone is identity, not status: a
   * `danger` card keeps its figures in ink, because a red figure on a government page reads as
   * a breach.
   */
  tone?: CardTone;
  /** How the tone shows on the card's frame. Needs `tone`; defaults it to `primary`. */
  accent?: CardAccent;
  /** Tint the whole surface in the tone's lightest rung — a dashboard tile's body. */
  tinted?: boolean;
}

/**
 * MoSJE / UX4G Card atom.
 *
 * A styled surface container. Compose with `CardHeader`, `CardBody`,
 * `CardFooter`, `CardTitle`, `CardSubtitle`. Styled entirely via semantic
 * CSS classes that reference design tokens (--sa-*). No Tailwind, no deps.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "outlined", orientation = "vertical", tone, accent, tinted = false, className, children, ...rest },
  ref,
) {
  const resolvedTone = tone ?? (accent || tinted ? "primary" : undefined);
  return (
    <div
      ref={ref}
      className={cn(
        "ds-card",
        `ds-card--${variant}`,
        `ds-card--${orientation}`,
        resolvedTone && `ds-tone-${resolvedTone}`,
        accent && `ds-card--${accent}`,
        tinted && "ds-card--tinted",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

export type CardSectionProps = React.HTMLAttributes<HTMLDivElement>;

export interface CardHeaderProps extends CardSectionProps {
  /** Rule a hairline under the header, between a long title and the figures below it. */
  divided?: boolean;
}

/** Top section of a card — typically holds a title/subtitle or header icon. */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ divided = false, className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn("ds-card__header", divided && "ds-card__header--divided", className)} {...rest}>
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

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * `sm` is Title 2 (16px/600), the dashboard scale `ChartCard` titles use — for a row of
   * tiles whose long scheme names would wrap to four lines at Title 1. @default "md"
   */
  size?: "md" | "sm";
}

/** Card title — Title 1 (20/24/600), or Title 2 at `size="sm"`. */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ size = "md", className, children, ...rest }, ref) {
    return (
      <h3 ref={ref} className={cn("ds-card__title", size === "sm" && "ds-card__title--sm", className)} {...rest}>
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

export interface CardIconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Material Symbols name, as `Icon` takes it. */
  name: string;
  /**
   * What the icon means, where it carries meaning the title does not. Leave it unset for the
   * usual case — an icon beside a title that already says what the card is — and it is hidden
   * from assistive technology.
   */
  label?: string;
}

/**
 * An icon in a rounded square, for a card's header. It takes the card's `tone`: a tint of it
 * on a plain header, white on a `band`. Placed after the title it sits at the trailing edge.
 */
export const CardIcon = React.forwardRef<HTMLSpanElement, CardIconProps>(function CardIcon(
  { name, label, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("ds-card__icon", className)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      {...rest}
    >
      <Icon name={name} size={20} />
    </span>
  );
});
