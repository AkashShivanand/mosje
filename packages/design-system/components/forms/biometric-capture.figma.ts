// url=<SAMAVESH>?node-id=57530-873
// source=packages/design-system/components/forms/biometric-capture.tsx
// component=BiometricCapture
import figma from "figma";

const instance = figma.selectedInstance;

const subject = instance.getString("Subject");

const state = instance.getEnum("State", {
  Idle: "idle",
  Capturing: "capturing",
  Captured: "captured",
  Failed: "failed",
  Unavailable: "unavailable",
});

const modality = instance.getEnum("Modality", {
  Fingerprint: "fingerprint",
  Iris: "iris",
  Face: "face",
});

/**
 * `consent` and `fallbackHref` are required by the component and are NOT Figma
 * properties, deliberately. A biometric capture with no stated consent and no way
 * through for a citizen whose fingerprint will not read is not a variant of this
 * component — it is a version of it that must not be buildable.
 */
export default {
  example: figma.code`
    <BiometricCapture
      modality="${modality}"
      state="${state}"
      subject="${subject}"
      onCapture={capture}
      consent="Your fingerprint is used only to confirm your identity for this application and is not stored."
      fallbackHref="/help/without-biometrics"
      ${state === "failed" ? figma.code`failureReason="The reader did not detect a finger."` : ""}
    />
  `,
  imports: ['import { BiometricCapture } from "@mosje/design-system"'],
  id: "biometric-capture",
  metadata: { nestable: false },
};
