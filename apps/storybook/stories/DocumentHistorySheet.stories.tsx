import type { Meta, StoryObj } from "@storybook/react-vite";
import { DocumentHistorySheet } from "@mosje/design-system";

/**
 * **DocumentHistorySheet** — every version of one document in a side sheet: `open`, `onClose`,
 * `title`, `entries` (current first, each with `status`, `note`, and `href` or `onView`), `linkAs`
 * for same-site hrefs, and `emptyText`.
 *
 * Lifecycle: **New**.
 *
 * @covers DocumentHistorySheet
 */
const meta = {
  title: "Components/Forms/Document history sheet",
  component: DocumentHistorySheet,
  args: {
    open: true,
    onClose: () => {},
    title: "Upload History — Budget Estimates — Current Year",
    entries: [
      { id: "3", fileName: "budget-v3.pdf", size: "95 KB", date: "16 Sep 2026", current: true, status: "Looks right" },
      { id: "2", fileName: "budget-v2.pdf", size: "90 KB", date: "16 Sep 2026", status: "Doesn't match", note: "Replaced 16 Sep 2026" },
      { id: "1", fileName: "budget.pdf", size: "6 KB", date: "14 Sep 2026", status: "Doesn't match", note: "Replaced after the Ministry's query" },
    ],
    emptyText: "No file has been uploaded for this document yet.",
  },
  argTypes: { onClose: { action: "closed" }, linkAs: { control: false } },
} satisfies Meta<typeof DocumentHistorySheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Empty: Story = { args: { entries: [] } };
