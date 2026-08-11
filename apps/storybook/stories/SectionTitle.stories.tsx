import type { Meta, StoryObj } from "@storybook/react";
import { Button, SectionTitle } from "@mosje/design-system";

/**
 * **SectionTitle** — the standard heading row for a content section.
 *
 * It exists to stop every page hand-rolling a `<div className="flex
 * justify-between">` with its own heading classes. Eyebrow, heading, count
 * pill, description and right-aligned actions, laid out the same way estate-wide.
 *
 * Use it for **content**. For a *form* section use `FormSection` or `FormCard`
 * — those own the card chrome and the section semantics; this is the plain
 * equivalent with no surface of its own.
 *
 * `as` is the prop people get wrong. It sets the heading level, and the right
 * value is whatever keeps the page outline sequential: inside a page whose
 * title is an `<h1>`, a section is `h2` and a sub-section `h3`. Do not pick it
 * for size — the visual treatment does not change with the level.
 *
 * `headingId` lets a table or list point `aria-labelledby` at this heading, so
 * the region is named without repeating the text.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Data display/SectionTitle",
  component: SectionTitle,
  args: {
    eyebrow: "Nasha Mukt Bharat Abhiyaan",
    title: "District submissions",
    description: "Reports filed by block nodal officers for the 18 August 2026 Mass Pledge.",
    count: 36,
    as: 2,
  },
  argTypes: {
    as: { control: "inline-radio", options: [2, 3, 4] },
    eyebrow: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    count: { control: "text" },
    headingId: { control: "text" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 860 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** With actions. Keep them to one or two — this is a heading, not a toolbar. */
export const WithActions: Story = {
  render: (args) => (
    <SectionTitle {...args}>
      <Button appearance="outlined" size="sm">
        Export
      </Button>
      <Button size="sm">Add a report</Button>
    </SectionTitle>
  ),
};

/** The minimum: a title on its own. */
export const TitleOnly: Story = {
  args: { eyebrow: undefined, description: undefined, count: undefined },
};

/** A count as a string, when the number needs a unit or a qualifier. */
export const StringCount: Story = {
  args: { count: "36 of 36", title: "Districts reporting", eyebrow: undefined },
};

/**
 * Heading levels. They look identical on purpose — pick the one that keeps the
 * outline sequential, never the one that looks right.
 */
export const HeadingLevels: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 32 }}>
      <SectionTitle {...args} as={2} title="Section (h2)" count={undefined} />
      <SectionTitle {...args} as={3} title="Sub-section (h3)" count={undefined} eyebrow={undefined} />
      <SectionTitle {...args} as={4} title="Sub-sub-section (h4)" count={undefined} eyebrow={undefined} />
    </div>
  ),
};

/** `headingId` names a table without repeating the heading text. */
export const NamingATable: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <SectionTitle {...args} headingId="sb-district-submissions" count={4} />
      <table
        aria-labelledby="sb-district-submissions"
        style={{ width: "100%", borderCollapse: "collapse", color: "var(--sa-color-text-default)" }}
      >
        <thead>
          <tr style={{ textAlign: "left", color: "var(--sa-color-text-muted)" }}>
            <th style={{ padding: "8px 12px 8px 0" }}>District</th>
            <th style={{ padding: "8px 12px 8px 0" }}>Blocks reporting</th>
            <th style={{ padding: "8px 12px 8px 0" }}>Participants</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Pune", "14 of 14", "3,86,240"],
            ["Nashik", "12 of 15", "2,41,880"],
            ["Nagpur", "13 of 13", "2,98,105"],
            ["Kolhapur", "9 of 12", "1,52,470"],
          ].map(([district, blocks, participants]) => (
            <tr key={district} style={{ borderTop: "1px solid var(--sa-border-neutral-subtle)" }}>
              <td style={{ padding: "10px 12px 10px 0" }}>{district}</td>
              <td style={{ padding: "10px 12px 10px 0" }}>{blocks}</td>
              <td style={{ padding: "10px 12px 10px 0" }}>{participants}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
