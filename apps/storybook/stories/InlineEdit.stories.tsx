import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { InlineEdit } from "@mosje/design-system";

/**
 * A recorded value that can be corrected in place — Master Settings, a
 * beneficiary's district, a scheme's contact number.
 *
 * **Use it** on a settings or record screen where most values are read and one
 * is occasionally wrong, and opening a whole form to fix one field is the larger
 * cost.
 *
 * **Do not use it** where several values change together, or where a change needs
 * a reason recorded alongside it. Both are forms.
 *
 * **The save is confirmed, never optimistic, and that is not configurable.** An
 * optimistic edit shows the new value the instant it is typed and reverts if the
 * write fails; on a departmental record that is a data-integrity problem wearing
 * a performance improvement, because the officer who saw it change has no reason
 * to look again. The displayed value changes only after `onSave` resolves, and a
 * rejection leaves the typed text in the field.
 *
 * `label` is always visible and names the value. `value` is the stored text —
 * the component never changes it itself. `onSave` receives the trimmed text and
 * may return a promise; the control stays busy until it settles. `emptyText` is
 * what an unrecorded value says, in words rather than as a dash. `hint` sits
 * under the field while editing, `maxLength` caps it, and `disabled` withdraws
 * the control.
 *
 * `readOnlyReason` states why a value cannot be changed. A missing button is a
 * puzzle; "This application was approved on 4 September 2026" is an answer.
 *
 * The trigger's accessible name carries the field — "Edit district", not "Edit" —
 * because a page of seventeen settings otherwise offers seventeen identical
 * buttons. Escape cancels and Enter saves, and focus returns to the trigger.
 */
const meta = {
  title: "Forms/InlineEdit",
  component: InlineEdit,
  parameters: { layout: "padded" },
} satisfies Meta<typeof InlineEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled(props: Partial<React.ComponentProps<typeof InlineEdit>> & { initial?: string; fail?: boolean }) {
  const { initial = "", fail, ...rest } = props;
  const [value, setValue] = React.useState(initial);
  return (
    <InlineEdit
      label="District"
      value={value}
      onSave={async (next) => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        if (fail) throw new Error("write failed");
        setValue(next);
      }}
      {...rest}
    />
  );
}

export const Playground: Story = {
  args: { label: "District", value: "Bankura", onSave: () => {} },
  render: () => <Controlled initial="Bankura" hint="The district recorded on the application." />,
};

/** No value yet. It says so in words rather than showing a dash. */
export const NotRecorded: Story = {
  args: { label: "Alternate telephone", value: "", onSave: () => {} },
  render: () => <Controlled label="Alternate telephone" initial="" maxLength={10} />,
};

/**
 * The write fails. The typed text stays in the field — losing it is the second
 * defect after losing the write itself.
 */
export const SaveFails: Story = {
  args: { label: "District", value: "Bankura", onSave: () => {} },
  render: () => <Controlled initial="Bankura" fail />,
};

/** A decided record says why it cannot be changed, rather than hiding the control. */
export const ReadOnly: Story = {
  args: { label: "District", value: "Bankura", onSave: () => {} },
  render: () => (
    <Controlled initial="Bankura" readOnlyReason="This application was approved on 4 September 2026." />
  ),
};

/** Withdrawn entirely — the officer's role does not permit the change. */
export const Disabled: Story = {
  args: { label: "District", value: "Bankura", onSave: () => {} },
  render: () => <Controlled initial="Bankura" disabled />,
};
