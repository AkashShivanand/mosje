// url=<SAMAVESH>?node-id=57533-47217
// source=packages/design-system/components/feedback/stepper.tsx
// component=Stepper
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Mapped to `Stepper / Row` — the WHOLE stepper.
 *
 * It used to map `Stepper / Horizontal`, which publishes one STAGE, so the
 * snippet a designer got in Dev Mode described a component the barrel does not
 * export. Worse, the node it named was the set that had been misnamed since the
 * UX4G 2.0 fork: its connector runs downward, so it is the vertical stage. Both
 * were fixed on 2026-09-06 — the sets were renamed in place, keys intact, and
 * `Stepper / Row` was published so there is something to map that matches what
 * the code actually is.
 *
 * The stage masters keep no mapping of their own. A stage has no code
 * counterpart to emit: passing one to `<Stepper>` would be a `steps` array of
 * length one, which the component's own documentation tells you not to build.
 */

/**
 * Figma `Steps` → the length of the `steps` array. Exhaustive: all 7 options
 * mapped, 3 through 9.
 *
 * Three is the floor the U.S. Web Design System sets and this component adopts —
 * below three, the page heading already says everything. Nine is the longest
 * flow the MoSJE handoff draws, on E-Anudaan's grant application.
 */
const steps = instance.getEnum("Steps", {
  "3": `[
    { label: "Personal Details" },
    { label: "Income & Caste" },
    { label: "Review & Submit" },
  ]`,
  "4": `[
    { label: "Personal Details" },
    { label: "Income & Caste" },
    { label: "Bank Account" },
    { label: "Review & Submit" },
  ]`,
  "5": `[
    { label: "Personal Details" },
    { label: "Income & Caste" },
    { label: "Bank Account" },
    { label: "Documents" },
    { label: "Review & Submit" },
  ]`,
  "6": `[
    { label: "Organisation Details" },
    { label: "Project Details" },
    { label: "Infrastructure" },
    { label: "Grant Sought" },
    { label: "Document Uploads" },
    { label: "Review & Submit" },
  ]`,
  "7": `[
    { label: "Organisation Details" },
    { label: "Project Details" },
    { label: "Infrastructure" },
    { label: "Beneficiaries" },
    { label: "Grant Sought" },
    { label: "Document Uploads" },
    { label: "Review & Submit" },
  ]`,
  "8": `[
    { label: "Organisation Details" },
    { label: "Project Details" },
    { label: "Infrastructure" },
    { label: "Beneficiaries" },
    { label: "Grant Sought" },
    { label: "Declarations" },
    { label: "Document Uploads" },
    { label: "Review & Submit" },
  ]`,
  "9": `[
    { label: "Organisation Details" },
    { label: "Project Details" },
    { label: "Infrastructure" },
    { label: "Beneficiaries" },
    { label: "Grant Sought" },
    { label: "Declarations" },
    { label: "Bank Account" },
    { label: "Document Uploads" },
    { label: "Review & Submit" },
  ]`,
});

/**
 * `current` is NOT read from the design, and that is deliberate. The Row's
 * default arrangement — first stage complete, second current — is a
 * representative picture, not a value: the stage a citizen is on is decided by
 * the form at runtime. Emitting a literal would invite someone to hard-code it.
 *
 * `orientation`, `size`, `labelPlacement` and `collapse` are likewise unmapped:
 * the Row publishes only a stage count. A designer wanting the vertical, compact
 * or label-beside arrangement places the stage masters and says so in the handoff
 * note — see the arrangements section on the component's Figma page.
 */
export default figma.code`<Stepper
  ariaLabel="Application progress"
  current={step}
  steps={${steps}}
/>`;
