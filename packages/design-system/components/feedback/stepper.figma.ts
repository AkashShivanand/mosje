// url=<SAMAVESH>?node-id=2106-856
// source=packages/design-system/components/feedback/stepper.tsx
// component=Stepper
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * The library's masters publish ONE STAGE; the React component is the WHOLE
 * stepper. So a selected instance is a step, and the snippet this emits is a
 * complete `<Stepper>` with that step's state applied to a representative row —
 * not a `<Step>`, because no such export exists and inventing one in a snippet
 * is how a developer ends up building a component the design system does not
 * have.
 *
 * The gap is recorded as open item 01 on `Stepper — Component record`. When a
 * `Stepper / Row` wrapper is published, this template maps that instead.
 */
const label = instance.getString("Stepper Title") ?? "Stage";

/**
 * Figma `State` → `StepStatus`. Exhaustive: all 5 options mapped.
 *
 * The vocabularies differ by name and match one for one by meaning — Figma reads
 * `Incomplete` where the code reads `upcoming`, and `Completed` where the code
 * reads `complete`. Renaming the Figma values was deliberately deferred, because
 * a variant value string is what an instance binds to; the mapping lives here
 * instead, which is the only place both sides are visible at once.
 *
 * `Disabled` was added to both masters on 2026-09-06. Before that the code had
 * five states and Figma had four, so a designer had no way to draw a stage the
 * applicant cannot open yet.
 */
const status = instance.getEnum("State", {
  Current: "current",
  Completed: "complete",
  Incomplete: "upcoming",
  Error: "error",
  Disabled: "disabled",
});

/**
 * Figma `Label Position` → `labelPlacement`. Present only on the vertical
 * master, so it is read defensively.
 *
 * The code accepts this on the horizontal orientation only — a vertical stepper
 * always puts the label beside the node, because a label beneath a node in a
 * vertical stack collides with the next node. The component enforces that
 * itself, so a `Bottom` read from the vertical master is correctly ignored.
 */
const labelPlacement = instance.getEnum("Label Position", {
  Right: "right",
  Bottom: "bottom",
});

/**
 * `Type` (With Step Numbers | No Step Number) is NOT mapped, and that is
 * deliberate. The code draws a number for every stage that is not complete,
 * failed or unavailable, and a glyph for the three that are — there is no prop
 * that suppresses the numeral. A designer reaching for `No Step Number` wants a
 * dot-marked flow, which this component does not offer; the request belongs in
 * the handoff note, not in an invented prop.
 *
 * `Horizontal Line` is not mapped either: the code decides whether a stage draws
 * a connector track from its position in `steps`, so the last stage never has
 * one and no earlier stage can lose one.
 */

export default figma.code`<Stepper
  ariaLabel="Application progress"
  current={1}
  labelPlacement="${labelPlacement}"
  steps={[
    { label: "Organisation Details" },
    { label: "${label}", status: "${status}" },
    { label: "Review & Submit" },
  ]}
/>`;
