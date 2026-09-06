import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { SplitPlayground } from "./split-playground";

export const metadata: Metadata = {
  title: "Split Button — Design System",
  description:
    "One default action with its alternatives one press away — two real buttons joined by ButtonGroup, never one control that behaves differently depending on which half was hit.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      'Read from the rendered DOM: the pair is a role="group" named by `label`; the default action is a plain <button>; the trigger is a separate <button> with its own aria-label ("More ways to approve"), aria-haspopup="menu" and aria-expanded. Two distinct controls, two distinct names.',
    description:
      "The default action and the trigger are separate controls, each named, not one control with two behaviours.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "Tab reaches the default action and the trigger as two stops; Enter and Space activate whichever is focused; ArrowDown on the trigger opens the menu. Measured with real key presses in the browser.",
    description: "Both halves are reachable and operable without a pointer.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "Both halves inherit Button's md height (40px); the trigger is at least as wide as it is tall. Measured with getBoundingClientRect on this page: neither half is below 40px on either axis.",
    description: "Both halves clear the 24×24 minimum comfortably.",
  },
];

export default function SplitButtonPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Split Button"
      status="Stable"
      summary="One default action with its alternatives one press away. It is two real buttons joined by ButtonGroup — never one control that behaves differently depending on which half was hit."
      figma={{ absent: "No master in the SAMAVESH library yet — the gap, and the order the seventeen are being closed in, are recorded in docs/audit/design-system-completeness-2026-09-06.md." }}
      specimen={<SplitPlayground />}
      propsFrom="SplitButtonProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "One action is what most people want, and the variations on it are worth offering without cluttering the screen.",
          "An approval or a submission has a plain form and one or two qualified forms.",
        ],
        avoid: [
          "No option is the obvious default. A split button makes one of them the path of least resistance, and on an approval screen that is a thumb on the scale — use a Menu.",
          "There are two or three actions and all should be visible — that is a Button Group.",
          "The alternatives act on different things. A split button says every option acts on the same object.",
        ],
      }}
      related={[
        { label: "Menu", href: "/design-system/components/actions/menu", reason: "when no option is the obvious default" },
        { label: "Button Group", href: "/design-system/components/actions/button-group", reason: "when every action should be visible" },
        { label: "Button", href: "/design-system/components/actions/button", reason: "when there is only one action" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-two">
            <h2 id="cdp-two" className="cdp__h2">Two Buttons, Not One</h2>
            <p>
              The default action is a real button that activates on Enter and Space. The trigger
              beside it is a separate control with its own accessible name and its own{" "}
              <code>aria-expanded</code>. Merging them into a single control that behaves
              differently depending on which half was hit is how this pattern is usually built, and
              it is unusable from a keyboard: there is no way to express &ldquo;the right-hand
              eighth of this button&rdquo; as a key press.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-compose">
            <h2 id="cdp-compose" className="cdp__h2">It Draws No Seam of Its Own</h2>
            <p>
              The join, the collapsed inner corners and the group&apos;s role and name come from{" "}
              <code>ButtonGroup attached</code>, which the estate already publishes. This component
              adds a menu and nothing else — so it cannot drift from the segmented control it is
              supposed to look like, and a change to the seam reaches both at once.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-default">
            <h2 id="cdp-default" className="cdp__h2">Only Where There Is a Default</h2>
            <p>
              The wide half is the easy half. Where the alternatives are equally likely, putting one
              of them there quietly makes it the path of least resistance — and on a screen where an
              officer approves or rejects a citizen&apos;s application, that is a thumb on the
              scale. If you cannot say which action most people should take, the answer is a{" "}
              <code>Menu</code>, where none of them is pre-selected by the layout.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`import { SplitButton } from "@mosje/design-system";

<SplitButton
  label="Approve this application"
  onClick={approve}
  onSelect={(id) => approveVariant(id)}
  items={[
    { id: "remarks", label: "Approve with remarks", icon: "edit_note" },
    { id: "notify", label: "Approve and notify the applicant", icon: "mail" },
  ]}
>
  Approve
</SplitButton>`}</CodeBlock>
          <p>
            <code>label</code> names the group and the menu. The trigger derives its own name from
            the default action&apos;s label — &ldquo;More ways to approve&rdquo; — so the two
            controls are never announced with the same string.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-names">
          <h2 id="cdp-names" className="cdp__h2">Two Controls Need Two Names</h2>
          <p>
            A screen-reader user moving through this pair hears &ldquo;Approve, button&rdquo; and
            then &ldquo;More ways to approve, menu button, collapsed&rdquo;. If both carried the
            group&apos;s name they would be indistinguishable, and the second would appear to be a
            duplicate of the first.
          </p>
          <p>
            Disabling disables <em>both</em> halves. A live menu of alternatives beside a dead
            default action is a trap: the reader chooses something and nothing happens.
          </p>
        </section>
      }
    />
  );
}
