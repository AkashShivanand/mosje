"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { PageHeader } from "../layout/page-header";
import { KpiRow } from "../dashboard/kpi-row";
import type { MetricCardProps } from "../data-display/metric-card";
import { ScreenBody } from "./screen-body";
import {
  DEFAULT_SCREEN_COPY,
  resolveScreenState,
  type ScreenStateCopy,
  type ScreenStateInput,
} from "./screen-state";
import "./screen-templates.css";

export interface OverviewScreenProps extends ScreenStateInput {
  eyebrow?: React.ReactNode;
  /**
   * The page's `<h1>`.
   *
   * The handoff greets the reader — *"Good afternoon, harijan"*. That is the
   * caller's string, not this template's: a greeting is time- and
   * name-dependent, and a template that composed one would be guessing at both.
   */
  title: string;
  /** "Last updated 14 August 2026 at 1:34 pm". */
  meta?: React.ReactNode;
  actions?: React.ReactNode;

  /**
   * Heading level for the page title. Leave at 1: a portal screen has exactly
   * one `<h1>` and this is it.
   *
   * Drop to 2 when the template is rendered INSIDE a page that already has one
   * — a documentation specimen, or a screen body embedded in another screen.
   * Same contract as `PortalLoginTemplate.headingLevel`, and the reason it
   * exists: measuring a documentation page found two `<h1>`s, because the
   * specimen is a live template rather than a picture of one.
   * @default 1
   */
  headingLevel?: 1 | 2;

  /** Filter controls — the period selector, the state picker. */
  filters?: React.ReactNode;

  /**
   * The headline figures. Four is the drawn count and a good ceiling.
   *
   * Passed as data rather than nodes so `KpiRow` can hold the row's shape while
   * they arrive — its `loading` is a **count**, not a boolean, precisely so a
   * dashboard does not move everything below it when the figures land.
   */
  kpis?: (MetricCardProps & { key?: React.Key })[];
  /** How many figures are still coming. Holds the row's shape. */
  kpisLoading?: number;

  /**
   * Cards, in reading order: how it is going, then who I am, then what moved.
   *
   * Pass `ChartCard`s — each owns its own loading, empty, error, retry and
   * provenance, so this template does not second-guess them. Two per row above
   * 1024px.
   */
  panels?: React.ReactNode[];

  /** The "Recent …" table or list, full width under the panels. */
  recent?: React.ReactNode;

  onRetry?: () => void;
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * OverviewScreen — many records, aggregated into figures.
 *
 * Drawn once in the handoff (`e-anudaan-dashboard`) and unambiguous: greeting
 * header, four KPI tiles with deltas, a chart pair, a context pair, then
 * "Recent Applications" with a **View All**. Reach for it when the reader wants
 * to know how things stand. If they want to print it and file it, that is
 * `ReportScreen`.
 *
 * **Two rules this template cannot enforce and you must.**
 *
 * A ratio takes its numerator and denominator **from the same source**. Mixing
 * them published a `138%` on this estate once, and no component can catch that
 * — only the person composing the figure can.
 *
 * A figure the register does not publish is left **off** the design, not shown
 * as "Not yet reported" (`live-data-fallback.md`). An absent KPI is one fewer
 * tile, not a tile saying nothing.
 */
export function OverviewScreen({
  eyebrow,
  title,
  meta,
  actions,
  filters,
  kpis,
  kpisLoading,
  panels,
  recent,
  onRetry,
  headingLevel = 1,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: OverviewScreenProps): React.JSX.Element {
  /* The screen is "ready" when it has anything to show at all — a dashboard
     with figures but no panels is still a dashboard. Each panel then reports
     its own state through ChartCard, which is the right granularity: one
     failing chart must not blank the page around it. */
  const status = resolveScreenState({
    ...state,
    count: (kpis?.length ?? 0) + (panels?.length ?? 0) + (recent ? 1 : 0),
  });

  return (
    <div className={cn("sa-screen", className)}>
      <PageHeader as={headingLevel} eyebrow={eyebrow} title={title} meta={meta} actions={actions} />

      {filters}

      <ScreenBody status={status} copy={copy} skeleton="cards" onRetry={onRetry}>
        <div className="sa-overview">
          {kpis || kpisLoading ? <KpiRow items={kpis} loading={kpisLoading} /> : null}

          {panels && panels.length > 0 ? (
            <div className="sa-overview__pair">
              {panels.map((panel, i) => (
                <React.Fragment key={i}>{panel}</React.Fragment>
              ))}
            </div>
          ) : null}

          {recent}
        </div>
      </ScreenBody>
    </div>
  );
}
