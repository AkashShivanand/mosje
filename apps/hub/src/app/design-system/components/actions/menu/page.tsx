import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { MenuPlayground } from "./menu-playground";

export const metadata: Metadata = {
  title: "Menu — Design System",
  description:
    "The WAI-ARIA menu-button pattern: a trigger opens a list of commands, focus moves onto the first, and the arrow keys move between them.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      'The trigger carries aria-haspopup="menu", aria-expanded reflecting state, and aria-controls while open. The panel is role="menu" named by the required `label`. Items are role="menuitem", or menuitemradio / menuitemcheckbox with aria-checked when `kind` says so. Read from the rendered accessibility tree in the browser.',
    description:
      "The trigger reports the menu's state; the panel and its items carry the roles the pattern requires.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "Down and Up move and wrap, Home and End jump to the ends, a printable key jumps to the next label starting with what was typed, Enter and Space choose, Down on the closed trigger opens. Verified key by key in the browser against the rendered menu.",
    description:
      "Every part of the WAI-ARIA keyboard model is implemented, including type-ahead.",
  },
  {
    criterion: "2.1.2 No Keyboard Trap",
    level: "A",
    status: "verified",
    evidence:
      "Tab inside the menu closes it rather than cycling, so focus continues into the page from the trigger. Verified by pressing Tab from the middle of an open menu.",
    description: "The menu is non-modal and never cycles focus back to its first item.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    status: "verified",
    evidence:
      "Escape and choosing an item both call closeAndRestore, which focuses the trigger through the merged ref. Verified: after Escape, document.activeElement is the trigger and its aria-expanded is false.",
    description:
      "Closing returns focus to the trigger, whether the reader chose something or dismissed it.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      'A disabled item renders aria-disabled="true" and is excluded from the arrow-key list by the selector [role^="menuitem"]:not([aria-disabled="true"]). The native disabled attribute is never used. Read from the DOM and confirmed by arrowing past it.',
    description:
      "A disabled item stays in the accessibility tree so its existence is still announced, and the arrow keys skip it.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "Each row binds --sa-control-height-md (2.5rem = 40px) as a min-height and fills the menu's width, so every row exceeds the 24×24 minimum on both axes. Measured with getBoundingClientRect in the browser.",
    description:
      "Rows are 40px tall, comfortably above the 24×24 AA minimum — 24 is the floor, not the goal.",
  },
];

