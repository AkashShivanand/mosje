import type { Meta, StoryObj } from "@storybook/react";
import { DocumentBulkAction, DocumentChecklist, DocumentChecklistGroup, DocumentRow } from "@mosje/design-system";

/**
 * **DocumentChecklist · DocumentChecklistGroup** — the header over a grouped list of DocumentRows:
 * progress counted as documents READY (`ready`, `required`, `progressLabel`), `formats` stated once,
 * filter chips (`filters`, `activeFilter`, `onFilterChange`), a drop zone with a keyboard route
 * (`onFiles`, `accept`, `dropLabel`, `dropHint`, `chooseLabel`, and `touchLabel` on a touch screen), the ErrorSummary a blocked
 * Continue raises (`errors`, `errorTitle`, `errorsRevision`), live regions (`politeMessage`,
 * `assertiveMessage`), a `tray` slot, and the list's own states (`visibleCount`, `emptyText`,
 * `loading`), and `bulkAction` — a verdict for many documents at once, behind a confirmation, also exported
 * alone as `DocumentBulkAction`. `formats` is drawn inside the drop zone when there is one. A group takes
 * `title`, `description`, `meta`, `headingLevel` and `hideRequiredMarks`.
 *
 * Lifecycle: **New**.
 *
 * @covers DocumentChecklist, DocumentChecklistGroup, DocumentBulkAction
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

/** An officer's review: compact rows under a Required heading, and the bulk verdict. */
export const OfficerBulkVerdict: Story = {
  args: { filters: undefined, formats: undefined, ready: 1, required: 3, progressLabel: "1 of 3 required documents examined" },
  render: (args) => (
    <DocumentChecklist
      {...args}
      bulkAction={{
        label: "Mark All Remaining as Verified",
        count: 2,
        description: "Documents not yet examined where the automatic check found nothing wrong.",
        onConfirm: () => undefined,
      }}
    >
      <DocumentChecklistGroup title="Required Documents" hideRequiredMarks>
        <DocumentRow density="compact" number={1} title="Registration Certificate" required state="verified" statusLabel="Automatic check · Looks right" file={{ name: "Registration_Certificate_of_the_Organisation.pdf" }} />
        <DocumentRow density="compact" number={2} title="PAN Card of the Organisation" required state="verified" statusLabel="Automatic check · Looks right" file={{ name: "PAN_Card_of_the_Organisation.pdf" }} />
        <DocumentRow density="compact" number={3} title="Annual Report — Previous Financial Year" required state="verified" statusLabel="Automatic check · Looks right" file={{ name: "Annual_Report_2025-26.pdf" }} />
      </DocumentChecklistGroup>
    </DocumentChecklist>
  ),
};

/**
 * The bulk verdict on its own, for a decision panel. The dialog's words are `confirmTitle`,
 * `confirmDescription`, `confirmLabel` and `cancelLabel`; `disabled` with `disabledReason` shows why
 * it cannot be used yet.
 */
export const BulkActionAlone: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--sa-stack-16)" }}>
      <DocumentBulkAction
        label="Mark All Remaining as Verified"
        count={12}
        description="12 documents not yet examined."
        confirmTitle="Mark 12 Documents as Verified?"
        confirmDescription="A verdict of Verified will be recorded in your name against each of the 12 documents."
        confirmLabel="Mark as Verified"
        cancelLabel="Cancel"
        onConfirm={() => undefined}
      />
      <DocumentBulkAction
        label="Mark All Remaining as Verified"
        count={12}
        disabled
        disabledReason="The file is read-only once it has been certified."
        onConfirm={() => undefined}
      />
    </div>
  ),
};
