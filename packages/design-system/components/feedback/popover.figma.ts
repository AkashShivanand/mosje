// url=<SAMAVESH>?node-id=57538-857
// source=packages/design-system/components/feedback/popover.tsx
// component=Popover
import figma from "figma";

const instance = figma.selectedInstance;

const title = instance.getString("Title");
const content = instance.getString("Content");
const showTitle = instance.getBoolean("Show title");

const side = instance.getEnum("Side", {
  Bottom: "bottom",
  Top: "top",
  Left: "left",
  Right: "right",
});

const align = instance.getEnum("Align", {
  Start: "start",
  Center: "center",
  End: "end",
});

/**
 * `side` and `align` are a REQUEST. The running component measures the room it has
 * and flips when there is none, so a popover asked for `bottom` at the foot of a
 * phone screen opens above the trigger. Figma records the intent; it cannot record
 * the measurement.
 *
 * When the title is off, the panel takes its accessible name from `label` — which is
 * why the fallback is emitted rather than left out. A dialog announced only as
 * "dialog" tells a reader nothing about what they have opened.
 */
export default {
  example: figma.code`
    <Popover
      side="${side}"
      align="${align}"
      ${showTitle ? figma.code`title="${title}"` : figma.code`label="More about this status"`}
      content={<p>${content}</p>}
    >
      <Button appearance="text">What does this mean?</Button>
    </Popover>
  `,
  imports: ['import { Popover } from "@mosje/design-system"'],
  id: "popover",
  metadata: { nestable: false },
};
