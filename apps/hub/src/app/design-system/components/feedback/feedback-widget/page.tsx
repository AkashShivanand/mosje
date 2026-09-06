import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { FeedbackPlayground } from "./feedback-playground";

export const metadata: Metadata = {
  title: "Feedback Widget — Design System",
  description:
    "“Was this page useful?” — the page-level feedback control GIGW expects, in three states: the question, the comment, and the acknowledgement.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "The question is a <legend> inside a <fieldset> holding the two verdict buttons, and the comment box has a real <label for> plus aria-describedby pointing at the personal-information warning. Read from the rendered DOM on this page.",
    description: "The question owns its two answers, and the warning is attached to the field it governs.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "Each verdict button carries aria-pressed reflecting whether it is the chosen answer. Read from the DOM after pressing Yes: aria-pressed=true on Yes and false on No.",
    description: "The chosen answer is reported as a state, not only as a fill.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      'The acknowledgement renders in a <p role="status">, so it is announced when it replaces the control. Read from the DOM after sending.',
    description:
      "A reader who cannot see the layout change is told the response was recorded.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    status: "verified",
    evidence:
      "Answering moves focus into the comment box, which did not exist a moment earlier. Verified in the browser: after pressing Yes, document.activeElement is the textarea.",
    description:
      "Focus follows the field that appears, so a keyboard reader is not left to discover it further down.",
  },
];

export default function FeedbackWidgetPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Feedback Widget"
      status="Stable"
      summary="“Was this page useful?” in three states: the question, the comment, and the acknowledgement. The comment box appears only after a verdict, so the useful signal is captured even when nobody types."
      figma={{
        absent:
          "A master exists and is a DIFFERENT PRODUCT. The library's Feedback Widget page carries a modal with a five-point emoji rating; this component is a Yes/No verdict with an optional comment, which is what GIGW asks for. Which one the estate ships is a decision, not a drawing task.",
      }}
      specimen={<FeedbackPlayground />}
      propsFrom="FeedbackWidgetProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A content page needs the page-level feedback control GIGW expects.",
          "The department wants to know which pages fail readers, at the scale of a count rather than a conversation.",
        ],
        avoid: [
          "The reader needs an answer — that is a grievance or a contact form, and it must be a route that replies.",
          "The question is about the whole service rather than this page. Nobody can answer “how are we doing” from a page about hostel grants.",
          "There is nowhere to send the reader who needed help. Then fix that first: this widget without `helpHref` collects grievances nobody will answer.",
        ],
      }}
      related={[
        { label: "Form Field", href: "/design-system/components/forms/form-field", reason: "for a real contact or grievance form" },
        { label: "Alert", href: "/design-system/components/feedback/alert", reason: "for telling the reader something rather than asking" },
        { label: "Toast", href: "/design-system/components/feedback/toast", reason: "for a transient acknowledgement elsewhere on the page" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-two-steps">
            <h2 id="cdp-two-steps" className="cdp__h2">The Verdict First, Then the Comment</h2>
            <p>
              Asking for a verdict and a paragraph at once gets neither. Most readers will answer a
              two-button question in passing and will not open a text field, so taking the click
              first means the useful signal is captured even when nobody types. Everything after
              that is a bonus.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-not-contact">
            <h2 id="cdp-not-contact" className="cdp__h2">It Is Not a Contact Form</h2>
            <p>
              A feedback box on a page with no visible way to reach the department becomes where
              grievances are filed — and a grievance filed into an analytics endpoint is never
              answered. That is worse than having no box.
            </p>
            <p>
              <code>helpHref</code> is how this is prevented: the reader who wanted help is offered
              a route that will reply, in the same breath as the question. Supply it on every page.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-pii">
            <h2 id="cdp-pii" className="cdp__h2">Say Not to Type Personal Information</h2>
            <p>
              A free-text box on a government page collects Aadhaar numbers, bank details and
              telephone numbers unless it says not to — people reasonably assume a box on a
              departmental page is a way of reaching the department. The warning is not optional
              decoration; it is what keeps this endpoint out of scope for personal data.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-honest">
            <h2 id="cdp-honest" className="cdp__h2">Acknowledge Honestly</h2>
            <p>
              &ldquo;We read every response&rdquo; is a promise. Where it is not true, say what is:
              &ldquo;Responses are counted but not read individually, and the department cannot reply
              here.&rdquo; A citizen who believes they have written to the department and hears
              nothing has been misled by the interface.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`import { FeedbackWidget } from "@mosje/design-system";

<FeedbackWidget
  onSubmit={async ({ verdict, comment }) => {
    await recordPageFeedback({ path, verdict, comment });
  }}
  helpHref="/website/contact"
/>`}</CodeBlock>
          <p>
            Returning a promise from <code>onSubmit</code> keeps the button in its sending state
            until it settles, so the reader is not left pressing Send twice.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-focus">
          <h2 id="cdp-focus" className="cdp__h2">Focus Follows the Field That Appears</h2>
          <p>
            Answering reveals a comment box that did not exist a moment earlier, and focus moves
            into it. Without that, a keyboard reader presses Yes, hears nothing, and has to Tab
            forward hoping something appeared. The acknowledgement is likewise a live region, so
            replacing the control with a sentence is announced rather than merely drawn.
          </p>
        </section>
      }
    />
  );
}
