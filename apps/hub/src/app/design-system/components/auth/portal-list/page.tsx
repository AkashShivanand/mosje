import type { Metadata } from "next";
import * as React from "react";

import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { PortalListSpecimen } from "./portal-list-specimen";

export const metadata: Metadata = {
  title: "Portal List — Design System",
  description:
    "The scrollable list of portals inside the change-portal picker: category filters over Portal Cards.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    description:
      "The portals are a real `<ul>` of `<li>`, so a screen reader announces the list and its length rather than reading a run of links.",
    evidence: "`portal-list.tsx` renders `ul.ds-portal-list__grid` with one `li` per entry; verified in the browser on /portals/e-anudaan/login.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    description:
      "The reader's current portal carries `aria-current=\"true\"` as well as the rule and the check, so the selection is not colour-only.",
    evidence: "Measured with the picker open on /portals/e-anudaan/login: the e-Anudaan card reported aria-current=\"true\".",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    description:
      "Every card is a real `<a href>`, so Enter follows it and middle-click and \"copy link address\" both work. The list is not intercepted by a click handler.",
    evidence: "Measured with the picker open: all 8 cards were `A` elements carrying an href.",
  },
  {
    criterion: "3.2.4 Consistent Identification",
    level: "AA",
    status: "verified",
    description:
      "Labels come from `PORTAL_LABELS`, so a portal is identified the same way here, in the SAMAVESH banner and in the /portals directory — the criterion is about the delivered product, and all three read one map. (The Figma master's instances have drifted from that map; that is a design-file reconciliation, recorded on the master, not a failure of the shipped page.)",
    evidence:
      "One source: `portalLabel()` over `PORTAL_LABELS` is the only label expression in all three surfaces — no component writes a portal name. Read back in the browser with the picker open on /portals/e-anudaan/login: the cards matched the banner's wording exactly.",
  },
];

export default function PortalListPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Portal List"
      status="New"
      summary="The scrollable list of portals inside the change-portal picker — category filters over Portal Cards. It is what drops into the Side Sheet's content slot; there is no separate picker component, because the picker is those two together."
      figma={{ node: "portalList" }}
      specimen={<PortalListSpecimen />}
      propsFrom="PortalListProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The change-portal picker on a login page, inside a Side Sheet.",
          "Any surface that has to offer the estate's portals as a list rather than a grid.",
        ],
        avoid: [
          "The /portals directory — that is a grid of detailed Portal Cards, where the reader is choosing rather than switching.",
          "A hand-written list of portals. `DEFAULT_APPS` owns whether a portal exists, and a hand-kept copy of it once shipped a 404.",
        ],
      }}
      related={[
        { label: "Portal Card", href: "/design-system/components/navigation/portal-card", reason: "every row is one, in its Compact variant" },
        { label: "Side Sheet", href: "/design-system/components/feedback/side-sheet", reason: "the panel this drops into" },
        { label: "Portal Login Template", href: "/design-system/components/auth/portal-login-template", reason: "wires the picker to the SIGNING INTO strip's Change control" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-no-picker">
            <h2 id="cdp-no-picker" className="cdp__h2">There Is No Picker Component</h2>
            <p>
              The picker is <code>SideSheet</code> + <code>PortalList</code>. That is the Figma
              master&apos;s own decision — <code>PortalPicker</code> needed no component of its own —
              and a third name for the composition would add a word without adding a decision.
            </p>
            <CodeBlock>{`<SideSheet open={open} onClose={close} title="Choose a portal to login" side={isPhone ? "bottom" : "right"}>
  <PortalList activePath="/portals/e-anudaan" />
</SideSheet>`}</CodeBlock>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-labels">
            <h2 id="cdp-labels" className="cdp__h2">Where the Names Come From</h2>
            <Callout type="warning" title="Never Write a Portal's Name Here">
              Labels come from <code>PORTAL_LABELS</code>, which exists because two surfaces needed
              the same answer and disagreed: the banner showed &quot;PM-AJAY / Pradhan Mantri
              Anusuchit Jaati Abhyuday Yojana&quot; while <code>/portals</code> showed &quot;PM /
              PM-AJAY&quot;, leaking an internal admin label to citizens. A third copy in this
              component would re-open exactly that.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">The Filter Row Disappears When It Has Nothing To Do</h2>
            <p>
              With every live portal in one category the row would read &quot;All (8)&quot; beside
              &quot;Scheme Portals (8)&quot; — two controls that do the same thing. It renders only
              when there are at least two real categories, which is the same rule that hides a
              one-tab tablist.
            </p>
            <p>
              <strong>Filtered-to-nothing is worded differently from empty.</strong> &quot;No portal
              is listed under Corporations&quot; names the filter the reader set and offers the way
              back; &quot;No portals are available to sign in to&quot; is the register having
              nothing. Rendering one for both would lie about one of them.
            </p>
          </section>
        </>
      }
    />
  );
}
