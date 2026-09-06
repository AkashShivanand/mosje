// url=<SAMAVESH>?node-id=57621-772
// source=packages/design-system/components/forms/signature-pad.tsx
// component=SignaturePad
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * The axis is the VALUE — `{ method, value } | null` — not a prop of its own.
 *
 * `declaration` is required and is emitted on every variant, because the whole
 * design of this component is that a form cannot ship without the Department
 * having written down what is being attested to. Replace the sentence below with
 * the wording for the form it sits on; do not ship the example text.
 */
const state = instance.getEnum("State", {
  "Not signed": "none",
  "Signed by drawing": "drawn",
  "Signed by typing": "typed",
});

const value =
  state === "none"
    ? "null"
    : state === "drawn"
      ? '{ method: "drawn", value: pngDataUrl }'
      : '{ method: "typed", value: "Meena Kumari" }';

export default {
  example: figma.code`
    <SignaturePad
      label="Signature of the applicant"
      declaration="I declare that the information given in this application is true to the best of my knowledge, and I consent to its verification by the Department."
      value={${value}}
      onChange={setSignature}
    />
  `,
  imports: ['import { SignaturePad } from "@mosje/design-system"'],
  id: "signature-pad",
  metadata: { nestable: false },
};