export default function MenuPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Menu"
      status="Stable"
      summary="A trigger that opens a list of commands, implementing the WAI-ARIA menu-button pattern in full — roving focus, arrow keys, type-ahead, and a disabled item that stays announceable."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={<MenuPlayground />}
      propsFrom="MenuProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A table row offers more actions than fit as buttons — the dense-table ⋮.",
          "A control offers several commands that all act on the same thing, and only one will be chosen.",
          "A sort or a view option needs a single choice with a visible tick, and it is not part of a form.",
        ],
        avoid: [
          "The choice is a field's value that submits with a form — use Select, so the value is announced and posted.",
          "The panel needs mixed controls: a text field, a checkbox and two buttons — use Popover, which is a dialog.",
          "There is only one action — use a Button. A menu of one is a button with an extra click.",
          "The items are destinations rather than commands — use navigation, so links behave as links.",
        ],
      }}
      related={[
        {
          label: "Popover",
          href: "/design-system/components/feedback/popover",
          reason: "when the panel holds arbitrary controls rather than commands",
        },
        {
          label: "Select",
          href: "/design-system/components/forms/select",
          reason: "when the choice is a field's value",
        },
        {
          label: "Button Group",
          href: "/design-system/components/actions/button-group",
          reason: "when there are few enough actions to show them all",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-three">
            <h2 id="cdp-three" className="cdp__h2">
              Menu, Popover, Select — Choosing Between Them
            </h2>
            <p>
              These three look alike and are not interchangeable. A <strong>Select</strong> edits a
              field&apos;s value and submits with the form. A <strong>Popover</strong> is a dialog
              holding whatever controls the task needs. A <strong>Menu</strong> offers commands. The
              roles follow from that, and so does the keyboard model — which is why substituting one
              for another is not a styling decision. A menu used as a form control produces a value
              a screen reader never announced and a form that never carries it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-labels">
            <h2 id="cdp-labels" className="cdp__h2">
              Every Item Carries Visible Text
            </h2>
            <p>
              The trigger may be icon-only — the dense-table <code>⋮</code> is the shape this was
              built for — but the items may not. This menu is where the estate puts the actions
              whose icons are not universal, so an icon-only item would reintroduce exactly the
              discoverability problem the menu was added to solve. <code>icon</code> is decorative
              and drawn beside the label, never instead of it.
            </p>
            <p>
              Use <code>description</code> for an action whose consequence is not obvious from its
              name. &ldquo;Return for correction&rdquo; and &ldquo;Reject application&rdquo; both
              earn one; &ldquo;Download as PDF&rdquo; does not.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-tone">
            <h2 id="cdp-tone" className="cdp__h2">
              Tone Colours the Label, Not the Row
            </h2>
            <p>
              <code>tone</code> tints the item&apos;s text and its hover fill, never a resting fill
              across the row. A row filled with red reads as an alert about something that has
              already happened; the item is an action still available to take. Reserve{" "}
              <code>danger</code> for the one action that cannot be undone.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-placement">
            <h2 id="cdp-placement" className="cdp__h2">
              Placement
            </h2>
            <p>
              <code>align</code> defaults to <code>end</code>, because the trigger is usually the
              last thing in a row and a menu aligned to its trailing edge stays inside the table.
              Placement is the estate&apos;s shared engine in <code>foundations/anchor.ts</code>:
              measured after mounting, flipped once when the preferred side would overflow, and
              clamped against an 8px viewport margin. It follows the trigger when the table scrolls
              rather than closing, which is what three of the four hand-rolled menus in this estate
              got wrong.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Menu, IconButton } from "@mosje/design-system";

<Menu
  label="Actions for this application"
  onSelect={(id) => act(id, application)}
  items={[
    { id: "view", label: "View application", icon: "visibility" },
    { id: "assign", label: "Assign to an officer", icon: "person_add" },
    { kind: "separator" },
    {
      id: "reject",
      label: "Reject application",
      icon: "block",
      tone: "danger",
      description: "This cannot be undone.",
    },
  ]}
>
  <IconButton aria-label="Actions for this row" icon="more_vert" />
</Menu>`}</CodeBlock>
          <p>
            A single choice uses <code>kind: &quot;radio&quot;</code> with <code>checked</code>, and
            a <code>separator</code> may carry a group heading.
          </p>
          <CodeBlock>{`items={[
  { kind: "separator", label: "Sort by" },
  { id: "recent", label: "Most recent first", kind: "radio", checked: sort === "recent" },
  { id: "oldest", label: "Oldest first", kind: "radio", checked: sort === "oldest" },
]}`}</CodeBlock>
          <p>
            The trigger is cloned, so its ref is merged and any handlers it already carries run
            first. A trigger that calls <code>preventDefault</code> stops the menu opening, which is
            how a guard on a locked row is written.
          </p>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-disabled">
            <h2 id="cdp-disabled" className="cdp__h2">
              A Disabled Item Is Still Announced
            </h2>
            <p>
              The native <code>disabled</code> attribute removes an element from the accessibility
              tree. Applied to a menu item it means a screen-reader user does not learn the action
              exists at all — which is worse than learning it is unavailable, because it changes
              what they believe the system can do. The item therefore keeps{" "}
              <code>aria-disabled</code>, stays in the menu, and is skipped only by the arrow keys.
            </p>
            <p>
              Where the reason matters, put it in <code>description</code>:
              &ldquo;Available once the district officer has verified the documents&rdquo; tells the
              reader what to do next. A greyed row with no explanation does not.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-typeahead">
            <h2 id="cdp-typeahead" className="cdp__h2">
              Type-ahead
            </h2>
            <p>
              Typing jumps to the next item whose label starts with what has been typed, and the
              buffer clears after a short pause. It is what keeps a menu of a dozen actions usable
              without a mouse, and it is the part of the pattern most often left out. Only single
              printable characters participate, so browser and screen-reader shortcuts are
              untouched.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-roving">
            <h2 id="cdp-roving" className="cdp__h2">
              One Tab Stop
            </h2>
            <p>
              The menu is a single stop in the page&apos;s tab order: items carry{" "}
              <code>tabIndex=-1</code> and focus is moved between them by the arrow keys. A menu
              whose every item were tabbable would put twelve stops between the reader and the next
              control on the page.
            </p>
          </section>
        </>
      }
    />
  );
}
