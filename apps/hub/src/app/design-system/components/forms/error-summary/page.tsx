import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { ErrorSummarySpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Error Summary — Design System",
  description:
    "The list at the top of a form that failed validation, naming every problem in field order and linking each one to its control.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    evidence:
      "Every failure is named in text, in field order, and each entry links to the control it belongs to. Verified in a browser 2026-09-02: pressing an entry moves DOM focus onto the input, not merely the page's scroll position.",
    description:
      "This is the criterion the component exists for. `FormField` satisfies it at the field; on a form longer than a screen that is not enough, because the reader who pressed Submit is at the bottom and nothing has been said to them.",
  },
  {
    criterion: "3.3.3 Error Suggestion",
    level: "AA",
    status: "verified",
    evidence: "Each message states the correction rather than the fault — “Enter the date the caste certificate was issued”.",
    description:
      "The wording is the caller's responsibility and the component cannot enforce it, so it is stated in the props table, in `design.md`, and in the story: the citizen's answer, never the validator's.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    status: "verified",
    evidence:
      "The container is `tabIndex={-1}` and takes focus when the error set changes — keyed on the set, not on every render, so correcting a field does not yank focus back.",
    description:
      "A summary that appears without taking focus is announced to nobody; one that re-takes focus on every keystroke is worse than none.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "Measured 2026-09-02: message links `#aa2f25` on the `#ffe4e0` band = 5.55:1. The left rule `#8b1f18` is 9.10:1 against the page.",
    description: "Both clear their thresholds with margin.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence: "Entries are underlined at rest, not distinguished by colour alone.",
    description:
      "They sit inside a tinted block, which is exactly where a colour-only link stops being distinguishable.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence: "Each entry is `display: inline-block` with a 24px minimum block size.",
    description: "A short message must still be a real target.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence: "`role=\"alert\"` on the container.",
    description:
      "`alert` rather than a landmark: the summary appears in response to the citizen's own submit, so it is a live message, not somewhere they navigate to.",
  },
];

export default function ErrorSummaryPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Error Summary"
      status="Stable"
      summary="The list at the top of a form that failed validation. It names every problem in the order the fields appear, links each one to its control, and takes focus when it appears — so a citizen who pressed Submit at the bottom of a long application is told what went wrong and taken there."
      figma={{ absent: "Not yet drawn in the Figma library. The pattern is the GOV.UK error summary; the code is authoritative until a counterpart exists." }}
      specimen={<ErrorSummarySpecimen />}
      propsFrom="ErrorSummaryProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Any form the citizen cannot see all of at once — which on this estate is most scheme applications.",
          "A wizard step that failed, where the fields above the fold are not the ones that broke.",
          "Any form where Submit sits below the fields it validates.",
        ],
        avoid: [
          "A single-field form — one input with one message under it does not need an index of itself.",
          "As a REPLACEMENT for per-field errors. WCAG 3.3.1 wants the failure identified at the field as well as summarised; the two are a pair.",
          "For anything that is not a validation failure — a feed being down is an `ErrorView`, not this.",
        ],
      }}
      related={[
        { label: "Form Field", href: "/design-system/components/forms/form-field", reason: "marks and announces the error at the field itself" },
        { label: "Wizard", href: "/design-system/components/forms/wizard", reason: "for a form long enough to need steps" },
        { label: "Error View", href: "/design-system/components/feedback/error-view", reason: "when the request failed rather than the input" },
      ]}
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <p>
            Pass the errors in <strong>field order</strong>. The component does not sort them — a
            summary ordered differently from the form sends the reader up and down the page.
          </p>
          <CodeBlock>{`import { ErrorSummary, FormField, Input } from "@mosje/design-system";

const errors = failures.map((f) => ({
  fieldId: f.id,                       // the CONTROL's id, not its wrapper
  message: f.message,                  // the citizen's answer, not the validator's
}));

<ErrorSummary errors={errors} />

<FormField label="Annual Household Income" id="income" error={incomeError} required>
  {(control) => <Input {...control} />}
</FormField>`}</CodeBlock>
          <p>
            <code>fieldId</code> must be the id of the <em>control</em>, because it is both the
            link target and the element that receives focus. <code>FormField</code> hands you
            exactly that id in its render prop.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-focus">
          <h2 id="cdp-focus" className="cdp__h2">
            Why Each Entry Focuses the Control
          </h2>
          <p>
            A bare <code>href=&quot;#id&quot;</code> scrolls the field into view and, in several
            browsers, leaves focus on the link. The citizen then presses Tab and lands somewhere
            unrelated. Each entry therefore calls <code>focus()</code> on the target, and keeps the
            <code> href</code> so it is still a real link for anyone who opens it another way.
          </p>
          <p>
            Focus is taken when the <strong>error set</strong> changes, not on every render.
            Re-focusing on each keystroke would pull the reader out of the field they are fixing,
            which is a worse defect than the one the summary solves.
          </p>
        </section>
      }
    />
  );
}
