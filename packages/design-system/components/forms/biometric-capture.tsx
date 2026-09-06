"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./biometric-capture.css";

/** What is being captured. Each has its own instruction and its own glyph. */
export type BiometricModality = "fingerprint" | "iris" | "face";

/**
 * Where the capture has got to.
 *
 * `unavailable` is a first-class state, not an error: a centre with no reader
 * attached, or a citizen on a phone, must be told plainly and sent to the
 * alternative rather than shown a control that cannot work.
 */
export type BiometricState =
  | "idle"
  | "capturing"
  | "captured"
  | "failed"
  | "unavailable";

export interface BiometricCaptureProps {
  modality: BiometricModality;
  /** The current state. This component draws it; it never drives the device. */
  state: BiometricState;
  /** Start or retry a capture. Not called in `capturing`, `captured` or `unavailable`. */
  onCapture: () => void;
  /** Whose biometrics these are, named — "Sunita Devi". Announced with the region. */
  subject?: string;
  /**
   * Why it failed, in the words a person at the counter can act on: "The finger
   * was lifted too early", not a device code. Shown only in `failed`.
   */
  failureReason?: string;
  /**
   * Where to go instead. **Required, and required for a reason**: biometric
   * capture fails for worn fingerprints, for cataracts, for a reader that is not
   * plugged in, and for anyone using this on a phone. A screen with no way past
   * it stops the citizen's application, not the department's.
   */
  fallbackHref: string;
  /** @default "Verify another way" */
  fallbackLabel?: string;
  /**
   * The consent sentence shown before capture. Under the DPDP Act 2023 a
   * biometric is personal data and the citizen is told what is taken and why
   * BEFORE it is taken, not after.
   */
  consent: React.ReactNode;
  className?: string;
}

const INSTRUCTION: Record<BiometricModality, string> = {
  fingerprint: "Place the index finger flat on the reader and hold it still.",
  iris: "Look straight into the scanner and keep the eyes open.",
  face: "Look straight at the camera in an evenly lit place.",
};

const NOUN: Record<BiometricModality, string> = {
  fingerprint: "Fingerprint",
  iris: "Iris scan",
  face: "Photograph",
};

/** A drawn mark rather than an icon font, so it is legible at any scale. */
const GLYPH: Record<BiometricModality, string> = {
  fingerprint: "☝",
  iris: "◎",
  face: "☺",
};

/**
 * MoSJE / SAMAVESH Biometric capture.
 *
 * The capture surface for a fingerprint, an iris scan or a photograph — the
 * enrolment step in SMILE and the Transgender portal.
 *
 * **This component draws states; it never touches a device.** Reading a
 * fingerprint scanner is the portal's job, done through whatever RD service the
 * centre has, and that varies per deployment. What is shared is the screen a
 * citizen looks at while it happens, and the states it has to have: waiting,
 * reading, done, failed, and no reader at all.
 *
 * **`unavailable` is a designed state, not an error.** A centre whose reader is
 * unplugged, and a citizen who opened the page on a phone, must be told plainly
 * and sent to the alternative — not shown a button that will never work.
 *
 * **`fallbackHref` is required, and that is deliberate.** Biometric capture
 * fails for worn fingerprints, for cataracts, for manual labourers, and for the
 * elderly — which is to say it fails most often for exactly the citizens these
 * schemes exist to serve. A screen with no way past it does not stop the
 * department; it stops the application. WCAG 3.3.8 asks the same question from
 * the other direction: there must be an authentication route that does not
 * depend on one bodily capability.
 *
 * The state is announced through a polite live region, because a reader who
 * cannot see the panel change has no other way to learn the capture succeeded.
 */
export function BiometricCapture({
  modality,
  state,
  onCapture,
  subject,
  failureReason,
  fallbackHref,
  fallbackLabel = "Verify another way",
  consent,
  className,
}: BiometricCaptureProps): React.JSX.Element {
  const noun = NOUN[modality];
  const label = subject ? `${noun} — ${subject}` : noun;

  const message: Record<BiometricState, string> = {
    idle: INSTRUCTION[modality],
    capturing: "Reading. Keep still.",
    captured: `${noun} captured.`,
    failed: failureReason ?? "The capture did not succeed.",
    unavailable:
      "No reader is connected to this device, so this cannot be captured here.",
  };

  const canAct = state === "idle" || state === "failed";

  return (
    <section
      className={cn("ds-biometric", `ds-biometric--${state}`, className)}
      aria-label={label}
    >
      <div className="ds-biometric__stage">
        <span className="ds-biometric__glyph" aria-hidden>
          {GLYPH[modality]}
        </span>
        {state === "capturing" ? (
          <span className="ds-biometric__pulse" aria-hidden />
        ) : null}
      </div>

      <div className="ds-biometric__body">
        <h3 className="ds-biometric__title">{label}</h3>
        {/* One live region for every state, so a change is announced once and
            the reader is not told the same thing twice by two elements. */}
        <p className="ds-biometric__message" role="status" aria-live="polite">
          {message[state]}
        </p>

        {state !== "captured" && state !== "unavailable" ? (
          <p className="ds-biometric__consent">{consent}</p>
        ) : null}

        <div className="ds-biometric__actions">
          {canAct ? (
            <button type="button" className="ds-biometric__go" onClick={onCapture}>
              {state === "failed" ? "Try again" : `Capture ${noun.toLowerCase()}`}
            </button>
          ) : null}
          {/* The alternative is offered in EVERY state, including success. A
              citizen who has just been captured may still be the wrong person
              for this route, and hiding the way out until something fails makes
              failure the only way to find it. */}
          <a className="ds-biometric__fallback" href={fallbackHref}>
            {fallbackLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
