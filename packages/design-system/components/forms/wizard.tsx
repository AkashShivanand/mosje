"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Stepper, type StepperStep } from "../feedback/stepper";
import { Button } from "../actions/button";
import { Alert } from "../feedback/alert";
import { CORNER_OCCUPANT_ATTR, RAIL_CLEAR_ATTR, UX4G_TRIGGER_ID } from "../../foundations/corner-rail";
import { FormPanel } from "./form-panel";
import { FormSectionHead } from "./form-section-head";
import "./form-section.css";
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
  /**
   * Icon on the final submit button. Defaults to a send glyph: submitting hands the
   * application over, and the save glyph it used to carry read as "save a draft".
   */
  submitIcon?: React.ReactNode;
  /**
   * Passed to the Stepper. `auto` collapses the row to a counter and dots when the
   * column is too narrow for a label per stage (under about 104px each); `never`
   * keeps every labelled stage, letting labels wrap — for a long form such as an
   * 11-step application, where the dots tell the applicant nothing. @default "auto"
   */
  stepperCollapse?: "auto" | "never";
  /**
   * Disable the advance (or submit) control while the step is not yet clearable.
   *
   * For a step that gates on WORK STILL IN FLIGHT or on a condition the user must
   * resolve here — a document set still verifying, a check the step itself failed.
   * The reason must be visible on the step: a control that is disabled with nothing
   * saying why is a dead end, so pair this with `nextBlockedReason`.
   *
   * NOT for ordinary field validation. That belongs in `onNext`, which can reject and
   * populate `error` — a form the user can submit and be told what is wrong is more
   * usable than one whose button is dark for reasons they must deduce.
   */
  nextDisabled?: boolean;
  /**
   * Why the advance control is disabled, announced politely beside it. Rendered only
   * when `nextDisabled` is set.
   */
  nextBlockedReason?: string;
  /** Error-summary message; rendered in a focusable alert above the actions. */
  error?: string;
  /** Ref to the error-summary container so the parent can focus it on failure. */
  errorRef?: React.Ref<HTMLDivElement>;
  /**
   * Heading of the step panel's head band. Defaults to the current step's label, which is
   * what the handoff draws ("Basic Identity Details" under the "Basic Details" stage).
   */
  title?: React.ReactNode;
  /** One line under the step panel's title. Defaults to the current step's description. */
  description?: React.ReactNode;
  /** Controls at the right of the step panel's head band. */
  headerActions?: React.ReactNode;
  /**
   * Leave the form from its first step. When set, the first step shows a Cancel button where
   * later steps show Back — the handoff's first step has somewhere to go, not a dead control.
   */
  onCancel?: () => void;
  /** @default "Cancel" */
  cancelLabel?: string;
  /** The current step's sub-sections. */
  children: React.ReactNode;
}

