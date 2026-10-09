import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, DashboardHeader, Icon, OrgLogo } from "@mosje/design-system";

/**
 * **DashboardHeader** — the head of one dashboard's page: whose dashboard it is (`mark`,
 * `title`, `subtitle`), one `summary` sentence in the Department's words, the `meta` line
 * saying which period the figures describe and who publishes them, and the one way out
 * (`action`) — the portal, or the Department's own page. In the dashboard's colour.
 *
 * **Nothing the page says again below.** The banner it replaced carried a kicker repeating its
 * own title, four figures repeating the cards under it, and the portal's name twice. What is
 * left is what only the head can say; the figures stay in the cards where they are explained.
 *
 * The title is the page's heading at `headingLevel`; the mark is on a white ground and
 * takes no accessible name, because the title names it. Use the portal's own mark or none —
 * the Department's card uses the National Emblem, which `OrgLogo` falls back to when given
 * no path.
 *
 * Lifecycle: **Beta**.
 */
const meta = {
  title: "Components/Dashboard/DashboardHeader",
  component: DashboardHeader,
  parameters: { layout: "padded" },
  args: {
    tone: "primary",
    headingLevel: 2,
    mark: <OrgLogo org="nmba" size="md" name="" />,
    title: "NMBA",
    subtitle: "Nasha Mukt Bharat Abhiyaan",
    summary:
      "A nationwide campaign to create awareness on the ill effects of substance abuse and to identify, treat and rehabilitate persons affected by it.",
    meta: "As on 30.09.2026 · Published by the Department of Social Justice and Empowerment",
    action: (
      <Button appearance="outlined" tone="inverse" size="sm" href="#portal" iconRight={<Icon name="arrow_outward" size={16} />}>
        Open Portal
      </Button>
    ),
  },
  argTypes: {
    tone: { control: "select", options: ["primary", "secondary", "info", "success", "warning", "danger"] },
    headingLevel: { control: "inline-radio", options: [2, 3, 4] },
    title: { control: "text" },
    subtitle: { control: "text" },
    summary: { control: "text" },
    meta: { control: "text" },
    mark: { control: false },
    action: { control: false },
    headingId: { control: false },
  },
} satisfies Meta<typeof DashboardHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

/** A scheme portal: its mark, name, summary, period and the way to its portal. */
export const Playground: Story = {};

/** The Department's own dashboard: the National Emblem as the mark, no way out. */
export const Department: Story = {
  args: {
    title: "Department of Social Justice and Empowerment",
    subtitle: "Beneficiary Dashboard",
    mark: <OrgLogo path={null} size="md" name="" />,
    summary:
      "Scholarships, fellowships, hostels and top class education for students from Scheduled Castes, Other Backward Classes, Economically Backward Classes and Denotified Tribes.",
    meta: "As on 30.09.2026",
    action: undefined,
  },
};

/** Only a title: no mark, subtitle, summary, meta or action. */
export const TitleOnly: Story = {
  args: {
    title: "Senior Citizens Welfare",
    subtitle: undefined,
    mark: undefined,
    summary: undefined,
    meta: undefined,
    action: undefined,
    tone: "success",
  },
};

/** The header takes the colour of the dashboard it heads. */
export const Tones: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      <DashboardHeader {...args} tone="info" mark={<OrgLogo org="smile" size="md" name="" />} title="SMILE – Beggary" subtitle="Comprehensive Rehabilitation of Persons Engaged in Begging" />
      <DashboardHeader {...args} tone="secondary" mark={undefined} title="e-Utthaan" subtitle="Scheduled Caste Education Portal" />
    </div>
  ),
};
