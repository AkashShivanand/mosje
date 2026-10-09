import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, HeadlineBand } from "@mosje/design-system";

/**
 * **HeadlineBand** — the figures a dashboard opens with: one `lead` in display type, and a
 * few `figures` beside it, on the dashboard's colour. The lead answers the page's first
 * question; the figures beside it are the next few.
 *
 * A figure that leads a card further down the page can carry an `href` and link to it — the
 * band is the summary, the card the detail, so the figure appearing twice has a job. A
 * linked figure carries no `mark` (the link is the way to the explanation).
 *
 * The band is named by a visually hidden heading (`title`, at `headingLevel`), so it sits in
 * the page's outline and can take focus after the reader changes the area. `figuresLabel`
 * names the list of side figures for a screen reader. Pass `linkAs` (`next/link`) in the
 * app; Storybook has no router, so these stories leave it off.
 *
 * Lifecycle: **Beta**.
 */
const meta = {
  title: "Components/Dashboard/HeadlineBand",
  component: HeadlineBand,
  parameters: { layout: "padded" },
  args: {
    title: "At a Glance, All India",
    tone: "primary",
    headingLevel: 2,
    figuresLabel: "Other figures",
    lead: {
      value: "34.81 crore",
      label: "People reached in Total Outreach",
      context: "Nasha Mukt Bharat Abhiyaan, as on 30.09.2026.",
    },
    figures: [
      { key: "volunteers", value: "1.12 lakh", label: "Master Volunteers", context: "Trained across 372 districts." },
      { key: "calls", value: "10.33 lakh", label: "Helpline Calls", context: "Received on the toll-free line since launch." },
      { key: "funds", value: "₹250 Cr", label: "Released in 2026-27", context: "Against a Budget Estimate of ₹318 Cr." },
      { key: "persons", value: "19,810", label: "Persons Identified", context: "SMILE – Beggary, as on 30.09.2026." },
    ],
  },
  argTypes: {
    tone: { control: "select", options: ["primary", "secondary", "info", "success", "warning", "danger"] },
    headingLevel: { control: "inline-radio", options: [2, 3, 4] },
    title: { control: "text" },
    figuresLabel: { control: "text" },
    lead: { control: false },
    figures: { control: false },
    linkAs: { control: false },
    headingId: { control: false },
  },
} satisfies Meta<typeof HeadlineBand>;
export default meta;
type Story = StoryObj<typeof meta>;

/** One lead and four side figures. */
export const Playground: Story = {};

/** A single side figure takes the full width beside the lead rather than leaving a hole. */
export const OneSideFigure: Story = {
  args: {
    title: "At a Glance, Kerala",
    figures: [{ key: "volunteers", value: "4,180", label: "Master Volunteers", context: "Trained across 14 districts." }],
  },
};

/** No side figures: the lead stands alone. */
export const LeadOnly: Story = {
  args: { title: "At a Glance, Senior Citizens Welfare", figures: undefined },
};

/** A figure with `href` is a link to the card that explains it further down the page. It carries no mark. */
export const FigureThatLinks: Story = {
  args: {
    figures: [
      { key: "volunteers", value: "1.12 lakh", label: "Master Volunteers", context: "Trained across 372 districts.", href: "#volunteers" },
      { key: "calls", value: "10.33 lakh", label: "Helpline Calls", context: "Received on the toll-free line since launch.", href: "#helpline" },
      { key: "funds", value: "₹250 Cr", label: "Released in 2026-27", mark: <Badge status="info">Received</Badge> },
    ],
  },
};

/** The band takes the colour of the dashboard it opens. */
export const Tones: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      <HeadlineBand {...args} tone="secondary" title="At a Glance, e-Utthaan" figures={args.figures?.slice(0, 2)} />
      <HeadlineBand {...args} tone="success" title="At a Glance, Senior Citizens Welfare" figures={args.figures?.slice(0, 2)} />
    </div>
  ),
};
