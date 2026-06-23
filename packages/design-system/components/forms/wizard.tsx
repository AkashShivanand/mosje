"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Stepper, type StepperStep } from "../feedback/stepper";
import { Button } from "../actions/button";
import { Alert } from "../feedback/alert";
import "./wizard.css";

export interface WizardProps {
  /** Step definitions (label + optional description) for the Stepper. */
  steps: StepperStep[];
  /** 0-based index of the active step (owned by the parent form). */
  current: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  /** Label for the final submit button. @default "Submit" */
  submitLabel?: string;
  /** Label for the advance button. @default "Continue" */
  nextLabel?: string;
  /** Error-summary message; rendered in a focusable alert above the actions. */
  error?: string;
  /** Ref to the error-summary container so the parent can focus it on failure. */
  errorRef?: React.Ref<HTMLDivElement>;
  /** The current step's body. */
  children: React.ReactNode;
}

const IcLeft = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IcRight = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IcSave = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M5 4h11l3 3v13H5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M8 4v5h7M8 20v-6h8v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
);

/**
 * MoSJE / SAMAVESH Wizard — the shared multi-step form shell.
 *
 * Renders the {@link Stepper}, the current step body, an optional focusable
 * error summary, and Back / Continue / Submit controls. The parent owns all
 * field state, the step index, and validation. Moves focus to the step body on
 * step change and announces the active step via a live region.
 */
export function Wizard({
  steps,
  current,
  onBack,
  onNext,
  onSubmit,
  submitLabel = "Submit",
  nextLabel = "Continue",
  error,
  errorRef,
  children,
}: WizardProps) {
  const isLast = current === steps.length - 1;
  const isFirst = current === 0;
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const prev = React.useRef(current);

  React.useEffect(() => {
    if (prev.current !== current) {
      prev.current = current;
      bodyRef.current?.focus();
    }
  }, [current]);

  return (
    <div className="ds-wizard">
      <div className="ds-wizard__stepper">
        <Stepper steps={steps} current={current} ariaLabel="Progress" />
      </div>

      {/* Announce the active step to screen readers on change (WCAG 4.1.3). */}
      <div role="status" aria-live="polite" aria-atomic="true" className="ds-sr-only">
        {`Step ${current + 1} of ${steps.length}: ${steps[current]?.label ?? ""}`}
      </div>

      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div ref={bodyRef} tabIndex={-1} className="ds-wizard__body">
        {children}
      </div>

      {error && (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        <div ref={errorRef} tabIndex={-1}>
          <Alert status="error">{error}</Alert>
        </div>
      )}

      <div className="ds-wizard__actions">
        <Button type="button" appearance="outlined" iconLeft={<IcLeft />} onClick={onBack} disabled={isFirst}>
          Back
        </Button>
        {isLast ? (
          <Button type="button" iconLeft={<IcSave />} onClick={onSubmit}>
            {submitLabel}
          </Button>
        ) : (
          <Button type="button" iconRight={<IcRight />} onClick={onNext}>
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

/** A labelled read-only field for wizard Review steps. */
export function ReviewItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="ds-review-item">
      <dt className="ds-review-item__label">{label}</dt>
      <dd className="ds-review-item__value">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}

/** A titled card grouping ReviewItems in a responsive grid. */
export function ReviewSection({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  const headingId = React.useId();
  return (
    <section aria-labelledby={headingId} className="ds-review-section">
      <h3 id={headingId} className="ds-review-section__title">
        {title}
      </h3>
      <dl className="ds-review-section__grid">{children}</dl>
    </section>
  );
}
