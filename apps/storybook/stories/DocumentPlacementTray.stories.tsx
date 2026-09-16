import type { Meta, StoryObj } from "@storybook/react-vite";
import { DocumentPlacementTray } from "@mosje/design-system";

/**
 * **DocumentPlacementTray** — what a batch drop did: `items` (placed, with `replaces`; unplaced,
 * with `unplacedReason`; `rejected` with its reason), the documents a file can go to (`options`,
 * empty ones first), `onChange`, `onRemove`, `onDone`, and an optional `title` over the default
 * "We placed N of M files." Past `collapseAfter` lines, plainly placed files fold away and the
 * lines needing a look lead.
 *
 * Lifecycle: **New**.
 *
 * @covers DocumentPlacementTray
 */
const meta = {
  title: "Components/Forms/Document placement tray",
  component: DocumentPlacementTray,
  args: {
    items: [
      { id: "a", fileName: "budget-2026-27.pdf", size: "400 KB", targetId: "6" },
      { id: "b", fileName: "annual-report-2025-26.pdf", size: "900 KB", targetId: "3", replaces: "annual_2025.pdf" },
      { id: "c", fileName: "scan0043.pdf", size: "300 KB", targetId: null, unplacedReason: "We couldn't tell what this is." },
      { id: "d", fileName: "rent.pdf", size: "7.2 MB", targetId: null, rejected: "This file is 7.2 MB. The limit is 5 MB." },
    ],
    options: [
      { id: "3", label: "3. Annual Report — Previous Financial Year", filled: true },
      { id: "5", label: "5. List of Managing Committee Members" },
      { id: "6", label: "6. Budget Estimates — Current Year" },
    ],
    title: undefined,
    onChange: () => {},
    onRemove: () => {},
    onDone: () => {},
    collapseAfter: 4,
  },
  argTypes: { onChange: { action: "moved" }, onRemove: { action: "removed" }, onDone: { action: "done" }, title: { control: "text" } },
} satisfies Meta<typeof DocumentPlacementTray>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
