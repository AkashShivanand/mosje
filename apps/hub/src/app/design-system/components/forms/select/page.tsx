import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { SelectPlayground } from "./select-playground";

export const metadata: Metadata = {
  title: "Select — Design System",
  description:
    "A native select element with a custom chevron, so the platform's own option list and keyboard behaviour are kept intact. Two appearances: the full form control and the compact dashboard filter.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "Label bound by Form Field; `options` render real `<option>` elements, so the list is the platform's own.",
    description:
      "Wrap the control in Form Field so the label is associated through `htmlFor`/`id`. A placeholder option is not a label.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "A native `<select>` — type-ahead, arrow keys and the mobile picker are the platform's, not ours.",
    description:
      "Because it is a real `<select>`, arrow keys, typeahead and the platform's own option list all work without being re-implemented.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    status: "verified",
    evidence:
      "A solid 3px outline in `--sa-color-action-primary-default` at a 2px offset, measured 4.64:1 on white 2026-09-03. An outline rather than a box-shadow, so it survives Windows High Contrast Mode.",
    description: "The focus ring is drawn on the control itself, not on the chevron wrapper.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "The `field` appearance is 44px at `md` and 40px at the smallest. The `filter` appearance is 40px, sized for a toolbar and still past the 24px AA floor.",
    description:
      "The `field` appearance is 44px tall and the `filter` appearance 40px, both past the 24×24 minimum.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    evidence:
      "`status=\"error\"` sets `aria-invalid`; the message and its words come from Form Field.",
    description:
      "`invalid` sets `aria-invalid`; Form Field links the message with `aria-describedby` and `role=\"alert\"`.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "Native role and value. There is deliberately no read-only select: HTML has none, and faking it with `disabled` would remove the control from the tab order and from the submitted form.",
    description:
      "Role, value and expanded state are native, including on a screen reader driving the platform's own picker on a phone.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    status: "verified",
    evidence:
      "Persistent visible label; the placeholder option is `disabled` so it cannot be submitted as a value.",
    description:
      "The control degrades to the operating system's native picker on low-end devices, which is the behaviour government services are expected to keep.",
  },
];

export default function SelectPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Select"
      status="Stable"
      summary="A dropdown built on the native select element, with a custom chevron layered over it for visual consistency. Keeping the native control preserves the platform's own option list, its typeahead and its keyboard behaviour on every device."
      figma={{ node: "select" }}
      specimen={<SelectPlayground />}
      propsFrom="SelectProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The reader chooses exactly one value from a published list of roughly six to fifteen options — a state, a district, a document type.",
          "The list is long enough that a Radio group would dominate the form.",
          "A dashboard header needs a compact filter, which is the `filter` appearance of this same control.",
        ],
        avoid: [
          "There are fewer than about six options and the choice matters — use a Radio group, which shows every option without a click.",
          "The reader may choose more than one — use Checkbox, one per option.",
          "The list runs to hundreds of entries and needs typing to narrow — use Search with suggestions.",
          "The choice takes effect immediately as a setting — use Toggle, which reads as a switch.",
        ],
      }}
      related={[
        {
          label: "Radio",
          href: "/design-system/components/forms/radio",
          reason: "when the options are few and all worth showing",
        },
        {
          label: "Search",
          href: "/design-system/components/forms/search",
          reason: "when the list is long enough to need typing",
        },
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "the label, hint and error wiring this control expects",
        },
        {
          label: "Filter Bar",
          href: "/design-system/components/dashboard/filter-bar",
          reason: "where the compact filter appearance belongs",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-native">
          <h2 id="cdp-native" className="cdp__h2">
            Native by Design
          </h2>
          <Callout type="tip" title="Native by Design">
            The estate uses the native <code>&lt;select&gt;</code> rather than a custom dropdown
            widget. It is the most reliable, accessible and familiar pattern across devices —
            especially on government services reached from low-end phones. Reach for a custom combobox
            only where search-as-you-type or multiple selection is genuinely required.
          </Callout>
          <p>
            The two appearances exist because a dashboard header and a form ask for different
            densities. <code>field</code> is 44px with the form border; <code>filter</code> is 40px
            with a hairline border and a smaller label, matching the filter chips beside it. The
            underlying element is identical, so nothing about the accessibility differs between them.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { FormField, Select } from "@mosje/design-system";

<FormField label="Document Type" required>
  {(control) => (
    <Select
      {...control}
      placeholder="Choose a document"
      options={[
        { label: "Aadhaar Card", value: "aadhaar" },
        { label: "PAN Card", value: "pan" },
        { label: "Passport", value: "passport" },
        { label: "Voter ID", value: "voter_id", disabled: true },
      ]}
    />
  )}
</FormField>`}</CodeBlock>
          <p>
            Pass <code>&lt;option&gt;</code> children instead where the options need grouping under{" "}
            <code>&lt;optgroup&gt;</code>, which the <code>options</code> array does not model.
          </p>
          <CodeBlock>{`<Select appearance="filter" aria-label="Financial Year" value={year} onChange={onYear}>
  <optgroup label="Current">
    <option value="2025-26">2025-26</option>
  </optgroup>
  <optgroup label="Closed">
    <option value="2024-25">2024-25</option>
    <option value="2023-24">2023-24</option>
  </optgroup>
</Select>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <ul>
            <li>
              <strong>Tab</strong> — move to the control. It is one tab stop.
            </li>
            <li>
              <strong>Up and Down</strong> — move through the options, on every platform.
            </li>
            <li>
              <strong>Typing a letter</strong> — jump to the next option starting with it. This is the
              behaviour a custom dropdown almost always loses.
            </li>
          </ul>
          <p>
            A <code>filter</code> appearance used outside a Form Field still needs a name. Give it an{" "}
            <code>aria-label</code>, or a visible Label bound with <code>htmlFor</code> — a chevron and
            a value are not a question.
          </p>
        </section>
      }
    />
  );
}
