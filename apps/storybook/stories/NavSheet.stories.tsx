import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NavSheet, SheetToggle, type NavItem } from "@mosje/design-system";

const EMBLEM = "/images/National-Emblem-logo.svg";

/**
 * **NavSheet** — the mobile navigation overlay (Figma `Navbar/NavSheet`).
 *
 * `SiteHeader` renders it below 1024px; import it directly only for a surface
 * that needs mobile navigation without a masthead.
 *
 * It is **not a modal**. It is a disclosure region with its own close control, so
 * it does not trap focus — the same rule the Chatbot panel carries. Escape closes
 * it. That is also why its trigger is `SheetToggle` and not `MenuToggle`: the
 * sheet dismisses itself, so the trigger has nothing to mirror and carries one
 * glyph.
 *
 * Figma models three states — Default, Expanded, Mega. They are states of this
 * one component (nothing open, one row open, a flattened organisation list open),
 * not variants a consumer picks. A mega-menu's columns flatten into a single list
 * here, because a 344px sheet has no room for a grid.
 *
 * Lifecycle: **Stable**.
 *
 * Three props carry no visual variant and so have no story: `id` pairs with the
 * opening toggle's `controlsId` to make `aria-controls` real, `emblemAlt` is the
 * emblem's alt text and must name the emblem rather than repeat the ministry
 * line beside it, and `actions` slots a login or account control into the foot
 * of the sheet for surfaces whose masthead is not rendered.
 */
const meta = {
  title: "Components/Navigation/NavSheet",
  component: NavSheet,
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55327-3503"
    }, layout: "fullscreen" },
} satisfies Meta<typeof NavSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const NAV: NavItem[] = [
  { label: "Home", href: "#", active: true },
  { label: "Department", href: "#", children: [
    { label: "About Us", href: "#" },
    { label: "Who’s Who", href: "#" },
    { label: "Directory", href: "#" },
  ] },
  { label: "Associated Organisations", href: "#", columns: [
    { heading: "Commissions", items: [
      { abbr: "NCSC", name: "National Commission for Scheduled Castes", href: "#" },
      { abbr: "NCBC", name: "National Commission for Backward Classes", href: "#" },
    ] },
    { heading: "Corporations", items: [
      { abbr: "NSFDC", name: "National SC Finance and Development Corporation", href: "#" },
    ] },
  ] },
  { label: "Documents", href: "#", children: [{ label: "Acts & Rules", href: "#" }] },
  { label: "Contact", href: "#" },
];

/** Open the sheet with its own trigger, exactly as the masthead does. */
export const Playground: Story = {
  args: {
    open: false,
    onClose: () => {},
    nav: NAV,
    emblemSrc: EMBLEM,
    brandLines: {
      org: "Government of India",
      ministry: "Ministry of Social Justice & Empowerment",
      department: "Department of Social Justice & Empowerment",
    },
    homeHref: "#",
  },
  render: function Playground(args) {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 480, padding: 24 }}>
        <SheetToggle open={open} onOpen={() => setOpen(true)} />
        <p style={{ marginTop: 16, maxWidth: 420 }}>
          The sheet is fixed to the viewport edge and hidden from 1024px up — view
          this story in a narrow viewport to see it.
        </p>
        <NavSheet {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};
