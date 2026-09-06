import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { EditPlayground } from "./edit-playground";

export const metadata: Metadata = {
  title: "Inline Edit — Design System",
  description:
    "A recorded value corrected in place. The save is confirmed, never optimistic — on a departmental record an edit that shows before it is written is a data-integrity problem wearing a performance improvement.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      'Read from the accessibility tree on this page: a visually hidden span carries the field name while the visible word stays "Edit". The four triggers resolve to four distinct names — "Edit District", "Edit Alternate telephone", "Edit Bank branch", "Edit Beneficiary category".',
    description: "Every trigger names the value it edits.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "Driven with real key presses in a browser: Enter commits and Escape cancels, and in both cases focus lands back on the trigger that opened the field — read from document.activeElement, which resolved to \"Edit Bank branch\" after Escape and \"Edit District\" after a successful save.",
    description: "The whole cycle is operable without a pointer, and focus is returned.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    evidence:
      'On the failing specimen, a rejected save renders role="alert" reading "The change could not be saved. Try again.", the input carries aria-invalid, and the typed text is still in the field.',
    description: "A failed write is announced and nothing the reader typed is lost.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    status: "verified",
    evidence:
      "In the editing state the input has a <label> bound by htmlFor/id; the hint and the error are referenced through aria-describedby.",
    description: "The field is labelled while it is being edited, not only before.",
  },
];

export default function InlineEditPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Inline Edit"
      status="Stable"
      summary="A recorded value that can be corrected in place. The save is confirmed, never optimistic: the value on screen changes only once the write has resolved."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={<EditPlayground />}
      propsFrom="InlineEditProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A settings or record screen where most values are read and one is occasionally wrong.",
          "Opening a whole form to correct a single field is the larger cost.",
        ],
        avoid: [
          "Several values change together — that is a form, and the save should be one action.",
          "The change needs a reason recorded alongside it. A field with no room for the reason produces a record nobody can audit.",
          "The value is chosen from a list. Use a Select inside a form; an inline dropdown is a menu pretending to be a value.",
        ],
      }}
      related={[
        { label: "Description List", href: "/design-system/components/data-display/description-list", reason: "for values that are only read" },
        { label: "Input Field", href: "/design-system/components/forms/input", reason: "when the change belongs in a form" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-confirm">
            <h2 id="cdp-confirm" className="cdp__h2">Confirmed, Never Optimistic — and Not Configurable</h2>
            <p>
              An optimistic edit shows the new value the instant it is typed and reverts quietly if
              the write fails. On a departmental record that is a data-integrity problem wearing a
              performance improvement: the officer who watched the value change has no reason to
              look again, and the register still holds the old one. The displayed value changes
              only after <code>onSave</code> resolves. There is no prop to turn this off.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-keep">
            <h2 id="cdp-keep" className="cdp__h2">A Failed Write Keeps What Was Typed</h2>
            <p>
              Losing the text is the second defect after losing the write. On rejection the field
              stays open with the reader&rsquo;s value in it and says, in one sentence, that it
              could not be saved.
            </p>
            <CodeBlock>{`import { InlineEdit } from "@mosje/design-system";

<InlineEdit
  label="District"
  value={district}
  onSave={async (next) => {
    await saveDistrict(next);   // reject and the reader keeps their text
    setDistrict(next);
  }}
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-name">
            <h2 id="cdp-name" className="cdp__h2">The Trigger Names Its Field</h2>
            <p>
              &ldquo;Edit District&rdquo; to a screen reader, &ldquo;Edit&rdquo; on screen. Master
              Settings runs to seventeen sub-screens; a page of values that all offer
              &ldquo;Edit&rdquo; is a page nobody can navigate by name.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-why">
            <h2 id="cdp-why" className="cdp__h2">A Read-Only Value Says Why</h2>
            <p>
              <code>readOnlyReason</code> replaces the control with the reason. Simply not
              rendering the button leaves the reader to work out whether the value is fixed, whether
              their role is wrong, or whether the page is broken.
            </p>
          </section>
        </>
      }
    />
  );
}
