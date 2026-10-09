import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CardIcon,
  DashboardCard,
  DashboardCardList,
  DescriptionList,
  HeadlineFigure,
  OrgLogo,
  type DashboardCardListItem,
  type DashboardCardProps,
} from "@mosje/design-system";

/**
 * **DashboardCard** — one dashboard, summarised, on a page that lists several. Its mark,
 * its name, the scheme under it, one lead `figure`, a few facts as `children`, and a
 * "View Dashboard" link.
 *
 * **The whole card opens its dashboard.** The one link is stretched over the card, so a
 * reader can press anywhere while a screen reader still meets one named link and the
 * keyboard one tab stop. Give `href` **and** `linkLabel` — every card's visible text reads
 * "View Dashboard", so each needs its own accessible name ("View the NMBA Dashboard").
 * Without `href` the card is a plain summary card with no link and no footer.
 *
 * **DashboardCardList** lays the cards out for the number it holds, so no row has a hole:
 * `balanced` (one fills the width, three share a row, two/four/five lead with a wide and a
 * narrower card) or `lead` (the first two always share the first row, for a list whose
 * first card carries a map). Cards pair up below 1280px and stack on a phone. A card with
 * nothing to show is not drawn, so the list never assumes a count.
 *
 * Storybook has no router, so `linkAs` is not passed; in the app it is `next/link`.
 *
 * Lifecycle: **Beta**.
 *
 * @covers DashboardCard, DashboardCardList
 */
/*
 * `DashboardCardProps` is a union — a card with `href` must carry `linkLabel` — and Storybook's
 * controls need one flat shape, so the stories type their args against the flattened props.
 */
type CardArgs = Omit<DashboardCardProps, "href" | "linkLabel"> & { href?: string; linkLabel?: string };

