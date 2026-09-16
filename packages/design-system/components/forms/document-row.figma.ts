// url=<SAMAVESH>?node-id=58278-1079
// source=packages/design-system/components/forms/document-row.tsx
// component=DocumentRow
//
// One required or optional document: its state, the file that satisfies it, and the one
// action that moves it forward.
//
// PROPERTY COVERAGE
//   State (all ten)       -> state
//   Density               -> density
//   Title                 -> title
//   Show hint, Hint       -> hint
//   Show file, File meta  -> file — meta is "size · date", split into those two fields
//   Show action           -> action, resolved from the nested Action button
//   Show menu             -> menu
//   Show reason           -> reason
//   Width                 -> deliberatelyOmitted. Wide / Narrow is decided by container
//                            queries on the row's own width (@container ds-docrow), not a prop.
import figma from "figma";

const instance = figma.selectedInstance;
const state = instance.getEnum("State", {
  missing: "missing",
  optional: "optional",
  uploading: "uploading",
  failed: "failed",
  rejected: "rejected",
  checking: "checking",
  verified: "verified",
  review: "review",
  invalid: "invalid",
  unavailable: "unavailable",
});
const density = instance.getEnum("Density", { Default: "default", Compact: "compact" });
const title = instance.getString("Title");
const showHint = instance.getBoolean("Show hint");
const hint = instance.getString("Hint");
const showFile = instance.getBoolean("Show file");
const fileMeta = instance.getString("File meta");
const showAction = instance.getBoolean("Show action");
const showMenu = instance.getBoolean("Show menu");
const showReason = instance.getBoolean("Show reason");

const [size, date] = fileMeta.split("·").map((part) => part.trim());

const action = showAction ? instance.findInstance("Action") : null;
let actionCode;
if (action && action.type === "INSTANCE") {
  actionCode = action.executeTemplate().example;
}

export default {
  example: figma.code`<DocumentRow
  linkAs={Link}
  state="${state}"
  title="${title}"${density === "compact" ? figma.code`
  density="compact"` : ""}${showHint ? figma.code`
  hint="${hint}"` : ""}${showFile ? figma.code`
  file={{ name: fileName, size: "${size ?? ""}", date: "${date ?? ""}" }}` : ""}${actionCode ? figma.code`
  action={${actionCode}}` : ""}${showMenu ? figma.code`
  menu={{ items: menuItems, onSelect: handleMenu }}` : ""}${showReason ? figma.code`
  reason={reason}` : ""}
/>`,
  imports: ['import { DocumentRow } from "@mosje/design-system"', 'import Link from "next/link"'],
  id: "document-row",
  metadata: { nestable: true },
};
