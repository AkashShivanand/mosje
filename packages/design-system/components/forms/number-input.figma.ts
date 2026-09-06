// url=<SAMAVESH>?node-id=57605-770
// source=packages/design-system/components/forms/number-input.tsx
// component=NumberInput
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Empty is `value={null}`, not `value={0}` — a figure not entered and a figure
 * of nothing are different facts, and a form that conflates them files the
 * wrong one. Error is the caller's `error` string; Disabled is `disabled`.
 */
const state = instance.getEnum("State", {
  Default: "default",
  Empty: "empty",
  Error: "error",
  Disabled: "disabled",
});

const value = state === "empty" ? "null" : "12000";

export default {
  example: figma.code`
    <NumberInput
      label="Sanctioned amount"
      value={${value}}
      onValueChange={setAmount}
      min={1000}
      max={50000}
      prefix="₹"
      suffix="per year"
      hint="The figure sanctioned for the whole financial year."
      ${state === "error" ? figma.code`error="Enter an amount between ₹1,000 and ₹50,000."` : ""}
      ${state === "disabled" ? "disabled" : ""}
    />
  `,
  imports: ['import { NumberInput } from "@mosje/design-system"'],
  id: "number-input",
  metadata: { nestable: false },
};
