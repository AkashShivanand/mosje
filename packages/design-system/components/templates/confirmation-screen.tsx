"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import { PageHeader } from "../layout/page-header";
import "./screen-templates.css";

/** One thing that will happen next, and roughly when. */
export interface ConfirmationStep {
  /** What happens — "District verification". Title Case. */
  title: string;
  /** Who does it and by when, in the department's words. */
  description?: React.ReactNode;
  /** "Within 15 working days". Omit where the department publishes no timeline. */
  when?: string;
}

/** A fact worth keeping — the scheme, the year, the amount applied for. */
export interface ConfirmationFact {
  label: string;
  value: React.ReactNode;
}

export interface ConfirmationScreenProps {
  eyebrow?: React.ReactNode;
  /** @default "Application Submitted" */
  title?: string;
  /** @default 1 */
  headingLevel?: 1 | 2;

  /**
   * The reference number, exactly as the register holds it.
   *
   * Required, and the reason this template exists: **no source draws a
   * confirmation screen at all.** The handoff's citizen journey ends at submit,
   * so a citizen who submits has nothing to quote at a counter and no way to
   * prove they applied (`docs/audit/figma-handoff-defects-2026-09-06.md` §1 —
   * "post-submit confirmation" is among the archetypes absent entirely).
   */
  reference: string;
  /** @default "Reference number" */
  referenceLabel?: string;
  /** When it was received, as a citizen would read it. */
  submittedAt?: string;

  /** A short standfirst under the reference. */
  intro?: React.ReactNode;
  facts?: ConfirmationFact[];

  /** What happens next. Omit where the department publishes no process. */
  nextSteps?: ConfirmationStep[];
  /** @default "What Happens Next" */
  nextStepsTitle?: string;

  /** Download the receipt, track the application, return to the dashboard. */
  actions?: React.ReactNode;
  /** Who to contact and how, when the citizen has a question. */
  support?: React.ReactNode;
  className?: string;
}

/**
 * ConfirmationScreen — committed, with a reference number.
 *
 * **It has no data states, and that is deliberate.** Every other template
 * resolves a reading; this one renders a fact the caller already holds, because
 * a confirmation that could be "loading" is a confirmation the citizen cannot
 * trust. If the submit has not settled, you are still on the screen before this
 * one.
 *
 * **The reference is the screen.** It is set in the largest type on the page,
 * it is selectable text rather than an image, and it is the first thing after
 * the heading — a citizen photographing this screen at a common service centre
 * must capture the number without scrolling.
 *
 * `nextSteps` is a numbered sequence because it genuinely is one: verification
 * follows submission and precedes sanction. That is the one case where numbered
 * markers carry information rather than decorating a list.
 */
export function ConfirmationScreen({
  eyebrow,
  title = "Application Submitted",
  headingLevel = 1,
  reference,
  referenceLabel = "Reference number",
  submittedAt,
  intro,
  facts,
  nextSteps,
  nextStepsTitle = "What Happens Next",
  actions,
  support,
  className,
}: ConfirmationScreenProps): React.JSX.Element {
  const stepsHeadingId = React.useId();

  return (
    <div className={cn("sa-screen", "sa-confirmation", className)}>
      <PageHeader
        as={headingLevel}
        eyebrow={eyebrow}
        title={title}
        meta={submittedAt ? `Received ${submittedAt}` : undefined}
      />

      {/* `role="status"`: on a client-routed submit the heading changes but the
          page does not reload, so without this a screen-reader user is left on
          the button they pressed with no announcement that anything happened. */}
      <div className="sa-confirmation__panel" role="status">
        <Icon name="task_alt" size={40} className="sa-confirmation__icon" aria-hidden />
        <p className="sa-confirmation__ref-label">{referenceLabel}</p>
        <p className="sa-confirmation__ref">{reference}</p>
        {intro ? <p className="sa-confirmation__intro">{intro}</p> : null}
      </div>

      {facts && facts.length > 0 ? (
        <dl className="sa-confirmation__facts">
          {facts.map((fact) => (
            <div key={fact.label} className="sa-confirmation__fact">
              <dt className="sa-confirmation__fact-label">{fact.label}</dt>
              <dd className="sa-confirmation__fact-value">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {nextSteps && nextSteps.length > 0 ? (
        <section aria-labelledby={stepsHeadingId} className="sa-confirmation__next">
          <h2 id={stepsHeadingId} className="sa-confirmation__next-title">
            {nextStepsTitle}
          </h2>
          <ol className="sa-confirmation__steps">
            {nextSteps.map((step) => (
              <li key={step.title} className="sa-confirmation__step">
                <p className="sa-confirmation__step-title">{step.title}</p>
                {step.description ? (
                  <p className="sa-confirmation__step-desc">{step.description}</p>
                ) : null}
                {step.when ? (
                  <p className="sa-confirmation__step-when">{step.when}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {actions ? <div className="sa-confirmation__actions">{actions}</div> : null}
      {support ? <p className="sa-confirmation__support">{support}</p> : null}
    </div>
  );
}
