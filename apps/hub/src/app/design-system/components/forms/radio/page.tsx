import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { RadioGroupSpecimen } from "./group-specimen";
import { RadioPlayground } from "./radio-playground";

export const metadata: Metadata = {
  title: "Radio — Design System",
  description:
    "A radio button for choosing exactly one option from a mutually exclusive set. Three sizes, a description, read-only, a card variant, and a group that names the question, carries the error and reveals a follow-up.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "radio.spec.tsx: the label is linked through `for`/`id` and a shared `name` binds the options; `description` joins `aria-describedby` in both variants and sits outside the `<label>`. control-group.spec.tsx: `RadioGroup` is a `<fieldset>` with a `<legend>` and `role=\"radiogroup\"`, and `hideLegend` keeps the legend in the DOM.",
    description:
      "The option's name is its label; the question's name is the legend. Neither is inferred from proximity.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "A real `<input type=\"radio\">` carries the native model: one tab stop for the group, arrow keys between options. `readOnly` refuses click, Space and the arrow keys in `readOnlyHandlers` but leaves the tab stop (radio.spec.tsx asserts no `disabled` attribute). `aria-readonly` is set on the `radiogroup`, where ARIA 1.2 permits it, never on a radio (axe aria-allowed-attr, control-group.spec.tsx).",
    description: "Nothing is re-implemented, and no `tabIndex` is added to an option.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    status: "verified",
    evidence:
      "The hidden input's `:focus-visible` draws a solid `--sa-focus-width` outline in `--sa-focus-ring` on the circle, and on the whole tile in the card variant. selection-css.test.ts asserts the `forced-colors` block draws the same ring in `Highlight`.",
    description: "An outline, not a shadow, so it survives Windows High Contrast Mode.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "verified",
    evidence:
      "The circle is a 2px edge in `--sa-border-neutral-base`, 7.16:1 on white; the selected dot is `--sa-bg-brand-primary-bolder`. In forced colours the dot and the selected edge are painted in `Highlight` (selection-css.test.ts).",
    description: "The boundary that identifies the control and the dot that identifies its state both clear 3:1.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "The native input is sized to the target ladder and centred on the circle: 24px at `sm`, 44px at `md`, 48px at `lg`. The card variant stretches the input to the tile's edges, so the whole tile is the target.",
    description: "A circle of 20px in a 44px hit area; the default control meets the minimum without its label.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    evidence:
      "control-group.spec.tsx: `RadioGroup` renders the error as a `<p role=\"alert\">` after the options, sets `aria-invalid` on the `radiogroup`, and paints every circle through each option's `invalid`.",
    description:
      "A single radio has no `error` prop on purpose: the error belongs to the question, which is the group.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "Role, checked state and value are native; radio.spec.tsx asserts no `aria-checked` is emitted. `RadioGroup` takes `role=\"radiogroup\"`, the one role on a fieldset that permits `aria-required`, `aria-invalid` and `aria-describedby` together. A radio with no `label` and no `aria-label` warns in development.",
    description: "`data-state` mirrors the value for styling; it is never what assistive technology reads.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    status: "verified",
    evidence:
      "Every option carries a persistent visible label (GIGW 5.2.45) and the group names the question (5.2.8). `required` renders the asterisk DBIM B.iv asks for. Options are laid out vertically by default, as DBIM B.xi and GuDApps 4.3.2.2 require.",
    description: "The circle is never unlabelled, and the question is never unnamed.",
  },
];

