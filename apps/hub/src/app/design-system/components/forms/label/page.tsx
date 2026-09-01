import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { LabelPlayground } from "./label-playground";

export const metadata: Metadata = {
  title: "Label — Design System",
  description:
    "A standalone label element for controls that are not wrapped in a Form Field, matching the Form Field label exactly.",
};

/*
 * Read off `LabelProps` in packages/design-system/components/forms/label.tsx.
 * The interface extends `LabelHTMLAttributes<HTMLLabelElement>` in full, so
 * `htmlFor` is a native attribute passed through rather than a declared prop —
 * optional to the type system, and required in practice. See the note below.
 */
const PROPS: PropDef[] = [
  {
    name: "children",
    type: "React.ReactNode",
    default: "undefined",
    description: "The label text. This is the question the control is asking.",
  },
  {
    name: "required",
    type: "boolean",
    default: "undefined",
    description:
      "Appends a required marker after the text. The marker is `aria-hidden`, so the requirement must also be carried by the control's own `required` attribute — the asterisk alone conveys nothing to a screen reader.",
  },
  {
    name: "hint",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "Secondary text rendered inline after the label in a lighter weight. It is inside the `<label>`, so it becomes part of the accessible name — keep it to a few words.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the `<label>` element.",
  },
  {
    name: "...native",
    type: "React.LabelHTMLAttributes<HTMLLabelElement>",
    default: "—",
    description:
      "Every native label attribute is forwarded, including `htmlFor` and `ref`. `htmlFor` is not declared separately by the interface, but a label with no `htmlFor` and no wrapped control names nothing.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "A real `<label>` element. Given `htmlFor`, the association with the control is programmatic rather than positional.",
  },
  {
    criterion: "2.5.3 Label in Name",
    level: "A",
    description:
      "The visible text is the accessible name, so a voice-control user can say what they see. Anything placed in `hint` becomes part of that name.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "A bound label extends the control's hit area, which is what takes a 20px checkbox or radio past the 24×24 minimum.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "The required marker is a glyph, not a colour change, so the requirement survives a monochrome or high-contrast rendering.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    description:
      "Every control carries a persistent visible label. This component exists so that stays true where Form Field's layout does not fit.",
  },
];

export default function LabelPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Label"
      status="Stable"
      summary="A standalone label for controls that are not wrapped in a Form Field. It renders a real label element and matches the Form Field label exactly, so a hand-wired field and a Form Field are indistinguishable side by side."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<LabelPlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A control sits in a layout Form Field's structure does not fit — a filter toolbar, an inline table row, a compact settings list.",
          "A checkbox or radio row needs a group label above it, which is not a field label.",
          "The `aria-describedby` wiring is being done by hand for a reason that is recorded.",
        ],
        avoid: [
          "The control is an ordinary form field — use Form Field, which wires the label, the hint and the error and cannot forget one.",
          "The text is a section heading rather than a control's name — use Form Section or Form Card, whose titles are headings.",
          "Nothing is being labelled. A label with no bound control is decoration with a misleading role.",
        ],
      }}
      related={[
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "the wrapper that renders this label and wires it for you",
        },
        {
          label: "Checkbox",
          href: "/design-system/components/forms/checkbox",
          reason: "carries its own label prop; this one labels the group",
        },
        {
          label: "Form Section",
          href: "/design-system/components/forms/form-section",
          reason: "when the text is a section heading, not a field name",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-when">
          <h2 id="cdp-when" className="cdp__h2">
            Prefer Form Field
          </h2>
          <p>
            Almost every field in the estate should use Form Field instead of this component. Form
            Field generates the id, binds the label, links the hint and the error through{" "}
            <code>aria-describedby</code>, and sets <code>aria-invalid</code> — four separate things a
            hand-wired field has to get right every time.
          </p>
          <p>
            The standalone label exists for the layouts Form Field&apos;s DOM structure does not suit:
            a filter toolbar where the label sits beside the control, an inline row in a table, or a
            group label above a set of checkboxes.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Input, Label } from "@mosje/design-system";

<Label htmlFor="district-filter" hint="(district only)">
  Filter By District
</Label>
<Input id="district-filter" />`}</CodeBlock>
          <p>
            The <code>htmlFor</code> value must match the control&apos;s <code>id</code> exactly. This
            is the failure Form Field exists to remove: a mistyped id produces a label that looks
            correct, clicks nothing, and names nothing.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            The required marker is rendered <code>aria-hidden</code> because an asterisk read aloud is
            noise. The requirement must therefore reach assistive technology some other way — through{" "}
            <code>required</code> on the control, which is what Form Field sets.
          </p>
          <p>
            The <code>hint</code> sits inside the <code>&lt;label&gt;</code>, so it is read as part of
            the field&apos;s name rather than as a description. Where the guidance is a sentence, put
            it in Form Field&apos;s <code>hint</code>, which is linked with{" "}
            <code>aria-describedby</code> and read separately.
          </p>
        </section>
      }
    />
  );
}
