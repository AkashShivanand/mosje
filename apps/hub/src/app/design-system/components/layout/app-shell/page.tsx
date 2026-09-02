import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { AppShellSpecimen } from "./app-shell-specimen";

export const metadata: Metadata = {
  title: "App Shell — Design System",
  description:
    "The portal page skeleton: chrome, sidebar, content. Chrome rows are auto and the body row is 1fr, so nothing subtracts a chrome height from the viewport.",
};


const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The shell renders exactly one `<main>`. The sidebar sits in a plain wrapper on purpose: `SidebarNav` renders its own `<aside>` landmark, and nesting a second one duplicates it for screen readers.",
  },
  {
    criterion: "2.4.1 Bypass Blocks",
    level: "A",
    description:
      "`<main>` carries `id` (default `main`) and `tabIndex={-1}`, so a skip link can move real focus into it rather than only scrolling the page. The skip link itself is supplied by `SiteHeader`.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "`pending` renders the skeleton `aria-hidden` and announces a visually hidden “Loading” instead, so a screen-reader user is told the wait is deliberate rather than hearing a stack of empty boxes.",
  },
  {
    criterion: "2.1.2 No Keyboard Trap",
    level: "A",
    description:
      "The mobile drawer is a `SideSheet`, which traps focus while it is open, closes on Escape, and returns focus to the control that opened it.",
  },
  {
    criterion: "2.4.11 Focus Not Obscured (Minimum)",
    level: "AA",
    description:
      "The portal masthead is sticky, so a focused control must never end up underneath it. Chrome rows are `auto` and the body row is `1fr`, and the header publishes its pinned height as `--sa-header-pinned` for anything that needs to offset against it.",
    status: "partial",
    evidence: "Re-check whenever the masthead's height changes.",
  },
  {
    criterion: "3.2.3 Consistent Navigation",
    level: "AA",
    description:
      "Every signed-in page in a portal uses the same shell, so the masthead, the navigation and the main region are in the same relative order throughout.",
  },
];

export default function AppShellPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="App Shell"
      status="Stable"
      summary="The portal page skeleton: chrome, sidebar, content. It is presentational only — no store, no router, no redirect — so an authentication guard stays a thin wrapper around it."
      figma={{
        absent:
          "The shell is a page-composition rule rather than a published master; its parts — the Navbar and the Sidebar — are published separately in the SAMAVESH library.",
      }}
      specimen={<AppShellSpecimen />}
      propsFrom="AppShellProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Every signed-in portal page — a dashboard, a list, a record, a form.",
          "A portal page that has no sidebar: omit `sidebar` and the body runs full width.",
          "The loading frame while an app hydrates, through `pending`, rather than returning null.",
        ],
        avoid: [
          "A portal login screen — use Portal Login Shell, which has no sidebar and no session.",
          "A public website page — use Site Layout, whose body is a stack of Bands.",
          "Holding authentication state: keep the guard outside the shell and pass `pending` while it resolves.",
        ],
      }}
      related={[
        {
          label: "Site Layout",
          href: "/design-system/components/layout/site-layout",
          reason: "the public website equivalent",
        },
        {
          label: "Sidebar Nav",
          href: "/design-system/components/section-templates/sidebar",
          reason: "what goes in the sidebar slot",
        },
        {
          label: "Portal Login Shell",
          href: "/design-system/components/auth/portal-login-shell",
          reason: "the signed-out screen that precedes it",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy
            </h2>
            <MatrixTable
              caption="The shell's rows, top to bottom"
              columns={["Row", "Height", "Holds"]}
              rows={[
                ["Header", "auto", "The portal masthead, sticky"],
                ["Body", "1fr", "The sidebar column and the single `<main>`"],
                ["Footer", "auto", "The slim portal footer, when one is passed"],
              ]}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-calc">
            <h2 id="cdp-calc" className="cdp__h2">
              Never Subtract a Chrome Height from the Viewport
            </h2>
            <p>
              Chrome rows are <code>auto</code> and the body row is <code>1fr</code>, so nothing
              in the shell needs to know how tall the header is. That matters because the brand
              row hugs its content: a two-line lockup, a BETA badge or an account block all move
              it. Any <code>calc(100vh - &lt;constant&gt;)</code> is therefore wrong by
              construction rather than merely off by a few pixels.
            </p>
            <Callout type="warning" title="If you genuinely need the pinned height, read it">
              The masthead measures itself and publishes{" "}
              <code>--sa-header-pinned</code>. Read that variable; do not hardcode a number that
              was correct on one portal on one day.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-drawer">
            <h2 id="cdp-drawer" className="cdp__h2">
              The Sidebar Becomes a Drawer, Not a Narrow Column
            </h2>
            <p>
              Below the tablet anchor the same navigation is offered as a drawer. Narrowing the
              column instead would leave the labels unreadable, and an icon-only rail on a phone
              gives a citizen nothing to recognise. Pass <code>sidebarOpen</code> and{" "}
              <code>onSidebarOpenChange</code>, and wire the masthead&apos;s toggle to the same
              state so one control drives one drawer.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`"use client";
import { AppShell, Footer, SidebarNav, SiteHeader } from "@mosje/design-system";

const [navOpen, setNavOpen] = React.useState(false);
const [collapsed, setCollapsed] = React.useState(false);

<AppShell
  header={
    <SiteHeader
      variant="portal"
      homeHref="/portals/pm-ajay"
      emblemSrc={emblem}
      brandLines={BRAND}
      onToggleNav={() => setNavOpen((open) => !open)}
      navExpanded={navOpen}
      navControlsId="portal-sidebar"
      account={{ name: "Asha Ramesh", role: "State Nodal Officer" }}
    />
  }
  sidebar={
    <SidebarNav
      id="portal-sidebar"
      groups={NAV_GROUPS}
      pathname={usePathname()}
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
    />
  }
  sidebarOpen={navOpen}
  onSidebarOpenChange={setNavOpen}
  footer={<Footer />}
>
  <PageHeader title="Applications" />
  <ApplicationsTable />
</AppShell>`}</CodeBlock>
          <p>
            While the session is resolving, keep the shell mounted and pass{" "}
            <code>pending</code>. Returning <code>null</code> from the guard flashes a blank page
            and then reflows the whole layout when the data lands.
          </p>
          <CodeBlock>{`<AppShell header={header} sidebar={sidebar} pending={!session}>
  {children}
</AppShell>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-landmarks">
          <h2 id="cdp-landmarks" className="cdp__h2">
            Landmarks and the Skip Link
          </h2>
          <p>
            The shell owns the page&apos;s only <code>&lt;main&gt;</code>. Do not render a second
            one inside <code>children</code>, and do not wrap the sidebar in an{" "}
            <code>&lt;aside&gt;</code> of your own — <code>SidebarNav</code> renders that
            landmark itself, and a duplicate leaves a screen-reader user with two complementary
            regions holding one navigation.
          </p>
          <p>
            <code>mainId</code> and the masthead&apos;s <code>skipTo</code> must agree. The
            default is <code>main</code> here and <code>#main-content</code> there, so a portal
            that leaves both at their defaults has a skip link pointing at nothing — pass{" "}
            <code>skipTo=&quot;#main&quot;</code> to the header, or set{" "}
            <code>mainId=&quot;main-content&quot;</code> here.
          </p>
          <Callout type="warning" title="Check this on every new portal">
            A skip link that resolves to no element is invisible in review and only fails for the
            keyboard user it exists to serve.
          </Callout>
        </section>
      }
    />
  );
}
