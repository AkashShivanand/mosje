import type { Meta, StoryObj } from "@storybook/react";
import { Badge, DescriptionList } from "@mosje/design-system";

/**
 * **Description List** — the label-and-value grid that every *Application
 * Detail*, *Beneficiary View* and *Review & Submit* screen in the estate is
 * mostly made of.
 *
 * It renders a real `<dl>`, and that is the whole point. The same grid built
 * from `<div>`s reads to a screen reader as an undifferentiated run of text —
 * "Date of Birth 12 March 1994 District Bankura Status Pending" — with nothing
 * to say where one fact ends and the next begins. The `<dt>`/`<dd>` pairing is
 * what makes each value announced together with the field it belongs to.
 *
 * **An unrecorded value is a designed state, not a blank.** `null`, `undefined`
 * and an empty string all render `emptyText`, so the reader learns the
 * department has no answer rather than wondering whether the page failed. It is
 * real text rather than a dash, because a screen reader announces "—" as
 * nothing at all, which makes an unanswered field and a broken one identical.
 *
 * A field that should not appear at all when it is empty is left out of `items`
 * by the caller. That is a different decision and it belongs to the page.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Data Display/Description List",
  component: DescriptionList,
  args: {
    columns: 2,
    layout: "stacked",
    size: "md",
    divided: false,
    emptyText: "Not recorded",
    items: [
      { term: "Application Number", value: "MOSJE/AVYAY/2026/004821" },
      { term: "Applicant", value: "Sunita Devi" },
      { term: "Date of Birth", value: "12 March 1994" },
      { term: "District", value: "Bankura" },
      { term: "State", value: "West Bengal" },
      { term: "Scheme", value: "Atal Vayo Abhyuday Yojana" },
      { term: "Grant Sought", value: "₹ 4,50,000", hint: "As stated in step 5 of the application." },
      { term: "Aadhaar Number", value: null },
      {
        term: "Registered Address",
        value: "House 42, Ward 7, Bankura Municipality, Bankura, West Bengal 722101",
        wide: true,
      },
    ],
  },
  argTypes: {
    columns: { control: "inline-radio", options: [1, 2, 3] },
    layout: { control: "inline-radio", options: ["stacked", "inline"] },
    size: { control: "inline-radio", options: ["md", "sm"] },
    divided: { control: "boolean" },
    emptyText: { control: "text" },
    items: { control: false },
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default: an application's recorded facts, two columns, with one field unanswered. */
export const Playground: Story = {};

/**
 * `inline` puts the term in a fixed leading column. The column is measured in
 * `ch` rather than pixels, so it grows with the reader's font size instead of
 * clipping the label at 200% zoom.
 */
export const Inline: Story = {
  args: { layout: "inline", columns: 1, divided: true },
};

/** Three columns, for a summary strip of short values above a longer record. */
export const ThreeColumns: Story = {
  args: {
    columns: 3,
    size: "sm",
    items: [
      { term: "Status", value: <Badge status="warning">Pending verification</Badge> },
      { term: "Submitted", value: "3 September 2026" },
      { term: "Assigned To", value: "District Officer, Bankura" },
      { term: "Last Updated", value: "5 September 2026" },
      { term: "Stage", value: "3 of 7" },
      { term: "Reference", value: "MOSJE/AVYAY/2026/004821" },
    ],
  },
};

/**
 * Every value unrecorded — what a detail screen looks like before anything has
 * been entered. It reads as an empty form, not as a failure.
 */
export const NothingRecorded: Story = {
  args: {
    items: [
      { term: "Application Number", value: "MOSJE/AVYAY/2026/004822" },
      { term: "Applicant", value: "" },
      { term: "Date of Birth", value: null },
      { term: "District", value: undefined },
    ],
  },
};
