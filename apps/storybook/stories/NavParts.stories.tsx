import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  DropdownItem,
  MegaMenu,
  MegaMenuItem,
  MenuToggle,
  NavDropdown,
  NavItemLink,
  SheetToggle,
  type NavColumn,
  type NavItem,
} from "@mosje/design-system";

/**
 * **Navbar parts** — the pieces the Figma Navbar page names, each importable on
 * its own.
 *
 * Until v0.31.0 all of this was inline markup inside `SiteHeader`. That was fine
 * until a surface wanted one piece without the masthead — a portal landing that
 * needs the organisation mega-menu, a sheet that needs the dropdown rows — and
 * had nothing to import, so it re-implemented it and drifted. Every part below
 * maps 1:1 to a Figma component.
 *
 * **`MenuToggle` vs `SheetToggle` is a real distinction, not two skins.**
 * `MenuToggle` drives a *persistent sidebar*: the sidebar is on screen either
 * way, so the control shows which way it will go — `menu_open` when expanded,
 * `menu` when collapsed — and takes `expanded`. `SheetToggle` opens an *overlay*
 * that is dismissed by its own close button, so it has one glyph and no state to
 * mirror. Putting a sidebar-shaped property on the overlay trigger is the mistake
 * this split exists to prevent.
 *
 * Lifecycle: **Stable**.
 *
 * @covers MenuToggle, SheetToggle, NavItemLink, NavDropdown, DropdownItem, MegaMenu, MegaMenuItem
 *
 * Wiring props, deliberately not given stories of their own because they change
 * nothing you can see: `controlsId` on `MenuToggle` and `SheetToggle` is the id
 * of the panel each button controls, and it is what makes `aria-controls` and
 * `aria-expanded` point somewhere real — omit it and the toggle announces a
 * relationship that does not exist. `id` on `NavDropdown` and `MegaMenu` is the
 * other end of that pair. `onSelect` on `NavDropdown`, `DropdownItem`, `MegaMenu`
 * and `MegaMenuItem` fires with the chosen item so the caller can close the menu
 * and route; without it the menu opens and never resolves.
 */
const meta = {
  title: "Components/Navigation/Navbar parts",
  component: MenuToggle,
  /* Every story below supplies its own markup via `render`, but the meta's
     component has a REQUIRED `onToggle`, so without a default here each story
     is type-checked as missing it. Defaults on the meta, not `args: {}` on
     eight stories.

     This line was once written TWICE — a duplicate object key, which is a
     TypeScript error (TS1117) rather than a harmless repeat. Two branches then
     fixed it independently by deleting different copies, and the merge took
     both deletions and left none, which typechecks as the opposite failure:
     every render-only story missing a required `args`. One line, once. */
  args: { expanded: false, onToggle: () => {} },
  parameters: { layout: "padded" },
} satisfies Meta<typeof MenuToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const LINKS = [
  { label: "About Us", href: "#" },
  { label: "Who’s Who", href: "#", active: true },
  { label: "Directory", href: "#" },
];

const COLUMNS: NavColumn[] = [
  {
    heading: "Commissions",
    items: [
      { abbr: "NCSC", name: "National Commission for Scheduled Castes", href: "#" },
      { abbr: "NCBC", name: "National Commission for Backward Classes", href: "#" },
    ],
  },
  {
    heading: "Corporations",
    items: [
      { abbr: "NSFDC", name: "National Scheduled Castes Finance and Development Corporation", href: "#" },
    ],
  },
  { heading: "Reference", links: [{ label: "Acts & Rules", href: "#" }, { label: "Circulars", href: "#" }] },
];

/** The two triggers, side by side — the glyph difference is the whole point. */
export const Triggers: Story = {
  render: function Triggers() {
    const [expanded, setExpanded] = React.useState(true);
    const [sheetOpen, setSheetOpen] = React.useState(false);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <div style={{ display: "grid", gap: 8, justifyItems: "center" }}>
          <MenuToggle expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
          <code style={{ fontSize: 12 }}>{expanded ? "menu_open" : "menu"}</code>
        </div>
        <div style={{ display: "grid", gap: 8, justifyItems: "center" }}>
          <SheetToggle open={sheetOpen} onOpen={() => setSheetOpen((v) => !v)} />
          <code style={{ fontSize: 12 }}>menu (always)</code>
        </div>
      </div>
    );
  },
};

/** A simple single-column menu and one of its rows. */
export const Dropdown: Story = {
  render: () => (
    <div style={{ position: "relative", height: 240 }}>
      <NavDropdown label="Department" items={LINKS} />
      <div style={{ marginTop: 200, maxWidth: 280 }}>
        <DropdownItem item={{ label: "A single DropdownItem", href: "#" }} />
      </div>
    </div>
  ),
};

/** The organisation grid, and one rich row on its own. */
export const Mega: Story = {
  render: () => (
    <div style={{ position: "relative", height: 420 }}>
      <MegaMenu label="Associated Organisations" columns={COLUMNS} />
      <div style={{ marginTop: 360, maxWidth: 420 }}>
        <MegaMenuItem item={{ abbr: "NISD", name: "National Institute of Social Defence", href: "#" }} />
      </div>
    </div>
  ),
};

/** A top-level entry that owns its menu. Click the label to open it. */
export const Item: Story = {
  render: function Item() {
    const [open, setOpen] = React.useState<string | null>(null);
    const items: NavItem[] = [
      { label: "Home", href: "#", active: true },
      { label: "Department", href: "#", children: LINKS },
      { label: "Associated Organisations", href: "#", columns: COLUMNS },
      { label: "Storybook", href: "#", external: true },
    ];
    return (
      <nav className="ds-hdr-nav" aria-label="Primary" style={{ display: "block" }}>
        <ul className="ds-hdr-nav__list">
          {items.map((item) => (
            <NavItemLink
              key={item.label}
              item={item}
              open={open === item.label}
              onOpenChange={(next) => setOpen(next ? item.label : null)}
            />
          ))}
        </ul>
      </nav>
    );
  },
};

/**
 * **`overview` is the parent entry's own page, and without it that page is
 * unreachable.** A top-level nav entry that opens a menu stops being a link:
 * clicking "Department" opens the list instead of going to `/department`. If the
 * department's own landing page is not in the list, the menu has quietly hidden
 * the page it is named after.
 *
 * It renders as a closing row, after the children, on both shapes — a
 * single-column `NavDropdown` and the `MegaMenu` grid. Last rather than first
 * because it is the fallback a reader reaches for when nothing more specific in
 * the list matched, not the thing they were most likely looking for.
 *
 * Give it a label that says it is the whole thing — "Department overview", not
 * "Department", which would sit in its own menu reading as a duplicate.
 */
export const WithOverviewRow: Story = {
  render: () => (
    <div style={{ position: "relative", height: 460 }}>
      <NavDropdown
        label="Department"
        items={LINKS}
        overview={{ label: "Department overview", href: "#department" }}
      />
      <div style={{ marginTop: 260 }}>
        <MegaMenu
          label="Associated Organisations"
          columns={COLUMNS}
          overview={{ label: "All organisations", href: "#organisations" }}
        />
      </div>
    </div>
  ),
};
