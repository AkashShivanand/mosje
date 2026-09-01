import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { TabsOverflowSpecimen } from "./tabs-overflow-specimen";

export const metadata: Metadata = {
  title: "Tabs Overflow — Design System",
  description:
    "The Tabs / More trigger and its menu. Internal to Tabs: it appears only when a horizontal row cannot show every tab, and lists all of them.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "It is a MENU BUTTON, not a tab: `role=\"button\"`, `aria-haspopup=\"menu\"`, `aria-expanded`. Giving it `role=\"tab\"` would promise a panel that does not exist and tell a screen-reader user there are more sections than there are.",
    status: "verified",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "It is rendered OUTSIDE the `role=\"tablist\"` element. A tablist's owned children are tabs, and a button among them is a lie about the structure. Being outside is also what keeps it pinned while the tabs scroll.",
    status: "verified",
  },
  {
    criterion: "4.1.2 — the current tab is marked, not omitted",
    level: "A",
    description:
      "Menu items are `role=\"menuitemradio\"` with `aria-checked` on the active one, so the menu reads as a complete picture of the set rather than a list of the ones you cannot see.",
    status: "verified",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Arrow keys move between items, skipping disabled ones; Escape closes and returns focus to the trigger. Choosing an item selects the tab, scrolls it into view and focuses it — selecting alone would leave the reader with no visible change.",
    status: "verified",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "The trigger takes the tablist's size class so it inherits the same padding. Without it, it rendered as a bare 20×20 glyph and failed the 24×24 minimum against a master that specifies 44×44.",
    status: "verified",
    evidence: "Fixed by putting the size class on the bar as well as the tablist.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description:
      "The trigger sits after the tablist in the DOM, so Tab reaches it once — the tabs themselves are a single stop through the roving tabindex.",
  },
];

