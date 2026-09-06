"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { PageHeader } from "../layout/page-header";
import { Alert } from "../feedback/alert";
import { Button } from "../actions/button";
import { Wizard } from "../forms/wizard";
import type { StepperStep } from "../feedback/stepper";
import "./screen-templates.css";

/**
 * A saved draft the reader can come back to.
 *
 * Both flavours the handoff draws are one shape. AVYAY's step 1 shows *"You have
 * a saved draft for this scheme"* with **Resume draft** and **Start fresh**;
 * its later steps show *"You are continuing a saved draft for FY 2026-27"* with
 * **Start a fresh application**. The difference is whether the reader has
 * already resumed — which is `resumed`, not two components.
 */
export interface WizardDraft {
  /** When it was last saved, already formatted. "18 Aug 2026". */
  savedAt: string;
  /** The reader is already inside the draft, so Resume would be a no-op. */
  resumed?: boolean;
  /** Financial year or other scope, where the draft is scoped to one. */
  scope?: string;
  onResume?: () => void;
  onStartFresh?: () => void;
}

export interface WizardScreenProps {
  eyebrow?: React.ReactNode;
  /** The scheme or application's name. Title Case. */
  title: string;
  /** One line saying what the whole form is for. */
  description?: React.ReactNode;

  /**
   * The steps. Three to seven is the drawn range — NAPDDR 3, SHRESHTA 6,
   * AVYAY 7 — and `Stepper` collapses rather than overflowing beyond that.
   */
  steps: StepperStep[];
  /** 0-based index of the step being filled. Owned by the parent form. */
  current: number;

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

  /** A draft banner, where one is saved. */
  draft?: WizardDraft;
  /** Anything else the step must say before the fields — an auto-populate notice. */
  notices?: React.ReactNode;

  /**
   * The validation summary, shown above the actions and focused on failure.
   *
   * A sentence, not a field list: `ErrorSummary` renders the per-field detail.
   */
  error?: string;
  errorRef?: React.Ref<HTMLDivElement>;

  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onCancel?: () => void;
  nextLabel?: string;
  submitLabel?: string;

  /** The current step's fields. `FormSection`s. */
  children: React.ReactNode;
  className?: string;
}

/**
 * WizardScreen — one record, entered in stages.
 *
 * Covers **22 of the handoff's 44 screens**, across three schemes with three
 * different step counts. Reach for it when a form has more than eight fields or
 * a statutory stage boundary; below that, `FormScreen`.
 *
 * **One stepper treatment, not two.** The handoff draws AVYAY and NAPDDR one way
 * and SHRESHTA and Grant-in-Aid another. A citizen applying to two schemes
 * should not meet two different progress bars for the same act, so this ships
 * one and the divergence is recorded in the defect report.
 *
 * The step body is the caller's, and the caller owns every field's value, the
 * step index and validation — the same division `Wizard` already sets. What this
 * adds above `Wizard` is the page: the title, the step meta line, the draft
 * banner and the notices, all of which the handoff draws on every step and none
 * of which `Wizard` knows about.
 */
export function WizardScreen({
  eyebrow,
  title,
  description,
  steps,
  current,
  draft,
  notices,
  error,
  errorRef,
  onBack,
  onNext,
  onSubmit,
  onCancel,
  nextLabel,
  submitLabel,
  headingLevel = 1,
  children,
  className,
}: WizardScreenProps): React.JSX.Element {
  const step = steps[current];

  /* "Step 2 of 7 · Organisation Details. Fields marked * are mandatory."
     Assembled here so every scheme's wizard says it the same way — the handoff
     words it three different ways across three schemes. */
  const stepMeta = step
    ? `Step ${current + 1} of ${steps.length} · ${step.label}. Fields marked * are mandatory.`
    : undefined;

  return (
    <div className={cn("sa-screen", "sa-wizard", className)}>
      <PageHeader as={headingLevel} eyebrow={eyebrow} title={title} meta={description} />

      <div className="sa-screen__notices">
        {stepMeta ? <p className="sa-wizard__step-meta">{stepMeta}</p> : null}

        {draft ? (
          <Alert
            status="warning"
            title={
              draft.resumed
                ? `You Are Continuing a Saved Draft${draft.scope ? ` for ${draft.scope}` : ""}`
                : "You Have a Saved Draft for This Scheme"
            }
            action={
              <>
                {!draft.resumed && draft.onResume ? (
                  <Button size="sm" onClick={draft.onResume}>
                    Resume draft
                  </Button>
                ) : null}
                {draft.onStartFresh ? (
                  <Button size="sm" appearance="outlined" onClick={draft.onStartFresh}>
                    {draft.resumed ? "Start a fresh application" : "Start fresh"}
                  </Button>
                ) : null}
              </>
            }
          >
            {`Last updated ${draft.savedAt}. Resume where you left off, or start with a blank form.`}
          </Alert>
        ) : null}

        {notices}
      </div>

      {/* Wizard owns the stepper, the focus move on step change, the live-region
          announcement and the Back / Continue / Submit row. Reimplementing any
          of that here would fork it. */}
      <Wizard
        steps={steps}
        current={current}
        onBack={onBack}
        onNext={onNext}
        onSubmit={onSubmit}
        nextLabel={nextLabel}
        submitLabel={submitLabel}
        error={error}
        errorRef={errorRef}
      >
        {children}
      </Wizard>

      {onCancel ? (
        <div>
          <Button appearance="text" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      ) : null}
    </div>
  );
}
