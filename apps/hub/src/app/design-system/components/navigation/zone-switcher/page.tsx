import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  PropsTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { ZoneSwitcherSpecimen } from "./zone-switcher-specimen";

export const metadata: Metadata = {
  title: "Zone Switcher — Design System",
  description:
    "The estate's cross-zone switcher: one floating console, mounted once, carrying app switching, brand-palette preview and demo sign-in credentials.",
};

const TAB_SHAPE: PropDef[] = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Stable id. It must not collide with `signin`, `apps` or `colour`.",
  },
  { name: "label", type: "string", required: true, description: "The tab's visible text in the panel's strip." },
  { name: "content", type: "React.ReactNode", required: true, description: "What the tab shows." },
];

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The rail's two doors carry `aria-current`, not `aria-selected`: they are buttons that open a dialog, not tabs in a tablist. The panel itself is a dialog with its own labelled tab strip.",
    status: "verified",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "The panel closes on its own header button, on Escape, and on an outside click. Three ways to dismiss, and the lead is deliberately not a fourth — a close button sitting in a list of destinations is a category error.",
    status: "verified",
  },
  {
    criterion: "2.1.2 No Keyboard Trap",
    level: "A",
    description:
      "Focus is trapped inside the open panel and returns to the trigger on close. Hover and focus are two INDEPENDENT holds on the rail, each with its own latch — a single flag collapsed the rail out from under a keyboard user when the pointer moved away.",
    status: "verified",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    description:
      "The flask's liquid moves permanently and the wobble answers a hover of the whole rail. Confirm the reduced-motion behaviour against the current build before claiming it.",
    status: "untested",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    description:
      "The rail is chrome over arbitrary page content, so its boundary has to clear 3:1 wherever it lands. Not measured against every surface in the estate.",
    status: "untested",
  },
  {
    criterion: "2.4.11 Focus Not Obscured (Minimum)",
    level: "AA",
    description:
      "The dock sits on the right wall and must not cover a focused control. Any fixed widget there carries `data-sa-wall-occupant` so `useWallRailOffset` places the dock in the largest free band instead of on top of it.",
    status: "verified",
    evidence:
      "Added after the dock landed on the website's Important Links rail and won the z-index contest.",
  },
];

