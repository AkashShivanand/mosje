// url=<SAMAVESH>?node-id=57551-49844
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
 * Figma `Orientation` → `orientation`. Exhaustive.
 *
 * Three stages is the floor the U.S. Web Design System sets and this component
 * adopts — below three, the page heading already says everything. Nine is the
 * longest flow the MoSJE handoff draws, on E-Anudaan's grant application.
 */
const orientation = instance.getEnum("Orientation", {
  Horizontal: "horizontal",
  Vertical: "vertical",
});

/**
 * Figma `Size` → `size`. Exhaustive: both options mapped.
 *
 * Added to the library on 2026-09-06, closing the gap the component record had
 * carried since the rebuild: the code has taken `size` since it shipped and
 * Figma published one size, so Compact could be specified and never drawn.
 * Large is a 32px node with a 2px ring; Compact is 24px with a hairline and one
 * rung down the type scale.
 */
const size = instance.getEnum("Size", {
  Large: "md",
  Compact: "sm",
});

/**
 * Figma `Steps` → the length of the `steps` array. Exhaustive: all 7 options
 * mapped, 3 through 9.
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
 * `labelPlacement` and `collapse` stay unmapped: the Row publishes an
 * orientation, a size and a stage count, and nothing else the component takes. A designer wanting the vertical, compact
 * or label-beside arrangement places the stage masters and says so in the handoff
 * note — see the arrangements section on the component's Figma page.
 */
export default figma.code`<Stepper
  ariaLabel="Application progress"
  current={step}
  orientation="${orientation}"
  size="${size}"
  steps={${steps}}
/>`;
