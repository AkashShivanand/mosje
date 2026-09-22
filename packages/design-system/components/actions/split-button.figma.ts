// url=<SAMAVESH>?node-id=57606-762
// source=packages/design-system/components/actions/split-button.tsx
// component=SplitButton
import figma from "figma";

const instance = figma.selectedInstance;

const tone = instance.getEnum("Tone", {
  Primary: "primary",
  Danger: "danger",
  Neutral: "neutral",
});

const appearance = instance.getEnum("Appearance", {
  Filled: "filled",
  Outlined: "outlined",
});

const state = instance.getEnum("State", {
  Default: "default",
  Disabled: "disabled",
});

/**
 * Two real buttons joined by ButtonGroup. The trigger's own accessible name is
 * derived from the default action's label — "More ways to approve" — which is
 * why `label` names the SET of alternatives rather than the default action.
 * Appearance reaches both halves; the quiet outlined pair is the table-toolbar
 * case (Copy, with its export formats one press away).
 */
export default {
  example: figma.code`
    <SplitButton
      label="${tone === "danger" ? "Reject this application" : tone === "neutral" ? "Export options" : "Approve this application"}"
      variant="${tone}"
      ${appearance === "outlined" ? 'appearance="outlined"' : ""}
      items={[
        { id: "more", label: "${tone === "danger" ? "Reject with reasons" : tone === "neutral" ? "Export as CSV" : "Approve with remarks"}", icon: "${tone === "neutral" ? "description" : "edit_note"}" },
      ]}
      onClick={run}
      onSelect={choose}
      ${state === "disabled" ? "disabled" : ""}
    >
      ${tone === "danger" ? "Reject" : tone === "neutral" ? "Copy" : "Approve"}
    </SplitButton>
  `,
  imports: ['import { SplitButton } from "@mosje/design-system"'],
  id: "split-button",
  metadata: { nestable: false },
};
