// url=<SAMAVESH>?node-id=58091-2489
// source=packages/design-system/components/forms/form-panel.tsx
// component=FormPanel
//
// One step of a form: a head band, the step's sections, and the buttons that leave it.
//
// PROPERTY COVERAGE
//   Show Head, Title              -> title
//   Show Description, Description -> description (only with the head)
//   Show Header Actions           -> actions, resolved from the "header actions" instance
//   Content (SLOT)                -> children
//   Step                          -> footer. First leads with Cancel, Middle and Last with
//                                    Back; Last ends with Submit, the others with Continue.
//                                    Each button is resolved from its own layer.
import figma from "figma";

const instance = figma.selectedInstance;
const showHead = instance.getBoolean("Show Head");
const title = instance.getString("Title");
const showDescription = instance.getBoolean("Show Description");
const description = instance.getString("Description");
const showActions = instance.getBoolean("Show Header Actions");
const step = instance.getEnum("Step", { First: "first", Middle: "middle", Last: "last" });
const content = instance.getSlot("Content");

const resolve = (layer) => {
  const node = instance.findInstance(layer);
  return node && node.type === "INSTANCE" ? node.executeTemplate().example : undefined;
};
const actionsCode = showActions ? resolve("header actions") : undefined;
const leadCode = step === "first" ? resolve("cancel") : resolve("back");
const trailCode = step === "last" ? resolve("submit") : resolve("continue");

export default {
  example: figma.code`<FormPanel${showHead ? figma.code`
  title="${title}"` : ""}${showHead && showDescription ? figma.code`
  description="${description}"` : ""}${actionsCode ? figma.code`
  actions={${actionsCode}}` : ""}
  footer={<>${leadCode ?? ""}${trailCode ?? ""}</>}
>
  ${content}
</FormPanel>`,
  imports: ['import { FormPanel } from "@mosje/design-system"'],
  id: "form-panel",
  metadata: { nestable: false },
};
