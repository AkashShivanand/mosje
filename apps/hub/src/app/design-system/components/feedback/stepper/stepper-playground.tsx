"use client";

import * as React from "react";
import { Button, Stepper, Toggle } from "@mosje/design-system";

/*
 * DS Audit: Stepper ✅ existing · Button ✅ existing · Toggle ✅ existing.
 * Nothing was hand-rolled; the controls around the specimen are design-system
 * components and every value below resolves through a `--sa-*` token.
 */

const STEPS = [
  { label: "Personal Details", description: "Name, Aadhaar and contact" },
  { label: "Income & Caste", description: "Certificates and declared income" },
  { label: "Bank Account", description: "Account for the disbursement" },
  { label: "Documents", description: "Proof of enrolment" },
  { label: "Review & Submit", description: "Check and lodge" },
];

/*
 * Eight times the shipped timings — 250ms becomes 2s, 150ms becomes 1.2s. These
 * are demonstration speeds, not design values, which is why they are written
 * here rather than added to the motion scale: the component always ships at the
 * token durations, and this only slows the specimen the reader is watching.
 */
const SLOW_ENTER = "2s";
const SLOW_HOVER = "1.2s";

const shell: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--sa-stack-24)",
};

/* State and viewing option on the left, the two actions on the right, so a switch
   that changes how you WATCH the specimen does not read as a third thing to press. */
const controls: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--sa-inline-16)",
};

const group: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--sa-inline-16)",
};

const position: React.CSSProperties = {
  fontSize: "var(--sa-type-body-3-size)",
  lineHeight: "var(--sa-type-body-3-lh)",
  color: "var(--sa-text-neutral-subtle)",
};

/**
 * The stepper's specimen, advanced by hand.
 *
 * A still picture cannot show what the component does between two stages, which
 * is the part of it a reader most often has to take on trust. Advancing a stage
 * here runs the real transitions; the switch slows them down so the curve is
 * legible rather than merely present.
 */
export function StepperPlayground(): React.JSX.Element {
  const [current, setCurrent] = React.useState(1);
  const [slow, setSlow] = React.useState(false);

  const last = STEPS.length - 1;

  const slowed = slow
    ? ({
        "--sa-motion-enter-duration": SLOW_ENTER,
        "--sa-motion-hover-duration": SLOW_HOVER,
      } as React.CSSProperties)
    : undefined;

  return (
    <div style={shell}>
      <div style={slowed}>
        <Stepper
          ariaLabel="Scholarship application progress"
          current={current}
          steps={STEPS}
          onStepSelect={setCurrent}
        />
      </div>

      <div style={controls}>
        <div style={group}>
          <span style={position}>
            Stage {current + 1} of {STEPS.length}
          </span>
          <Toggle
            checked={slow}
            label="Slow motion"
            size="small"
            onChange={(e) => setSlow(e.target.checked)}
          />
        </div>
        <div style={group}>
          <Button
            appearance="outlined"
            size="sm"
            disabled={current === 0}
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          >
            Back
          </Button>
          <Button
            size="sm"
            disabled={current === last}
            onClick={() => setCurrent((c) => Math.min(last, c + 1))}
          >
            Next Stage
          </Button>
        </div>
      </div>
    </div>
  );
}
