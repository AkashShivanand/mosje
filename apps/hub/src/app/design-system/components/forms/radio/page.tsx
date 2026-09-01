import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { RadioPlayground } from "./radio-playground";

export const metadata: Metadata = {
  title: "Radio — Design System",
  description:
    "A radio button for choosing exactly one option from a mutually exclusive set, in an inline variant and a full selectable card variant.",
};

/*
 * Read off `RadioProps` in packages/design-system/components/forms/radio.tsx.
 * The interface extends `InputHTMLAttributes<HTMLInputElement>` minus `type` and
 * `size`, so every other native attribute passes through. `name` and `value` are
 * declared required because a radio with neither belongs to no group.
 */
const PROPS: PropDef[] = [
  {
    name: "checked",
    type: "boolean",
    required: true,
    description:
      "Controlled checked state. The component holds no state of its own, so a radio that never changes is a missing `onChange` rather than a bug here.",
  },
  {
    name: "name",
    type: "string",
    required: true,
    description:
      "The group name. Every option in one choice shares it — this is what makes the browser treat them as one group, and what gives arrow-key navigation for free.",
  },
  {
    name: "value",
    type: "string",
    required: true,
    description: "This option's value, submitted with the form when the option is selected.",
  },
  {
    name: "onChange",
    type: "React.ChangeEventHandler<HTMLInputElement>",
    required: true,
    description: "Receives the native change event. Read `event.target.value`.",
  },
  {
    name: "label",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "Text beside the circle, tied to the input by `htmlFor`/`id` so clicking it selects. Without it the circle is the only target, which fails WCAG 2.5.8.",
  },
  {
    name: "variant",
    type: '"default" | "card"',
    default: '"default"',
    description:
      "`default` is an inline circle and label. `card` renders the whole option as a selectable card, which is what makes room for a description.",
  },
  {
    name: "description",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "Secondary text under the label. It renders in the `card` variant only — the inline variant has nowhere to put it.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Standard native disabled. A disabled radio is not focusable and is not submitted.",
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
    description: "Merged onto the outer wrapper — the `<span>` in the default variant, the `<label>` in the card variant.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The label is associated through `htmlFor`/`id`, and a shared `name` binds the options into one group the browser understands.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "A real `<input type=\"radio\">` carries the native key handling: the group is one tab stop, and arrow keys move the selection within it.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description:
      "The visually hidden input's focus is drawn on the styled circle in the default variant and on the whole card in the card variant.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "The label is part of the target. The card variant takes the whole card, which is why it is the right choice on a phone.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "Role, checked state and value are native. In the card variant the description sits inside the `<label>`, so it is read as part of the option's name.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    description: "Every option carries a persistent visible label; the circle is never unlabelled.",
  },
];

export default function RadioPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Radio"
      status="Stable"
      summary="A radio button for choosing exactly one option from a mutually exclusive set. It is a real native radio, so the browser handles grouping and arrow-key movement; the card variant turns each option into a full selectable block with room for a description."
      figma={{ node: "radio" }}
      specimen={<RadioPlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "The reader must select exactly one option, and none of them is a sensible silent default.",
          "There are fewer than about six options and each one is worth showing without a click.",
          "An option needs a sentence of explanation beside it, which the card variant carries.",
        ],
        avoid: [
          "The reader may select any number of options, including none — use Checkbox.",
          "There are six or more options — use Select, which does not spend the whole page on the choice.",
          "The choice takes effect immediately as a setting rather than on submit — use Toggle.",
          "There are exactly two options and one is plainly the absence of the other — a single Checkbox is clearer than a Yes/No pair.",
        ],
      }}
      related={[
        {
          label: "Checkbox",
          href: "/design-system/components/forms/checkbox",
          reason: "when any number of options may be chosen",
        },
        {
          label: "Select",
          href: "/design-system/components/forms/select",
          reason: "when the list is too long to show in full",
        },
        {
          label: "Toggle",
          href: "/design-system/components/forms/toggle",
          reason: "when the change takes effect immediately",
        },
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "the label and error wiring around the group",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-variants">
          <h2 id="cdp-variants" className="cdp__h2">
            Radio Cards
          </h2>
          <p>
            <code>variant=&quot;card&quot;</code> renders the option as a large, tappable block with an
            optional description under the label. It is the right choice where the options are major
            pathways through a service rather than values in a field — a payment method, an
            application type, a mode of submission.
          </p>
          <p>
            It is also the right choice on a phone, because the whole card is the target. The inline
            variant depends on the label text for its hit area, which is fine beside a short label and
            marginal beside a one-word one.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Radio } from "@mosje/design-system";

<Radio
  variant="card"
  name="payment_method"
  value="upi"
  checked={method === "upi"}
  onChange={(event) => setMethod(event.target.value)}
  label="UPI (Unified Payments Interface)"
  description="Pay instantly using any UPI application."
/>`}</CodeBlock>
          <p>
            A group is several of these sharing one <code>name</code>. Wrap them in a{" "}
            <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code> so the question itself has
            an accessible name, which no individual option carries.
          </p>
          <CodeBlock>{`<fieldset>
  <legend>Mode of Submission</legend>
  {MODES.map((mode) => (
    <Radio
      key={mode.value}
      name="mode"
      value={mode.value}
      checked={selected === mode.value}
      onChange={(event) => setSelected(event.target.value)}
      label={mode.label}
    />
  ))}
</fieldset>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <ul>
            <li>
              <strong>Tab</strong> — move to the group. A radio group is a single tab stop, unlike a
              set of checkboxes, and Tab leaves the group rather than moving inside it.
            </li>
            <li>
              <strong>Arrow keys</strong> — move the selection between the options. This works because
              the options share a <code>name</code>; a group whose options carry different names is
              broken in a way that is invisible with a mouse.
            </li>
            <li>
              <strong>Space</strong> — select the focused option where none is yet selected.
            </li>
          </ul>
          <p>
            The group as a whole needs a name. Neither variant provides one — put the question in a{" "}
            <code>&lt;legend&gt;</code>, or in a Form Field label with{" "}
            <code>role=&quot;radiogroup&quot;</code> on the container.
          </p>
        </section>
      }
    />
  );
}