export default function ZoneSwitcherPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Zone Switcher"
      status="Stable"
      summary="The estate's cross-zone switcher is DemoDock: one floating console, mounted once by the hub's root layout, carrying app switching, brand-palette preview and — on a login route — demo credentials. It is demonstration tooling, and on this estate the demonstration is the product."
      figma={{
        absent:
          "Demonstration tooling has no published master in the SAMAVESH library, and deliberately so — it is not part of what a portal ships to a citizen.",
      }}
      specimen={<ZoneSwitcherSpecimen />}
      propsFrom="DemoDockProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Nowhere new. It is mounted once, in the hub's root layout, and every zone inherits that one instance.",
          "Adding a route-specific panel through `extraTabs`, where a surface has something a reviewer opens the dock to see.",
        ],
        avoid: [
          "Mounting a second one inside a portal — that reintroduces the duplicate-FAB problem this component was built to end.",
          "Navigation a citizen is meant to use — the portals directory at /portals is the public wayfinding surface.",
          "Either bottom corner or the top of the viewport: those are taken, and a new floating element does not invent a third position.",
        ],
      }}
      related={[
        {
          label: "App Switcher Panel",
          href: "/design-system/components/navigation/app-switcher-panel",
          reason: "the searchable destination list the Apps tab renders",
        },
        {
          label: "Portal Card",
          href: "/design-system/components/navigation/portal-card",
          reason: "the citizen-facing way to present the same destinations",
        },
        {
          label: "Accessibility Bar",
          href: "/design-system/components/utilities/accessibility-bar",
          reason: "the statutory utility strip this page used to render by mistake",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-one-mount">
            <h2 id="cdp-one-mount" className="cdp__h2">
              Mounted Once, by the Hub
            </h2>
            <p>
              It replaced two floating controls: an <code>AppSwitcher</code> that carried a
              hand-rolled copy of the colour-mode swatches and was mounted independently in half a
              dozen root layouts, and a second control for demo credentials gated on the development
              environment — so it was invisible on the exact deployed review site where stakeholders
              needed it.
            </p>
            <p>
              A new portal route needs no wiring at all. It inherits the single mount, and what it
              does need is unrelated: an entry in the estate registry so the Apps tab can find it,
              and — if it has a login page — an entry in the demo-accounts registry so the Sign in
              tab has something to show.
            </p>
            <Callout type="info" title="Visibility is an admin setting, not a deploy flag">
              The master switch is on the registry row at <code>/admin/portals</code> and defaults
              ON: a prototype whose purpose is being demonstrated must not need an administrator
              visit before it can be demonstrated. A build-time environment flag survives above it
              as a hard off, and the failure direction is deliberate — an unreadable store degrades
              to visible, not hidden.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              The Rail and the Panel
            </h2>
            <MatrixTable
              caption="Three doors on the rail, and the tabs they open"
              columns={["Rail door", "Opens the panel on", "Present"]}
              rows={[
                ["Flask (the lead)", "The panel's first tab", "Always"],
                ["Apps", "The destination list", "Always"],
                ["Colour", "The brand-palette picker", "Always"],
                ["— no door —", "Sign in", "Only on a login route"],
              ]}
            />
            <p>
              Sign in gets no door on purpose. It exists only on login routes, so a fourth door
              would appear and vanish by route — the same &ldquo;relocates between routes&rdquo;
              defect the bottom-left position was abandoned for. It already leads inside the panel
              on those routes, which is enough.
            </p>
            <p>
              The two doors that do exist indicate the active tab with <code>aria-current</code>,
              are ordered to match the tab strip, and stay unfolded for as long as the panel is
              open. An indicator that vanishes when the pointer enters the panel it describes is
              worse than none, and an order that disagrees with the tabs makes the second door light
              when the third tab is active.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-placement">
            <h2 id="cdp-placement" className="cdp__h2">
              Why the Right Wall
            </h2>
            <p>
              Both bottom corners were tried and each cost a defect: the bottom-left needed a
              per-route opt-in a future portal could forget, and the bottom-right stacked a
              hardcoded offset above a widget that is hidden on every page carrying an accessibility
              bar — so the control floated above an empty corner across most of the estate.
            </p>
            <Callout type="warning" title="The right wall is not empty either">
              Moving here on the reasoning that it was landed the dock on top of the website&apos;s
              Important Links rail, and the dock&apos;s z-index won — so demonstration scaffolding
              covered a citizen-facing navigation control. The walls are inverted between zones, so
              no fixed choice works everywhere. Any fixed widget on the right wall must carry{" "}
              <code>data-sa-wall-occupant</code>; that one attribute is the entire contract, and the
              rail then places the dock in the largest free band.
            </Callout>
            <p>
              The panel is a <strong>fixed height</strong>. Sizing to content meant a tab switch
              resized it and read as a lurch, and the transition meant to smooth that was dead code:
              a transition cannot interpolate to or from <code>auto</code>.
            </p>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-tab-shape">
            <h2 id="cdp-tab-shape" className="cdp__h2">
              DemoDockTab
            </h2>
            <PropsTable props={TAB_SHAPE} />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              How the Hub Wires It
            </h2>
            <p>
              This is the only mount in the estate, and there is nothing here for a portal to copy.
            </p>
            <CodeBlock>{`// apps/hub/src/components/conditional-demo-dock.tsx
"use client";
import { usePathname } from "next/navigation";
import { DemoDock } from "@mosje/design-system";

export function ConditionalDemoDock() {
  const pathname = usePathname();
  if (process.env.NEXT_PUBLIC_DEMO_TOOLS === "false") return null;
  if (pathname === "/" || pathname === "/gate" || pathname.startsWith("/admin")) return null;
  return <DemoDock pathname={pathname} />;
}`}</CodeBlock>
            <p>
              A route with something of its own to show adds a tab rather than a dock. Extra tabs
              lead the strip, ahead of Apps and Colour, because they are the reason a reviewer opened
              the dock on that route.
            </p>
            <CodeBlock>{`<DemoDock
  pathname={pathname}
  extraTabs={[{ id: "data", label: "Data", content: <DataModeSwitcher /> }]}
/>`}</CodeBlock>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-holds">
          <h2 id="cdp-holds" className="cdp__h2">
            Two Independent Holds, and How to Test Them
          </h2>
          <p>
            Hover and focus each hold the rail open, each with its own latch, and the rail stays
            unfolded while either holds. A single shared flag breaks both ways round, and both were
            shipped: focus a door then move the mouse away, and the pointer-leave handler collapsed
            the rail out from under a keyboard user; blur while still hovering, and it collapsed with
            no fresh pointer-enter coming to reopen it.
          </p>
          <Callout type="warning" title="Verify focus behaviour with trusted events only">
            A programmatic <code>element.focus()</code> moves <code>document.activeElement</code>{" "}
            but fires <strong>no focus events at all</strong> in a tab without operating-system
            focus — so an automated check reports the keyboard path green while it is broken. The
            defect above passed every synthetic test and failed the first real click-then-move.
            Drive the real pointer and the real Tab key, and assert{" "}
            <code>document.hasFocus()</code> before believing a focus result.
          </Callout>
          <p>
            The lead&apos;s click rule is about <strong>state, not device</strong>: if the rail is
            not expanded, expand it; otherwise open the panel. A pointer user&apos;s hover has
            already expanded it, so their click falls straight through — one click, as before. A
            touch user&apos;s first tap expands and the second opens. Never branch on pointer type
            for this; a touchscreen laptop is both devices at once.
          </p>
        </section>
      }
    />
  );
}
