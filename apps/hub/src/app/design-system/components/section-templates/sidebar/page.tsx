import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  PropsTable,
  TokenTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { SidebarSpecimen } from "./sidebar-specimen";

export const metadata: Metadata = {
  title: "Sidebar Nav — Design System",
  description:
    "The portal app-shell left navigation: a two-level hierarchy with expandable groups and a curved connector, in an expanded or icon-only collapsed mode.",
};

/*
 * `SidebarNavGroup`, `SidebarNavItem` and `SidebarNavChild` are data shapes
 * rather than props interfaces, so the extractor cannot see them.
 *
 * DRIFT CORRECTED 2026-09-02: the previous page documented `icon` as
 * `React.ComponentType<{ className?: string }>` and told the reader that Lucide
 * icons satisfy it. The type is a `string` — a Material Symbols Rounded glyph
 * NAME — and has been since the estate settled on one icon system. A caller
 * following the old table passed a component and got a type error with no
 * explanation. `id` was also missing from the SidebarNav table, and it is what
 * makes the masthead toggle's `aria-controls` resolve.
 */
const SHAPES: PropDef[] = [
  {
    name: "SidebarNavGroup · label",
    type: "string",
    description:
      "Optional section heading above the group's items, hidden in collapsed mode. A group with no label renders without a separator heading — which is what a flat navigation is.",
  },
  {
    name: "SidebarNavGroup · items",
    type: "SidebarNavItem[]",
    required: true,
    description: "Top-level entries in this group.",
  },
  {
    name: "SidebarNavItem · label",
    type: "string",
    required: true,
    description: "Display label. It is also the `aria-label` and the tooltip in collapsed mode.",
  },
  {
    name: "SidebarNavItem · href",
    type: "string",
    required: true,
    description:
      "Destination, rendered as an anchor. An item that carries `children` becomes a toggle button instead, and clicking it expands rather than navigates.",
  },
  {
    name: "SidebarNavItem · icon",
    type: "string",
    required: true,
    description:
      "A Material Symbols Rounded NAME — “dashboard”, “group”, “location_on”. A name string, not a component, so navigation configs stay plain serialisable data and the estate has exactly one icon system.",
  },
  {
    name: "SidebarNavItem · badge",
    type: "number | string",
    description: "Count or label beside the item — an unread total. Hidden in collapsed mode.",
  },
  {
    name: "SidebarNavItem · children",
    type: "SidebarNavChild[]",
    description:
      "When set, the item becomes a collapsible group with a chevron. It acts as a toggle button rather than a link, and auto-expands when any child is the current route.",
  },
  {
    name: "SidebarNavChild · label",
    type: "string",
    required: true,
    description: "Display label for the child entry.",
  },
  {
    name: "SidebarNavChild · href",
    type: "string",
    required: true,
    description: "Destination, rendered as an anchor.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "An `<aside aria-label=\"Portal navigation\">` holding a `<nav aria-label=\"Main navigation\">`, with groups as real lists. Do not wrap it in a second `<aside>` — AppShell puts it in a plain div for exactly that reason.",
    status: "verified",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "Icon-only collapsed entries carry `aria-label` and `title` equal to the item label, so the glyph is never the only name.",
    status: "verified",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Every interactive element is reachable by Tab. An expandable group is a `<button>` with `aria-expanded` and `aria-controls` naming the sub-list it opens.",
    status: "verified",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "`aria-current=\"page\"` is set on the active leaf entry, and on a parent that is itself the current route. A badge carries its own label — “4 notifications” — so the number is not announced bare.",
    status: "verified",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description: "Focus follows the DOM: masthead, then sidebar, then main. No focus traps.",
    status: "verified",
  },
  {
    criterion: "3.2.3 Consistent Navigation",
    level: "AA",
    description: "The sidebar's position and order are the same on every page of a portal.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    description:
      "The curved connector between a parent and its children is decorative, so it is exempt — but the collapse handle and the active-item fill are controls, and both are judged against 3:1.",
    status: "partial",
    evidence: "Connector confirmed decorative; the handle's contrast is not re-measured per brand mode.",
  },
  {
    criterion: "GIGW 3.0 — Skip navigation",
    level: "GIGW",
    description:
      "A portal layout must provide a skip-to-main-content link before the sidebar. SiteHeader renders it; this component does not, and cannot.",
    status: "partial",
    evidence: "Supplied by the masthead, not by this component.",
  },
];

