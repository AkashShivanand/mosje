import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { TransferPlayground } from "./transfer-playground";

export const metadata: Metadata = {
  title: "Transfer List — Design System",
  description:
    "Two lists and the traffic between them. Each side is a list of checkboxes, deliberately — there is no WAI-ARIA pattern for a transfer list, and inventing a keyboard model is worse than using controls every reader already knows.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      'Read from the rendered DOM on this page: each side is a <fieldset> whose <legend> carries its name and count — "Available districts (4)" — and the pair sits inside a role="group" named by `label`.',
    description: "Each side is a named group, and the count is part of the name.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      'Driven in a browser: with the region empty on load, ticking two available districts and pressing the move button left it reading "2 items added to Mapped districts", and the two legends went from (4)/(2) to (2)/(4).',
    description: "What moved is announced, because it is exactly what cannot be seen.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "Every control is a native checkbox or button: Tab reaches them, Space toggles a checkbox, Enter and Space activate a button. No custom key handling was added, which is the point of choosing checkboxes over a multi-select listbox.",
    description: "It needs no keyboard model of its own.",
  },
  {
    criterion: "3.2.4 Consistent Identification",
    level: "AA",
    status: "verified",
    evidence:
      'Read from the DOM with two items ticked on the left, the button reads "Add 2"; with nothing ticked it reads "Add" and is disabled.',
    description: "The buttons say what they will do, not merely which direction they point.",
  },
];

export default function TransferListPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Transfer List"
      status="Stable"
      summary="Two lists and the traffic between them — Surveyor Mappings, Roles & Permissions. Each side is a list of checkboxes, because a transfer list has no WAI-ARIA pattern and inventing a keyboard model is worse than using controls every reader already knows."
      figma={{ node: "transferList" }}
      specimen={<TransferPlayground />}
      propsFrom="TransferListProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A reader assigns some of a known set to something — districts to a surveyor, permissions to a role.",
          "Both what is assigned and what is available need to be visible at once.",
        ],
        avoid: [
          "There are three or four options. Three checkboxes are three checkboxes.",
          "The order of the assigned items matters. This control has no way to express one.",
          "The set is long enough to need searching. Pair it with a filter, or use a Data Table with row selection.",
        ],
      }}
      related={[
        { label: "Checkbox", href: "/design-system/components/forms/checkbox", reason: "the control each row is" },
        { label: "Data Table", href: "/design-system/components/data-display/data-table", reason: "when the set needs searching or sorting" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-check">
            <h2 id="cdp-check" className="cdp__h2">Checkboxes, Deliberately</h2>
            <p>
              There is no WAI-ARIA pattern for a transfer list. The usual implementation invents
              one — a multi-select listbox with shift-ranges and a roving tab stop — which a reader
              has to learn on the spot and which almost nobody implements completely. A checkbox
              needs no new keys and reports its own state without help. The cost is a little more
              vertical space; the gain is that the control works.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-count">
            <h2 id="cdp-count" className="cdp__h2">The Count Is Part of the Name</h2>
            <p>
              &ldquo;Available districts (4)&rdquo; sits in the <code>legend</code>, so a screen
              reader states it when it enters the group. A number floating beside the heading is
              read at some unrelated moment, or not at all.
            </p>
            <CodeBlock>{`import { TransferList } from "@mosje/design-system";

<TransferList
  label="Districts mapped to this surveyor"
  items={districts}          // every item, either side
  selectedIds={mapped}       // the component splits them
  onChange={setMapped}
  availableLabel="Available districts"
  selectedLabel="Mapped districts"
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-btn">
            <h2 id="cdp-btn" className="cdp__h2">The Buttons Promise a Number</h2>
            <p>
              &ldquo;Add 3&rdquo;, not &ldquo;Add&rdquo;, and disabled when nothing is ticked. An
              arrow between two panels tells a reader which way something will go and nothing about
              what.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-live">
            <h2 id="cdp-live" className="cdp__h2">What Moved Is Announced</h2>
            <p>
              After a move, a polite live region says &ldquo;3 items added to Mapped
              districts&rdquo;. On a two-panel control the thing that changed is precisely the
              thing a screen-reader user cannot see, and without this the press appears to do
              nothing.
            </p>
          </section>
        </>
      }
    />
  );
}
