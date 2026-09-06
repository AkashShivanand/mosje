import type { Meta, StoryObj } from "@storybook/react";
import { Badge, Icon, ListGroup, ListRow } from "@mosje/design-system";

/**
 * **List Group** — a real `<ul>` of rows, each with a leading slot, a text
 * block and a trailing slot. It is the surface behind "recent applications",
 * a notification list, a document list, and a page of search results.
 *
 * **It is not a DataTable.** A table is for records the reader compares across
 * columns — sorting, scanning down one field, exporting. A list is for records
 * the reader takes one at a time. Reaching for a table because the data has
 * fields produces twelve columns on a phone; reaching for a list because it
 * looks lighter produces a comparison the reader cannot make.
 *
 * **The whole row is the target**, not the title inside it. A 40px-wide link in
 * a 600px row is a target most people miss and everyone with a tremor misses,
 * and WCAG 2.2 §2.5.8's 24×24 is the floor rather than the goal. A row is a
 * link when it goes somewhere and a button when it does something; it is never
 * both, and a row that is neither stays plain text rather than becoming a `div`
 * with a click handler. Where a row needs a second action as well as its own,
 * that action goes in `trailing` as its own control and the row stays plain.
 *
 * Lifecycle: **Stable**.
 *
 * @covers ListRow
 */
const meta = {
  title: "Components/Data Display/List Group",
  component: ListGroup,
  args: {
    // Each story supplies its own rows through `render`; meta only needs the
    // prop present so the arg type is satisfied.
    children: null,
    divided: true,
    bordered: true,
    size: "md",
    "aria-label": "Recent applications",
  },
  argTypes: {
    divided: { control: "boolean" },
    bordered: { control: "boolean" },
    size: { control: "inline-radio", options: ["md", "sm"] },
    children: { control: false },
  },
} satisfies Meta<typeof ListGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rows that go somewhere: each is a link, and the whole row is the target. */
export const Playground: Story = {
  args: {},
  render: (args) => (
    <ListGroup {...args}>
      <ListRow
        href="#one"
        eyebrow="MOSJE/AVYAY/2026/004821"
        title="Sunita Devi — Atal Vayo Abhyuday Yojana"
        description="Bankura, West Bengal · Submitted 3 September 2026"
        leading={<Icon name="description" size={24} />}
        trailing={<Badge status="warning">Pending</Badge>}
      />
      <ListRow
        href="#two"
        selected
        eyebrow="MOSJE/NAPDDR/2026/001194"
        title="Rehabilitation Centre, Guwahati — Annual Grant"
        description="Kamrup Metropolitan, Assam · Submitted 28 August 2026"
        leading={<Icon name="description" size={24} />}
        trailing={<Badge status="success">Approved</Badge>}
      />
      <ListRow
        href="#three"
        eyebrow="MOSJE/SHRESHTA/2026/000733"
        title="Residential Education Support — Mode 2"
        description="Ranchi, Jharkhand · Returned for correction 1 September 2026"
        leading={<Icon name="description" size={24} />}
        trailing={<Badge status="danger">Returned</Badge>}
      />
    </ListGroup>
  ),
};

/**
 * Rows that do something rather than go somewhere — a button each. Note the
 * disabled row stays in the list with `aria-disabled` rather than disappearing,
 * so the reader still learns the record exists.
 */
export const Actionable: Story = {
  args: {},
  render: (args) => (
    <ListGroup {...args} aria-label="Documents to verify">
      <ListRow
        onClick={() => {}}
        title="Aadhaar card"
        description="Uploaded 3 September 2026 · 1.2 MB"
        leading={<Icon name="badge" size={24} />}
        trailing={<Icon name="chevron_right" size={20} />}
      />
      <ListRow
        onClick={() => {}}
        title="Income certificate"
        description="Uploaded 3 September 2026 · 840 KB"
        leading={<Icon name="receipt_long" size={24} />}
        trailing={<Icon name="chevron_right" size={20} />}
      />
      <ListRow
        disabled
        title="Bank passbook"
        description="Not yet uploaded by the applicant."
        leading={<Icon name="account_balance" size={24} />}
      />
    </ListGroup>
  ),
};

/** Plain rows: no destination, no action, so no interactive element is invented. */
export const Static: Story = {
  args: { bordered: false, size: "sm" },
  render: (args) => (
    <ListGroup {...args} aria-label="What changed">
      <ListRow title="Application submitted" description="3 September 2026, 11:04" />
      <ListRow title="Documents verified by the district officer" description="4 September 2026, 09:20" />
      <ListRow title="Sent to the screening committee" description="5 September 2026, 16:47" />
    </ListGroup>
  ),
};
