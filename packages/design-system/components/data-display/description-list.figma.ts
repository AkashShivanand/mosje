// url=<SAMAVESH>?node-id=57520-769
// source=packages/design-system/components/data-display/description-list.tsx
// component=DescriptionList
import figma from "figma";

const instance = figma.selectedInstance;

const term = instance.getString("Term");
const value = instance.getString("Value");
const showHint = instance.getBoolean("Show hint");

/**
 * Figma publishes the ROW; code publishes the LIST. The set has no container master
 * because a container of N rows is a variant explosion that tells a designer nothing,
 * so this template emits a one-item list and the developer adds the rest.
 */
const layout = instance.getEnum("Layout", {
  Stacked: "stacked",
  Inline: "inline",
});

const size = instance.getEnum("Size", {
  Md: "md",
  Sm: "sm",
});

/**
 * `State` is not a prop. "Not recorded" is what the component RENDERS when a value is
 * null — the emptyText path — so the axis maps to the shape of the data, not to a
 * switch. Emitting a `state` prop here would invent an API the component does not have.
 */
const state = instance.getEnum("State", {
  Recorded: "recorded",
  "Not recorded": "empty",
});

const valueExpr = state === "empty" ? "null" : `"${value}"`;
const hintPart = showHint ? `, hint: "Recorded on 14 August 2026"` : "";

export default {
  example: figma.code`
    <DescriptionList
      layout="${layout}"
      size="${size}"
      items={[{ term: "${term}", value: ${valueExpr}${hintPart} }]}
    />
  `,
  imports: ['import { DescriptionList } from "@mosje/design-system"'],
  id: "description-list",
  metadata: { nestable: false },
};
