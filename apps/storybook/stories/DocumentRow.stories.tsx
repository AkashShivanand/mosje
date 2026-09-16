import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, DocumentChecklistGroup, DocumentFindings, DocumentRow } from "@mosje/design-system";

/**
 * **DocumentRow** — one document as a compact row: status icon, `title` (with `number`,
 * `required`, `titleAs`), `hint`, the `file`, the status in words (`statusLabel`, defaulting to the
 * applicant's words for the `state`), `progress` while uploading, one primary `action` and a `menu`.
 * A row that needs the reader grows by one `reason`; `findings` sit behind the What we found
 * disclosure (`findingsLabel`, `showFindingsToggle`, `findingsOpen`, `onFindingsOpenChange`).
 * `remark` (with `remarkLabel`) sits above the row on a correction screen; `aside` holds an
 * officer's own verdict. `linkAs` routes `file.href`; `id` lets an ErrorSummary point at the row;
 * `as` is `li` in a list, `div` alone. `density="compact"` is the one-line reviewed-document row for an
 * officer's list; `clampReason` cuts a repeated reason to one line on a wide row.
 *
 * Lifecycle: **New**.
 *
 * @covers DocumentRow
 */
const meta = {
  title: "Components/Forms/Document row",
  component: DocumentRow,
  args: {
    title: "Budget Estimates — Current Year",
    number: 2,
    required: true,
    state: "invalid",
    file: { name: "budget-2026-27.pdf", size: "6 KB", date: "14 Sep 2026" },
    reason: "Only the cover sheet was found — the head-wise estimates are missing.",
    as: "div",
    titleAs: "p",
    findingsLabel: "What we found",
    showFindingsToggle: true,
    remarkLabel: "Ministry's remark",
  },
  argTypes: {
    state: { control: "select", options: ["missing", "optional", "uploading", "failed", "rejected", "checking", "verified", "review", "invalid", "unavailable"] },
    as: { control: "inline-radio", options: ["li", "div"] },
    titleAs: { control: "inline-radio", options: ["p", "h2", "h3", "h4"] },
    progress: { control: { type: "range", min: 0, max: 100 } },
    statusLabel: { control: "text" },
    hint: { control: "text" },
    remark: { control: "text" },
    action: { control: false },
    menu: { control: false },
    findings: { control: false },
    findingsOpen: { control: "boolean" },
    onFindingsOpenChange: { action: "findings toggled" },
    aside: { control: false },
    collapsible: { control: "boolean" },
    expanded: { control: "boolean" },
    onExpandedChange: { action: "details toggled" },
    summary: { control: "text" },
    density: { control: "inline-radio", options: ["default", "compact"] },
    clampReason: { control: "boolean" },
    linkAs: { control: false },
    id: { control: "text" },
  },
} satisfies Meta<typeof DocumentRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <DocumentRow
      {...args}
      action={<Button size="sm" appearance="outlined">Replace</Button>}
      menu={{ items: [{ id: "view", label: "View" }, { id: "history", label: "Upload History" }], onSelect: () => undefined }}
      findings={<DocumentFindings summary="Only the cover sheet of the budget was found." reasons={["The head-wise estimates are missing."]} />}
    />
  ),
};

const STATES = ["missing", "optional", "uploading", "failed", "rejected", "checking", "verified", "review", "invalid", "unavailable"] as const;

export const EveryState: Story = {
  render: () => (
    <DocumentChecklistGroup title="Every State">
      {STATES.map((s, i) => (
        <DocumentRow
          key={s}
          number={i + 1}
          title="Registration Certificate"
          required={s !== "optional"}
          state={s}
          progress={s === "uploading" ? 64 : undefined}
          file={s === "missing" || s === "optional" ? undefined : { name: "registration.pdf", size: "812 KB" }}
        />
      ))}
    </DocumentChecklistGroup>
  ),
};

export const WithRemarkAndAside: Story = {
  render: () => (
    <DocumentRow
      as="div"
      titleAs="h3"
      title="Audited Accounts"
      state="review"
      statusLabel="Automatic check · Unsure · 78%"
      remark="Pages 3 to 6 are blurred. Upload a clear scan."
      file={{ name: "annexure-7.pdf", size: "212 KB", href: "#" }}
      aside={<span>Your verdict: Not reviewed</span>}
    />
  ),
};

/**
 * `collapsible` with a `summary`: an officer's list where an earlier grade has already verified
 * the document. The row folds to one line; the file, the reason and the verdict (`aside`) sit
 * behind Details. Never collapsible while the reader must still act on the document.
 */
function FoldedOfficerRows() {
  const [open, setOpen] = React.useState(false);
  return (
      <DocumentChecklistGroup title="Annual Documents">
        <DocumentRow
          number={7}
          title="Audited Accounts (Balance Sheet, Income & Expenditure, Receipt & Payment)"
          required
          state="verified"
          statusLabel="Automatic check · Looks right\u00a0·\u00a098%"
          summary="Verified by ASO, 21 Jul 2026"
          collapsible
          expanded={open}
          onExpandedChange={setOpen}
          file={{ name: "annexure-7.pdf", size: "444 KB", date: "03 Apr 2026" }}
          action={<Button size="sm" appearance="outlined">View</Button>}
          aside={<span>Officer&apos;s verdict: Verified, by the Assistant Section Officer, 21 Jul 2026</span>}
        />
        <DocumentRow
          number={8}
          title="Utilisation Certificate (GFR 12-A) — Previous Year, CA-signed"
          required
          state="review"
          statusLabel="Automatic check · Unsure\u00a0·\u00a074%"
          reason="Some of the text is too faint to read."
          file={{ name: "annexure-8.pdf", size: "104 KB", date: "16 Jun 2026" }}
          action={<Button size="sm" appearance="outlined">View</Button>}
          aside={<span>Officer&apos;s verdict: Not reviewed</span>}
        />
      </DocumentChecklistGroup>
  );
}

export const FoldedOfficerRow: Story = {
  render: () => <FoldedOfficerRows />,
};

/** The reviewed-document row: one line from 760px, verdict in the line. */
export const CompactOfficerRow: Story = {
  render: () => (
    <DocumentChecklistGroup title="Required Documents" hideRequiredMarks>
      <DocumentRow
        density="compact"
        number={1}
        title="Registration Certificate (Societies Registration Act 1860 / Charitable Trust)"
        required
        state="verified"
        statusLabel="Automatic check · Looks right"
        file={{ name: "Registration_Certificate_of_the_Organisation.pdf", size: "212 KB", date: "14 Sep 2026" }}
        aside={<span>Verified</span>}
        action={<Button size="sm" appearance="outlined">View</Button>}
      />
    </DocumentChecklistGroup>
  ),
};

/** A repeated reason cut to one line on a wide row; the full sentence stays in the DOM. */
export const ClampedReason: Story = {
  args: {
    clampReason: true,
    reason: "This is a financial statement (Form-VII) showing income and expenditure, not the Registration Certificate of the organisation.",
  },
};
