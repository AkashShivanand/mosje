// url=<SAMAVESH>?node-id=58096-1947
// source=packages/design-system/components/forms/document-tile.tsx
// component=DocumentTile
//
// A compact document card for a list of uploads. The status badge is drawn by the
// component from `state`, so the nested status instance is not resolved.
//
// PROPERTY COVERAGE
//   Title     -> title
//   Meta      -> meta
//   State     -> state
//   Required  -> required
//   Show Icon -> icon, resolved from the nested icon instance
//   (child layers "primary action" and "remove") -> actions, resolved dynamically
import figma from "figma";

const instance = figma.selectedInstance;
const title = instance.getString("Title");
const meta = instance.getString("Meta");
const required = instance.getBoolean("Required");
const showIcon = instance.getBoolean("Show Icon");
const state = instance.getEnum("State", {
  Upcoming: "upcoming",
  Uploaded: "uploaded",
  Verified: "verified",
  Invalid: "invalid",
});

const icon = showIcon ? instance.findInstance("icon") : null;
let iconCode;
if (icon && icon.type === "INSTANCE") {
  iconCode = icon.executeTemplate().example;
}
const primary = instance.findInstance("primary action");
let primaryCode;
if (primary && primary.type === "INSTANCE") {
  primaryCode = primary.executeTemplate().example;
}
const remove = instance.findInstance("remove");
let removeCode;
if (remove && remove.type === "INSTANCE") {
  removeCode = remove.executeTemplate().example;
}

export default {
  example: figma.code`<DocumentTile
  title="${title}"
  meta="${meta}"
  state="${state}"${required ? figma.code`
  required` : ""}${iconCode ? figma.code`
  icon={${iconCode}}` : ""}${primaryCode || removeCode ? figma.code`
  actions={<>${primaryCode ?? ""}${removeCode ?? ""}</>}` : ""}
/>`,
  imports: ['import { DocumentTile } from "@mosje/design-system"'],
  id: "document-tile",
  metadata: { nestable: true },
};
