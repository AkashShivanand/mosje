import * as React from "react";
import { cn } from "../../utils/cn";
import "./stepper.css";

/**
 * The state a single stage is in.
 *
 * `current` is never written by a caller — it is derived from the `current`
 * index, so a stepper cannot disagree with the form it describes.
 */
export type StepStatus = "upcoming" | "current" | "complete" | "error" | "disabled";

export interface StepperStep {
  /** UX4G "Label Header". Title Case, one to three words — "Bank Account". */
  label: string;
  /** UX4G "Supporting Helper Text". Shown at `md` on wider viewports only. */
  description?: string;
  /**
   * Override the state this stage would otherwise be given by its position.
   *
   * Use it for the three things an index cannot express: a stage the applicant
   * completed out of order, a stage whose validation failed, and a stage that
   * is not yet open to them.
   */
  status?: Exclude<StepStatus, "current">;
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** The ordered stages. */
  steps: StepperStep[];
  /** 0-based index of the active stage. Earlier stages default to complete. */
  current: number;
  /** Accessible name for the progress list. @default "Progress" */
  ariaLabel?: string;
  /** Stack the stages down the page instead of across it. @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** `sm` is UX4G's Compact size — for side panels and dense flows. @default "md" */
  size?: "md" | "sm";
  /** Label beside the marker rather than beneath it. Horizontal only. @default "bottom" */
  labelPlacement?: "bottom" | "right";
  /**
   * Whether the row may collapse to the compact bar — a counter, the current
   * stage's name and a row of dots — when it is too narrow to draw every label.
   * `never` keeps the full row at every width. @default "auto"
   */
  collapse?: "auto" | "never";
  /**
   * Opt in to letting the applicant return to a stage. Only stages that are
   * complete or in error become buttons; upcoming and disabled stages stay
   * static text, so a control is never drawn that cannot be used.
   */
  onStepSelect?: (index: number) => void;
}

const IcCheck = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
    <path
      d="M5 10.5 8.5 14l6.5-7.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** An error is carried by a shape as well as by colour (WCAG 1.4.1). */
const IcAlert = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
    <path
      d="M10 5.5v5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="10" cy="14.2" r="1.15" fill="currentColor" />
  </svg>
);

