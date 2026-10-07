"use client";

import * as React from "react";
import { Card, CardBody, SectionTitle, type CardTone } from "@mosje/design-system";

/**
 * The head of a Department or portal dashboard page: whose dashboard it is, one sentence on
 * what the scheme does, and the period the figures describe — in the dashboard's colour.
 *
 * NOTHING THE PAGE SAYS AGAIN BELOW (instruction, 7 Oct 2026). The banner it replaced carried
 * a kicker repeating its own title, four figures repeating the cards directly under it, the
 * indicator count the theme chips already show, and the portal's name twice. What is left is
 * what only the head can say. The figures stay where they are explained — in the cards.
 *
 * DS Audit: Card (`accent="fill"`) ✅ · SectionTitle ✅.
 */
export function StoryHeader({
  tone,
  mark,
  title,
  subtitle,
  summary,
  meta,
  action,
  sectionLevel,
}: {
  tone: CardTone;
  /** The organisation's mark, where it has one; the title names it, so it takes no accessible name of its own. */
  mark?: React.ReactNode;
  title: string;
  subtitle?: string;
  summary?: string;
  meta?: string;
  /** The one way out of the dashboard: the portal, or the Department's published page. */
  action?: React.ReactNode;
  sectionLevel: 2 | 3;
}) {
  return (
    <Card tone={tone} accent="fill" className="pd-hero pd-head">
      <CardBody className="pd-head__body">
        <div className="pd-head__brand">
          {mark ? <span className="pd-hero__mark">{mark}</span> : null}
          <SectionTitle as={sectionLevel} headingId="pd-programme" tone="inverse" title={title} description={subtitle} />
        </div>
        {action ? <div className="pd-head__action">{action}</div> : null}
        {summary || meta ? (
          <div className="pd-head__text">
            {summary ? <p className="pd-hero__summary">{summary}</p> : null}
            {meta ? <p className="pd-hero__meta">{meta}</p> : null}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
