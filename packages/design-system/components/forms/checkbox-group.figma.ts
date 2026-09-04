// url=<SAMAVESH>?node-id=57040-770
// source=packages/design-system/components/forms/control-group.tsx
// component=CheckboxGroup
import figma from "figma";

const instance = figma.selectedInstance;

const orientation = instance.getEnum("Orientation", {
  Vertical: "vertical",
  Horizontal: "horizontal",
});

const variant = instance.getEnum("Layout", {
  Default: "default",
  Card: "card",
});

const legend = instance.getString("Legend");
const hint = instance.getString("Hint");
const showHint = instance.getBoolean("Show Hint");
const error = instance.getString("Error");
const showError = instance.getBoolean("Show Error");
const required = instance.getBoolean("Required");
const showSelectAll = instance.getBoolean("Show Select All");
const selectAll = instance.getString("Select All");
const showExclusive = instance.getBoolean("Show Exclusive Option");
/*
 * The item rows are exposed nested Checkbox / Radio / Selection Card instances. Their
 * labels are read here through the item booleans only as a COUNT: the options array a
 * developer writes carries real values, which the drawing cannot know. Show Item 3–6
 * decide how many placeholder options the snippet emits.
 */
const items = [true, true, instance.getBoolean("Show Item 3"), instance.getBoolean("Show Item 4"), instance.getBoolean("Show Item 5"), instance.getBoolean("Show Item 6")]
  .filter(Boolean)
  .map((_, i) => `    { value: "option-${i + 1}", label: "Option ${i + 1}" },`)
  .join("\n");

export default {
  example: figma.code`
    <CheckboxGroup
      legend="${legend}"
      ${showHint ? figma.code`hint="${hint}"` : ""}
      ${showError ? figma.code`error="${error}"` : ""}
      ${required ? "required" : ""}
      ${orientation !== "vertical" ? figma.code`orientation="${orientation}"` : ""}
      ${variant !== "default" ? figma.code`variant="${variant}"` : ""}
      ${showSelectAll ? figma.code`selectAll="${selectAll}"` : ""}
      options={[
${items}
    ${showExclusive ? figma.code`    { value: "none", label: "None of the above", exclusive: true },` : ""}
      ]}
    />
  `,
  imports: ['import { CheckboxGroup } from "@mosje/design-system"'],
  id: "checkbox-group",
  metadata: { nestable: false },
};
