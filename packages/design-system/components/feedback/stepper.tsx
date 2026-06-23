import * as React from "react";
import { cn } from "../../utils/cn";
import "./stepper.css";

export interface StepperStep {
  /** Short step label shown under the marker. */
  label: string;
  /** Optional helper text shown beneath the label (md+ only). */
  description?: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  /** The ordered steps. */
  steps: StepperStep[];
  /** 0-based index of the active step. Steps before it render as completed. */
  current: number;
  /** Accessible name for the progress list. @default "Progress" */
  ariaLabel?: string;
}

const IcCheck = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
    <path d="M5 10.5 8.5 14l6.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * MoSJE / SAMAVESH Stepper — horizontal progress for multi-step forms.
 *
 * Matches the Figma "Activity Details → Location → Upload Photos → Review"
 * stepper: a green ✓ for completed steps, a filled navy marker for the current
 * step, and muted markers for upcoming steps, joined by connector lines that
 * fill green as the user advances. Styled via `.ds-stepper*` semantic classes
 * that reference design tokens (--ds-*). No Tailwind, no hardcoded values.
 */
export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(
  function Stepper({ steps, current, ariaLabel = "Progress", className, ...rest }, ref) {
    return (
      <ol ref={ref} className={cn("ds-stepper", className)} aria-label={ariaLabel} {...rest}>
        {steps.map((step, i) => {
          const state = i < current ? "done" : i === current ? "current" : "upcoming";
          return (
            <li
              key={step.label}
              className={cn("ds-stepper__item", `is-${state}`)}
              aria-current={state === "current" ? "step" : undefined}
            >
              {i > 0 && <span className="ds-stepper__line" aria-hidden="true" />}
              <span className="ds-stepper__marker" aria-hidden="true">
                {state === "done" ? <IcCheck /> : <span className="ds-stepper__num">{i + 1}</span>}
              </span>
              <span className="ds-stepper__text">
                <span className="ds-stepper__label">{step.label}</span>
                {step.description && <span className="ds-stepper__desc">{step.description}</span>}
              </span>
              <span className="ds-stepper__sr">
                {state === "done"
                  ? " (completed)"
                  : state === "current"
                    ? " (current step)"
                    : " (upcoming)"}
              </span>
            </li>
          );
        })}
      </ol>
    );
  },
);
