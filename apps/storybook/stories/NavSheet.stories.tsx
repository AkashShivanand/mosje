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

/**
 * `search` puts a field above the nav list. Pass it only where the surface has
 * something to search — an empty search box is a promise the sheet cannot keep,
 * and on a 344px sheet it costs a row of navigation to make it.
 */
export const WithSearch: Story = {
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
    search: {
      placeholder: "Search schemes and documents",
      onSearch: () => {},
    },
  },
  render: function WithSearch(args) {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 480, padding: 24 }}>
        <SheetToggle open={open} onOpen={() => setOpen(true)} />
        <p style={{ marginTop: 16, maxWidth: 420 }}>
          Narrow the viewport below 1024px to see the sheet.
        </p>
        <NavSheet {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};

const BASE = {
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
};

/**
 * **The query belongs to the header, not to the sheet.** `searchValue` and
 * `onSearchValueChange` make it a controlled field.
 *
 * The sheet used to hold its own state, and the consequence was invisible until
 * someone did the obvious thing: type into the masthead's search on a phone, open
 * the menu, and watch what you had typed disappear. Two fields, two states, one
 * apparent search box.
 *
 * Type into the field below and close the sheet — the text is still there when it
 * reopens, because this story owns it, exactly as `SiteHeader` does.
 */
export const ControlledSearchValue: Story = {
  args: { ...BASE, search: { placeholder: "Search schemes and documents", onSearch: () => {} } },
  render: function ControlledSearchValue(args) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("scholarship");
    return (
      <div style={{ minHeight: 480, padding: 24 }}>
        <SheetToggle open={open} onOpen={() => setOpen(true)} />
        <p style={{ marginTop: 16, maxWidth: 420 }}>
          The owner’s copy of the query: <strong>{query || "(empty)"}</strong>
        </p>
        <NavSheet
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          searchValue={query}
          onSearchValueChange={setQuery}
        />
      </div>
    );
  },
};

/**
 * **The foot of the sheet is where the accessibility controls go, because
 * `AccessibilityBar` sheds all three below `breakpoint/tablet`.** Text size,
 * accessibility options and language exist on desktop and, until this section
 * existed, simply vanished on a phone — the surface where they matter most.
 *
 * `accessibilityControls` renders the section and is on by default.
 * `accessibility`, `accessibilityHref` and `onAccessibility` are the same three
 * props `SiteHeader` takes, passed straight through: the href is the
 * GIGW-required accessibility statement, and `onAccessibility` opens the UX4G
 * widget instead if the surface has one. `language` is the selector, or `false`
 * to omit it on a single-language surface.
 */
export const AccessibilitySection: Story = {
  args: {
    ...BASE,
    accessibilityControls: true,
    accessibility: true,
    accessibilityHref: "#accessibility-statement",
    onAccessibility: () => {},
    language: { label: "English", onClick: () => {} },
  },
  render: function AccessibilitySection(args) {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 520, padding: 24 }}>
        <SheetToggle open={open} onOpen={() => setOpen(true)} />
        <NavSheet {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};

/**
 * **`accessibilityControls={false}` omits the section entirely** — for a surface
 * that keeps its own accessibility affordances visible at every width, so the
 * sheet would be repeating controls the reader can already see.
 *
 * Do not pass `false` merely to save space. These are statutory controls, and a
 * phone is the width where they are hardest to reach; if nothing else on the
 * surface offers them, the sheet is the last place they exist.
 */
export const WithoutAccessibilitySection: Story = {
  args: { ...BASE, accessibilityControls: false },
  render: function WithoutAccessibilitySection(args) {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 480, padding: 24 }}>
        <SheetToggle open={open} onOpen={() => setOpen(true)} />
        <NavSheet {...args} open={open} onClose={() => setOpen(false)} />
      </div>
    );
  },
};