const IcLeft = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IcRight = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IcSend = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M4 12 20 4l-4 16-4-6-8-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="m12 14 8-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
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
  submitIcon,
  stepperCollapse = "auto",
  nextDisabled = false,
  nextBlockedReason,
  error,
  errorRef,
  title,
  description,
  headerActions,
  onCancel,
  cancelLabel = "Cancel",
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

  /*
   * THE PHONE BAR AND THE CORNER RAIL.
   *
   * From 0–767px the action band is STICKY (see wizard.css), which puts it across the bottom of
   * the viewport — the same edge `floating-element-placement.md` gives to the corner stack. Two
   * things keep them apart, and only one of them can be CSS:
   *
   *   · the band carries `data-sa-rail-clear`, so a TRANSIENT launcher steps aside while it would
   *     sit on the band. The statutory accessibility control never yields, and must not;
   *   · so where that control (or any other corner occupant) is actually on the page, the band
   *     keeps a gutter at its trailing edge and the primary action stops short of it.
   *
   * The gutter is measured rather than always reserved: on every portal the UX4G trigger is
   * `display: none` (the surface carries an `AccessibilityBar` instead), and reserving 56px of a
   * 375px row for a control that is not there would cost the primary its words. The late timeout
   * is the widget's own stylesheet arriving after hydration — the same lateness `useRailClearance`
   * documents.
   */
  const [cornerOccupied, setCornerOccupied] = React.useState(false);
  React.useEffect(() => {
    const inCorner = (el: Element): boolean => {
      const r = el.getBoundingClientRect();
      return (
        r.width > 0 &&
        r.height > 0 &&
        r.height <= 200 &&
        window.innerWidth - r.right < 200 &&
        window.innerHeight - r.bottom < 220
      );
    };
    const measure = () => {
      const marked = [...document.querySelectorAll(`#${UX4G_TRIGGER_ID}, [${CORNER_OCCUPANT_ATTR}]`)].some(inCorner);
      /*
       * AND WHATEVER IS ACTUALLY THERE. The UX4G widget draws its control in markup that is not
       * the id the rail knows it by — measured at 375 on the AVYAY upload step, `#uw-widget-custom-trigger`
       * was 0x0 while a 56px control sat in the corner on top of the primary action. So the corner
       * is also PROBED: whatever is painted at the rail's own resting point, if it is fixed, is an
       * occupant whatever it calls itself. Our own bar is sticky, so it is never mistaken for one.
       */
      const probe = document.elementsFromPoint(window.innerWidth - 40, window.innerHeight - 56);
      const painted = probe.some((el) => getComputedStyle(el).position === "fixed" && inCorner(el));
      setCornerOccupied(marked || painted);
    };
    measure();
    /* THE WIDGET ARRIVES LATE, AND TWICE. It is injected into `<body>` after hydration, and it
       still measures 0x0 until its own stylesheet lands — which is in `<head>`, so no mutation
       of the body announces it. The observer catches the injection and the three ticks catch the
       styling; `useRailClearance` documents the same lateness from the other side. Measured at
       375 on the AVYAY upload step, where one pass at mount found nothing and the widget then
       sat on the primary action. */
    const ticks = [300, 1200, 3000].map((ms) => window.setTimeout(measure, ms));
    const observer = new MutationObserver(measure);
    observer.observe(document.body, { childList: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      ticks.forEach((t) => window.clearTimeout(t));
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  const step = steps[current];
  const leading =
    isFirst && onCancel ? (
      <Button type="button" appearance="outlined" onClick={onCancel}>
        {cancelLabel}
      </Button>
    ) : (
      /* The word is HIDDEN on a phone, not dropped: the sticky bar has room for one set of words
         and they belong to the action that moves the applicant forward. Clipped rather than
         `display: none`, so the button keeps "Back" as its accessible name at every width. */
      <Button type="button" appearance="outlined" iconLeft={<IcLeft />} onClick={onBack} disabled={isFirst}>
        <span className="ds-wizard__back-label">Back</span>
      </Button>
    );

  return (
    <div className="ds-wizard">
      {/* On the page ground: the progress row is not a section of the form, so it gets no card. */}
      <div className="ds-wizard__stepper">
        <Stepper steps={steps} current={current} ariaLabel="Progress" collapse={stepperCollapse} />
      </div>

      {/* Announce the active step to screen readers on change (WCAG 4.1.3). */}
      <div role="status" aria-live="polite" aria-atomic="true" className="ds-sr-only">
        {`Step ${current + 1} of ${steps.length}: ${step?.label ?? ""}`}
      </div>

      <FormPanel
        title={title ?? step?.label ?? ""}
        description={description ?? step?.description}
        actions={headerActions}
        footerProps={
          {
            className: "ds-wizard__actions",
            [RAIL_CLEAR_ATTR]: "",
            "data-corner": cornerOccupied ? "occupied" : undefined,
            /* A data attribute named by a constant cannot be typed as a JSX prop — the name is
               not a literal at the type level — so the cast is at this one boundary rather than
               the attribute being spelled out and left to drift from the rail's own export. */
          } as React.HTMLAttributes<HTMLDivElement>
        }
        footer={
          <>
            {leading}
            {nextDisabled && nextBlockedReason && (
              <p className="ds-wizard__blocked" role="status" aria-live="polite">
                {nextBlockedReason}
              </p>
            )}
            {isLast ? (
              <Button type="button" iconLeft={submitIcon ?? <IcSend />} onClick={onSubmit} disabled={nextDisabled}>
                {submitLabel}
              </Button>
            ) : (
              <Button type="button" iconRight={<IcRight />} onClick={onNext} disabled={nextDisabled}>
                {nextLabel}
              </Button>
            )}
          </>
        }
      >
        <div ref={bodyRef} tabIndex={-1} className="ds-wizard__body">
          {children}
        </div>

        {error && (
          <div ref={errorRef} tabIndex={-1}>
            <Alert status="error">{error}</Alert>
          </div>
        )}
      </FormPanel>
    </div>
  );
}

/** A labelled read-only field for wizard Review steps. */
export function ReviewItem({
  label,
  value,
  wide = false,
}: {
  label: string;
  value?: string;
  /** Span the full row of the ReviewSection grid — for multi-attribute records. */
  wide?: boolean;
}) {
  return (
    <div className={cn("ds-review-item", wide && "ds-review-item--wide")}>
      <dt className="ds-review-item__label">{label}</dt>
      <dd className="ds-review-item__value">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}

/**
 * A review sub-section: the same uppercase head and rule as FormSection, over a label-value
 * grid. Four columns for short values (a name, a date), two for long ones (an address).
 */
export function ReviewSection({
  title,
  columns = 2,
  badge,
  actions,
  as = 3,
  children,
}: {
  title: React.ReactNode;
  /** @default 2 */
  columns?: 2 | 3 | 4;
  /** A badge between the label and the rule — "DigiLocker". */
  badge?: React.ReactNode;
  /** Controls at the end of the head row — "Edit". */
  actions?: React.ReactNode;
  /** @default 3 */
  as?: 2 | 3 | 4;
  children: React.ReactNode;
}) {
  const headingId = React.useId();
  return (
    <section aria-labelledby={headingId} className="ds-form-section">
      <FormSectionHead id={headingId} title={title} as={as} badge={badge} actions={actions} />
      <dl className={cn("ds-form-section__grid", `ds-form-section__grid--${columns}`, "ds-review-section__grid")}>{children}</dl>
    </section>
  );
}
