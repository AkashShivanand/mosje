import type { Meta, StoryObj } from "@storybook/react";
import { DocumentFindings } from "@mosje/design-system";

/**
 * **DocumentFindings** — "What we found": `summary`, `fields` (each with `expected` and `matches`
 * against the application's own answer, introduced by `expectedLabel`), every `reason`, and — for
 * officers only — `confidence` against its threshold. `emptyText` when nothing was read.
 *
 * Lifecycle: **New**.
 *
 * @covers DocumentFindings
 */
const meta = {
  title: "Components/Forms/Document findings",
  component: DocumentFindings,
  args: {
    summary: "This Registration Certificate is for another organisation.",
    fields: [
      { label: "Organisation Name", found: "Illustrative Other Welfare Society", expected: "Sankalp Seva Sansthan", matches: false },
      { label: "Registration Number", found: "51-54", expected: "51-54", matches: true },
      { label: "Member Count", found: "7" },
    ],
    reasons: ["Upload the Registration Certificate issued to Sankalp Seva Sansthan."],
    expectedLabel: "Your application says",
    emptyText: "No details could be read from this file.",
  },
  argTypes: { confidence: { control: "object" } },
} satisfies Meta<typeof DocumentFindings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Applicant: Story = {};
export const Officer: Story = { args: { confidence: { value: 78, threshold: 90 }, expectedLabel: "The application says" } };
export const NothingRead: Story = { args: { summary: undefined, fields: [], reasons: [] } };