export default function TabsOverflowPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Tabs Overflow"
      status="Beta"
      summary="The Tabs / More trigger and its menu. It is internal to Tabs — never placed by a consumer — and appears only when a horizontal row genuinely cannot show every tab."
      figma={{ node: "tabsMore" }}
      specimen={<TabsOverflowSpecimen />}
      propsFrom="TabsOverflowProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Set `overflow` on Tabs where a horizontal row can outgrow its container — a portal detail view whose section count varies by scheme.",
          "A tab set whose scrolled-out entries would otherwise be undiscoverable.",
        ],
        avoid: [
          "Rendering this component yourself — it is deliberately not exported from the package barrel, and a second one would have no tablist to talk to.",
          "A vertical list — it wraps its labels instead of clipping them, so there is nothing to overflow.",
          "Solving a long label: shorten the label, then move to `track=\"none\"`, and only then reach for the menu.",
        ],
      }}
      related={[
        {
          label: "Tabs",
          href: "/design-system/components/navigation/tabs",
          reason: "the component that renders this, and the `overflow` prop that asks for it",
        },
        {
          label: "Account Menu",
          href: "/design-system/components/navigation/account-menu",
          reason: "the estate's other menu button, and the same APG pattern",
        },
        {
          label: "Select",
          href: "/design-system/components/forms/select",
          reason: "when the choice is a form value rather than a section",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-internal">
            <h2 id="cdp-internal" className="cdp__h2">
              You Ask for It; You Do Not Place It
            </h2>
            <p>
              It is deliberately not exported from the package barrel. A consumer turns it on with{" "}
              <code>overflow</code> on <code>Tabs</code>, and <code>Tabs</code> renders it when the
              row cannot show every tab. Exporting it would invite someone to put a second one
              somewhere it has no tablist to talk to.
            </p>
            <Callout type="info" title="Why overflow is off by default">
              Turning it on wraps the tablist in a positioning element, so the rendered DOM changes.
              Every consumer that has not asked for it renders exactly what it did before. It also
              stops tabs sharing the track equally — equal-width tabs never overflow, they truncate
              harder, so the trigger would never appear.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-model">
            <h2 id="cdp-model" className="cdp__h2">
              It Does Not Move Tabs into the Menu
            </h2>
            <p>
              Every tab stays rendered, focusable and arrow-reachable; this menu is a{" "}
              <strong>pointer shortcut</strong> to the ones scrolled out of view. Moving tabs into a
              menu is the other common model, and it costs their <code>role=&quot;tab&quot;</code>,
              their <code>aria-controls</code> and their place in the roving tabindex — a worse
              trade than the scrolling it would save.
            </p>
            <MatrixTable
              caption="Two models for an overflowing tab row"
              columns={["", "This component", "Moving tabs into a menu"]}
              rows={[
                ["Tab keeps role=tab", "Yes", "No"],
                ["Tab keeps aria-controls", "Yes", "No"],
                ["Reachable by arrow key", "Yes", "No"],
                ["Menu contents change with scroll", "No", "Yes"],
              ]}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-complete">
            <h2 id="cdp-complete" className="cdp__h2">
              It Lists Every Tab, Not Just the Hidden Ones
            </h2>
            <p>
              The first build listed only what was currently out of view, which meant opening the
              same menu at two scroll positions gave two different lists — surprising, and something
              no shipped system does. A stable &ldquo;jump to any section&rdquo; list is
              predictable, and the current tab is marked rather than omitted so the menu always
              reads as a complete picture of the set.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-fade">
            <h2 id="cdp-fade" className="cdp__h2">
              The Edge Fade Applies to an Open List Only
            </h2>
            <p>
              An open row has nothing to explain a cut, so it earns a fade at whichever edge still
              has content. An enclosed row is a bordered, rounded container that already explains it
              — and cannot be faded cleanly anyway, because its border, fill and radius are painted
              by the scrolling element, so a mask dissolves the container instead of the tabs.
            </p>
            <Callout type="info" title="The fade is direction-agnostic">
              In right-to-left, Chromium and Firefox report <code>scrollLeft</code> as a negative
              offset from the start edge — measured at −461 in one run — so a naive{" "}
              <code>scrollLeft &gt; 1</code> reported &ldquo;at the start&rdquo; while scrolled to
              the end and put the fades on the wrong sides. Distance from the start is the quantity
              that matters, and it is the absolute value in both directions.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <p>
            There is no import. Turn the menu on where a row can outgrow its container, and{" "}
            <code>Tabs</code> renders the trigger only when it actually does.
          </p>
          <CodeBlock>{`import { Tabs } from "@mosje/design-system";

<Tabs
  tabs={SECTIONS}
  active={active}
  onChange={setActive}
  idBase={idBase}
  ariaLabel="Application sections"
  overflow
/>`}</CodeBlock>
          <Callout type="warning" title="A tablist inside a flex or grid item needs min-width: 0">
            Without it the item refuses to shrink, so the row never overflows and the trigger never
            appears. This is the single most common reason <code>overflow</code> looks as though it
            has done nothing.
          </Callout>
          <p>
            The props above are what <code>Tabs</code> passes in. They are documented because the
            component is real and its contract is worth reading, not because a consumer supplies
            them.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <MatrixTable
            caption="Keys the trigger and its menu handle"
            columns={["Key", "On the trigger", "In the menu"]}
            rows={[
              ["Enter / Space", "Opens the menu", "Chooses the item"],
              ["ArrowDown / ArrowUp", "Opens the menu", "Moves between items, skipping disabled ones"],
              ["Escape", "—", "Closes and returns focus to the trigger"],
              ["Tab", "Moves on", "Closes the menu"],
            ]}
          />
          <p>
            Choosing an item does more than select. The tab is by definition off-screen, so it is
            scrolled into view and focused — otherwise the reader picks something and nothing
            appears to happen.
          </p>
          <Callout type="info" title="menuitemradio, not menuitem">
            The items are a set of mutually exclusive choices with exactly one active, which is what{" "}
            <code>role=&quot;menuitemradio&quot;</code> and <code>aria-checked</code> describe.
            Plain menu items would let a screen-reader user hear the list without hearing which
            section they are already in.
          </Callout>
        </section>
      }
    />
  );
}
