import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "@mosje/design-system";

/**
 * **Heading** — an h1–h6 bound to one of the 21 type roles.
 *
 * `level` is the document outline and is required. The role defaults from it
 * (h1 → headline-1 … h6 → headline-6), so the common case is one prop; pass
 * `variant` to depart — a hero h1 at a display role, a card h3 at a title role.
 * Every role is fluid and surface-aware from the tokens, which is why the
 * portal story below renders smaller from the same props.
 *
 * Lifecycle: **Stable** (v0.42.0).
 */
const meta = {
  title: "Components/Layout/Heading",
  component: Heading,
  args: {
    level: 2,
    children: "Grants Released to States",
  },
  argTypes: {
    level: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
    variant: {
      control: "select",
      options: [
        undefined,
        "display-1", "display-2", "display-3", "display-4", "display-5", "display-6",
        "headline-1", "headline-2", "headline-3", "headline-4", "headline-5", "headline-6",
        "title-1", "title-2", "title-3",
      ],
    },
    tone: { control: "inline-radio", options: ["base", "subtle", "inverse", "brand", "inherit"] },
    measure: { control: "boolean" },
    children: { control: "text" },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const OUTLINE = (
  <div style={{ display: "grid", gap: "var(--sa-stack-16)" }}>
    <Heading level={1} variant="display-4">Digital India, Inclusive India</Heading>
    <Heading level={1}>Scheme Coverage</Heading>
    <Heading level={2}>Grants Released to States</Heading>
    <Heading level={3}>Andhra Pradesh</Heading>
    <Heading level={4}>Districts</Heading>
    <Heading level={3} variant="title-1">Post-Matric Scholarship for Scheduled Castes</Heading>
    <Heading level={2} lang="hi">हर नागरिक के लिए न्याय</Heading>
  </div>
);

/** The website surface (default): the expressive ramp. */
export const Outline: Story = { render: () => OUTLINE };

/** The same elements inside a portal: Display and Headline are cut denser; Title is identical. */
export const PortalOutline: Story = {
  render: () => <div data-surface="portal">{OUTLINE}</div>,
};
