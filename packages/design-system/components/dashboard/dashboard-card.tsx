import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { Icon } from "../utilities/icon";
import { Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardTitle, type CardTone } from "../data-display/card";
import "./dashboard-card.css";

/**
 * MoSJE / SAMAVESH DashboardCard — one dashboard, summarised, on a page that lists several.
 *
 * Built for the website's Beneficiary Dashboard (Oct 2026), where each Department and portal
 * dashboard is a card: its mark, its name, the scheme under it, one lead figure, a few facts,
 * and "View Dashboard". It is the card a "choose a dashboard" page is made of anywhere on the
 * estate.
 *
 * THE WHOLE CARD OPENS ITS DASHBOARD. A card has one destination, so its one link is stretched
 * over the card: a reader can press anywhere, a screen reader still meets one named link, and
 * the keyboard one tab stop. What is interactive inside the card — a map's states, a chart's
 * marks, a source note — sits above the stretch and keeps its own behaviour. Without `href`
 * the card is a plain summary card with no link and no footer.
 *
 * DS Audit: Card (`accent="edge"`) ✅ · CardHeader / CardTitle / CardSubtitle ✅ · Button ✅ · Icon ✅.
 */
interface DashboardCardBaseProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The dashboard's name — a portal's, or the Department's. */
  title: string;
  /** The scheme it reports, where the title alone would not say. */
  subtitle?: string;
  /**
   * The organisation's mark (`OrgLogo`) or a `CardIcon`. The title names the card, so the mark
   * takes no accessible name of its own.
   */
  mark?: React.ReactNode;
  /** The dashboard's colour family, drawn as the card's top edge. @default "neutral" */
  tone?: CardTone;
  /** One line above the figures, e.g. that the dashboard publishes All-India figures only. */
  note?: React.ReactNode;
  /** The lead figure — usually a `HeadlineFigure`. */
  figure?: React.ReactNode;
  /** Everything after the lead figure: facts, a small chart, a sentence. */
  children?: React.ReactNode;
  /** The visible link text. @default "View Dashboard" */
  ctaLabel?: string;
  /**
   * The app's router link (`next/link`), so opening a dashboard is not a full page load.
   *
   * linkAs-gate(href-only): a DashboardCard with no `href` is a summary card with no link.
   */
  linkAs?: React.ElementType;
}

/**
 * With `href` the card is a link and `linkLabel` is required: every card's visible link reads
 * the same, so each needs its own accessible name. Without `href` it is a summary card.
 */
export type DashboardCardProps = DashboardCardBaseProps &
  (
    | {
        /** The dashboard the card opens. */
        href: string;
        /** The link's accessible name — "View the NMBA Dashboard". */
        linkLabel: string;
      }
    | { href?: undefined; linkLabel?: undefined }
  );

export function DashboardCard({
  title,
  subtitle,
  mark,
  tone,
  note,
  figure,
  children,
  href,
  linkLabel,
  ctaLabel = "View Dashboard",
  linkAs,
  className,
  ...rest
}: DashboardCardProps) {
  return (
    <Card tone={tone} accent="edge" className={cn("ds-dashboard-card", href && "ds-dashboard-card--link", className)} {...rest}>
      <CardHeader>
        {mark}
        <div className="ds-dashboard-card__titles">
          <CardTitle size="sm">{title}</CardTitle>
          {subtitle ? <CardSubtitle>{subtitle}</CardSubtitle> : null}
        </div>
      </CardHeader>
      <CardBody className="ds-dashboard-card__body">
        {note ? <p className="ds-dashboard-card__note">{note}</p> : null}
        {figure}
        {children}
      </CardBody>
      {href ? (
        <CardFooter>
          <Button
            appearance="text"
            size="sm"
            href={href}
            linkAs={linkAs}
            aria-label={linkLabel}
            iconRight={<Icon name="arrow_forward" size={16} />}
            className="ds-dashboard-card__link"
          >
            <span className="ds-dashboard-card__cta">{ctaLabel}</span>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}

export interface DashboardCardListItem {
  key: React.Key;
  /** An anchor another part of the page can jump to. */
  id?: string;
  content: React.ReactNode;
}

export interface DashboardCardListProps extends Omit<React.HTMLAttributes<HTMLUListElement>, "children"> {
  items: DashboardCardListItem[];
  /**
   * How the row is shared out, decided by HOW MANY cards there are — a card with nothing to show
   * is not drawn, so the list cannot assume a count.
   *
   * - `balanced`: one takes the width; three share a row; two, four and five lead with a wide
   *   and a narrower card (7 + 5) and the rest share the next row.
   * - `lead`: for a list whose first card carries a map. Four or five lead with 7 + 5 and the
   *   rest share the next row; three lead with one across the width and two beneath; two share
   *   the row equally; one takes the width.
   *
   * Below 1280px cards pair up; on a phone they stack. @default "balanced"
   */
  arrangement?: "balanced" | "lead";
}

/** The cards of a dashboards page, laid out for the number it holds, with no hole in any row. */
export function DashboardCardList({ items, arrangement = "balanced", className, ...rest }: DashboardCardListProps) {
  if (items.length === 0) return null;
  return (
    <ul
      className={cn(
        "ds-dashboard-cards",
        `ds-dashboard-cards--n${Math.min(items.length, 5)}`,
        arrangement === "lead" && "ds-dashboard-cards--lead",
        className,
      )}
      {...rest}
    >
      {items.map((item) => (
        <li key={item.key} id={item.id}>
          {item.content}
        </li>
      ))}
    </ul>
  );
}
