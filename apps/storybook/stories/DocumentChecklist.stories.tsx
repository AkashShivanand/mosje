import type { Meta, StoryObj } from "@storybook/react";
import { DocumentChecklist, DocumentChecklistGroup, DocumentRow } from "@mosje/design-system";

/**
 * **DocumentChecklist · DocumentChecklistGroup** — the header over a grouped list of DocumentRows:
 * progress counted as documents READY (`ready`, `required`, `progressLabel`), `formats` stated once,
 * filter chips (`filters`, `activeFilter`, `onFilterChange`), a drop zone with a keyboard route
 * (`onFiles`, `accept`, `dropLabel`, `dropHint`, `chooseLabel`, and `touchLabel` on a touch screen), the ErrorSummary a blocked
 * Continue raises (`errors`, `errorTitle`, `errorsRevision`), live regions (`politeMessage`,
 * `assertiveMessage`), a `tray` slot, and the list's own states (`visibleCount`, `emptyText`,
 * `loading`). A group takes `title`, `description`, `meta` and `headingLevel`.
 *
 * Lifecycle: **New**.
 *
 * @covers DocumentChecklist, DocumentChecklistGroup
 */
const meta = {
  title: "Components/Forms/Document checklist",
  component: DocumentChecklist,
  args: {
    formats: "PDF, JPG or PNG · up to 5 MB each",
    ready: 1,
    required: 3,
    filters: [
      { id: "attention", label: "Needs your attention", count: 1, tone: "danger" },
      { id: "checking", label: "Being checked", count: 1 },
      { id: "ready", label: "Ready", count: 1 },
    ],
    activeFilter: null,
    accept: "application/pdf",
    dropLabel: "Drop all your documents here, or",
    dropHint: "We read each file and put it in the right place. You can move any we get wrong.",
    chooseLabel: "Choose Files",
    touchLabel: "Choose your documents",
    errors: [],
    errorTitle: "1 Document Needs Your Attention Before You Continue",
    errorsRevision: 0,
    politeMessage: "",
    assertiveMessage: "",
    visibleCount: 3,
    emptyText: "No documents are asked for on this application.",
    loading: false,
  },
  argTypes: {
    onFilterChange: { action: "filter" },
    onFiles: { action: "files" },
    tray: { control: false },
    children: { control: false },
    progressLabel: { control: "text" },
  },
} satisfies Meta<typeof DocumentChecklist>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = (
  <>
    <DocumentChecklistGroup title="Registration & Identity" description="One-time documents" meta="1 of 2 ready" headingLevel={3}>
      <DocumentRow number={1} title="Registration Certificate" required state="verified" file={{ name: "reg.pdf", size: "240 KB" }} />
      <DocumentRow number={2} title="PAN of the Organisation" required state="invalid" file={{ name: "pan.pdf" }} reason="This looks like the Registration Certificate." />
    </DocumentChecklistGroup>
    <DocumentChecklistGroup title="Financial">
      <DocumentRow number={6} title="Budget Estimates — Current Year" required state="checking" file={{ name: "budget.pdf" }} />
    </DocumentChecklistGroup>
  </>
);

export const Playground: Story = { render: (args) => <DocumentChecklist {...args}>{rows}</DocumentChecklist> };

export const BlockedContinue: Story = {
  args: { errors: [{ fieldId: "pan-action", message: "The PAN of the Organisation doesn't match what was asked for — replace it" }], activeFilter: "attention" },
  render: (args) => <DocumentChecklist {...args}>{rows}</DocumentChecklist>,
};

export const FilteredToNothing: Story = {
  args: { activeFilter: "checking", visibleCount: 0 },
  render: (args) => <DocumentChecklist {...args} />,
};

export const Loading: Story = { args: { loading: true }, render: (args) => <DocumentChecklist {...args} /> };
