import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { TreePlayground } from "./tree-playground";

export const metadata: Metadata = {
  title: "Tree — Design System",
  description:
    "A hierarchy a reader walks, built to the WAI-ARIA tree pattern rather than approximated — one tab stop, arrow keys that expand and descend, type-ahead, and the level and position on every node.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "Driven with real key presses in a browser, from West Bengal: ArrowRight descended to Bankura, ArrowLeft returned to West Bengal, a second ArrowLeft collapsed it (aria-expanded went to false), End reached Delhi, and typing \"b\" jumped to Bihar.",
    description: "The whole hierarchy is operable from the keyboard.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    status: "verified",
    evidence:
      "Read from the DOM on this page: the two trees hold 6 and 10 nodes and each has exactly one node with tabindex=0, every other being -1 — so a tree is a single tab stop however many nodes it holds.",
    description: "A tree of two hundred nodes is one stop in the tab sequence, not two hundred.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      'Read from the DOM: the list is role="tree" named by `label`; every node is role="treeitem" carrying aria-level, aria-setsize and aria-posinset, aria-expanded on branches, and aria-selected. The disabled node carries aria-disabled rather than the native attribute.',
    description: "A screen reader can state the level and the position, not just the label.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      "The selected node carries a leading inset rule and a heavier weight as well as a tint, and aria-selected is on the node itself. Read from the computed style on this page.",
    description: "Selection is not signalled by colour alone.",
  },
];

export default function TreePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Tree"
      status="Stable"
      summary="A hierarchy a reader walks — Master Data, Map Ministry & Schemes, Roles & Permissions. Built to the WAI-ARIA tree pattern rather than approximated, because the half people skip is the half that matters."
      figma={{ node: "tree" }}
      specimen={<TreePlayground />}
      propsFrom="TreeProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The data is a real hierarchy and the reader has to see its shape — states inside a scheme, permissions inside a role.",
          "Branches are opened and closed as the reader narrows down.",
        ],
        avoid: [
          "There are only two levels. A list with headings is easier to use and needs no keyboard model.",
          "It is portal navigation — that is Sidebar Nav, which knows about the current route.",
          "The reader needs to compare items across branches. A Data Table with a filter does that better.",
        ],
      }}
      related={[
        { label: "Sidebar Nav", href: "/design-system/components/navigation/sidebar-nav", reason: "for portal navigation" },
        { label: "List Group", href: "/design-system/components/data-display/list-group", reason: "when the data is flat" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-stop">
            <h2 id="cdp-stop" className="cdp__h2">One Tab Stop, Not One Per Node</h2>
            <p>
              A roving <code>tabIndex</code> puts the tree in the tab sequence once; the arrow keys
              move inside it. A tree of two hundred nodes that is two hundred tab stops is a
              keyboard trap in everything but name — a reader trying to reach the control after it
              presses Tab two hundred times.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-keys">
            <h2 id="cdp-keys" className="cdp__h2">Two Keys Doing Two Things Each</h2>
            <p>
              Right expands a closed branch, and on an already-open one descends into it. Left
              collapses an open branch, and on a leaf ascends to the parent. That is the pattern&rsquo;s
              own behaviour and it is what a reader who has used a file manager expects.{" "}
              <code>*</code> expands every sibling of the focused node.
            </p>
            <CodeBlock>{`import { Tree } from "@mosje/design-system";

<Tree
  label="States and districts"
  nodes={nodes}                       // children: [] is still a branch
  selectedId={selected}
  onSelect={setSelected}
  defaultExpandedIds={["wb"]}
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-shape">
            <h2 id="cdp-shape" className="cdp__h2">The Shape Is Announced, Not Only Drawn</h2>
            <p>
              Every node carries <code>aria-level</code>, <code>aria-setsize</code> and{" "}
              <code>aria-posinset</code>, so a screen reader can say &ldquo;level 3, 4 of
              17&rdquo;. Without them a tree is announced as a flat list, and the shape — the
              entire reason to use a tree — is lost to the reader who most needs it stated.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-type">
            <h2 id="cdp-type" className="cdp__h2">Type-Ahead, and a Buffer That Clears</h2>
            <p>
              Arrowing to the fortieth district is not navigation. Typing letters moves to the first
              label that starts with them, and the buffer clears after a pause — so
              &ldquo;ba&rdquo; finds Bankura and a later &ldquo;n&rdquo; starts afresh rather than
              searching for &ldquo;ban&rdquo;.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-dis">
            <h2 id="cdp-dis" className="cdp__h2">A Disabled Branch Is Still Reachable</h2>
            <p>
              It carries <code>aria-disabled</code>, never the native attribute. A reader has to be
              able to learn that a branch exists and is not theirs to open; removing it from the
              keyboard order teaches them it does not exist at all.
            </p>
          </section>
        </>
      }
    />
  );
}
