import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { CheckboxPlayground } from "./checkbox-playground";

export const metadata: Metadata = {
  title: "Checkbox — Design System",
  description:
    "A checkbox selects one or more items from a set, or turns a single option on or off. Three sizes, an error state, a description, read-only, a card variant, and a group with select-all and an exclusive option.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "checkbox.spec.tsx: the label is linked through `for`/`id`; `description` and `error` ids are joined into `aria-describedby` and a caller's own value is preserved, never overwritten. control-group.spec.tsx: a group is a `<fieldset>` with a `<legend>`, and `hideLegend` keeps the legend in the DOM.",
    description:
      "The label is the accessible name; the description is a description, not part of the name. A set answering one question goes in `CheckboxGroup`, which names the question.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "A real `<input type=\"checkbox\">` carries the native key handling; nothing is re-implemented. `readOnly` refuses Space and click in `readOnlyHandlers` but leaves the tab stop (checkbox.spec.tsx asserts no `disabled` attribute).",
    description: "Tab to reach, Space to toggle. Enter is not made to toggle: in a form, Enter submits.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    status: "verified",
    evidence:
      "The hidden input's `:focus-visible` draws a solid `--sa-focus-width` outline in `--sa-focus-ring` on the box, and on the whole tile in the card variant. selection-css.test.ts asserts the `forced-colors` block draws the same ring in `Highlight`.",
    description: "An outline, not a shadow, so it survives Windows High Contrast Mode.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "verified",
    evidence:
      "The border is `--sa-control-selection-border-width` (2px) in `--sa-border-neutral-base`, 7.16:1 on white. A 1.5px edge anti-aliased below its nominal colour at 1× density; 2px renders as drawn. In forced colours the checked fill is painted in `Highlight`, so the state does not depend on the glyph alone.",
    description: "The boundary that identifies the control, and the fill that identifies its state, both clear 3:1.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "The native input is sized to the target ladder and centred on the box: 24px at `sm`, 44px at `md`, 48px at `lg` (`--_target` in selection-control.css). The default control therefore meets the 24×24 minimum on its own, without the label, and meets UX4G's 44×44 touch recommendation.",
    description: "A box of 20px in a 44px hit area: what is drawn and what is tappable are deliberately different sizes.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    evidence:
      "checkbox.spec.tsx: `error` renders a `<p role=\"alert\">` after the control, sets `aria-invalid=\"true\"` and joins `aria-describedby`; `invalid` alone sets the state with no alert.",
    description: "The error is text, announced, and linked. Colour is the third channel.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "Role and value are native. The DOM `indeterminate` property is set in an effect, which every current engine exposes as the mixed state; checkbox.spec.tsx asserts no `aria-checked` is emitted, because ARIA in HTML prohibits it on a native checkbox. A control with no `label` and no `aria-label` warns in development.",
    description: "`data-state` mirrors the value for styling; it is never what assistive technology reads.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    status: "verified",
    evidence:
      "Every option carries a persistent visible label (GIGW 5.2.45); `required` renders the asterisk DBIM B.iv asks for and the native attribute; the legend is required on a group (GIGW 5.2.8). Placeholder text is never the label.",
    description: "Checkbox is the square-with-a-check DBIM B.xii specifies, and a consent box is never pre-checked (UX4G §7).",
  },
];

