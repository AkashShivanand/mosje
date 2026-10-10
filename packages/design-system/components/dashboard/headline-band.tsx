import * as React from "react";
import { cn } from "../../utils/cn";
import { Card, CardBody, type CardTone } from "../data-display/card";
import { HeadlineFigure } from "../data-display/headline-figure";
import { SectionTitle } from "../layout/section";
import "./dashboard-band.css";

/**
 * MoSJE / SAMAVESH HeadlineBand — the figures a dashboard opens with: one large, and a few
 * beside it, on the dashboard's colour.
 *
 * Built for the website's Beneficiary Dashboard ("At a Glance", Oct 2026). The lead answers
 * the page's first question; the figures beside it are the next few. A figure that leads a
 * card further down the page can link to it (`href`) — the band is the summary, the card the
 * detail, so the figure appearing twice has a job.
 *
 * The band is named by a visually hidden heading (`title`), so it appears in the page's
 * outline and can take focus after the reader changes the area; the figures speak for
 * themselves on screen.
 *
 * DS Audit: Card (`accent="fill"`) ✅ · HeadlineFigure ✅ · SectionTitle ✅.
 */
export interface HeadlineBandFigure {
  key: React.Key;
  /** Formatted: "34.81 crore". */
  value: string;
  label: React.ReactNode;
  /** What the figure counts, and when. */
  context?: React.ReactNode;
  /** The provenance mark beside the figure. */
  mark?: React.ReactNode;
  /** Where the figure is explained — a card further down the page. */
  href?: string;
}

export interface HeadlineBandProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Names the band in the outline — "At a Glance, All India". Visually hidden. */
  title: string;
  /** @default 2 */
  headingLevel?: 2 | 3 | 4;
  headingId?: string;
  /** @default "primary" */
  tone?: CardTone;
  /** The figure the page leads with, drawn large. */
  lead: Omit<HeadlineBandFigure, "key" | "href">;
  /** The figures beside it. Two columns where there are two or more; one where there is one. */
  figures?: HeadlineBandFigure[];
  /** Names the list of figures for a screen reader. @default "Other figures" */
  figuresLabel?: string;
  /**
   * The app's router link, for a figure with `href`.
   *
   * linkAs-gate(href-only): a band whose figures carry no `href` renders no link.
   */
  linkAs?: React.ElementType;
}

export function HeadlineBand({
  title,
  headingLevel = 2,
  headingId,
  tone = "primary",
  lead,
  figures = [],
  figuresLabel = "Other figures",
  linkAs,
  className,
  ...rest
}: HeadlineBandProps) {
  const LinkTag: React.ElementType = linkAs ?? "a";
  return (
    <Card tone={tone} accent="fill" className={cn("ds-headline-band", className)} {...rest}>
      <SectionTitle as={headingLevel} headingId={headingId} title={title} className="ds-sr-only" />
      <CardBody className="ds-headline-band__body">
        <HeadlineFigure size="xl" tone="inverse" value={lead.value} label={lead.label} context={lead.context} mark={lead.mark} />
        {figures.length > 0 ? (
          <ul className={cn("ds-headline-band__side", figures.length === 1 && "ds-headline-band__side--one")} aria-label={figuresLabel}>
            {figures.map((f) => (
              <li key={f.key}>
                {f.href ? (
                  <LinkTag className="ds-headline-band__jump" href={f.href}>
                    {/* No mark inside a link: the link is the way to the figure's explanation. */}
                    <HeadlineFigure size="md" tone="inverse" value={f.value} label={f.label} context={f.context} />
                  </LinkTag>
                ) : (
                  <HeadlineFigure size="md" tone="inverse" value={f.value} label={f.label} context={f.context} mark={f.mark} />
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </CardBody>
    </Card>
  );
}
