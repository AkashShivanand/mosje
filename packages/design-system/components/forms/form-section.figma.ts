// url=<SAMAVESH>?node-id=58089-1454
// source=packages/design-system/components/forms/form-section.tsx
// component=FormSection
//
// A titled group of fields inside a form panel.
//
// PROPERTY COVERAGE
//   Show Head                     -> title, read from the nested Form / Section Head's
//                                    "label" layer. The head's own Show Badge and Show
//                                    Actions properties decide badge and actions — they are
//                                    the head's properties, not this master's, so they are
//                                    read with getPropertyValue on the nested instance.
//   Show Description, Description -> description
//   Columns                       -> columns
//   Content (SLOT)                -> children
import figma from "figma";

const instance = figma.selectedInstance;
const showHead = instance.getBoolean("Show Head");
const showDescription = instance.getBoolean("Show Description");
const description = instance.getString("Description");
const columns = instance.getEnum("Columns", { "1": "1", "2": "2", "3": "3", "4": "4" });
const content = instance.getSlot("Content");

const label = showHead ? instance.findText("label", { traverseInstances: true }) : null;
const title = label && typeof label.textContent === "string" ? label.textContent : undefined;
const head = showHead ? instance.findInstance("Form / Section Head") : null;
const headOn = (prop) => head && head.type === "INSTANCE" && head.getPropertyValue(prop) === true;
const nested = (layer) => {
  const node = instance.findInstance(layer, { traverseInstances: true, path: ["Form / Section Head"] });
  return node && node.type === "INSTANCE" ? node.executeTemplate().example : undefined;
};
const badgeCode = headOn("Show Badge") ? nested("badge") : undefined;
const actionsCode = headOn("Show Actions") ? nested("actions") : undefined;

export default {
  example: figma.code`<FormSection${title ? figma.code`
  title="${title}"` : ""}${showDescription ? figma.code`
  description="${description}"` : ""}
  columns={${columns}}${badgeCode ? figma.code`
  badge={${badgeCode}}` : ""}${actionsCode ? figma.code`
  actions={${actionsCode}}` : ""}
>
  ${content}
</FormSection>`,
  imports: ['import { FormSection } from "@mosje/design-system"'],
  id: "form-section",
  metadata: { nestable: true },
};
