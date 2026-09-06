import type { Meta, StoryObj } from "@storybook/react";
import { FileList } from "@mosje/design-system";

/**
 * **File List** — the attachments on an application: what has been uploaded,
 * what state each one is in, and what can be done about it.
 *
 * **It is a list of states, not a list of names.** An attachment on this estate
 * is uploading, then being scanned, then attached — or it failed. A row showing
 * only a filename tells the citizen nothing about whether the department has
 * actually received it, which is the only question they have.
 *
 * **`scanning` is a real state, not a nicety.** Departmental uploads are
 * virus-scanned before they count as received, and a file that appears
 * "attached" and is rejected an hour later is worse than one that says it is
 * being checked.
 *
 * **The filename is never rewritten or clipped.** A citizen recognises their own
 * file by the name they gave it; a sanitised or truncated name makes them
 * wonder whether they uploaded the right thing. Long names wrap.
 *
 * **A failure says what to do.** "The file is larger than 5 MB" is actionable;
 * "Upload failed" sends the citizen back to a counter.
 *
 * Each row's action is named for its **file** — "Remove income-certificate.pdf",
 * not "Remove". A screen-reader user moving by link or button through twelve
 * attachments would otherwise hear "Remove" twelve times.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Data Display/File List",
  component: FileList,
  args: {
    label: "Documents attached to this application",
    onRemove: () => {},
    onRetry: () => {},
    files: [
      { id: "1", name: "aadhaar-card.pdf", kind: "Aadhaar card", size: 1_258_291, state: "ready" as const, href: "#a" },
      { id: "2", name: "income-certificate-2026-signed-by-tehsildar.pdf", kind: "Income certificate", size: 860_160, state: "scanning" as const },
      { id: "3", name: "bank-passbook.jpg", kind: "Bank passbook", size: 3_355_443, state: "uploading" as const, progress: 62 },
      { id: "4", name: "site-photograph.heic", kind: "Site photograph", size: 8_912_896, state: "failed" as const,
        error: "The file is larger than 5 MB. Reduce it and upload again." },
    ],
  },
  argTypes: {
    label: { control: "text" },
    files: { control: false },
    onRemove: { control: false },
    onRetry: { control: false },
  },
  decorators: [(Story) => <div style={{ padding: 24, maxWidth: 720 }}><Story /></div>],
} satisfies Meta<typeof FileList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All four states at once — attached, being checked, uploading, and failed. */
export const Playground: Story = {};

/** Read-only: no remove, no retry. The citizen's own view after submission. */
export const ReadOnly: Story = {
  args: {
    onRemove: undefined,
    onRetry: undefined,
    files: [
      { id: "1", name: "aadhaar-card.pdf", kind: "Aadhaar card", size: 1_258_291, state: "ready" as const, href: "#a" },
      { id: "2", name: "income-certificate.pdf", kind: "Income certificate", size: 860_160, state: "ready" as const, href: "#b" },
    ],
  },
};

/** One long filename, unclipped. It wraps rather than becoming an ellipsis. */
export const ALongName: Story = {
  args: {
    files: [
      { id: "1",
        name: "scanned-sanction-order-AVYAY-2026-27-district-bankura-west-bengal-final-signed.pdf",
        kind: "Sanction order", size: 2_411_724, state: "ready" as const, href: "#a" },
    ],
  },
};
