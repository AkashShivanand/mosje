import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { TogglePlayground } from "./toggle-playground";

export const metadata: Metadata = {
  title: "Toggle — Design System",
  description:
    "A switch for a setting that takes effect immediately. A real checkbox input carrying role=\"switch\", paired with a styled track and knob.",
};

/*
 * Read off `ToggleProps` in packages/design-system/components/forms/toggle.tsx.
 * The interface extends `InputHTMLAttributes<HTMLInputElement>` minus `type` and
 * `size`, so every other native attribute passes through and is not listed.
 */
const PROPS: PropDef[] = [
  {
    name: "checked",
    type: "boolean",
    required: true,
    description:
      "Controlled on/off state. The component holds no state of its own, so a switch that never moves is a missing `onChange` rather than a bug here.",
  },
  {
    name: "onChange",
    type: "React.ChangeEventHandler<HTMLInputElement>",
    required: true,
    description: "Receives the native change event. Read `event.target.checked`.",
  },
  {
    name: "label",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "Text beside the switch, tied to the input by `htmlFor`/`id` so clicking it toggles. Without it the track is the only target, and the switch has no accessible name unless one is passed through.",
  },
  {
    name: "size",
    type: '"default" | "small"',
    default: '"default"',
    description:
      "`default` is the form and settings size. `small` is for a dense row — a toolbar, a table cell — and still clears the 24×24 minimum target.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Standard native disabled. A disabled switch is not focusable and is not submitted.",
  },
  {
    name: "id",
    type: "string",
    default: "auto",
    description: "Falls back to a generated `useId()`. Pass one only when another element must reference it.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the outer wrapper, not the input.",
  },
  {
    name: "...native",
    type: "Omit<React.InputHTMLAttributes<HTMLInputElement>, \"type\" | \"size\">",
    default: "—",
    description:
      "Every other native input attribute is forwarded to the hidden input, including `name`, `aria-label`, `aria-describedby` and `ref`.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The label is associated through `htmlFor`/`id`, so the accessible name is programmatic rather than positional.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "A real `<input type=\"checkbox\">` sits behind the track, so Tab reaches it and Space toggles it. No key handling is re-implemented.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description: "The hidden input's focus is drawn on the track through `:focus-visible`.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "The label is part of the target, and both sizes clear 24×24 on the track alone. A switch rendered with no label does not meet this comfortably on its own.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "`role=\"switch\"` with `aria-checked` announces the control as on or off rather than as checked, which is what distinguishes it from a checkbox to a screen-reader user.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "The knob's position carries the state as well as the track colour, so on and off are distinguishable without colour.",
  },
];

export default function TogglePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Toggle"
      status="Stable"
      summary="A switch for a setting that takes effect immediately. Behind the styled track is a real checkbox input carrying the switch role, so it keeps native keyboard behaviour while announcing itself as on or off rather than as checked."
      figma={{ node: "toggle" }}
      specimen={<TogglePlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A setting takes effect the moment it is changed — a notification preference, a display option, a visibility switch.",
          "The two states are plainly on and off, and both are reversible.",
          "The control sits in a settings list or an administrative panel rather than in a form the reader submits.",
        ],
        avoid: [
          "The change takes effect only on submit — use Checkbox, which reads as a form field.",
          "The reader is agreeing to terms, a consent or a statutory declaration — use Checkbox, or Declaration Checkbox where the wording is legal text.",
          "There are more than two states, or the states are not opposites — use a Radio group.",
          "Turning it off destroys something. A switch invites an idle tap; use a Button with a confirmation instead.",
        ],
      }}
      related={[
        {
          label: "Checkbox",
          href: "/design-system/components/forms/checkbox",
          reason: "when the change takes effect on submit",
        },
        {
          label: "Radio",
          href: "/design-system/components/forms/radio",
          reason: "when there are more than two states",
        },
        {
          label: "Declaration Checkbox",
          href: "/design-system/components/forms/declaration-checkbox",
          reason: "for a statutory agreement, which is never a switch",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-sizes">
          <h2 id="cdp-sizes" className="cdp__h2">
            Sizes
          </h2>
          <ul>
            <li>
              <strong>Default</strong> — the settings and form size, and the right choice unless the
              row is genuinely too tight for it.
            </li>
            <li>
              <strong>Small</strong> — for a dense layout such as a toolbar or a table cell. It is a
              density decision, not a way to fit more switches into a space that is already too small.
            </li>
          </ul>
          <p>
            The label is what makes either size comfortable to hit. A bare track with the name carried
            only by <code>aria-label</code> is legal but hard to use, and it gives a sighted reader
            nothing to read.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Toggle } from "@mosje/design-system";

const [enabled, setEnabled] = React.useState(true);

<Toggle
  label="Receive SMS Alerts"
  checked={enabled}
  onChange={(event) => setEnabled(event.target.checked)}
/>`}</CodeBlock>
          <p>
            Where the switch needs an explanation, link it rather than putting it in the label — the
            label becomes the accessible name, and a sentence read as a name is hard to follow.
          </p>
          <CodeBlock>{`<Toggle
  label="Publish This Scheme"
  checked={published}
  onChange={onPublish}
  aria-describedby="publish-note"
/>
<p id="publish-note">Once published, the scheme is visible to every citizen.</p>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <ul>
            <li>
              <strong>Tab</strong> — move to the switch. It is a single tab stop.
            </li>
            <li>
              <strong>Space</strong> — toggle. Enter does not toggle a switch, and must not be made to:
              inside a form, Enter submits.
            </li>
          </ul>
          <p>
            <code>role=&quot;switch&quot;</code> is the reason this is not simply a differently styled
            checkbox. A screen reader announces &quot;on&quot; or &quot;off&quot; rather than
            &quot;checked&quot;, which matches what the control actually does — and is why it should
            not be used for anything the reader is agreeing to.
          </p>
        </section>
      }
    />
  );
}
