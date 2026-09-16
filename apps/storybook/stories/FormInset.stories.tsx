import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, FormCard, FormField, FormInset, FormPanel, Icon, Input } from "@mosje/design-system";

/**
 * **FormInset** — one entry of a repeatable group (an employment, a key functionary),
 * drawn as a tinted inset panel inside a sub-section: `bg/neutral/subtler`, `shape/12`,
 * `padding/16`, no border. `title` names the entry, `actions` holds its Remove control,
 * and `columns` sets the field grid inside (2 by default).
 *
 * The parent owns the list, so "Add More" is not part of the component: a small outlined
 * Button with a leading plus, right-aligned under the last entry.
 *
 * Do **not** use it for short uniform rows (family members, awards) — those are a bordered
 * `DataTable`. And do not use it for a group that appears once; one inset is a box for no
 * reason.
 *
 * Lifecycle: **New**.
 */
const meta = {
  title: "Components/Forms/Form inset",
  component: FormInset,
  args: {
    title: "Employment 1",
    columns: 2,
    children: null,
  },
  argTypes: {
    columns: { control: "inline-radio", options: [1, 2, 3] },
    title: { control: "text" },
    actions: { control: false },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1040 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormInset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <FormInset {...args}>
      <FormField label="Employer" required>
        {(c) => <Input {...c} defaultValue="Zilla Parishad, Pune" />}
      </FormField>
      <FormField label="Designation" required>
        {(c) => <Input {...c} defaultValue="Data Entry Operator" />}
      </FormField>
      <FormField label="From" required>
        {(c) => <Input {...c} defaultValue="04/2019" />}
      </FormField>
    </FormInset>
  ),
};

/** Entries in a sub-section, with Remove on each and Add More under the last. */
export const RepeatableGroup: Story = {
  render: function Render() {
    const [ids, setIds] = React.useState([1, 2]);
    return (
      <FormPanel title="Employment Background Details">
        <FormCard title="Previous Employment">
          {ids.map((id, i) => (
            <FormInset
              key={id}
              title={`Employment ${i + 1}`}
              actions={
                ids.length > 1 ? (
                  <Button
                    appearance="text"
                    size="sm"
                    aria-label={`Remove Employment ${i + 1}`}
                    onClick={() => setIds((list) => list.filter((x) => x !== id))}
                  >
                    Remove
                  </Button>
                ) : undefined
              }
            >
              <FormField label="Employer" required>
                {(c) => <Input {...c} />}
              </FormField>
              <FormField label="Designation" required>
                {(c) => <Input {...c} />}
              </FormField>
            </FormInset>
          ))}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              appearance="outlined"
              size="sm"
              iconLeft={<Icon name="add" size={20} />}
              onClick={() => setIds((list) => [...list, Math.max(0, ...list) + 1])}
            >
              Add More
            </Button>
          </div>
        </FormCard>
      </FormPanel>
    );
  },
};
