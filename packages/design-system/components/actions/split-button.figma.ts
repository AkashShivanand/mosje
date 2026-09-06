// url=<SAMAVESH>?node-id=57606-762
// source=packages/design-system/components/actions/split-button.tsx
// component=SplitButton
import figma from "figma";

const instance = figma.selectedInstance;

const tone = instance.getEnum("Tone", {
  Primary: "primary",
  Danger: "danger",
});

const state = instance.getEnum("State", {
  Default: "default",
  Disabled: "disabled",
});

/**
 * Two real buttons joined by ButtonGroup. The trigger's own accessible name is
 * derived from `label` — "More ways to approve" — which is why `label` names the
 * SET of alternatives rather than the default action.
 */
export default {
  example: figma.code`
    <SplitButton
      label="${tone === "danger" ? "Reject this application" : "Approve this application"}"
      variant="${tone}"
      items={[
        { id: "remarks", label: "${tone === "danger" ? "Reject with reasons" : "Approve with remarks"}", icon: "edit_note" },
      ]}
      onClick={run}
      onSelect={choose}
      ${state === "disabled" ? "disabled" : ""}
    >
      ${tone === "danger" ? "Reject" : "Approve"}
    </SplitButton>
  `,
  imports: ['import { SplitButton } from "@mosje/design-system"'],
  id: "split-button",
  metadata: { nestable: false },
};
