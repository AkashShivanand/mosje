import * as React from "react";
import { cn } from "../../utils/cn";
import "./headline-figure.css";

export interface HeadlineFigureProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The figure, formatted: "34.81 Cr". */
  value: string;
  /** What it counts, as a phrase that completes the figure: "people reached by …". */
  label: React.ReactNode;
  /**
   * The figure on a human scale, from a published denominator: "29 in every 100 people,
   * by Census 2011". Leave it out where no published denominator exists.
   */
  context?: React.ReactNode;
  /** A mark beside the figure — a Live or Illustrative chip. */
  mark?: React.ReactNode;
  /** `xl` leads a page; `lg` and `md` stand beside it. @default "lg" */
  size?: "xl" | "lg" | "md";
  /** `inverse` on a brand or inverse Band. @default "default" */
  tone?: "default" | "inverse";
}

/**
 * MoSJE / SAMAVESH HeadlineFigure — a figure set in display type with the phrase it
 * completes. No frame: it belongs on a hero band or an open page, where a card would only
 * box in what should read as a sentence.
 *
 * A MetricCard is a tile in a row of tiles; this is the one number a page leads with. The
 * figure comes first in the reading order, then the phrase, then its context.
 */
export const HeadlineFigure = React.forwardRef<HTMLDivElement, HeadlineFigureProps>(function HeadlineFigure(
  { value, label, context, mark, size = "lg", tone = "default", className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn("ds-headline", `ds-headline--${size}`, tone === "inverse" && "ds-headline--inverse", className)} {...rest}>
      <p className="ds-headline__figure">
        <span className="ds-headline__value">{value}</span>
        {mark ? <span className="ds-headline__mark">{mark}</span> : null}
      </p>
      <p className="ds-headline__label">{label}</p>
      {context ? <p className="ds-headline__context">{context}</p> : null}
    </div>
  );
});
