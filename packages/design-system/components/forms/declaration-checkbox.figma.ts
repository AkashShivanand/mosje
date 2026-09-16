// url=<SAMAVESH>?node-id=58191-3685
// source=packages/design-system/components/forms/declaration-checkbox.tsx
// component=DeclarationCheckbox
//
// The one declaration a citizen accepts before submitting. The component renders its
// own checkbox, so the nested Checkbox instance is not resolved here.
//
// PROPERTY COVERAGE
//   Title          -> title
//   Show Lead, Lead -> lead, only when Show Lead is on
//   Statement      -> children
//   State=Invalid  -> invalid, with Error as the error message
//   Error          -> error (Invalid only — the Default state never shows it)
import figma from "figma";

const instance = figma.selectedInstance;
const title = instance.getString("Title");
const showLead = instance.getBoolean("Show Lead");
const lead = instance.getString("Lead");
const statement = instance.getString("Statement");
const error = instance.getString("Error");
const invalid = instance.getEnum("State", { Default: false, Invalid: true });

export default {
  example: figma.code`<DeclarationCheckbox
  checked={accepted}
  onChange={setAccepted}
  title="${title}"${showLead ? figma.code`
  lead="${lead}"` : ""}${invalid ? figma.code`
  invalid
  error="${error}"` : ""}
>
  ${statement}
</DeclarationCheckbox>`,
  imports: ['import { DeclarationCheckbox } from "@mosje/design-system"'],
  id: "declaration-checkbox",
  metadata: { nestable: true },
};
