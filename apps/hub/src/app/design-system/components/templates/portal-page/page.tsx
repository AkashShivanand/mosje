import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, MatrixTable, type A11yItem } from "@/components/design-system/docs-kit";
import { WorklistSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Portal Page — Design System",
  description:
    "The only chrome a signed-in portal screen needs: masthead, rail, content column, footer — resolved from the portal and the viewer's role.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Composes AppShell, which renders exactly one `<main>` and puts the rail in a plain wrapper — SidebarNav renders its own `<aside>`, and nesting a second duplicates the landmark.",
    status: "verified",
    evidence: "Inherited from AppShell; PortalPage adds no landmark of its own.",
  },
  {
    criterion: "3.2.3 Consistent Navigation",
    level: "AA",
    description:
      "Every signed-in page in a portal renders the same chrome in the same order, because there is one chrome component rather than sixteen.",
    status: "verified",
    evidence: "The masthead, rail and footer are slots of a single component; a portal cannot reorder them without forking it.",
  },
  {
    criterion: "2.1.2 No Keyboard Trap",
    level: "A",
    description:
      "The mobile drawer is a SideSheet: focus is trapped while open, Escape closes it, and focus returns to the control that opened it.",
    status: "verified",
    evidence: "Inherited from AppShell's SideSheet drawer.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description:
      "The drawer closes on a route change, so a reader who taps a destination does not land on the new page behind the navigation they just used.",
    status: "verified",
    evidence: "An effect on `pathname` sets drawerOpen to false.",
  },
];

export default function PortalPagePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Portal Page"
      status="Beta"
      summary="Tier A of the screen-template system: the masthead, the rail, the content column and the footer, resolved from the portal slug and the viewer's role."
      figma={{
        absent:
          "Chrome is a page-composition rule rather than a published master. Its parts — Navbar and Sidebar — are published separately in the SAMAVESH library.",
      }}
      specimen={<WorklistSpecimen />}
      propsFrom="PortalPageProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Every signed-in portal page, whatever screen template sits inside it.",
          "A public portal surface with no rail: omit `nav` and the body runs full width.",
          "While the session resolves: keep it mounted and pass `pending`.",
        ],
        avoid: [
          "A login screen — use Portal Login Template, which has no rail and no session.",
          "A public website page — use Site Layout, whose body is a stack of Bands.",
          "Holding authentication state: keep the guard outside and pass `pending` while it resolves.",
        ],
      }}
      related={[
        { label: "App Shell", href: "/design-system/components/layout/app-shell", reason: "what this composes" },
        { label: "Sidebar Nav", href: "/design-system/components/section-templates/sidebar", reason: "the rail it builds" },
        { label: "Worklist Screen", href: "/design-system/components/templates/worklist-screen", reason: "one of the screens that goes inside" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-sixteen">
            <h2 id="cdp-sixteen" className="cdp__h2">It Replaces Sixteen Shells</h2>
            <p>
              The estate carried sixteen hand-rolled portal shells across eight portals —{" "}
              <code>admin-shell</code> four times, <code>citizen-shell</code> twice, plus{" "}
              <code>public-</code>, <code>user-</code>, <code>ngo-</code>, <code>review-</code>,{" "}
              <code>console-</code> and <code>tc-shell</code>. <strong>None of them imported
              AppShell</strong>, although AppShell had shipped and was documented.
            </p>
            <MatrixTable
              caption="What this adds over AppShell — the four things each shell wired by hand"
              columns={["Concern", "What it does"]}
              rows={[
                ["data-portal", "The palette re-bind every portal needs and several forgot"],
                ["The rail's width", "One variable, two values — 300 expanded, 88 collapsed"],
                ["Role-filtered nav", "A citizen is not shown an officer's destinations"],
                ["The mobile drawer", "Wired once rather than eight times, and closed on route change"],
              ]}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-widths">
            <h2 id="cdp-widths" className="cdp__h2">Two Rail Widths, and Only Two</h2>
            <p>
              The handoff draws this one page type with rails at 300, 88, 268, 260 and 280, and
              content measures at ten different values. Only <strong>300 expanded</strong> and{" "}
              <strong>88 collapsed</strong> are decisions; the rest is drift, all of it inside
              SHRESHTA.
            </p>
            <Callout type="warning" title="The content column is FILL, never a token">
              1140 at a 300 rail and 1352 at an 88 rail are what remains, not numbers to write
              down. Nothing here computes a width, and nothing subtracts a chrome height from the
              viewport.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-roles">
            <h2 id="cdp-roles" className="cdp__h2">Five Roles, and Hiding Is Not Authorisation</h2>
            <p>
              <code>PortalRole</code> is <code>public</code>, <code>citizen</code>,{" "}
              <code>organisation</code>, <code>officer</code>, <code>admin</code> — the login
              template&rsquo;s three audiences, plus the distinction the built portals actually
              draw inside a session between an officer who reads and one who decides.
            </p>
            <Callout type="warning" title="Filtering the rail protects nothing">
              Hiding a link does not protect the route behind it; the server does that. It exists
              so a citizen is not shown a rail full of destinations that will refuse them.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<PortalPage
  portal="e-anudaan"
  role={session.role}
  pathname={usePathname()}
  header={<SiteHeader variant="portal" … />}
  identity={{ name: "E-Anudaan", mark: <OrgLogo … />, href: "/portals/e-anudaan" }}
  nav={NAV_GROUPS}       // PortalNavGroup[] — items may carry roles
  footer={<Footer />}
  pending={!session}
>
  <WorklistScreen … />
</PortalPage>`}</CodeBlock>
          <p>
            A nav item with no <code>roles</code> is shown to everyone. A group whose items are
            all filtered out is dropped entirely — a group label standing over nothing reads as a
            section that failed to load.
          </p>
          <CodeBlock>{`const NAV_GROUPS: PortalNavGroup[] = [{
  items: [
    { label: "Dashboard", href: "/portals/e-anudaan", icon: "dashboard" },
    { label: "Master Settings", href: "…/settings", icon: "settings", roles: ["admin"] },
  ],
}];`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-skip">
          <h2 id="cdp-skip" className="cdp__h2">The Skip Link Must Agree with mainId</h2>
          <p>
            <code>mainId</code> defaults to <code>main</code> here, while{" "}
            <code>SiteHeader</code>&rsquo;s <code>skipTo</code> defaults to{" "}
            <code>#main-content</code>. A portal that leaves both at their defaults has a skip
            link pointing at nothing.
          </p>
          <Callout type="warning" title="Check this on every new portal">
            A skip link that resolves to no element is invisible in review and fails only for the
            keyboard user it exists to serve.
          </Callout>
        </section>
      }
    />
  );
}