export default function RadioPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Radio"
      status="Stable"
      since="0.7.0"
      summary="A radio button for choosing exactly one option from a mutually exclusive set. It is a real native radio, so the browser handles grouping and arrow-key movement. Three sizes, a description, read-only and a card variant; Radio Group supplies the fieldset and legend that name the question, carries the hint and the error, and can reveal a follow-up beneath the selected option."
      figma={{ node: "radio" }}
      specimen={<RadioPlayground />}
      propsFrom="RadioProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The reader must select exactly one option.",
          "There are up to about six options and each one is worth showing without a click (DBIM B.xi, GuDApps 4.3.2.2).",
          "An option needs a sentence of explanation beside it, which the description carries.",
          "One option needs a follow-up field, which the group's reveal shows only when it is selected.",
        ],
        avoid: [
          "The reader may select any number of options, including none — use Checkbox.",
          "There are more than about six options — use Select or Combobox, which do not spend the whole page on the choice.",
          "The choice takes effect immediately as a setting rather than on submit — use Toggle.",
          "There are exactly two options and one is plainly the absence of the other — a single Checkbox is clearer than a Yes/No pair (GuDApps 4.3.2.3).",
        ],
      }}
      related={[
        { label: "Checkbox", href: "/design-system/components/forms/checkbox", reason: "when any number of options may be chosen" },
        { label: "Select", href: "/design-system/components/forms/select", reason: "when the list is too long to show in full" },
        { label: "Toggle", href: "/design-system/components/forms/toggle", reason: "when the change takes effect immediately" },
        { label: "Error Summary", href: "/design-system/components/forms/error-summary", reason: "linking a page-level error list to the group by its id" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy
            </h2>
            <p>
              A control cell holding the real, visually hidden input and the drawn circle, and a body holding
              the label, its required marker and an optional description. The card variant wraps both in a tile
              with an optional leading icon. A set of options sits inside Radio Group, which adds the legend,
              the hint, the error and the reveal beneath a selected option.
            </p>
            <ul>
              <li>
                <strong>Circle</strong> — 16, 20 or 24px, a 2px edge in <code>--sa-border-neutral-base</code>.
                Selected takes the brand edge and a dot of half the circle in <code>--sa-bg-brand-primary-bolder</code>.
              </li>
              <li>
                <strong>Hit area</strong> — the input itself, centred on the circle: 24, 44 or 48px.
              </li>
              <li>
                <strong>Label</strong> — Body 2; <strong>Description</strong> — Body 3, linked through{" "}
                <code>aria-describedby</code>, never part of the name.
              </li>
              <li>
                <strong>Legend</strong> — Title 3, the question. Required on a group; hide it with{" "}
                <code>hideLegend</code> if a heading already asks it.
              </li>
            </ul>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-variants">
            <h2 id="cdp-variants" className="cdp__h2">
              Radio Cards
            </h2>
            <p>
              <code>variant=&quot;card&quot;</code> renders the option as a large, tappable tile with an optional{" "}
              <code>icon</code> and a description. It is the right choice where the options are major pathways
              through a service rather than values in a field — a payment method, an application type, a mode
              of submission — and on a phone, because the whole tile is the target.
            </p>
            <p>
              It has two layouts. <code>cardLayout=&quot;compact&quot;</code>, the default, puts the control first
              with a 24px glyph and one line of description, for a short list whose names say enough.{" "}
              <code>cardLayout=&quot;detailed&quot;</code> is the scheme tile: a tinted 64px icon tile, a title, a
              fuller description, a <code>meta</code> fact to choose by such as the target group, and the
              control trailing on the right so the left edge stays with the content. Do not mix the two in
              one group.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-dodont">
            <h2 id="cdp-dodont" className="cdp__h2">
              Do and Don&apos;t
            </h2>
            <ul>
              <li>
                <strong>Do</strong> lay the options out vertically, one per line, in a logical order — most likely
                first, or simplest to most complex. Alphabetical order is rarely the right one on a form in more
                than one language (DBIM B.xi, GuDApps 4.3.2.2).
              </li>
              <li>
                <strong>Do</strong> use radios rather than a dropdown for up to six options: every option is visible
                and can be compared (DBIM B.xi).
              </li>
              <li>
                <strong>Do</strong> decide, per form, whether a default is pre-selected. DBIM asks for one where a
                most-likely answer exists; pass it as <code>defaultValue</code>. Where none exists, leave the group
                unselected and let the error say so on submit.
              </li>
              <li>
                <strong>Do</strong> offer a “None” or “Prefer not to say” option where the reader may legitimately
                choose nothing; a group that cannot be un-answered forces a wrong answer (GuDApps 4.3.2.2).
              </li>
              <li>
                <strong>Don&apos;t</strong> nest one radio set inside another. Keep every option at one level.
              </li>
              <li>
                <strong>Don&apos;t</strong> render a set without Radio Group. The options name themselves; nothing else
                names the question.
              </li>
              <li>
                <strong>Don&apos;t</strong> use a Yes/No pair for a single on/off. Where the cleared meaning is clear,
                one checkbox is the control (GuDApps 4.3.2.3).
              </li>
              <li>
                <strong>Don&apos;t</strong> give a single option a radio. A one-option radio cannot be un-selected and
                traps the reader; that is a checkbox (GuDApps p.36).
              </li>
            </ul>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-group">
            <h2 id="cdp-group" className="cdp__h2">
              Grouping — Use <code>RadioGroup</code>
            </h2>
            <p>
              A bare set of radios has no accessible name for the QUESTION it asks. A screen reader announces
              “Scheduled Caste, radio button, 1 of 4” and never says “Category of the Applicant” — the one piece
              of information that makes the four options mean anything. <code>RadioGroup</code> supplies the{" "}
              <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code> that WCAG 1.3.1 and 3.3.2 ask for, wires{" "}
              <code>hint</code> and <code>error</code> through <code>aria-describedby</code>, and reveals a follow-up
              beneath the option that needs one.
            </p>
            <RadioGroupSpecimen />
            <CodeBlock>{`import { RadioGroup, Input } from "@mosje/design-system";

<RadioGroup
  legend="Category of the Applicant"
  name="category"
  required
  hint="As recorded on the caste certificate issued by the competent authority."
  value={category}
  onChange={setCategory}
  error={submitted && !category ? "Select the applicant's category to continue" : undefined}
  options={[
    { value: "sc",  label: "Scheduled Caste" },
    { value: "st",  label: "Scheduled Tribe" },
    { value: "obc", label: "Other Backward Class",
      reveal: <Input aria-label="Sub-caste" placeholder="Sub-caste, as on the certificate" /> },
    { value: "gen", label: "General" },
  ]}
/>`}</CodeBlock>
            <Callout type="info" title="value may be undefined">
              The group never invents a selection. DBIM Annexure B.xi asks for a pre-selected default in the
              form where a most-likely answer exists; that is the form&apos;s decision, made by passing{" "}
              <code>defaultValue</code> (uncontrolled) or an initial <code>value</code>. Where no answer is more
              likely than another, leave it unselected and let <code>error</code> say so on submit.
            </Callout>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              A single option
            </h2>
            <CodeBlock>{`import { Radio } from "@mosje/design-system";

<Radio
  variant="card"
  icon={<Icon name="account_balance" />}
  name="payment_method"
  value="upi"
  checked={method === "upi"}
  onChange={(event) => setMethod(event.target.value)}
  label="UPI (Unified Payments Interface)"
  description="Pay instantly using any UPI application."
/>`}</CodeBlock>
            <p>
              A bare <code>Radio</code> is for the rare screen that builds its own fieldset. Everywhere else, pass
              the options to <code>RadioGroup</code> and let it render them — including the card variant, with{" "}
              <code>variant=&quot;card&quot;</code> on the group and an <code>icon</code> per option.
            </p>
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
              <strong>Tab</strong> — move to the group. A radio group is a single tab stop, unlike a set of
              checkboxes, and Tab leaves the group rather than moving inside it.
            </li>
            <li>
              <strong>Arrow keys</strong> — move the selection between the options. This works because the options
              share a <code>name</code>; a group whose options carry different names is broken in a way that is
              invisible with a mouse.
            </li>
            <li>
              <strong>Space</strong> — select the focused option where none is yet selected.
            </li>
          </ul>
          <p>
            A revealed follow-up is always in the DOM and hidden with <code>hidden</code>, so the option&apos;s{" "}
            <code>aria-controls</code> resolves whether it is open or not. <code>aria-expanded</code> is not set on a
            radio — ARIA 1.2 does not permit it there, which is a deliberate divergence from the GOV.UK pattern;
            the checkbox form of the same reveal does carry it.
          </p>
          <p>
            In Windows High Contrast Mode the selected dot and edge are painted in the system&apos;s{" "}
            <code>Highlight</code> colour. With <code>prefers-reduced-motion</code> every transition is removed.
          </p>
        </section>
      }
    />
  );
}