export default function CheckboxPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Checkbox"
      status="Stable"
      since="0.7.0"
      summary="A checkbox selects any number of items from a set, or turns a single option on or off. It carries the mixed state a “select all” control needs, an error state, a description, three sizes, a read-only state and a card variant; a set answering one question goes in Checkbox Group, which supplies the fieldset and legend that name the question."
      figma={{ node: "checkbox" }}
      specimen={<CheckboxPlayground />}
      propsFrom="CheckboxProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A reader may select any number of choices from a list, including none.",
          "A single option is turned on or off as part of a form the reader submits — a declaration, a consent, an opt-in.",
          "A parent controls a group of children and needs to show that only some are selected.",
          "There are exactly two options, one is plainly the absence of the other, and the cleared meaning is clear (GuDApps 4.3.2.3).",
        ],
        avoid: [
          "Exactly one option may be chosen — use a Radio Group, which enforces it.",
          "The change takes effect immediately rather than on submit — use a Toggle, which reads as a switch rather than a form field.",
          "There are more than about ten options — use a Combobox or a filtered list.",
          "The statement being agreed to is a statutory declaration — use Declaration Checkbox, so it reads as a deliberate act.",
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
        { label: "Form Field", href: "/design-system/components/forms/form-field", reason: "the label and error wiring for text fields; a checkbox carries its own" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy
            </h2>
            <p>
              A control cell holding the real, visually hidden input and the drawn box; a body holding the
              label, its required marker and an optional description; and, under both, an optional error
              message. The card variant wraps all of it in a tile with an optional leading icon.
            </p>
            <ul>
              <li>
                <strong>Box</strong> — 16, 20 or 24px (<code>--sa-control-selection-size-*</code>), a 2px edge in{" "}
                <code>--sa-border-neutral-base</code>, a 4px corner. Checked fills with{" "}
                <code>--sa-bg-brand-primary-bolder</code> and draws the mark in its <code>on</code> pairing.
              </li>
              <li>
                <strong>Hit area</strong> — the input itself, centred on the box: 24, 44 or 48px. What is drawn and
                what is tappable are different sizes on purpose.
              </li>
              <li>
                <strong>Label</strong> — Body 2, always present and always visible unless <code>hideLabel</code> keeps
                it for screen readers only.
              </li>
              <li>
                <strong>Description</strong> — Body 3 in the subtle ink, linked through <code>aria-describedby</code>.
              </li>
              <li>
                <strong>Error</strong> — Body 3, bold, in the error ink, announced with <code>role=&quot;alert&quot;</code>.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-sizes">
            <h2 id="cdp-sizes" className="cdp__h2">
              Sizes
            </h2>
            <p>
              <code>md</code> is the default and the right choice beside body text. <code>sm</code> is for a dense
              table or a filter rail, where a 24px target with 8px between targets satisfies the spacing
              exception in WCAG 2.5.8. <code>lg</code> makes the box itself 24px, which is the size to use on a
              touch-first screen and in the card variant, where the tile is the target anyway.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              States
            </h2>
            <ul>
              <li>
                <strong>Unchecked · checked · indeterminate</strong> — the three values. Indeterminate is a parent&apos;s
                mixed state; a click on it yields checked, as the native control does.
              </li>
              <li>
                <strong>Hover · active · focus</strong> — the edge takes the brand colour, a press tints the box, focus
                draws the estate&apos;s ring.
              </li>
              <li>
                <strong>Invalid</strong> — the edge takes the error colour. <code>error</code> also prints the message;{" "}
                <code>invalid</code> only paints, for a group that owns the message.
              </li>
              <li>
                <strong>Read-only</strong> — keeps its tab stop, its value and its ink; refuses the change and loses the
                pointer cursor. It is not disabled, and it does not look disabled.
              </li>
              <li>
                <strong>Disabled</strong> — leaves the tab order and the submitted form. Painted in the disabled tokens,
                not with an opacity.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-dodont">
            <h2 id="cdp-dodont" className="cdp__h2">
              Do and Don&apos;t
            </h2>
            <ul>
              <li>
                <strong>Do</strong> word the label as the positive, active statement the reader is agreeing to —
                &ldquo;Send updates by SMS&rdquo;, not &ldquo;Do not send updates&rdquo; (GuDApps 4.3.2.3).
              </li>
              <li>
                <strong>Do</strong> lay a list out vertically, one option per line (DBIM B.v, GuDApps 4.3.2.2).
                Horizontal is for two or three short options only.
              </li>
              <li>
                <strong>Do</strong> put a set of boxes answering one question in <code>CheckboxGroup</code>, and give
                a long set a <code>selectAll</code> parent.
              </li>
              <li>
                <strong>Do</strong> write the error as the problem and the remedy — &ldquo;Select at least one
                document, or None of These&rdquo; (UX4G §7).
              </li>
              <li>
                <strong>Don&apos;t</strong> pre-check a consent, a declaration or an opt-in. UX4G §7 prohibits it, and
                a citizen who did not act did not agree.
              </li>
              <li>
                <strong>Don&apos;t</strong> use <code>disabled</code> to show a value that cannot be changed. That is{" "}
                <code>readOnly</code>; disabled takes the value out of the form.
              </li>
              <li>
                <strong>Don&apos;t</strong> put the description inside the label, and don&apos;t use the label to hold
                a paragraph. A screen reader reads the label as the option&apos;s name.
              </li>
              <li>
                <strong>Don&apos;t</strong> render a checkbox with no label and no <code>aria-label</code>. It warns in
                development, and it fails WCAG 4.1.2 in production.
              </li>
            </ul>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <CodeBlock>{`import { Checkbox } from "@mosje/design-system";

// Controlled
const [agreed, setAgreed] = React.useState(false);
<Checkbox
  label="I have read the scheme guidelines"
  description="The guidelines open in a new tab."
  checked={agreed}
  onCheckedChange={setAgreed}
  error={submitted && !agreed ? "Confirm you have read the guidelines to continue" : undefined}
/>

// Uncontrolled — a plain form posts it
<form>
  <Checkbox name="sms" value="yes" label="Send updates by SMS" defaultChecked />
</form>`}</CodeBlock>
            <p>
              A “select all” parent reads its own state from the children rather than storing a third value —
              checked when every child is selected, indeterminate when only some are. <code>CheckboxGroup</code>{" "}
              does this for you with <code>selectAll</code>.
            </p>
            <CodeBlock>{`const all = items.every((i) => i.selected);
const some = items.some((i) => i.selected);

<Checkbox
  label="Select all districts"
  checked={all}
  indeterminate={!all && some}
  onCheckedChange={selectAll}
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-group">
            <h2 id="cdp-group" className="cdp__h2">
              Grouping — Use <code>CheckboxGroup</code>
            </h2>
            <p>
              A lone <code>Checkbox</code> is right for a single declaration. The moment there are several answering
              one question, the question itself needs an accessible name, and only{" "}
              <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code> provides it. <code>CheckboxGroup</code> holds
              an array value, never mutates it, emits the selection in <strong>option order rather than click
              order</strong>, posts <code>name</code> on every box so a native form carries the selection, and adds
              what a long list needs: a <code>selectAll</code> parent, an <code>exclusive</code> “none of the
              above” after an “or” divider, and a <code>reveal</code> beneath an option that needs a follow-up.
            </p>
            <CodeBlock>{`import { CheckboxGroup } from "@mosje/design-system";

<CheckboxGroup
  legend="Documents Enclosed"
  name="documents"
  required
  hint="Tick every document attached to this application."
  selectAll="Select all documents"
  value={docs}
  onChange={setDocs}
  error={submitted && !docs.length ? "Select the documents enclosed, or None of These" : undefined}
  options={[
    { value: "caste",   label: "Caste certificate" },
    { value: "income",  label: "Income certificate",
      reveal: <Input aria-label="Certificate number" placeholder="Certificate number" /> },
    { value: "aadhaar", label: "Aadhaar card" },
    { value: "none",    label: "None of these", exclusive: true },
  ]}
/>`}</CodeBlock>
            <Callout type="info" title="A checkbox group has no ARIA host for “required”">
              A <code>&lt;fieldset&gt;</code> is role <code>group</code>, which does not permit{" "}
              <code>aria-required</code> or <code>aria-invalid</code>. So <code>CheckboxGroup</code> renders the
              asterisk and a visually hidden “(required)” in the legend, and puts <code>aria-invalid</code> on each
              box. <code>RadioGroup</code> is different: it takes <code>role=&quot;radiogroup&quot;</code>, which
              permits all three.
            </Callout>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-card">
            <h2 id="cdp-card" className="cdp__h2">
              Card variant
            </h2>
            <p>
              <code>variant=&quot;card&quot;</code> renders the option as a tile with room for an <code>icon</code> and a
              description, and the whole tile is the target; <code>cardLayout=&quot;detailed&quot;</code> adds the
              icon tile, a <code>meta</code> line and moves the control to the trailing edge, for a scheme
              checklist; the specimen above shows it on a group. Use it where the options are pathways through a
              service — the schemes an applicant is claiming under — rather than values in a field.
            </p>
            <CodeBlock>{`<Checkbox
  variant="card"
  icon={<Icon name="apartment" />}
  label="Hostel Accommodation"
  description="Apply through the institution, not directly."
  checked={claims.includes("hostel")}
  onCheckedChange={(on) => toggle("hostel", on)}
/>`}</CodeBlock>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <ul>
            <li>
              <strong>Tab</strong> — move to the checkbox. It is a single tab stop; a group of checkboxes is a group
              of stops, unlike a radio group.
            </li>
            <li>
              <strong>Space</strong> — toggle. Enter does not toggle a checkbox, and must not be made to: in a form,
              Enter submits.
            </li>
          </ul>
          <p>
            The indeterminate state is visual on the box and programmatic through the DOM{" "}
            <code>indeterminate</code> property, which every current browser exposes to assistive technology as
            “mixed”. No <code>aria-checked</code> is set: ARIA in HTML prohibits it on a native checkbox, and the
            attribute the previous version carried existed only to drive a stylesheet selector, which now reads{" "}
            <code>data-state</code> instead.
          </p>
          <p>
            In Windows High Contrast Mode the checked fill is painted in the system&apos;s <code>Highlight</code>{" "}
            colour and the focus ring in the same, so the state never depends on the glyph alone. With{" "}
            <code>prefers-reduced-motion</code> every transition is removed.
          </p>
        </section>
      }
    />
  );
}