/** A stage the applicant cannot open yet reads as a rule, not as a number. */
const IcLocked = () => (
  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" aria-hidden="true">
    <rect
      x="5"
      y="9"
      width="10"
      height="7"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M7.5 9V7a2.5 2.5 0 0 1 5 0v2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const SR_TEXT: Record<StepStatus, string> = {
  complete: "completed",
  current: "current step",
  error: "has errors",
  disabled: "not yet available",
  upcoming: "upcoming",
};

/**
 * One expression resolves a stage's state, and the marker, the label, the
 * connector, the hidden text and the compact counter all read it. Two views of
 * one stage can then never disagree on screen.
 */
function resolveStatus(step: StepperStep, index: number, current: number): StepStatus {
  if (index === current) return "current";
  if (step.status) return step.status;
  return index < current ? "complete" : "upcoming";
}

function Marker({ status, index }: { status: StepStatus; index: number }) {
  return (
    <span className="ds-stepper__marker" aria-hidden="true">
      {status === "complete" ? (
        <IcCheck />
      ) : status === "error" ? (
        <IcAlert />
      ) : status === "disabled" ? (
        <IcLocked />
      ) : (
        <span className="ds-stepper__num">{index + 1}</span>
      )}
    </span>
  );
}

/**
 * MoSJE / SAMAVESH Stepper — progress through a multi-stage form.
 *
 * A real ordered list of stages, each drawn as a numbered node on a connector
 * track: a tick for a completed stage, a filled node for the one the applicant
 * is on, an alert glyph for one whose validation failed, and muted nodes for
 * what remains. Horizontal or vertical, at two sizes, with the label beneath
 * the node or beside it.
 *
 * Where its own column is too narrow to draw a label per stage — fewer than
 * about 104px each — it collapses to the compact bar UX4G specifies: a counter,
 * the current stage's name, and a row of dots. The full list stays in the
 * accessibility tree, so nothing is lost to a screen reader at any width.
 *
 * It is a display of position by default. Passing `onStepSelect` turns the
 * stages the applicant has already finished into buttons; the ones ahead of
 * them stay text.
 *
 * Styled entirely through `.ds-stepper*` classes bound to `--sa-*` tokens.
 */
export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(function Stepper(
  {
    steps,
    current,
    ariaLabel = "Progress",
    orientation = "horizontal",
    size = "md",
    labelPlacement = "bottom",
    collapse = "auto",
    onStepSelect,
    className,
    ...rest
  },
  ref,
) {
  const resolved = steps.map((step, i) => resolveStatus(step, i, current));
  const activeIndex = Math.min(Math.max(current, 0), Math.max(steps.length - 1, 0));
  const activeStep = steps[activeIndex];

  return (
    <div
      ref={ref}
      className={cn("ds-stepper", className)}
      data-orientation={orientation}
      data-size={size}
      data-label-placement={orientation === "vertical" ? "right" : labelPlacement}
      data-collapse={collapse}
      /*
       * The stylesheet keys its collapse threshold off this, because how much
       * room a stepper has is a property of its own column and not of the
       * viewport: on the SCW registration screen a 768px tablet gives the row
       * 354px, and six stages in 354px is 59px each. A viewport media query
       * called that comfortable.
       */
      data-steps={Math.min(steps.length, 12)}
      {...rest}
    >
      <ol className="ds-stepper__list" aria-label={ariaLabel}>
        {steps.map((step, i) => {
          const status = resolved[i]!;
          const selectable =
            Boolean(onStepSelect) && (status === "complete" || status === "error");
          const body = (
            <>
              <Marker status={status} index={i} />
              <span className="ds-stepper__text">
                <span className="ds-stepper__label">{step.label}</span>
                {step.description && (
                  <span className="ds-stepper__desc">{step.description}</span>
                )}
              </span>
              <span className="ds-sr-only">{` (${SR_TEXT[status]})`}</span>
            </>
          );

          return (
            <li
              key={step.label}
              className={cn("ds-stepper__item", `is-${status}`)}
              aria-current={status === "current" ? "step" : undefined}
            >
              {selectable ? (
                <button
                  type="button"
                  className="ds-stepper__button"
                  onClick={() => onStepSelect?.(i)}
                >
                  {body}
                </button>
              ) : (
                <span className="ds-stepper__static">{body}</span>
              )}
              {/*
               * The track leaves this node for the next one, so it is drawn on
               * every stage but the last and fills when THIS stage is done.
               * Drawn from the node the applicant has finished, it reads as the
               * path already walked, and no second rule is needed to decide
               * which of two stages owns the segment between them.
               *
               * It follows the content in the DOM because the `right` label
               * placement lays it out in flow, as the remaining width of the
               * row; the other placements position it absolutely, where order
               * does not matter.
               */}
              {i < steps.length - 1 && (
                <span className="ds-stepper__line" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>

      {/*
       * The compact bar is a second rendering of the list above, for sighted
       * readers on a viewport too narrow to draw it. It is aria-hidden because
       * the list remains in the accessibility tree at every width — the old
       * behaviour clipped the labels themselves, which took the names of the
       * remaining stages away from everyone.
       */}
      <div className="ds-stepper__compact" aria-hidden="true">
        <p className="ds-stepper__compact-copy">
          <span className="ds-stepper__compact-count">
            {`Step ${activeIndex + 1} of ${steps.length}`}
          </span>
          <span className="ds-stepper__compact-label">{activeStep?.label}</span>
        </p>
        <span className="ds-stepper__dots">
          {resolved.map((status, i) => (
            <span key={steps[i]!.label} className={cn("ds-stepper__dot", `is-${status}`)} />
          ))}
        </span>
      </div>
    </div>
  );
});
