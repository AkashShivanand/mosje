// url=<SAMAVESH>?node-id=58096-2025
// source=packages/design-system/components/forms/wizard.tsx
// component=ReviewSection
//
// A titled group of answers on a review step, read back before submission.
//
// PROPERTY COVERAGE
//   Columns        -> columns
//   Content (SLOT) -> children
//   (nested Form / Section Head) -> title from its "label" layer; badge and actions from
//                    the head's own Show Badge and Show Actions properties, read with
//                    getPropertyValue because they belong to the head, not this master.
//   title is required, so when no label can be read the snippet passes a variable.
import figma from "figma";

const instance = figma.selectedInstance;
const columns = instance.getEnum("Columns", { "2": "2", "3": "3", "4": "4" });
const content = instance.getSlot("Content");

const label = instance.findText("label", { traverseInstances: true });
const title = label && typeof label.textContent === "string" ? label.textContent : undefined;
const head = instance.findInstance("Form / Section Head");
const headOn = (prop) => head && head.type === "INSTANCE" && head.getPropertyValue(prop) === true;
const nested = (layer) => {
  const node = instance.findInstance(layer, { traverseInstances: true, path: ["Form / Section Head"] });
  return node && node.type === "INSTANCE" ? node.executeTemplate().example : undefined;
};
const badgeCode = headOn("Show Badge") ? nested("badge") : undefined;
const actionsCode = headOn("Show Actions") ? nested("actions") : undefined;

export default {
  example: figma.code`<ReviewSection
  title=${title ? figma.code`"${title}"` : figma.code`{title}`}
  columns={${columns}}${badgeCode ? figma.code`
  badge={${badgeCode}}` : ""}${actionsCode ? figma.code`
  actions={${actionsCode}}` : ""}
>
  ${content}
</ReviewSection>`,
  imports: ['import { ReviewSection } from "@mosje/design-system"'],
  id: "review-section",
  metadata: { nestable: true },
};
