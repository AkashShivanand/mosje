import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { CheckboxPlayground } from "./checkbox-playground";

export const metadata: Metadata = {
  title: "Checkbox — Design System",
  description:
    "A checkbox selects one or more items from a set, or turns a single option on or off. Supports the mixed state a “select all” control needs.",
};

/*
 * Read off `CheckboxProps` in packages/design-system/components/forms/checkbox.tsx.
 * The interface extends `InputHTMLAttributes<HTMLInputElement>` minus `type` and
 * `size`, so every native input attribute — `name`, `required`, `aria-describedby`
 * — passes through and is not listed individually here.
 */
const PROPS: PropDef[] = [
  {
    name: "checked",
    type: "boolean",
    required: true,
    description:
      "Controlled checked state. The component holds no state of its own, so a checkbox that never changes is a missing onChange rather than a bug here.",
  },
  {
    name: "onChange",
    type: "React.ChangeEventHandler<HTMLInputElement>",
    required: true,
    description: "Receives the native change event. Read `event.target.checked`.",
  },
  {
    name: "indeterminate",
    type: "boolean",
    default: "false",
    description:
      "The mixed state, for a parent whose children are partly selected. Sets `aria-checked=\"mixed\"`, which is the only way a screen reader is told a “select all” is partial — the dash alone is invisible to it.",
  },
  {
    name: "label",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "Text beside the box, tied to the input by `htmlFor`/`id` so clicking it toggles. Omitting it leaves the 20px box as the only target, which fails WCAG 2.5.8 — supply a label, or an `aria-label` through the passthrough.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Standard native disabled. A disabled checkbox is not focusable and is not submitted.",
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
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The label is associated through `htmlFor`/`id`, so the accessible name is programmatic rather than proximity.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "A real `<input type=\"checkbox\">` carries the native key handling — Tab to reach, Space to toggle. Nothing is re-implemented.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description: "The visually hidden input's focus is drawn on the styled box through `:focus-visible`.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "The label is part of the target, taking the hit area well past 24×24. A checkbox rendered with no label does not meet this on its own.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "Role and value are native. `aria-checked=\"mixed\"` is set when `indeterminate` is true, because the DOM property is not exposed to assistive technology on its own.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    description: "Every control carries a persistent visible label; placeholder text is never the label.",
  },
];

export default function CheckboxPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Checkbox"
      status="Stable"
      summary="A checkbox selects any number of items from a set, or turns a single option on or off. It also carries the mixed state that a “select all” control needs when only some of its children are selected."
      figma={{ node: "checkbox" }}
      specimen={<CheckboxPlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A reader may select any number of choices from a list, including none.",
          "A single option is turned on or off as part of a form the reader submits — a declaration, a consent, an opt-in.",
          "A parent controls a group of children and needs to show that only some are selected.",
        ],
        avoid: [
          "Exactly one option may be chosen — use a Radio group, which enforces it.",
          "The change takes effect immediately rather than on submit — use a Toggle, which reads as a switch rather than a form field.",
          "There are more than about ten options — use a Select with multiple, or a filtered list.",
        ],
      }}
      related={[
        { label: "Radio", href: "/design-system/components/forms/radio", reason: "when exactly one option may be chosen" },
        { label: "Toggle", href: "/design-system/components/forms/toggle", reason: "when the change takes effect immediately" },
        {
          label: "Declaration Checkbox",
          href: "/design-system/components/forms/declaration-checkbox",
          reason: "for the statutory declaration at the foot of an application",
        },
      ]}
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Checkbox } from "@mosje/design-system";

const [agreed, setAgreed] = React.useState(false);

<Checkbox
  label="I have read and agree to the terms"
  checked={agreed}
  onChange={(event) => setAgreed(event.target.checked)}
/>`}</CodeBlock>
          <p>
            A “select all” parent reads its own state from the children rather than storing a third
            value — <code>checked</code> when every child is selected, <code>indeterminate</code> when
            only some are.
          </p>
          <CodeBlock>{`const all = items.every((i) => i.selected);
const some = items.some((i) => i.selected);

<Checkbox
  label="Select all districts"
  checked={all}
  indeterminate={!all && some}
  onChange={(event) => selectAll(event.target.checked)}
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <ul>
            <li>
              <strong>Tab</strong> — move to the checkbox. It is a single tab stop; a group of
              checkboxes is a group of stops, unlike a radio group.
            </li>
            <li>
              <strong>Space</strong> — toggle. Enter does not toggle a checkbox, and must not be made
              to: in a form, Enter submits.
            </li>
          </ul>
          <p>
            The indeterminate state is visual on the box and programmatic through{" "}
            <code>aria-checked=&quot;mixed&quot;</code>. Setting the DOM property without the ARIA
            attribute leaves a screen-reader user hearing “not checked” for a partly selected group,
            which is the failure this component exists to prevent.
          </p>
        </section>
      }
    />
  );
}
