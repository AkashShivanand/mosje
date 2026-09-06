// url=<SAMAVESH>?node-id=57542-3311
// source=packages/design-system/components/data-display/list-group.tsx
// component=ListRow
import figma from "figma";

const instance = figma.selectedInstance;

const title = instance.getString("Title");
const eyebrow = instance.getString("Eyebrow");
const description = instance.getString("Description");
const showEyebrow = instance.getBoolean("Show eyebrow");
const showDescription = instance.getBoolean("Show description");
const showLeading = instance.getBoolean("Show leading");

/**
 * `Kind` is a promise to the reader, not a style. Link means the browser's own
 * behaviour applies — middle-click opens a tab, the status bar shows the destination.
 * Button means something happens here. Static means the row is a record, not a
 * control, and it carries no hover, no focus ring and no pointer.
 */
const kind = instance.getEnum("Kind", {
  Link: "link",
  Button: "button",
  Static: "static",
});

const state = instance.getEnum("State", {
  Default: "default",
  Selected: "selected",
  Disabled: "disabled",
});

export default {
  example: figma.code`
    <ListRow
      title="${title}"
      ${showEyebrow ? figma.code`eyebrow="${eyebrow}"` : ""}
      ${showDescription ? figma.code`description="${description}"` : ""}
      ${showLeading ? figma.code`leading={<Icon name="description" />}` : ""}
      ${kind === "link" ? figma.code`href="/applications/1284"` : ""}
      ${kind === "button" ? figma.code`onClick={open}` : ""}
      ${state === "selected" ? "selected" : ""}
      ${state === "disabled" ? "disabled" : ""}
    />
  `,
  imports: ['import { ListRow } from "@mosje/design-system"'],
  id: "list-row",
  metadata: { nestable: true },
};
