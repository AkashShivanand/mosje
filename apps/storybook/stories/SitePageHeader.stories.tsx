import type { Meta, StoryObj } from "@storybook/react";
import { SitePageHeader, FactStrip, buttonClasses, Icon } from "@mosje/design-system";

const meta = {
  title: "Layout/SitePageHeader",
  component: SitePageHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The blue band every **website** page opens with, in the two levels the Figma " +
          "handoff defines: **L1** an organisation or scheme's own front page, **L2** any " +
          "page beneath one.\n\n" +
          "**Not to be confused with `PageHeader`,** which is the portal title row — a " +
          "heading, a meta line and some buttons on the page's own background, used by 80 " +
          "admin pages. This one is a full-bleed banner with a brand gradient, a portrait " +
          "and an overlapping fact card. They share a word in English and nothing else.\n\n" +
          "**The gradient is built from the brand ramp, not from Figma's hex.** The design " +
          "paints the band `#0373df → #3f83c6`; only the first is a Figma variable, the " +
          "second is an unbound raw fill (flagged for the library owner). Reproducing that " +
          "hex would freeze the band to the blue brand, and this estate is white-label — " +
          "`data-brand=\"navy\"` and the DBIM palette must retheme it. So the second stop is " +
          "the ramp's own next shade.\n\n" +
          "**`overlay`** is the slot the “at a glance” card sits in. It overlaps the band's " +
          "lower edge by 64px; the header reserves the space, the page decides what goes " +
          "in it — normally a `FactStrip`, which the system already has.",
      },
    },
  },
} satisfies Meta<typeof SitePageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const LEAD = (
  <>
    <strong>A Constitutional Body under Article 338 of the Constitution of India.</strong>{" "}
    The Commission is established with a view to provide safeguards against the exploitation
    of Scheduled Castes and to protect and promote their social, educational, economic and
    cultural interests.
  </>
);

const FACTS = [
  { icon: "account_balance", value: "2004", label: "Established" },
  { icon: "domain", value: "New Delhi", label: "Headquarters" },
  { icon: "distance", value: "12 across India", label: "Regional Offices" },
  { icon: "assignment", value: "21 since 2004", label: "Reports Submitted" },
];

/** L1 — an organisation's own front page, with every slot filled. */
export const LandingL1: Story = {
  args: {
    variant: "landing",
    title: "National Commission for Scheduled Castes (NCSC)",
    lead: LEAD,
    actions: (
      <a href="#" className={buttonClasses("primary", "filled", "md")}>
        Login as Citizen
        <Icon name="arrow_forward" size={16} />
      </a>
    ),
    overlay: <FactStrip items={FACTS} ariaLabel="NCSC at a glance" />,
  },
};

/**
 * L2 — a page beneath the organisation. A back link to the parent and a title,
 * and deliberately nothing else: an inner page's job is the content below the
 * fold, and repeating the parent's furniture on every child pushes it down.
 */
export const InnerL2: Story = {
  args: {
    variant: "inner",
    title: "About the Commission",
    eyebrow: (
      <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "inherit" }}>
        <Icon name="arrow_left_alt" size={24} />
        National Commission for Scheduled Castes (NCSC)
      </a>
    ),
  },
};

/**
 * The same L1 without the fact card. The band closes at its own padding rather
 * than reserving 64px for an overlay that never arrives — the reserved space is
 * tied to the slot, not to the variant.
 */
export const LandingWithoutOverlay: Story = {
  args: {
    variant: "landing",
    title: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna (PM-AJAY)",
    lead: "PM-AJAY is a flagship scheme dedicated to the socio-economic empowerment of Scheduled Castes.",
  },
};

/**
 * A forty-word official name. The title breaks mid-word rather than overflowing
 * the band, which is what official department names actually require.
 */
export const VeryLongTitle: Story = {
  args: {
    variant: "inner",
    title:
      "Illustrative List Of Projects Under Various Domains For Development Of Scheduled Castes Families Under The Scheme",
    eyebrow: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna (PM-AJAY)",
  },
};

/**
 * The complete L1 as the handoff draws it — `logo` above the title, `media` on
 * the trailing edge, and `headingId` so the band can be pointed at by a region's
 * `aria-labelledby`.
 *
 * `media` is rendered `aria-hidden`: the portrait repeats nothing the copy does
 * not already say, so a reader who never sees it loses nothing. The placeholder
 * here stands in for the department's own photograph.
 */
export const LandingWithLogoAndPortrait: Story = {
  args: {
    variant: "landing",
    headingId: "ncsc-heading",
    title: "National Commission for Scheduled Castes (NCSC)",
    logo: (
      <span
        style={{
          display: "grid",
          placeItems: "center",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "var(--sa-bg-neutral-base)",
        }}
      >
        <Icon name="account_balance" size={48} />
      </span>
    ),
    lead: LEAD,
    actions: (
      <a href="#" className={buttonClasses("primary", "filled", "md")}>
        Login as Citizen
        <Icon name="arrow_forward" size={16} />
      </a>
    ),
    media: (
      <span
        style={{
          display: "block",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--sa-color-primaryScale-700, #004a8f) 62%, transparent 63%)",
        }}
      />
    ),
    overlay: <FactStrip items={FACTS} ariaLabel="NCSC at a glance" />,
  },
};
