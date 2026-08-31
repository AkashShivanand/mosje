import type { Meta, StoryObj } from "@storybook/react";
import { PortalCard } from "@mosje/design-system";

/**
 * **PortalCard** — one portal in a grid of them, in two densities.
 *
 * **`variant` is the only real decision, and it is about the READER, not the
 * space.** `compact` is for someone who already knows which portal they want and
 * is FINDING it — the SAMAVESH banner drawer, and the change-portal side sheet on
 * a login page. `detailed` is for someone CHOOSING — the `/portals` directory,
 * where the description and the category are what they are deciding on. Picking
 * `detailed` because a surface has room going spare is picking it for the wrong
 * reason; the extra content has to be content the reader needs.
 *
 * Everything else is identical between them — the saffron rule, the white ground,
 * the mark's tile, the code over the name, every shared measurement. That is
 * deliberate: three surfaces show the same object, and a reader who learns to
 * recognise it in one must recognise it in the others.
 *
 * **The mark comes from `OrgLogo`.** Pass `path` (a portal route) or `org` (a
 * slug); never a file. `logoSrc` is gone — a card that named its own asset is how
 * the estate ended up with the same 16 marks in two directories and three roots.
 *
 * **`href` is required, and `planned` is gone.** Every surface lists LIVE portals
 * only, so the non-interactive "In development" card has no caller — and an
 * optional destination is how an unbuilt portal got rendered as a link in the
 * first place, which shipped a 404 to citizens on every page of the website. A
 * required prop makes that impossible at build time rather than at runtime.
 *
 * **When NOT to use it:** for anything that is not a portal. It is not a generic
 * link card — the accent slot expects a short code and the border is bound to the
 * SAMAVESH saffron. Reach for `Card` for general content.
 */
const meta = {
  title: "Navigation/PortalCard",
  component: PortalCard,
  parameters: { layout: "padded" },
  args: {
    code: "SCW",
    name: "Senior Citizens Welfare",
    href: "/portals/scw",
    path: "/portals/scw",
  },
} satisfies Meta<typeof PortalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `compact` — the default. Mark, code, name, and nothing else. */
export const Compact: Story = {};

/**
 * `detailed` — the same card with room to explain itself.
 *
 * `description` and `category` are rendered by this variant ONLY; `compact`
 * ignores both rather than silently truncating them, so passing them to the wrong
 * variant loses content quietly. Check the variant before you add the props.
 */
export const Detailed: Story = {
  args: {
    variant: "detailed",
    code: "PM-AJAY",
    name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana",
    href: "/portals/pm-ajay",
    path: "/portals/pm-ajay",
    description:
      "Adarsh Gram, Grants-in-Aid and Hostel components for Scheduled Caste habitations.",
    category: "Scheme Portals",
    ctaLabel: "Open portal",
  },
};

/**
 * `selected` — the change-portal side sheet's current entry.
 *
 * A heavier rule plus a filled check, never a fill: a tinted card would compete
 * with the saffron code for the same attention. The check is not the only signal
 * — a visually-hidden "Current portal" rides with it and `aria-current="true"` is
 * set, because a green tick alone is colour and shape carrying meaning [WCAG 1.4.1].
 */
export const Selected: Story = {
  args: { selected: true },
};

/**
 * No mark for this route, so the State Emblem — which is CORRECT, not a
 * placeholder. A portal without a bespoke logo is still a Government of India
 * property. Never substitute a grey box or an initial.
 */
export const EmblemFallback: Story = {
  args: {
    code: "SAMBAL",
    name: "National Action Plan for Older Persons",
    href: "/portals/nhapoa",
    path: "/portals/nhapoa",
  },
};

/**
 * `external` opens in a new tab, and the warning comes WITH it — you do not add
 * one. An `open_in_new` glyph renders beside the name, and the accessible name
 * gains a visually-hidden "(opens in a new tab)".
 *
 * Both are needed, and that is the part worth knowing: the glyph is `aria-hidden`
 * so a screen reader never sees it, and an `aria-label` is invisible to a sighted
 * reader. One without the other announces the new tab to half the audience.
 *
 * Every portal is a separate property in production, so this ends up on for all of
 * them — which is exactly why it is NOT a separate card style. A directory where
 * every card carries the same decoration is one where the decoration says nothing.
 */
export const External: Story = {
  args: {
    code: "NCSC",
    name: "National Commission for Scheduled Castes",
    href: "https://ncsc.nic.in/",
    org: "ncsc",
    path: undefined,
    external: true,
  },
};

/** The banner drawer's grid — `compact`, four across. */
export const CompactGrid: Story = {
  render: () => (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "var(--sa-inline-16)",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {[
        { code: "PM-AJAY", name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana", href: "/portals/pm-ajay" },
        { code: "SMILE", name: "Beggary Rehabilitation", href: "/portals/smile-admin" },
        { code: "NMBA", name: "Nasha Mukt Bharat Abhiyaan", href: "/portals/nmba" },
        { code: "SCW", name: "Senior Citizens Welfare", href: "/portals/scw" },
      ].map((p) => (
        <li key={p.code} style={{ display: "flex" }}>
          <PortalCard {...p} path={p.href} />
        </li>
      ))}
    </ul>
  ),
};

/** The `/portals` directory's grid — `detailed`, equal heights across a row. */
export const DetailedGrid: Story = {
  render: () => (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "var(--sa-inline-16)",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {[
        {
          code: "PM-AJAY",
          name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana",
          href: "/portals/pm-ajay",
          description: "Adarsh Gram, Grants-in-Aid and Hostel components for Scheduled Caste habitations.",
        },
        {
          code: "NMBA",
          name: "Nasha Mukt Bharat Abhiyaan",
          href: "/portals/nmba",
          description: "Substance-use prevention: treatment centres, outreach and district reporting.",
        },
        {
          code: "e-Anudaan",
          name: "Grant-in-Aid Management",
          href: "/portals/e-anudaan",
          description:
            "NGO applications under SHRESHTA, AVYAY, NAPDDR and SMILE through the Programme Division and Integrated Finance Division approval chains.",
        },
      ].map((p) => (
        <li key={p.code} style={{ display: "flex" }}>
          <PortalCard {...p} variant="detailed" path={p.href} category="Scheme Portals" />
        </li>
      ))}
    </ul>
  ),
};
