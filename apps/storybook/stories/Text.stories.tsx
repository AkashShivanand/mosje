import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "@mosje/design-system";

/**
 * **Text** — a run of copy bound to a body, label or title role.
 *
 * It never sets a size, leading, tracking or weight of its own; the role's tokens
 * do. `measure` caps the line at about 68 characters, `flow` gives consecutive
 * paragraphs the role's paragraph spacing, `numeric` sets tabular figures, and
 * `lang="hi"` switches a Devanagari run to its face and leading.
 *
 * Lifecycle: **Stable** (v0.42.0).
 */
const meta = {
  title: "Components/Layout/Text",
  component: Text,
  args: {
    variant: "body-1",
    measure: true,
    children:
      "Villages declared as Adarsh Gram and hostels sanctioned under the scheme, at the locations recorded in the PM-AJAY Management Information System.",
  },
  argTypes: {
    as: { control: "select", options: ["p", "span", "div", "small", "strong", "em", "li", "dd", "dt", "figcaption", "label", "legend", "caption", "time"] },
    variant: {
      control: "select",
      options: ["body-1", "body-2", "body-3", "label-1", "label-2", "label-3", "title-1", "title-2", "title-3"],
    },
    tone: { control: "inline-radio", options: ["base", "subtle", "inverse", "brand", "inherit"] },
    measure: { control: "boolean" },
    numeric: { control: "boolean" },
    flow: { control: "boolean" },
    children: { control: "text" },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Roles: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--sa-stack-12)" }}>
      <Text as="span" variant="title-1">Title 1 — Grants Released to States</Text>
      <Text as="span" variant="title-2">Title 2 — Andhra Pradesh</Text>
      <Text as="span" variant="title-3">Title 3 — District</Text>
      <Text as="span" variant="body-1">Body 1 — running text at the reading size</Text>
      <Text as="span" variant="body-2">Body 2 — secondary text and table cells</Text>
      <Text as="span" variant="body-3" tone="subtle">Body 3 — captions and timestamps</Text>
      <Text as="span" variant="label-1">Label 1 — form labels and buttons</Text>
      <Text as="span" variant="label-2">Label 2 — badges and chips</Text>
      <Text as="span" variant="label-3">Label 3 — overline</Text>
      <Text as="span" variant="body-1" numeric>1,24,560 · 98,410 · 7,205</Text>
      <Text lang="hi">सामाजिक न्याय और अधिकारिता मंत्रालय</Text>
    </div>
  ),
};

/** Paragraph rhythm: `flow` uses the role's paragraph-spacing token between blocks. */
export const Prose: Story = {
  render: () => (
    <div>
      <Text measure flow>
        The Department of Social Justice and Empowerment is entrusted with the welfare, social justice and
        empowerment of disadvantaged and marginalised sections of society.
      </Text>
      <Text measure flow>
        The scheme provides financial assistance to Scheduled Caste students studying at post-matriculation
        level to enable them to complete their education.
      </Text>
      <Text measure flow variant="body-2" tone="subtle">
        Figures as on 31 March 2026.
      </Text>
    </div>
  ),
};