export default function SidebarPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Sidebar Nav"
      status="Beta"
      summary="The portal app-shell left navigation. It renders a two-level hierarchy — top-level entries with optional expandable groups, their children linked by a curved connector — in either an expanded or an icon-only collapsed mode."
      figma={{
        absent:
          "Published as the Portal Sidebar in the SAMAVESH library (node 4208:740), but not yet registered in the estate's Figma node index — so this page cannot deep-link it the way the standard requires.",
      }}
      specimen={<SidebarSpecimen />}
      propsFrom="SidebarNavProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The navigation of every signed-in portal page, in App Shell's sidebar slot.",
          "A navigation that needs one level of nesting — a scheme with its own dashboard, certificate and scholarship pages.",
          "A portal whose officers work in it daily and benefit from an icon-only rail once they know the icons.",
        ],
        avoid: [
          "A public website — that navigation lives in the masthead, where a first-time visitor will look for it.",
          "Three levels of hierarchy: this component renders two, and a third level is a sign the information architecture needs flattening, not a deeper menu.",
          "Building a portal's own sidebar. All MoSJE portals use this one; a custom sidebar is a second thing to keep accessible.",
        ],
      }}
      related={[
        {
          label: "App Shell",
          href: "/design-system/components/layout/app-shell",
          reason: "the portal skeleton whose sidebar slot this fills, and its mobile drawer",
        },
        {
          label: "Navbar (Header)",
          href: "/design-system/components/section-templates/site-header",
          reason: "the masthead whose toggle drives the collapse, and which supplies the skip link",
        },
        {
          label: "Icon",
          href: "/design-system/components/utilities/icon",
          reason: "the Material Symbols set the icon name is drawn from",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-active">
            <h2 id="cdp-active" className="cdp__h2">
              Active Detection
            </h2>
            <p>
              An entry is active when <code>pathname</code> equals its <code>href</code>, or begins
              with that href followed by a slash. A parent group is highlighted when any of its
              children is active, and the group auto-expands in that case — so a reader who arrives
              at a deep route by link, not by clicking through, lands with their place in the
              hierarchy already open.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-collapsed">
            <h2 id="cdp-collapsed" className="cdp__h2">
              Collapsed Mode
            </h2>
            <MatrixTable
              caption="What each mode shows"
              columns={["Element", "Expanded", "Collapsed"]}
              rows={[
                ["Icon", "Yes", "Yes"],
                ["Label", "Yes", "No — carried as aria-label and title"],
                ["Badge", "Yes", "No"],
                ["Chevron", "Yes", "No"],
                ["Children", "Yes, when the group is open", "No"],
                ["Group label", "Yes", "No"],
              ]}
            />
            <Callout type="info" title="No children in collapsed mode">
              Child entries are always hidden. The parent icon still reflects the active state when
              a child route is current, so the reader is not left with no indication of where they
              are.
            </Callout>
            <p>
              Below the tablet anchor the sidebar is not narrowed at all — <code>AppShell</code>{" "}
              offers it as a drawer instead, because an icon-only rail on a phone gives a citizen
              nothing to recognise.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-connector">
            <h2 id="cdp-connector" className="cdp__h2">
              The Connector
            </h2>
            <p>
              Child entries within an expanded group are joined by a curved elbow drawn with CSS
              pseudo-elements, coloured from the brand ramp so it stays in step with the
              portal&apos;s colour mode. It is decorative and is not announced — the relationship it
              draws is already carried by the nesting.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-portals">
            <h2 id="cdp-portals" className="cdp__h2">
              Portal Usage
            </h2>
            <p>
              All MoSJE portals use this component. Do not build a custom sidebar in an individual
              app.
            </p>
            <MatrixTable
              caption="How each portal holds its collapse state"
              columns={["Portal", "Collapse state", "Notes"]}
              rows={[
                [
                  "SMILE Admin",
                  "App context, persisted",
                  "Role-filtered groups. Status footer. The masthead provides the toggle, so showCollapseControl is omitted",
                ],
                [
                  "SCW",
                  "Local state",
                  "Flat admin and user arrays wrapped in a single group. showCollapseControl enabled",
                ],
                [
                  "NMBA",
                  "Local state",
                  "The treatment-centre surface uses a role-switched sidebar pattern; evaluate for migration separately",
                ],
                ["PM-AJAY", "—", "A management information dashboard with no persistent sidebar; it uses a top-nav pattern"],
              ]}
            />
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-shapes">
            <h2 id="cdp-shapes" className="cdp__h2">
              SidebarNavGroup, SidebarNavItem and SidebarNavChild
            </h2>
            <PropsTable props={SHAPES} />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <p>Flat navigation is a single group with no label.</p>
            <CodeBlock>{`import { SidebarNav } from "@mosje/design-system";
import type { SidebarNavGroup } from "@mosje/design-system";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "grid_view" },
  { label: "Users",     href: "/users",     icon: "group" },
  { label: "Reports",   href: "/reports",   icon: "description" },
];

<SidebarNav
  groups={[{ items: NAV }]}
  pathname={usePathname()}
  collapsed={collapsed}
  onCollapsedChange={setCollapsed}
  showCollapseControl
/>`}</CodeBlock>
            <p>Grouped, with one level of children:</p>
            <CodeBlock>{`const NAV_GROUPS: SidebarNavGroup[] = [
  { items: [{ label: "Dashboard", href: "/dashboard", icon: "grid_view" }] },
  {
    label: "Beneficiaries",
    items: [
      {
        label: "Transgender",
        href: "/transgender",
        icon: "diversity_3",
        children: [
          { label: "Dashboard", href: "/transgender/dashboard" },
          { label: "Certificate/ID", href: "/transgender/certificate" },
          { label: "Scholarships", href: "/transgender/scholarships" },
        ],
      },
      { label: "NMBA", href: "/nmba", icon: "medical_services" },
    ],
  },
];

<SidebarNav
  id="portal-sidebar"          // the masthead toggle's aria-controls points here
  groups={NAV_GROUPS}
  pathname={usePathname()}
  collapsed={collapsed}
  onCollapsedChange={setCollapsed}
  showCollapseControl
  footer={<StatusFooter />}
/>`}</CodeBlock>
            <p>
              Where the collapse state must survive a reload, hold it outside the component and
              persist it — and drop <code>showCollapseControl</code> if the masthead already
              provides the toggle, so there is one control rather than two.
            </p>
            <CodeBlock>{`const { sidebarCollapsed, setSidebarCollapsed } = useApp();

<SidebarNav
  groups={navForRole(account.role)}
  pathname={usePathname()}
  collapsed={sidebarCollapsed}
  onCollapsedChange={setSidebarCollapsed}
  footer={<StatusFooter />}
/>`}</CodeBlock>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-tokens">
            <h2 id="cdp-tokens" className="cdp__h2">
              Tokens
            </h2>
            <p>
              Every value resolves through the <code>--sa-*</code> contract, so a portal&apos;s
              colour mode moves the active treatment with it and no value is set here.
            </p>
            <TokenTable
              tokens={[
                { token: "--sa-color-primaryScale-50", value: "Active item background", description: "Also the connector's colour, which is why the elbow follows the brand.", isColor: true },
                { token: "--sa-color-action-primary-default", value: "Active item text and icon", description: "Label and glyph never disagree.", isColor: true },
                { token: "--sa-color-text-default", value: "Default item text", description: "The resting label colour.", isColor: true },
                { token: "--sa-color-text-muted", value: "Group label", description: "The section heading above a group's items.", isColor: true },
                { token: "--sa-bg-neutral-subtler", value: "Hover background", description: "The hover fill on a resting item.", isColor: true },
                { token: "--sa-border-neutral-subtle", value: "Group separator and handle line", description: "The rule above a footer, and the collapse handle's line.", isColor: true },
                { token: "--sa-shape-16", value: "16px", description: "Main item row radius." },
                { token: "--sa-shape-8", value: "8px", description: "Child item label radius." },
                { token: "--sa-focus-ring", value: "Focus outline", description: "The same ring every control in the estate uses.", isColor: true },
                { token: "--sa-motion-exit-duration", value: "Hover and active transition", description: "The shared fast duration." },
              ]}
            />
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-landmarks">
          <h2 id="cdp-landmarks" className="cdp__h2">
            Landmarks, and the Toggle That Points at Them
          </h2>
          <p>
            The component renders its own <code>&lt;aside&gt;</code> landmark holding a labelled{" "}
            <code>&lt;nav&gt;</code>. <code>AppShell</code> therefore wraps it in a plain{" "}
            <code>&lt;div&gt;</code>: nesting a second <code>&lt;aside&gt;</code> would duplicate
            the complementary landmark and leave a screen-reader user choosing between two entries
            for one navigation.
          </p>
          <p>
            Pass <code>id</code> and give the masthead the same value as{" "}
            <code>navControlsId</code>. The toggle&apos;s <code>aria-expanded</code> then describes
            a region that actually exists — an <code>aria-controls</code> naming nothing is worse
            than none at all, because it promises a target the reader cannot reach.
          </p>
          <Callout type="warning" title="The skip link is not this component's">
            A portal layout must provide skip-to-main-content <em>before</em> the sidebar, or a
            keyboard user tabs through every navigation entry on every page. <code>SiteHeader</code>{" "}
            renders it, and its <code>skipTo</code> must match <code>AppShell</code>&apos;s{" "}
            <code>mainId</code>.
          </Callout>
        </section>
      }
    />
  );
}
