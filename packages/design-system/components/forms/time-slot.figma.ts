// url=<SAMAVESH>?node-id=57526-770
// source=packages/design-system/components/forms/time-slot.tsx
// component=TimeSlot
import figma from "figma";

const instance = figma.selectedInstance;

const time = instance.getString("Time");

/**
 * Figma publishes the SLOT; code publishes the group, because the group is the radio
 * group and a lone radio is not a control. This template emits a one-slot group.
 *
 * The axis maps to the SHAPE of a slot, not to a prop: Available and Selected are
 * whether `value` matches, Full and Closed are `disabled` with a reason. A slot that
 * is full and a slot that is closed read the same in colour and differently in words,
 * which is why the reason is a string rather than a tone.
 */
const state = instance.getEnum("State", {
  Available: "available",
  Selected: "selected",
  Full: "full",
  Closed: "closed",
});

const capacity = instance.getEnum("Capacity", {
  Shown: "shown",
  Hidden: "hidden",
});

const disabled = state === "full" || state === "closed";
const reason = state === "full" ? "No places left" : state === "closed" ? "Not open on this day" : "";
const remaining = capacity === "shown" && !disabled ? `, remaining: 4` : "";
const disabledPart = disabled ? `, disabled: true, unavailableReason: "${reason}"` : "";
const selected = state === "selected" ? "slot-1" : "";

export default {
  example: figma.code`
    <TimeSlot
      label="Choose a time"
      value="${selected}"
      onChange={setSlot}
      groups={[{ label: "Morning", slots: [{ id: "slot-1", label: "${time}"${remaining}${disabledPart} }] }]}
    />
  `,
  imports: ['import { TimeSlot } from "@mosje/design-system"'],
  id: "time-slot",
  metadata: { nestable: false },
};
