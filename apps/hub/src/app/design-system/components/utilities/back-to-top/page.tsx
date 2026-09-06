import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { BackToTopPlayground } from "./back-to-top-playground";

export const metadata: Metadata = {
  title: "Back to Top — Design System",
  description:
    "The control that returns a reader to the top of a long page. It sits at the top of the corner rail and moves focus as well as the scroll position.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      'It is a real <button> with an aria-label ("Back to top"); the arrow glyph carries aria-hidden. Read from the accessibility tree.',
    description: "A named button, not a decorated link or a div with a handler.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "It binds --sa-control-height-lg (3rem = 48px) on both axes. Measured with getBoundingClientRect on this page: exactly 48×48, at bottom 32px and right 32px, carrying data-sa-corner-occupant.",
    description: "48×48 — comfortably past the 24×24 minimum, for a control used on a phone.",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    status: "verified",
    evidence:
      "Read from the source: the media query is evaluated at the moment of each press rather than captured at mount, so a reader who changes the setting mid-session gets the new answer on the next press. Not exercised in this pass — smooth scrolling does not animate in the automation pane, so the two branches are indistinguishable there.",
    description: "A reader who has asked for less motion gets an instant jump rather than a smooth scroll.",
  },
];

export default function BackToTopPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Back to Top"
      status="Stable"
      summary="The control that returns a reader to the top of a long page. It sits at the top of the corner rail because it comes and goes, and it moves focus as well as the scroll position."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={<BackToTopPlayground />}
      propsFrom="BackToTopProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A page can grow past a few screens — an MIS report, a long register, a document catalogue.",
          "The controls a reader needs again — filters, a search field — live at the top.",
        ],
        avoid: [
          "The page is short. A control that does nothing is a control in the way, which is why this one renders nothing below its threshold.",
          "The page already has a sticky header carrying the controls the reader would scroll back for.",
          "There are already three occupants in the corner. The rail is a stack, and a fourth needs a breakpoint decision first.",
        ],
      }}
      related={[
        { label: "Accessibility Bar", href: "/design-system/components/utilities/accessibility-bar", reason: "the statutory control that anchors the same corner" },
        { label: "Chatbot", href: "/design-system/components/feedback/chatbot", reason: "the other corner occupant, which sits between the two" },
        { label: "Pagination", href: "/design-system/components/navigation/pagination", reason: "the better answer when the length is a list rather than a page" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-stack">
            <h2 id="cdp-stack" className="cdp__h2">Why It Sits at the Top of the Stack</h2>
            <p>
              The corner rail orders by <strong>permanence</strong>, not importance. The
              accessibility widget anchors the corner because it is statutory and never goes away;
              the chat launcher sits above it; and this — which appears and disappears as the reader
              scrolls — sits above both.
            </p>
            <p>
              Put it at the bottom and the two controls that most need to be findable by muscle
              memory slide up and down the page on every scroll. The rule is in{" "}
              <code>.claude/rules/floating-element-placement.md</code>, and this component is the
              case it was written anticipating.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-focus">
            <h2 id="cdp-focus" className="cdp__h2">It Moves Focus, Not Just the Page</h2>
            <p>
              Scrolling to the top leaves a keyboard reader&apos;s focus where it was, half a page
              down — so the next Tab takes them straight back and the button appears to have done
              nothing at all. This moves focus to the page&apos;s <code>main</code> landmark as
              well, adding a temporary <code>tabindex</code> only if the element does not already
              carry one, and removing it again.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-243">
            <h2 id="cdp-243" className="cdp__h2">Why 2.4.3 Is Not on the Checklist</h2>
            <p>
              It ought to be. Activating this control focuses the page&apos;s <code>main</code>{" "}
              landmark as well as scrolling, and that is exactly what WCAG 2.4.3 is about — but the
              move could not be <em>measured</em> in this pass, so it is not ticked. The automation
              pane runs unfocused, and in an unfocused document <code>focus()</code> does not take
              and smooth scrolling does not animate.
            </p>
            <p>
              What was observed: <code>main</code> carries no leftover <code>tabindex</code> after a
              press, so the temporary attribute is added and removed as intended. The focus move
              itself needs a real browser session, and the checklist says nothing rather than
              claiming it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-absent">
            <h2 id="cdp-absent" className="cdp__h2">Absent Until It Is Useful</h2>
            <p>
              Below <code>showAfter</code> the component renders <em>nothing</em> — not a hidden
              element, not a faded one. A control that cannot do anything is a control in the way,
              and on a phone the corner is expensive: three occupants plus the inset already take
              268px of the right edge.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`import { BackToTop } from "@mosje/design-system";

// Mount once per page, beside the other corner occupants.
<BackToTop />

// A page that is long but not enormous can raise the threshold.
<BackToTop showAfter={1600} />`}</CodeBlock>
          <p>
            It carries <code>data-sa-corner-occupant</code>, which is how the rail knows it is
            there, and reads its offset from <code>--sa-corner-rail-bottom</code> rather than
            hard-coding one. Both are added <em>with</em> the control rather than after somebody
            reports an overlap.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-motion">
          <h2 id="cdp-motion" className="cdp__h2">Motion Is Asked About at the Moment of the Press</h2>
          <p>
            <code>prefers-reduced-motion</code> is read when the button is activated rather than
            captured once at mount. A reader who changes the setting mid-session — which is exactly
            what someone does when a page starts making them unwell — gets the new answer on the
            very next press.
          </p>
        </section>
      }
    />
  );
}
