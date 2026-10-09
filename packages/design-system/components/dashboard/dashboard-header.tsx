import * as React from "react";
import { cn } from "../../utils/cn";
import { Card, CardBody, type CardTone } from "../data-display/card";
import { SectionTitle } from "../layout/section";
import "./dashboard-band.css";

/**
 * MoSJE / SAMAVESH DashboardHeader — the head of one dashboard's page: whose dashboard it is,
 * one sentence on what the scheme does, and the period the figures describe, in the
 * dashboard's colour.
 *
 * Built for the website's Beneficiary Dashboard (Oct 2026). NOTHING THE PAGE SAYS AGAIN
 * BELOW: the banner it replaced carried a kicker repeating its own title, four figures
 * repeating the cards under it, and the portal's name twice. What is left is what only the
 * head can say; the figures stay in the cards, where they are explained.
 *
 * DS Audit: Card (`accent="fill"`) ✅ · SectionTitle ✅.
 */
export interface DashboardHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: string;
  subtitle?: string;
  /** The organisation's mark, on a white ground. The title names it; it takes no accessible name. */
  mark?: React.ReactNode;
  /** @default "primary" */
  tone?: CardTone;
  /** One sentence, in the Department's words, on what the scheme does. */
  summary?: React.ReactNode;
  /** The period the figures describe, and who publishes them. */
  meta?: React.ReactNode;
  /** The one way out of the dashboard: the portal, or the Department's own page. */
  action?: React.ReactNode;
  /** @default 2 */
  headingLevel?: 2 | 3 | 4;
  headingId?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  mark,
  tone = "primary",
  summary,
  meta,
  action,
  headingLevel = 2,
  headingId,
  className,
  ...rest
}: DashboardHeaderProps) {
  return (
    <Card tone={tone} accent="fill" className={cn("ds-dashboard-header", className)} {...rest}>
      <CardBody className="ds-dashboard-header__body">
        <div className="ds-dashboard-header__brand">
          {mark ? <span className="ds-dashboard-header__mark">{mark}</span> : null}
          <SectionTitle as={headingLevel} headingId={headingId} tone="inverse" title={title} description={subtitle} />
        </div>
        {action ? <div className="ds-dashboard-header__action">{action}</div> : null}
        {summary || meta ? (
          <div className="ds-dashboard-header__text">
            {summary ? <p className="ds-dashboard-header__summary">{summary}</p> : null}
            {meta ? <p className="ds-dashboard-header__meta">{meta}</p> : null}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