const meta = {
  title: "Components/Dashboard/DashboardCard",
  component: DashboardCard as React.ComponentType<CardArgs>,
  parameters: { layout: "padded" },
  args: {
    title: "NMBA",
    subtitle: "Nasha Mukt Bharat Abhiyaan",
    tone: "primary",
    href: "#nmba",
    linkLabel: "View the NMBA Dashboard",
    ctaLabel: "View Dashboard",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["primary", "secondary", "info", "success", "warning", "danger"],
    },
    title: { control: "text" },
    subtitle: { control: "text" },
    note: { control: "text" },
    ctaLabel: { control: "text" },
    mark: { control: false },
    figure: { control: false },
    children: { control: false },
    linkAs: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<React.ComponentType<CardArgs>>;
export default meta;
type Story = StoryObj<typeof meta>;

const nmbaFigure = (
  <HeadlineFigure
    size="md"
    value="34.81 crore"
    label="People reached in Total Outreach"
    context="Awareness, training and outreach events combined, as on 30.09.2026."
  />
);

const nmbaFacts = (
  <DescriptionList
    size="md"
    columns={2}
    items={[
      { term: "Master Volunteers", value: "1.12 lakh" },
      { term: "Institutions Covered", value: "8.40 lakh" },
      { term: "Districts Reached", value: "372" },
      { term: "Helpline Calls", value: "10.33 lakh" },
    ]}
  />
);

/** The dashboards page's card: mark, name, scheme, lead figure, facts and the link. */
export const Playground: Story = {
  args: {
    mark: <OrgLogo org="nmba" size="md" name="" />,
    figure: nmbaFigure,
    children: nmbaFacts,
  },
};

/** Without `href` the card opens nothing: no link, no footer. For a summary the page does not link out of. */
export const WithoutLink: Story = {
  args: {
    title: "SMILE – Beggary",
    subtitle: "Support for Marginalised Individuals for Livelihood and Enterprise",
    tone: "info",
    href: undefined,
    linkLabel: undefined,
    mark: <OrgLogo org="smile" size="md" name="" />,
    figure: <HeadlineFigure size="md" value="19,810" label="Persons engaged in begging identified" />,
    children: (
      <DescriptionList
        size="md"
        columns={2}
        items={[
          { term: "Rehabilitated", value: "9,264" },
          { term: "Shelter Homes", value: "92" },
        ]}
      />
    ),
  },
};

/** `note` is one line above the figures, for what a reader must know first: here, All-India figures only. */
export const WithNote: Story = {
  args: {
    title: "Senior Citizens Welfare",
    subtitle: "Integrated Programme for Senior Citizens",
    tone: "success",
    href: "#senior-citizens",
    linkLabel: "View the Senior Citizens Welfare Dashboard",
    note: "This dashboard publishes All-India figures only.",
    mark: <CardIcon name="elderly" />,
    figure: <HeadlineFigure size="md" value="₹250 Cr" label="Released in 2026-27" context="Against a Budget Estimate of ₹318 Cr." />,
  },
};

/** `ctaLabel` changes the visible text; `linkLabel` still carries the full accessible name. */
export const CustomLinkText: Story = {
  args: {
    title: "e-Utthaan",
    subtitle: "Scheduled Caste Education Portal",
    tone: "secondary",
    href: "#e-utthaan",
    linkLabel: "Open the e-Utthaan Dashboard",
    ctaLabel: "Open Dashboard",
    mark: <CardIcon name="school" />,
    figure: <HeadlineFigure size="md" value="58.20 lakh" label="Students supported through scholarships" />,
  },
};

/* ── DashboardCardList ───────────────────────────────────────────────────── */

const CARDS: DashboardCardListItem[] = [
  {
    key: "department",
    id: "department",
    content: (
      <DashboardCard
        tone="primary"
        mark={<OrgLogo path={null} size="md" name="" />}
        title="Department of Social Justice and Empowerment"
        subtitle="Beneficiary Dashboard"
        href="#department"
        linkLabel="View the Department's Beneficiary Dashboard"
        figure={<HeadlineFigure size="md" value="58.20 lakh" label="Students supported through scholarships" />}
      >
        <DescriptionList size="md" columns={2} items={[{ term: "Hostels Sanctioned", value: "1,247" }, { term: "Fellowships", value: "12,180" }]} />
      </DashboardCard>
    ),
  },
  {
    key: "nmba",
    id: "nmba",
    content: (
      <DashboardCard
        tone="primary"
        mark={<OrgLogo org="nmba" size="md" name="" />}
        title="NMBA"
        subtitle="Nasha Mukt Bharat Abhiyaan"
        href="#nmba"
        linkLabel="View the NMBA Dashboard"
        figure={nmbaFigure}
      >
        {nmbaFacts}
      </DashboardCard>
    ),
  },
  {
    key: "smile",
    id: "smile",
    content: (
      <DashboardCard
        tone="info"
        mark={<OrgLogo org="smile" size="md" name="" />}
        title="SMILE – Beggary"
        subtitle="Comprehensive Rehabilitation of Persons Engaged in Begging"
        href="#smile"
        linkLabel="View the SMILE – Beggary Dashboard"
        figure={<HeadlineFigure size="md" value="19,810" label="Persons engaged in begging identified" />}
      />
    ),
  },
  {
    key: "senior",
    id: "senior-citizens",
    content: (
      <DashboardCard
        tone="success"
        mark={<CardIcon name="elderly" />}
        title="Senior Citizens Welfare"
        subtitle="Integrated Programme for Senior Citizens"
        href="#senior-citizens"
        linkLabel="View the Senior Citizens Welfare Dashboard"
        note="This dashboard publishes All-India figures only."
        figure={<HeadlineFigure size="md" value="₹250 Cr" label="Released in 2026-27" />}
      />
    ),
  },
  {
    key: "utthaan",
    id: "e-utthaan",
    content: (
      <DashboardCard
        tone="secondary"
        mark={<CardIcon name="school" />}
        title="e-Utthaan"
        subtitle="Scheduled Caste Education Portal"
        href="#e-utthaan"
        linkLabel="View the e-Utthaan Dashboard"
        figure={<HeadlineFigure size="md" value="58.20 lakh" label="Students supported" />}
      />
    ),
  },
];

const firstOf = (count: number) => CARDS.slice(0, count);

/** One card takes the width. */
export const ListOfOne: Story = {
  decorators: [(Story) => <div style={{ maxWidth: "none" }}><Story /></div>],
  render: () => <DashboardCardList aria-label="Dashboards" items={firstOf(1)} />,
};

/** Three share a row. */
export const ListOfThree: Story = {
  decorators: [(Story) => <div style={{ maxWidth: "none" }}><Story /></div>],
  render: () => <DashboardCardList aria-label="Dashboards" items={firstOf(3)} />,
};

/** Five lead with a wide card and a narrower one (7 + 5); the other three share the next row. */
export const ListOfFive: Story = {
  decorators: [(Story) => <div style={{ maxWidth: "none" }}><Story /></div>],
  render: () => <DashboardCardList aria-label="Dashboards" items={firstOf(5)} />,
};

/** `arrangement="lead"`: the first two always share the first row — for a list whose first card carries a map. Three lead with one across the width. */
export const ListLeadArrangement: Story = {
  decorators: [(Story) => <div style={{ maxWidth: "none" }}><Story /></div>],
  render: () => (
    <div style={{ display: "grid", gap: 32 }}>
      <DashboardCardList aria-label="Dashboards, five" arrangement="lead" items={firstOf(5)} />
      <DashboardCardList aria-label="Dashboards, three" arrangement="lead" items={firstOf(3)} />
    </div>
  ),
};

/** `items` of `[]` draws nothing at all — the page decides what an empty list says. */
export const ListEmpty: Story = {
  render: () => <DashboardCardList aria-label="Dashboards" items={[]} />,
};
